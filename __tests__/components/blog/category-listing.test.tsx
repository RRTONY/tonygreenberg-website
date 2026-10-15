import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import { CategoryListing, categoryMetadata, categoryPageHref } from "@/components/blog/category-listing";
import { sanityFetch } from "@/lib/sanity/client";
import { categoryBySlugQuery, postCountByCategoryQuery } from "@/lib/sanity/queries";

const fetchMock = vi.mocked(sanityFetch);

function setup({ category = { title: "Tech" } as { title: string } | null, total = 30, posts = 12 } = {}) {
  fetchMock.mockImplementation((async ({ query }: { query: string }) => {
    if (query === categoryBySlugQuery) return category;
    if (query === postCountByCategoryQuery) return total;
    return Array.from({ length: posts }, (_, i) => ({
      _id: `p${i}`,
      title: `Post ${i}`,
      slug: { current: `post-${i}` },
      publishedAt: "2025-01-01T00:00:00Z",
    }));
  }) as never);
}

describe("categoryPageHref", () => {
  it("uses the bare path for page 1 and /page/N after", () => {
    expect(categoryPageHref("tech", 1)).toBe("/blog/category/tech");
    expect(categoryPageHref("tech", 3)).toBe("/blog/category/tech/page/3");
  });
});

describe("categoryMetadata", () => {
  beforeEach(() => {
    setup();
  });

  it("titles later pages and self-canonicals", async () => {
    const meta = await categoryMetadata("tech", 2);
    expect(meta.title).toBe("Tech — Page 2");
    expect(meta.description).toBe("Essays filed under Tech.");
    expect(meta.alternates?.canonical).toBe("/blog/category/tech/page/2");
    expect(meta.robots).toBeUndefined();
  });

  it("noindexes a thin category and handles a missing one", async () => {
    setup({ total: 2 });
    expect((await categoryMetadata("tech", 1)).robots).toEqual({ index: false, follow: true });
    setup({ category: null });
    expect(await categoryMetadata("nope", 1)).toEqual({ title: "Page not found" });
  });
});

describe("CategoryListing", () => {
  beforeEach(() => {
    setup();
  });

  it("renders the heading, the page's posts and the pager", async () => {
    await renderServer(CategoryListing({ slug: "tech", page: 2 }));
    expect(screen.getByRole("heading", { level: 1, name: "Tech" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute("href", "/blog/category/tech");
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/blog/category/tech/page/3");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({ params: { categorySlug: "tech", start: 12, end: 24 } }),
    );
  });

  it("shows the empty message and no pager for a category with no posts", async () => {
    setup({ total: 0, posts: 0 });
    await renderServer(CategoryListing({ slug: "tech", page: 1 }));
    expect(screen.getByText("No posts in this category yet.")).toBeInTheDocument();
    expect(screen.queryByText(/Page 1 of/)).not.toBeInTheDocument();
  });

  it("404s for an unknown category or a page past the end", async () => {
    setup({ category: null });
    await expect(CategoryListing({ slug: "nope", page: 1 })).rejects.toThrow("NEXT_NOT_FOUND");
    setup({ total: 30 });
    await expect(CategoryListing({ slug: "tech", page: 4 })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
