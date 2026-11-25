"use client";

import { useCallback, useMemo, useState } from "react";
import {
  generateSupplyChainMap,
  getCarbonTier,
  orderingGuideQuestions,
  sakeSupplyChains,
  usBreweries,
  type OrderingGuideQuestion,
} from "@/lib/content/sake/supply-chain-engine";

// The Ordering Guide's one shared state (CONTRIBUTING rule 19): which step is showing, the current
// question, the answers, and the recommendation scoring, all unchanged from the Sake Manus app's
// OrderingGuide.tsx (`guideState` intro/questions/result became steps 1/2/3).

export const GUIDE_STEPS = { intro: 1, questions: 2, result: 3 } as const;
export type GuideStep = (typeof GUIDE_STEPS)[keyof typeof GUIDE_STEPS];

type GuideAnswer = { questionId: string; optionId: string; tags: string[]; carbonWeight: number };

export function useOrderingGuide() {
  const [step, setStep] = useState<GuideStep>(GUIDE_STEPS.intro);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<GuideAnswer[]>([]);

  const recommendations = useMemo(() => {
    if (answers.length === 0) return null;

    const allTags = answers.flatMap((a) => a.tags);
    const avgCarbonWeight = answers.reduce((s, a) => s + a.carbonWeight, 0) / answers.length;

    const scored = sakeSupplyChains.map((profile) => {
      const chain = generateSupplyChainMap(profile);
      const carbonTier = getCarbonTier(chain.totalCarbonKg);
      let score = 0;

      // Carbon preference
      if (avgCarbonWeight > 0.7) score += (5 - chain.totalCarbonKg) * 3;
      else if (avgCarbonWeight > 0.4) score += (5 - chain.totalCarbonKg) * 1;

      // Tag matching
      if (allTags.includes("value") || allTags.includes("qpr")) {
        score += (100 - profile.retailPrice) * 0.3;
        score += profile.integrityScore * 0.2;
      }
      if (allTags.includes("premium") || allTags.includes("luxury")) score += profile.retailPrice * 0.1;
      if (allTags.includes("adventurous") || allTags.includes("unique")) score += profile.integrityScore * 0.3;
      if (allTags.includes("classic") || allTags.includes("reliable")) score += profile.breweryTransparency > 80 ? 10 : 0;
      if (allTags.includes("educational") || allTags.includes("variety")) score += 5;
      if (allTags.includes("clean") || allTags.includes("mineral")) {
        if (["Niigata", "Nagano", "Ishikawa"].includes(profile.prefecture)) score += 15;
      }
      if (allTags.includes("fruity") || allTags.includes("aromatic")) {
        if (["Yamagata", "Yamaguchi", "Fukui"].includes(profile.prefecture)) score += 15;
      }
      if (allTags.includes("umami") || allTags.includes("rich")) {
        if (["Kochi", "Iwate", "Shizuoka"].includes(profile.prefecture)) score += 15;
      }
      if (allTags.includes("warm") || allTags.includes("kan")) {
        if (!profile.isNamazake) score += 10;
      }
      if (allTags.includes("chilled") || allTags.includes("ginjo")) score += 5;

      // Integrity bonus
      score += profile.integrityScore * 0.1;

      return { profile, chain, score, carbonTier };
    });

    const usScored = usBreweries.map((brewery) => ({ brewery, score: avgCarbonWeight > 0.6 ? 100 : 30 }));

    const japanTop = [...scored].sort((a, b) => b.score - a.score).slice(0, 4);
    const usTop = [...usScored].sort((a, b) => b.score - a.score).slice(0, 2);

    return { japanTop, usTop, avgCarbonWeight, allTags };
  }, [answers]);

  const begin = useCallback(() => setStep(GUIDE_STEPS.questions), []);

  const answer = useCallback(
    (question: OrderingGuideQuestion, optionId: string) => {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) return;
      setAnswers((prev) => [...prev, { questionId: question.id, optionId, tags: option.tags, carbonWeight: option.carbonWeight }]);
      if (currentQuestion < orderingGuideQuestions.length - 1) setCurrentQuestion(currentQuestion + 1);
      else setStep(GUIDE_STEPS.result);
    },
    [currentQuestion],
  );

  const reset = useCallback(() => {
    setStep(GUIDE_STEPS.intro);
    setCurrentQuestion(0);
    setAnswers([]);
  }, []);

  return {
    step,
    currentQuestion,
    question: orderingGuideQuestions[currentQuestion],
    totalQuestions: orderingGuideQuestions.length,
    recommendations,
    begin,
    answer,
    reset,
  };
}

export type OrderingGuideFlow = ReturnType<typeof useOrderingGuide>;
