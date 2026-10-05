"use client";

import { useState } from "react";
import { QUESTIONS } from "../data/brewsoul-quiz.data";

// The quiz's ONE shared state (same shape as FydoPartner's sign-in flow):
// which step is showing, which question, the answers so far, and whether the
// question is faded in. Steps read it and call these actions; nothing else
// holds quiz state.
export type QuizState = {
  step: number;
  questionIndex: number;
  answers: Record<string, number>;
  visible: boolean;
};

const initialState: QuizState = { step: 1, questionIndex: 0, answers: {}, visible: true };
const FADE_MS = 250;

export function useBrewSoulQuiz() {
  const [state, setState] = useState<QuizState>(initialState);

  const updateState = (data: Partial<QuizState>) => setState((prev) => ({ ...prev, ...data }));

  const onNext = (specificStep?: number) =>
    setState((prev) => ({ ...prev, step: specificStep ?? prev.step + 1 }));

  // Fade the current question out, apply the change, fade back in.
  const withFade = (change: (prev: QuizState) => Partial<QuizState>) => {
    updateState({ visible: false });
    setTimeout(() => setState((prev) => ({ ...prev, ...change(prev), visible: true })), FADE_MS);
  };

  const answer = (dim: string, score: number) =>
    withFade((prev) => {
      const answers = { ...prev.answers, [dim]: score };
      const isLast = prev.questionIndex >= QUESTIONS.length - 1;
      return isLast ? { answers, step: prev.step + 1 } : { answers, questionIndex: prev.questionIndex + 1 };
    });

  const back = () => withFade((prev) => ({ questionIndex: Math.max(0, prev.questionIndex - 1) }));

  const reset = () => setState(initialState);

  const progress = state.step > 1 ? 100 : (state.questionIndex / QUESTIONS.length) * 100;

  return { state, updateState, onNext, answer, back, reset, progress };
}
