"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Coffee,
  Droplets,
  FlaskConical,
  Gem,
  Search,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { computeQPR, computeTier, tierLabel } from "@/lib/intelligence-engine/scoring";
import type { CatalogItem } from "@/lib/intelligence-engine/types";
import { JourneyBar, markVisited } from "@/components/brewsoul/journey-bar";

// Ported from legacy client/src/pages/brewsoul/BrewSoulQuiz.tsx — the
// taste-preference quiz (distinct from the identity quiz at /brewsoul):
// 7 questions scored against each coffee's real `flavorProfile` via the
// real scoring engine (lib/intelligence-engine/scoring.ts), ranking the
// full 107-coffee catalog by match. Real content/logic, unchanged.
// Canvas-based WarmParticles dropped (same call made repeatedly
// elsewhere), and the dead hero photo (`/api/img/brewsoul-orig_...`,
// same confirmed-404 Manus proxy) dropped for a CSS gradient — no image
// left, so the screen-based hero-image cycling it drove goes with it.
const QUESTIONS = [
  {
    q: "How do you feel about bright, citrusy acidity?",
    dim: "acidity",
    opts: [
      { text: "Love it — the brighter the better", score: 9 },
      { text: "I enjoy some brightness", score: 6 },
      { text: "Prefer smooth and mellow", score: 3 },
      { text: "Hate it — give me zero acidity", score: 1 },
    ],
  },
  {
    q: "Body preference — how heavy in the mouth?",
    dim: "body",
    opts: [
      { text: "Tea-like, delicate, transparent", score: 3 },
      { text: "Medium, balanced, silky", score: 5 },
      { text: "Full, creamy, coating", score: 8 },
      { text: "Thick, syrupy, chewy", score: 10 },
    ],
  },
  {
    q: "Sweetness — what kind?",
    dim: "sweetness",
    opts: [
      { text: "Floral honey, raw sugar", score: 8 },
      { text: "Stone fruit, caramel", score: 6 },
      { text: "Dark chocolate, molasses", score: 4 },
      { text: "I don't care about sweetness", score: 2 },
    ],
  },
  {
    q: "Complexity — how adventurous?",
    dim: "complexity",
    opts: [
      { text: "Surprise me — the weirder the better", score: 10 },
      { text: "I like interesting but approachable", score: 7 },
      { text: "Clean and predictable is fine", score: 4 },
      { text: "Just good coffee, nothing fancy", score: 2 },
    ],
  },
  {
    q: "Fruit forward or chocolate forward?",
    dim: "fruitiness",
    opts: [
      { text: "Berries, citrus, tropical fruit all day", score: 9 },
      { text: "Some fruit is nice, balanced", score: 6 },
      { text: "Chocolate, nuts, caramel please", score: 3 },
      { text: "No preference", score: 5 },
    ],
  },
  {
    q: "How do you usually brew?",
    dim: "brew",
    opts: [
      { text: "Pour-over (V60, Chemex, Kalita)", score: 0 },
      { text: "Espresso", score: 0 },
      { text: "French press / AeroPress", score: 0 },
      { text: "Cold brew", score: 0 },
      { text: "Drip machine", score: 0 },
    ],
  },
  {
    q: "Budget per bag?",
    dim: "budget",
    opts: [
      { text: "Under $15", score: 15 },
      { text: "$15–25", score: 25 },
      { text: "$25–45", score: 45 },
      { text: "$45+ — quality over price", score: 200 },
    ],
  },
];

const QUESTION_ICONS: Record<string, LucideIcon> = {
  acidity: Search,
  body: Coffee,
  sweetness: Gem,
  complexity: FlaskConical,
  fruitiness: Sprout,
  brew: Droplets,
  budget: Banknote,
};

function matchScore(coffee: CatalogItem, prefs: Record<string, number>): number {
  let score = 0;
  const fp = coffee.flavorProfile;
  const dims = ["acidity", "body", "sweetness", "complexity", "fruitiness"];
  for (const dim of dims) {
    if (prefs[dim] != null && fp[dim] != null) {
      const diff = Math.abs(prefs[dim] - fp[dim]);
      score += Math.max(0, 10 - diff);
    }
  }
  if (prefs.budget && coffee.priceUsd <= prefs.budget) score += 5;
  return score;
}

