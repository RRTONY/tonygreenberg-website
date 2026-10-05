"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { gateButton, gateH1, gateInput, gateLabel, gateSub } from "@/components/friend-gate/frame";
import type { SurveyStepProps } from "../friend-survey";

// Step 2: the 6-digit code from the email.
export function StepCode({ survey }: SurveyStepProps) {
  const { state, update } = survey;
  const [code, setCode] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\d{6}$/.test(code)) return update({ error: "Please enter the 6-digit code." });
        survey.verify(code);
      }}
    >
      <h1 className={gateH1}>Check your inbox.</h1>
      <p className={gateSub}>
        We sent a 6-digit code to <strong>{state.email}</strong>. Enter it below to unlock the survey.
      </p>
      <label htmlFor="friend-code" className={gateLabel}>
        Verification code
      </label>
      <input
        id="friend-code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        className={`${gateInput} mb-4 text-center font-mono text-2xl tracking-[.3em]`}
      />
      {state.error && (
        <p role="alert" className="mb-3 text-sm text-[#B91C1C]">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={state.pending} className={gateButton}>
        {state.pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        Verify &amp; open survey
        {!state.pending && <ArrowRight aria-hidden="true" className="size-4" />}
      </button>
      <button type="button" onClick={survey.resendCode} disabled={state.pending} className="mt-4 w-full text-sm text-[#92400E] underline underline-offset-4">
        Resend
      </button>
    </form>
  );
}
