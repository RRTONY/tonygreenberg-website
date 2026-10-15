import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer, pageProps } from "@tests/helpers/render";
import BlogPostPage, { generateMetadata, generateStaticParams } from "@/app/blog/[slug]/page";
import { sanityFetch, client } from "@/lib/sanity/client";
import { postBySlugQuery, postsBySlugsQuery, recentPostsQuery, relatedPostsQuery } from "@/lib/sanity/queries";

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

const thread = (slug: string, title: string) => ({ _id: `id-${slug}`, title, slug: { current: slug } });

function withData(post: unknown, extra: Record<string, unknown> = {}) {
  vi.mocked(sanityFetch).mockImplementation(async (opts: { query: string }) => {
    if (opts.query === postBySlugQuery) return post as never;
    return ((extra[opts.query] as unknown) ?? []) as never;
  });
}

const block = (key: string, text: string, style = "normal") => ({
  _type: "block", _key: key, style, markDefs: [], children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
});

describe("/blog/[slug] page details", () => {
  it.each([
    ["95", "bg-[#2E8B57]"],
    ["80", "bg-[#4682B4]"],
    ["65", "bg-[#B8860B]"],
    ["40", "bg-[#8B0000]"],
  ])("colours a validity score of %s with %s", async (score, cls) => {
    withPost({ ...POST, validityScore: score, validityLabel: "Checked" });
    await renderServer(BlogPostPage(props("five-cups")));
    const line = screen.getByText(new RegExp(`Validity: ${score}`));
    expect(line).toHaveTextContent("Checked");
    expect(line.querySelector("span")).toHaveClass(cls);
  });

  it("shows 'Updated' only for a real revision more than a day after publishing", async () => {
    withPost({ ...POST, lastUpdated: "2026-03-15T00:00:00Z" });
    const { unmount } = await renderServer(BlogPostPage(props("five-cups")));
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
    expect(document.querySelector('time[datetime="2026-03-15T00:00:00Z"]')).not.toBeNull();
    unmount();

    withPost({ ...POST, lastUpdated: "2026-01-01T05:00:00Z" });
    await renderServer(BlogPostPage(props("five-cups")));
    expect(screen.queryByText(/^Updated/)).toBeNull();
  });

  it("uses the hand-picked 'read next' essays with their reasons", async () => {
    withPost({ ...POST, readNext: [{ reason: "Same fight", post: thread("other-essay", "The Other Essay") }, { post: thread("third", "Third") }] });
    await renderServer(BlogPostPage(props("five-cups")));
    expect(screen.getByRole("heading", { name: "The thread continues." })).toBeInTheDocument();
    expect(screen.getByText("Same fight")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /The Other Essay/ })).toHaveAttribute("href", "/blog/other-essay");
    expect(sanityFetch).not.toHaveBeenCalledWith(expect.objectContaining({ query: relatedPostsQuery }));
  });

  it("falls back to same-category essays, labelled 'More from this collection'", async () => {
    withData(POST, { [relatedPostsQuery]: [thread("cat-essay", "Category Essay")] });
    await renderServer(BlogPostPage(props("five-cups")));
    expect(sanityFetch).toHaveBeenCalledWith(
      expect.objectContaining({ query: relatedPostsQuery, params: { slug: "five-cups", categoryId: "category-business" } }),
    );
    expect(screen.getByText("More from this collection")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Category Essay/ })).toHaveAttribute("href", "/blog/cat-essay");
    expect(sanityFetch).not.toHaveBeenCalledWith(expect.objectContaining({ query: recentPostsQuery }));
  });

  it("uses recent essays when the post has no category", async () => {
    withData({ ...POST, category: undefined }, { [recentPostsQuery]: [thread("recent", "Recent Essay")] });
    await renderServer(BlogPostPage(props("five-cups")));
    expect(sanityFetch).not.toHaveBeenCalledWith(expect.objectContaining({ query: relatedPostsQuery }));
    expect(screen.getByRole("link", { name: /Recent Essay/ })).toHaveAttribute("href", "/blog/recent");
  });

  it("links Previous and Next to the nearest neighbours in the editorial order that exist in Sanity", async () => {
    withData(POST, {
      [postsBySlugsQuery]: [
        { slug: "your-blood-lies-without-your-dna", title: "Your Blood Lies" },
        { slug: "iboga-ibogaine-the-full-paradox", title: "Iboga Paradox" },
      ],
    });
    await renderServer(BlogPostPage(props("five-cups")));
    const nav = screen.getByRole("navigation", { name: "More essays" });
    const links = [...nav.querySelectorAll("a")].map((a) => [a.textContent, a.getAttribute("href")]);
    expect(links).toEqual([
      [expect.stringContaining("Your Blood Lies"), "/blog/your-blood-lies-without-your-dna"],
      [expect.stringContaining("Iboga Paradox"), "/blog/iboga-ibogaine-the-full-paradox"],
    ]);
  });

  it("offers the updated version alongside the original when there is one", async () => {
    withPost({ ...POST, updatedBody: [block("u1", "A newer take on trust.")] });
    await renderServer(BlogPostPage(props("five-cups")));
    expect(screen.getByRole("group", { name: "Essay version" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ORIGINAL POST" })).toBeInTheDocument();
    expect(screen.getAllByText(/A newer take on trust/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Trust is poured one cup at a time/).length).toBeGreaterThan(0);
  });

  it("merges the Further Reading lists from both versions into one, without repeats", async () => {
    // Written after the legacy import, so short lines aren't turned into headings.
    withPost({
      ...POST,
      _createdAt: "2026-10-10T00:00:00Z",
      body: [block("b1", "Trust is poured one cup at a time."), block("fr", "Further Reading"), block("i1", "Essay Alpha (/blog/alpha) · the first thread")],
      updatedBody: [
        block("u1", "A newer take on trust."),
        block("ufr", "Further Reading"),
        block("u2", "Essay Alpha again (/blog/alpha) · same link"),
        block("u3", "Essay Beta (/blog/beta) · a second thread"),
      ],
    });
    await renderServer(BlogPostPage(props("five-cups")));
    expect(screen.getAllByText("Essay Alpha")).toHaveLength(1);
    expect(screen.getAllByText("Essay Beta")).toHaveLength(1);
    expect(screen.getByText("a second thread")).toBeInTheDocument();
    expect(screen.queryByText("Essay Alpha again")).toBeNull();
    expect(screen.queryByText("same link")).toBeNull();
  });

  it("renders a filled-in Q&A section and skips blank questions", async () => {
    withPost({
      ...POST,
      faq: [
        { _key: "f1", question: "Is trust poured?", answer: "Yes, one cup at a time." },
        { _key: "f2", question: "  ", answer: "Hidden" },
      ],
    });
    await renderServer(BlogPostPage(props("five-cups")));
    expect(screen.getAllByText("Questions and Answers").length).toBeGreaterThan(0);
    expect(screen.getByText("Is trust poured?")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).toBeNull();
  });

  it("counts reading time from the words (230 a minute) unless a read time is set", async () => {
    const long = Array.from({ length: 500 }, () => "word").join(" ");
    withPost({ ...POST, body: [block("l1", long)] });
    const { unmount } = await renderServer(BlogPostPage(props("five-cups")));
    expect(screen.getByText("3 min read")).toBeInTheDocument();
    unmount();
    withPost({ ...POST, readTime: 12 });
    await renderServer(BlogPostPage(props("five-cups")));
    expect(screen.getByText("12 min read")).toBeInTheDocument();
  });

  it("still renders (as a 1 minute read) when the body is missing", async () => {
    withPost({ ...POST, body: undefined });
    await renderServer(BlogPostPage(props("five-cups")));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Five Cups of Trust");
    expect(screen.getByText("1 min read")).toBeInTheDocument();
  });
});
