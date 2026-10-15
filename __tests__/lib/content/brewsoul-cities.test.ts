import { describe, expect, it } from "vitest";
import {
  CITIES, NATIONAL_STATS, SCORING_DIMENSIONS, GRADE_SCALE, UNIVERSAL_CHAINS, NUANCED_CHAINS,
  gradeFromScore, getCityBySlug, getAllCitiesSorted, getGradeColor, getGradeBg, type Grade,
} from "@/lib/content/brewsoul-cities";

const MANUS = /manuscdn|\/manus-storage\/|\/api\/img\//;

describe("gradeFromScore", () => {
  it.each([
    [100, "A+"], [90, "A+"], [89, "A"], [85, "A"], [84, "A-"], [80, "A-"], [79, "B+"], [75, "B+"],
    [74, "B"], [68, "B"], [67, "B-"], [65, "B-"], [64, "C+"], [58, "C+"], [57, "C"], [50, "C"],
    [49, "D+"], [42, "D+"], [41, "D"], [35, "D"], [34, "D-"], [30, "D-"], [29, "F"], [0, "F"], [-5, "F"],
  ] as const)("%d -> %s", (score, grade) => {
    expect(gradeFromScore(score)).toBe(grade);
  });
});

describe("grade colors", () => {
  it("maps each grade letter to its colour family", () => {
    expect(getGradeColor("A+")).toBe("text-emerald-400");
    expect(getGradeColor("B-")).toBe("text-amber-400");
    expect(getGradeColor("C")).toBe("text-orange-400");
    expect(getGradeColor("D+")).toBe("text-red-400");
    expect(getGradeColor("F")).toBe("text-red-600");
    expect(getGradeBg("A-")).toBe("bg-emerald-500/20 border-emerald-500/30");
    expect(getGradeBg("F")).toBe("bg-red-700/20 border-red-700/30");
  });
});

describe("city lookups", () => {
  it("finds a city by slug and returns undefined for an unknown or empty one", () => {
    expect(getCityBySlug("portland")?.name).toBe("Portland");
    expect(getCityBySlug("atlantis")).toBeUndefined();
    expect(getCityBySlug("")).toBeUndefined();
  });

  it("sorts every city by rank without changing CITIES", () => {
    const before = CITIES.map((c) => c.slug);
    const sorted = getAllCitiesSorted();
    expect(sorted.map((c) => c.rank)).toEqual(Array.from({ length: CITIES.length }, (_, i) => i + 1));
    expect(sorted[0].slug).toBe("portland");
    expect(CITIES.map((c) => c.slug)).toEqual(before);
  });
});

describe("city data integrity", () => {
  it("has 25 cities with unique slugs and ranks, matching the national stats", () => {
    expect(CITIES).toHaveLength(NATIONAL_STATS.totalCities);
    expect(new Set(CITIES.map((c) => c.slug)).size).toBe(CITIES.length);
    expect(new Set(CITIES.map((c) => c.rank)).size).toBe(CITIES.length);
    const top = getAllCitiesSorted()[0];
    expect(`${top.name}, ${top.state}`).toBe(NATIONAL_STATS.topCity);
    expect(top.score).toBe(NATIONAL_STATS.topCityScore);
  });

  it("uses https hero images and no Manus URLs", () => {
    for (const c of CITIES) {
      expect(c.heroImage).toMatch(/^https:\/\//);
      expect(JSON.stringify(c)).not.toMatch(MANUS);
    }
  });

  it("scores each listed shop within the dimension maxima, with a total that adds up", () => {
    const max = Object.fromEntries(SCORING_DIMENSIONS.map((d) => [d.key, d.max]));
    expect(Object.values(max).reduce((a, b) => a + b, 0)).toBe(100);
    for (const city of CITIES) {
      for (const shop of [...city.bestShops, ...city.worstShops]) {
        expect(shop.citySlug).toBe(city.slug);
        for (const d of SCORING_DIMENSIONS) expect(shop.scores[d.key]).toBeLessThanOrEqual(max[d.key]);
        expect(SCORING_DIMENSIONS.reduce((sum, d) => sum + shop.scores[d.key], 0)).toBe(shop.scores.total);
      }
      const ids = [...city.bestShops, ...city.worstShops].map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  // Shop grades in the data follow the GRADE_SCALE table (A = 80-89), but
  // gradeFromScore() gives 80-84 an "A-" and 30-34 a "D-", so e.g. pdx-sterling
  // (84) shows "A" while the function says "A-".
  it.fails("BUG: shop grades in CITIES disagree with gradeFromScore() for some totals", () => {
    for (const city of CITIES) {
      for (const shop of [...city.bestShops, ...city.worstShops]) {
        expect({ id: shop.id, grade: shop.scores.grade }).toEqual({ id: shop.id, grade: gradeFromScore(shop.scores.total) });
      }
    }
  });

  it("ranks Portland's best list 1..n by descending score", () => {
    const best = getCityBySlug("portland")!.bestShops;
    expect(best.length).toBeGreaterThan(0);
    expect(best.map((s) => s.rankInCity)).toEqual(best.map((_, i) => i + 1));
    for (let i = 1; i < best.length; i++) expect(best[i - 1].scores.total).toBeGreaterThanOrEqual(best[i].scores.total);
    expect(best.every((s) => s.listType === "best")).toBe(true);
  });

  it("has a real grade scale and chain scores", () => {
    const grades: Grade[] = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D+", "D", "D-", "F"];
    for (const g of GRADE_SCALE) expect(grades).toContain(g.grade);
    for (const ch of [...UNIVERSAL_CHAINS, ...NUANCED_CHAINS]) {
      expect(grades).toContain(ch.grade);
      expect(ch.avgLatte).toBeGreaterThan(0);
    }
    expect(UNIVERSAL_CHAINS.find((c) => c.chainName === "Starbucks")).toMatchObject({ grade: "D+", score: 42 });
  });
});
