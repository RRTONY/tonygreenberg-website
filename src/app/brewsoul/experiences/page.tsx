import type { Metadata } from "next";
import { EXPERIENCES } from "@/lib/content/brewsoul-encyclopedia";
import { ExperiencesExplorer } from "@/components/brewsoul/experiences-explorer";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulContent.tsx's
// `BrewSoulExperiences` — real curated coffee experiences (farm tours,
// cafés, cupping labs, roastery visits), unchanged. Country filter
// buttons moved into `ExperiencesExplorer`, the only interactive piece.
export const metadata: Metadata = {
  title: "Experience Map — BrewSoul",
  description:
    "The best coffee experiences in the world — origin farm tours, legendary cafés, cupping labs, and roastery visits. Curated, not sponsored.",
  alternates: { canonical: "/brewsoul/experiences" },
};

export default function BrewSoulExperiencesPage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#C5A23C] uppercase">
        Beyond the Cup
      </div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">
        Experience Map
      </h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        The best coffee experiences in the world — from origin farm tours to legendary cafés,
        cupping labs, and immersive roastery visits. Curated, not sponsored.
      </p>

      <ExperiencesExplorer experiences={EXPERIENCES} />

      <NextSteps
        steps={[
          {
            label: "Food Pairings",
            path: "/brewsoul/pairings",
            description: "Perfect combinations",
          },
          {
            label: "Blend Builder",
            path: "/brewsoul/blend-builder",
            description: "Create your own",
          },
          { label: "Browse Catalog", path: "/brewsoul/browse", description: "Find your next cup" },
        ]}
      />
    </section>
  );
}
