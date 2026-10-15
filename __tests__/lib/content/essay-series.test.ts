import { describe, expect, it } from "vitest";
import { SERIES, getSeriesForPost } from "@/lib/content/essay-series";
import { POST_ORDER } from "@/lib/content/post-order";

describe("essay-series data", () => {
  it("has unique series ids with all text fields filled", () => {
    expect(new Set(SERIES.map((s) => s.id)).size).toBe(SERIES.length);
    for (const s of SERIES) {
      for (const f of [s.title, s.subtitle, s.description, s.category]) expect(f.trim()).not.toBe("");
      expect(s.posts.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("puts each essay in at most one series, and only real essays", () => {
    const all = SERIES.flatMap((s) => s.posts);
    expect(new Set(all).size).toBe(all.length);
    for (const slug of all) expect(POST_ORDER).toContain(slug);
  });

  it("has 11 parts in The Molecule as Mirror", () => {
    expect(SERIES.find((s) => s.id === "molecule-mirror")?.posts).toHaveLength(11);
  });
});

describe("getSeriesForPost", () => {
  it("returns the series and 1-based part number for a series post", () => {
    const s = SERIES.find((x) => x.id === "molecule-mirror")!;
    const first = getSeriesForPost(s.posts[0]);
    expect(first).toEqual({ series: s, part: 1, total: s.posts.length });
    expect(getSeriesForPost(s.posts[s.posts.length - 1])?.part).toBe(s.posts.length);
  });

  it("returns null for a post outside every series, and for empty input", () => {
    expect(getSeriesForPost("five-cups-not-a-real-post")).toBeNull();
    expect(getSeriesForPost("")).toBeNull();
  });
});
