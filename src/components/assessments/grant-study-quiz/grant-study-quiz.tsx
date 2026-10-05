"use client";

import type { ReactNode } from "react";
import { StepGate } from "./components/step-gate";
import { StepQuestions } from "./components/step-questions";
import { StepResults } from "./components/step-results";
import { useGrantStudy } from "./hook/use-grant-study";

// /grant-study, built as a step registry (CONTRIBUTING rule 19): this parent
// holds only the registry and the shared progress bar; the one shared state
// is in useGrantStudy; each step is its own component; copy is in data/.
// Matches live (2026-10-06): it opens straight on question 1.
export type StepProps = { quiz: ReturnType<typeof useGrantStudy> };

const STEPS: Record<number, (props: StepProps) => ReactNode> = {
  1: StepQuestions,
  2: StepGate,
  3: StepResults,
};

export function GrantStudyQuiz() {
  const quiz = useGrantStudy();
  const Step = STEPS[quiz.state.step] ?? StepQuestions;

  return (
    <>
      {quiz.state.step === 1 && (
        <div className="fixed inset-x-0 top-0 z-50 h-0.75 bg-brand-gold/10">
          <div
            className="h-full bg-linear-to-r from-[#2E8B57] to-brand-gold-light transition-[width] duration-500"
            style={{ width: `${quiz.progress}%` }}
          />
        </div>
      )}
      <Step quiz={quiz} />
    </>
  );
}
