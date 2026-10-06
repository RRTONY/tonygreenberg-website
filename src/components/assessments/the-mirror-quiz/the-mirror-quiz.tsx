"use client";

import type { ReactNode } from "react";
import { StepIntro } from "./components/step-intro";
import { StepQuestions } from "./components/step-questions";
import { StepGate } from "./components/step-gate";
import { StepResults } from "./components/step-results";
import { useTheMirror } from "./hook/use-the-mirror";

// The Mirror (/the-mirror; /life-assessment redirects here), built as a step
// registry (CONTRIBUTING rule 19): this parent holds only the registry and
// the shared progress bar; the one shared state is in useTheMirror; each step
// is its own component; UI copy is in data/. Questions, dimensions and
// article mappings are in src/lib/content/mirror-data.ts.
//
// 2026-10-07: the intro now matches live (dark "How Far Are You From
// Yourself?" hero, "What We Measure" six dimensions, "The Ecosystem" pills)
// instead of the shared AssessmentIntro. Live goes straight from the last
// question to results; this app keeps the EmailGate step every sibling
// assessment has. Article recommendations only use slugs the page resolved
// to real Sanity posts (articleTitles), same as before.
export type StepProps = {
  quiz: ReturnType<typeof useTheMirror>;
  articleTitles: Record<string, string>;
};

const STEPS: Record<number, (props: StepProps) => ReactNode> = {
  1: StepIntro,
  2: StepQuestions,
  3: StepGate,
  4: StepResults,
};

export function TheMirrorQuiz({ articleTitles }: { articleTitles: Record<string, string> }) {
  const quiz = useTheMirror();
  const Step = STEPS[quiz.state.step] ?? StepIntro;

  return (
    <>
      {quiz.state.step === 2 && (
        <div className="fixed inset-x-0 top-0 z-50 h-0.75 bg-brand-gold/10">
          <div
            className="h-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-400"
            style={{ width: `${quiz.progress}%` }}
          />
        </div>
      )}
      <Step quiz={quiz} articleTitles={articleTitles} />
    </>
  );
}
