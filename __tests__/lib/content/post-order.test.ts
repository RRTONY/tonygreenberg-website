import { describe, expect, it } from "vitest";
import { POST_ORDER, ORIGINAL_URLS } from "@/lib/content/post-order";

describe("post-order", () => {
  it("lists unique, url-safe essay slugs in editorial order", () => {
    expect(POST_ORDER.length).toBeGreaterThan(100);
    expect(new Set(POST_ORDER).size).toBe(POST_ORDER.length);
    for (const s of POST_ORDER) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(POST_ORDER.slice(0, 4)).toEqual([
      "energy-is-money-money-is-memory",
      "your-blood-lies-without-your-dna",
      "when-healing-becomes-extraction",
      "five-cups",
    ]);
  });

  it("keeps the 11 Molecule as Mirror parts in order", () => {
    const parts = POST_ORDER.filter((s) => /^molecule-as-mirror-\d+-/.test(s)).map((s) => Number(s.split("-")[3]));
    expect(parts).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it("has an original tonygreenberg.com URL only for posts in the order", () => {
    for (const [slug, url] of Object.entries(ORIGINAL_URLS)) {
      expect(POST_ORDER).toContain(slug);
      expect(url).toMatch(/^https:\/\/tonygreenberg\.com\//);
      expect(url).not.toMatch(/manuscdn|\/manus-storage\/|\/api\/img\//);
    }
    expect(ORIGINAL_URLS["you-are-the-moat"]).toBe("https://tonygreenberg.com/blog/you-are-the-moat");
  });
});
