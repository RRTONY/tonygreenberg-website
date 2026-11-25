import { NextResponse, type NextRequest } from "next/server";
import { parseScanReply, SAKE_SCANNER_PROMPT, SAKE_SCANNER_USER } from "@/lib/content/sake/scanner";

// Sake Scanner (/sake/sake-scanner), ported from the Sake Manus app's server/routers/sakeScanner.ts
// `uploadImage` + `identifySake`. The app first stored every photo in Manus's S3 storage (public URL,
// kept forever) and then sent that URL to Manus's model; here the photo is never stored: it comes in
// as a data: URL (checked for type and size, the page shrinks it first), goes straight to the
// Anthropic Messages API over fetch (no SDK, ANTHROPIC_API_KEY, same model and pattern as the
// LiquidSun and SoulSmoke bottle scanners) with the app's prompt word for word, and the reply is
// reduced to the fields the page shows (parseScanReply). If the label can't be read, it says so.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-5-5";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DATA_URL = /^data:(image\/(?:jpeg|png|gif|webp));base64,([A-Za-z0-9+/]+={0,2})$/;
const UNREADABLE = "We couldn't identify a sake in that photo. Try a clearer, well-lit photo of the front label.";

export async function POST(request: NextRequest) {
  let body: { imageBase64?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  const image = typeof body?.imageBase64 === "string" ? body.imageBase64 : "";
  const match = DATA_URL.exec(image);
  if (!match) return NextResponse.json({ message: "Please upload a JPEG, PNG, GIF or WebP image." }, { status: 400 });
  const [, mediaType, data] = match;
  const bytes = Math.floor((data.length * 3) / 4) - (data.endsWith("==") ? 2 : data.endsWith("=") ? 1 : 0);
  if (bytes > MAX_IMAGE_BYTES) return NextResponse.json({ message: "Image too large. Please use an image under 5MB." }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ message: "The sake scanner is not configured." }, { status: 503 });

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1200,
        system: SAKE_SCANNER_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data } },
              { type: "text", text: SAKE_SCANNER_USER },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) throw new Error(`Anthropic API returned ${res.status}`);
    const reply = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = (reply.content ?? [])
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text)
      .join("");
    const result = parseScanReply(text);
    if (!result) return NextResponse.json({ message: UNREADABLE }, { status: 422 });
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Sake scanner error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ message: "Failed to identify sake. Please try again." }, { status: 502 });
  }
}