function OptionCard({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-[#8B6914]/15 bg-white/60 px-5 py-3.5 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8B6914]/50 hover:bg-white/85 hover:shadow-lg"
    >
      <span className="font-sans text-sm text-[#2A2A2A]">{text}</span>
    </button>
  );
}

export function BrewSoulQuiz() {
  useEffect(() => {
    markVisited("quiz");
  }, []);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [fadeIn, setFadeIn] = useState(true);
  const done = step >= QUESTIONS.length;

  const matches = useMemo(() => {
    if (!done) return [];
    return BREWSOUL_COFFEES.map((c) => ({
      coffee: c,
      match: matchScore(c, answers),
      qpr: computeQPR(c, BREWSOUL_COFFEES),
      tier: computeTier(c.cuppingScore || 0),
    }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 8);
  }, [done, answers]);

  const pick = (dim: string, score: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [dim]: score }));
      setStep(step + 1);
      setFadeIn(true);
    }, 250);
  };

  const progress = done ? 100 : (step / QUESTIONS.length) * 100;

  if (done) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#FAFAF7] via-[#F0E8D8] to-[#F5F0E6]">
        <div className="fixed inset-x-0 top-0 z-100 h-1 bg-[#8B6914]/8">
          <div className="h-full w-full bg-linear-to-r from-[#C5A23C] to-[#8B6914] shadow-[0_0_12px_rgba(197,162,60,0.4)]" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col items-center px-6 pt-24 pb-12 text-center">
          <div className="w-full max-w-2xl">
            <div className="mb-3 font-mono text-[0.68rem] tracking-[0.3em] text-[#8B6914] uppercase">
              Your Palate Matches
            </div>
            <h1 className="mb-2 font-heading text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
              We Found Your Coffees
            </h1>
            <p className="mb-8 text-sm text-[#6A6A6A]">
              Ranked by how well they match your palate preferences across acidity, body, sweetness,
              complexity, and fruit.
            </p>

            <div className="flex flex-col gap-3">
              {matches.map(({ coffee, match, qpr, tier }, i) => (
                <Link
                  key={coffee.id}
                  href={`/brewsoul/coffee/${coffee.id}`}
                  className={`flex items-center gap-4 rounded-2xl border bg-white/60 px-5 py-4 text-left backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/85 hover:shadow-lg ${
                    i === 0 ? "border-2 border-[#8B6914]/40" : "border-[#8B6914]/15"
                  }`}
                >
                  <div
                    className={`w-10 text-center font-heading text-2xl font-bold ${i === 0 ? "text-[#8B6914]" : "text-[#8B6914]/40"}`}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-heading text-base font-bold text-[#2C1810]">
                      {coffee.name}
                    </div>
                    <div className="font-mono text-[0.68rem] text-[#6F4E37]">
                      {coffee.producer} · {coffee.originCountry} · {coffee.variety}
                    </div>
                    <div className="text-[0.78rem] text-[#999] italic">
                      {coffee.tastingNotes.slice(0, 4).join(", ")}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-sm font-bold text-[#4A7C59]">
                      {Math.round((match / 55) * 100)}% match
                    </div>
                    <div className="font-mono text-[0.68rem] text-[#999]">
                      QPR {qpr} · {tierLabel(tier)} · ${coffee.priceUsd}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  setStep(0);
                  setAnswers({});
                }}
                className="rounded-md bg-linear-to-br from-[#C5A23C] to-[#8B6914] px-8 py-3.5 font-mono text-xs font-bold tracking-wide text-[#FAFAF7] uppercase shadow-[0_6px_24px_rgba(139,105,20,0.35)]"
              >
                <span>Retake Quiz</span>
                <ArrowRight aria-hidden="true" className="ml-2 inline size-3.5" />
              </button>
              <Link
                href="/brewsoul/browse"
                className="rounded-md border-[1.5px] border-[#8B6914]/30 bg-white/70 px-8 py-3.5 font-mono text-xs font-bold tracking-wide text-[#8B6914] uppercase backdrop-blur-md"
              >
                Browse All Coffees
              </Link>
            </div>
          </div>
        </div>
        <JourneyBar />
        <div className="h-20" />
      </div>
    );
  }

  const cur = QUESTIONS[step];
  const QuestionIcon = QUESTION_ICONS[cur.dim] ?? Coffee;
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#FAFAF7] via-[#F0E8D8] to-[#F5F0E6]">
      <div className="fixed inset-x-0 top-0 z-100 h-1 bg-[#8B6914]/8">
        <div
          className="h-full bg-linear-to-r from-[#C5A23C] to-[#8B6914] shadow-[0_0_12px_rgba(197,162,60,0.4)] transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {step === 0 && (
          <div className="mx-auto max-w-2xl px-6 pt-24 pb-6 text-center">
            <div className="mb-5 font-mono text-[0.65rem] tracking-[0.35em] text-[#8B6914] uppercase">
              Taste Profile Builder
            </div>
            <h1 className="mb-5 font-heading text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
              Seven questions.
              <br />
              <span className="text-[#8B6914]">Your perfect cup, decoded.</span>
            </h1>
            <p className="mx-auto max-w-md rounded-xl bg-[#FAFAF7]/70 p-5 text-sm leading-loose text-[#4A4A4A] backdrop-blur-md">
              We&apos;ll map your palate across acidity, body, sweetness, complexity, and fruit
              preference — then match you to coffees from our catalog of {BREWSOUL_COFFEES.length}{" "}
              scored beans.
            </p>
          </div>
        )}

        <div
          className={`flex flex-1 flex-col items-center justify-center px-6 pb-8 transition-opacity duration-300 ${step === 0 ? "pt-4" : "pt-[52vh]"}`}
          style={{ opacity: fadeIn ? 1 : 0 }}
        >
          <div className="w-full max-w-xl text-center">
            <div className="mb-6 font-mono text-[0.62rem] tracking-[0.25em] text-[#8B6914]/50 uppercase">
              {step + 1} / {QUESTIONS.length}
            </div>

            <QuestionIcon aria-hidden="true" className="mx-auto mb-3 size-10 text-[#8B6914]" />

            <h2 className="mb-6 font-heading text-xl font-bold text-[#1A1A1A] sm:text-2xl">
              {cur.q}
            </h2>

            <div className="flex flex-col gap-2.5">
              {cur.opts.map((o) => (
                <OptionCard key={o.text} text={o.text} onClick={() => pick(cur.dim, o.score)} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 pb-10">
          {step > 0 && (
            <button
              onClick={() => {
                setFadeIn(false);
                setTimeout(() => {
                  setStep(step - 1);
                  setFadeIn(true);
                }, 250);
              }}
              className="font-mono text-[0.65rem] tracking-wide text-[#5A4A20]/35"
            >
              <ArrowLeft aria-hidden="true" className="mr-1 inline size-3.5" />
              Back
            </button>
          )}
          <Link
            href="/brewsoul/browse"
            className="font-mono text-[0.65rem] tracking-wide text-[#5A4A20]/25"
          >
            Skip — browse all coffees
            <ArrowRight aria-hidden="true" className="ml-1 inline size-3.5" />
          </Link>
        </div>
      </div>
      <JourneyBar />
      <div className="h-20" />
    </div>
  );
}
