import { describe, expect, it } from "vitest";
import {
  DIMENSION_KEYS, DIMENSION_LABELS, computeWeightDeltas, computeHardFilters, getSubstanceBonuses, applyPriorityRank,
  scoreAllFacilities, getInitialRankOrder, type DimensionKey,
} from "@/lib/content/pri-iboga-compass-engine";
import { FACILITIES } from "@/lib/content/pri-iboga-facility-data";

const uniform = () => Object.fromEntries(DIMENSION_KEYS.map((k) => [k, 0.1])) as Record<DimensionKey, number>;
const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);

describe("computeWeightDeltas", () => {
  it("is all zeros with no answers", () => {
    expect(Object.values(computeWeightDeltas({})).every((v) => v === 0)).toBe(true);
    expect(Object.keys(computeWeightDeltas({}))).toEqual([...DIMENSION_KEYS]);
  });

  it("shifts weight toward safety for substance dependency and toward Bwiti for spiritual work", () => {
    const dep = computeWeightDeltas({ Q1: 0 });
    expect(dep.medicalSafety).toBeCloseTo(0.05);
    expect(dep.clinicalTrackRecord).toBeCloseTo(0.04);
    const spirit = computeWeightDeltas({ Q1: 3 });
    expect(spirit.bwitiAuthenticity).toBeCloseTo(0.06);
    expect(spirit.nagoyaReciprocity).toBeCloseTo(0.04);
  });

  it("boosts access & intake for someone who needs help within 30 days", () => {
    expect(computeWeightDeltas({ Q2: 0 }).accessIntake).toBeCloseTo(0.05);
  });
});

describe("computeHardFilters", () => {
  it("has no filters with no answers", () => {
    expect(computeHardFilters({})).toEqual({
      excludeAll: false, minMedicalSafety: 0, topRatedOnly: false, maxBudget: 0, maxDays: 0, excludeGabon: false,
      excludeEurope: false, excludeCostaRica: false, veganOnly: false, familyRequired: false, veteranBoost: false,
    });
  });

  it("excludes everything for pregnancy or breastfeeding only", () => {
    expect(computeHardFilters({ Q9: 1 }).excludeAll).toBe(true);
    expect(computeHardFilters({ Q9: 2 }).excludeAll).toBe(true);
    expect(computeHardFilters({ Q9: 3 }).excludeAll).toBe(false);
  });

  it("keeps the strictest medical-safety minimum across answers", () => {
    expect(computeHardFilters({ Q4: 1 }).minMedicalSafety).toBe(7);
    expect(computeHardFilters({ Q4: 1, Q27: 0 }).minMedicalSafety).toBe(8);
    expect(computeHardFilters({ Q4: 2, Q27: 0 }).minMedicalSafety).toBe(9);
  });

  it("maps budget, duration, travel, language, diet, family and veteran answers", () => {
    expect(computeHardFilters({ Q13: 0 }).maxBudget).toBe(5000);
    expect(computeHardFilters({ Q13: 4 }).maxBudget).toBe(0);
    expect(computeHardFilters({ Q14: 2 }).maxDays).toBe(21);
    expect(computeHardFilters({ Q16: 3 })).toMatchObject({ excludeGabon: true, excludeEurope: true, excludeCostaRica: true });
    expect(computeHardFilters({ Q16: 2 })).toMatchObject({ excludeGabon: true, excludeEurope: true, excludeCostaRica: false });
    expect(computeHardFilters({ Q17: 0 }).excludeGabon).toBe(true);
    expect(computeHardFilters({ Q24: 0, Q25: 0, Q19: 0 })).toMatchObject({ veganOnly: true, familyRequired: true, veteranBoost: true });
    expect(computeHardFilters({ Q7: 2 }).topRatedOnly).toBe(true);
  });
});

describe("getSubstanceBonuses", () => {
  it("is empty without Q3 and for out-of-range picks", () => {
    expect(getSubstanceBonuses({})).toEqual({});
    expect(getSubstanceBonuses({ Q3: [99] })).toEqual({});
  });

  it("adds up the bonuses for every selected substance", () => {
    expect(getSubstanceBonuses({ Q3: [1] })).toEqual({ dardashti: 10, ambio: 5, "new-roots": 4 });
    const both = getSubstanceBonuses({ Q3: [0, 1] });
    expect(both.dardashti).toBe(15);
    expect(both.ambio).toBe(10);
  });
});

