"use client";

import type { ReactNode } from "react";
import { StepQuestions } from "./components/step-questions";
import { StepResults } from "./components/step-results";
import { useTasteQuiz } from "./hook/use-taste-quiz";

// SoulSmoke taste quiz (/soul-smoke/taste-quiz), ported from the SoulSmoke app's
// client/src/pages/TasteQuiz.tsx. Built as a step registry (CONTRIBUTING rule 19): the one
// shared state is useTasteQuiz, each step is its own component, questions and copy are in data/.
// Each step keeps the app's own fixed header (it sits over the SoulSmoke menu, as on the app).
export type TasteQuizStepProps = { quiz: ReturnType<typeof useTasteQuiz> };

const STEPS: Record<number, (props: TasteQuizStepProps) => ReactNode> = {
  1: StepQuestions,
  2: StepResults,
};

export function TasteQuiz() {
  const quiz = useTasteQuiz();
  const Step = STEPS[quiz.state.step] ?? StepQuestions;
  return <Step quiz={quiz} />;
}
