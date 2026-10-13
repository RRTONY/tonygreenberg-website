import "server-only";
import { unstable_cache } from "next/cache";
import { getTopEssayPaths } from "@/lib/admin/ga4-client";
import type { ArchivePost } from "@/lib/content/essay-archive";

// The essay archive's "Most Read" list (HomeArchive on "/" and "/blog").
// Live's list and its "19,694 reads" come from numbers typed into the old
// site's blogData.json, not from real readers. Since 2026-10-14 (owner) it's
// the essays with the most Google Analytics page views over the last year,
// fetched at most once a day (Next caches the result; the pages themselves
// still rebuild every minute for Sanity changes). No view counts are shown.
// If GA isn't configured or fails, the list falls back to live's ranking.

export type MostReadPost = { slug: string; title: string };
export type MostRead = { posts: MostReadPost[]; fromAnalytics: boolean };

const DAYS = 365;
const SHOW = 5;

// Live's ranking, used only when Google Analytics can't be reached.
const FALLBACK_SLUGS = [
  "boiling-the-human-summit-harvard-kurzweil",
  "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
  "only-time-buys-trust",
  "return-on-investment-going-green-going-green-2",
  "customer-service-key-to-business-success",
];

// Throws on failure so a GA outage isn't cached for a day; getMostRead catches it.
const topEssaySlugs = unstable_cache(
  async () => {
    const rows = await getTopEssayPaths(DAYS, 25);
    return rows.map((r) => r.path.replace(/^\/blog\//, "").replace(/[/?#].*$/, ""));
  },
  ["most-read-essays", String(DAYS)],
  { revalidate: 60 * 60 * 24 },
);

/** Top essays by real page views, keeping only slugs that are published essays. */
export async function getMostRead(posts: ArchivePost[]): Promise<MostRead> {
  const bySlug = new Map(posts.map((p) => [p.slug, p.title]));
  const pick = (slugs: string[]) =>
    [...new Set(slugs)]
      .filter((slug) => bySlug.has(slug))
      .slice(0, SHOW)
      .map((slug) => ({ slug, title: bySlug.get(slug)! }));

  try {
    const fromAnalytics = pick(await topEssaySlugs());
    if (fromAnalytics.length === SHOW) return { posts: fromAnalytics, fromAnalytics: true };
  } catch (err) {
    console.error("[most-read] Google Analytics unavailable, using the fixed list:", err);
  }
  return { posts: pick(FALLBACK_SLUGS), fromAnalytics: false };
}
