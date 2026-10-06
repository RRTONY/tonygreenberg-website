"use client";

import type { ReactNode } from "react";
import { StepDay } from "./components/step-day";
import { StepDone } from "./components/step-done";
import { StepSurvey } from "./components/step-survey";
import { StepType } from "./components/step-type";
import { usePostIntervention } from "./hook/use-post-intervention";

// /post-intervention as a step registry (CONTRIBUTING rule 19), ported from
// legacy client/src/pages/PostIntervention.tsx. Answers are saved in
// Supabase (`post_intervention_assessments`) by a server action.
export type StepProps = { flow: ReturnType<typeof usePostIntervention> };

const STEPS: Record<number, (props: StepProps) => ReactNode> = {
  1: StepDay,
  2: StepType,
  3: StepSurvey,
  4: StepDone,
};

export function PostIntervention() {
  const flow = usePostIntervention();
  const Step = STEPS[flow.state.step] ?? StepDay;
  return <Step flow={flow} />;
}
