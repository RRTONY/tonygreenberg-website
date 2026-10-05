"use client";

import { useEffect, useMemo, useState } from "react";
import { useJourneyProgress } from "@/components/assessments/journey-tracker";
import { ALL_QUESTIONS, SECTIONS, TOTAL, generateDharmaProfile, sectionOf } from "../data/dharma-finder.data";

// The Dharma Finder's ONE shared state (CONTRIBUTING rule 19): the step
// (1 questions, 2 between-parts quote, 3 email gate, 4 results), the current
// question, the free-text answers, and which quote to show between parts.
export type DharmaState = {
  step: number;
  current: number;
  answers: Record<number, string>;
  interstitial: number;
};

const initialState: DharmaState = { step: 1, current: 0, answers: {}, interstitial: 0 };
const INTERSTITIAL_MS = 4000;

export function useDharmaFinder() {
  const [state, setState] = useState<DharmaState>(initialState);
  const { markComplete } = useJourneyProgress();

  const question = ALL_QUESTIONS[state.current];
  const { section, start } = sectionOf(state.current);
  const isLast = state.current === TOTAL - 1;

  // The between-parts quote auto-advances after 4s, as on legacy: a real
  // timer side effect, not state derived from props.
  useEffect(() => {
    if (state.step !== 2) return;
    const timer = setTimeout(() => setState((prev) => ({ ...prev, step: 1, current: prev.current + 1 })), INTERSTITIAL_MS);
    return () => clearTimeout(timer);
  }, [state.step]);

  const profile = useMemo(() => generateDharmaProfile(state.answers), [state.answers]);

  const next = () => {
    if (isLast) {
      markComplete("find-your-purpose");
      setState((prev) => ({ ...prev, step: 3 }));
      return;
    }
    // Moving into a new part shows a quote first.
    const endsSection = state.current + 1 === start + SECTIONS[section].questions.length;
    setState((prev) => (endsSection ? { ...prev, step: 2, interstitial: section } : { ...prev, current: prev.current + 1 }));
  };

  return {
    state,
    question,
    section,
    isFirstInSection: state.current === start,
    isLast,
    progress: ((state.current + 1) / TOTAL) * 100,
    profile,
    answer: (value: string) => setState((prev) => ({ ...prev, answers: { ...prev.answers, [question.id]: value } })),
    next,
    prev: () => setState((prev) => ({ ...prev, current: Math.max(0, prev.current - 1) })),
    unlock: () => setState((prev) => ({ ...prev, step: 4 })),
    retake: () => setState(initialState),
  };
}
