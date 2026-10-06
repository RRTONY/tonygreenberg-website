"use client";

import { ArrowLeft } from "lucide-react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { MIRROR_DIMENSIONS, MIRROR_QUESTIONS } from "@/lib/content/mirror-data";
import { theMirrorData } from "../data/the-mirror.data";
import type { StepProps } from "../the-mirror-quiz";

// Step 2: the 18 questions, one at a time. Picking an option highlights it
// briefly, then the hook advances (or moves on to the email gate).
export function StepQuestions({ quiz }: StepProps) {
  const { current, selected } = quiz.state;
  const copy = theMirrorData.questions;
  const q = MIRROR_QUESTIONS[current];
  const dim = MIRROR_DIMENSIONS.find((d) => d.id === q.dimension);
  const dimProgress = MIRROR_QUESTIONS.slice(0, current + 1).filter((qq) => qq.dimension === q.dimension).length;

  return (
    <div className="relative z-1 flex min-h-screen flex-col font-sans text-[#2C1810]">
      <ThemedBackground theme="mirror" />
      <div className="fixed inset-x-0 top-0.75 z-50 flex flex-wrap items-center justify-between gap-2 px-6 py-3 font-mono text-[0.65rem] tracking-widest text-[#4A3A2A] uppercase">
        <button type="button" onClick={quiz.exit} className="inline-flex min-h-11 items-center gap-1.5">
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {copy.exit}
        </button>
        <span>
          {dim?.name} · {copy.questionOf} {dimProgress} of 3 · {current + 1} / {MIRROR_QUESTIONS.length}
        </span>
      </div>

      <div className="relative z-1 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 pt-28 pb-8">
        <h2 className="mb-10 text-center font-heading text-[clamp(1.3rem,3.5vw,1.8rem)] leading-[1.3] font-normal">{q.stem}</h2>

        <div className="flex w-full flex-col gap-3">
          {q.options.map((opt, i) => (
            <button
              type="button"
              key={opt.text}
              onClick={() => quiz.answer(i)}
              disabled={selected !== null}
              className={`rounded-lg border px-5 py-4 text-left text-[0.92rem] leading-relaxed transition-all disabled:cursor-wait ${
                selected === i ? "border-brand-gold-light/40 bg-brand-gold-light/15" : "border-black/8 bg-white/40"
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {current > 0 && (
          <button
            type="button"
            onClick={quiz.back}
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-mono text-[0.65rem] tracking-widest text-[#4A3A2A] uppercase"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            {copy.previous}
          </button>
        )}
      </div>
    </div>
  );
}
