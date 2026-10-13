import type { urlFor } from "@/lib/sanity/image";

// The essay archive on "/" and "/blog" (HomeArchive). The page sends only
// the first ARCHIVE_PAGE_SIZE posts plus the counts; the full list for
// search, category filters and "Show all" is the static JSON at
// ARCHIVE_JSON_PATH (src/app/essays-archive.json/route.ts), which the
// browser loads when someone reaches for those controls. Sending all ~120
// posts inside every page made the homepage's HTML about 3x heavier
// (2026-10-09, Lighthouse).

export type ArchivePost = {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  heroImage?: Parameters<typeof urlFor>[0];
  readTime?: number;
  tags?: string[];
  category?: { title: string; slug: string };
  /** Estimated from the body's word count (allPostsForArchiveQuery). */
  minutes?: number;
};

export const ARCHIVE_PAGE_SIZE = 12;
export const ARCHIVE_JSON_PATH = "/essays-archive.json";

export type ArchiveSummary = {
  firstPosts: ArchivePost[];
  total: number;
  categories: Array<[title: string, count: number]>;
  /** Every year with an essay, newest first. */
  years: string[];
  /** Tags used by at least MIN_TOPIC_POSTS essays, most used first. */
  topics: Array<[tag: string, count: number]>;
};

// 874 distinct tags, most used once: only the shared ones make a useful filter.
const MIN_TOPIC_POSTS = 3;

export const LENGTH_FILTERS = [
  { value: "short", label: "Under 5 min", min: 0, max: 4 },
  { value: "medium", label: "5 to 10 min", min: 5, max: 10 },
  { value: "long", label: "Over 10 min", min: 11, max: Infinity },
] as const;

/** The editor's read time when set, otherwise the word-count estimate. */
export function readingMinutes(post: ArchivePost): number {
  return Math.max(1, post.readTime ?? post.minutes ?? 1);
}

/** Tags compare case-insensitively ("Blockchain" and "blockchain" are one topic). */
export const topicKey = (tag: string) => tag.trim().toLowerCase();

export function summarizeArchive(posts: ArchivePost[]): ArchiveSummary {
  const counts = new Map<string, number>();
  const years = new Set<string>();
  const topics = new Map<string, { label: string; count: number }>();
  for (const p of posts) {
    if (p.category) counts.set(p.category.title, (counts.get(p.category.title) ?? 0) + 1);
    if (p.publishedAt) years.add(p.publishedAt.slice(0, 4));
    for (const tag of new Set((p.tags ?? []).map(topicKey))) {
      const label = p.tags?.find((t) => topicKey(t) === tag) ?? tag;
      const entry = topics.get(tag);
      topics.set(tag, { label: entry?.label ?? label, count: (entry?.count ?? 0) + 1 });
    }
  }
  return {
    firstPosts: posts.slice(0, ARCHIVE_PAGE_SIZE),
    total: posts.length,
    categories: Array.from(counts.entries()),
    years: Array.from(years).sort((a, b) => b.localeCompare(a)),
    topics: Array.from(topics.values())
      .filter((t) => t.count >= MIN_TOPIC_POSTS)
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .map((t): [string, number] => [t.label, t.count]),
  };
}
