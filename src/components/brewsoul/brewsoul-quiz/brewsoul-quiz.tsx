"use client";

import { useEffect } from "react";
import { JourneyBar, markVisited } from "@/components/brewsoul/journey-bar";
import { StepQuestions } from "./components/step-questions";
import { StepResults } from "./components/step-results";
import { useBrewSoulQuiz } from "./hook/use-brewsoul-quiz";

// BrewSoul taste quiz (/brewsoul/quiz), built like FydoPartner's sign-in
// flow: this parent holds only the numeric step registry and the shared
// chrome (progress bar, journey bar); the one shared state lives in
// useBrewSoulQuiz; each step is its own component; copy is in data/.
export type StepProps = { quiz: ReturnType<typeof useBrewSoulQuiz> };

const STEPS: Record<number, (props: StepProps) => React.ReactNode> = {
  1: StepQuestions,
  2: StepResults,
};

export function BrewSoulQuiz() {
  useEffect(() => {
    markVisited("quiz");
  }, []);

  const quiz = useBrewSoulQuiz();
  const Step = STEPS[quiz.state.step] ?? StepQuestions;

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#FAFAF7] via-[#F0E8D8] to-[#F5F0E6]">
      <div className="fixed inset-x-0 top-0 z-100 h-1 bg-[#836311]/8">
        <div
          className="h-full bg-linear-to-r from-[#C5A23C] to-[#836311] shadow-[0_0_12px_rgba(197,162,60,0.4)] transition-[width] duration-500"
          style={{ width: `${quiz.progress}%` }}
        />
      </div>

      <Step quiz={quiz} />

      <JourneyBar />
      <div className="h-20" />
    </div>
  );
}
