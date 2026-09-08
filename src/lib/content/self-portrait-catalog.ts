// Every `resultSlug` currently wired into an `AssessmentResultActions` call
// site (see that component + `lib/assessments/result-log.ts`), with the
// display copy `/self-portrait` needs to render a completed entry. Kept as
// its own small catalog rather than cross-referencing `find-your-me.ts`'s
// ecosystem directory (which only covers a handful of these) or
// `assessments-hub.ts` (which covers a different 3) — a single source of
// truth scoped to exactly what this page needs. Add a line here whenever a
// new assessment gets wired up with `resultSlug`.
export interface SelfPortraitCatalogEntry {
  slug: string;
  title: string;
  summary: string;
}

export const SELF_PORTRAIT_CATALOG: SelfPortraitCatalogEntry[] = [
  { slug: "find-your-me", title: "Find Your Me", summary: "Your ecosystem hub reading — 6 dimensions, 6 archetypes." },
  { slug: "find-your-spirit", title: "Find Your Spirit", summary: "Which of 6 spiritual traditions align with your authentic identity." },
  { slug: "find-your-therapy", title: "Find Your Therapy", summary: "The therapeutic modality matched to your wiring." },
  { slug: "find-your-religion", title: "Find Your Religion", summary: "Your worldview across 8 dimensions, mapped to 8 archetypes." },
  { slug: "find-your-sake", title: "Find Your Sake", summary: "Your sake profile — palate, ritual, terroir, philosophy, season." },
  { slug: "find-your-coffee", title: "Find Your Coffee", summary: "Your coffee archetype and 5 real roaster recommendations." },
  { slug: "find-your-peptide", title: "Find Your Peptide", summary: "Your Peptide Readiness Score across 7 clinical axes." },
  { slug: "dharma-finder", title: "Dharma Finder", summary: "What you can't stop doing — even when nobody's paying." },
  { slug: "consciousness-scale", title: "Consciousness Scale", summary: "Where you sit on Hawkins' Map of Consciousness." },
  { slug: "grant-study", title: "Grant Study", summary: "85 years of Harvard data on what predicts a life well-lived." },
  { slug: "the-mirror", title: "The Mirror", summary: "6 dimensions, 18 questions, a radar chart that doesn't care about your feelings." },
  { slug: "soulscore", title: "SoulScore", summary: "Your 12-dimension impact measurement." },
  { slug: "assessment", title: "Reader Path", summary: "Builder, Crusader, or Investor." },
];

export const SELF_PORTRAIT_CATALOG_BY_SLUG: Record<string, SelfPortraitCatalogEntry> = Object.fromEntries(
  SELF_PORTRAIT_CATALOG.map((entry) => [entry.slug, entry]),
);
