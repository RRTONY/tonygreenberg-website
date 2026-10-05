"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { SECTIONS, TOTAL, dharmaData } from "../data/dharma-finder.data";
import type { StepProps } from "../dharma-finder-quiz";

// Step 1: the 25 free-text questions, laid out like live: the part header
// (label, title, framing quote) above each part's first question, live's
// 546px column on a plain page, and the credit under every question.
export function StepQuestions({ quiz }: StepProps) {
  const { state, question, section, isFirstInSection, isLast } = quiz;
  const part = SECTIONS[section];
  const copy = dharmaData;

  return (
    <div className="mx-auto max-w-[39rem] px-5 pt-5 pb-16 font-sans text-[#2C1810] sm:px-10">
      {/* Live has no H1 on this page; keep one for search engines and screen readers. */}
      <h1 className="sr-only">{copy.title}</h1>

      {isFirstInSection && (
        <div className="mb-8">
          <p className="mb-2 font-mono text-[0.7rem]/[1.85] tracking-[0.25em] text-brand-gold uppercase">
            {copy.partOf(section + 1, SECTIONS.length, part.title)}
          </p>
          <h2 className="mb-2 font-heading text-[1.4rem]/[1.8] font-normal text-[#0A0A10] sm:text-[1.8rem]/[1.85]">{part.subtitle}</h2>
          <blockquote className="mt-4 border-l-2 border-brand-gold-light pl-4 text-[0.95rem]/[1.8] text-[#5A4A3A] italic">
            &ldquo;{part.quote.text}&rdquo;
            <br />
            <span className="font-mono text-[0.75rem] text-brand-gold not-italic">— {part.quote.author}</span>
          </blockquote>
          <div aria-hidden="true" className="mx-auto mt-10 h-px w-32 bg-linear-to-r from-transparent via-[#8E1E25] to-transparent" />
        </div>
      )}

      <p className="mb-6 font-mono text-[0.7rem]/[1.85] tracking-[0.2em] text-[#767676] uppercase">
        {copy.questionOf(state.current + 1, TOTAL)}
      </p>
      <h2 className="mb-6 font-heading text-[clamp(1.3rem,2.5vw,1.7rem)] leading-[1.4] font-normal text-[#0A0A10]">
        <label htmlFor="dharma-answer">{question.text}</label>
      </h2>

      <textarea
        id="dharma-answer"
        value={state.answers[question.id] || ""}
        onChange={(e) => quiz.answer(e.target.value)}
        placeholder={copy.placeholder}
        rows={6}
        className="w-full resize-y rounded-sm border border-black/10 bg-white/50 p-5 text-[1.05rem] leading-relaxed text-[#2C1810] outline-none placeholder:text-[#736455] focus:border-brand-gold focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={quiz.prev}
          disabled={state.current === 0}
          className="inline-flex items-center gap-1.5 rounded-sm border border-[#ccc] px-6 py-2.5 font-mono text-[0.75rem] tracking-[0.15em] text-[#4A3A2A] uppercase disabled:cursor-default disabled:text-[#B8A898]"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {copy.previous}
        </button>
        <button
          onClick={quiz.next}
          className="inline-flex items-center gap-1.5 rounded-sm bg-brand-gold px-6 py-2.5 font-mono text-[0.75rem] tracking-[0.15em] text-[#F5F0E0] uppercase"
        >
          {isLast ? copy.finish : copy.next}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </button>
      </div>

      <p className="mt-6 font-mono text-[0.7rem]/[1.8] text-[#767676]">{copy.pace}</p>

      <div className="mt-16 px-3 text-center">
        <p className="font-mono text-[0.7rem]/[1.8] tracking-[0.1em] text-[#767676]">
          {copy.creditBefore}{" "}
          <a href={copy.creditHref} target="_blank" rel="noopener noreferrer" className="text-brand-gold">
            {copy.creditLink}
          </a>{" "}
          {copy.creditAfter}
        </p>
        <p className="mt-2 font-mono text-[0.65rem]/[1.8] text-[#767676]">{copy.fullVersion}</p>
      </div>
    </div>
  );
}
