import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer, pageProps } from "@tests/helpers/render";
import BlogPostPage, { generateMetadata, generateStaticParams } from "@/app/blog/[slug]/page";
import { sanityFetch, client } from "@/lib/sanity/client";
import { postBySlugQuery } from "@/lib/sanity/queries";

// The shared next/font/google fake (a Proxy) has no `has` trap, so vitest
// reports its named exports as missing; list the fonts used here instead.
vi.mock("next/font/google", () => {
  const font = () => ({ className: "font-test", variable: "--font-test", style: { fontFamily: "test" } });
  return { Cormorant_Garamond: font, Fraunces: font, IM_Fell_English: font, Libre_Baskerville: font };
});


type Props = Parameters<typeof BlogPostPage>[0];
const props = (slug: string) => pageProps({ slug }) as unknown as Props;

const POST = {
  _id: "p1",
  _createdAt: "2026-01-01T00:00:00Z",
  _updatedAt: "2026-10-06T00:00:00Z",
  title: "Five Cups of Trust",
  slug: { current: "five-cups" },
  publishedAt: "2026-01-01T00:00:00Z",
  excerpt: "Why trust is poured, not built.",
  body: [{ _type: "block", _key: "b1", style: "normal", markDefs: [], children: [{ _type: "span", _key: "s1", text: "Trust is poured one cup at a time.", marks: [] }] }],
  category: { title: "Business", slug: { current: "business" } },
  tags: ["trust"],
};

function withPost(post: unknown) {
  vi.mocked(sanityFetch).mockImplementation(async (opts: { query: string }) => (opts.query === postBySlugQuery ? post : []) as never);
}

beforeEach(() => {

  withPost(POST);

});
afterEach(() => {
  vi.unstubAllEnvs();
});
describe("/blog/[slug] metadata", () => {
  it("uses the post's title, excerpt and its own canonical", async () => {
    const meta = await generateMetadata(props("five-cups"));
    expect(meta.title).toBe("Five Cups of Trust");
    expect(meta.description).toBe("Why trust is poured, not built.");
    expect(meta.alternates?.canonical).toBe("/blog/five-cups");
    expect(meta.openGraph).toMatchObject({ type: "article", url: "/blog/five-cups", section: "Business" });
    expect(meta.robots).toBeUndefined();
  });

  it("prefers the SEO fields when set", async () => {
    withPost({ ...POST, seo: { metaTitle: "SEO title", metaDescription: "SEO desc" } });
    const meta = await generateMetadata(props("five-cups"));
    expect(meta.title).toBe("SEO title");
    expect(meta.description).toBe("SEO desc");
  });

  it("keeps a password-protected essay out of search and says nothing about it", async () => {
    withPost({ ...POST, slug: { current: "you-are-the-moat" } });
    const meta = await generateMetadata(props("you-are-the-moat"));
    expect(meta.robots).toEqual({ index: false, follow: false });
    expect(meta.description).toBe("This essay is password-protected.");
    expect(meta.openGraph).toBeUndefined();
  });

  it("matches the 404 title for a missing post", async () => {
    withPost(null);
    expect((await generateMetadata(props("nope"))).title).toBe("Page not found");
  });
});

describe("/blog/[slug] page", () => {
  it("builds one page per post slug", async () => {
    vi.mocked(client.fetch).mockResolvedValue([{ slug: "a" }, { slug: "b" }] as never);
    await expect(generateStaticParams()).resolves.toEqual([{ slug: "a" }, { slug: "b" }]);
  });

  it("returns a 404 for a missing post", async () => {
    withPost(null);
    await expect(BlogPostPage(props("nope"))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders the title as the one H1, the body, the category link and the back link", async () => {
    await renderServer(BlogPostPage(props("five-cups")));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Five Cups of Trust");
    expect(screen.getAllByText(/Trust is poured one cup at a time/).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /back to the blog/i })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: /more in business/i })).toHaveAttribute("href", "/blog/category/business");
    expect(screen.getByText("1 min read")).toBeInTheDocument();
    expect(document.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });

  it("shows only the lock screen for a password-protected essay, never its body", async () => {
    withPost({ ...POST, slug: { current: "you-are-the-moat" } });
    vi.stubEnv("GATED_POST_PASSWORD", "open-sesame");
    const { container } = await renderServer(BlogPostPage(props("you-are-the-moat")));
    expect(container.textContent).not.toContain("Trust is poured");
    expect(container.querySelector('input[type="password"]')).not.toBeNull();
  });
});
