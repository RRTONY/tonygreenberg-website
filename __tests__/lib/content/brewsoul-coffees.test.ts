import { describe, expect, it } from "vitest";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { BREWSOUL_FLAVOR_AXES } from "@/lib/content/brewsoul-config";

const MANUS = /manuscdn|\/manus-storage\/|\/api\/img\//;
const AXES = BREWSOUL_FLAVOR_AXES.map((a) => a.key as string);

describe("brewsoul-coffees catalog", () => {
  it("holds the real 107 coffees with unique, url-safe ids", () => {
    expect(BREWSOUL_COFFEES).toHaveLength(107);
    const ids = BREWSOUL_COFFEES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    // Lower-case words joined by dashes (one id keeps its accent: "...-tarrazú").
    for (const id of ids) expect(id).toMatch(/^[\p{Ll}0-9]+(-[\p{Ll}0-9]+)*$/u);
    expect(BREWSOUL_COFFEES[0]).toMatchObject({ id: "gesha-village-lot-74", priceUsd: 85, unitGrams: 200 });
  });

  it("fills in the required text fields", () => {
    for (const c of BREWSOUL_COFFEES) {
      for (const f of [c.name, c.producer, c.originCountry, c.variety, c.processingMethod]) expect(f.trim()).not.toBe("");
      expect(c.tastingNotes.length).toBeGreaterThan(0);
    }
  });

  it("keeps prices, weights and proxy scores in range", () => {
    for (const c of BREWSOUL_COFFEES) {
      expect(c.priceUsd).toBeGreaterThan(0);
      expect(c.unitGrams).toBeGreaterThan(0);
      expect(c.scarcityProxy).toBeGreaterThanOrEqual(0);
      expect(c.scarcityProxy).toBeLessThanOrEqual(100);
      expect(c.wowProxy).toBeGreaterThanOrEqual(0);
      expect(c.wowProxy).toBeLessThanOrEqual(100);
      // Commodity supermarket coffees are scored 0 on purpose.
      expect(c.varietyRarityScore).toBeGreaterThanOrEqual(0);
      expect(c.varietyRarityScore).toBeLessThanOrEqual(10);
      expect(c.weirdnessScore).toBeGreaterThanOrEqual(0);
      expect(c.weirdnessScore).toBeLessThanOrEqual(10);
      expect(["A", "B", "C", "D", "F"]).toContain(c.producerTransparencyGrade);
      if (c.cuppingScore !== undefined) {
        expect(c.cuppingScore).toBeGreaterThan(40);
        expect(c.cuppingScore).toBeLessThanOrEqual(100);
      }
    }
  });

  it("only uses the configured flavour axes, scored 0 to 10", () => {
    for (const c of BREWSOUL_COFFEES) {
      for (const [axis, value] of Object.entries(c.flavorProfile)) {
        expect(AXES).toContain(axis);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(10);
      }
    }
  });

  it("has https buy links and no Manus-hosted URLs", () => {
    for (const c of BREWSOUL_COFFEES) {
      for (const l of c.buyLinks) {
        expect(l.label.trim()).not.toBe("");
        expect(l.url).toMatch(/^https?:\/\//);
      }
      expect(JSON.stringify(c)).not.toMatch(MANUS);
    }
  });
});
