import { describe, expect, it } from "vitest";
import {
  calculateQPR,
  getQPRBreakdown,
  getQPRLabel,
  getRarityLabel,
  getTimeToGlassLabel,
} from "@/lib/content/soulsmoke/qpr-engine";
import { allMezcals } from "@/lib/content/soulsmoke/mezcal-data";
import {
  enrichAllMezcals,
  getAllEnrichedMezcals,
  getAllFoodPairingCategories,
  getEnrichedMezcalByBrandExpression,
} from "@/lib/content/soulsmoke/mezcal-enriched";
import type { Rarity, TimeToGlass } from "@/lib/content/soulsmoke/mezcal-enriched";

describe("SoulSmoke QPR engine", () => {
  const bottles = getAllEnrichedMezcals();

  it("scores every bottle, and every part of its breakdown, between 0 and 10", () => {
    expect(bottles.length).toBe(allMezcals.length);
    for (const bottle of bottles) {
      expect(bottle.qpr).toBeGreaterThanOrEqual(0);
      expect(bottle.qpr).toBeLessThanOrEqual(10);
      // The breakdown rounds each part before adding them up, so its total can drift from the
      // single-pass score by a few tenths; the parts themselves stay on the 0-10 scale.
      const breakdown = getQPRBreakdown(bottle, allMezcals, "mexico");
      for (const value of Object.values(breakdown)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(10);
      }
    }
  });

  it("scores availability differently for the Mexico market", () => {
    const differs = bottles.some(
      (b) => calculateQPR(b, allMezcals, "us") !== calculateQPR(b, allMezcals, "mexico"),
    );
    expect(differs).toBe(true);
  });

  it("labels QPR bands", () => {
    expect(getQPRLabel(9).label).toBe("Extraordinary Value");
    expect(getQPRLabel(7.5).label).toBe("Strong Value");
    expect(getQPRLabel(6).label).toBe("Fair");
    expect(getQPRLabel(4.5).label).toBe("Questionable");
    expect(getQPRLabel(2).label).toBe("Avoid");
  });

  it("labels rarity and time to glass, with an Unknown fallback", () => {
    const rarities: Rarity[] = ["common", "uncommon", "rare", "very-rare", "legendary"];
    expect(rarities.map((r) => getRarityLabel(r).label)).toEqual([
      "Common",
      "Uncommon",
      "Rare",
      "Very Rare",
      "Legendary",
    ]);
    expect(getRarityLabel("other" as Rarity).label).toBe("Unknown");
    const times: TimeToGlass[] = ["same-day", "1-2-weeks", "1-3-months", "3-plus-months", "unknown"];
    expect(times.map(getTimeToGlassLabel)).toEqual(["Same Day", "1-2 Weeks", "1-3 Months", "3+ Months", "Unknown"]);
    expect(getTimeToGlassLabel("later" as TimeToGlass)).toBe("Unknown");
  });
});

describe("SoulSmoke enriched mezcal data", () => {
  it("caches the enriched list and matches a fresh build", () => {
    expect(getAllEnrichedMezcals()).toBe(getAllEnrichedMezcals());
    expect(enrichAllMezcals().map((b) => b.qpr)).toEqual(getAllEnrichedMezcals().map((b) => b.qpr));
  });

  it("lists food pairing categories once each, sorted", () => {
    const categories = getAllFoodPairingCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect([...categories].sort()).toEqual(categories);
    expect(new Set(categories).size).toBe(categories.length);
  });

  it("finds a bottle by brand and expression, ignoring case", () => {
    const first = getAllEnrichedMezcals()[0];
    expect(getEnrichedMezcalByBrandExpression(first.brand.toUpperCase(), first.name.toLowerCase())?.id).toBe(first.id);
    expect(getEnrichedMezcalByBrandExpression("No Such Brand", "Nothing")).toBeUndefined();
  });
});
