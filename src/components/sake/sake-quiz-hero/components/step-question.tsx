"use client";

import { useLanguage } from "@/components/sake/sake-providers";
import { QUESTION_COUNT, type SakeQuizHeroState } from "@/components/sake/sake-quiz-hero/hook/use-sake-quiz-hero";

// One question of the homepage quiz. The app's hover tint was its `accent` token (a dark indigo that
// made the hovered title nearly vanish on the dark card); it's the gold/vermillion accent here (rule 20).
export function StepQuestion({ quiz }: { quiz: SakeQuizHeroState }) {
  const { t } = useLanguage();
  const { question, step } = quiz;
  if (!question) return null;

  return (
    <div key={step} className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-400 fill-mode-both">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{t(`Question ${step} of 3`, `質問 ${step} / 3`)}</span>
        <div className="flex gap-2" aria-hidden="true">
          {Array.from({ length: QUESTION_COUNT }, (_, i) => i + 1).map((i) => (
            <div
              key={i}
              className={
                i <= step
                  ? "h-1.5 w-12 rounded-full transition-all duration-300 bg-(--sk-accent)"
                  : "h-1.5 w-12 rounded-full transition-all duration-300 bg-[oklch(0.3_0.01_270)]"
              }
            />
          ))}
        </div>
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-center">{t(question.en, question.ja)}</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {question.options.map((option) => (
          <button
            type="button"
            key={option.id}
            onClick={() => quiz.answer(question.id, option.id)}
            className="group relative p-6 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] min-h-20 bg-card border-border hover:border-(--sk-accent)/50"
          >
            <span className="flex items-start gap-4">
              <option.icon aria-hidden="true" className="size-8 shrink-0 text-(--sk-accent)" />
              <span className="text-lg font-semibold text-foreground group-hover:text-(--sk-accent) transition-colors">
                {t(option.en, option.ja)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
