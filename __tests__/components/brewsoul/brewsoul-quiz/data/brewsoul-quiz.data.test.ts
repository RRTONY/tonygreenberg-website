import { describe, expect, it } from "vitest";
import { QUESTIONS, quizData } from "@/components/brewsoul/brewsoul-quiz/data/brewsoul-quiz.data";

describe("brewsoul-quiz data", () => {
  it("has seven questions, matching the intro's promise", () => {
    expect(QUESTIONS).toHaveLength(7);
    expect(quizData.intro.titleLine1).toBe("Seven questions.");
  });

  it("each question has a unique dimension, an icon and at least 4 options", () => {
    expect(new Set(QUESTIONS.map((q) => q.dim)).size).toBe(QUESTIONS.length);
    for (const q of QUESTIONS) {
      expect(q.q.trim()).not.toBe("");
      expect(q.icon).toBeTruthy();
      expect(q.opts.length).toBeGreaterThanOrEqual(4);
      expect(new Set(q.opts.map((o) => o.text)).size).toBe(q.opts.length);
    }
  });

  it("covers the five flavour dimensions the scoring uses, plus budget", () => {
    const dims = QUESTIONS.map((q) => q.dim);
    for (const d of ["acidity", "body", "sweetness", "complexity", "fruitiness", "budget"]) expect(dims).toContain(d);
  });

  it("flavour scores stay on the 0-10 scale", () => {
    const scores = QUESTIONS.filter((x) => x.dim !== "budget").flatMap((q) => q.opts.map((o) => o.score));
    expect(Math.min(...scores)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...scores)).toBeLessThanOrEqual(10);
  });

  it("puts the live catalog count in the intro copy", () => {
    expect(quizData.intro.body(107)).toContain("our catalog of 107 scored beans");
  });
});
