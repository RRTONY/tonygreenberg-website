import { describe, expect, it } from "vitest";

/**
 * BrewSoul Data Integrity Tests
 *
 * Validates the coffee catalog and chain rankings data structures,
 * scoring logic, and identity-matching profiles.
 */

// We test the data files directly since they're pure TypeScript data
// Import paths are relative to the server directory
describe("BrewSoul Coffee Catalog", () => {
  it("has at least 100 coffees in the catalog", async () => {
    const { COFFEES } = await import("../client/src/data/brewsoul-coffees");
    expect(COFFEES.length).toBeGreaterThanOrEqual(100);
  });

  it("every coffee has required fields", async () => {
    const { COFFEES } = await import("../client/src/data/brewsoul-coffees");
    for (const c of COFFEES) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.producer).toBeTruthy();
      expect(c.originCountry).toBeTruthy();
      expect(c.variety).toBeTruthy();
      expect(c.processingMethod).toBeTruthy();
      expect(c.roastLevel).toBeTruthy();
      expect(typeof c.cuppingScore).toBe("number");
      expect(c.cuppingScore).toBeGreaterThanOrEqual(0);
      expect(c.cuppingScore).toBeLessThanOrEqual(100);
    }
  });

  it("has no duplicate coffee IDs", async () => {
    const { COFFEES } = await import("../client/src/data/brewsoul-coffees");
    const ids = COFFEES.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("every coffee has valid flavor profile axes", async () => {
    const { COFFEES } = await import("../client/src/data/brewsoul-coffees");
    const validAxes = ["acidity", "body", "sweetness", "complexity", "fruitiness", "chocolate"];
    for (const c of COFFEES) {
      expect(c.flavorProfile).toBeTruthy();
      for (const axis of validAxes) {
        const val = (c.flavorProfile as Record<string, number>)[axis];
        expect(typeof val).toBe("number");
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(10);
      }
    }
  });

  it("has both high and low scoring coffees", async () => {
    const { COFFEES } = await import("../client/src/data/brewsoul-coffees");
    const highScoring = COFFEES.filter(c => c.cuppingScore >= 90);
    const lowScoring = COFFEES.filter(c => c.cuppingScore < 70);
    expect(highScoring.length).toBeGreaterThan(0);
    expect(lowScoring.length).toBeGreaterThan(0);
  });

  it("every coffee has tasting notes array", async () => {
    const { COFFEES } = await import("../client/src/data/brewsoul-coffees");
    for (const c of COFFEES) {
      expect(Array.isArray(c.tastingNotes)).toBe(true);
      expect(c.tastingNotes!.length).toBeGreaterThan(0);
    }
  });
});

describe("BrewSoul Chain Rankings", () => {
  it("has exactly 100 chains", async () => {
    const { CHAIN_RANKINGS } = await import("../client/src/data/brewsoul-chains");
    expect(CHAIN_RANKINGS.length).toBe(100);
  });

  it("chains are ranked 1-100 in order", async () => {
    const { CHAIN_RANKINGS } = await import("../client/src/data/brewsoul-chains");
    for (let i = 0; i < CHAIN_RANKINGS.length; i++) {
      expect(CHAIN_RANKINGS[i].rank).toBe(i + 1);
    }
  });

  it("every chain has required scoring dimensions", async () => {
    const { CHAIN_RANKINGS } = await import("../client/src/data/brewsoul-chains");
    for (const chain of CHAIN_RANKINGS) {
      expect(chain.name).toBeTruthy();
      expect(chain.type).toBeTruthy();
      expect(typeof chain.scores.value).toBe("number");
      expect(typeof chain.scores.experience).toBe("number");
      expect(typeof chain.scores.sourcingEthics).toBe("number");
      expect(typeof chain.scores.consistency).toBe("number");
      expect(typeof chain.scores.coffeeQuality).toBe("number");
      expect(typeof chain.aggregate).toBe("number");
      // All individual scores should be between 0 and 10
      for (const [, val] of Object.entries(chain.scores)) {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(10);
      }
      // Aggregate should be between 0 and 100
      expect(chain.aggregate).toBeGreaterThanOrEqual(0);
      expect(chain.aggregate).toBeLessThanOrEqual(100);
    }
  });

  it("chains are generally sorted by aggregate score descending", async () => {
    const { CHAIN_RANKINGS } = await import("../client/src/data/brewsoul-chains");
    // Top 10 should have higher aggregate than bottom 10
    const top10Avg = CHAIN_RANKINGS.slice(0, 10).reduce((s, c) => s + c.aggregate, 0) / 10;
    const bottom10Avg = CHAIN_RANKINGS.slice(-10).reduce((s, c) => s + c.aggregate, 0) / 10;
    expect(top10Avg).toBeGreaterThan(bottom10Avg);
  });

  it("has no duplicate chain names", async () => {
    const { CHAIN_RANKINGS } = await import("../client/src/data/brewsoul-chains");
    const names = CHAIN_RANKINGS.map(c => c.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it("every chain has headquarters and location count is a number", async () => {
    const { CHAIN_RANKINGS } = await import("../client/src/data/brewsoul-chains");
    for (const chain of CHAIN_RANKINGS) {
      expect(typeof chain.locations).toBe("number");
      expect(chain.locations).toBeGreaterThanOrEqual(0);
      expect(chain.hq).toBeTruthy();
    }
  });
});
