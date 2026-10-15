import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMostRead } from "@/lib/content/most-read";
import { getTopEssayPaths } from "@/lib/admin/ga4-client";
import type { ArchivePost } from "@/lib/content/essay-archive";

// Google Analytics is never called for real.
vi.mock("@/lib/admin/ga4-client", () => ({ getTopEssayPaths: vi.fn() }));

const FALLBACK = [
  "boiling-the-human-summit-harvard-kurzweil",
  "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
  "only-time-buys-trust",
  "return-on-investment-going-green-going-green-2",
  "customer-service-key-to-business-success",
];
const post = (slug: string): ArchivePost => ({ _id: slug, slug, title: `Title ${slug}`, publishedAt: "2024-01-01" });
const posts = [...FALLBACK, "a", "b", "c", "d", "e", "f"].map(post);
const rows = (paths: string[]) => paths.map((path, i) => ({ path, views: 100 - i }));

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("getMostRead", () => {
  it("uses Google Analytics order, strips /blog/ and query strings, and asks for 365 days", async () => {
    vi.mocked(getTopEssayPaths).mockResolvedValue(rows(["/blog/a", "/blog/b?x=1", "/blog/c/", "/blog/d#top", "/blog/e", "/blog/f"]) as never);
    const result = await getMostRead(posts);
    expect(result.fromAnalytics).toBe(true);
    expect(result.posts).toEqual(["a", "b", "c", "d", "e"].map((s) => ({ slug: s, title: `Title ${s}` })));
    expect(getTopEssayPaths).toHaveBeenCalledWith(365, 25);
  });

  it("skips unpublished slugs and duplicates", async () => {
    vi.mocked(getTopEssayPaths).mockResolvedValue(rows(["/blog/a", "/blog/a?ref=x", "/blog/gone", "/blog/b", "/blog/c", "/blog/d", "/blog/e"]) as never);
    expect((await getMostRead(posts)).posts.map((p) => p.slug)).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("falls back to live's fixed list when analytics has fewer than 5 published essays", async () => {
    vi.mocked(getTopEssayPaths).mockResolvedValue(rows(["/blog/a", "/blog/b"]) as never);
    const result = await getMostRead(posts);
    expect(result).toEqual({ posts: FALLBACK.map((s) => ({ slug: s, title: `Title ${s}` })), fromAnalytics: false });
  });

  it("falls back and logs when analytics fails", async () => {
    vi.mocked(getTopEssayPaths).mockRejectedValue(new Error("GA down"));
    const result = await getMostRead(posts);
    expect(result.fromAnalytics).toBe(false);
    expect(result.posts).toHaveLength(5);
    expect(console.error).toHaveBeenCalled();
  });

  it("returns nothing when there are no published posts", async () => {
    vi.mocked(getTopEssayPaths).mockResolvedValue(rows(["/blog/a"]) as never);
    expect(await getMostRead([])).toEqual({ posts: [], fromAnalytics: false });
  });
});
