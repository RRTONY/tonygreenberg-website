import { describe, expect, it } from "vitest";
import { FRIEND_SURVEY_QUESTIONS, TRUST_QUOTE, BETTER_SAFE_QUOTE, FRIEND_GATE_FOOTER } from "@/lib/content/friend-gate";

describe("friend-gate survey", () => {
  it("has six questions q1..q6", () => {
    expect(FRIEND_SURVEY_QUESTIONS.map((q) => q.id)).toEqual(["q1", "q2", "q3", "q4", "q5", "q6"]);
    for (const q of FRIEND_SURVEY_QUESTIONS) expect(q.question.trim() && q.hint.trim()).toBeTruthy();
  });

  it("uses four 5-point scales, then the verdict, then an optional note", () => {
    expect(FRIEND_SURVEY_QUESTIONS.map((q) => q.type)).toEqual(["scale", "scale", "scale", "scale", "verdict", "text"]);
    for (const q of FRIEND_SURVEY_QUESTIONS) if (q.type === "scale") expect(q.labels).toHaveLength(5);
    const verdict = FRIEND_SURVEY_QUESTIONS[4];
    expect(verdict.type === "verdict" && verdict.options.map((o) => o.value)).toEqual(["support", "wait", "unsure"]);
    expect(FRIEND_SURVEY_QUESTIONS[5].question).toContain("Optional");
  });

  it("has the real quotes and footer", () => {
    expect(TRUST_QUOTE).toMatch(/^You are not just you\./);
    expect(BETTER_SAFE_QUOTE).toContain("Better nothing than disaster is love.");
    expect(FRIEND_GATE_FOOTER).toContain("Only Time Buys Trust");
  });
});
