"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/soulsmoke/soulsmoke-providers";
import { ss } from "@/lib/content/soulsmoke/nav";
import { questions, tasteQuizData } from "../data/taste-quiz.data";
import type { TasteQuizStepProps } from "../taste-quiz";

// Step 1: one question at a time, with the progress bar under the quiz header.
export function StepQuestions({ quiz }: TasteQuizStepProps) {
  const { language } = useLanguage();
  const copy = language === "es" ? tasteQuizData.es : tasteQuizData.en;
  const { currentQuestion, answers } = quiz.state;
  const question = questions[currentQuestion];

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1a1a] text-[#f5f0e8]">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-[#8b4513]/20 bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href={ss("/")} className="font-serif text-2xl tracking-wider text-[#d4a574]">
            {tasteQuizData.brand}
          </Link>
          <Link href={ss("/quadrant")} className="text-sm text-[#a0a0a0] transition-colors hover:text-[#d4a574]">
            {copy.skip}
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-[73px] right-0 left-0 z-40 h-1 bg-[#2a2a2a]">
        <div
          className="h-full bg-[#d4a574] transition-all duration-300"
          // Progress through the quiz (runtime value).
          style={{ width: `${quiz.progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex grow items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full max-w-2xl">
          {/* Question Counter */}
          <div className="mb-8 text-center">
            <span className="text-sm text-[#a0a0a0]">{copy.questionOf(currentQuestion + 1, questions.length)}</span>
          </div>

          {/* Question */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-serif text-3xl md:text-4xl">
              {language === "es" ? question.questionEs : question.question}
            </h1>
            <p className="text-[#a0a0a0]">{language === "es" ? question.subtextEs : question.subtext}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => {
              const selected = answers[question.dimension] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => quiz.answer(question.dimension, option.value)}
                  aria-pressed={selected}
                  className={
                    selected
                      ? "w-full rounded-lg border border-[#d4a574] bg-[#8b4513]/20 p-4 text-left transition-all duration-200"
                      : "w-full rounded-lg border border-[#333] bg-[#2a2a2a] p-4 text-left transition-all duration-200 hover:border-[#8b4513]/50 hover:bg-[#333]"
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-[#f5f0e8]">{language === "es" ? option.labelEs : option.label}</div>
                      <div className="text-sm text-[#a0a0a0]">
                        {language === "es" ? option.descriptionEs : option.description}
                      </div>
                    </div>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#8b4513]/50">
                      {selected && <div className="size-4 rounded-full bg-[#d4a574]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between">
            <button
              type="button"
              onClick={quiz.back}
              disabled={currentQuestion === 0}
              className={
                currentQuestion === 0
                  ? "flex cursor-not-allowed items-center gap-2 rounded-lg px-4 py-2 text-[#555] transition-colors"
                  : "flex items-center gap-2 rounded-lg px-4 py-2 text-[#a0a0a0] transition-colors hover:text-[#f5f0e8]"
              }
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {copy.back}
            </button>

            {currentQuestion === questions.length - 1 && Object.keys(answers).length === questions.length && (
              <button
                type="button"
                onClick={() => quiz.onNext(2)}
                className="flex items-center gap-2 rounded-lg bg-[#8b4513] px-6 py-2 text-[#f5f0e8] transition-colors hover:bg-[#a0522d]"
              >
                {copy.seeResults}
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
