import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import { postHref } from "@/lib/content/post-redirects";
import ImpactFuturismPage, { metadata } from "@/app/impact-futurism/page";

const POSTS = [
  { _id: "p1", title: "Your Blood Lies Without Your DNA", slug: "your-blood-lies-without-your-dna", publishedAt: "2025-03-01", readTime: 7 },
  { _id: "p2", title: "Energy Is Money, Money Is Memory", slug: "energy-is-money-money-is-memory", publishedAt: "2025-02-01" },
  { _id: "p3", title: "An Unrelated Essay", slug: "an-unrelated-essay", publishedAt: "2025-01-01" },
];

describe("/impact-futurism", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockResolvedValue(POSTS);
  });

  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Impact Futurism");
    expect(metadata.description).toMatch(/Essays on broken systems and what comes next/);
    expect(metadata.alternates?.canonical).toBe("/impact-futurism");
  });

  it("reads every post from Sanity, tagged so a publish refreshes it", async () => {
    await renderServer(ImpactFuturismPage());
    expect(sanityFetch).toHaveBeenCalledWith({ query: allPostsForArchiveQuery, tags: ["post"] });
  });

  it("renders one H1, the real hero copy and the live essay count", async () => {
    const { container } = await renderServer(ImpactFuturismPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Impact Futurism");
    expect(container).toHaveTextContent("The systems that run your health, your money, and your future are broken.");
    expect(screen.getByRole("link", { name: "All 3 Essays" })).toHaveAttribute("href", "/articles");
    expect(screen.getByRole("link", { name: "Get the Dispatch" })).toHaveAttribute("href", "/blog");
  });

  it("shows only the curated essays, linked to their posts", async () => {
    await renderServer(ImpactFuturismPage());
    const curated = screen.getAllByRole("link").filter((a) => a.getAttribute("href") === postHref("your-blood-lies-without-your-dna"));
    expect(curated.length).toBeGreaterThan(0);
    expect(screen.queryByText("An Unrelated Essay")).not.toBeInTheDocument();
  });
});
