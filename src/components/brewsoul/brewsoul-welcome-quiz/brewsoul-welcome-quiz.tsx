"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { StepIdentity } from "./components/step-identity";
import { StepQuestions } from "./components/step-questions";
import { IDENTITY_KEY, useBrewSoulWelcomeQuiz } from "./hook/use-brewsoul-welcome-quiz";

// BrewSoul welcome quiz (/brewsoul), built like FydoPartner's sign-in flow
// (CONTRIBUTING rule 19): this parent holds only the numeric step registry and
// the shared progress bar; the one shared state lives in
// useBrewSoulWelcomeQuiz; each step is its own component; copy is in data/.
// A visitor who already has an identity goes straight to /brewsoul/home.
export type StepProps = { quiz: ReturnType<typeof useBrewSoulWelcomeQuiz> };

const STEPS: Record<number, (props: StepProps) => ReactNode> = {
  1: StepQuestions,
  2: StepIdentity,
};

export function BrewSoulWelcomeQuiz() {
  const router = useRouter();
  const quiz = useBrewSoulWelcomeQuiz();

  useEffect(() => {
    if (localStorage.getItem(IDENTITY_KEY)) router.push("/brewsoul/home");
  }, [router]);

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
    </div>
  );
}
