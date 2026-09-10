import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Dna, Droplets, Leaf, Pill, type LucideIcon } from "lucide-react";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { SHAME_ENTRIES } from "@/lib/content/brewsoul-encyclopedia";
import { computeQPR } from "@/lib/intelligence-engine/scoring";
import { CoffeeCard } from "@/components/brewsoul/coffee-card";
import { HealthTicker } from "@/components/brewsoul/health-ticker";
import { JourneyBar, MarkVisited } from "@/components/brewsoul/journey-bar";

// Ported from legacy client/src/pages/brewsoul/BrewSoulHome.tsx — the
// BrewSoul dashboard (distinct from /brewsoul's identity-quiz welcome
// gate and /brewsoul/first-sip's manifesto). Real content/sections
// unchanged: hero + stats, Follow the Dollar teaser, Top QPR coffees,
// the 2025 crisis callout, New Drops, a Wall of Shame preview, the
// research-hub card grid, and a cyclable health-fact ticker. Simplified
// per this migration's established pattern: the canvas WarmParticles/
// ParallaxBg decorations and the dead hero photo (`/api/img/
// brewsoul-orig_84eb4bc9.jpg`, same confirmed-404 Manus proxy used
// elsewhere) are dropped for CSS gradients; legacy's "glass card" styling
// is expressed as Tailwind utilities instead of inline styles. Stats use
// the real live coffee count (BREWSOUL_COFFEES.length = 107, not
// legacy's stale "103") — see brewsoul-coffees.ts's own port note. The
// "100 Chains Ranked" stat is a real forward-reference to /brewsoul/chains
// (not built yet in this pass, same pattern as elsewhere in Phase 6) —
// legacy's own chain dataset has ~100 real entries, so the number isn't
// stale, just not yet linked to a live page.
export const metadata: Metadata = {
  title: "BrewSoul — Specialty Coffee Intelligence",
  description:
    "The world's most rigorous specialty coffee platform. Sourcing, roasting, and brewing intelligence for serious coffee people.",
  alternates: { canonical: "/brewsoul/home" },
};

const RESEARCH_CARDS: {
  path: string;
  icon: LucideIcon;
  title: string;
  sub: string;
  tag: string;
}[] = [
  {
    path: "/brewsoul/biodynamic",
    icon: Leaf,
    title: "Biodynamic Census",
    sub: "3 Demeter farms, 6 roasters, every product priced",
    tag: "COMPLETE",
  },
  {
    path: "/brewsoul/decaf",
    icon: Droplets,
    title: "Decaf Done Right",
    sub: "13 clean brands vs. 10+ using paint stripper",
    tag: "13 BRANDS",
  },
  {
    path: "/brewsoul/health",
    icon: Dna,
    title: "Coffee & Health",
    sub: "8 longevity benefits, 7 real risks, CYP1A2 genetics",
    tag: "SCIENCE",
  },
  {
    path: "/brewsoul/prescription",
    icon: Pill,
    title: "Your Prescription",
    sub: "AI-powered daily protocol based on your genetics",
    tag: "AI",
  },
];

