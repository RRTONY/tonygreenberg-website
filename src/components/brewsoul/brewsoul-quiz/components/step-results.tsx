"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { computeQPR, computeTier, tierEmoji } from "@/lib/intelligence-engine/scoring";
import type { CatalogItem } from "@/lib/intelligence-engine/types";
import { quizData } from "../data/brewsoul-quiz.data";
import type { StepProps } from "../brewsoul-quiz";

// Legacy's scoring, unchanged: closeness on each flavor dimension, plus a
// bonus when the coffee fits the budget.
function matchScore(coffee: CatalogItem, prefs: Record<string, number>): number {
  let score = 0;
  const fp = coffee.flavorProfile;
  for (const dim of ["acidity", "body", "sweetness", "complexity", "fruitiness"]) {
    if (prefs[dim] != null && fp[dim] != null) score += Math.max(0, 10 - Math.abs(prefs[dim] - fp[dim]));
  }
  if (prefs.budget && coffee.priceUsd <= prefs.budget) score += 5;
  return score;
}

// Step 2: the top 8 coffees for the answers given.
export function StepResults({ quiz }: StepProps) {
  const { answers } = quiz.state;
  const matches = useMemo(
    () =>
      BREWSOUL_COFFEES.map((c) => ({
        coffee: c,
        match: matchScore(c, answers),
        qpr: computeQPR(c, BREWSOUL_COFFEES),
        tier: computeTier(c.cuppingScore || 0),
      }))
        .sort((a, b) => b.match - a.match)
        .slice(0, 8),
    [answers],
  );

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center px-6 pt-24 pb-12 text-center">
      <div className="w-full max-w-2xl">
        <div className="mb-3 font-mono text-[0.68rem] tracking-[0.3em] text-[#836311] uppercase">
          {quizData.results.eyebrow}
        </div>
        <h1 className="mb-2 font-heading text-3xl font-bold text-[#1A1A1A] sm:text-4xl">{quizData.results.title}</h1>
        <p className="mb-8 text-sm text-[#6A6A6A]">{quizData.results.body}</p>

        <div className="flex flex-col gap-3">
          {matches.map(({ coffee, match, qpr, tier }, i) => (
            <Link
              key={coffee.id}
              href={`/brewsoul/coffee/${coffee.id}`}
              className={`flex items-center gap-4 rounded-2xl border bg-white/60 px-5 py-4 text-left backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/85 hover:shadow-lg ${
                i === 0 ? "border-2 border-[#836311]/40" : "border-[#836311]/15"
              }`}
            >
              <div
                className={`w-10 text-center font-heading text-2xl font-bold ${i === 0 ? "text-[#836311]" : "text-[#836311]/40"}`}
              >
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-heading text-base font-bold text-[#2C1810]">{coffee.name}</div>
                <div className="font-mono text-[0.68rem] text-[#6F4E37]">
                  {coffee.producer} · {coffee.originCountry} · {coffee.variety}
                </div>
                <div className="text-[0.78rem] text-[#6E6E6E] italic">{coffee.tastingNotes.slice(0, 4).join(", ")}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-sm font-bold text-[#3B6548]">{Math.round((match / 55) * 100)}% match</div>
                <div className="font-mono text-[0.68rem] text-[#6E6E6E]">
                  QPR {qpr} · {tierEmoji(tier)} · ${coffee.priceUsd}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={quiz.reset}
            className="inline-flex items-center gap-2 rounded-md bg-linear-to-br from-[#C5A23C] to-[#836311] px-8 py-3.5 font-mono text-xs font-bold tracking-wide text-[#FAFAF7] uppercase shadow-[0_6px_24px_rgba(139,105,20,0.35)]"
          >
            {quizData.results.retake}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </button>
          <Link
            href="/brewsoul/browse"
            className="rounded-md border-[1.5px] border-[#836311]/30 bg-white/70 px-8 py-3.5 font-mono text-xs font-bold tracking-wide text-[#836311] uppercase backdrop-blur-md"
          >
            {quizData.results.browse}
          </Link>
        </div>
      </div>
    </div>
  );
}
