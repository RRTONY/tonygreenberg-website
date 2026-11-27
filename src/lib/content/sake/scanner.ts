// Sake Scanner and Menu Analyzer prompts and reply shapes, from the Sake Manus app's
// server/routers/sakeScanner.ts (identifySake, analyzeMenuItem), prompts word for word. The app sent
// them to Manus's built-in model with a JSON schema; here they go to Claude
// (src/app/api/sake/scanner/route.ts, src/app/api/sake/menu-analyzer/route.ts) and the reply is read
// with these parsers, which keep only the expected fields with the expected types, so a bad or
// partial reply can never put arbitrary data on the page.

export const SAKE_SCANNER_PROMPT = `You are a sake identification expert. Analyze the image of a sake bottle label and return structured JSON with the following fields:
- name: The sake name in English (string)
- nameJa: The sake name in Japanese (string)
- brewery: The brewery name in English (string)
- breweryJa: The brewery name in Japanese (string)
- prefecture: The prefecture of origin (string)
- type: The sake classification - Junmai Daiginjo, Junmai Ginjo, Junmai, Honjozo, etc. (string)
- ricePolishRatio: The seimaibuai (rice polishing ratio) as a number, or null if unknown
- abv: Alcohol by volume as a number, or null if unknown
- estimatedRetailUS: Estimated US retail price in dollars (number)
- estimatedRetailJapan: Estimated Japan retail price in dollars (number)
- flavorNotes: Array of 3-5 expected flavor notes (string[])
- servingTemp: Recommended serving temperature (string)
- pairings: Array of 3-4 food pairings (string[])
- description: A 2-3 sentence description of this sake (string)
- confidence: How confident you are in the identification - "high", "medium", or "low" (string)

If you cannot identify the specific sake, provide your best guess based on visible kanji, label design, and any other clues. Always return valid JSON only, no markdown formatting.`;

export const SAKE_SCANNER_USER = "Please identify this sake bottle from the label image. Return only valid JSON.";

export const MENU_ANALYZER_PROMPT = `You are a sake pricing expert. Given a sake name and restaurant menu price, estimate the retail price and calculate the markup. Return JSON with:
- retailPriceUS: estimated US retail price for a 720ml bottle (number)
- retailPriceJapan: estimated Japan retail price for a 720ml bottle in USD (number)
- servingSizeML: the serving size in ml (number)
- pricePerML: the menu price per ml (number)
- retailPerML: the retail price per ml (number)
- markupMultiple: the markup multiple (number, e.g. 3.0 means 3x retail)
- verdict: one of "incredible_deal", "great_value", "standard", "premium", "tourist_trap" (string)
- explanation: a brief explanation of the value assessment (string)
- sakeType: the likely sake type/classification (string)
- qualityTier: estimated quality tier - "entry", "mid", "premium", "ultra_premium" (string)
Return only valid JSON.`;

/** The serving sizes the Menu Analyzer offers (its `servingSizes` values). */
export const SERVING_SIZES = ["90ml ochoko", "180ml glass", "300ml tokkuri", "720ml bottle", "1800ml ishobin"] as const;

export type ScanResult = {
  name: string;
  nameJa: string;
  brewery: string;
  breweryJa: string;
  prefecture: string;
  type: string;
  ricePolishRatio: number | null;
  abv: number | null;
  estimatedRetailUS: number;
  estimatedRetailJapan: number;
  flavorNotes: string[];
  servingTemp: string;
  pairings: string[];
  description: string;
  confidence: "high" | "medium" | "low";
};

export type MenuVerdict = "incredible_deal" | "great_value" | "standard" | "premium" | "tourist_trap";

export type MenuAnalysis = {
  retailPriceUS: number;
  retailPriceJapan: number;
  servingSizeML: number;
  pricePerML: number;
  retailPerML: number;
  markupMultiple: number;
  verdict: MenuVerdict;
  explanation: string;
  sakeType: string;
  qualityTier: string;
};

/** The JSON object in a model reply (it may arrive wrapped in a code fence or a sentence). */
export function extractJson(text: string): Record<string, unknown> | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

const text = (v: unknown, max = 400) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() && Number.isFinite(Number(v)) ? Number(v) : null);
const list = (v: unknown, max: number) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "").map((x) => x.trim().slice(0, 80)).slice(0, max) : [];

/** A usable scan result, or null when the reply doesn't name a sake. */
export function parseScanReply(reply: string): ScanResult | null {
  const o = extractJson(reply);
  if (!o) return null;
  const name = text(o.name, 200);
  if (!name) return null;
  const confidence = text(o.confidence).toLowerCase();
  return {
    name,
    nameJa: text(o.nameJa, 200) || name,
    brewery: text(o.brewery, 200),
    breweryJa: text(o.breweryJa, 200) || text(o.brewery, 200),
    prefecture: text(o.prefecture, 100),
    type: text(o.type, 100),
    ricePolishRatio: num(o.ricePolishRatio),
    abv: num(o.abv),
    estimatedRetailUS: num(o.estimatedRetailUS) ?? 0,
    estimatedRetailJapan: num(o.estimatedRetailJapan) ?? 0,
    flavorNotes: list(o.flavorNotes, 5),
    servingTemp: text(o.servingTemp, 120),
    pairings: list(o.pairings, 4),
    description: text(o.description, 800),
    confidence: confidence === "high" || confidence === "medium" ? confidence : "low",
  };
}

const VERDICTS: MenuVerdict[] = ["incredible_deal", "great_value", "standard", "premium", "tourist_trap"];

/** A usable menu analysis, or null when the reply is missing the numbers the page shows. */
export function parseMenuReply(reply: string): MenuAnalysis | null {
  const o = extractJson(reply);
  if (!o) return null;
  const markup = num(o.markupMultiple);
  const retail = num(o.retailPriceUS);
  if (markup === null || retail === null) return null;
  const verdict = text(o.verdict) as MenuVerdict;
  return {
    retailPriceUS: retail,
    retailPriceJapan: num(o.retailPriceJapan) ?? 0,
    servingSizeML: num(o.servingSizeML) ?? 0,
    pricePerML: num(o.pricePerML) ?? 0,
    retailPerML: num(o.retailPerML) ?? 0,
    markupMultiple: markup,
    verdict: VERDICTS.includes(verdict) ? verdict : "standard",
    explanation: text(o.explanation, 800),
    sakeType: text(o.sakeType, 100),
    qualityTier: text(o.qualityTier, 40),
  };
}
