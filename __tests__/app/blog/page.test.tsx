import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import BlogPage, { metadata } from "@/app/blog/page";
import { sanityFetch } from "@/lib/sanity/client";
import { getMostRead } from "@/lib/content/most-read";

// Google Analytics is replaced: Most Read gets an empty list.
vi.mock("@/lib/content/most-read", () => ({ getMostRead: vi.fn() }));

const posts = [
  { _id: "1", title: "Five Cups of Trust", slug: "five-cups", publishedAt: "2026-01-01", excerpt: "Trust.", category: { title: "Business", slug: "business" } },
  { _id: "2", title: "The Index", slug: "the-index", publishedAt: "2026-02-01", excerpt: "Signals.", category: { title: "AI", slug: "ai" } },
];

describe("/blog", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Essays");
    expect(metadata.description).toMatch(/twenty-five years/);
    expect(metadata.alternates?.canonical).toBe("/blog");
  });

  it("renders one H1, the essay count and the essays from Sanity", async () => {
    vi.mocked(getMostRead).mockResolvedValue({ posts: [], fromAnalytics: false } as never);
    vi.mocked(sanityFetch).mockResolvedValue(posts as never);
    await renderServer(BlogPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Essays");
    expect(screen.getByText("2 Essays")).toBeInTheDocument();
    expect(screen.getAllByText("Five Cups of Trust").length).toBeGreaterThan(0);
    expect(sanityFetch).toHaveBeenCalledWith(expect.objectContaining({ tags: ["post"] }));
    expect(getMostRead).toHaveBeenCalledWith(posts);
  });
});
