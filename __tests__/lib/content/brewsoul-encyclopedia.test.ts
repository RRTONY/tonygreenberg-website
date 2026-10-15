import { describe, expect, it } from "vitest";
import * as enc from "@/lib/content/brewsoul-encyclopedia";
import {
  VARIETIES, ROASTERS, FARMS, PROCESSING_METHODS, SHAME_ENTRIES, EXPERIENCES, GLOSSARY, HEALTH_CLAIMS,
  PAIRINGS, FLIGHTS, QUIZ_QUESTIONS, IDENTITIES, DOLLAR_BREAKDOWNS,
} from "@/lib/content/brewsoul-encyclopedia";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";

const MANUS = /manuscdn|\/manus-storage\/|\/api\/img\//;
const COFFEE_IDS = new Set(BREWSOUL_COFFEES.map((c) => c.id));

describe("brewsoul-encyclopedia", () => {
  it("has non-empty datasets with no Manus URLs", () => {
    const sets = { VARIETIES, ROASTERS, FARMS, PROCESSING_METHODS, SHAME_ENTRIES, EXPERIENCES, GLOSSARY, HEALTH_CLAIMS, PAIRINGS, FLIGHTS, QUIZ_QUESTIONS, IDENTITIES, DOLLAR_BREAKDOWNS };
    for (const [name, list] of Object.entries(sets)) expect(list.length, name).toBeGreaterThan(0);
    expect(VARIETIES.length).toBeGreaterThanOrEqual(25);
    expect(JSON.stringify(enc)).not.toMatch(MANUS);
  });

  it("uses unique ids inside every dataset that has ids", () => {
    for (const [name, list] of Object.entries(enc)) {
      if (!Array.isArray(list)) continue;
      const ids = (list as { id?: string }[]).map((x) => x.id).filter(Boolean);
      if (ids.length) expect(new Set(ids).size, name).toBe(ids.length);
    }
  });

  it("has unique glossary terms and pairing origins", () => {
    const terms = GLOSSARY.map((g) => g.term.toLowerCase());
    expect(new Set(terms).size).toBe(terms.length);
    const origins = PAIRINGS.map((p) => p.origin);
    expect(new Set(origins).size).toBe(origins.length);
    for (const p of PAIRINGS) expect(p.foods.length).toBeGreaterThan(0);
  });

  it("builds every flight from coffees that are in the catalog", () => {
    for (const f of FLIGHTS) {
      expect(f.coffeeIds.length).toBeGreaterThan(0);
      for (const id of f.coffeeIds) expect(COFFEE_IDS.has(id), `${f.id} -> ${id}`).toBe(true);
      expect(f.priceUsd).toBeGreaterThan(0);
    }
  });

  it("recommends only catalog coffees in identity results", () => {
    for (const i of IDENTITIES) for (const id of i.topCoffeeIds ?? []) expect(COFFEE_IDS.has(id), `${i.id} -> ${id}`).toBe(true);
  });

  it("asks quiz questions on screens 1..n with unique option values", () => {
    expect(QUIZ_QUESTIONS.map((q) => q.screen)).toEqual(QUIZ_QUESTIONS.map((_, i) => i + 1));
    for (const q of QUIZ_QUESTIONS) {
      const values = (q.options ?? []).map((o) => o.value);
      expect(new Set(values).size).toBe(values.length);
      for (const o of q.options ?? []) expect(o.tag, `${q.id}:${o.value}`).toBeTruthy();
    }
  });

  it("splits every dollar breakdown into 100% with the farmer's dollars matching their share", () => {
    for (const d of DOLLAR_BREAKDOWNS) {
      expect(d.farmerPct + d.exporterPct + d.importerPct + d.roasterPct + d.retailerPct).toBe(100);
      expect(d.farmerDollars).toBeCloseTo((d.farmerPct / 100) * d.totalPrice, 2);
    }
    expect(DOLLAR_BREAKDOWNS[0]).toMatchObject({ farmerDollars: 0.4, totalPrice: 8 });
  });
});
