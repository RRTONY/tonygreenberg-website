import type { Metadata } from "next";
import Link from "next/link";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { computeToolScores } from "@/lib/content/brewsoul-tool-scores";

// Ported from legacy client/src/pages/brewsoul/BrewSoulTools.tsx's
// `BrewSoulDrops` — the real top-12-by-overall-score coffees, unchanged.
// No client-side state at all (the legacy `useMemo` had no changing
// dependencies — it's a pure derived list), so this is a plain Server
// Component computed once at render.
export const metadata: Metadata = {
  title: "Latest Drops — BrewSoul",
  description:
    "The newest arrivals in specialty coffee — scored, reviewed, and ready for your grinder.",
  alternates: { canonical: "/brewsoul/drops" },
};

export default function BrewSoulDropsPage() {
  const scored = BREWSOUL_COFFEES.map((c) => ({ ...c, scores: computeToolScores(c) }))
    .sort((a, b) => (b.scores.overall || 0) - (a.scores.overall || 0))
    .slice(0, 12);

  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#8B2500] uppercase">
        Fresh Off the Roaster
      </div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">
        Latest Drops
      </h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        The newest arrivals in specialty coffee — scored, reviewed, and ready for your grinder.
      </p>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        {scored.map((c) => (
          <Link
            key={c.id}
            href={`/brewsoul/coffee/${c.id}`}
            className="relative block rounded-xl border border-[#6F4E37]/8 bg-white p-6"
          >
            <div className="absolute top-3 right-3 rounded-lg bg-[#8B2500]/8 px-2 py-0.5 font-mono text-[0.62rem] text-[#8B2500]">
              NEW
            </div>
            <div className="mb-1 font-mono text-[0.6rem] tracking-[0.15em] text-[#C5A23C] uppercase">
              {c.producer}
            </div>
            <h3 className="mb-1 font-heading text-base font-bold text-[#2C1810]">{c.name}</h3>
            <div className="mb-2 font-mono text-[0.68rem] text-[#6B5B4F]">
              {c.originCountry} · {c.variety} · {c.processingMethod}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.85rem] font-bold text-[#C5A23C]">
                {c.priceUsd ? `$${c.priceUsd}` : "—"}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[0.65rem] ${c.scores.tier <= 2 ? "bg-[#C5A23C]/10 text-[#C5A23C]" : "bg-[#4A7C59]/10 text-[#4A7C59]"}`}
              >
                {c.scores.tier}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
