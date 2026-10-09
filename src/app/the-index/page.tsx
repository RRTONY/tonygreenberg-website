import type { Metadata } from "next";
import { TheIndexExplorer } from "@/components/the-index/the-index-explorer";
import { STATS } from "@/lib/content/charity-data";
import { INDEX_STATS_CONCEPTS, INDEX_STATS_YEARS } from "@/lib/content/the-index";
import { loadIndexItems } from "./index-data";

// Ported from live tonygreenberg.com/the-index (2026-10-07), which is newer
// than legacy client/src/pages/TheIndex.tsx. Concept map, related terms and
// scoring: src/lib/content/the-index.ts. Essays come from Sanity, site
// resources from the site directory; full-text matching and the "three next
// reads" run on the server (./actions.ts).
const DESCRIPTION =
  "Search essays and current site resources by keyword, related terms, or concept. Read a concise TLDR and three relevant next links before you go deeper.";

export const metadata: Metadata = {
  title: { absolute: "The Index — Searchable Idea Database" },
  description: DESCRIPTION,
  alternates: { canonical: "/the-index" },
  openGraph: {
    title: "The Index — Searchable Idea Database | Tony Greenberg",
    description: DESCRIPTION,
    url: "/the-index",
  },
  twitter: {
    title: "The Index — Searchable Idea Database | Tony Greenberg",
    description: DESCRIPTION,
  },
};

export default async function TheIndexPage() {
  const { items, essayCount } = await loadIndexItems();

  const stats = [
    { num: String(essayCount), label: "Essays" },
    { num: String(items.length - essayCount), label: "Site Resources" },
    { num: INDEX_STATS_CONCEPTS, label: "Concepts" },
    { num: INDEX_STATS_YEARS, label: "Years" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[48.75rem] px-4 pt-10 pb-12 sm:px-6 sm:pt-12">
        <p className="mb-6 font-mono text-xs tracking-[0.3em] text-essay-red uppercase">The Index</p>
        <h1 className="mb-6 font-heading text-[2.2rem]/[1.2] text-foreground sm:text-[2.75rem]/[1.2]">
          Search the Thinking
        </h1>
        <p className="mb-10 max-w-[43.75rem] font-serif text-[1.1rem]/[1.75] text-foreground/70 sm:text-[1.22rem]/[1.75]">
          Start with the newest work, search the full archive by the words you actually use, or browse by concept.
          Each result opens a short orientation and three useful next reads before you leave the Index.
        </p>

        <TheIndexExplorer items={items} charityCount={STATS.totalCharities} />

        <div aria-hidden="true" className="mx-auto mt-12 h-px max-w-xs bg-linear-to-r from-transparent via-essay-red to-transparent" />

        <dl className="grid max-w-[43.75rem] grid-cols-2 gap-8 py-10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse items-center text-center">
              <dt className="font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase">{s.label}</dt>
              <dd className="font-heading text-[2rem] font-bold text-brand-gold">{s.num}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
