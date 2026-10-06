"use client";

import type { ReactNode } from "react";
import { GateFrame } from "./frame";
import { StepIntro } from "./components/step-intro";
import { StepNominate } from "./components/step-nominate";
import { useFriendGate } from "./hook/use-friend-gate";

// /friend-gate, the Three Friends Gate (legacy FriendGate.tsx), as a step
// registry (CONTRIBUTING rule 19). Waiting and results live on
// /friend-gate/[token], which the seeker can bookmark.
export type GateStepProps = { gate: ReturnType<typeof useFriendGate> };

const STEPS: Record<number, (props: GateStepProps) => ReactNode> = { 1: StepIntro, 2: StepNominate };

export function FriendGate() {
  const gate = useFriendGate();
  const Step = STEPS[gate.step] ?? StepIntro;
  return (
    <GateFrame>
      <Step gate={gate} />
    </GateFrame>
  );
}
