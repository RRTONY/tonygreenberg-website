import { describe, expect, it } from "vitest";
import { CHAIN_RANKINGS } from "@/lib/content/brewsoul-chains";

// Tier cut-offs read off the legacy computed data.
function tierFor(aggregate: number) {
  if (aggregate >= 85) return "S";
  if (aggregate >= 72) return "A";
  if (aggregate >= 58) return "B";
  if (aggregate >= 43) return "C";
  if (aggregate >= 30) return "D";
  return "F";
}

describe("brewsoul-chains", () => {
  it("ranks 100 chains 1..100 with unique ids", () => {
    expect(CHAIN_RANKINGS).toHaveLength(100);
    expect(CHAIN_RANKINGS.map((c) => c.rank)).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
    const ids = CHAIN_RANKINGS.map((c) => c.id);
    expect(new Set(ids).size).toBe(100);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("puts Counter Culture first with an S tier", () => {
    expect(CHAIN_RANKINGS[0]).toMatchObject({ id: "counter-culture", name: "Counter Culture Coffee", aggregate: 88, tier: "S" });
  });

  it("keeps every dimension score between 0 and 10 and aggregate between 0 and 100", () => {
    for (const c of CHAIN_RANKINGS) {
      for (const s of Object.values(c.scores)) {
        expect(Number.isInteger(s)).toBe(true);
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(10);
      }
      expect(c.aggregate).toBeGreaterThanOrEqual(0);
      expect(c.aggregate).toBeLessThanOrEqual(100);
    }
  });

  it("gives each chain the tier its aggregate earns", () => {
    for (const c of CHAIN_RANKINGS) expect({ id: c.id, tier: c.tier }).toEqual({ id: c.id, tier: tierFor(c.aggregate) });
  });

  it("has the required text fields and a real website for every chain", () => {
    for (const c of CHAIN_RANKINGS) {
      expect(c.name.trim()).not.toBe("");
      expect(c.verdict.trim()).not.toBe("");
      expect(c.priceRange.trim()).not.toBe("");
      // Two generic stand-ins (not real brands) have no website.
      if (["gas-station-generic", "hotel-lobby-coffee"].includes(c.id)) expect(c.website).toBe("");
      else expect(c.website).toMatch(/^https?:\/\//);
      expect(["specialty", "premium", "mass-market", "fast-food"]).toContain(c.type);
      expect(c.verdict).not.toMatch(/B Corp/);
    }
  });
});
