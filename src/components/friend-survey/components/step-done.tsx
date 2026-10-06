"use client";

import { Heart } from "lucide-react";
import { TRUST_QUOTE } from "@/lib/content/friend-gate";
import { gateH1, gateQuote, gateSub } from "@/components/friend-gate/frame";
import type { SurveyStepProps } from "../friend-survey";

// Step 4: thank-you.
export function StepDone({ seekerName, friendName }: SurveyStepProps) {
  return (
    <div className="text-center">
      <Heart aria-hidden="true" className="mx-auto mb-4 size-10 fill-[#D97706] text-[#D97706]" />
      <h1 className={gateH1}>Thank you, {friendName}.</h1>
      <p className={gateSub}>Your response has been recorded anonymously. {seekerName} will see a summary — not your name, not your specific answers.</p>
      <p className={`${gateQuote} text-left`}>&ldquo;{TRUST_QUOTE}&rdquo;</p>
    </div>
  );
}
