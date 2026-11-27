"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { ritualPalette } from "@/components/sake/page-palettes";
import type { SakeQuizState } from "@/components/sake/pages/sake-quiz/hook/use-sake-quiz";
import { SAKE_QUIZ_TOTAL, sakeQuizData, sakeQuizQuestions } from "@/components/sake/pages/sake-quiz/data/sake-quiz.data";

// Step 1 of "Your Sake Profile": progress bar, the current question with its context line, the
// lettered options, "Start Over" and "Previous question". Each new question slides in from the right
// (the app's AnimatePresence, exit dropped).

export function StepQuestions({ quiz }: { quiz: SakeQuizState }) {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const p = ritualPalette(isAustere);
  const question = sakeQuizQuestions[quiz.currentQ];
  const progress = (quiz.currentQ / SAKE_QUIZ_TOTAL) * 100;

  return (
    <div className="container max-w-2xl py-16">
      <h1 className="sr-only">{t("Your Sake Profile", "あなたの酒の魂")}</h1>
      <div className="mb-12">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs tracking-[0.2em] uppercase ${p.gold}`}>{t(...sakeQuizData.questionOf(quiz.currentQ + 1, SAKE_QUIZ_TOTAL))}</span>
          <button type="button" onClick={quiz.reset} className={`text-xs flex items-center gap-1 ${p.gold}`}>
            <RotateCcw aria-hidden="true" size={12} /> {t(...sakeQuizData.startOver)}
          </button>
        </div>
        <div
          className={`h-1 rounded-full overflow-hidden ${p.track}`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={SAKE_QUIZ_TOTAL}
          aria-valuenow={quiz.currentQ}
        >
          <div className={`h-full rounded-full transition-all duration-500 ${p.goldBg}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={quiz.currentQ} className="animate-in fade-in slide-in-from-right-[30px] duration-300 fill-mode-both">
        <div className="mb-10">
          <h2 className={isAustere ? "font-light text-2xl md:text-3xl mb-3" : "font-serif text-2xl md:text-3xl mb-3"}>{t(question.question, question.questionJa)}</h2>
          <p className={`text-sm ${p.faint}`}>{t(question.context, question.contextJa)}</p>
        </div>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            const picked = quiz.selectedOption === i;
            return (
              <button
                type="button"
                key={option.text}
                onClick={() => quiz.answer(i)}
                aria-pressed={picked}
                className={
                  picked
                    ? `w-full text-left p-5 rounded-lg transition-all duration-300 border scale-98 ${p.goldDimBg} ${p.goldBorder}`
                    : `w-full text-left p-5 rounded-lg transition-all duration-300 border ${p.panel} ${p.panelBorder}`
                }
              >
                <span className="flex items-center gap-4">
                  <span
                    className={
                      picked
                        ? `size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-mono ${p.goldBg} ${p.onGold}`
                        : `size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-mono ${p.goldDimBg} ${p.gold}`
                    }
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm">{t(option.text, option.textJa)}</span>
                </span>
              </button>
            );
          })}
        </div>

        {quiz.currentQ > 0 && (
          <button type="button" onClick={quiz.back} className={`mt-8 flex items-center gap-2 text-sm transition-colors ${p.gold}`}>
            <ArrowLeft aria-hidden="true" size={14} /> {t(...sakeQuizData.previous)}
          </button>
        )}
      </div>
    </div>
  );
}
