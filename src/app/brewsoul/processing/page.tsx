import type { Metadata } from "next";
import { PROCESSING_METHODS } from "@/lib/content/brewsoul-encyclopedia";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulReference.tsx's
// `BrewSoulProcessing` — real processing-method entries (description,
// flavor impact, complexity, controversy), unchanged. Fully static.
export const metadata: Metadata = {
  title: "Processing Methods — BrewSoul",
  description: "How a coffee cherry is processed after picking determines up to 60% of its final flavor — every method explained.",
  alternates: { canonical: "/brewsoul/processing" },
};

export default function BrewSoulProcessingPage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#6F4E37] uppercase">From Cherry to Cup</div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">Processing Methods</h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        How a coffee cherry is processed after picking determines up to 60% of its final flavor.
      </p>

      <div className="flex flex-col gap-6">
        {PROCESSING_METHODS.map((pm) => (
          <div key={pm.id} className="rounded-xl border border-[#6F4E37]/8 border-l-4 border-l-[#6F4E37] bg-white p-6">
            <h3 className="mb-1.5 font-heading text-xl font-bold text-[#2C1810]">{pm.name}</h3>
            <p className="mb-3 text-[0.9rem] leading-relaxed text-[#6B5B4F]">{pm.description}</p>
            <div className="mb-1 font-mono text-[0.72rem] font-bold text-[#4A7C59]">Flavor Impact</div>
            <p className="text-[0.85rem] text-[#4A7C59] italic">{pm.flavorImpact}</p>
            <div className="mt-2 font-mono text-[0.68rem] text-[#999]">
              Complexity: {pm.complexity}/10 · Category: {pm.category}
            </div>
            {pm.controversy && <p className="mt-2 text-[0.82rem] text-[#8B6914] italic">{pm.controversy}</p>}
          </div>
        ))}
      </div>

      <NextSteps
        steps={[
          { label: "Varieties Guide", path: "/brewsoul/varieties", description: "Bean types explained" },
          { label: "Farm Profiles", path: "/brewsoul/farms", description: "Where it grows" },
          { label: "Browse Catalog", path: "/brewsoul/browse", description: "Find your method" },
        ]}
      />
    </section>
  );
}
