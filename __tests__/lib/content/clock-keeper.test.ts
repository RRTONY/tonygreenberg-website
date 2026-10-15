import { describe, expect, it } from "vitest";
import { CLOCK_KEEPER_QUESTIONS, CLOCK_KEEPER_MODES } from "@/lib/content/clock-keeper";

describe("clock-keeper", () => {
  it("has the five questions q1..q5 numbered 1..5", () => {
    expect(CLOCK_KEEPER_QUESTIONS.map((q) => q.key)).toEqual(["q1", "q2", "q3", "q4", "q5"]);
    expect(CLOCK_KEEPER_QUESTIONS.map((q) => q.num)).toEqual([1, 2, 3, 4, 5]);
    expect(CLOCK_KEEPER_QUESTIONS[4].title).toBe("The Offering");
  });

  it("gives every question a title, prompt and placeholder", () => {
    for (const q of CLOCK_KEEPER_QUESTIONS) {
      expect(q.title.trim()).not.toBe("");
      expect(q.prompt.length).toBeGreaterThan(40);
      expect(q.placeholder.trim()).not.toBe("");
    }
  });

  it("has five unique response modes", () => {
    expect(CLOCK_KEEPER_MODES.map((m) => m.id)).toEqual(["direct", "meta", "reframe", "jazz", "minimum"]);
    for (const m of CLOCK_KEEPER_MODES) expect(m.label && m.desc).toBeTruthy();
  });
});
