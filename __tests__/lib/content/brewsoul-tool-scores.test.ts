import { afterEach, describe, expect, it, vi } from "vitest";
import { computeToolScores } from "@/lib/content/brewsoul-tool-scores";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import type { CatalogItem } from "@/lib/intelligence-engine/types";

const base = BREWSOUL_COFFEES[0];

afterEach(() => {
  vi.useRealTimers();
});

describe("computeToolScores", () => {
  it("returns every score in 0..100 for every catalog coffee, with overall = mean of qpr, availability and wow", () => {
    for (const c of BREWSOUL_COFFEES) {
      const s = computeToolScores(c);
      for (const v of [s.qpr, s.availability, s.wow]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
      expect(s.overall).toBeCloseTo((s.qpr + s.availability + s.wow) / 3, 10);
      expect([1, 2, 3, 4]).toContain(s.tier);
    }
  });

  it("gives a 94.5-cupping coffee the crown tier", () => {
    expect(base.cuppingScore).toBe(94.5);
    expect(computeToolScores(base).tier).toBe(4);
  });

  it("falls back to an 80 cupping score (tier 1) when none is given", () => {
    const noCupping: CatalogItem = { ...base, cuppingScore: undefined };
    expect(computeToolScores(noCupping).tier).toBe(1);
  });

  it("scores availability from stock, delivery days and shipping", () => {
    const inStock: CatalogItem = { ...base, inStock: true, deliveryDaysEst: 0, shipCostUsdEst: 0 };
    expect(computeToolScores(inStock).availability).toBe(100);
    const outOfStock: CatalogItem = { ...base, inStock: false, deliveryDaysEst: 10, shipCostUsdEst: 20 };
    expect(computeToolScores(outOfStock).availability).toBe(10);
  });

  it("marks freshness unknown without a roast date, and green/yellow/red by age", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-16T12:00:00Z"));
    expect(computeToolScores({ ...base, roastDate: undefined }).freshness).toBe("unknown");
    expect(computeToolScores({ ...base, roastDate: "2026-10-10" }).freshness).toBe("green");
    expect(computeToolScores({ ...base, roastDate: "2026-09-25" }).freshness).toBe("yellow");
    expect(computeToolScores({ ...base, roastDate: "2026-08-01" }).freshness).toBe("red");
  });
});
