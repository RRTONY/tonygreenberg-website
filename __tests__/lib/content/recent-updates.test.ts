import { describe, expect, it } from "vitest";
import { RECENT_UPDATE_FILTERS, RECENT_UPDATES_MAX_POSTS, pickRecentUpdatePosts, type RecentUpdatePost } from "@/lib/content/recent-updates";

const post = (id: string, cat?: string): RecentUpdatePost & { body?: string } => ({
  _id: id,
  title: `T${id}`,
  slug: `s${id}`,
  publishedAt: "2024-01-01",
  ...(cat ? { category: { title: cat, slug: cat } } : {}),
});

describe("recent-updates", () => {
  it("starts with All Categories and has unique pill slugs", () => {
    expect(RECENT_UPDATE_FILTERS[0]).toEqual({ label: "All Categories", slug: null });
    const slugs = RECENT_UPDATE_FILTERS.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(RECENT_UPDATES_MAX_POSTS).toBe(3);
  });

  it("returns nothing for no posts", () => {
    expect(pickRecentUpdatePosts([])).toEqual([]);
  });

  it("keeps the newest 3 overall plus the newest 3 of each pill's category, in the given order", () => {
    const posts = [
      post("1", "business-capital"), post("2", "other"), post("3", "other"), post("4", "other"),
      post("5", "business-capital"), post("6", "business-capital"), post("7", "business-capital"),
      post("8", "psychedelic-medicine"), post("9"),
    ];
    expect(pickRecentUpdatePosts(posts).map((p) => p._id)).toEqual(["1", "2", "3", "5", "6", "8"]);
  });

  it("drops fields the band does not use", () => {
    const withExtra = { ...post("1", "business-capital"), body: "long text" };
    expect(pickRecentUpdatePosts([withExtra])[0]).not.toHaveProperty("body");
    expect(Object.keys(pickRecentUpdatePosts([withExtra])[0]).sort()).toEqual(["_id", "category", "excerpt", "publishedAt", "slug", "title"]);
  });
});
