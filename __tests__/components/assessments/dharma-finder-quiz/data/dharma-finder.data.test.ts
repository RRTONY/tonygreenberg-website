import { describe, expect, it } from "vitest";
import {
  ALL_QUESTIONS,
  INTERSTITIAL_QUOTES,
  SECTIONS,
  TOTAL,
  dharmaData,
  generateDharmaProfile,
  sectionOf,
} from "@/components/assessments/dharma-finder-quiz/data/dharma-finder.data";

describe("dharma-finder data", () => {
  it("has 25 questions in 4 parts with unique ids 1..25 in order", () => {
    expect(SECTIONS).toHaveLength(4);
    expect(TOTAL).toBe(25);
    expect(ALL_QUESTIONS.map((q) => q.id)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
    for (const s of SECTIONS) {
      expect(s.title).toBeTruthy();
      expect(s.quote.text).toBeTruthy();
      expect(s.quote.author).toBeTruthy();
      expect(s.questions.length).toBeGreaterThan(0);
      for (const q of s.questions) expect(q.text.trim()).not.toBe("");
    }
    expect(INTERSTITIAL_QUOTES.length).toBeGreaterThan(0);
  });

  it("sectionOf maps each question index to its part and that part's first index", () => {
    expect(sectionOf(0)).toEqual({ section: 0, start: 0 });
    expect(sectionOf(7)).toEqual({ section: 0, start: 0 });
    expect(sectionOf(8)).toEqual({ section: 1, start: 8 });
    expect(sectionOf(17)).toEqual({ section: 2, start: 17 });
    expect(sectionOf(24)).toEqual({ section: 3, start: 24 });
    expect(sectionOf(99)).toEqual({ section: 3, start: 24 });
  });

  it("falls back to Seeker and deep-values when nothing matches", () => {
    const p = generateDharmaProfile({});
    expect(p.archetypes).toEqual(["Seeker — your path is still crystallizing"]);
    expect(p.coreValues).toEqual(["Your values run deep — they may resist easy categorization"]);
    expect(p.completionDepth).toBe(0);
    expect(p.totalAnswered).toBe(0);
  });

  it("matches capacity keywords only in questions 1-8 and value keywords only in 9-17, capped at 3 and 4", () => {
    const p = generateDharmaProfile({
      1: "create, teach, heal, lead, research",
      9: "justice, nature, truth, love, freedom",
      18: "   ",
    });
    expect(p.archetypes).toEqual(["Creator / Builder", "Guide / Teacher", "Healer / Caretaker"]);
    expect(p.coreValues).toEqual(["Justice & Equity", "Ecological Stewardship", "Truth & Authenticity", "Love & Compassion"]);
    expect(p.totalAnswered).toBe(2);
    expect(p.completionDepth).toBe(Math.round((2 / 25) * 100));
  });

  it("ignores value words written in the capacities part", () => {
    const p = generateDharmaProfile({ 2: "justice" });
    expect(p.coreValues).toEqual(["Your values run deep — they may resist easy categorization"]);
  });

  it("formats the part and question labels", () => {
    expect(dharmaData.partOf(2, 4, "Values")).toBe("Part 2 of 4 · Values");
    expect(dharmaData.questionOf(3, 25)).toBe("Question 3 of 25");
    expect(dharmaData.creditHref).toMatch(/^https:\/\//);
  });
});
