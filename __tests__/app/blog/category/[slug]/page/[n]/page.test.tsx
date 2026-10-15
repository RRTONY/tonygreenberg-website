import { describe, expect, it, vi } from "vitest";
import { pageProps } from "@tests/helpers/render";
import CategoryPageN, { generateMetadata, generateStaticParams, dynamicParams } from "@/app/blog/category/[slug]/page/[n]/page";
import { CategoryListing } from "@/components/blog/category-listing";
import { sanityFetch, client } from "@/lib/sanity/client";
import { categoryBySlugQuery } from "@/lib/sanity/queries";

type Props = Parameters<typeof CategoryPageN>[0];
const props = (slug: string, n: string) => pageProps({ slug, n }) as unknown as Props;

describe("/blog/category/[slug]/page/[n]", () => {
  it("pre-builds pages 2..last for each category and 404s anything else", async () => {
    expect(dynamicParams).toBe(false);
    vi.mocked(client.fetch).mockResolvedValue([
      { slug: { current: "business" }, postCount: 30 },
      { slug: { current: "ai" }, postCount: 12 },
      { slug: null, postCount: 50 },
    ] as never);
    await expect(generateStaticParams()).resolves.toEqual([
      { slug: "business", n: "2" },
      { slug: "business", n: "3" },
    ]);
  });

  it("404s page 1, page 0, leading zeros and non-numbers", async () => {
    for (const n of ["1", "0", "02", "abc", "-2"]) {
      await expect(CategoryPageN(props("business", n))).rejects.toThrow("NEXT_NOT_FOUND");
      expect(await generateMetadata(props("business", n))).toEqual({});
    }
  });

  it("renders the listing for a real page number", async () => {
    for (const n of ["2", "10"]) {
      const el = await CategoryPageN(props("business", n));
      expect(el.type).toBe(CategoryListing);
      expect(el.props).toEqual({ slug: "business", page: Number(n) });
    }
  });

  it("titles later pages with the page number and canonicals to themselves", async () => {
    vi.mocked(sanityFetch).mockImplementation(async (o: { query: string }) => (o.query === categoryBySlugQuery ? { title: "Business" } : 30) as never);
    const meta = await generateMetadata(props("business", "2"));
    expect(meta.title).toBe("Business — Page 2");
    expect(meta.alternates?.canonical).toBe("/blog/category/business/page/2");
  });
});
