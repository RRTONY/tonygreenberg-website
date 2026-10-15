import { describe, expect, it, vi } from "vitest";
import { sanityFetch } from "@/lib/sanity/client";
import { getArticleJsonLd, getPersonJsonLd, getPostBreadcrumbJsonLd, getWebsiteJsonLd } from "@/lib/structured-data";

const SITE = "https://tonygreenberg.com";

describe("getWebsiteJsonLd", () => {
  it("describes the site with a search action", async () => {
    const ld = await getWebsiteJsonLd();
    expect(ld).toMatchObject({ "@type": "WebSite", name: "Tony Greenberg", url: SITE });
    expect(ld.potentialAction.target.urlTemplate).toBe(`${SITE}/search?q={search_term_string}`);
  });
});

describe("getPersonJsonLd", () => {
  it("uses the Sanity avatar for the image", async () => {
    vi.mocked(sanityFetch).mockResolvedValue({ avatar: { asset: { _ref: "image-abc-800x800-jpg" } } });
    const ld = await getPersonJsonLd();
    expect(ld["@id"]).toBe(`${SITE}/#person`);
    expect(ld.image).toContain("cdn.sanity.io");
    expect(ld.image).toContain("w=800");
    expect(sanityFetch).toHaveBeenCalledWith(expect.objectContaining({ tags: ["author"], revalidate: 3600 }));
  });

  it("leaves the image out when there's no avatar and never uses a Manus URL", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(null);
    const ld = await getPersonJsonLd();
    expect(ld.image).toBeUndefined();
    expect(JSON.stringify(ld)).not.toMatch(/manuscdn|manus-storage|\/api\/img\//);
  });
});

describe("getArticleJsonLd", () => {
  const post = { title: "Five Cups", slug: { current: "five-cups" }, publishedAt: "2026-01-01" };

  it("links Tony's posts to the site-wide Person and falls back dateModified", () => {
    const ld = getArticleJsonLd(post);
    expect(ld.author).toMatchObject({ "@id": `${SITE}/#person`, name: "Tony Greenberg" });
    expect(ld.dateModified).toBe("2026-01-01");
    expect(ld.image).toBeUndefined();
    expect(ld.publisher.logo.url).toBe(`${SITE}/icon`);
    expect(ld.mainEntityOfPage["@id"]).toBe(`${SITE}/blog/five-cups`);
  });

  it("keeps a guest author separate and uses the hero image at 1200x630", () => {
    const ld = getArticleJsonLd({ ...post, authorName: "Guest", updatedAt: "2026-02-01", heroImage: { asset: { _ref: "image-a-1200x630-jpg" } } });
    expect(ld.author).not.toHaveProperty("@id");
    expect(ld.author.name).toBe("Guest");
    expect(ld.dateModified).toBe("2026-02-01");
    expect(ld.image![0]).toMatch(/w=1200.*h=630|h=630.*w=1200/);
  });
});

describe("getPostBreadcrumbJsonLd", () => {
  it("lists Home > Essays > Category > Post with positions", () => {
    const ld = getPostBreadcrumbJsonLd({ title: "Five Cups", slug: { current: "five-cups" }, category: { title: "Coffee", slug: { current: "coffee" } } });
    expect(ld.itemListElement.map((c) => [c.position, c.name, c.item])).toEqual([
      [1, "Home", SITE],
      [2, "Essays", `${SITE}/blog`],
      [3, "Coffee", `${SITE}/blog/category/coffee`],
      [4, "Five Cups", `${SITE}/blog/five-cups`],
    ]);
  });

  it("skips the category crumb when there isn't one", () => {
    expect(getPostBreadcrumbJsonLd({ title: "X", slug: { current: "x" } }).itemListElement).toHaveLength(3);
  });
});
