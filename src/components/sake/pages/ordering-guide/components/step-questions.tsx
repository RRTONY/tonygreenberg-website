"use client";

import { ChevronRight, Leaf } from "lucide-react";
import { orderingGuideData as copy } from "../data/ordering-guide.data";
import type { StepProps } from "../ordering-guide";

// Step 2 of the Ordering Guide: the progress bar, "Question N of 5" and the options with their
// carbon hint. Each new question slides in from the right (the app's x: 40 → 0, 0.4s), options
// stagger in 0.1s apart. Fixed from live: the hover gold on an option's label was built from a
// class fragment the app never generated, so it never showed; it's a full class now.
export function StepQuestions({ guide, tone, t }: StepProps) {
  const { question, currentQuestion, totalQuestions } = guide;
  return (
    <div key={`q-${currentQuestion}`} className="animate-in fade-in slide-in-from-right-10 duration-400 fill-mode-both">
      <div className="flex items-center gap-2 mb-6" aria-hidden="true">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i < currentQuestion ? tone.progressDone : i === currentQuestion ? tone.progressNow : tone.progressTodo
            }`}
          />
        ))}
      </div>

      <div className={`text-[10px] tracking-[0.2em] uppercase mb-2 ${tone.textMuted}`}>
        {t(`Question ${currentQuestion + 1} of ${totalQuestions}`, `質問 ${currentQuestion + 1} / ${totalQuestions}`)}
      </div>

      <h3 className={`font-sk-display font-bold [.sake-austere_&]:font-light text-xl sm:text-2xl mb-6 ${tone.textMain}`}>
        {t(question.question, question.questionJa)}
      </h3>

      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button
            type="button"
            key={option.id}
            onClick={() => guide.answer(question, option.id)}
            style={{ animationDelay: `${i * 0.1}s` }}
            className={`w-full text-left p-4 border ${tone.cardBorder} ${tone.optionBg} transition-all group animate-in fade-in slide-in-from-bottom-2.5 duration-500 fill-mode-both`}
          >
            <span className="flex items-center justify-between">
              <span className={`text-sm ${tone.textMain} ${tone.groupGoldHover}`}>{t(option.label, option.labelJa)}</span>
              <ChevronRight aria-hidden="true" size={14} className={`${tone.textMuted} group-hover:translate-x-1 transition-transform`} />
            </span>
            <span className="flex items-center gap-1 mt-1">
              <Leaf
                aria-hidden="true"
                size={10}
                className={option.carbonWeight > 0.7 ? "text-green-500" : option.carbonWeight > 0.4 ? "text-yellow-500" : "text-red-400"}
              />
              <span className={`text-[9px] ${tone.textMuted}`}>
                {option.carbonWeight > 0.7
                  ? t(...copy.questions.lowCarbon)
                  : option.carbonWeight > 0.4
                    ? t(...copy.questions.moderateCarbon)
                    : t(...copy.questions.higherCarbon)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
