import { describe, it, expect } from "vitest";

/**
 * Tests for the Charity Scorecard data layer.
 * We import the data module and validate its structure, scoring logic, and completeness.
 */

// We need to test the data file which is in client/src/data — import it directly
// since vitest can resolve TypeScript imports
import {
  CHARITIES,
  STATS,
  ALL_SECTORS,
  SCORE_DIMENSIONS,
  EVALUATORS,
} from "../client/src/data/charityData";

describe("Charity Data Layer", () => {
  it("should have at least 100 charities", () => {
    expect(CHARITIES.length).toBeGreaterThanOrEqual(100);
  });

  it("should have charities sorted by totalScore descending", () => {
    for (let i = 1; i < CHARITIES.length; i++) {
      expect(CHARITIES[i - 1].totalScore).toBeGreaterThanOrEqual(CHARITIES[i].totalScore);
    }
  });

  it("every charity should have a unique slug", () => {
    const slugs = CHARITIES.map(c => c.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("every charity should have a unique name", () => {
    const names = CHARITIES.map(c => c.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it("every charity should have all 7 score dimensions", () => {
    const dimKeys = SCORE_DIMENSIONS.map(d => d.key);
    for (const charity of CHARITIES) {
      for (const key of dimKeys) {
        expect(charity.scores[key]).toBeDefined();
        expect(charity.scores[key]).toBeGreaterThanOrEqual(0);
        expect(charity.scores[key]).toBeLessThanOrEqual(100);
      }
    }
  });

  it("totalScore should be between 0 and 100 for all charities", () => {
    for (const charity of CHARITIES) {
      expect(charity.totalScore).toBeGreaterThanOrEqual(0);
      expect(charity.totalScore).toBeLessThanOrEqual(100);
    }
  });

  it("grade should match the totalScore range", () => {
    for (const charity of CHARITIES) {
      const s = charity.totalScore;
      const g = charity.grade;
      if (s >= 97) expect(g).toBe("A+");
      else if (s >= 93) expect(g).toBe("A");
      else if (s >= 90) expect(g).toBe("A-");
      else if (s >= 87) expect(g).toBe("B+");
      else if (s >= 83) expect(g).toBe("B");
      else if (s >= 80) expect(g).toBe("B-");
      else if (s >= 77) expect(g).toBe("C+");
      else if (s >= 73) expect(g).toBe("C");
      else if (s >= 70) expect(g).toBe("C-");
      else if (s >= 60) expect(g).toBe("D");
      else expect(g).toBe("F");
    }
  });

  it("cloakStatus should be one of the valid values", () => {
    const valid = ["clear", "mostly-clear", "hazy", "opaque"];
    for (const charity of CHARITIES) {
      expect(valid).toContain(charity.cloakStatus);
    }
  });

  it("every charity should have a valid website URL", () => {
    for (const charity of CHARITIES) {
      expect(charity.website).toMatch(/^https?:\/\//);
    }
  });

  it("every charity should have a non-empty tagline", () => {
    for (const charity of CHARITIES) {
      expect(charity.tagline.length).toBeGreaterThan(10);
    }
  });

  it("donationsM should be a positive number", () => {
    for (const charity of CHARITIES) {
      expect(charity.donationsM).toBeGreaterThan(0);
    }
  });

  it("founded year should be reasonable (1800-2025)", () => {
    for (const charity of CHARITIES) {
      expect(charity.founded).toBeGreaterThanOrEqual(1800);
      expect(charity.founded).toBeLessThanOrEqual(2025);
    }
  });
});

describe("Score Dimensions", () => {
  it("should have exactly 7 dimensions", () => {
    expect(SCORE_DIMENSIONS).toHaveLength(7);
  });

  it("dimension weights should sum to 100", () => {
    const total = SCORE_DIMENSIONS.reduce((sum, d) => sum + d.weight, 0);
    expect(total).toBe(100);
  });

  it("every dimension should have a non-empty description", () => {
    for (const dim of SCORE_DIMENSIONS) {
      expect(dim.description.length).toBeGreaterThan(20);
    }
  });
});

describe("Evaluators", () => {
  it("should have exactly 8 evaluators", () => {
    expect(EVALUATORS).toHaveLength(8);
  });

  it("every evaluator should have a valid URL", () => {
    for (const ev of EVALUATORS) {
      expect(ev.url).toMatch(/^https?:\/\//);
    }
  });

  it("every evaluator should have a limitation (gap) described", () => {
    for (const ev of EVALUATORS) {
      expect(ev.limitation.length).toBeGreaterThan(10);
    }
  });
});

describe("Stats", () => {
  it("totalCharities should match CHARITIES length", () => {
    expect(STATS.totalCharities).toBe(CHARITIES.length);
  });

  it("avgScore should be reasonable (50-95)", () => {
    expect(STATS.avgScore).toBeGreaterThanOrEqual(50);
    expect(STATS.avgScore).toBeLessThanOrEqual(95);
  });

  it("aTierCount should match charities with A grades", () => {
    const aCount = CHARITIES.filter(c => c.grade.startsWith("A")).length;
    expect(STATS.aTierCount).toBe(aCount);
  });

  it("opacityWarnings should match hazy + opaque charities", () => {
    const warnings = CHARITIES.filter(c => c.cloakStatus === "hazy" || c.cloakStatus === "opaque").length;
    expect(STATS.opacityWarnings).toBe(warnings);
  });
});

describe("ALL_SECTORS", () => {
  it("should contain all unique sectors from charities", () => {
    const fromCharities = new Set(CHARITIES.map(c => c.sector));
    expect(ALL_SECTORS.length).toBe(fromCharities.size);
    for (const sector of ALL_SECTORS) {
      expect(fromCharities.has(sector)).toBe(true);
    }
  });

  it("should be sorted alphabetically", () => {
    for (let i = 1; i < ALL_SECTORS.length; i++) {
      expect(ALL_SECTORS[i - 1].localeCompare(ALL_SECTORS[i])).toBeLessThanOrEqual(0);
    }
  });
});
