"use client";

import type { ReactNode } from "react";
import { GateFrame } from "@/components/friend-gate/frame";
import { StepCode } from "./components/step-code";
import { StepDone } from "./components/step-done";
import { StepIdentity } from "./components/step-identity";
import { StepQuestions } from "./components/step-questions";
import { useFriendSurvey } from "./hook/use-friend-survey";

// /friend-survey/[token], the invited friend's side (legacy FriendSurvey.tsx),
// as a step registry (CONTRIBUTING rule 19).
export type SurveyStepProps = { survey: ReturnType<typeof useFriendSurvey>; seekerName: string; friendName: string };

const STEPS: Record<number, (props: SurveyStepProps) => ReactNode> = { 1: StepIdentity, 2: StepCode, 3: StepQuestions, 4: StepDone };

export function FriendSurvey({ token, seekerName, friendName, verified }: { token: string; seekerName: string; friendName: string; verified: boolean }) {
  const survey = useFriendSurvey(token, verified);
  const Step = STEPS[survey.state.step] ?? StepIdentity;
  return (
    <GateFrame>
      <Step survey={survey} seekerName={seekerName} friendName={friendName} />
    </GateFrame>
  );
}
