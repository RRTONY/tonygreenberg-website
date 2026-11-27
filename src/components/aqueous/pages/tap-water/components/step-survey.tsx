"use client";

import type { CSSProperties } from "react";
import { ArrowLeft } from "lucide-react";
import { usePresenceSwap } from "@/components/aqueous/motion";
import { Button } from "@/components/aqueous/ui";
import type { StepProps } from "../tap-water";
import { surveyQuestions, tapWaterData } from "../data/tap-water.data";

const copy = tapWaterData.survey;

// Step 3: the 10-point Water Profile Survey (the app's WaterProfileSurvey), one slider per question.
export function StepSurvey({ tap }: StepProps) {
  const { questionIndex, survey, selectedCity } = tap.state;
  const isLast = questionIndex === surveyQuestions.length - 1;

  // The app's AnimatePresence mode="wait" keyed on the question: the old card slides out to the left
  // (x -40, 0.25s), then the new one slides in from the right (x 40).
  const { shown, leaving } = usePresenceSwap(questionIndex, 250);
  const q = surveyQuestions[shown];
  const Icon = q.icon;
  const value = survey[q.key];
  // Slider fill: the app's inline linear-gradient, with only the runtime percentage left as a style.
  const fill = { "--fill": `${((value - 1) / 9) * 100}%` } as CSSProperties;

  return (
    // framer initial {opacity 0, y 16} → animate
    <div className="mx-auto max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      <button
        onClick={tap.back}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> {copy.back}
      </button>

      <h2 className="font-aq-display mb-2 text-2xl font-bold">{copy.title}</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        {selectedCity ? `Personalized for ${selectedCity.city}, ${selectedCity.state}` : copy.generic}
      </p>

      {/* Progress (framer animated the width over 0.3s) */}
      <div className="mb-8">
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>
            Question {questionIndex + 1} of {surveyQuestions.length}
          </span>
          <span>{Math.round(tap.progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-[#0B3D3E] transition-[width] duration-300"
            style={{ width: `${tap.progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        key={shown}
        className={
          leaving
            ? "glass-card rounded-xl p-8 animate-out fade-out slide-out-to-left-10 duration-250 fill-mode-forwards"
            : "glass-card rounded-xl p-8 animate-in fade-in slide-in-from-right-10 duration-250 fill-mode-both"
        }
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#0B3D3E]">
            <Icon aria-hidden="true" className="size-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{q.title}</p>
            <h3 className="text-base font-semibold">{q.question}</h3>
          </div>
        </div>

        {/* Slider */}
        <div className="mt-8 mb-4">
          {/* Fix from live: the range input had no accessible name; it is now labelled with the question. */}
          <input
            type="range"
            min={1}
            max={10}
            value={value}
            aria-label={q.question}
            onChange={(e) => tap.answer(q.key, parseInt(e.target.value))}
            style={fill}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[linear-gradient(to_right,#0B3D3E_var(--fill),#e5e5e5_var(--fill))]"
          />
          <div className="mt-2 flex justify-between">
            <span className="text-xs text-muted-foreground">{q.low}</span>
            <span className="font-aq-display text-lg font-bold text-[#0B3D3E]">{value}</span>
            <span className="text-xs text-muted-foreground">{q.high}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={tap.previousQuestion}>
          {questionIndex === 0 ? copy.cancel : copy.previous}
        </Button>
        <Button onClick={tap.nextQuestion} className="bg-[#0B3D3E] text-white hover:bg-[#0B3D3E]/90">
          {isLast ? copy.finish : copy.next}
        </Button>
      </div>
    </div>
  );
}
