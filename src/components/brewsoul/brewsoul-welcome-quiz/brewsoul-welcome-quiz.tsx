"use client";

import { useEffect, type ReactNode } from "react";
import Image from "next/image";
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

      {/* Live's BrewSoul hero photo (rescued into Sanity, docs/ai/manus-media-rescue.md):
          pinned to the top half of the screen and faded into the warm tan, as on live. */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-0 h-[50vh] overflow-hidden">
        <Image
          src="https://cdn.sanity.io/images/a3q1cyqs/production/1c8cf85cb4a89e17203b371252c9e86ccecff53a-1200x670.webp"
          alt=""
          fill
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          className="object-cover object-[center_30%] brightness-105 saturate-115"
        />
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-linear-to-t from-[#F0E8D8] via-[#F0E8D8]/70 to-transparent" />
      </div>

      <Step quiz={quiz} />
    </div>
  );
}
