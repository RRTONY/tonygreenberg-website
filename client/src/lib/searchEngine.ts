/**
 * Full-Text Search Engine
 * TF-IDF inspired relevance scoring with:
 * - Word frequency density ranking
 * - Multi-word AND matching with proximity bonus
 * - Better snippet extraction with context
 * - Unified logic for SearchPalette and TonyDiscovery
 */

import blogData from "@/data/blogData.json";

/* ── Types ── */
export type PageItem = {
  title: string;
  href: string;
  description: string;
  icon?: string;
  tags?: string[];
  external?: boolean;
};

export type BlogItem = {
  title: string;
  href: string;
  description: string;
  category?: string;
  recencyIndex: number;
  tags: string[];
  searchCorpus: string;
  content: string;
};

export type SearchResult = {
  title: string;
  href: string;
  description: string;
  icon?: string;
  category?: string;
  snippet?: string;
  score: number;
  type: "page" | "blog";
  external?: boolean;
};

/* ── Build Blog Index ── */
export const BLOG_ITEMS: BlogItem[] = (blogData as any[])
  .filter((post) => !post.unpublished)
  .map((post, idx) => {
    const allKeywords = (post.keywords || []).map((k: string) => k.toLowerCase());
    const allTags = (post.tags || []).map((t: string) => t.toLowerCase());
    const content = (post.content || "").toLowerCase();
    const excerpt = (post.excerpt || "").toLowerCase();
    const subtitle = (post.subtitle || "").toLowerCase();
    const lesson = (post.lesson || "").toLowerCase();

    const searchCorpus = [
      post.title?.toLowerCase() || "",
      subtitle,
      excerpt,
      allKeywords.join(" "),
      allTags.join(" "),
      (post.category || "").toLowerCase(),
      (post.formatTag || "").toLowerCase(),
      content,
      lesson,
    ].join(" ");

    return {
      title: post.title,
      href: `/blog/${post.slug}`,
      description:
        post.summary?.slice(0, 120) || post.excerpt?.slice(0, 120) || "",
      category: post.category,
      recencyIndex: idx,
      tags: [
        ...allKeywords,
        ...allTags,
        post.category?.toLowerCase(),
        post.formatTag?.toLowerCase(),
      ].filter(Boolean) as string[],
      searchCorpus,
      content,
    };
  });

/* ── Tokenizer ── */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

/* ── TF (Term Frequency) ── */
function termFrequency(term: string, text: string): number {
  const words = tokenize(text);
  if (words.length === 0) return 0;
  const count = words.filter((w) => w === term || w.startsWith(term)).length;
  return count / words.length;
}

/* ── Count occurrences of a phrase in text ── */
function countOccurrences(text: string, query: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let count = 0;
  let pos = 0;
  while ((pos = t.indexOf(q, pos)) !== -1) {
    count++;
    pos += q.length;
  }
  return count;
}

/* ── Proximity score: how close are multi-word terms to each other ── */
function proximityScore(text: string, words: string[]): number {
  if (words.length < 2) return 0;
  const t = text.toLowerCase();

  // Find positions of each word
  const positions: number[][] = words.map((w) => {
    const pos: number[] = [];
    let idx = 0;
    while ((idx = t.indexOf(w, idx)) !== -1) {
      pos.push(idx);
      idx += w.length;
    }
    return pos;
  });

  // If any word is missing, no proximity
  if (positions.some((p) => p.length === 0)) return 0;

  // Find minimum span containing all words
  let minSpan = Infinity;
  for (const startPos of positions[0]) {
    let maxEnd = startPos + words[0].length;
    let minStart = startPos;
    let allFound = true;

    for (let i = 1; i < positions.length; i++) {
      // Find closest position of word[i] to startPos
      const closest = positions[i].reduce((best, p) =>
        Math.abs(p - startPos) < Math.abs(best - startPos) ? p : best
      );
      if (closest === undefined) {
        allFound = false;
        break;
      }
      minStart = Math.min(minStart, closest);
      maxEnd = Math.max(maxEnd, closest + words[i].length);
    }

    if (allFound) {
      minSpan = Math.min(minSpan, maxEnd - minStart);
    }
  }

  if (minSpan === Infinity) return 0;

  // Score inversely proportional to span (closer = higher score)
  // Max 30 points for adjacent words, decreasing as span grows
  const idealSpan = words.join(" ").length;
  const ratio = idealSpan / Math.max(minSpan, idealSpan);
  return Math.round(ratio * 30);
}

