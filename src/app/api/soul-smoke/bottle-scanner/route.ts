import { NextResponse, type NextRequest } from "next/server";

// SoulSmoke Bottle Scanner (/soul-smoke/bottle-scanner), ported from the SoulSmoke Manus app's
// server/routers.ts `bottleScanner.analyze`. The Manus app called its own LLM proxy
// (invokeLLM); this calls the Anthropic Messages API directly over fetch (no SDK) with the
// same system prompt. The image comes in as a data: URL, is checked for type and size, and is
// sent as a base64 image block. Any failure after the checks returns the same fallback
// object the Manus app returned, so the page always has something to show.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-5-5";
/** Decoded image size limit. The page shrinks photos before sending, so real uploads sit far below it. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DATA_URL = /^data:(image\/(?:jpeg|png|gif|webp));base64,([A-Za-z0-9+/]+={0,2})$/;

const SYSTEM_PROMPT = `You are an expert mezcal sommelier and authenticity verifier. Analyze mezcal bottle labels from images.

Your task:
1. Identify the brand, expression/variant, and key details from the label
2. Assess authenticity based on label design, NOM number, and known brand characteristics
3. Provide warnings if this is a known problematic brand (celebrity brands, industrial producers, brands with lawsuits)
4. Give recommendations about the bottle

Known problematic brands to flag:
- Casamigos (lawsuit alleged only 33% agave)
- Clase Azul (known for additives)
- Dos Hombres (celebrity brand, low ratings)
- 818 (celebrity brand)
- Gusano Rojo, Monte Alban (industrial, worm gimmick)

Respond in JSON format with these fields:
{
  "identified": boolean,
  "brand": string or null,
  "expression": string or null,
  "producer": string or null,
  "agaveType": string or null,
  "region": string or null,
  "abv": string or null,
  "nomNumber": string or null,
  "confidence": "high" | "medium" | "low",
  "authenticity": "verified" | "suspicious" | "unknown",
  "warnings": string[],
  "recommendations": string[],
  "analysis": string (detailed explanation)
}`;

const FALLBACK_RESULT = {
  identified: false,
  confidence: "low",
  authenticity: "unknown",
  warnings: ["Analysis failed. Please try again with a clearer image."],
  recommendations: ["Ensure the label is clearly visible and well-lit."],
  analysis: "Unable to analyze the image. This could be due to image quality or a temporary service issue.",
} as const;

const CONFIDENCE = ["high", "medium", "low"];
const AUTHENTICITY = ["verified", "suspicious", "unknown"];

const textOrNull = (value: unknown) => (typeof value === "string" && value.trim() ? value : null);
const stringList = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

/** Pulls the JSON object out of the model's reply and gives it the shape the page expects. */
function parseScanResult(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("No JSON object in the reply");
  const raw = JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  return {
    identified: raw.identified === true,
    brand: textOrNull(raw.brand),
    expression: textOrNull(raw.expression),
    producer: textOrNull(raw.producer),
    agaveType: textOrNull(raw.agaveType),
    region: textOrNull(raw.region),
    abv: textOrNull(raw.abv),
    nomNumber: textOrNull(raw.nomNumber),
    confidence: CONFIDENCE.includes(raw.confidence as string) ? (raw.confidence as string) : "low",
    authenticity: AUTHENTICITY.includes(raw.authenticity as string) ? (raw.authenticity as string) : "unknown",
    warnings: stringList(raw.warnings),
    recommendations: stringList(raw.recommendations),
    analysis: typeof raw.analysis === "string" ? raw.analysis : "",
  };
}

export async function POST(request: NextRequest) {
  let body: { imageBase64?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const image = typeof body?.imageBase64 === "string" ? body.imageBase64 : "";
  const match = DATA_URL.exec(image);
  if (!match) {
    return NextResponse.json({ message: "Please upload a JPEG, PNG, GIF or WebP image." }, { status: 400 });
  }
  const [, mediaType, data] = match;
  const bytes = Math.floor((data.length * 3) / 4) - (data.endsWith("==") ? 2 : data.endsWith("=") ? 1 : 0);
  if (bytes > MAX_IMAGE_BYTES) {
    return NextResponse.json({ message: "Image too large. Please use an image under 5MB." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "The bottle scanner is not configured." }, { status: 503 });
  }

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data } },
              {
                type: "text",
                text: "Please analyze this mezcal bottle label and provide your assessment. Reply with the JSON object only, no other text.",
              },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) throw new Error(`Anthropic API returned ${res.status}`);
    const reply = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = (reply.content ?? [])
      .filter((block) => block.type === "text" && typeof block.text === "string")
      .map((block) => block.text)
      .join("");
    return NextResponse.json(parseScanResult(text));
  } catch (error) {
    console.error("Bottle scanner error:", error instanceof Error ? error.message : error);
    return NextResponse.json(FALLBACK_RESULT);
  }
}
