"use client";

import { useCallback, useMemo, useState } from "react";
import { tasteQuestions } from "@/lib/content/sake/education-data";
import { archetypes, type ArchetypeId } from "@/components/sake/pages/taste-profile/data/taste-profile.data";

// The Taste Profile's one shared state (CONTRIBUTING rule 19): step (1 questions, 2 result), the
// current question and the answers. Scoring is the app's: dry+light → Purist, rich+earthy → Explorer,
// sweet+rich → Hedonist, aromatic+earthy → Philosopher; the highest wins (ties: first in that order).

export type TasteProfileStep = 1 | 2;

export function archetypeFor(answers: number[]) {
  const scores: Record<ArchetypeId, number> = { purist: 0, explorer: 0, hedonist: 0, philosopher: 0 };
  answers.forEach((a, i) => {
    const s = tasteQuestions[i]?.options[a]?.scores;
    if (!s) return;
    scores.purist += s.dry + s.light;
    scores.explorer += s.rich + s.earthy;
    scores.hedonist += s.sweet + s.rich;
    scores.philosopher += s.aromatic + s.earthy;
  });
  const top = (Object.entries(scores) as [ArchetypeId, number][]).sort((a, b) => b[1] - a[1])[0][0];
  return archetypes[top];
}

export function useTasteProfile() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState<TasteProfileStep>(1);

  const answer = useCallback(
    (optionIndex: number) => {
      setAnswers((prev) => [...prev, optionIndex]);
      if (currentQ < tasteQuestions.length - 1) setCurrentQ(currentQ + 1);
      else setStep(2);
    },
    [currentQ],
  );

  const reset = useCallback(() => {
    setCurrentQ(0);
    setAnswers([]);
    setStep(1);
  }, []);

  const result = useMemo(() => (step === 2 ? archetypeFor(answers) : null), [step, answers]);

  return { step, currentQ, total: tasteQuestions.length, question: tasteQuestions[currentQ], result, answer, reset };
}

export type TasteProfileState = ReturnType<typeof useTasteProfile>;
