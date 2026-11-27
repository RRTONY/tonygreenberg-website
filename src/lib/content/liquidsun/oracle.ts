// Shapes the Bottle Scanner model reply (src/app/api/liquid-sun/bottle-scanner/route.ts) into what
// the page shows. Kept out of the route file: a route may only export its HTTP handlers.

export type OracleResult = ReturnType<typeof parseOracleReply>;

const textOrNull = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 200) : null);
const score = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : null);

export function parseOracleReply(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("No JSON object in the reply");
  const raw = JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  const name = textOrNull(raw.name);
  return {
    identified: raw.identified === true && Boolean(name),
    name,
    nom: textOrNull(raw.nom),
    rarity: textOrNull(raw.rarity),
    soulScore: score(raw.soulScore),
    evi: score(raw.evi),
    notes: Array.isArray(raw.notes)
      ? raw.notes.filter((n): n is string => typeof n === "string" && Boolean(n.trim())).slice(0, 6).map((n) => n.trim().slice(0, 60))
      : [],
    verdict: textOrNull(raw.verdict),
  };
}

