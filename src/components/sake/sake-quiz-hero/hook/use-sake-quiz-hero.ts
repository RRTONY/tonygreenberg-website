"use client";

import { useCallback, useMemo, useState } from "react";
import { getRecommendations, sakeQuizHeroData } from "@/components/sake/sake-quiz-hero/data/sake-quiz-hero.data";

// The one shared state of the homepage quiz (the app's SakeQuizHero step + answers): step 0 is the
// intro, 1-3 the questions, 4 the results.

export const QUESTION_COUNT = sakeQuizHeroData.questions.length;
export const RESULTS_STEP = QUESTION_COUNT + 1;

export function useSakeQuizHero() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const start = useCallback(() => setStep(1), []);
  const answer = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setStep((prev) => prev + 1);
  }, []);
  const reset = useCallback(() => {
    setStep(0);
    setAnswers({});
  }, []);

  const recommendations = useMemo(() => (step < RESULTS_STEP ? [] : getRecommendations(answers)), [step, answers]);
  const question = step >= 1 && step <= QUESTION_COUNT ? sakeQuizHeroData.questions[step - 1] : null;

  return { step, answers, question, recommendations, start, answer, reset };
}

export type SakeQuizHeroState = ReturnType<typeof useSakeQuizHero>;
