import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import {
  computeQPR,
  computeAvailability,
  computeWow,
  computeTier,
  computeFreshness,
} from "@/lib/intelligence-engine/scoring";
import type { CatalogItem } from "@/lib/intelligence-engine/types";

// Ported from legacy client/src/pages/brewsoul/BrewSoulTools.tsx's local
// `computeScores` helper — the composite (qpr+availability+wow)/3
// "overall" score used by Compare, Blend Builder, Drops, and My
// Collection. Shared here since all 4 tools computed it identically.
export function computeToolScores(c: CatalogItem) {
  const qpr = computeQPR(c, BREWSOUL_COFFEES);
  const availability = computeAvailability(c);
  const wow = computeWow(c);
  const overall = (qpr + availability + wow) / 3;
  const tier = computeTier(c.cuppingScore || 80);
  const freshness = computeFreshness(c);
  return { qpr, availability, wow, overall, tier, freshness };
}
