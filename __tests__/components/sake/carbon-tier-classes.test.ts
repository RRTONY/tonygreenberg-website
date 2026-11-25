import { describe, expect, it } from "vitest";
import { tierClasses } from "@/components/sake/carbon-tier-classes";
import { carbonTiers } from "@/lib/content/sake/supply-chain-engine";

describe("tierClasses", () => {
  it("has a literal class set for every carbon tier color", () => {
    for (const tier of carbonTiers) expect(tierClasses(tier.color).text).toBe(`text-[${tier.color}]`);
    expect(tierClasses("#22C55E").bg).toBe("bg-[#22c55e]");
  });

  it("falls back to the amber tier for an unknown color", () => {
    expect(tierClasses("#123456").text).toBe("text-[#eab308]");
  });
});
