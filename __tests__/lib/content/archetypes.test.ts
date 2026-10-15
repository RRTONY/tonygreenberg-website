import { describe, expect, it } from "vitest";
import { ARCHETYPES, AUTHORITY_ITEMS, ASSESSMENT_QUESTIONS, type ArchetypeKey } from "@/lib/content/archetypes";
import { CATEGORY_ORDER } from "@/lib/content/articles-discovery";

const KEYS = Object.keys(ARCHETYPES) as ArchetypeKey[];

describe("archetypes", () => {
  it("defines exactly the builder, crusader and investor paths", () => {
    expect(KEYS.sort()).toEqual(["builder", "crusader", "investor"]);
    expect(ARCHETYPES.builder.name).toBe("The Builder");
    expect(ARCHETYPES.crusader.tagline).toBe("I Hold the Line");
  });

  it("gives every archetype an icon, copy and real blog categories", () => {
    for (const key of KEYS) {
      const a = ARCHETYPES[key];
      expect(a.icon).toBeTruthy();
      expect(a.description.length).toBeGreaterThan(50);
      expect(a.categories.length).toBeGreaterThan(0);
      for (const c of a.categories) expect(CATEGORY_ORDER).toContain(c);
    }
  });

  it("has 5 questions with unique ids, each offering one answer per archetype", () => {
    expect(ASSESSMENT_QUESTIONS.map((q) => q.id)).toEqual([1, 2, 3, 4, 5]);
    for (const q of ASSESSMENT_QUESTIONS) {
      expect(q.question.trim()).not.toBe("");
      expect(q.options.map((o) => o.archetype).sort()).toEqual(["builder", "crusader", "investor"]);
      for (const o of q.options) expect(o.text.trim()).not.toBe("");
    }
  });

  it("lists the authority badges", () => {
    expect(AUTHORITY_ITEMS).toContain("Forbes");
    expect(new Set(AUTHORITY_ITEMS).size).toBe(AUTHORITY_ITEMS.length);
  });
});
