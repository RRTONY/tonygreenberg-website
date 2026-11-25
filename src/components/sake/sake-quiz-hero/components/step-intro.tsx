"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { sakeQuizHeroData } from "@/components/sake/sake-quiz-hero/data/sake-quiz-hero.data";
import type { SakeQuizHeroState } from "@/components/sake/sake-quiz-hero/hook/use-sake-quiz-hero";

const { intro } = sakeQuizHeroData;

export function StepIntro({ quiz }: { quiz: SakeQuizHeroState }) {
  const { t } = useLanguage();
  return (
    <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border bg-(--sk-accent)/12 border-(--sk-accent-line) text-(--sk-accent)">
        <Sparkles aria-hidden="true" size={16} />
        {t(...intro.badge)}
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">{t(...intro.title)}</h2>
      <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t(...intro.body)}</p>
      <button
        type="button"
        onClick={quiz.start}
        className="inline-flex items-center gap-3 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 min-h-14 bg-(--sk-accent) text-[#1a1a1a] [.sake-austere_&]:text-white"
      >
        {t(...intro.start)}
        <ArrowRight aria-hidden="true" size={20} />
      </button>
    </div>
  );
}
