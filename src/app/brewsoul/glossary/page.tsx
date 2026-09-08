import type { Metadata } from "next";
import { GLOSSARY } from "@/lib/content/brewsoul-encyclopedia";
import { GlossaryExplorer } from "@/components/brewsoul/glossary-explorer";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulReference.tsx's
// `BrewSoulGlossary` — real specialty-coffee terminology entries,
// unchanged. Search + alphabetical grouping moved into
// `GlossaryExplorer`, the only interactive piece.
export const metadata: Metadata = {
  title: "Glossary — BrewSoul",
  description: "Every term you need to navigate specialty coffee — from crema to channeling.",
  alternates: { canonical: "/brewsoul/glossary" },
};

export default function BrewSoulGlossaryPage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#6F4E37] uppercase">Speak Coffee</div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">Glossary</h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        Every term you need to navigate specialty coffee without feeling like an outsider.
      </p>

      <GlossaryExplorer terms={GLOSSARY} />

      <NextSteps
        steps={[
          { label: "Varieties Guide", path: "/brewsoul/varieties", description: "Deep dive" },
          { label: "Processing Methods", path: "/brewsoul/processing", description: "How it's made" },
          { label: "Browse Catalog", path: "/brewsoul/browse", description: "Apply what you learned" },
        ]}
      />
    </section>
  );
}
