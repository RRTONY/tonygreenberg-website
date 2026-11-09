"use client";

import { useState } from "react";
import { questions } from "../data/taste-quiz.data";

// The taste quiz's ONE shared state (CONTRIBUTING rule 19): which step is showing (1 questions,
// 2 results), which question, and the answers so far. Same behaviour as the SoulSmoke app's
// TasteQuiz.tsx: an answer moves on after 300ms, the last answer opens the results.
export type TasteQuizState = {
  step: number;
  currentQuestion: number;
  answers: Record<string, number>;
};

const initialState: TasteQuizState = { step: 1, currentQuestion: 0, answers: {} };
const ADVANCE_MS = 300;

export function useTasteQuiz() {
  const [state, setState] = useState<TasteQuizState>(initialState);

  const onNext = (specificStep?: number) =>
    setState((prev) => ({ ...prev, step: specificStep ?? prev.step + 1 }));

  const answer = (dimension: string, value: number) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [dimension]: value } }));
    setTimeout(
      () =>
        setState((prev) =>
          prev.currentQuestion < questions.length - 1
            ? { ...prev, currentQuestion: prev.currentQuestion + 1 }
            : { ...prev, step: 2 },
        ),
      ADVANCE_MS,
    );
  };

  const back = () => setState((prev) => ({ ...prev, currentQuestion: Math.max(0, prev.currentQuestion - 1) }));

  const reset = () => setState(initialState);

  const progress = ((state.currentQuestion + 1) / questions.length) * 100;

  return { state, onNext, answer, back, reset, progress };
}
