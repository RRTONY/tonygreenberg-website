"use client";

import { Card, Frame } from "./frame";
import { DAY_OPTIONS, postInterventionData } from "../data/post-intervention.data";
import type { StepProps } from "../post-intervention";

// Step 1: which day after the experience this is.
export function StepDay({ flow }: StepProps) {
  return (
    <Frame
      eyebrow="Post-Intervention Assessment"
      title="How Are You, Really?"
      sub="Anonymous. Honest. Sent directly to the facilitator network. Your experience shapes how we guide the next person."
    >
      <Card title="When are you taking this?">
        <p className="mb-5 text-sm/[1.7] text-[#78350F]">
          Choose the window that best matches where you are in your integration. There is no wrong answer — each day reveals something
          different.
        </p>
        <div className="flex flex-col gap-3">
          {DAY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                flow.updateState({ day: opt.value });
                flow.onNext();
              }}
              className="rounded-xl border-[1.5px] border-[#FDE68A] bg-[#FFFDF7] px-5 py-4 text-left transition-colors hover:border-[#D97706] hover:bg-[#FEF3C7]"
            >
              <span className="block font-mono text-lg font-bold text-[#B45309]">{opt.label}</span>
              <span className="mt-1 block text-[13px] text-[#78350F]">{opt.subtitle}</span>
            </button>
          ))}
        </div>
      </Card>
      <p className="text-center font-mono text-xs tracking-[0.05em] text-[#92400E]">{postInterventionData.footer}</p>
    </Frame>
  );
}
