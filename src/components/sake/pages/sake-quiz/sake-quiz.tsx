"use client";

import type { ReactNode } from "react";
import { useAesthetic } from "@/components/sake/sake-providers";
import { ritualPalette } from "@/components/sake/page-palettes";
import { useSakeQuiz, type SakeQuizState, type SakeQuizStep } from "@/components/sake/pages/sake-quiz/hook/use-sake-quiz";
import { StepQuestions } from "@/components/sake/pages/sake-quiz/components/step-questions";
import { StepResult } from "@/components/sake/pages/sake-quiz/components/step-result";

// Ported from the Sake app's client/src/pages/SakeQuiz.tsx (2026-11-26), "Your Sake Profile": seven
// questions that map to one of four sake profiles. Rebuilt as a step registry (CONTRIBUTING rule 19):
// questions (step 1) and result (step 2), one shared hook, copy in data/. Same copy, colors (the app's
// inline hex styles are page-palettes.ts ritualPalette) and scoring.

const STEPS: Record<SakeQuizStep, (props: { quiz: SakeQuizState }) => ReactNode> = {
  1: StepQuestions,
  2: StepResult,
};

export function SakeQuiz() {
  const { isAustere } = useAesthetic();
  const quiz = useSakeQuiz();
  const Step = STEPS[quiz.step];
  return (
    <div className={`min-h-screen pt-20 ${ritualPalette(isAustere).page}`}>
      <Step quiz={quiz} />
    </div>
  );
}
