"use client";

import { ArrowRight, Wine } from "lucide-react";
import { orderingGuideData as copy } from "../data/ordering-guide.data";
import type { StepProps } from "../ordering-guide";

// Step 1 of the Ordering Guide: the "What Should You Drink Tonight?" card with Begin.
export function StepIntro({ guide, tone, t }: StepProps) {
  return (
    <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
      <Wine aria-hidden="true" size={48} className={`mx-auto mb-6 ${tone.gold}`} />
      <h3 className={`font-sk-display font-bold [.sake-austere_&]:font-light text-2xl sm:text-3xl mb-4 ${tone.textMain}`}>
        {t(...copy.intro.title)}
      </h3>
      <p className={`text-sm mb-8 max-w-lg mx-auto ${tone.textMuted}`}>{t(...copy.intro.body)}</p>
      <button
        type="button"
        onClick={guide.begin}
        className={`inline-flex items-center gap-2 px-8 py-3 text-sm tracking-[0.15em] uppercase transition-all duration-300 border ${tone.goldBorder} ${tone.goldBg} ${tone.gold}`}
      >
        {t(...copy.intro.begin)}
        <ArrowRight aria-hidden="true" size={16} />
      </button>
    </div>
  );
}
