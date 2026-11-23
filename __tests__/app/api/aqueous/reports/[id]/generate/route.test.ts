import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/aqueous/reports/[id]/generate/route";
import { getUser } from "@/lib/auth";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";

vi.mock("@/lib/auth", () => ({ getUser: vi.fn() }));

// A table-aware fake database: each from(table) records its calls, `respond` answers it.
type Result = { data?: unknown; error?: { message: string } | null };
type Query = { table: string; ops: { name: string; args: unknown[] }[]; end?: string };
const METHODS = ["select", "update", "eq"];
let respond: (q: Query) => Result | undefined = () => undefined;
let queries: Query[] = [];
function makeDb() {
  const from = vi.fn((table: string) => {
    const q: Query = { table, ops: [] };
    const run = (end: string) => {
      q.end = end;
      queries.push(q);
      return { data: null, error: null, ...(respond(q) ?? {}) };
    };
    const chain: Record<string, unknown> = {};
    for (const m of METHODS) {
      chain[m] = vi.fn((...args: unknown[]) => {
        q.ops.push({ name: m, args });
        return chain;
      });
    }
    chain.maybeSingle = vi.fn(async () => run("maybeSingle"));
    chain.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
      Promise.resolve()
        .then(() => run("then"))
        .then(resolve, reject);
    return chain;
  });
  return { from };
}
const has = (q: Query, name: string, ...want: unknown[]) =>
  q.ops.some((o) => o.name === name && want.every((w, i) => JSON.stringify(o.args[i]) === JSON.stringify(w)));
/** The final saves (update with report_content). */
const saves = () =>
  queries
    .filter((q) => has(q, "update") && "report_content" in (q.ops.find((o) => o.name === "update")!.args[0] as object))
    .map((q) => q.ops.find((o) => o.name === "update")!.args[0] as { report_content: string; status: string });

const USER = { id: "9b2f4a1e-1111-4222-8333-444455556666", email: "me@example.com", user_metadata: { full_name: "  Mia Rivers " } };
const UPDATED = "2026-11-24T00:00:00.000Z";
type Report = { id: number; status: string; report_content: string | null; water_profile: Record<string, unknown> | null; updated_at: string };
const pending: Report = { id: 5, status: "pending", report_content: null, water_profile: { quality: 140, purity: 35.4, resonance: "x" }, updated_at: UPDATED };

function reportWorld(report: Report | null, claimed: unknown = [{ id: 5 }]) {
  respond = (q) => {
    if (q.end === "maybeSingle") return { data: report };
    if (has(q, "update") && has(q, "select")) return { data: claimed };
    return undefined;
  };
}

const call = (id: string) =>
  POST(new NextRequest(`http://localhost/api/aqueous/reports/${id}/generate`, { method: "POST" }), { params: Promise.resolve({ id }) } as never);

const sse = (events: unknown[]) => events.map((e) => `event: x\ndata: ${typeof e === "string" ? e : JSON.stringify(e)}\n\n`).join("");
const delta = (text: string) => ({ type: "content_block_delta", index: 0, delta: { type: "text_delta", text } });

/** An upstream body that hands out the given chunks one read at a time (then ends, or errors). */
function upstream(chunks: string[], { fail }: { fail?: boolean } = {}) {
  const enc = new TextEncoder();
  let i = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (i < chunks.length) controller.enqueue(enc.encode(chunks[i++]));
      else if (fail) controller.error(new Error("socket hang up"));
      else controller.close();
    },
  });
}

