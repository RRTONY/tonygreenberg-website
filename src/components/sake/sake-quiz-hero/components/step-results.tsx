"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw, ShoppingCart, Sparkles, Star } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { sakeQuizHeroData } from "@/components/sake/sake-quiz-hero/data/sake-quiz-hero.data";
import type { SakeQuizHeroState } from "@/components/sake/sake-quiz-hero/hook/use-sake-quiz-hero";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";

const { results } = sakeQuizHeroData;

// The three matched bottles, each linking to its sake page. Hover tint fixed as in step-question.
export function StepResults({ quiz }: { quiz: SakeQuizHeroState }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-600 fill-mode-both">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border bg-(--sk-accent)/12 border-(--sk-accent-line) text-(--sk-accent) animate-in zoom-in-0 duration-500 delay-200 fill-mode-both">
          <Sparkles aria-hidden="true" size={16} />
          {t(...results.badge)}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t(...results.title)}</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">{t(...results.body)}</p>
      </div>

      <div className="grid gap-6">
        {quiz.recommendations.map((sake, i) => (
          <Link
            key={sake.id}
            href={sakeDetailPath(sake.id)}
            className="block group p-6 rounded-xl border bg-card border-border hover:border-(--sk-accent)/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
            style={{ animationDelay: `${0.3 + i * 0.15}s` }}
          >
            <span className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="flex-1 space-y-2">
                <span className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-(--sk-accent)">#{i + 1}</span>
                  <span>
                    <span className="block text-xl font-bold text-foreground group-hover:text-(--sk-accent) transition-colors">
                      {t(sake.name, sake.nameJa)}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {t(sake.brewery, sake.breweryJa)} — {t(sake.prefecture, sake.prefectureJa)}
                    </span>
                  </span>
                </span>
                <span className="block text-base text-muted-foreground line-clamp-2">{t(sake.description, sake.descriptionJa)}</span>
                <span className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-(--sk-accent)">
                    <Star aria-hidden="true" size={14} /> QPR {sake.qprUS}
                  </span>
                  <span className="text-sm text-muted-foreground">{sake.type}</span>
                  <span className="text-sm text-muted-foreground capitalize">{sake.usAvailability} availability</span>
                </span>
              </span>
              <span className="flex flex-col items-end gap-3 shrink-0">
                <span className="text-2xl font-bold text-foreground">${sake.priceUS}</span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-11 border bg-(--sk-accent)/12 border-(--sk-accent-line) text-(--sk-accent)">
                  <ShoppingCart aria-hidden="true" size={16} />
                  {t(...results.viewBuy)}
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={quiz.reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-card transition-colors text-foreground min-h-12"
        >
          <RotateCcw aria-hidden="true" size={18} />
          {t(...results.again)}
        </button>
        <Link
          href={sk("/qpr")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-foreground min-h-12 font-medium transition-all border bg-(--sk-accent)/12 border-(--sk-accent-line)"
        >
          {t(...results.allQpr)}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </div>
  );
}
