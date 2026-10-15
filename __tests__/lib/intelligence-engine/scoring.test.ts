import { afterEach, describe, expect, it, vi } from "vitest";
import { Coffee, Crown } from "lucide-react";
import type { CatalogItem } from "@/lib/intelligence-engine/types";
import {
  computeAvailability,
  computeFreshness,
  computeQPR,
  computeScarcity,
  computeTier,
  computeWow,
  freshnessColor,
  gradeClass,
  scoreAll,
  tierIcon,
} from "@/lib/intelligence-engine/scoring";

function item(over: Partial<CatalogItem> = {}): CatalogItem {
  return {
    id: "x",
    name: "X",
    producer: "P",
    producerCountry: "US",
    producerShipsGlobal: true,
    originCountry: "Ethiopia",
    originRegion: "Guji",
    variety: "Heirloom",
    processingMethod: "Washed",
    flavorProfile: {},
    tastingNotes: [],
    priceUsd: 20,
    unitGrams: 250,
    producerTransparencyGrade: "C",
    buyLinks: [],
    scarcityProxy: 40,
    limitedRelease: false,
    inStock: true,
    varietyRarityScore: 5,
    weirdnessScore: 3,
    wowProxy: 50,
    ...over,
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("computeTier", () => {
  it("maps cupping scores to tiers at 86, 90 and 92", () => {
    expect([85.9, 86, 89.9, 90, 91.9, 92].map(computeTier)).toEqual([1, 2, 2, 3, 3, 4]);
  });
});

describe("computeQPR", () => {
  it("is 50 (plus grade adjustment) for a one-item catalog", () => {
    const a = item();
    expect(computeQPR(a, [a])).toBe(50);
    const b = item({ producerTransparencyGrade: "A" });
    expect(computeQPR(b, [b])).toBe(55);
  });

  it("ranks the better-value coffee higher and stays within 0..100", () => {
    const cheap = item({ id: "c", priceUsd: 10, cuppingScore: 90 });
    const pricey = item({ id: "p", priceUsd: 80, cuppingScore: 84, producerTransparencyGrade: "F", shipCostUsdEst: 10, deliveryDaysEst: 10 });
    const all = [cheap, pricey];
    expect(computeQPR(cheap, all)).toBe(100);
    expect(computeQPR(pricey, all)).toBe(0);
  });
});

describe("computeAvailability / computeScarcity / computeWow", () => {
  it("availability rewards stock, speed and cheap shipping", () => {
    expect(computeAvailability(item({ deliveryDaysEst: 0, shipCostUsdEst: 0 }))).toBe(100);
    expect(computeAvailability(item({ inStock: false, deliveryDaysEst: 20, shipCostUsdEst: 20 }))).toBe(10);
    expect(computeAvailability(item())).toBe(60 + 15 + 5);
  });

  it("scarcity adds limited release, microlot and older harvest bonuses, capped at 100", () => {
    expect(computeScarcity(item())).toBe(40);
    expect(computeScarcity(item({ limitedRelease: true, microlotSizeKg: 50, harvestYear: 2000 }))).toBe(70);
    expect(computeScarcity(item({ scarcityProxy: 95, limitedRelease: true }))).toBe(100);
  });

  it("wow adds bonuses for rare, experimental, high-altitude, award-winning lots", () => {
    expect(computeWow(item())).toBe(50);
    expect(
      computeWow(item({ scarcityProxy: 70, competitionWins: ["CoE"], processingMethod: "Anaerobic Natural", altitude: 2000, varietyRarityScore: 9 })),
    ).toBe(50 + 10 + 10 + 8 + 5 + 7);
  });
});

describe("computeFreshness", () => {
  it("is unknown without a roast date, then green/yellow/red by age", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-31T00:00:00Z"));
    expect(computeFreshness(item())).toBe("unknown");
    expect(computeFreshness(item({ roastDate: "2026-10-17" }))).toBe("green");
    expect(computeFreshness(item({ roastDate: "2026-10-01" }))).toBe("yellow");
    expect(computeFreshness(item({ roastDate: "2026-09-01" }))).toBe("red");
  });
});

describe("scoreAll and display helpers", () => {
  it("adds weighted scores to every item", () => {
    const [scored] = scoreAll([item({ cuppingScore: 90 })], { qpr: 1, availability: 0, wow: 0, scarcity: 0 });
    expect(scored.scores).toMatchObject({ qpr: 50, overall: 50, tier: 3, freshness: "unknown" });
  });

  it("tierIcon, freshnessColor and gradeClass", () => {
    expect(tierIcon(1)).toEqual({ icon: Coffee, count: 1 });
    expect(tierIcon(3)).toEqual({ icon: Coffee, count: 3 });
    expect(tierIcon(4)).toEqual({ icon: Crown, count: 1 });
    expect(freshnessColor("green")).toBe("#22c55e");
    expect(freshnessColor("unknown")).toBe("#9ca3af");
    expect(gradeClass("A")).toBe("text-green-700");
    expect(gradeClass("Z")).toBe("text-gray-600");
  });
});
