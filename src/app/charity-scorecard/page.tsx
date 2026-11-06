import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo-defaults";
import Link from "next/link";
import { ALL_SECTORS, CHARITIES, STATS } from "@/lib/content/charity-data";
import { CharityScorecardExplorer } from "@/components/marketing/charity-scorecard-explorer";
import { RelatedPages } from "@/components/marketing/related-pages";

// Ported from legacy client/src/pages/CharityScorecard.tsx ("The Grand
// Impact Accountability Index"). Real content, unchanged — 98 real named
// charities scored across 7 weighted dimensions unifying GiveWell, Charity
// Navigator, CharityWatch, and Candid ratings, plus a Cloak-vs-Clear
// transparency metric. No backend dependency in the legacy source at all
// (fully client-side, computed data), so this ports directly with the tab
// UI as the only client-side piece.
export const metadata: Metadata = seoMetadata({
  title: "The Grand Impact Accountability Index — Charity Scorecard",
  description:
    `${STATS.totalCharities} charities. Eight existing scorecards unified. Seven new dimensions measured. Where does your donation dollar actually go?`,
  alternates: { canonical: "/charity-scorecard" },
});

export default function CharityScorecardPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-linear-to-br from-[#0A0A10] via-[#14131A] to-[#0A0A10] py-16 md:py-24">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(212,185,106,0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,185,106,0.2), transparent 40%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4">
          <p className="mb-4 font-mono text-xs tracking-[0.3em] text-brand-gold uppercase">
            The Grand Impact Accountability Index
          </p>
          <h1 className="mb-6 font-serif text-4xl leading-tight font-bold text-[#E8E4DC] md:text-6xl">
            Where Does Your Dollar
            <br className="hidden md:block" /> Actually Go?
          </h1>
          <p className="mb-4 max-w-2xl text-lg leading-relaxed text-[#E8E4DC]/80 md:text-xl">
            {STATS.totalCharities} charities. Eight existing scorecards unified. Seven new dimensions
            measured. The first accountability framework that asks the question every donor
            deserves answered: <em className="text-brand-gold">what actually happened with my money?</em>
          </p>

          <div className="mb-8 max-w-2xl rounded-lg border border-[#E8E4DC]/10 bg-[#E8E4DC]/5 p-5 backdrop-blur-sm">
            <p className="mb-3 text-sm leading-relaxed text-[#E8E4DC]/70">
              <strong className="text-brand-gold">What you&apos;re looking at:</strong> An
              aggregate scorecard that unifies GiveWell, Charity Navigator, CharityWatch, and
              Candid ratings with seven proprietary dimensions — including Cloak Score
              (transparency), Innovation, and Lived-Experience Leadership — into a single
              composite grade for each charity.
            </p>
            <p className="mb-3 text-sm leading-relaxed text-[#E8E4DC]/70">
              <strong className="text-brand-gold">Why it matters:</strong> No single evaluator
              tells the whole story. Some measure efficiency but ignore impact. Others track
              outcomes but miss governance. This scorecard cross-references all of them so you can
              see where the consensus is — and where it breaks down.
            </p>
            <p className="text-sm leading-relaxed text-[#E8E4DC]/70">
              <strong className="text-brand-gold">What to do with it:</strong> Use the{" "}
              <em>Rankings</em> tab to compare charities by composite score. Switch to{" "}
              <em>Scorecard</em> to see how the seven dimensions are weighted. Check{" "}
              <em>Evaluators</em> to understand whose ratings feed the model. Click any charity to
              see its full breakdown.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            {[
              { label: "Charities Scored", value: STATS.totalCharities.toString() },
              { label: "Average Score", value: STATS.avgScore.toString() },
              { label: "A-Tier Charities", value: STATS.aTierCount.toString() },
              { label: "Opacity Warnings", value: STATS.opacityWarnings.toString() },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-mono text-2xl font-bold text-brand-gold md:text-3xl">{s.value}</div>
                <div className="text-xs tracking-wide text-[#E8E4DC]/60 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CharityScorecardExplorer />

      {/* The explorer only links a profile after a row is opened, so this plain
          list is the one place every profile is linked in the page's HTML. */}
      <section className="mx-auto max-w-5xl px-4 pb-4">
        <details className="group rounded-lg border border-border bg-card">
          <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-3 font-heading text-lg font-bold">
            All {CHARITIES.length} charities, by sector
            <span aria-hidden="true" className="font-mono text-sm text-muted-foreground group-open:rotate-45 transition-transform">+</span>
          </summary>
          <div className="grid gap-x-8 gap-y-6 border-t border-border px-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_SECTORS.map((sector) => (
              <div key={sector}>
                <h2 className="mb-2 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">{sector}</h2>
                <ul className="space-y-1">
                  {CHARITIES.filter((c) => c.sector === sector).map((c) => (
                    <li key={c.slug}>
                      <Link href={`/charity-scorecard/${c.slug}`} className="inline-flex min-h-8 items-center gap-2 text-sm underline-offset-2 hover:text-brand-gold hover:underline">
                        {c.name} <span className="font-mono text-xs text-muted-foreground">{c.grade}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </section>

      <RelatedPages path="/charity-scorecard" tone="light" />
    </div>
  );
}
