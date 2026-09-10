// Ported from legacy client/src/pages/ImpactFuturism.tsx's FEATURED/
// ALL_ARTICLES arrays — the curated tag + teaser copy for this category
// page's 7 essays (the first 3 are the featured set, in the same order
// legacy featured them). Real post data (title, date, hero image, real
// read time) now comes live from Sanity instead of being duplicated here —
// this module only holds the page-specific curation that isn't a field on
// the post document itself, same boundary already drawn for
// articles-discovery.ts's discovery-mode slug lists and thesis-threads.ts's
// THESIS_CONNECTORS. All 7 slugs verified against the real migrated post
// corpus before porting.
export interface ImpactFuturismEntry {
  slug: string;
  tag: string;
  teaser: string;
}

export const FEATURED_COUNT = 3;

export const IMPACT_FUTURISM_ENTRIES: ImpactFuturismEntry[] = [
  {
    slug: "your-blood-lies-without-your-dna",
    tag: "Health Systems",
    teaser:
      "Quest Diagnostics runs 600 million tests a year. 1.7 stars on Trustpilot. An $11B company that built a system hostile to the patient it serves. And what comes next.",
  },
  {
    slug: "energy-is-money-money-is-memory",
    tag: "AI & Energy",
    teaser:
      "The physics underneath the AI buildout — and why the largest act of memory-making in human history is happening right now.",
  },
  {
    slug: "when-healing-becomes-extraction",
    tag: "Psychedelic Medicine",
    teaser:
      "On the day Eli Lilly spent $2.8B validating psychedelic medicine, a woman named Tina died. The system that should have saved her failed her.",
  },
  {
    slug: "energy-as-impact",
    tag: "Infrastructure",
    teaser:
      "Redefining sustainable computing — building infrastructure that treats energy as a moral act, not just a cost.",
  },
  {
    slug: "greenberg-kurzweil-scientist-foundation-of-trust",
    tag: "Trust & Verification",
    teaser:
      "On stage with Kurzweil. The case for citizen-scientists as the verification layer in a world drowning in misinformation.",
  },
  {
    slug: "only-time-buys-trust",
    tag: "Trust & Verification",
    teaser:
      "The evolving definition of trust in the digital age — and why time is the only currency that cannot be faked.",
  },
  {
    slug: "google-verizon-walled-garden-plan",
    tag: "Infrastructure",
    teaser:
      "Net neutrality as a trust problem, not a technical one. Why the compromise was always going to fail.",
  },
];

// Canonical Tailwind palette classes standing in for legacy's raw per-tag
// hex badges (#4A1D5E, #1a3a5c, #2d4a1e, #3a2a0a, #1a2a3a) — a small,
// known-at-build-time set of variants, each a complete literal class
// string, same pattern as thesis-threads-explorer's per-thread accents.
export const TAG_BADGE: Record<string, string> = {
  "Health Systems": "bg-purple-950 text-purple-100",
  "AI & Energy": "bg-blue-950 text-blue-100",
  "Psychedelic Medicine": "bg-green-950 text-green-100",
  Infrastructure: "bg-amber-950 text-amber-100",
  "Trust & Verification": "bg-slate-950 text-slate-100",
};
