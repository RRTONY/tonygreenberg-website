"use client";

import type { ComponentType } from "react";
import { StepIntro } from "@/components/sake/sake-quiz-hero/components/step-intro";
import { StepQuestion } from "@/components/sake/sake-quiz-hero/components/step-question";
import { StepResults } from "@/components/sake/sake-quiz-hero/components/step-results";
import { RESULTS_STEP, useSakeQuizHero, type SakeQuizHeroState } from "@/components/sake/sake-quiz-hero/hook/use-sake-quiz-hero";

// The Sake app's SakeQuizHero (client/src/components/SakeQuizHero.tsx): the homepage's 3-question
// "60-Second Sake Match" that ends in three bottles linking to their sake pages. Split into a step
// registry (CONTRIBUTING rule 19): intro, the three questions (one step component), results.
// framer-motion's AnimatePresence swap is the tw-animate enter classes on each step (the exits were
// quick fades and are dropped).

const STEPS: Record<number, ComponentType<{ quiz: SakeQuizHeroState }>> = {
  0: StepIntro,
  1: StepQuestion,
  2: StepQuestion,
  3: StepQuestion,
  [RESULTS_STEP]: StepResults,
};

export function SakeQuizHero() {
  const quiz = useSakeQuizHero();
  const Step = STEPS[quiz.step] ?? StepIntro;
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Step quiz={quiz} />
      </div>
    </section>
  );
}
