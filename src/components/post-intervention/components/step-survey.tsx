"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Card, Frame, outlineButton, primaryButton } from "./frame";
import { INTERVENTION_TYPES, OPEN_QUESTIONS, RECOMMEND_LABELS, SCALE_LABELS, SCORES, type RecommendChoice } from "../data/post-intervention.data";
import type { StepProps } from "../post-intervention";

// Step 3: three 1-10 ratings, would-you-recommend, and three open answers.
export function StepSurvey({ flow }: StepProps) {
  const { state, updateState, canSubmit } = flow;
  const typeLabel = INTERVENTION_TYPES.find((t) => t.value === state.interventionType)?.label;

  return (
    <Frame
      eyebrow={`Day ${state.day} · ${typeLabel}`}
      title="Your Honest Assessment"
      sub="No one can see your name. No one can see your email. This is between you and the work."
    >
      <Card title={`Scores — Day ${state.day}`}>
        {SCORES.map((s) => {
          const value = state[s.key];
          return (
            <fieldset key={s.key} className="mb-6 last:mb-0">
              <legend className="mb-2.5 text-[15px] font-semibold text-[#1A1208]">{s.label}</legend>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={value === n}
                    aria-label={`${n}, ${SCALE_LABELS[n]}`}
                    onClick={() => updateState({ [s.key]: n })}
                    className={
                      value === n
                        ? "size-11 rounded-lg border-2 border-[#D97706] bg-[#D97706] font-mono text-sm font-bold text-white"
                        : "size-11 rounded-lg border-[1.5px] border-[#E5D9C8] bg-[#FFFDF7] font-mono text-sm text-[#78350F] hover:border-[#D97706]"
                    }
                  >
                    {n}
                  </button>
                ))}
              </div>
              {value !== null && (
                <p className="mt-1 font-mono text-xs text-[#92400E]">
                  {value} — {SCALE_LABELS[value]}
                </p>
              )}
            </fieldset>
          );
        })}
      </Card>

      <Card title="Recommendation">
        <fieldset>
          <legend className="mb-3 text-[15px] font-semibold text-[#1A1208]">Would you recommend this facilitator to someone you love?</legend>
          <div className="flex flex-wrap gap-2.5">
            {(Object.keys(RECOMMEND_LABELS) as RecommendChoice[]).map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={state.wouldRecommend === opt}
                onClick={() => updateState({ wouldRecommend: opt })}
                className={
                  state.wouldRecommend === opt
                    ? "min-h-11 rounded-[10px] border-2 border-[#D97706] bg-[#FEF3C7] px-6 text-[15px] text-[#1A1208]"
                    : "min-h-11 rounded-[10px] border-[1.5px] border-[#E5D9C8] bg-[#FFFDF7] px-6 text-[15px] text-[#78350F]"
                }
              >
                {RECOMMEND_LABELS[opt]}
              </button>
            ))}
          </div>
        </fieldset>
      </Card>

      <Card title="In your own words">
        {OPEN_QUESTIONS.map((q) => (
          <div key={q.key} className="mb-6 last:mb-0">
            <label htmlFor={q.key} className="mb-2 block text-[15px] font-semibold text-[#1A1208]">
              {q.label}
            </label>
            <textarea
              id={q.key}
              rows={q.rows}
              value={state[q.key]}
              onChange={(e) => updateState({ [q.key]: e.target.value })}
              placeholder={q.placeholder}
              className="w-full resize-y rounded-[10px] border-[1.5px] border-[#E5D9C8] bg-white px-4 py-3 text-[15px]/[1.6] outline-none focus:border-[#D97706] focus-visible:ring-2 focus-visible:ring-[#D97706]/30"
            />
          </div>
        ))}
      </Card>

      {!canSubmit && <p className="mb-4 text-center font-mono text-[13px] text-[#92400E]">Please rate integration, safety, trust, and recommendation to continue.</p>}
      {state.error && (
        <p role="alert" className="mb-4 text-center font-mono text-[13px] text-[#DC2626]">
          {state.error}
        </p>
      )}
      <div className="flex justify-center gap-3">
        <button type="button" className={outlineButton} onClick={() => flow.onNext(2)}>
          Back
        </button>
        <button type="button" className={primaryButton} disabled={!canSubmit || state.pending} onClick={flow.submit}>
          {state.pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          Submit Anonymously
          {!state.pending && <ArrowRight aria-hidden="true" className="size-4" />}
        </button>
      </div>
    </Frame>
  );
}
