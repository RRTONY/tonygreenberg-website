"use client";

import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { questionCounter } from "@/components/sake/pages/sommelier-card/data/sommelier-card.data";
import type { SommelierCardState } from "@/components/sake/pages/sommelier-card/hook/use-sommelier-card";
import type { SommelierLook } from "@/components/sake/pages/sommelier-card/look";

// Step 1: the five questions, one at a time, with the progress bar. The app's slide-in (x: 20) and
// hover nudge (whileHover x: 8) are CSS.
export function StepQuiz({ card, look }: { card: SommelierCardState; look: SommelierLook }) {
  const { t } = useLanguage();
  const { question, currentQ, total } = card;

  return (
    <div key={question.id} className="animate-in fade-in slide-in-from-right-5 duration-300">
      <div className="flex items-center gap-2 mb-8" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= currentQ ? look.goldBar : look.idleBar}`} />
        ))}
      </div>

      <div className={`text-xs font-mono mb-4 ${look.textMuted}`}>{t(...questionCounter(currentQ + 1, total))}</div>

      <h2 className="font-sk-display text-2xl sm:text-3xl font-bold mb-8">{t(...question.text)}</h2>

      <div className="space-y-3">
        {question.answers.map((answer) => (
          <button
            type="button"
            key={answer.id}
            onClick={() => card.answer(answer.id)}
            className={`w-full text-left p-5 border transition-all duration-300 group flex items-center gap-4 hover:translate-x-2 ${look.cardBorder} ${look.cardBg}`}
          >
            <span className={`font-mono text-sm opacity-50 group-hover:opacity-100 ${look.gold}`}>{answer.id.toUpperCase()}</span>
            <span className="flex-1">{t(...answer.text)}</span>
            <ChevronRight aria-hidden="true" size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${look.textMuted}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
