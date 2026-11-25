"use client";

import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { questionCounter } from "@/components/sake/pages/taste-profile/data/taste-profile.data";
import type { TasteProfileState } from "@/components/sake/pages/taste-profile/hook/use-taste-profile";
import type { TasteLook } from "@/components/sake/pages/taste-profile/look";

// Step 1: one question at a time with the progress bar. The app's swap (x: 40 in, 0.4s) is the
// enter classes, keyed by question so each new question slides in.
export function StepQuestion({ quiz, look }: { quiz: TasteProfileState; look: TasteLook }) {
  const { t } = useLanguage();
  const { question, currentQ, total } = quiz;

  return (
    <div key={`q-${currentQ}`} className="animate-in fade-in slide-in-from-right-10 duration-400">
      <div className="flex items-center gap-2 mb-8" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < currentQ ? look.barDone : i === currentQ ? look.barNow : look.barIdle}`}
          />
        ))}
      </div>

      <div className={`${look.cardBg} border ${look.goldBorder} rounded-sm p-8 md:p-12`}>
        <div className={`text-xs tracking-[0.3em] uppercase mb-4 ${look.textMuted}`}>{t(...questionCounter(currentQ + 1, total))}</div>
        <h2 className={`text-2xl md:text-3xl font-light mb-8 leading-relaxed ${look.textMain}`}>{t(question.questionEn, question.questionJa)}</h2>
        <div className="space-y-3">
          {question.options.map((opt, i) => (
            <button type="button" key={opt.labelEn} onClick={() => quiz.answer(i)} className={look.option}>
              <span className="flex items-center justify-between gap-3">
                <span className={look.optionText}>{t(opt.labelEn, opt.labelJa)}</span>
                <ChevronRight aria-hidden="true" className={look.optionIcon} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
