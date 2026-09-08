import type { Metadata } from "next";
import { SHAME_ENTRIES } from "@/lib/content/brewsoul-encyclopedia";
import { ShameExplorer } from "@/components/brewsoul/shame-explorer";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulContent.tsx's
// `BrewSoulShame` — real 13 Wall of Shame entries (brand/category/
// evidence/severity/response), unchanged. Category filter buttons moved
// into `ShameExplorer`, the only interactive piece, so this stays a
// Server Component.
export const metadata: Metadata = {
  title: "Wall of Shame — BrewSoul",
  description: "The coffee industry practices, brands, and myths that exploit farmers, mislead consumers, or perpetuate harm.",
  alternates: { canonical: "/brewsoul/wall-of-shame" },
};

export default function BrewSoulWallOfShamePage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#8B2500] uppercase">The Reckoning</div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">Wall of Shame</h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        The coffee industry has a transparency problem. These are the practices, brands, and myths that exploit farmers, mislead consumers, or perpetuate
        harm. We name names because accountability starts with visibility.
      </p>

      <ShameExplorer entries={SHAME_ENTRIES} />

      <NextSteps
        steps={[
          { label: "Browse Clean Coffees", path: "/brewsoul/browse", description: "Find the good stuff" },
          { label: "Mold-Free Verified", path: "/brewsoul/mold-free", description: "Tested & clean" },
          { label: "Chain Rankings", path: "/brewsoul/chains", description: "Who's actually good?" },
        ]}
      />
    </section>
  );
}
