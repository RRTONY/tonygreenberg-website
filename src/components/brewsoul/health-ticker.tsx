"use client";

import { useState } from "react";

// Ported from legacy client/src/pages/brewsoul/BrewSoulHome.tsx's inline
// health-fact cycler — pulled into its own tiny client island so the rest
// of /brewsoul/home can render as a Server Component. Real facts,
// unchanged.
const HEALTH_FACTS = [
  "3-5 cups/day = 12-15% lower all-cause mortality (Annals of Internal Medicine)",
  "Caffeine half-life: 6 hours. Your 2pm coffee is still 25% active at midnight.",
  "#1 source of antioxidants in most Western diets",
  "3-6% endurance improvement (Journal of Sports Science meta-analysis)",
  "Spikes cortisol 30% on empty stomach. CYP1A2 slow metabolizers feel it 2-3x longer.",
  "30% lower risk of Parkinson's disease",
  "Withdrawal headaches within 12-24 hours — real physiological dependence",
  "25% lower risk of Type 2 diabetes",
];

export function HealthTicker() {
  const [idx, setIdx] = useState(0);
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 rounded-2xl border border-[#8B6914]/15 bg-white/60 px-8 py-8 backdrop-blur-xl">
        <p className="min-h-12 font-heading text-lg text-[#2C1810] italic">&ldquo;{HEALTH_FACTS[idx]}&rdquo;</p>
      </div>
      <button
        onClick={() => setIdx((idx + 1) % HEALTH_FACTS.length)}
        className="rounded-md border border-[#8B6914]/20 bg-white/60 px-6 py-3 font-mono text-xs tracking-wide text-[#8B6914] uppercase backdrop-blur-xl transition-transform hover:-translate-y-0.5"
      >
        Next Fact →
      </button>
    </div>
  );
}
