import { describe, expect, it } from "vitest";
import { PROVIDERS, COST_CATEGORIES } from "@/lib/content/supply-chain-providers";

describe("supply-chain-providers", () => {
  it("audits 12 unique providers with https sites", () => {
    expect(PROVIDERS).toHaveLength(12);
    expect(new Set(PROVIDERS.map((p) => p.name)).size).toBe(12);
    for (const p of PROVIDERS) expect(p.url).toMatch(/^https:\/\//);
  });

  it("splits every provider's dollar into 100%", () => {
    for (const p of PROVIDERS) expect(Object.values(p.breakdown).reduce((a, b) => a + b, 0), p.name).toBe(100);
  });

  it("keeps prices positive and credibility within 1-100", () => {
    for (const p of PROVIDERS) {
      expect(p.monthlyPrice).toBeGreaterThan(0);
      expect(p.credibilityScore).toBeGreaterThanOrEqual(1);
      expect(p.credibilityScore).toBeLessThanOrEqual(100);
      expect(["high", "medium", "low", "opaque"]).toContain(p.transparency);
    }
  });

  it("has one cost category per breakdown field, each with a hex colour", () => {
    expect(COST_CATEGORIES.map((c) => c.key).sort()).toEqual(Object.keys(PROVIDERS[0].breakdown).sort());
    for (const c of COST_CATEGORIES) expect(c.color).toMatch(/^#[0-9A-F]{6}$/i);
  });
});
