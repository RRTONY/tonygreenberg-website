"use client";

import { useState } from "react";
import type { DayChoice, InterventionType, RecommendChoice } from "../data/post-intervention.data";
import { submitPostIntervention } from "@/app/post-intervention/actions";

// The ONE shared state for /post-intervention (CONTRIBUTING rule 19):
// step (1 day, 2 type, 3 survey, 4 done) and every answer.
export type PostInterventionState = {
  step: number;
  day: DayChoice | null;
  interventionType: InterventionType;
  facilitatorRef: string;
  integrationScore: number | null;
  safetyScore: number | null;
  trustScore: number | null;
  wouldRecommend: RecommendChoice | null;
  wentWell: string;
  couldImprove: string;
  messageToFacilitator: string;
  pending: boolean;
  error: string | null;
};

const initialState: PostInterventionState = {
  step: 1,
  day: null,
  interventionType: "psychedelic",
  facilitatorRef: "",
  integrationScore: null,
  safetyScore: null,
  trustScore: null,
  wouldRecommend: null,
  wentWell: "",
  couldImprove: "",
  messageToFacilitator: "",
  pending: false,
  error: null,
};

export function usePostIntervention() {
  const [state, setState] = useState<PostInterventionState>(initialState);
  const updateState = (data: Partial<PostInterventionState>) => setState((prev) => ({ ...prev, ...data }));
  const canSubmit = state.integrationScore !== null && state.safetyScore !== null && state.trustScore !== null && state.wouldRecommend !== null;

  const submit = async () => {
    if (!canSubmit || !state.day) return;
    updateState({ pending: true, error: null });
    const res = await submitPostIntervention({
      dayChoice: state.day,
      interventionType: state.interventionType,
      facilitatorRef: state.facilitatorRef,
      integrationScore: state.integrationScore!,
      safetyScore: state.safetyScore!,
      trustScore: state.trustScore!,
      wouldRecommend: state.wouldRecommend!,
      wentWell: state.wentWell,
      couldImprove: state.couldImprove,
      messageToFacilitator: state.messageToFacilitator,
    });
    updateState(res.ok ? { pending: false, step: 4 } : { pending: false, error: res.error ?? "Something went wrong. Please try again." });
  };

  return {
    state,
    updateState,
    canSubmit,
    onNext: (step?: number) => setState((prev) => ({ ...prev, step: step ?? prev.step + 1 })),
    submit,
    // "Take another" keeps nothing but starts over, as legacy did.
    reset: () => setState(initialState),
  };
}
