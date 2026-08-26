/**
 * Intelligence Engine — Scoring Engine
 * Computes QPR, Availability, Scarcity, Wow, Overall, Tier, Freshness
 */
import type { CatalogItem, ComputedScores, ScoringWeights } from "./types";

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return clamp(((value - min) / (max - min)) * 100);
}

export function computeQPR(item: CatalogItem, allItems: CatalogItem[]): number {
  const cupping = item.cuppingScore ?? 85;
  const qualityNorm = normalize(cupping, 82, 92);
  const pricePer100g = (item.priceUsd / item.unitGrams) * 100;
  const valueRaw = qualityNorm / Math.log(1 + pricePer100g);
  // Normalize across catalog
  const allValues = allItems.map((i) => {
    const q = normalize(i.cuppingScore ?? 85, 82, 92);
    const p = (i.priceUsd / i.unitGrams) * 100;
    return q / Math.log(1 + p);
  });
  const minV = Math.min(...allValues);
  const maxV = Math.max(...allValues);
  let qpr = normalize(valueRaw, minV, maxV);
  // Adjustments
  if ((item.shipCostUsdEst ?? 0) > 5) qpr -= 5;
  if ((item.deliveryDaysEst ?? 3) > 7) qpr -= 3;
  // Farmer equity bonus
  const grade = item.producerTransparencyGrade;
  if (grade === "A") qpr += 5;
  else if (grade === "B") qpr += 2;
  else if (grade === "D" || grade === "F") qpr -= 5;
  return clamp(Math.round(qpr));
}

export function computeAvailability(item: CatalogItem): number {
  let score = item.inStock ? 60 : 10;
  const days = item.deliveryDaysEst ?? 5;
  score += clamp(30 - days * 3, 0, 30);
  const ship = item.shipCostUsdEst ?? 5;
  score += clamp(10 - ship, 0, 10);
  return clamp(Math.round(score));
}

export function computeScarcity(item: CatalogItem): number {
  let score = item.scarcityProxy;
  if (item.limitedRelease) score += 15;
  if (item.microlotSizeKg && item.microlotSizeKg < 100) score += 10;
  if (item.harvestYear && item.harvestYear < new Date().getFullYear()) score += 5;
  return clamp(Math.round(score));
}

export function computeWow(item: CatalogItem): number {
  let score = item.wowProxy;
  if (item.scarcityProxy > 60) score += 10;
  if (item.competitionWins?.length) score += 10;
  if (["anaerobic", "carbonic", "koji", "thermal-shock"].some((p) => item.processingMethod.toLowerCase().includes(p)))
    score += 8;
  if (item.altitude && item.altitude > 1800) score += 5;
  if (item.varietyRarityScore > 7) score += 7;
  return clamp(Math.round(score));
}

export function computeTier(cupping: number): 1 | 2 | 3 | 4 {
  if (cupping >= 92) return 4;
  if (cupping >= 90) return 3;
  if (cupping >= 86) return 2;
  return 1;
}

export function computeFreshness(item: CatalogItem): "green" | "yellow" | "red" | "unknown" {
  if (!item.roastDate) return "unknown";
  const days = Math.floor((Date.now() - new Date(item.roastDate).getTime()) / 86400000);
  if (days <= 14) return "green";
  if (days <= 30) return "yellow";
  return "red";
}

export function scoreAll(items: CatalogItem[], weights: ScoringWeights): CatalogItem[] {
  return items.map((item) => {
    const qpr = computeQPR(item, items);
    const availability = computeAvailability(item);
    const scarcity = computeScarcity(item);
    const wow = computeWow(item);
    const overall = Math.round(qpr * weights.qpr + availability * weights.availability + wow * weights.wow + scarcity * weights.scarcity);
    const scores: ComputedScores = {
      qpr,
      availability,
      scarcity,
      wow,
      overall: clamp(overall),
      tier: computeTier(item.cuppingScore ?? 85),
      freshness: computeFreshness(item),
    };
    return { ...item, scores };
  });
}

export function tierEmoji(tier: 1 | 2 | 3 | 4): string {
  return ["☕", "☕☕", "☕☕☕", "👑"][tier - 1];
}

export function freshnessColor(f: ComputedScores["freshness"]): string {
  return { green: "#22c55e", yellow: "#eab308", red: "#ef4444", unknown: "#9ca3af" }[f];
}

export function gradeColor(g: string): string {
  return ({ A: "#22c55e", B: "#84cc16", C: "#eab308", D: "#f97316", F: "#ef4444" } as Record<string, string>)[g] ?? "#9ca3af";
}
