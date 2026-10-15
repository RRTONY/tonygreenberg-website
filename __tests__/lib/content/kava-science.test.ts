import { describe, expect, it } from "vitest";
import { KAVALACTONES, COMBINED_PROFILE } from "@/lib/content/kava-science";

describe("kava-science", () => {
  it("lists the 6 major kavalactones numbered 1..6 with unique abbreviations", () => {
    expect(KAVALACTONES.map((k) => k.num)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(KAVALACTONES.map((k) => k.abbrev)).toEqual(["DMY", "DHK", "Y", "K", "DHM", "M"]);
    expect(KAVALACTONES[3].name).toBe("Kavain");
  });

  it("gives every kavalactone mechanisms, PRI relevance and a full tone class set", () => {
    for (const k of KAVALACTONES) {
      expect(k.mechanisms.length).toBeGreaterThan(0);
      expect(k.priRelevance.trim()).not.toBe("");
      expect(k.tone.solid).toMatch(/^bg-/);
      expect(k.tone.text).toMatch(/^text-/);
      expect(k.tone.border).toMatch(/border-/);
      expect(k.tone.panel.trim()).not.toBe("");
    }
  });

  it("has the combined pharmacology profile", () => {
    expect(COMBINED_PROFILE).toHaveLength(11);
    expect(COMBINED_PROFILE.some((p) => p.includes("ALL 6 major kavalactones"))).toBe(true);
  });
});
