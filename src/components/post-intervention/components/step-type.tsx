"use client";

import { ArrowRight } from "lucide-react";
import { Card, Frame, outlineButton, primaryButton } from "./frame";
import { INTERVENTION_TYPES } from "../data/post-intervention.data";
import type { StepProps } from "../post-intervention";

// Step 2: what kind of experience, and (optionally) who facilitated it.
export function StepType({ flow }: StepProps) {
  const { state, updateState } = flow;
  return (
    <Frame eyebrow={`Day ${state.day} Assessment`} title="What Did You Go Through?" sub="Help us understand the context so we can read your responses correctly.">
      <Card title="Type of intervention">
        <div className="mb-6 flex flex-col gap-2.5" role="radiogroup" aria-label="Type of intervention">
          {INTERVENTION_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={state.interventionType === t.value}
              onClick={() => updateState({ interventionType: t.value })}
              className={
                state.interventionType === t.value
                  ? "rounded-[10px] border-2 border-[#D97706] bg-[#FEF3C7] px-4 py-3 text-left text-[15px] text-[#1A1208]"
                  : "rounded-[10px] border-[1.5px] border-[#E5D9C8] bg-[#FFFDF7] px-4 py-3 text-left text-[15px] text-[#78350F]"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <label htmlFor="facilitatorRef" className="mb-2 block text-[15px] font-semibold text-[#1A1208]">
          Facilitator name or code <span className="font-normal text-[#92400E]">(optional)</span>
        </label>
        <input
          id="facilitatorRef"
          value={state.facilitatorRef}
          onChange={(e) => updateState({ facilitatorRef: e.target.value })}
          placeholder="First name, initials, or a code word"
          className="w-full rounded-[10px] border-[1.5px] border-[#E5D9C8] bg-white px-4 py-3 text-[15px] outline-none focus:border-[#D97706] focus-visible:ring-2 focus-visible:ring-[#D97706]/30"
        />
        <p className="mt-1.5 font-mono text-xs text-[#92400E]">This helps route your feedback. Your identity remains anonymous.</p>
        <div className="mt-6 flex gap-3">
          <button type="button" className={outlineButton} onClick={() => flow.onNext(1)}>
            Back
          </button>
          <button type="button" className={primaryButton} onClick={() => flow.onNext()}>
            Continue
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </Card>
    </Frame>
  );
}
