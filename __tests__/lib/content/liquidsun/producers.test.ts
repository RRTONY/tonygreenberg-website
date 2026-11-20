import { describe, expect, it } from "vitest";
import {
  getCheapestBuyLink,
  getGateway,
  getLegends,
  getProducerById,
  getProducersByTier,
  getUnicorns,
  producers,
} from "@/lib/content/liquidsun/producers";
import { liquidsunTranslations } from "@/lib/content/liquidsun/translations";

describe("LiquidSun producers", () => {
  it("has the app's 30 bottles split into three tiers, each with a Sanity image", () => {
    expect(producers).toHaveLength(30);
    expect(getUnicorns().length + getLegends().length + getGateway().length).toBe(30);
    expect(getProducersByTier("Gateway")).toEqual(getGateway());
    for (const p of producers) expect(p.image.src).toMatch(/^https:\/\/cdn\.sanity\.io\//);
  });

  it("finds a bottle by id and its cheapest buy link", () => {
    const fortaleza = getProducerById("fortaleza-blanco")!;
    expect(fortaleza.brand).toBe("Fortaleza");
    expect(getProducerById("nope")).toBeUndefined();
    expect(getCheapestBuyLink(fortaleza)).toMatchObject({ retailer: "Old Town Tequila" });
    const many = { ...fortaleza, buyLinks: [{ retailer: "A", url: "a", price: 50 }, { retailer: "B", url: "b", price: 40 }] };
    expect(getCheapestBuyLink(many)?.retailer).toBe("B");
    expect(getCheapestBuyLink({ ...fortaleza, buyLinks: [] })).toBeNull();
  });

  it("has every English string in Spanish too", () => {
    expect(Object.keys(liquidsunTranslations.es).sort()).toEqual(Object.keys(liquidsunTranslations.en).sort());
  });
});
