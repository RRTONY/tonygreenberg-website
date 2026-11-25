import { NextResponse, type NextRequest } from "next/server";
import { MENU_ANALYZER_PROMPT, parseMenuReply, SERVING_SIZES } from "@/lib/content/sake/scanner";

// Menu Analyzer (/sake/menu-analyzer), ported from the Sake Manus app's server/routers/sakeScanner.ts
// `analyzeMenuItem`: a sake name, its menu price and serving size go to the model with the app's
// prompt word for word, and the markup estimate comes back. Manus's built-in model is replaced by the
// Anthropic Messages API over fetch (no SDK, ANTHROPIC_API_KEY, same model as the site's scanners).
// Inputs are checked (the app took any string and any number, including negative prices) and the
// reply is reduced to the fields the page shows (parseMenuReply).

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-5-5";

export async function POST(request: NextRequest) {
  let body: { sakeName?: unknown; menuPrice?: unknown; servingSize?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  const sakeName = typeof body?.sakeName === "string" ? body.sakeName.replace(/\s+/g, " ").trim() : "";
  const menuPrice = typeof body?.menuPrice === "number" ? body.menuPrice : NaN;
  const servingSize = typeof body?.servingSize === "string" && (SERVING_SIZES as readonly string[]).includes(body.servingSize) ? body.servingSize : "300ml tokkuri";
  if (!sakeName || sakeName.length > 120) return NextResponse.json({ message: "Please enter a sake name." }, { status: 400 });
  if (!Number.isFinite(menuPrice) || menuPrice <= 0 || menuPrice > 10000)
    return NextResponse.json({ message: "Please enter the menu price." }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ message: "The menu analyzer is not configured." }, { status: 503 });

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 800,
        system: MENU_ANALYZER_PROMPT,
        messages: [{ role: "user", content: `Sake: ${sakeName}\nMenu Price: $${menuPrice}\nServing Size: ${servingSize}` }],
      }),
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) throw new Error(`Anthropic API returned ${res.status}`);
    const reply = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = (reply.content ?? [])
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text)
      .join("");
    const analysis = parseMenuReply(text);
    if (!analysis) throw new Error("Unreadable analysis");
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Sake menu analyzer error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ message: "Failed to analyze menu item. Please try again." }, { status: 502 });
  }
}
