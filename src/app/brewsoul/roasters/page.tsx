import type { Metadata } from "next";
import { ROASTERS } from "@/lib/content/brewsoul-encyclopedia";
import { RoastersExplorer } from "@/components/brewsoul/roasters-explorer";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulReference.tsx's
// `BrewSoulRoasters` — real roaster directory (country/philosophy/
// quality/transparency/farmer-equity scores), unchanged. Search + tier
// filter moved into `RoastersExplorer`, the only interactive piece.
export const metadata: Metadata = {
  title: "Roaster Directory — BrewSoul",
  description: "Roasters profiled for sourcing transparently, roasting with intention, and paying farmers fairly.",
  alternates: { canonical: "/brewsoul/roasters" },
};

export default function BrewSoulRoastersPage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#C5A23C] uppercase">Who Roasts What Matters</div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">Roaster Directory</h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        We profile the roasters that source transparently, roast with intention, and pay farmers fairly.
      </p>

      <RoastersExplorer roasters={ROASTERS} />

      <NextSteps
        steps={[
          { label: "Browse Their Coffees", path: "/brewsoul/browse", description: "Taste their work" },
          { label: "Compare Coffees", path: "/brewsoul/compare", description: "Side by side" },
          { label: "New Drops", path: "/brewsoul/drops", description: "Latest releases" },
        ]}
      />
    </section>
  );
}
