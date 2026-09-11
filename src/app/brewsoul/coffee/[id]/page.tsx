import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, Trophy, X } from "lucide-react";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import {
  computeQPR,
  computeAvailability,
  computeScarcity,
  computeWow,
  computeTier,
  tierLabel,
  gradeColor,
} from "@/lib/intelligence-engine/scoring";
import { JourneyBar } from "@/components/brewsoul/journey-bar";

// Ported from legacy client/src/pages/brewsoul/BrewSoulDetail.tsx — the
// per-coffee detail page (breadcrumb, header w/ QPR + tier, quick stats,
// tasting notes, flavor-profile bars, the 4 intelligence scores,
// transparency/ethics data, buy links, competition wins, "similar
// coffees" cross-links, journey CTAs). Real content/logic unchanged, just
// server-rendered with `generateStaticParams` for all
// `BREWSOUL_COFFEES.length` coffees instead of legacy's client-side
// `useParams` lookup — this repo's convention for a bounded dynamic
// route (same pattern as `/blog/[slug]` and `/charity-scorecard/[slug]`).
// Legacy's inline-styled bars/cards ported as Tailwind utilities.
export async function generateStaticParams() {
  return BREWSOUL_COFFEES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: AppPageProps<"/brewsoul/coffee/[id]">): Promise<Metadata> {
  const { id } = await params;
  const coffee = BREWSOUL_COFFEES.find((c) => c.id === id);
  if (!coffee) return {};
  return {
    title: `${coffee.name} — BrewSoul`,
    description: `${coffee.name} by ${coffee.producer}: ${coffee.originCountry}, ${coffee.variety}, ${coffee.processingMethod}. Full QPR, availability, scarcity, and wow-factor scoring.`,
    alternates: { canonical: `/brewsoul/coffee/${coffee.id}` },
  };
}

function FlavorBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="mb-2 flex items-center gap-3">
      <span className="w-20 text-right font-mono text-[0.7rem] text-[#6B5B4F]">{label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-[#6F4E37]/8">
        <div
          className="h-full rounded-full bg-linear-to-r from-[#6F4E37] to-[#C5A23C] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 font-mono text-[0.7rem] text-[#2C1810]">{value}</span>
    </div>
  );
}

