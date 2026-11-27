"use client";

import { useCallback, useState } from "react";
import { sommelierProfiles, type SommelierProfile } from "@/lib/content/sake/qpr-data";
import { sommelierCardData } from "@/components/sake/pages/sommelier-card/data/sommelier-card.data";

// The Sommelier Card's one shared state (CONTRIBUTING rule 19): step (1 quiz, 2 result), the current
// question, answers, the matched profile and the optional name on the card. Scoring is the app's:
// the profile with the most answers wins (ties go to the first one counted), else the first profile.

export type SommelierCardStep = 1 | 2;
type Answer = { questionId: number; answerId: string };

export function matchProfile(answers: Answer[]): SommelierProfile {
  const counts: Record<string, number> = {};
  for (const a of answers) {
    const q = sommelierCardData.questions.find((x) => x.id === a.questionId);
    const ans = q?.answers.find((x) => x.id === a.answerId);
    if (ans) counts[ans.profile] = (counts[ans.profile] || 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  return sommelierProfiles.find((p) => p.id === top) || sommelierProfiles[0];
}

export function useSommelierCard() {
  const [step, setStep] = useState<SommelierCardStep>(1);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [profile, setProfile] = useState<SommelierProfile | null>(null);
  const [userName, setUserName] = useState("");

  const total = sommelierCardData.questions.length;

  const answer = useCallback(
    (answerId: string) => {
      const next = [...answers, { questionId: sommelierCardData.questions[currentQ].id, answerId }];
      setAnswers(next);
      if (currentQ < total - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setProfile(matchProfile(next));
        setStep(2);
      }
    },
    [answers, currentQ, total],
  );

  const reset = useCallback(() => {
    setStep(1);
    setCurrentQ(0);
    setAnswers([]);
    setProfile(null);
    setUserName("");
  }, []);

  return { step, currentQ, total, question: sommelierCardData.questions[currentQ], profile, userName, setUserName, answer, reset };
}

export type SommelierCardState = ReturnType<typeof useSommelierCard>;
