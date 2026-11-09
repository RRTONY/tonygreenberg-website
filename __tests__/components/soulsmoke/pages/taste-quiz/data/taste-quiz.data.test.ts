import { describe, expect, it } from "vitest";
import { dimensionWeights, questions, tasteQuizData } from "@/components/soulsmoke/pages/taste-quiz/data/taste-quiz.data";

describe("taste quiz data", () => {
  it("has one question per flavor dimension, each with five EN/ES options", () => {
    expect(questions.map((q) => q.dimension)).toEqual(Object.keys(dimensionWeights));
    for (const q of questions) {
      expect(q.questionEs).toBeTruthy();
      expect(q.options.map((o) => o.value)).toEqual([2, 4, 6, 8, 10]);
      for (const o of q.options) expect(o.labelEs && o.descriptionEs).toBeTruthy();
    }
  });

  it("formats the question counter in both languages", () => {
    expect(tasteQuizData.en.questionOf(1, 8)).toBe("Question 1 of 8");
    expect(tasteQuizData.es.questionOf(2, 8)).toBe("Pregunta 2 de 8");
  });
});
