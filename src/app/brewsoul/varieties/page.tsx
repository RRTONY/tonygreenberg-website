import type { Metadata } from "next";
import { VARIETIES } from "@/lib/content/brewsoul-encyclopedia";
import { VarietiesExplorer } from "@/components/brewsoul/varieties-explorer";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulReference.tsx's
// `BrewSoulVarieties` — real coffee variety encyclopedia entries
// (species/origin/genetics/cup profile/yield/disease resistance),
// unchanged. Search moved into `VarietiesExplorer`, the only interactive
// piece.
export const metadata: Metadata = {
  title: "Variety Encyclopedia — BrewSoul",
  description: "The definitive reference for specialty coffee varieties — genetics, cup profiles, and rarity.",
  alternates: { canonical: "/brewsoul/varieties" },
};

export default function BrewSoulVarietiesPage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#4A7C59] uppercase">Botany Meets Flavor</div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">Variety Encyclopedia</h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        Every coffee variety has a story — where it was discovered, how it mutated, what it tastes like. This is the most comprehensive variety guide
        outside the World Coffee Research catalog.
      </p>

      <VarietiesExplorer varieties={VARIETIES} />

      <NextSteps
        steps={[
          { label: "Processing Methods", path: "/brewsoul/processing", description: "How it's made" },
          { label: "Roaster Profiles", path: "/brewsoul/roasters", description: "Who roasts it" },
          { label: "Browse by Variety", path: "/brewsoul/browse", description: "Taste the difference" },
        ]}
      />
    </section>
  );
}