export default function BrewSoulHomePage() {
  const allScored = BREWSOUL_COFFEES.map((coffee) => ({
    coffee,
    scores: { qpr: computeQPR(coffee, BREWSOUL_COFFEES) },
  }));
  const topQPR = [...allScored].sort((a, b) => b.scores.qpr - a.scores.qpr).slice(0, 6);
  const newDrops = allScored.filter((x) => x.coffee.limitedRelease || x.coffee.inStock).slice(0, 4);
  const shamePreview = SHAME_ENTRIES.slice(0, 3);

  return (
    <div>
      <MarkVisited stepId="home" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#FAFAF7] via-[#F0E8D8] to-[#E8DCC8] px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <div className="mb-5 font-mono text-xs tracking-[0.35em] text-[#8B6914] uppercase">
            The Coffee Intelligence Engine
          </div>
          <h1 className="mb-5 font-heading text-4xl font-bold text-[#1A1A1A] sm:text-5xl">
            Find the Coffee You&apos;ll
            <br />
            Actually <em className="text-[#8B6914] italic">Love</em>
          </h1>
          <p className="mx-auto mb-8 max-w-lg rounded-2xl bg-[#FAFAF7]/70 px-6 py-4 text-base leading-relaxed text-[#4A4A4A] backdrop-blur-md">
            Taste-matched. QPR-scored. Mold-tested. Farm-traced. Dollar-tracked.
            <br />
            {BREWSOUL_COFFEES.length} coffees scored. 100 chains ranked. 6 identity archetypes.
          </p>

          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {[
              { val: String(BREWSOUL_COFFEES.length), label: "Coffees Scored" },
              { val: "100", label: "Chains Ranked" },
              { val: "6", label: "Identity Types" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[#8B6914]/15 bg-white/60 px-6 py-4 text-center backdrop-blur-xl"
              >
                <div className="font-heading text-3xl font-bold text-[#8B6914]">{s.val}</div>
                <div className="mt-1 font-mono text-[0.62rem] tracking-[0.2em] text-[#5A4A20]/60 uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/brewsoul/quiz"
              className="rounded-md bg-linear-to-br from-[#C5A23C] to-[#8B6914] px-8 py-3.5 font-mono text-xs font-bold tracking-wide text-[#FAFAF7] uppercase shadow-[0_8px_32px_rgba(139,105,20,0.4)] transition-transform hover:-translate-y-0.5"
            >
              <span>Start Taste Quiz</span>
              <ArrowRight aria-hidden="true" className="ml-2 inline size-3.5" />
            </Link>
            <Link
              href="/brewsoul/browse"
              className="rounded-md border-[1.5px] border-[#8B6914]/30 bg-white/70 px-8 py-3.5 font-mono text-xs font-bold tracking-wide text-[#8B6914] uppercase backdrop-blur-md transition-transform hover:-translate-y-0.5"
            >
              Browse Top QPR
            </Link>
            <Link
              href="/brewsoul/chains"
              className="rounded-md border-[1.5px] border-[#8B6914]/30 bg-white/70 px-8 py-3.5 font-mono text-xs font-bold tracking-wide text-[#8B6914] uppercase backdrop-blur-md transition-transform hover:-translate-y-0.5"
            >
              Chain Rankings
            </Link>
          </div>

          <div className="mx-auto max-w-xl rounded-2xl border border-[#8B6914]/15 bg-white/60 p-7 text-left backdrop-blur-xl">
            <p className="mb-2.5 text-sm leading-relaxed text-[#5A4A20]">
              <strong className="text-[#8B6914]">What you&apos;re looking at:</strong> An
              intelligence engine that objectively scores every coffee and chain on quality, value,
              sourcing ethics, and experience — then matches you to your identity through a
              6-archetype taste quiz.
            </p>
            <p className="mb-2.5 text-sm leading-relaxed text-[#5A4A20]">
              <strong className="text-[#8B6914]">Why it matters:</strong> Coffee is the most
              consumed psychoactive substance on earth, yet most people have no idea what
              they&apos;re actually drinking. This engine replaces marketing with measurement.
            </p>
            <p className="text-sm leading-relaxed text-[#5A4A20]">
              <strong className="text-[#8B6914]">What to do:</strong> Take the taste quiz to
              discover your BrewSoul identity. Browse the catalog to find your next cup. Check the
              chain rankings to see if your daily stop is worth the money.
            </p>
          </div>
        </div>
      </section>

      {/* Follow the Dollar */}
      <section className="bg-linear-to-b from-[#E8DCC8] via-[#F0E8D8] to-[#F5F0E6] px-6 py-16 text-center">
        <div className="mb-4 font-mono text-xs tracking-[0.3em] text-[#8B6914] uppercase">
          Follow The Dollar
        </div>
        <h2 className="mx-auto mb-6 max-w-lg font-heading text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
          The farmer gets $0.40 of your $5 latte.
        </h2>
        <div className="mx-auto mb-6 max-w-lg rounded-2xl border border-[#8B6914]/15 bg-white/60 px-6 py-5 backdrop-blur-xl">
          <p className="text-sm leading-relaxed text-[#4A4A4A]">
            That&apos;s 8%. Specialty coffee has <em>less</em> equitable distribution than
            mainstream. We show you exactly where every dollar goes.
          </p>
        </div>
        <Link
          href="/brewsoul/follow-the-dollar"
          className="inline-block rounded-md bg-linear-to-br from-[#C5A23C] to-[#8B6914] px-7 py-3 font-mono text-[0.78rem] font-bold tracking-wide text-[#FAFAF7] uppercase shadow-[0_6px_24px_rgba(139,105,20,0.35)] transition-transform hover:-translate-y-0.5"
        >
          See the Full Breakdown <ForwardIcon aria-hidden="true" />
        </Link>
      </section>

      {/* Top QPR */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10 text-center">
          <div className="mb-2 font-mono text-xs tracking-[0.3em] text-[#8B6914] uppercase">
            Best Value Right Now
          </div>
          <h2 className="mb-2 font-heading text-3xl font-bold text-[#2C1810]">Top QPR Coffees</h2>
          <p className="mx-auto max-w-md text-sm text-[#6B5B4F]">
            Quality-to-Price Ratio — the coffees that punch above their weight class.
          </p>
        </div>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {topQPR.map(({ coffee, scores }) => (
            <Link key={coffee.id} href={`/brewsoul/coffee/${coffee.id}`}>
              <CoffeeCard coffee={coffee} scores={scores} />
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/brewsoul/browse"
            className="font-mono text-[0.78rem] tracking-wide text-[#8B6914] uppercase"
          >
            Browse All {BREWSOUL_COFFEES.length} Coffees <ForwardIcon aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* 2025 Crisis */}
      <section className="bg-linear-to-b from-[#F0E8D8] via-[#E8DCC8] to-[#F5F0E6] px-6 py-16 text-center">
        <div className="mb-4 font-mono text-xs tracking-[0.3em] text-[#8B2500] uppercase">
          The 2025 Crisis
        </div>
        <h2 className="mx-auto mb-6 max-w-lg font-heading text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
          Arabica hit $4.41/lb.
          <br />
          50% of coffee land gone by 2050.
        </h2>
        <div className="mx-auto max-w-md rounded-2xl border border-[#8B6914]/15 bg-white/60 px-6 py-5 backdrop-blur-xl">
          <p className="text-sm leading-relaxed text-[#4A4A4A]">
            Your choices matter more now than ever. Every cup is a vote for the future of coffee.
          </p>
        </div>
      </section>

      {/* New Drops */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <div className="mb-1 font-mono text-xs tracking-[0.3em] text-[#8B6914] uppercase">
              Fresh
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#2C1810]">New Drops</h2>
          </div>
          <Link href="/brewsoul/drops" className="font-mono text-xs tracking-wide text-[#8B6914]">
            See all
            <ArrowRight aria-hidden="true" className="ml-1 inline size-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {newDrops.map(({ coffee, scores }) => (
            <Link key={coffee.id} href={`/brewsoul/coffee/${coffee.id}`}>
              <CoffeeCard coffee={coffee} scores={scores} />
            </Link>
          ))}
        </div>
      </section>

      {/* Wall of Shame preview */}
      <section className="bg-linear-to-b from-[#F5F0E6] to-[#FAFAF7] px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-2 font-mono text-xs tracking-[0.3em] text-[#8B2500] uppercase">
              Accountability
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#2C1810]">Wall of Shame</h2>
          </div>
          <div className="flex flex-col gap-3">
            {shamePreview.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-2xl border border-[#8B6914]/15 bg-white/60 px-5 py-4 backdrop-blur-xl"
              >
                <div>
                  <span className="font-heading text-base font-bold text-[#2C1810]">{s.brand}</span>
                  <span className="ml-3 font-mono text-xs text-[#999]">{s.category}</span>
                </div>
                <span
                  className={`font-mono text-sm font-bold ${s.severity >= 80 ? "text-[#8B2500]" : s.severity >= 50 ? "text-[#C5A23C]" : "text-[#6B5B4F]"}`}
                >
                  {s.severity}/100
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/brewsoul/wall-of-shame"
              className="font-mono text-[0.78rem] tracking-wide text-[#8B2500] uppercase"
            >
              See the Full Wall
              <ArrowRight aria-hidden="true" className="ml-1 inline size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Research Hub */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <div className="mb-2 font-mono text-xs tracking-[0.3em] text-[#8B6914] uppercase">
              Deep Research
            </div>
            <h2 className="mb-3 font-heading text-2xl font-bold text-[#2C1810]">
              The Intelligence Library
            </h2>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-[#6B5B4F]">
              Peer-reviewed research. Complete brand censuses. Personalized protocols. No sponsored
              content.
            </p>
          </div>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
            {RESEARCH_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.path}
                  href={card.path}
                  className="h-full rounded-2xl border border-[#8B6914]/15 bg-white/60 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#8B6914]/50 hover:bg-white/90 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <Icon aria-hidden="true" className="size-6 text-[#8B6914]" />
                    <span className="rounded-sm bg-[#8B6914]/8 px-2 py-0.5 font-mono text-[0.58rem] tracking-wide text-[#8B6914]">
                      {card.tag}
                    </span>
                  </div>
                  <div className="mb-1.5 font-heading text-lg font-bold text-[#2C1810]">
                    {card.title}
                  </div>
                  <div className="text-sm leading-relaxed text-[#6B5B4F]">{card.sub}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Health Ticker */}
      <section className="px-6 py-16 text-center">
        <div className="mb-6 font-mono text-xs tracking-[0.3em] text-[#8B6914] uppercase">
          Health & Science
        </div>
        <HealthTicker />
      </section>

      <JourneyBar />
      <div className="h-20" />
    </div>
  );
}
