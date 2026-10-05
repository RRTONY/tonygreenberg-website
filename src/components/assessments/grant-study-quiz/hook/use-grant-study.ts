"use client";

import { useEffect, useMemo, useState } from "react";
import { useJourneyProgress } from "@/components/assessments/journey-tracker";
import { FACTORS, QUESTIONS, getFactorScore } from "../data/grant-study.data";

// The Grant Study quiz's ONE shared state (CONTRIBUTING rule 19): the step
// (1 questions, 2 email gate, 3 results), the current question and the
// answers. Steps read it and call these actions.
export type GrantStudyState = {
  step: number;
  current: number;
  answers: Record<number, number>;
};

const initialState: GrantStudyState = { step: 1, current: 0, answers: {} };

export function useGrantStudy() {
  const [state, setState] = useState<GrantStudyState>(initialState);
  const { markComplete } = useJourneyProgress();

  const question = QUESTIONS[state.current];
  const isLast = state.current === QUESTIONS.length - 1;

  useEffect(() => {
    if (state.step === 3) markComplete("find-your-score");
  }, [state.step, markComplete]);

  const factorScores = useMemo(
    () => FACTORS.map((f) => ({ ...f, score: getFactorScore(state.answers, f.key) })),
    [state.answers],
  );
  const overall = Math.round(factorScores.reduce((sum, f) => sum + f.score, 0) / factorScores.length);

  return {
    state,
    question,
    factor: FACTORS.find((f) => f.key === question.factor)!,
    isLast,
    progress: ((state.current + 1) / QUESTIONS.length) * 100,
    factorScores,
    overall,
    select: (score: number) => setState((prev) => ({ ...prev, answers: { ...prev.answers, [question.id]: score } })),
    next: () => setState((prev) => (isLast ? { ...prev, step: 2 } : { ...prev, current: prev.current + 1 })),
    prev: () => setState((prev) => ({ ...prev, current: Math.max(0, prev.current - 1) })),
    unlock: () => setState((prev) => ({ ...prev, step: 3 })),
    retake: () => setState(initialState),
  };
}
