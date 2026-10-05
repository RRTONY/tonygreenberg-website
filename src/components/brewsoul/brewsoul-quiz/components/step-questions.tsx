"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { QUESTIONS, quizData } from "../data/brewsoul-quiz.data";
import type { StepProps } from "../brewsoul-quiz";

// Step 1: the seven questions, one at a time. The intro only shows above the
// first question, as on live.
export function StepQuestions({ quiz }: StepProps) {
  const { questionIndex, visible } = quiz.state;
  const cur = QUESTIONS[questionIndex];
  const isFirst = questionIndex === 0;

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      {isFirst && (
        <div className="mx-auto max-w-160 px-6 pt-24 pb-6 text-center">
          <div className="mb-5 font-mono text-[0.65rem] tracking-[0.35em] text-[#836311] uppercase">
            {quizData.intro.eyebrow}
          </div>
          <h1 className="mb-5 font-heading text-[clamp(1.6rem,5vw,2.4rem)]/[1.3] font-bold text-[#1A1A1A]">
            {quizData.intro.titleLine1}
            <br />
            <span className="text-[#836311]">{quizData.intro.titleLine2}</span>
          </h1>
          <p className="mx-auto max-w-130 rounded-xl bg-[#FAFAF7]/70 px-5 py-4 text-[0.92rem]/[1.8] text-[#4A4A4A] backdrop-blur-md">
            {quizData.intro.body(BREWSOUL_COFFEES.length)}
          </p>
        </div>
      )}

      <div
        className={`flex flex-1 flex-col items-center justify-center px-6 pb-8 transition-opacity duration-300 ${isFirst ? "pt-4" : "pt-[52vh]"} ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="w-full max-w-xl text-center">
          <div className="mb-6 font-mono text-[0.62rem] tracking-[0.25em] text-[#836311]/50 uppercase">
            {questionIndex + 1} / {QUESTIONS.length}
          </div>

          <div className="mb-3 text-4xl [filter:drop-shadow(0_4px_12px_rgba(139,105,20,0.25))]">{cur.icon}</div>

          <h2 className="mb-6 font-heading text-xl font-bold text-[#1A1A1A] sm:text-2xl">{cur.q}</h2>

          <div className="flex flex-col gap-2.5">
            {cur.opts.map((o) => (
              <button
                key={o.text}
                onClick={() => quiz.answer(cur.dim, o.score)}
                className="flex items-center gap-3 rounded-2xl border border-[#836311]/15 bg-white/60 px-5 py-3.5 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#836311]/50 hover:bg-white/85 hover:shadow-lg"
              >
                <span className="font-sans text-sm text-[#2A2A2A]">{o.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-8 pb-10">
        {!isFirst && (
          <button
            onClick={quiz.back}
            className="inline-flex min-h-11 items-center gap-1.5 font-mono text-[0.65rem] tracking-wide text-[#5A4A20]/35 md:min-h-6"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            {quizData.back}
          </button>
        )}
        <Link
          href="/brewsoul/browse"
          className="inline-flex min-h-11 items-center gap-1.5 font-mono text-[0.65rem] tracking-wide text-[#5A4A20]/25 md:min-h-6"
        >
          {quizData.skip}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
