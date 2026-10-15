import { describe, expect, it } from "vitest";
import { ECOSYSTEM_PHASES } from "@/lib/content/ecosystem-map";
import { JOURNEY_MAP } from "@/components/assessments/journey-tracker";

const EXPERIENCES = ECOSYSTEM_PHASES.flatMap((p) => p.experiences);

describe("ecosystem-map", () => {
  it("has 6 phases numbered 1..6 with their copy", () => {
    expect(ECOSYSTEM_PHASES.map((p) => p.number)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(ECOSYSTEM_PHASES[0].title).toBe("The Foundation");
    for (const p of ECOSYSTEM_PHASES) {
      for (const f of [p.title, p.subtitle, p.description]) expect(f.trim()).not.toBe("");
      expect(p.experiences.length).toBeGreaterThan(0);
    }
  });

  it("lists each experience once, with a time in minutes", () => {
    const ids = EXPERIENCES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of EXPERIENCES) {
      expect(e.time).toMatch(/^\d+ min$/);
      expect(e.description.trim()).not.toBe("");
    }
  });

  it("resolves every experience in the shared JOURNEY_MAP except the 6 former manus.space sites", () => {
    // These have no link source any more, so the map shows them as plain cards.
    const known = new Set(JOURNEY_MAP.map((j) => j.id));
    const unlinked = EXPERIENCES.filter((e) => !known.has(e.id)).map((e) => e.id);
    expect(unlinked.sort()).toEqual([
      "find-your-capital", "find-your-chemistry", "find-your-mezcal", "find-your-partner", "find-your-tequila", "find-your-water",
    ]);
  });
});