beforeEach(() => {
  queries = [];
  respond = () => undefined;
  vi.mocked(createServiceRoleClient).mockReturnValue(makeDb() as never);
  vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
  vi.mocked(getUser).mockResolvedValue(USER as never);
  vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test");
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.unstubAllEnvs());

describe("POST /api/aqueous/reports/[id]/generate", () => {
  it("is 404 for an id that isn't a positive whole number", async () => {
    for (const id of ["abc", "0", "-1", "1.5"]) {
      const res = await call(id);
      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ message: "Report not found" });
    }
    expect(getUser).not.toHaveBeenCalled();
  });

  it("is 503 without the database or the Anthropic key", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect((await call("5")).status).toBe(503);
    vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    expect((await call("5")).status).toBe(503);
    expect(queries).toHaveLength(0);
  });

  it("is 401 when signed out", async () => {
    vi.mocked(getUser).mockResolvedValue(null);
    const res = await call("5");
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ message: "Please sign in first." });
  });

  it("is 404 for someone else's report", async () => {
    reportWorld(null);
    expect((await call("5")).status).toBe(404);
    const q = queries[0];
    expect(q.table).toBe("aqueous_reports");
    expect(has(q, "eq", "id", 5)).toBe(true);
    expect(has(q, "eq", "user_id", USER.id)).toBe(true);
  });

  it("returns a finished report as saved, without writing it again", async () => {
    vi.stubGlobal("fetch", vi.fn());
    reportWorld({ ...pending, status: "complete", report_content: "# Your Personalized AWI Report" });
    const res = await call("5");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toBe("# Your Personalized AWI Report");
    expect(fetch).not.toHaveBeenCalled();
    expect(queries.some((q) => has(q, "update"))).toBe(false);
  });

  it("is 409 while another run is still writing it", async () => {
    vi.stubGlobal("fetch", vi.fn());
    reportWorld({ ...pending, status: "generating", updated_at: new Date(Date.now() - 30_000).toISOString() });
    const res = await call("5");
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ message: "Your report is already being written." });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("is 409 when another run claims it first", async () => {
    vi.stubGlobal("fetch", vi.fn());
    reportWorld(pending, []);
    expect((await call("5")).status).toBe(409);
    const claim = queries.find((q) => has(q, "update"))!;
    expect(has(claim, "eq", "updated_at", UPDATED)).toBe(true);
    reportWorld(pending, null);
    expect((await call("5")).status).toBe(409);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("marks the report failed and is 502 when Anthropic errors or can't be reached", async () => {
    reportWorld(pending);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("overloaded", { status: 529 })));
    const res = await call("5");
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ message: "The report couldn't be written just now. Please try again." });
    expect(saves()).toEqual([
      expect.objectContaining({ report_content: "Report generation encountered an error. Please contact support.", status: "failed" }),
    ]);

    queries = [];
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new Error("ECONNRESET"))));
    expect((await call("5")).status).toBe(502);
    expect(saves()).toEqual([expect.objectContaining({ status: "failed" })]);
    expect(console.error).toHaveBeenCalledWith("[aqueous report]", "ECONNRESET");
  });

  it("streams the report as it's written and saves it complete", async () => {
    // A stale "generating" run (older than 2 minutes) may be started again.
    reportWorld({ ...pending, status: "generating", updated_at: new Date(Date.now() - 5 * 60_000).toISOString() });
    const body = sse([
      { type: "message_start", message: { id: "msg_1" } },
      delta("# Your Personalized "),
      { type: "content_block_delta", index: 0, delta: { type: "input_json_delta", partial_json: "{}" } },
      "not json",
      delta("AWI Report\n\nHello Mia."),
      { type: "message_stop" },
    ]);
    // Split mid-line so the route has to buffer partial lines across reads.
    const cut = body.indexOf("AWI Report") - 3;
    const fetchMock = vi.fn(async () => new Response(upstream([body.slice(0, cut), body.slice(cut)]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await call("5");
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.text()).toBe("# Your Personalized AWI Report\n\nHello Mia.");
    expect(saves()).toEqual([
      expect.objectContaining({ report_content: "# Your Personalized AWI Report\n\nHello Mia.", status: "complete" }),
    ]);

    const claim = queries.find((q) => has(q, "update") && has(q, "select"))!;
    expect(claim.ops.find((o) => o.name === "update")!.args[0]).toMatchObject({ status: "generating" });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect(init.headers).toMatchObject({ "x-api-key": "sk-ant-test", "anthropic-version": "2023-06-01" });
    const sent = JSON.parse(init.body as string);
    expect(sent).toMatchObject({ model: "claude-haiku-5-5", max_tokens: 3000, stream: true });
    // The member's trimmed name; quality clamped to 100, purity rounded, a non-number resonance falls back to 25.
    expect(sent.system).toContain('for a user named "Mia Rivers"');
    expect(sent.messages).toEqual([
      { role: "user", content: "Generate my personalized AWI report. My name is Mia Rivers. My weights: Quality 100%, Purity 35%, Resonance 25%." },
    ]);
  });

  it("calls a member with no name a Water Guardian and uses the default weights", async () => {
    vi.mocked(getUser).mockResolvedValue({ id: USER.id, email: null } as never);
    reportWorld({ ...pending, water_profile: null });
    const fetchMock = vi.fn(async () => new Response(upstream([sse([delta("Hi")])])));
    vi.stubGlobal("fetch", fetchMock);
    await (await call("5")).text();
    const sent = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(sent.messages[0].content).toBe(
      "Generate my personalized AWI report. My name is Water Guardian. My weights: Quality 40%, Purity 35%, Resonance 25%.",
    );
  });

  it("saves an empty answer as failed", async () => {
    reportWorld(pending);
    vi.stubGlobal("fetch", vi.fn(async () => new Response(upstream([sse([{ type: "message_stop" }])]))));
    expect(await (await call("5")).text()).toBe("");
    expect(saves()).toEqual([expect.objectContaining({ report_content: "Report generation failed.", status: "failed" })]);
  });

  it("keeps what was written when the stream breaks partway", async () => {
    reportWorld(pending);
    vi.stubGlobal("fetch", vi.fn(async () => new Response(upstream([sse([delta("Part one.")])], { fail: true }))));
    expect(await (await call("5")).text()).toBe("Part one.");
    expect(saves()).toEqual([expect.objectContaining({ report_content: "Part one.", status: "complete" })]);
    expect(console.error).toHaveBeenCalledWith("[aqueous report] stream:", "socket hang up");
  });

  it("marks the report failed when the stream breaks before any text", async () => {
    reportWorld(pending);
    vi.stubGlobal("fetch", vi.fn(async () => new Response(upstream([], { fail: true }))));
    expect(await (await call("5")).text()).toBe("");
    expect(saves()).toEqual([
      expect.objectContaining({ report_content: "Report generation encountered an error. Please contact support.", status: "failed" }),
    ]);
  });

  it("marks the report failed (so it can be retried) when the reader leaves", async () => {
    reportWorld(pending);
    const cancelled = vi.fn();
    const never = new ReadableStream<Uint8Array>({ pull: () => new Promise(() => {}), cancel: cancelled });
    vi.stubGlobal("fetch", vi.fn(async () => new Response(never)));
    const res = await call("5");
    await res.body!.cancel();
    expect(cancelled).toHaveBeenCalled();
    expect(saves()).toContainEqual(expect.objectContaining({ report_content: "Report generation was interrupted.", status: "failed" }));
  });
});
