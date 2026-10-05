import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { postCountQuery } from "@/lib/sanity/queries";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { CHARITIES } from "@/lib/content/charity-data";
import { SEARCH_DIRECTORY } from "@/lib/content/search-directory";
import { SiteSearch } from "@/components/search/site-search";

// Site-wide search, laid out like live's /search (2026-10-06): back arrow,
// one box, filter chips (All, Essays, BrewSoul, Peptides, Human OS,
// Assessments, Kava, Pages) and a "Search Everything" empty state. Live's
// results never load (its backend is gone); this one searches essays (Sanity,
// full body text), every page in the site directory, coffees and charities.
// The empty-state line uses this site's real counts (live hardcodes "114
// essays, 80+ coffees, 103 charities, 20+ assessments"). `?q=` still works,
// so older links into the essays-only search keep landing on results.
export const metadata: Metadata = {
  title: "Search",
  description: "Search everything on tonygreenberg.com: essays, BrewSoul coffees, charities, assessments, peptide research and kava science.",
  alternates: { canonical: "/search" },
};

const ASSESSMENT_PAGE = /^\/(find-your|find-my|assessments|dharma-finder|grant-study|consciousness-scale|soulscore|self-portrait|the-mirror)/;

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const q = typeof params?.q === "string" ? params.q.trim() : "";
  const essays = await sanityFetch<number>({ query: postCountQuery, tags: ["post"] });
  const assessments = SEARCH_DIRECTORY.filter((p) => ASSESSMENT_PAGE.test(p.href)).length;

  const line = `${essays} essays, ${BREWSOUL_COFFEES.length} coffees, ${CHARITIES.length} charities, ${assessments} assessments, peptide research, kava science, and more — all searchable from one place.`;

  return <SiteSearch initialQuery={q} emptyStateLine={line} />;
}
