import { describe, expect, it } from "vitest";
import {
  BREWSOUL_THEME, BREWSOUL_TAGLINE, BREWSOUL_BYLINE, BREWSOUL_ECOSYSTEM, BREWSOUL_SCORING_WEIGHTS,
  BREWSOUL_FLAVOR_AXES, BREWSOUL_TIER_ICONS, BREWSOUL_TIER_RANGES, BREWSOUL_SHAME_CATEGORIES,
} from "@/lib/content/brewsoul-config";
import { Coffee, Crown } from "lucide-react";

describe("brewsoul-config", () => {
  it("has the real tagline, byline and hex theme colours", () => {
    expect(BREWSOUL_TAGLINE).toBe("The Intelligence of Coffee");
    expect(BREWSOUL_BYLINE).toBe("Not a buying guide. A reckoning.");
    for (const hex of Object.values(BREWSOUL_THEME)) expect(hex).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it("links the ecosystem to internal routes", () => {
    expect(BREWSOUL_ECOSYSTEM.map((l) => l.url)).toEqual(["/", "/find-your-sake"]);
    for (const l of BREWSOUL_ECOSYSTEM) expect(l.url.startsWith("/")).toBe(true);
  });

  it("has scoring weights that add up to 1", () => {
    const sum = Object.values(BREWSOUL_SCORING_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 10);
  });

  it("has 6 unique flavour axes, each out of 10", () => {
    expect(BREWSOUL_FLAVOR_AXES).toHaveLength(6);
    expect(new Set(BREWSOUL_FLAVOR_AXES.map((a) => a.key)).size).toBe(6);
    for (const a of BREWSOUL_FLAVOR_AXES) expect(a.max).toBe(10);
  });

  it("has 4 tiers: 1-3 coffee cups then a crown, with rising score cut-offs", () => {
    expect(BREWSOUL_TIER_ICONS.map((t) => t.count)).toEqual([1, 2, 3, 1]);
    expect(BREWSOUL_TIER_ICONS.slice(0, 3).every((t) => t.icon === Coffee)).toBe(true);
    expect(BREWSOUL_TIER_ICONS[3].icon).toBe(Crown);
    expect(BREWSOUL_TIER_RANGES).toEqual([82, 86, 90, 92]);
  });

  it("lists 6 unique shame categories", () => {
    expect(BREWSOUL_SHAME_CATEGORIES).toHaveLength(6);
    expect(new Set(BREWSOUL_SHAME_CATEGORIES).size).toBe(6);
  });
});