/* ── Extract best snippet around matched term ── */
export function extractSnippet(
  content: string,
  query: string,
  maxLen = 160
): string | undefined {
  if (!content) return undefined;
  const q = query.toLowerCase();
  const c = content.toLowerCase();

  // Try exact phrase match first
  let idx = c.indexOf(q);

  // If no exact match, try first word
  if (idx === -1) {
    const words = q.split(/\s+/).filter((w) => w.length > 1);
    for (const word of words) {
      idx = c.indexOf(word);
      if (idx !== -1) break;
    }
  }

  if (idx === -1) return undefined;

  // Find sentence boundaries around the match
  const sentenceStart = Math.max(
    0,
    content.lastIndexOf(".", Math.max(0, idx - 60)) + 1
  );
  const sentenceEnd = Math.min(
    content.length,
    content.indexOf(".", idx + q.length + 60)
  );

  const start = Math.max(sentenceStart, idx - 60);
  const end = Math.min(
    sentenceEnd > idx ? sentenceEnd + 1 : content.length,
    start + maxLen
  );

  let snippet = content.slice(start, end).replace(/\n+/g, " ").trim();

  if (start > 0) snippet = "…" + snippet;
  if (end < content.length) snippet = snippet + "…";

  return snippet;
}

/* ── Score a page item ── */
export function scorePage(query: string, item: PageItem): number {
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

  // Multi-word: check if ALL words appear
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  if (words.length > 1) {
    const allText = `${title} ${tags} ${desc}`;
    const allFound = words.every((w) => allText.includes(w));
    if (allFound) score += 30;
  }

  // Fuzzy title match (subsequence)
  if (score === 0) {
    let qi = 0;
    for (let ti = 0; ti < title.length && qi < q.length; ti++) {
      if (title[ti] === q[qi]) qi++;
    }
    if (qi === q.length) score += 10;
  }

  return score;
}

/* ── Score a blog item with TF-IDF inspired ranking ── */
export function scoreBlog(query: string, item: BlogItem): number {
  const q = query.toLowerCase();
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();
  const tags = item.tags.join(" ").toLowerCase();

  let score = 0;

  // Title matching (highest weight)
  if (title === q) score += 100;
  else if (title.startsWith(q)) score += 85;
  else if (title.includes(q)) score += 65;

  // Tag/keyword matching
  if (tags.includes(q)) score += 45;

  // Description matching
  if (desc.includes(q)) score += 25;

  // Full-text content matching with density scoring (TF-IDF inspired)
  const corpus = item.searchCorpus;
  if (corpus.includes(q)) {
    // Base content match score
    score += 35;

    // Density bonus: how frequently does the term appear?
    const occurrences = countOccurrences(corpus, q);
    const corpusLength = corpus.length;
    const density = (occurrences * q.length) / corpusLength;

    // Density bonus: up to 25 additional points
    // High density (>0.01) = full bonus, low density = proportional
    const densityBonus = Math.min(25, Math.round(density * 2500));
    score += densityBonus;

    // Frequency bonus: more mentions = more relevant (capped)
    const freqBonus = Math.min(15, occurrences * 3);
    score += freqBonus;
  }

  // Multi-word AND matching
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  if (words.length > 1) {
    const allInCorpus = words.every((w) => corpus.includes(w));
    if (allInCorpus) {
      score += 30;
      // Proximity bonus
      score += proximityScore(corpus, words);
    } else {
      // Partial match: some words found
      const foundCount = words.filter((w) => corpus.includes(w)).length;
      const partialScore = Math.round((foundCount / words.length) * 15);
      score += partialScore;
    }
  }

  // Individual word TF scoring for single-word queries
  if (words.length === 1 && score > 0) {
    const tf = termFrequency(words[0], corpus);
    // TF bonus: up to 10 points for high-frequency terms
    score += Math.min(10, Math.round(tf * 1000));
  }

  // Recency boost (newer posts get slight preference)
  if (typeof item.recencyIndex === "number") {
    score += Math.max(0, 12 - Math.floor(item.recencyIndex / 8));
  }

  return score;
}

/* ── Main search function ── */
export function search(
  query: string,
  pages: PageItem[],
  options?: {
    maxPages?: number;
    maxPosts?: number;
    includeSnippets?: boolean;
  }
): { pages: SearchResult[]; posts: SearchResult[] } {
  const { maxPages = 8, maxPosts = 15, includeSnippets = true } = options || {};

  if (!query.trim()) {
    return {
      pages: pages.slice(0, 6).map((p) => ({ ...p, score: 0, type: "page" as const })),
      posts: BLOG_ITEMS.slice(0, 4).map((p) => ({
        ...p,
        score: 0,
        type: "blog" as const,
        snippet: undefined,
      })),
    };
  }

  const q = query.trim();

  // Score and rank pages
  const matchedPages: SearchResult[] = pages
    .map((p) => ({ ...p, score: scorePage(q, p), type: "page" as const }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPages);

  // Score and rank blog posts
  const matchedPosts: SearchResult[] = BLOG_ITEMS.map((p) => ({
    ...p,
    score: scoreBlog(q, p),
    type: "blog" as const,
    snippet: includeSnippets ? extractSnippet(p.content, q) : undefined,
  }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPosts);

  return { pages: matchedPages, posts: matchedPosts };
}
