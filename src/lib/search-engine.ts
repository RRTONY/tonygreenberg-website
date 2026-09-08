/**
 * Relevance-scoring search engine, ported from the legacy Vite/Express app's
 * `client/src/lib/searchEngine.ts` (title/tag/description weighting +
 * multi-word AND matching + a fuzzy subsequence fallback). Legacy's version
 * also did TF-IDF-style density scoring over full blog post body text
 * (`scoreBlog`) — this app's blog posts live in Sanity, not a bundled
 * `blogData.json`, so full body text isn't available client-side. The static
 * `PageItem` scoring below is a faithful, unmodified port; blog-post scoring
 * happens server-side in `src/app/api/search/route.ts` over the fields
 * `searchPostsQuery` already returns (title/excerpt/category), reusing this
 * same `scoreItem` function rather than duplicating the formula.
 */

export type SearchableItem = {
  title: string;
  description: string;
  tags?: string[];
};

export type PageItem = SearchableItem & {
  href: string;
  /** True for real external sibling-product links (e.g. *.manus.space tools). */
  external?: boolean;
};

/**
 * Score a single item against a query. Ported verbatim from legacy's
 * `scorePage`: exact/prefix/substring title match tiers, tag + description
 * substring bonuses, a multi-word "all words present" bonus, and a fuzzy
 * subsequence fallback when nothing else matched.
 */
export function scoreItem(query: string, item: SearchableItem): number {
  const q = query.toLowerCase();
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();
  const tags = (item.tags || []).join(" ").toLowerCase();

  let score = 0;

  // Title matching (highest weight)
  if (title === q) score += 100;
  else if (title.startsWith(q)) score += 85;
  else if (title.includes(q)) score += 65;

  // Tag matching
  if (tags.includes(q)) score += 45;

  // Description matching
  if (desc.includes(q)) score += 25;

  // Multi-word: check if ALL words appear somewhere in title/tags/description
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  if (words.length > 1) {
    const allText = `${title} ${tags} ${desc}`;
    const allFound = words.every((w) => allText.includes(w));
    if (allFound) score += 30;
  }

  // Fuzzy title match (subsequence) — only kicks in when nothing else matched
  if (score === 0) {
    let qi = 0;
    for (let ti = 0; ti < title.length && qi < q.length; ti++) {
      if (title[ti] === q[qi]) qi++;
    }
    if (qi === q.length) score += 10;
  }

  return score;
}

/** Score, filter (score > 0) and sort a list of static directory pages. */
export function searchPages(query: string, pages: PageItem[], limit = 8): PageItem[] {
  const q = query.trim();
  if (!q) return pages.slice(0, limit);

  return pages
    .map((p) => ({ item: p, score: scoreItem(q, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}
