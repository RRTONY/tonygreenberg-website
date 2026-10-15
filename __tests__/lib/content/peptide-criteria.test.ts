import { describe, expect, it } from "vitest";
import { CRITERIA } from "@/lib/content/peptide-criteria";

describe("peptide-criteria", () => {
  it("has the 6 clinical criteria with unique keys", () => {
    expect(CRITERIA.map((c) => c.key)).toEqual(["contraindications", "medicalHistory", "personalized", "evidence", "goals", "disclaimer"]);
  });

  it("weights them to exactly 100, heaviest first", () => {
    expect(CRITERIA.reduce((s, c) => s + c.weight, 0)).toBe(100);
    const weights = CRITERIA.map((c) => c.weight);
    expect(weights).toEqual([...weights].sort((a, b) => b - a));
  });

  it("phrases every description as a question", () => {
    for (const c of CRITERIA) {
      expect(c.label.trim()).not.toBe("");
      expect(c.description.endsWith("?")).toBe(true);
    }
  });
});
