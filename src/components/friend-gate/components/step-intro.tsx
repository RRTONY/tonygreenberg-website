"use client";

import { ArrowRight, Sprout } from "lucide-react";
import { BETTER_SAFE_QUOTE } from "@/lib/content/friend-gate";
import { gateButton, gateH1, gateQuote, gateSub } from "../frame";
import type { GateStepProps } from "../friend-gate";

export function StepIntro({ gate }: GateStepProps) {
  return (
    <>
      <Sprout aria-hidden="true" className="mb-4 size-10 text-[#B45309]" strokeWidth={1.5} />
      <h1 className={gateH1}>Before you see your results.</h1>
      <p className={gateSub}>
        What you&apos;re considering — any intervention that reshapes how your nervous system moves through the world — is not a solo
        decision. You are not just you. You are an organism embedded in relationships. Those relationships deserve a vote.
      </p>
      <p className={gateSub}>
        Three people who know you well will each receive a short, anonymous survey. When all three respond, your results unlock. If someone
        who loves you asks you to wait — that&apos;s not a door closing. That&apos;s time being on your side.
      </p>
      <p className={gateQuote}>&ldquo;{BETTER_SAFE_QUOTE}&rdquo;</p>
      <button type="button" className={gateButton} onClick={() => gate.onNext()}>
        Nominate my three friends
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </>
  );
}
