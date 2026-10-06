"use client";

import { useMemo, useState } from "react";
import { useJourneyProgress } from "@/components/assessments/journey-tracker";
import {
  MIRROR_DIMENSIONS,
  MIRROR_QUESTIONS,
  type MirrorDimensionId,
} from "@/lib/content/mirror-data";

// The Mirror's ONE shared state (CONTRIBUTING rule 19): the step (1 intro,
// 2 questions, 3 email gate, 4 results), the current question, the answers
// and the brief "selected" highlight before advancing. Steps read it and call
// these actions.
export type TheMirrorState = {
  step: number;
  current: number;
  answers: Record<number, number>;
  selected: number | null;
};

const initialState: TheMirrorState = {
  step: 1,
  current: 0,
  answers: {},
  selected: null,
};

export function useTheMirror() {
  const [state, setState] = useState<TheMirrorState>(initialState);
  const { markComplete } = useJourneyProgress();

  const dimensionScores = useMemo(() => {
    const scores: Partial<Record<MirrorDimensionId, number>> = {};
    MIRROR_DIMENSIONS.forEach((d) => {
      const vals = MIRROR_QUESTIONS.map((q, idx) =>
        q.dimension === d.id ? state.answers[idx] : undefined,
      ).filter((v): v is number => v !== undefined);
      if (vals.length > 0)
        scores[d.id] = Math.round(
          vals.reduce((a, b) => a + b, 0) / vals.length,
        );
    });
    return scores;
  }, [state.answers]);

  const overallScore = useMemo(() => {
    const vals = Object.values(dimensionScores).filter(
      (v): v is number => v !== undefined,
    );
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [dimensionScores]);

  const sortedDims = useMemo(
    () =>
      [...MIRROR_DIMENSIONS]
        .filter((d) => dimensionScores[d.id] !== undefined)
        .sort(
          (a, b) => (dimensionScores[a.id] ?? 0) - (dimensionScores[b.id] ?? 0),
        ),
    [dimensionScores],
  );

  const goTo = (step: number) => {
    setState((prev) => ({ ...prev, step }));
    window.scrollTo({ top: 0 });
  };

  const answer = (optionIdx: number) => {
    if (state.selected !== null) return;
    const current = state.current;
    const score = MIRROR_QUESTIONS[current].options[optionIdx].score;
    const isLast = current === MIRROR_QUESTIONS.length - 1;
    setState((prev) => ({ ...prev, selected: optionIdx }));
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        answers: { ...prev.answers, [current]: score },
        selected: null,
        current: isLast ? prev.current : prev.current + 1,
        step: isLast ? 3 : prev.step,
      }));
      if (isLast) markComplete("find-your-mirror");
    }, 400);
  };

  return {
    state,
    progress: ((state.current + 1) / MIRROR_QUESTIONS.length) * 100,
    dimensionScores,
    overallScore,
    sortedDims,
    begin: () => goTo(2),
    exit: () => goTo(1),
    answer,
    back: () =>
      setState((prev) => ({
        ...prev,
        current: Math.max(0, prev.current - 1),
        selected: null,
      })),
    unlock: () => goTo(4),
    reset: () => {
      setState(initialState);
      window.scrollTo({ top: 0 });
    },
  };
}
