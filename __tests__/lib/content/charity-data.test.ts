import { describe, expect, it } from "vitest";
import { CHARITIES, SCORE_WEIGHTS, SCORE_DIMENSIONS, EVALUATORS, STATS, ALL_SECTORS } from "@/lib/content/charity-data";

const weighted = (s: (typeof CHARITIES)[number]["scores"]) =>
  Math.round(
    (Object.keys(SCORE_WEIGHTS) as (keyof typeof SCORE_WEIGHTS)[]).reduce((sum, k) => sum + s[k] * SCORE_WEIGHTS[k], 0) * 10,
  ) / 10;

describe("charity-data", () => {
  it("has weights that add to 1 and dimension percentages that match them", () => {
    expect(Object.values(SCORE_WEIGHTS).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    for (const d of SCORE_DIMENSIONS) expect(d.weight).toBeCloseTo(SCORE_WEIGHTS[d.key] * 100, 10);
    expect(SCORE_DIMENSIONS.map((d) => d.key).sort()).toEqual(Object.keys(SCORE_WEIGHTS).sort());
  });

  it("has unique, url-safe slugs and https websites", () => {
    const slugs = CHARITIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const c of CHARITIES) {
      expect(c.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(c.website).toMatch(/^https?:\/\//);
      expect(c.name.trim()).not.toBe("");
    }
  });

  it("computes each total as the weighted score, rounded to one decimal", () => {
    for (const c of CHARITIES) expect(c.totalScore).toBe(weighted(c.scores));
  });

  it("sorts charities from highest to lowest total", () => {
    for (let i = 1; i < CHARITIES.length; i++) expect(CHARITIES[i - 1].totalScore).toBeGreaterThanOrEqual(CHARITIES[i].totalScore);
  });

  it("gives grades and cloak statuses from the documented cut-offs", () => {
    const grade = (s: number) =>
      s >= 97 ? "A+" : s >= 93 ? "A" : s >= 90 ? "A-" : s >= 87 ? "B+" : s >= 83 ? "B" : s >= 80 ? "B-" : s >= 77 ? "C+" : s >= 73 ? "C" : s >= 70 ? "C-" : s >= 60 ? "D" : "F";
    const cloak = (s: number) => (s >= 90 ? "clear" : s >= 75 ? "mostly-clear" : s >= 55 ? "hazy" : "opaque");
    for (const c of CHARITIES) {
      expect(c.grade).toBe(grade(c.totalScore));
      expect(c.cloakStatus).toBe(cloak(c.scores.cloakScore));
    }
    expect(CHARITIES.find((c) => c.slug === "against-malaria-foundation")?.grade).toBe("A+");
  });

  it("derives the summary stats from the list", () => {
    expect(STATS.totalCharities).toBe(CHARITIES.length);
    expect(STATS.aTierCount).toBe(CHARITIES.filter((c) => c.grade.startsWith("A")).length);
    expect(STATS.opacityWarnings).toBe(CHARITIES.filter((c) => ["hazy", "opaque"].includes(c.cloakStatus)).length);
    expect(STATS.avgScore).toBeGreaterThan(0);
    expect(ALL_SECTORS).toEqual([...new Set(CHARITIES.map((c) => c.sector))].sort());
  });

  it("lists evaluators with https links", () => {
    expect(EVALUATORS.map((e) => e.name)).toContain("GiveWell");
    for (const e of EVALUATORS) expect(e.url).toMatch(/^https:\/\//);
  });
});
