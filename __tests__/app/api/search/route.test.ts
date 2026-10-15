// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/search/route";
import { sanityFetch } from "@/lib/sanity/client";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";

const search = (qs: string) => GET(new NextRequest(`https://tonygreenberg.com/api/search?${qs}`));
const post = (title: string, slug: string, excerpt = "") => ({ _id: slug, title, slug: { current: slug }, publishedAt: "2026-01-01", excerpt });

describe("GET /api/search", () => {
  it("returns nothing for a query under 2 characters, without asking Sanity", async () => {
    expect(await (await search("q=a")).json()).toEqual({ posts: [] });
    expect(await (await search("q=%20a%20&all=1")).json()).toEqual({ posts: [], coffees: [], charities: [] });
    expect(sanityFetch).not.toHaveBeenCalled();
  });

  it("asks Sanity with a wildcard query and ranks title matches first", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([post("Something else", "other", "mentions coffee"), post("Coffee rituals", "coffee-rituals")]);
    const res = await search("q=coffee");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(sanityFetch).toHaveBeenCalledWith(expect.objectContaining({ params: { q: "*coffee*" }, tags: ["post"] }));
    expect(body.posts[0]).toEqual({ title: "Coffee rituals", href: "/blog/coffee-rituals", description: "" });
    expect(body.posts.map((p: { href: string }) => p.href)).toContain("/blog/other");
    expect(body).not.toHaveProperty("coffees");
  });

  it("caps posts at 10", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(Array.from({ length: 15 }, (_, i) => post(`Coffee ${i}`, `c${i}`)));
    expect((await (await search("q=coffee")).json()).posts).toHaveLength(10);
  });

  it("with all=1 also returns matching coffees and charities linked to their pages", async () => {
    const name = BREWSOUL_COFFEES[0].name;
    const body = await (await search(`q=${encodeURIComponent(name)}&all=1`)).json();
    expect(body.coffees.length).toBeGreaterThan(0);
    expect(body.coffees.length).toBeLessThanOrEqual(8);
    expect(body.coffees[0].href).toBe(`/brewsoul/coffee/${BREWSOUL_COFFEES[0].id}`);
    expect(Array.isArray(body.charities)).toBe(true);
    for (const c of body.charities) expect(c.href).toMatch(/^\/charity-scorecard\//);
  });

  it("returns 502 with empty posts (but keeps the extras) when Sanity fails", async () => {
    vi.mocked(sanityFetch).mockRejectedValue(new Error("down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await search("q=coffee&all=1");
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.posts).toEqual([]);
    expect(body).toHaveProperty("coffees");
  });
});
