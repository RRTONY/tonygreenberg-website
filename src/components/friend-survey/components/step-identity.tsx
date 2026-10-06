"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { TRUST_QUOTE } from "@/lib/content/friend-gate";
import { gateButton, gateH1, gateInput, gateLabel, gateQuote, gateSub } from "@/components/friend-gate/frame";
import type { SurveyStepProps } from "../friend-survey";

// Step 1: confirm it's really the invited friend (their email gets a code).
export function StepIdentity({ survey, seekerName }: SurveyStepProps) {
  const { state, update } = survey;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!state.email.trim()) return update({ error: "Please enter your email address." });
        survey.requestCode();
      }}
    >
      <h1 className={gateH1}>Your honest voice matters.</h1>
      <p className={gateSub}>
        <strong>{seekerName}</strong> is considering a significant inner journey and has asked three people who know them well to weigh in. You
        are one of those three.
      </p>
      <p className={gateSub}>This is a short, private survey — six questions, five minutes. Your response is anonymous. To begin, verify your identity with a one-time code.</p>
      <p className={gateQuote}>&ldquo;{TRUST_QUOTE}&rdquo;</p>
      <label htmlFor="friend-email" className={gateLabel}>
        Your email address
      </label>
      <input id="friend-email" type="email" autoComplete="email" value={state.email} onChange={(e) => update({ email: e.target.value })} className={`${gateInput} mb-4`} />
      {state.error && (
        <p role="alert" className="mb-3 text-sm text-[#B91C1C]">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={state.pending} className={gateButton}>
        {state.pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        Send verification code
        {!state.pending && <ArrowRight aria-hidden="true" className="size-4" />}
      </button>
    </form>
  );
}
