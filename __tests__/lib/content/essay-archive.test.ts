import { describe, expect, it } from "vitest";
import {
  ARCHIVE_PAGE_SIZE, ARCHIVE_JSON_PATH, LENGTH_FILTERS, readingMinutes, topicKey, summarizeArchive, type ArchivePost,
} from "@/lib/content/essay-archive";
import { CURATED_JOURNEYS } from "@/lib/content/curated-journeys";

const post = (over: Partial<ArchivePost> & { slug: string }): ArchivePost => ({
  _id: over.slug,
  title: over.slug,
  publishedAt: "2024-01-01T00:00:00Z",
  ...over,
});

describe("constants", () => {
  it("pages 12 essays and loads the rest from the static JSON", () => {
    expect(ARCHIVE_PAGE_SIZE).toBe(12);
    expect(ARCHIVE_JSON_PATH).toBe("/essays-archive.json");
  });

  it("has length filters that cover every minute count without gaps", () => {
    expect(LENGTH_FILTERS.map((f) => f.value)).toEqual(["short", "medium", "long"]);
    for (let i = 1; i < LENGTH_FILTERS.length; i++) expect(LENGTH_FILTERS[i].min).toBe(LENGTH_FILTERS[i - 1].max + 1);
    expect(LENGTH_FILTERS[2].max).toBe(Infinity);
  });
});

describe("readingMinutes", () => {
  it("prefers the editor's read time, then the estimate, and is never below 1", () => {
    expect(readingMinutes(post({ slug: "a", readTime: 7, minutes: 3 }))).toBe(7);
    expect(readingMinutes(post({ slug: "a", minutes: 3 }))).toBe(3);
    expect(readingMinutes(post({ slug: "a" }))).toBe(1);
    expect(readingMinutes(post({ slug: "a", readTime: 0 }))).toBe(1);
  });
});

describe("topicKey", () => {
  it("compares tags case-insensitively and ignores surrounding spaces", () => {
    expect(topicKey("  Blockchain ")).toBe("blockchain");
    expect(topicKey("")).toBe("");
  });
});

describe("summarizeArchive", () => {
  it("returns empty counts for no posts", () => {
    const s = summarizeArchive([]);
    expect(s).toMatchObject({ firstPosts: [], total: 0, categories: [], years: [], topics: [] });
    for (const j of CURATED_JOURNEYS) expect(s.journeyCounts[j.id]).toBe(0);
  });

  it("keeps only the first page of posts but counts them all", () => {
    const posts = Array.from({ length: 20 }, (_, i) => post({ slug: `p${i}` }));
    const s = summarizeArchive(posts);
    expect(s.total).toBe(20);
    expect(s.firstPosts.map((p) => p.slug)).toEqual(posts.slice(0, 12).map((p) => p.slug));
  });

  it("counts categories and lists years newest first", () => {
    const s = summarizeArchive([
      post({ slug: "a", publishedAt: "2019-05-01", category: { title: "Living Well", slug: "living-well" } }),
      post({ slug: "b", publishedAt: "2024-02-01", category: { title: "Living Well", slug: "living-well" } }),
      post({ slug: "c", publishedAt: "2021-02-01", category: { title: "The Crusades", slug: "the-crusades" } }),
      post({ slug: "d", publishedAt: "" }),
    ]);
    expect(s.categories).toEqual([["Living Well", 2], ["The Crusades", 1]]);
    expect(s.years).toEqual(["2024", "2021", "2019"]);
  });

  it("keeps topics used by 3+ essays, merging case, most used first, ties alphabetical", () => {
    const s = summarizeArchive([
      post({ slug: "a", tags: ["Blockchain", "AI", "Trust"] }),
      post({ slug: "b", tags: ["blockchain", "AI", "Trust", "trust"] }),
      post({ slug: "c", tags: ["BLOCKCHAIN", "AI", "Trust"] }),
      post({ slug: "d", tags: ["blockchain", "Solo"] }),
    ]);
    expect(s.topics).toEqual([["Blockchain", 4], ["AI", 3], ["Trust", 3]]);
  });

  it("counts only the published essays of each curated journey", () => {
    const journey = CURATED_JOURNEYS[0];
    const s = summarizeArchive([post({ slug: journey.postSlugs[0] }), post({ slug: journey.postSlugs[1] }), post({ slug: "unrelated" })]);
    expect(s.journeyCounts[journey.id]).toBe(2);
  });
});
