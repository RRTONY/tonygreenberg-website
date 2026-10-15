import { describe, expect, it, vi } from "vitest";
import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { pageSeoQuery } from "@/lib/sanity/queries";
import { DEFAULT_OG_IMAGE } from "@/lib/seo-defaults";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";

const fallback: Metadata = {
  title: "Code title",
  description: "Code description",
  alternates: { canonical: "/about" },
  openGraph: { title: "OG code title", url: "/about" },
};

describe("getPageSeo", () => {
  it("fetches the route's pageSeo document with the pageSeo tag", async () => {
    vi.mocked(sanityFetch).mockResolvedValue({ seo: { metaTitle: "X" } });
    await expect(getPageSeo("/about")).resolves.toEqual({ seo: { metaTitle: "X" } });
    expect(sanityFetch).toHaveBeenCalledWith({ query: pageSeoQuery, params: { route: "/about" }, tags: ["pageSeo"], revalidate: 60 });
  });
});

describe("withSeoOverrides", () => {
  it("returns the fallback untouched when there's no Sanity SEO", () => {
    expect(withSeoOverrides(fallback, null)).toBe(fallback);
    expect(withSeoOverrides(fallback, undefined)).toBe(fallback);
  });

  it("overrides only the fields an editor filled in", () => {
    const m = withSeoOverrides(fallback, { metaDescription: "Editor description" });
    expect(m.title).toBe("Code title");
    expect(m.description).toBe("Editor description");
    expect(m.alternates).toEqual({ canonical: "/about" });
    expect(m.openGraph).toMatchObject({ title: "OG code title", description: "Editor description", url: "/about", siteName: "Tony Greenberg" });
    expect(m.robots).toBeUndefined();
  });

  it("keeps the default share image when neither side has one", () => {
    expect(withSeoOverrides(fallback, { metaTitle: "T" }).openGraph?.images).toEqual([DEFAULT_OG_IMAGE]);
  });

  it("uses the Sanity OG image at 1200x630", () => {
    const m = withSeoOverrides(fallback, { ogImage: { asset: { _ref: "image-abc-2400x1260-png" } } });
    const [img] = m.openGraph!.images as string[];
    expect(img).toContain("cdn.sanity.io");
    expect(img).toContain("w=1200");
    expect(img).toContain("h=630");
  });

  it("noIndex adds robots noindex/nofollow", () => {
    expect(withSeoOverrides(fallback, { noIndex: true }).robots).toEqual({ index: false, follow: false });
  });
});
