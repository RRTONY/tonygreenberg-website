"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ANSWER_DELAY_MS, SAKE_QUIZ_TOTAL } from "@/components/sake/pages/sake-quiz/data/sake-quiz.data";

// The one shared state for the "Your Sake Profile" quiz (CONTRIBUTING rule 19): which step, which
// question, the answers so far and the answer being picked. Same behaviour as the app's page: a pick
// highlights for 400ms, then the next question (or the result) shows.

export type SakeQuizStep = 1 | 2;

export function useSakeQuiz() {
  const [step, setStep] = useState<SakeQuizStep>(1);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const answer = useCallback(
    (optionIdx: number) => {
      if (timer.current) return; // a pick is already moving on
      setSelectedOption(optionIdx);
      timer.current = setTimeout(() => {
        timer.current = null;
        setAnswers((prev) => {
          const next = [...prev];
          next[currentQ] = optionIdx;
          return next;
        });
        setSelectedOption(null);
        if (currentQ < SAKE_QUIZ_TOTAL - 1) setCurrentQ(currentQ + 1);
        else setStep(2);
      }, ANSWER_DELAY_MS);
    },
    [currentQ],
  );

  const back = useCallback(() => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelectedOption(null);
    }
  }, [currentQ]);

  const reset = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setStep(1);
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
  }, []);

  return { step, currentQ, answers, selectedOption, answer, back, reset };
}

export type SakeQuizState = ReturnType<typeof useSakeQuiz>;
