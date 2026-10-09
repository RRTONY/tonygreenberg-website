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
};

export const ARCHIVE_PAGE_SIZE = 12;
export const ARCHIVE_JSON_PATH = "/essays-archive.json";

export type ArchiveSummary = {
  firstPosts: ArchivePost[];
  total: number;
  categories: Array<[title: string, count: number]>;
};

export function summarizeArchive(posts: ArchivePost[]): ArchiveSummary {
  const counts = new Map<string, number>();
  for (const p of posts) {
    if (p.category) counts.set(p.category.title, (counts.get(p.category.title) ?? 0) + 1);
  }
  return {
    firstPosts: posts.slice(0, ARCHIVE_PAGE_SIZE),
    total: posts.length,
    categories: Array.from(counts.entries()),
  };
}
