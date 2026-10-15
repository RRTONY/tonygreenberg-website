import { describe, expect, it } from "vitest";
import { ASSESSMENTS } from "@/lib/content/assessments-hub";

describe("assessments-hub", () => {
  it("lists the three deep instruments in order", () => {
    expect(ASSESSMENTS.map((a) => a.slug)).toEqual(["dharma-finder", "consciousness-scale", "grant-study"]);
    expect(ASSESSMENTS[2].title).toBe("The Grant Study Assessment");
  });

  it("has every required field filled in", () => {
    for (const a of ASSESSMENTS) {
      for (const field of [a.title, a.subtitle, a.description, a.time]) expect(field.trim()).not.toBe("");
      expect(a.icon).toBeTruthy();
      expect(a.slug).not.toMatch(/^\//);
    }
  });

  it("uses complete literal Tailwind accent classes", () => {
    for (const a of ASSESSMENTS) {
      expect(a.accentText).toMatch(/^text-\[#[0-9A-Fa-f]{6}\]$/);
      expect(a.iconBox).toMatch(/^border-\[#[0-9A-Fa-f]{6}\]\/20 text-\[#[0-9A-Fa-f]{6}\]$/);
      expect(a.cardHover).toMatch(/^hover:border-\[#[0-9A-Fa-f]{6}\] /);
      const hex = a.accentText.slice(6, 13);
      expect(a.iconBox).toContain(hex);
      expect(a.cardHover).toContain(hex);
    }
  });
});