describe("applyPriorityRank", () => {
  it("normalises weights to 1 and doubles the first-ranked dimension relative to the fifth", () => {
    const ranked = applyPriorityRank(uniform(), [...DIMENSION_KEYS]);
    expect(sum(ranked)).toBeCloseTo(1, 10);
    expect(ranked.medicalSafety / ranked.specialtyFit).toBeCloseTo(2.0, 10);
    expect(ranked.reputation / ranked.specialtyFit).toBeCloseTo(0.5, 10);
  });

  it("only normalises when no rank order is given", () => {
    const ranked = applyPriorityRank(uniform(), []);
    for (const k of DIMENSION_KEYS) expect(ranked[k]).toBeCloseTo(0.1, 10);
  });
});

describe("scoreAllFacilities", () => {
  it("scores every facility 0-100, eligible ones first, by score", () => {
    const results = scoreAllFacilities({}, [...DIMENSION_KEYS]);
    expect(results).toHaveLength(FACILITIES.length);
    expect(results.every((r) => !r.eliminated)).toBe(true);
    for (let i = 1; i < results.length; i++) expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    for (const r of results) {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
      expect(Math.abs(r.matchPercent - r.score)).toBeLessThanOrEqual(0.5);
      expect(r.topDimensions).toHaveLength(3);
      expect(r.whyMatched).toMatch(/^Strongest match on /);
    }
  });

  it("eliminates every facility for pregnancy", () => {
    const results = scoreAllFacilities({ Q9: 1 }, []);
    expect(results.every((r) => r.eliminated && /pregnancy/.test(r.eliminationReason ?? ""))).toBe(true);
  });

  it("drops facilities over budget, below the safety minimum and in Gabon, and lists them last", () => {
    const results = scoreAllFacilities({ Q13: 0, Q4: 2, Q17: 0 }, []);
    for (const r of results) {
      const f = r.facility;
      const shouldPass = f.medicalSafety >= 9 && f.priceMin <= 5000 && f.region !== "gabon";
      expect({ id: f.id, eliminated: r.eliminated }).toEqual({ id: f.id, eliminated: !shouldPass });
    }
    const firstEliminated = results.findIndex((r) => r.eliminated);
    expect(results.slice(firstEliminated).every((r) => r.eliminated)).toBe(true);
    expect(results.find((r) => r.facility.id === "ambio")?.eliminationReason).toMatch(/exceeds budget cap of \$5,000/);
  });

  it("adds 15 points for veteran-focused facilities when the visitor is a veteran", () => {
    const vet = FACILITIES.find((f) => f.veteranFocus)!;
    const base = scoreAllFacilities({}, []).find((r) => r.facility.id === vet.id)!;
    const boosted = scoreAllFacilities({ Q19: 0 }, []).find((r) => r.facility.id === vet.id)!;
    expect(boosted.score).toBeCloseTo(Math.min(100, base.score + 15), 1);
    expect(boosted.whyMatched).toContain("veteran-focused program");
  });

  it("adds the substance bonus to a facility's score", () => {
    const base = scoreAllFacilities({}, []).find((r) => r.facility.id === "dardashti")!;
    const withBonus = scoreAllFacilities({ Q3: [1] }, []).find((r) => r.facility.id === "dardashti")!;
    expect(withBonus.score).toBeCloseTo(Math.min(100, base.score + 10), 1);
    expect(withBonus.whyMatched).toContain("top-tier substance specialty match");
  });
});

describe("getInitialRankOrder", () => {
  it("returns all 10 dimensions, highest weight first, keeping the default order on ties", () => {
    expect(getInitialRankOrder({})).toEqual([...DIMENSION_KEYS]);
    const order = getInitialRankOrder({ Q1: 3 });
    expect(order.slice(0, 2)).toEqual(["bwitiAuthenticity", "nagoyaReciprocity"]);
    expect(new Set(order).size).toBe(10);
  });

  it("labels every dimension", () => {
    for (const k of DIMENSION_KEYS) expect(DIMENSION_LABELS[k].trim()).not.toBe("");
  });
});
