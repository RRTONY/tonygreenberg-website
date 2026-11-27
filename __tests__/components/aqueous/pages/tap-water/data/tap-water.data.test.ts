import { describe, expect, it } from "vitest";
import {
  defaultSurvey,
  profileDescriptions,
  scoreBarClass,
  surveyQuestions,
  urgencyFor,
} from "@/components/aqueous/pages/tap-water/data/tap-water.data";
import { getScoreColor } from "@/lib/content/aqueous/water-data";

describe("tap-water data", () => {
  it("has one question per survey answer", () => {
    expect(surveyQuestions.map((q) => q.key).sort()).toEqual(Object.keys(defaultSurvey).sort());
    expect(Object.keys(profileDescriptions)).toHaveLength(6);
  });

  it("grades urgency like the app", () => {
    expect([20, 40, 60, 80].map(urgencyFor)).toEqual(["critical", "high", "moderate", "low"]);
  });

  it("has a bar class for every score color", () => {
    for (const s of [95, 75, 60, 45, 10]) expect(scoreBarClass[getScoreColor(s)]).toMatch(/^bg-\[#/);
  });
});
