"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { FRIEND_SURVEY_QUESTIONS } from "@/lib/content/friend-gate";
import { gateButton, gateH1, gateSub } from "@/components/friend-gate/frame";
import type { SurveyStepProps } from "../friend-survey";

const choice = (on: boolean) =>
  on
    ? "min-h-11 rounded-lg border-2 border-[#D97706] bg-[#FEF3C7] px-3 py-2 text-left text-sm text-[#1A1208]"
    : "min-h-11 rounded-lg border-[1.5px] border-[#E5D9C8] bg-white px-3 py-2 text-left text-sm text-[#78350F] hover:border-[#D97706]";

// Step 3: the six questions (four 1-5 scales, the verdict, an optional note).
export function StepQuestions({ survey, seekerName }: SurveyStepProps) {
  const { state, update } = survey;
  const set = (id: string, v: number | string) => update({ answers: { ...state.answers, [id]: v }, error: null });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!state.answers.q5) return update({ error: "Please answer question 5 — your overall verdict." });
        survey.submit();
      }}
    >
      <h1 className={gateH1}>A few honest questions.</h1>
      <p className={gateSub}>
        These are about <strong>{seekerName}</strong>. Answer from your gut. There are no wrong answers — only honest ones.
      </p>
      {FRIEND_SURVEY_QUESTIONS.map((q, i) => (
        <fieldset key={q.id} className="mb-7">
          <legend className="mb-1 text-[15px]/[1.5] font-semibold text-[#1A1208]">
            {i + 1}. {q.question}
          </legend>
          <p className="mb-3 text-[13px] text-[#92400E] italic">{q.hint}</p>
          {q.type === "scale" && (
            <div className="grid gap-2 sm:grid-cols-5">
              {q.labels.map((label, n) => (
                <button key={label} type="button" aria-pressed={state.answers[q.id] === n + 1} onClick={() => set(q.id, n + 1)} className={choice(state.answers[q.id] === n + 1)}>
                  {label}
                </button>
              ))}
            </div>
          )}
          {q.type === "verdict" && (
            <div className="flex flex-col gap-2">
              {q.options.map((o) => (
                <button key={o.value} type="button" aria-pressed={state.answers[q.id] === o.value} onClick={() => set(q.id, o.value)} className={choice(state.answers[q.id] === o.value)}>
                  {o.label}
                </button>
              ))}
            </div>
          )}
          {q.type === "text" && (
            <textarea
              aria-label={q.question}
              rows={4}
              value={String(state.answers[q.id] ?? "")}
              onChange={(e) => set(q.id, e.target.value)}
              placeholder="Optional — write anything you want them to know…"
              className="w-full resize-y rounded-lg border-[1.5px] border-[#E5D9C8] bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-[#D97706] focus-visible:ring-2 focus-visible:ring-[#D97706]/30"
            />
          )}
        </fieldset>
      ))}
      {state.error && (
        <p role="alert" className="mb-3 text-sm text-[#B91C1C]">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={state.pending} className={gateButton}>
        {state.pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        Submit my response
        {!state.pending && <ArrowRight aria-hidden="true" className="size-4" />}
      </button>
    </form>
  );
}
