import { describe, expect, it, vi } from "vitest";
import { loadIndexBodies, loadIndexItems } from "@/app/the-index/index-data";
import { sanityFetch } from "@/lib/sanity/client";
import { DEFAULT_ESSAY_HERO } from "@/lib/content/default-image";

const row = (slug: string) => ({ slug, title: `T ${slug}`, publishedAt: "2026-01-01", excerpt: "e", formatTag: null, category: "Business", tags: null, heroImage: null });

describe("index data", () => {
  it("lists essays first (with the default picture when none is set), then site pages", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([row("a"), row("b")] as never);
    const { items, essayCount } = await loadIndexItems();
    expect(essayCount).toBe(2);
    expect(items.slice(0, 2).map((i) => i.href)).toEqual(["/blog/a", "/blog/b"]);
    expect(items[0].image).toBe(DEFAULT_ESSAY_HERO.src);
    expect(items.length).toBeGreaterThan(2);
    expect(items.slice(2).every((i) => i.kind === "page")).toBe(true);
    expect(items.some((i) => i.href === "/the-index")).toBe(false);
  });

  it("maps body text by slug, empty when missing", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([{ slug: "a", text: "hello" }, { slug: "b", text: null }] as never);
    const bodies = await loadIndexBodies();
    expect(bodies.get("a")).toBe("hello");
    expect(bodies.get("b")).toBe("");
    expect(sanityFetch).toHaveBeenCalledWith(expect.objectContaining({ tags: ["post"] }));
  });
});
