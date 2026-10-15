import { describe, expect, it } from "vitest";
import {
  PALETTE, DIMENSIONS, TOTAL_WEIGHT, ENTITY_TYPES, BENCHMARKS, SUPPLY_TIERS, FAILURES, GIG_LAYERS, CNPV_REFERENCE_POINTS,
  severityClasses, normalize, calcSoulScore, getGrade, getConsciousnessZone, calcSupplyChainComposite, calcCNPV, formatCurrency,
} from "@/lib/content/soulscore";

describe("soulscore data", () => {
  it("has 12 dimensions numbered 1..12 whose weights sum to 100", () => {
    expect(DIMENSIONS.map((d) => d.id)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    expect(TOTAL_WEIGHT).toBe(100);
    expect(DIMENSIONS[0]).toMatchObject({ label: "Consciousness", max: 1000 });
    for (const d of DIMENSIONS.slice(1)) expect(d.max).toBe(100);
  });

  it("uses only palette colours that exist", () => {
    const keys = [...DIMENSIONS, ...SUPPLY_TIERS, ...GIG_LAYERS].map((x) => x.colorKey);
    for (const k of keys) expect(PALETTE[k], k).toBeDefined();
  });

  it("gives every benchmark 12 scores within each dimension's range", () => {
    for (const b of BENCHMARKS) {
      expect(b.scores).toHaveLength(12);
      b.scores.forEach((s, i) => {
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(DIMENSIONS[i].max);
      });
    }
  });

  it("has unique entity types, 6 supply tiers of 5 factors and 20 failure patterns", () => {
    expect(new Set(ENTITY_TYPES.map((e) => e.id)).size).toBe(ENTITY_TYPES.length);
    expect(SUPPLY_TIERS).toHaveLength(6);
    for (const t of SUPPLY_TIERS) expect(t.factors).toHaveLength(5);
    expect(FAILURES).toHaveLength(20);
  });
});

describe("soulscore calculations", () => {
  it("normalises the 1000-point consciousness scale to 100 and leaves the rest", () => {
    expect(normalize(500, DIMENSIONS[0])).toBe(50);
    expect(normalize(42, DIMENSIONS[1])).toBe(42);
  });

  it("weights the 12 normalised scores", () => {
    expect(calcSoulScore([1000, ...new Array(11).fill(100)])).toBe(100);
    expect(calcSoulScore(new Array(12).fill(0))).toBe(0);
    // Only consciousness at 1000 (=100) contributes 12 of 100 weight.
    expect(calcSoulScore([1000, ...new Array(11).fill(0)])).toBeCloseTo(12, 10);
  });

  it("grades scores at the S/A/B/C/D/F cut-offs", () => {
    expect([85, 84.9, 70, 55, 40, 25, 24.9].map((s) => getGrade(s).letter)).toEqual(["S", "A", "A", "B", "C", "D", "F"]);
    expect(getGrade(100).colorKey).toBe("gold");
  });

  it("places Hawkins levels in their consciousness zone", () => {
    expect([500, 499, 200, 100, 99, 0].map((h) => getConsciousnessZone(h).zone)).toEqual(["LOVE", "POWER", "POWER", "FORCE", "SHAME", "SHAME"]);
  });

  it("weights the supply-chain composite 30/20/15/15/10/10", () => {
    const s = new Array(12).fill(0);
    s[3] = 100;
    expect(calcSupplyChainComposite(s)).toBeCloseTo(30, 10);
    expect(calcSupplyChainComposite(new Array(12).fill(100))).toBeCloseTo(100, 10);
  });

  it("values a consciousness-100 company the same as a standard NPV", () => {
    const r = calcCNPV(1000, 100, 5, 10);
    expect(r.adjusted).toBeCloseTo(r.standard, 6);
    expect(r.premium).toBeCloseTo(0, 6);
  });

  it("gives higher consciousness a premium, lower a discount, and 0 premium with no cash flow", () => {
    expect(calcCNPV(1000, 430, 10, 10).premium).toBeGreaterThan(33);
    expect(calcCNPV(1000, 75, 10, 10).premium).toBeLessThan(0);
    expect(calcCNPV(0, 430, 10, 10).premium).toBe(0);
    expect(calcCNPV(1000, 430, 0, 10)).toEqual({ standard: 0, adjusted: 0, premium: 0 });
  });

  it("matches the reference points' premium direction", () => {
    for (const p of CNPV_REFERENCE_POINTS) {
      const sign = Math.sign(calcCNPV(1000, p.hawkins, 10, 10).premium);
      expect(sign, p.name).toBe(p.premium.startsWith("-") ? -1 : 1);
    }
  });

  it("formats currency as $B, $M, $K or dollars", () => {
    expect(formatCurrency(2_500_000_000)).toBe("$2.50B");
    expect(formatCurrency(1_234_567)).toBe("$1.23M");
    expect(formatCurrency(12_345)).toBe("$12K");
    expect(formatCurrency(999)).toBe("$999");
    expect(formatCurrency(-2_000_000)).toBe("$-2.00M");
    expect(formatCurrency(0)).toBe("$0");
  });

  it("colours severity 10 red, 9 orange and lower amber", () => {
    expect(severityClasses(10).bgSolid).toBe(PALETTE.red.bgSolid);
    expect(severityClasses(9).bgSolid).toBe(PALETTE.orange.bgSolid);
    expect(severityClasses(3).bgSolid).toBe(PALETTE.amber.bgSolid);
  });
});
