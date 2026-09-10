import type { Metadata } from "next";
import { CHAIN_RANKINGS } from "@/lib/content/brewsoul-chains";
import { ChainsExplorer } from "@/components/brewsoul/chains-explorer";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulChains.tsx — the
// real top-100 coffee-chain ranking (5 real weighted dimensions →
// aggregate → S-F tier), unchanged; data extracted from legacy's
// computed `CHAIN_RANKINGS` export (see `lib/content/brewsoul-chains.ts`'s
// own port note). Filter/search/expand interactivity in
// `components/brewsoul/chains-explorer.tsx`, the only interactive piece.
export const metadata: Metadata = {
  title: "Top 100 Coffee Chains — BrewSoul",
  description:
    "Every major coffee chain in America, objectively scored across five dimensions: coffee quality, value, sourcing ethics, experience, and consistency.",
  alternates: { canonical: "/brewsoul/chains" },
};

export default function BrewSoulChainsPage() {
  return (
    <section className="mx-auto max-w-240 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#C5A23C] uppercase">
        The Definitive Ranking
      </div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">
        Top 100 Coffee Chains
      </h1>
      <p className="mb-4 max-w-3xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        Every major coffee chain in America, objectively scored across five dimensions: Coffee
        Quality (30%), Value (25%), Sourcing Ethics (20%), Experience (15%), and Consistency (10%).
        Aggregate scores from consumer reviews, expert panels, transparency audits, and direct trade
        data.
      </p>

      <div className="mb-6 rounded-lg border border-[#6F4E37]/12 bg-[#6F4E37]/4 p-5">
        <p className="mb-2 text-[0.82rem] leading-relaxed text-[#6B5B4F]">
          <strong className="text-[#6F4E37]">What you&apos;re looking at:</strong> The only ranking
          that unifies consumer reviews, expert cupping scores, sourcing audits, and transparency
          data into a single composite grade for every major coffee chain. S-tier means exceptional
          across all five dimensions. F-tier means you deserve better.
        </p>
        <p className="mb-2 text-[0.82rem] leading-relaxed text-[#6B5B4F]">
          <strong className="text-[#6F4E37]">Why it matters:</strong> You&apos;re spending $5–$7 per
          cup. That&apos;s $1,500–$2,500 a year. This tells you whether you&apos;re getting quality,
          ethics, and experience for that money — or just marketing.
        </p>
        <p className="text-[0.82rem] leading-relaxed text-[#6B5B4F]">
          <strong className="text-[#6F4E37]">What to do:</strong> Filter by tier badge to see the
          best (or worst). Click any chain to expand its full scoring breakdown. Use the search bar
          to find your go-to chain and see how it stacks up.
        </p>
      </div>

      <div className="mb-8 rounded-lg border border-[#C5A23C]/15 bg-[#C5A23C]/6 p-5">
        <div className="mb-1.5 font-mono text-[0.65rem] tracking-[0.15em] text-[#8B6914] uppercase">
          Scoring Methodology
        </div>
        <p className="text-[0.82rem] leading-relaxed text-[#6B5B4F]">
          Each dimension is scored 1–10 by aggregating Google reviews (4M+), Yelp reviews (2M+), SCA
          judge evaluations, specialty press ratings (Sprudge, Daily Coffee News, Barista Magazine),
          B Corp certifications, direct trade audit reports, and blind cupping panels. The weighted
          composite produces a 0–100 aggregate score that determines tier placement.
        </p>
      </div>

      <ChainsExplorer chains={CHAIN_RANKINGS} />

      <div className="mt-12 rounded-xl border border-[#6F4E37]/8 bg-[#6F4E37]/3 p-8 text-center">
        <div className="mb-2 font-heading text-xl font-bold text-[#2C1810]">
          Think we got it wrong?
        </div>
        <p className="mb-4 text-[0.88rem] text-[#6B5B4F]">
          Every ranking is an argument. If you have evidence that a chain should move up or down,
          submit an appeal with data and we&apos;ll review it.
        </p>
        <a
          href="/brewsoul/submit"
          className="inline-block rounded-lg bg-linear-to-br from-[#6F4E37] to-[#A68B3C] px-6 py-3 font-mono text-[0.78rem] tracking-[0.15em] text-white uppercase"
        >
          File an Appeal
        </a>
      </div>

      <NextSteps
        steps={[
          {
            label: "Browse Top Coffees",
            path: "/brewsoul/browse",
            description: "Find better options",
          },
          { label: "Take the Taste Quiz", path: "/brewsoul/quiz", description: "Get matched" },
          {
            label: "Follow the Dollar",
            path: "/brewsoul/follow-the-dollar",
            description: "Where your money goes",
          },
        ]}
      />
    </section>
  );
}
