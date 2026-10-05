"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { QUESTIONS, grantStudyData } from "../data/grant-study.data";
import type { StepProps } from "../grant-study-quiz";

// Step 1: the 25 questions, laid out like live: the title block only above
// question 1, a plain page, live's 546px column, the credit line under every
// question.
export function StepQuestions({ quiz }: StepProps) {
  const { state, question, factor, isLast } = quiz;
  const selected = state.answers[question.id];
  const copy = grantStudyData;

  return (
    <div className="mx-auto max-w-[39rem] px-5 pt-5 pb-16 font-sans text-[#2C1810] sm:px-10">
      {state.current === 0 ? (
        <header>
          <p className="mb-2 font-mono text-[0.7rem]/[1.85] tracking-[0.25em] text-brand-gold uppercase">
            {copy.intro.eyebrow}
          </p>
          <h1 className="mb-3 font-heading text-[1.6rem]/[1.8] font-normal text-[#0A0A10] sm:text-[2.2rem]/[1.85]">
            {copy.intro.title}
          </h1>
          <p className="text-base/[1.7] text-[#666]">{copy.intro.body}</p>
          <div aria-hidden="true" className="mx-auto my-10 h-px w-32 bg-linear-to-r from-transparent via-[#8E1E25] to-transparent" />
        </header>
      ) : (
        <h1 className="sr-only">{copy.intro.title}</h1>
      )}

      <div className="mb-6">
        <p className="flex items-center gap-1.5 font-mono text-[0.65rem]/[1.85] tracking-[0.2em] text-brand-gold uppercase">
          <factor.icon aria-hidden="true" className="size-3.5" />
          {factor.name}
        </p>
        <p className="mt-0.5 text-[0.85rem]/[1.8] text-[#767676]">{factor.description}</p>
      </div>

      <p className="mb-6 font-mono text-[0.7rem]/[1.85] tracking-[0.2em] text-[#767676] uppercase">
        {copy.questionOf(state.current + 1, QUESTIONS.length)}
      </p>

      <h2 className="mb-8 font-heading text-[clamp(1.2rem,2.2vw,1.5rem)] leading-[1.4] font-normal text-[#0A0A10]">
        {question.text}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.text}
            onClick={() => quiz.select(opt.score)}
            aria-pressed={selected === opt.score}
            className={
              selected === opt.score
                ? "rounded-sm border border-[#0A0A10] bg-[#0A0A10] px-5 py-4 text-left text-base leading-relaxed text-[#FAFAF7] transition-colors"
                : "rounded-sm border border-[#d5d0c5] bg-white px-5 py-4 text-left text-base leading-relaxed text-[#333] transition-colors hover:border-[#2E8B57]/50"
            }
          >
            {opt.text}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={quiz.prev}
          disabled={state.current === 0}
          className="inline-flex items-center gap-1.5 rounded-sm border border-[#ccc] px-6 py-2.5 font-mono text-[0.75rem] tracking-[0.15em] text-[#666] uppercase disabled:cursor-default disabled:text-[#ccc]"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {copy.previous}
        </button>
        <button
          onClick={quiz.next}
          disabled={!selected}
          className={
            selected
              ? "inline-flex items-center gap-1.5 rounded-sm border-none bg-[#2E8B57] px-6 py-2.5 font-mono text-[0.75rem] tracking-[0.15em] text-white uppercase"
              : "inline-flex items-center gap-1.5 rounded-sm border-none bg-[#ccc] px-6 py-2.5 font-mono text-[0.75rem] tracking-[0.15em] text-white uppercase"
          }
        >
          {isLast ? copy.finish : copy.next}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </button>
      </div>

      <p className="mt-16 px-3 text-center font-mono text-[0.7rem]/[1.8] tracking-widest text-[#767676]">{copy.credit}</p>
    </div>
  );
}
