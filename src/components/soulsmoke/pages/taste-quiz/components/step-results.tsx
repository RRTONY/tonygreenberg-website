"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Flag, Globe, Heart, RotateCcw, Sparkles } from "lucide-react";
import { useFavorites, useLanguage } from "@/components/soulsmoke/soulsmoke-providers";
import { allMezcals, type FlavorProfile, type Mezcal } from "@/lib/content/soulsmoke/mezcal-data";
import { ss } from "@/lib/content/soulsmoke/nav";
import { questions, tasteQuizData } from "../data/taste-quiz.data";
import type { TasteQuizStepProps } from "../taste-quiz";

// Step 2: the visitor's flavor profile and their top 10 matches (same scoring as the app:
// bottles with EEI 5+, ranked by the average gap between their flavor scores and the answers).

export function scoreMezcals(answers: Record<string, number>) {
  if (Object.keys(answers).length < questions.length) return [];
  return allMezcals
    .filter((m) => m.eei >= 5) // Only recommend decent bottles
    .map((mezcal) => {
      let totalDiff = 0;
      let dimensions = 0;
      Object.entries(answers).forEach(([dim, preferredValue]) => {
        const actualValue = mezcal.flavor[dim as keyof FlavorProfile];
        if (actualValue !== undefined) {
          // Lower difference = better match
          totalDiff += Math.abs(actualValue - preferredValue);
          dimensions++;
        }
      });
      const avgDiff = dimensions > 0 ? totalDiff / dimensions : 10;
      const matchScore = Math.max(0, 100 - avgDiff * 10);
      return { mezcal, matchScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);
}

// Market badge: the app used flag emoji; icons here (CONTRIBUTING rule 18), same labels and colors.
const MARKET_BADGE: Record<Mezcal["market"], string> = {
  us: "inline-flex items-center gap-1 rounded bg-amber-900/30 px-2 py-1 text-xs text-amber-400",
  mexico: "inline-flex items-center gap-1 rounded bg-green-900/30 px-2 py-1 text-xs text-green-400",
  both: "inline-flex items-center gap-1 rounded bg-purple-900/30 px-2 py-1 text-xs text-purple-400",
};

export function StepResults({ quiz }: TasteQuizStepProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { language } = useLanguage();
  const copy = language === "es" ? tasteQuizData.es : tasteQuizData.en;
  const { answers } = quiz.state;
  const recommendations = useMemo(() => scoreMezcals(answers), [answers]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f0e8]">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-[#8b4513]/20 bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href={ss("/")} className="font-serif text-2xl tracking-wider text-[#d4a574]">
            {tasteQuizData.brand}
          </Link>
          <button
            type="button"
            onClick={quiz.reset}
            className="flex items-center gap-2 text-[#d4a574] transition-colors hover:text-[#f5f0e8]"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            {copy.retake}
          </button>
        </div>
      </header>

      <div className="px-6 pt-24 pb-16">
        <div className="mx-auto max-w-4xl">
          {/* Results Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 text-[#d4a574]">
              <Sparkles aria-hidden="true" className="size-5" />
              <span className="text-sm tracking-widest uppercase">{copy.eyebrow}</span>
            </div>
            <h1 className="mb-4 font-serif text-4xl md:text-5xl">{copy.title}</h1>
            <p className="mx-auto max-w-2xl text-[#a0a0a0]">{copy.intro}</p>
          </div>

          {/* Your Flavor Profile */}
          <div className="mb-8 rounded-lg bg-[#2a2a2a] p-6">
            <h2 className="mb-4 font-serif text-xl text-[#d4a574]">{copy.profile}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(answers).map(([dim, value]) => (
                <div key={dim} className="text-center">
                  <div className="text-2xl font-bold text-[#f5f0e8]">{value}</div>
                  <div className="text-xs tracking-wider text-[#a0a0a0] capitalize">{dim}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            {recommendations.map(({ mezcal, matchScore }, index) => {
              const saved = isFavorite(mezcal.id);
              return (
                <div
                  key={mezcal.id}
                  className="flex items-start gap-6 rounded-lg bg-[#2a2a2a] p-6 transition-colors hover:bg-[#333]"
                >
                  {/* Rank */}
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#8b4513]/20">
                    <span className="text-xl font-bold text-[#d4a574]">{index + 1}</span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 grow">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg text-[#f5f0e8]">
                          {mezcal.brand} <span className="text-[#d4a574]">{mezcal.name}</span>
                        </h3>
                        <p className="text-sm text-[#a0a0a0]">
                          {mezcal.agave} · {mezcal.region}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#d4a574]">{Math.round(matchScore)}%</div>
                        <div className="text-xs text-[#a0a0a0]">{copy.match}</div>
                      </div>
                    </div>

                    <p className="mb-3 text-sm text-[#a0a0a0]">{mezcal.tastingNotes}</p>

                    <div className="flex flex-wrap items-center gap-4">
                      <span className={MARKET_BADGE[mezcal.market]}>
                        {mezcal.market === "both" ? (
                          <Globe aria-hidden="true" className="size-3" />
                        ) : (
                          <Flag aria-hidden="true" className="size-3" />
                        )}
                        {tasteQuizData.market[mezcal.market]}
                      </span>
                      <span className="text-xs text-[#a0a0a0]">${mezcal.price}</span>
                      <span className="text-xs text-[#a0a0a0] capitalize">{mezcal.availability}</span>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(mezcal.id)}
                        aria-pressed={saved}
                        className={
                          saved
                            ? "ml-auto flex items-center gap-1 text-sm text-red-400"
                            : "ml-auto flex items-center gap-1 text-sm text-[#a0a0a0] hover:text-red-400"
                        }
                      >
                        <Heart aria-hidden="true" className={saved ? "size-4 fill-current" : "size-4"} />
                        {saved ? copy.saved : copy.save}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={ss("/quadrant")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8b4513] px-8 py-3 text-[#f5f0e8] transition-colors hover:bg-[#a0522d]"
            >
              <Sparkles aria-hidden="true" className="size-4" />
              {copy.quadrant}
            </Link>
            <Link
              href={ss("/my-hunt-list")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8b4513] px-8 py-3 text-[#d4a574] transition-colors hover:bg-[#8b4513]/20"
            >
              <Heart aria-hidden="true" className="size-4" />
              {copy.huntList}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
