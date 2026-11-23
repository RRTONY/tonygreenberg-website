import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { reportPrompts } from "@/lib/content/aqueous/report-prompt";

// Writes a member's personalized AWI report with Claude and streams it to /aqueous/report/<id> as
// plain text while it's written, then saves it (aqueous_reports). Ported from the Aqueous Manus
// app's generateReportAsync (server/routers.ts), same system prompt and user message, which ran
// Manus's built-in model in the background while the page polled. Here the page reads the stream
// instead, since a Netlify function can't keep running after its response. Anthropic Messages API
// over fetch (no SDK, ANTHROPIC_API_KEY), the site's fast model, as the bottle scanners use.
// Only the report's owner can start it; a finished report is returned as saved, never re-written.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-5-5";
const MAX_TOKENS = 3000;
/** A report stuck "generating" this long (closed tab, timed-out function) may be started again. */
const STALE_MS = 2 * 60 * 1000;

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : undefined);

export async function POST(_request: NextRequest, ctx: RouteContext<"/api/aqueous/reports/[id]/generate">) {
  const { id: rawId } = await ctx.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ message: "Report not found" }, { status: 404 });
  if (!isServiceRoleConfigured()) return NextResponse.json({ message: "Reports are unavailable right now." }, { status: 503 });
  const user = await getUser();
  if (!user) return NextResponse.json({ message: "Please sign in first." }, { status: 401 });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ message: "Reports are unavailable right now." }, { status: 503 });

  const db = createServiceRoleClient();
  const { data } = await db
    .from("aqueous_reports")
    .select("id, status, report_content, water_profile, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return NextResponse.json({ message: "Report not found" }, { status: 404 });
  const report = data as { id: number; status: string; report_content: string | null; water_profile: Record<string, unknown> | null; updated_at: string };

  if (report.status === "complete" && report.report_content) {
    return new Response(report.report_content, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  if (report.status === "generating" && Date.now() - new Date(report.updated_at).getTime() < STALE_MS) {
    return NextResponse.json({ message: "Your report is already being written." }, { status: 409 });
  }

  // Claim the report for this run (only if no other run claimed it in the meantime).
  const { data: claimed } = await db
    .from("aqueous_reports")
    .update({ status: "generating", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("updated_at", report.updated_at)
    .select("id");
  if (!claimed || claimed.length === 0) return NextResponse.json({ message: "Your report is already being written." }, { status: 409 });

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const userName = (typeof meta.full_name === "string" && meta.full_name.trim()) || "Water Guardian";
  const wp = report.water_profile ?? {};
  const prompts = reportPrompts(userName.slice(0, 80), { quality: num(wp.quality), purity: num(wp.purity), resonance: num(wp.resonance) });

  const finish = async (content: string, status: "complete" | "failed") => {
    await db
      .from("aqueous_reports")
      .update({ report_content: content.slice(0, 60000), status, updated_at: new Date().toISOString() })
      .eq("id", id);
  };

  let upstream: Response;
  try {
    upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        stream: true,
        system: prompts.system,
        messages: [{ role: "user", content: prompts.user }],
      }),
    });
  } catch (err) {
    console.error("[aqueous report]", err instanceof Error ? err.message : err);
    await finish("Report generation encountered an error. Please contact support.", "failed");
    return NextResponse.json({ message: "The report couldn't be written just now. Please try again." }, { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    console.error("[aqueous report] Anthropic returned", upstream.status);
    await finish("Report generation encountered an error. Please contact support.", "failed");
    return NextResponse.json({ message: "The report couldn't be written just now. Please try again." }, { status: 502 });
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let full = "";
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          await finish(full || "Report generation failed.", full ? "complete" : "failed");
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          let event: { type?: string; delta?: { type?: string; text?: string } };
          try {
            event = JSON.parse(line.slice(5).trim());
          } catch {
            continue;
          }
          if (event.type === "content_block_delta" && event.delta?.type === "text_delta" && event.delta.text) {
            full += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("[aqueous report] stream:", err instanceof Error ? err.message : err);
        await finish(full || "Report generation encountered an error. Please contact support.", full ? "complete" : "failed");
        controller.close();
      }
    },
    async cancel() {
      // The reader left the page: keep what was written so far only if it's whole; else let them retry.
      await reader.cancel().catch(() => {});
      await finish(full || "Report generation was interrupted.", "failed");
    },
  });

  return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}
