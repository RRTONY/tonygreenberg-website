import { describe, expect, it } from "vitest";
import {
  TOKEN_ECOSYSTEMS, REX_AUCTIONS, AGGREGATE, PORTFOLIO_CATEGORIES, DIMENSION_SUMMARY, CHARITY_SUMMARY,
  CHARITY_SCORE_DIMENSIONS, IRR_HIGHLIGHTS, CONSCIOUSNESS_ZONES, BENCHMARK_COMPARISON,
} from "@/lib/content/impact-dashboard";
import { SCORE_DIMENSIONS } from "@/lib/content/charity-data";

describe("impact-dashboard", () => {
  it("has unique token ecosystems, with REX marked as never launched", () => {
    const ids = TOKEN_ECOSYSTEMS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe("BEYOND");
    expect(TOKEN_ECOSYSTEMS.find((t) => t.id === "REX")?.neverLaunched).toBe(true);
    for (const t of TOKEN_ECOSYSTEMS) {
      expect(t.color).toMatch(/^#[0-9A-F]{6}$/i);
      expect(t.iconKey).toMatch(/^[a-z-]+$/);
      expect(t.milestones.length).toBeGreaterThan(0);
    }
  });

  it("derives the aggregate numbers from the ecosystems", () => {
    const sum = (f: (t: (typeof TOKEN_ECOSYSTEMS)[number]) => number) => TOKEN_ECOSYSTEMS.reduce((s, t) => s + f(t), 0);
    expect(AGGREGATE.totalTokenHolders).toBe(sum((t) => t.metrics.tokenHolders));
    expect(AGGREGATE.totalProjectsFunded).toBe(sum((t) => t.metrics.projectsFunded));
    expect(AGGREGATE.totalCommunityMembers).toBe(sum((t) => t.metrics.communityMembers));
    expect(AGGREGATE.avgHawkins).toBe(Math.round(sum((t) => t.hawkinsScore) / TOKEN_ECOSYSTEMS.length));
    expect(AGGREGATE.avgSoulScore).toBeCloseTo(sum((t) => t.soulScore) / TOKEN_ECOSYSTEMS.length, 1);
  });

  it("uses the ImpactSoul aggregate in the benchmark row", () => {
    const row = BENCHMARK_COMPARISON.find((b) => b.name === "ImpactSoul model")!;
    expect(row.hawkins).toBe(AGGREGATE.avgHawkins);
    expect(row.score).toBe(AGGREGATE.avgSoulScore);
  });

  it("weights SoulScore's 12 dimensions and the charity dimensions to 100", () => {
    expect(DIMENSION_SUMMARY).toHaveLength(12);
    expect(DIMENSION_SUMMARY.reduce((s, d) => s + d.weight, 0)).toBe(100);
    expect(CHARITY_SCORE_DIMENSIONS.reduce((s, d) => s + d.weight, 0)).toBe(100);
  });

  it("matches the charity scorecard's own dimension labels and weights", () => {
    expect(CHARITY_SCORE_DIMENSIONS.map((d) => [d.label, d.weight])).toEqual(SCORE_DIMENSIONS.map((d) => [d.label, d.weight]));
    expect(CHARITY_SUMMARY.dimensions).toBe(SCORE_DIMENSIONS.length);
    expect(CHARITY_SUMMARY.clearTransparency + CHARITY_SUMMARY.hazyTransparency + CHARITY_SUMMARY.opaqueTransparency).toBe(CHARITY_SUMMARY.totalCharities);
  });

  it("has valid portfolio, IRR, zone and auction rows", () => {
    for (const p of PORTFOLIO_CATEGORIES) expect(p.companies).toBeGreaterThan(0);
    for (const r of IRR_HIGHLIGHTS) expect(r.irr).toMatch(/^\d+(\.\d+)?x$/);
    expect(CONSCIOUSNESS_ZONES.map((z) => z.zone)).toEqual(["SHAME", "FORCE", "POWER", "LOVE"]);
    for (const a of REX_AUCTIONS) expect(a.href).toMatch(/^https:\/\//);
  });
});
