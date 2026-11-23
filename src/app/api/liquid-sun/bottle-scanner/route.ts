import { NextResponse, type NextRequest } from "next/server";
import { parseOracleReply } from "@/lib/content/liquidsun/oracle";

// LiquidSun Bottle Scanner ("The Oracle", /liquid-sun/bottle-scanner). The LiquidSun Manus app only
// pretended to scan (it waited 3 seconds and always answered "Fortaleza Blanco"); like SoulSmoke's
// scanner (src/app/api/soul-smoke/bottle-scanner/route.ts) this reads the label with the Anthropic
// Messages API over fetch (no SDK, ANTHROPIC_API_KEY) and answers in the shape the page already
// shows: name, NOM, rarity, Soul Score, EVI, detected notes and a verdict. The image comes in as
// a data: URL, checked for type and size. Any failure after the checks returns `identified: false`
// so the page can say it couldn't read the label.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-5-5";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DATA_URL = /^data:(image\/(?:jpeg|png|gif|webp));base64,([A-Za-z0-9+/]+={0,2})$/;

const SYSTEM_PROMPT = `You are LiquidSun's tequila oracle: an expert in additive-free, traditionally made tequila (stone ovens, tahona, wild fermentation, copper pots). Read the tequila bottle label in the image.

Rules:
- Identify the brand and expression, and the NOM number if it is printed or you know it with confidence.
- "soulScore" (0-100): how traditionally made and additive-free the producer is. Industrial, diffuser-made, additive or celebrity brands score low (Casamigos, 818, Teremana, Jose Cuervo Especial, Clase Azul).
- "evi" (0-100): Extraordinary Value Index, quality for the price.
- "notes": 3 to 5 short tasting notes.
- "rarity": a short label such as "Cult Favorite", "Unicorn", "Staple", "Industrial".
- "verdict": one or two punchy sentences in LiquidSun's voice.
- If the image is not a tequila bottle or the label can't be read, set "identified" to false.

Reply with this JSON object only:
{"identified": boolean, "name": string|null, "nom": string|null, "rarity": string|null, "soulScore": number|null, "evi": number|null, "notes": string[], "verdict": string|null}`;

const FALLBACK = { identified: false, name: null, nom: null, rarity: null, soulScore: null, evi: null, notes: [], verdict: null };

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
  if (!apiKey) return NextResponse.json({ message: "The bottle scanner is not configured." }, { status: 503 });

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 800,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data } },
              { type: "text", text: "Read this tequila label. Reply with the JSON object only, no other text." },
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
    return NextResponse.json(parseOracleReply(text));
  } catch (error) {
    console.error("LiquidSun bottle scanner error:", error instanceof Error ? error.message : error);
    return NextResponse.json(FALLBACK);
  }
}
