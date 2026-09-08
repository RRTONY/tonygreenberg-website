import type { Metadata } from "next";
import { DOLLAR_BREAKDOWNS } from "@/lib/content/brewsoul-encyclopedia";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulContent.tsx's
// `BrewSoulDollar` — real dollar-breakdown segments (farmer/exporter/
// importer/roaster/retailer percentages, commentary), unchanged. Fully
// static, so this is a Server Component.
export const metadata: Metadata = {
  title: "Follow the Dollar — BrewSoul",
  description: "Where your coffee dollar actually goes — real supply-chain economics at every price point.",
  alternates: { canonical: "/brewsoul/follow-the-dollar" },
};

export default function BrewSoulFollowTheDollarPage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#C5A23C] uppercase">Transparency</div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">Follow the Dollar</h1>
      <p className="mb-10 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        When you pay for a bag of specialty coffee, where does that money actually go? We break down the supply chain economics at every price point.
      </p>

      {DOLLAR_BREAKDOWNS.map((db) => {
        const segs = [
          { label: "Farmer", pct: db.farmerPct },
          { label: "Exporter", pct: db.exporterPct },
          { label: "Importer", pct: db.importerPct },
          { label: "Roaster", pct: db.roasterPct },
          { label: "Retailer", pct: db.retailerPct },
        ];
        const farmerBarClass = db.farmerPct >= 20 ? "bg-[#4A7C59]" : db.farmerPct >= 10 ? "bg-[#C5A23C]" : "bg-[#8B2500]";

        return (
          <div key={db.id} className="mb-10 rounded-xl border border-[#6F4E37]/8 bg-white p-6">
            <h3 className="mb-1 font-heading text-lg font-bold text-[#2C1810]">{db.segment}</h3>
            <div className="mb-4 font-mono text-[0.72rem] text-[#6F4E37]">
              Farmer gets: ${db.farmerDollars.toFixed(2)} of ${db.totalPrice}
            </div>
            <div className="flex flex-col gap-2">
              {segs.map((seg) => (
                <div key={seg.label} className="flex items-center gap-3">
                  <span className="w-18 shrink-0 text-right font-mono text-[0.68rem] text-[#6B5B4F]">{seg.label}</span>
                  <div className="h-5 flex-1 overflow-hidden rounded-sm bg-[#6F4E37]/4">
                    <div
                      className={`h-full rounded-sm ${seg.label === "Farmer" ? farmerBarClass : "bg-linear-to-r from-[#8B6914] to-[#A68B3C]"}`}
                      style={{ width: `${seg.pct}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 font-mono text-[0.72rem] font-bold text-[#2C1810]">{seg.pct}%</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.85rem] leading-relaxed text-[#6B5B4F] italic">{db.commentary}</p>
          </div>
        );
      })}

      <NextSteps
        steps={[
          { label: "Farm Profiles", path: "/brewsoul/farms", description: "Meet the growers" },
          { label: "Economics Deep Dive", path: "/brewsoul/economics", description: "The full picture" },
          { label: "Browse Ethical Coffees", path: "/brewsoul/browse", description: "Vote with your cup" },
        ]}
      />
    </section>
  );
}
