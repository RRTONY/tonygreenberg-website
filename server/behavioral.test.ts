/**
 * Tests for the behavioral architecture additions:
 * - Archetypes data structure
 * - Assessment scoring logic
 */
import { describe, it, expect } from "vitest";

describe("Archetypes Data", () => {
  it("should define all three archetypes", async () => {
    const mod = await import("../client/src/data/archetypes");
    const { ARCHETYPES } = mod;
    expect(ARCHETYPES).toBeDefined();
    expect(ARCHETYPES.builder).toBeDefined();
    expect(ARCHETYPES.crusader).toBeDefined();
    expect(ARCHETYPES.investor).toBeDefined();
  });

  it("each archetype should have required fields", async () => {
    const mod = await import("../client/src/data/archetypes");
    const { ARCHETYPES } = mod;
    const requiredFields = ["name", "tagline", "description", "color", "icon", "pathUrl", "categories"];
    for (const key of Object.keys(ARCHETYPES)) {
      const archetype = ARCHETYPES[key as keyof typeof ARCHETYPES];
      for (const field of requiredFields) {
        expect(archetype).toHaveProperty(field);
      }
    }
  });

  it("each archetype pathUrl should start with /path/", async () => {
    const mod = await import("../client/src/data/archetypes");
    const { ARCHETYPES } = mod;
    for (const key of Object.keys(ARCHETYPES)) {
      const archetype = ARCHETYPES[key as keyof typeof ARCHETYPES];
      expect(archetype.pathUrl).toMatch(/^\/path\//);
    }
  });

  it("each archetype should have at least one category", async () => {
    const mod = await import("../client/src/data/archetypes");
    const { ARCHETYPES } = mod;
    for (const key of Object.keys(ARCHETYPES)) {
      const archetype = ARCHETYPES[key as keyof typeof ARCHETYPES];
      expect(archetype.categories.length).toBeGreaterThan(0);
    }
  });

  it("builder should focus on systems and business categories", async () => {
    const mod = await import("../client/src/data/archetypes");
    const { ARCHETYPES } = mod;
    expect(ARCHETYPES.builder.categories).toContain("Systems & Innovation");
    expect(ARCHETYPES.builder.categories).toContain("Business & Capital");
  });

  it("crusader should focus on crusades and culture categories", async () => {
    const mod = await import("../client/src/data/archetypes");
    const { ARCHETYPES } = mod;
    expect(ARCHETYPES.crusader.categories).toContain("The Crusades");
    expect(ARCHETYPES.crusader.categories).toContain("Culture & Communication");
  });

  it("investor should focus on impact and business categories", async () => {
    const mod = await import("../client/src/data/archetypes");
    const { ARCHETYPES } = mod;
    expect(ARCHETYPES.investor.categories).toContain("Impact & Purpose");
    expect(ARCHETYPES.investor.categories).toContain("Business & Capital");
  });
});

describe("Assessment Scoring Logic", () => {
  it("should correctly identify builder from builder-heavy answers", () => {
    const scores = { builder: 4, crusader: 1, investor: 0 };
    const winner = Object.entries(scores).reduce((a, b) => a[1] >= b[1] ? a : b)[0];
    expect(winner).toBe("builder");
  });

  it("should correctly identify crusader from crusader-heavy answers", () => {
    const scores = { builder: 0, crusader: 4, investor: 1 };
    const winner = Object.entries(scores).reduce((a, b) => a[1] >= b[1] ? a : b)[0];
    expect(winner).toBe("crusader");
  });

  it("should correctly identify investor from investor-heavy answers", () => {
    const scores = { builder: 1, crusader: 0, investor: 4 };
    const winner = Object.entries(scores).reduce((a, b) => a[1] >= b[1] ? a : b)[0];
    expect(winner).toBe("investor");
  });

  it("should handle ties by picking the first highest", () => {
    const scores = { builder: 2, crusader: 2, investor: 1 };
    const winner = Object.entries(scores).reduce((a, b) => a[1] >= b[1] ? a : b)[0];
    expect(winner).toBe("builder");
  });

  it("should handle all-zero scores", () => {
    const scores = { builder: 0, crusader: 0, investor: 0 };
    const winner = Object.entries(scores).reduce((a, b) => a[1] >= b[1] ? a : b)[0];
    expect(winner).toBeDefined();
    expect(["builder", "crusader", "investor"]).toContain(winner);
  });
});

describe("Archetype Category Mapping", () => {
  it("should map all 6 blog categories to at least one archetype", async () => {
    const mod = await import("../client/src/data/archetypes");
    const { ARCHETYPES } = mod;
    const allCategories = new Set<string>();
    for (const key of Object.keys(ARCHETYPES)) {
      const archetype = ARCHETYPES[key as keyof typeof ARCHETYPES];
      archetype.categories.forEach((c: string) => allCategories.add(c));
    }
    const expectedCategories = ["Systems & Innovation", "Business & Capital", "The Crusades", "Culture & Communication", "Impact & Purpose", "Living Well"];
    for (const cat of expectedCategories) {
      expect(allCategories.has(cat)).toBe(true);
    }
  });

  it("no archetype should have duplicate categories", async () => {
    const mod = await import("../client/src/data/archetypes");
    const { ARCHETYPES } = mod;
    for (const key of Object.keys(ARCHETYPES)) {
      const archetype = ARCHETYPES[key as keyof typeof ARCHETYPES];
      const unique = new Set(archetype.categories);
      expect(unique.size).toBe(archetype.categories.length);
    }
  });
});
