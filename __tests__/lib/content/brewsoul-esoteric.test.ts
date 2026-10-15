import { describe, expect, it } from "vitest";
import { ESOTERIC_COFFEES, ACQUISITION_PRIORITY, EXPLORER_SCORES, FINAL_OBSERVATION } from "@/lib/content/brewsoul-esoteric";

describe("brewsoul-esoteric", () => {
  it("has 9 coffees with unique ids across tiers 1 and 2", () => {
    expect(ESOTERIC_COFFEES).toHaveLength(9);
    expect(new Set(ESOTERIC_COFFEES.map((c) => c.id)).size).toBe(9);
    expect(ESOTERIC_COFFEES[0]).toMatchObject({ id: "panama-geisha", tier: 1, tierLabel: "The Holy Grail Coffees" });
    for (const c of ESOTERIC_COFFEES) expect([1, 2]).toContain(c.tier);
  });

  it("gives every coffee tasting notes, a 1-10 rarity and https buy sources", () => {
    for (const c of ESOTERIC_COFFEES) {
      expect(c.tastingNotes.length).toBeGreaterThan(0);
      expect(c.rarity).toBeGreaterThanOrEqual(1);
      expect(c.rarity).toBeLessThanOrEqual(10);
      // A coffee with no buy source must at least say how scarce it is.
      if (c.buySources.length === 0) expect(c.availability?.trim(), c.id).toBeTruthy();
      for (const s of [...c.buySources, ...(c.additionalSources ?? [])]) {
        expect(s.name.trim()).not.toBe("");
        expect(s.url).toMatch(/^https?:\/\//);
        expect(s.url).not.toMatch(/manuscdn|\/manus-storage\/|\/api\/img\//);
      }
    }
  });

  it("scores the same 10 coffees in the acquisition list and the scorecard", () => {
    expect(ACQUISITION_PRIORITY).toHaveLength(10);
    expect(new Set(ACQUISITION_PRIORITY).size).toBe(10);
    expect(EXPLORER_SCORES.map((s) => s.coffee).sort()).toEqual([...ACQUISITION_PRIORITY].sort());
    for (const s of EXPLORER_SCORES) {
      for (const v of [s.tasteShock, s.rarity, s.story, s.worthBuying]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(10);
      }
    }
  });

  it("documents a card for every ranked coffee except the known Laurina gap", () => {
    const names = ESOTERIC_COFFEES.map((c) => c.name.toLowerCase());
    const missing = ACQUISITION_PRIORITY.filter((n) => !names.some((x) => x.includes(n.toLowerCase().split(" ")[0])));
    expect(missing).toEqual(["Laurina"]);
  });

  it("ends with the genetics observation", () => {
    expect(FINAL_OBSERVATION).toContain("The real frontier is genetics.");
  });
});
