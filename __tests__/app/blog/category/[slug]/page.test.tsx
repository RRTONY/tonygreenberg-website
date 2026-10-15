import { describe, expect, it, vi } from "vitest";
import { pageProps } from "@tests/helpers/render";
import CategoryPage, { generateMetadata, generateStaticParams } from "@/app/blog/category/[slug]/page";
import { CategoryListing } from "@/components/blog/category-listing";
import { sanityFetch, client } from "@/lib/sanity/client";
import { categoryBySlugQuery } from "@/lib/sanity/queries";

type Props = Parameters<typeof CategoryPage>[0];
const props = (slug: string) => pageProps({ slug }) as unknown as Props;

function category(title: string | null, count: number) {
  vi.mocked(sanityFetch).mockImplementation(async (o: { query: string }) => (o.query === categoryBySlugQuery ? (title ? { title } : null) : count) as never);
}

describe("/blog/category/[slug]", () => {
  it("pre-builds one page per category", async () => {
    vi.mocked(client.fetch).mockResolvedValue([{ slug: "business" }, { slug: "ai" }] as never);
    await expect(generateStaticParams()).resolves.toEqual([{ slug: "business" }, { slug: "ai" }]);
  });

  it("titles page 1 with the category, canonical to itself", async () => {
    category("Business", 20);
    const meta = await generateMetadata(props("business"));
    expect(meta.title).toBe("Business");
    expect(meta.description).toBe("Essays filed under Business.");
    expect(meta.alternates?.canonical).toBe("/blog/category/business");
    expect(meta.robots).toBeUndefined();
  });

  it("keeps a near-empty category out of search", async () => {
    category("Tiny", 1);
    expect((await generateMetadata(props("tiny"))).robots).toEqual({ index: false, follow: true });
  });

  it("renders the shared listing for page 1 of that category", async () => {
    const el = await CategoryPage(props("business"));
    expect(el.type).toBe(CategoryListing);
    expect(el.props).toEqual({ slug: "business", page: 1 });
  });
});
