import type { Metadata } from "next";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { BlendBuilderExplorer } from "@/components/brewsoul/blend-builder-explorer";

export const metadata: Metadata = {
  title: "Blend Builder — BrewSoul",
  description: "Combine up to 5 coffees, adjust ratios, and see how the blend scores. Name it something worthy.",
  alternates: { canonical: "/brewsoul/blend-builder" },
};

export default function BrewSoulBlendBuilderPage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#6F4E37] uppercase">Your Vision</div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">Blend Builder</h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        Combine up to 5 coffees. Adjust ratios. See how the blend scores. Name it something worthy.
      </p>

      <BlendBuilderExplorer coffees={BREWSOUL_COFFEES} />
    </section>
  );
}
