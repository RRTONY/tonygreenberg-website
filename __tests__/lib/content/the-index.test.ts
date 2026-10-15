import { describe, expect, it } from "vitest";
import {
  INDEX_CONCEPTS, INDEX_STATS_CONCEPTS, normalizeIndexQuery, expandIndexQuery, matchesCharity, essayToIndexItem, siteResourceItems,
  indexItemText, indexDateValue, sortIndexByDate, scoreIndexItem, conceptsMatching, pickNextReads, type IndexItem,
} from "@/lib/content/the-index";
import { SEARCH_DIRECTORY } from "@/lib/content/search-directory";
import { POST_ORDER } from "@/lib/content/post-order";

const item = (over: Partial<IndexItem> & { id: string }): IndexItem => ({
  kind: "essay", title: over.id, href: `/blog/${over.id}`, date: null, category: "", summary: "", formatTag: null, image: null, tags: [], ...over,
});

describe("INDEX_CONCEPTS", () => {
  it("has unique keys and only real essay slugs", () => {
    expect(new Set(INDEX_CONCEPTS.map((c) => c.key)).size).toBe(INDEX_CONCEPTS.length);
    for (const c of INDEX_CONCEPTS) {
      expect(new Set(c.slugs).size).toBe(c.slugs.length);
      for (const s of c.slugs) expect(POST_ORDER, `${c.key}: ${s}`).toContain(s);
    }
    expect(INDEX_CONCEPTS.find((c) => c.key === "charity")?.slugs).toEqual([]);
  });

  it("keeps live's '18 concepts' stat line as copy, even though there are 20", () => {
    expect(INDEX_STATS_CONCEPTS).toBe("18");
    expect(INDEX_CONCEPTS).toHaveLength(20);
  });
});

describe("query helpers", () => {
  it("normalises spacing and case", () => {
    expect(normalizeIndexQuery("  Whole   GENOME ")).toBe("whole genome");
  });

  it("expands a query to its related-term group, and returns nothing for empty input", () => {
    expect(expandIndexQuery("DNA")).toEqual(["dna", "genetic", "genetics", "genome", "genomic", "sequencing", "whole genome", "30x"]);
    expect(expandIndexQuery("   ")).toEqual([]);
    expect(expandIndexQuery("zzqx")).toEqual(["zzqx"]);
  });

  it("matches charity keywords either way round", () => {
    expect(matchesCharity("Donate")).toBe(true);
    expect(matchesCharity("charity scorecard")).toBe(true);
    expect(matchesCharity("coffee")).toBe(false);
    expect(matchesCharity("")).toBe(false);
  });

  it("finds concepts by label or description", () => {
    expect(conceptsMatching("Negotiation").map((c) => c.key)).toContain("negotiation");
    expect(conceptsMatching("")).toEqual([]);
  });
});

describe("items", () => {
  it("turns a post row into an essay item with safe defaults", () => {
    const i = essayToIndexItem({ slug: "five-cups", title: "Five Cups", publishedAt: "2024-01-01", excerpt: null, formatTag: null, category: null, tags: null }, null);
    expect(i).toMatchObject({ id: "five-cups", kind: "essay", href: "/blog/five-cups", category: "", summary: "", tags: [] });
  });

  it("lists every site page except the Index itself, with the essay count filled in", () => {
    const pages = siteResourceItems(121);
    expect(pages).toHaveLength(SEARCH_DIRECTORY.filter((p) => p.href !== "/the-index").length);
    expect(pages.some((p) => p.href === "/the-index")).toBe(false);
    expect(pages.find((p) => p.href === "/blog")?.summary).toMatch(/^121 essays/);
    for (const p of pages) expect(p).toMatchObject({ kind: "page", id: `page:${p.href}`, date: null, category: "Site Resource" });
  });

  it("builds lowercase searchable text", () => {
    expect(indexItemText(item({ id: "a", title: "Hello", category: "Living Well", summary: "Sum", tags: ["Tag"] }))).toBe("hello living well sum tag");
  });

  it("sorts newest first with undated or bad dates last", () => {
    expect(indexDateValue(null)).toBe(Number.NEGATIVE_INFINITY);
    expect(indexDateValue("not a date")).toBe(Number.NEGATIVE_INFINITY);
    const sorted = sortIndexByDate([item({ id: "old", date: "2019-01-01" }), item({ id: "page" }), item({ id: "new", date: "2024-01-01" })]);
    expect(sorted.map((i) => i.id)).toEqual(["new", "old", "page"]);
  });

  it("scores title 12, summary 6, tag 5, body 2 per term", () => {
    const i = item({ id: "x", title: "Trust me", summary: "about coffee", tags: ["sleep"] });
    expect(scoreIndexItem(i, ["trust"], "")).toBe(12);
    expect(scoreIndexItem(i, ["coffee"], "")).toBe(6);
    expect(scoreIndexItem(i, ["sleep"], "")).toBe(5);
    expect(scoreIndexItem(i, ["body"], "the body text")).toBe(2);
    expect(scoreIndexItem(i, ["trust", "coffee", "nope"], "")).toBe(18);
    expect(scoreIndexItem(i, [], "")).toBe(0);
  });

  it("picks three next reads: matching ones first, then the newest, never itself", () => {
    const me = item({ id: "me", category: "Trust", tags: ["ai"] });
    const all = [
      me,
      item({ id: "both", category: "Trust", tags: ["ai"], date: "2020-01-01" }),
      item({ id: "one", category: "Trust", date: "2023-01-01" }),
      item({ id: "newest", date: "2025-01-01" }),
      item({ id: "older", date: "2010-01-01" }),
    ];
    const next = pickNextReads(me, all, indexItemText);
    expect(next.map((i) => i.id)).toEqual(["both", "one", "newest"]);
    expect(pickNextReads(me, [me], indexItemText)).toEqual([]);
  });
});
