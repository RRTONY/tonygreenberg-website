import type { Metadata } from "next";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { CompareExplorer } from "@/components/brewsoul/compare-explorer";

export const metadata: Metadata = {
  title: "Compare Coffees — BrewSoul",
  description: "Select up to 4 coffees to compare scores, flavor profiles, and value side by side.",
  alternates: { canonical: "/brewsoul/compare" },
};

export default function BrewSoulComparePage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#C5A23C] uppercase">Side by Side</div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">Compare Coffees</h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        Select up to 4 coffees to compare scores, flavor profiles, and value.
      </p>

      <CompareExplorer coffees={BREWSOUL_COFFEES} />
    </section>
  );
}
