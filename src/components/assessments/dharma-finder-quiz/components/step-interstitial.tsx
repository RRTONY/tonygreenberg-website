"use client";

import { INTERSTITIAL_QUOTES } from "../data/dharma-finder.data";
import type { StepProps } from "../dharma-finder-quiz";

// Step 2: a quote between parts; the hook moves on after 4 seconds.
export function StepInterstitial({ quiz }: StepProps) {
  const q = INTERSTITIAL_QUOTES[quiz.state.interstitial % INTERSTITIAL_QUOTES.length];
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A10] px-8 text-center">
      <div className="max-w-160">
        <p className="mb-6 font-heading text-[clamp(1.3rem,2.5vw,1.8rem)] leading-[1.6] text-[#F5F0E0] italic">&ldquo;{q.text}&rdquo;</p>
        <p className="font-mono text-[0.75rem] tracking-[0.2em] text-brand-gold-light uppercase">— {q.author}</p>
      </div>
    </div>
  );
}