export default async function BrewSoulCoffeeDetailPage({
  params,
}: AppPageProps<"/brewsoul/coffee/[id]">) {
  const { id } = await params;
  const coffee = BREWSOUL_COFFEES.find((c) => c.id === id);
  if (!coffee) notFound();

  const scores = {
    qpr: computeQPR(coffee, BREWSOUL_COFFEES),
    availability: computeAvailability(coffee),
    scarcity: computeScarcity(coffee),
    wow: computeWow(coffee),
    tier: computeTier(coffee.cuppingScore || 0),
  };
  const pricePerGram = (coffee.priceUsd / coffee.unitGrams).toFixed(2);
  const flavorEntries = Object.entries(coffee.flavorProfile);
  const similar = BREWSOUL_COFFEES.filter(
    (c) =>
      c.id !== coffee.id &&
      (c.originCountry === coffee.originCountry || c.originRegion === coffee.originRegion),
  ).slice(0, 3);

  return (
    <div>
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 font-mono text-xs text-[#999]">
          <Link href="/brewsoul" className="text-[#6F4E37]">
            BrewSoul
          </Link>
          <ChevronRight aria-hidden="true" className="mx-1 inline size-3" />
          <Link href="/brewsoul/browse" className="text-[#6F4E37]">
            Browse
          </Link>
          <ChevronRight aria-hidden="true" className="mx-1 inline size-3" />
          {coffee.name}
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 font-mono text-xs tracking-[0.2em] text-[#C5A23C] uppercase">
              {tierLabel(scores.tier)}
            </div>
            <h1 className="mb-1.5 font-heading text-2xl font-bold text-[#2C1810] sm:text-3xl">
              {coffee.name}
            </h1>
            <div className="text-base text-[#6F4E37]">by {coffee.producer}</div>
          </div>
          <div className="text-right">
            <div
              className={`font-mono text-3xl font-bold ${scores.qpr >= 80 ? "text-[#4A7C59]" : scores.qpr >= 60 ? "text-[#C5A23C]" : "text-[#8B2500]"}`}
            >
              QPR {scores.qpr}
            </div>
            <div className="font-mono text-xs text-[#999]">
              ${coffee.priceUsd} / {coffee.unitGrams}g (${pricePerGram}/g)
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mb-10 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
          {[
            { label: "Origin", value: `${coffee.originCountry}, ${coffee.originRegion}` },
            { label: "Variety", value: coffee.variety },
            { label: "Processing", value: coffee.processingMethod },
            { label: "Roast", value: coffee.roastLevel || "—" },
            {
              label: "Cupping",
              value: `${coffee.cuppingScore || "—"} (${coffee.cuppingSource || "—"})`,
            },
            { label: "Altitude", value: coffee.altitude ? `${coffee.altitude}m` : "—" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-[#6F4E37]/3 p-3">
              <div className="mb-1 font-mono text-[0.62rem] tracking-[0.15em] text-[#999] uppercase">
                {s.label}
              </div>
              <div className="text-sm text-[#2C1810]">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tasting notes */}
        <div className="mb-10">
          <h2 className="mb-3 font-heading text-xl font-bold text-[#2C1810]">Tasting Notes</h2>
          <div className="flex flex-wrap gap-2">
            {coffee.tastingNotes.map((n) => (
              <span
                key={n}
                className="rounded-full bg-[#6F4E37]/6 px-3.5 py-1.5 text-sm text-[#6F4E37]"
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Flavor profile */}
        <div className="mb-10">
          <h2 className="mb-4 font-heading text-xl font-bold text-[#2C1810]">Flavor Profile</h2>
          {flavorEntries.map(([key, val]) => (
            <FlavorBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val} />
          ))}
        </div>

        {/* Scores breakdown */}
        <div className="mb-10">
          <h2 className="mb-4 font-heading text-xl font-bold text-[#2C1810]">
            Intelligence Scores
          </h2>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
            {[
              {
                label: "QPR",
                value: scores.qpr,
                desc: "Quality-to-Price Ratio",
                color:
                  scores.qpr >= 80
                    ? "text-[#4A7C59]"
                    : scores.qpr >= 60
                      ? "text-[#C5A23C]"
                      : "text-[#8B2500]",
              },
              {
                label: "Availability",
                value: scores.availability,
                desc: "How easy to get",
                color: scores.availability >= 70 ? "text-[#4A7C59]" : "text-[#C5A23C]",
              },
              {
                label: "Scarcity",
                value: scores.scarcity,
                desc: "Rarity & exclusivity",
                color: scores.scarcity >= 70 ? "text-[#8B4585]" : "text-[#6B5B4F]",
              },
              {
                label: "Wow Factor",
                value: scores.wow,
                desc: "Uniqueness & interest",
                color: scores.wow >= 70 ? "text-[#C5A23C]" : "text-[#6B5B4F]",
              },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-[#6F4E37]/8 bg-white p-4">
                <div className={`font-mono text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="mb-0.5 font-mono text-xs font-semibold text-[#2C1810]">
                  {s.label}
                </div>
                <div className="text-[0.75rem] text-[#999]">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency */}
        <div className="mb-10">
          <h2 className="mb-4 font-heading text-xl font-bold text-[#2C1810]">
            Transparency &amp; Ethics
          </h2>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
            <div className="rounded-lg bg-[#6F4E37]/3 p-4">
              <div className="mb-1 font-mono text-[0.62rem] tracking-[0.15em] text-[#999] uppercase">
                Transparency Grade
              </div>
              <div
                className="font-mono text-2xl font-bold"
                style={{ color: gradeColor(coffee.producerTransparencyGrade) }}
              >
                {coffee.producerTransparencyGrade}
              </div>
            </div>
            {coffee.farmerSharePct != null && (
              <div className="rounded-lg bg-[#6F4E37]/3 p-4">
                <div className="mb-1 font-mono text-[0.62rem] tracking-[0.15em] text-[#999] uppercase">
                  Farmer Share
                </div>
                <div
                  className={`font-mono text-2xl font-bold ${coffee.farmerSharePct >= 30 ? "text-[#4A7C59]" : "text-[#C5A23C]"}`}
                >
                  {coffee.farmerSharePct}%
                </div>
                {coffee.farmerShareUsd != null && (
                  <div className="font-mono text-xs text-[#6B5B4F]">
                    ${coffee.farmerShareUsd} per bag
                  </div>
                )}
              </div>
            )}
            {coffee.cMarketPremiumPct != null && (
              <div className="rounded-lg bg-[#6F4E37]/3 p-4">
                <div className="mb-1 font-mono text-[0.62rem] tracking-[0.15em] text-[#999] uppercase">
                  C-Market Premium
                </div>
                <div className="font-mono text-2xl font-bold text-[#4A7C59]">
                  +{coffee.cMarketPremiumPct}%
                </div>
              </div>
            )}
            <div className="rounded-lg bg-[#6F4E37]/3 p-4">
              <div className="mb-1 font-mono text-[0.62rem] tracking-[0.15em] text-[#999] uppercase">
                Mold Test
              </div>
              <div
                className={`font-mono text-sm font-bold ${coffee.moldTestStatus === "verified" ? "text-[#4A7C59]" : coffee.moldTestStatus === "claims" ? "text-[#C5A23C]" : "text-[#999]"}`}
              >
                {coffee.moldTestStatus === "verified" ? (
                  <span className="inline-flex items-center gap-1">
                    <Check aria-hidden="true" className="size-3.5" /> Verified Clean
                  </span>
                ) : coffee.moldTestStatus === "claims" ? (
                  "Claims Clean"
                ) : coffee.moldTestStatus === "failed" ? (
                  <span className="inline-flex items-center gap-1">
                    <X aria-hidden="true" className="size-3.5" /> Failed
                  </span>
                ) : (
                  "Untested"
                )}
              </div>
              {coffee.moldTestSource && (
                <div className="font-mono text-xs text-[#999]">{coffee.moldTestSource}</div>
              )}
            </div>
          </div>
        </div>

        {/* Buy links */}
        {coffee.buyLinks.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 font-heading text-xl font-bold text-[#2C1810]">Where to Buy</h2>
            <div className="flex flex-wrap gap-3">
              {coffee.buyLinks.map((link, i) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    i === 0
                      ? "rounded-md bg-linear-to-br from-[#6F4E37] to-[#8B6914] px-6 py-3 font-mono text-xs tracking-wide text-[#FAFAF7] uppercase"
                      : "rounded-md border border-[#6F4E37]/20 px-6 py-3 font-mono text-xs tracking-wide text-[#6F4E37] uppercase"
                  }
                >
                  {link.label} <ForwardIcon aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="mt-2 font-mono text-[0.65rem] text-[#BBB]">
              We don&apos;t take affiliate commissions. These are editorial picks.
            </p>
          </div>
        )}

        {/* Competition wins */}
        {coffee.competitionWins && coffee.competitionWins.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-3 font-heading text-xl font-bold text-[#2C1810]">Competition Wins</h2>
            {coffee.competitionWins.map((w) => (
              <div key={w} className="py-1.5 text-sm text-[#6B5B4F]">
                <Trophy aria-hidden="true" className="mr-2 inline size-4 text-[#C5A23C]" />
                {w}
              </div>
            ))}
          </div>
        )}

        {/* Similar coffees */}
        {similar.length > 0 && (
          <div className="mt-10 border-t border-[#6F4E37]/8 pt-8">
            <h2 className="mb-4 font-heading text-xl font-bold text-[#2C1810]">
              You Might Also Like
            </h2>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
              {similar.map((c) => {
                const qpr = computeQPR(c, BREWSOUL_COFFEES);
                const tier = computeTier(c.cuppingScore || 0);
                return (
                  <Link
                    key={c.id}
                    href={`/brewsoul/coffee/${c.id}`}
                    className="rounded-lg border border-[#6F4E37]/8 bg-[#6F4E37]/3 p-4 transition-all hover:-translate-y-0.5 hover:border-[#C5A23C]/30"
                  >
                    <div className="mb-1 font-heading text-sm font-bold text-[#2C1810]">
                      {c.name}
                    </div>
                    <div className="font-mono text-xs text-[#6B5B4F]">
                      {c.originCountry} · {tierLabel(tier)} · QPR {qpr.toFixed(1)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Journey CTAs */}
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[#6F4E37]/8 pt-8">
          <Link href="/brewsoul/browse" className="font-mono text-xs text-[#6F4E37]">
            <ArrowLeft aria-hidden="true" className="mr-1 inline size-3.5" />
            Back to catalog
          </Link>
          <span className="text-[#6F4E37]/20">·</span>
          <Link href="/brewsoul/quiz" className="font-mono text-xs text-[#C5A23C]">
            Take the Taste Quiz <ForwardIcon aria-hidden="true" />
          </Link>
          <span className="text-[#6F4E37]/20">·</span>
          <Link href="/brewsoul/compare" className="font-mono text-xs text-[#C5A23C]">
            Compare Coffees <ForwardIcon aria-hidden="true" />
          </Link>
        </div>
      </div>
      <JourneyBar />
      <div className="h-20" />
    </div>
  );
}
