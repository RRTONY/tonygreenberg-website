import { describe, expect, it } from "vitest";
import {
  FACTORS,
  FACTOR_INSIGHTS,
  JOURNEY_CONTINUES,
  QUESTIONS,
  barClassForScore,
  getFactorInsight,
  getFactorScore,
  grantStudyData,
} from "@/components/assessments/grant-study-quiz/data/grant-study.data";

describe("grant-study data", () => {
  it("has 25 questions, 5 per factor, unique ids, each with options scored 1-10", () => {
    expect(QUESTIONS).toHaveLength(25);
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(25);
    for (const f of FACTORS) expect(QUESTIONS.filter((q) => q.factor === f.key)).toHaveLength(5);
    for (const q of QUESTIONS) {
      expect(FACTORS.some((f) => f.key === q.factor)).toBe(true);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(new Set(q.options.map((o) => o.text)).size).toBe(q.options.length);
      for (const o of q.options) {
        expect(o.score).toBeGreaterThanOrEqual(1);
        expect(o.score).toBeLessThanOrEqual(10);
      }
    }
  });

  it("has a low, mid and high insight for every factor", () => {
    for (const f of FACTORS) {
      for (const tier of ["low", "mid", "high"] as const) expect(FACTOR_INSIGHTS[f.key][tier]).toBeTruthy();
    }
  });

  it("getFactorScore averages only the answered questions of that factor, as a percent of 10", () => {
    expect(getFactorScore({}, "relationships")).toBe(0);
    expect(getFactorScore({ 1: 10, 2: 5 }, "relationships")).toBe(75);
    expect(getFactorScore({ 1: 10, 2: 5, 6: 1 }, "coping")).toBe(10);
    expect(getFactorScore({ 1: 3, 2: 3, 3: 3, 4: 3, 5: 4 }, "relationships")).toBe(32);
  });

  it("getFactorInsight picks the tier at the 40 and 70 boundaries", () => {
    expect(getFactorInsight("health", 39)).toBe(FACTOR_INSIGHTS.health.low);
    expect(getFactorInsight("health", 40)).toBe(FACTOR_INSIGHTS.health.mid);
    expect(getFactorInsight("health", 69)).toBe(FACTOR_INSIGHTS.health.mid);
    expect(getFactorInsight("health", 70)).toBe(FACTOR_INSIGHTS.health.high);
  });

  it("barClassForScore returns a full literal class per tier", () => {
    expect(barClassForScore(70)).toContain("from-[#2E8B57]");
    expect(barClassForScore(40)).toContain("from-brand-gold");
    expect(barClassForScore(39)).toContain("from-[#8B4513]");
  });

  it("the Journey Continues links are internal paths and copy helpers format", () => {
    for (const j of JOURNEY_CONTINUES) expect(j.url).toMatch(/^\//);
    expect(grantStudyData.questionOf(2, 25)).toBe("Question 2 of 25");
  });
});
