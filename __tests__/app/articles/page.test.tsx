import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import ArticlesPage, { metadata } from "@/app/articles/page";

const POSTS = [
  { _id: "a", title: "Only Time Buys Trust", slug: "only-time-buys-trust", publishedAt: "2024-05-01", excerpt: "Trust is earned slowly.", category: { title: "Business & Capital", slug: "business-capital" } },
  { _id: "b", title: "Energy as Impact", slug: "energy-as-impact", publishedAt: "2024-04-01", category: { title: "Psychedelic Medicine", slug: "psychedelic-medicine" } },
];

describe("/articles", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockResolvedValue(POSTS);
  });

  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("All Articles");
    expect(metadata.description).toMatch(/Complete archive of Tony Greenberg's published essays/);
    expect(metadata.alternates?.canonical).toBe("/articles");
  });

  it("reads every post from Sanity, tagged so a publish refreshes it", async () => {
    await renderServer(ArticlesPage());
    expect(sanityFetch).toHaveBeenCalledWith({ query: allPostsForArchiveQuery, tags: ["post"] });
  });

  it("renders one H1 and the live essay count", async () => {
    const { container } = await renderServer(ArticlesPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("All Articles");
    expect(container).toHaveTextContent("2 essays on enterprise technology, psychedelic medicine");
    expect(container).toHaveTextContent("Complete Archive");
  });

  it("lists the posts grouped by category and ends with the subscribe link", async () => {
    const { container } = await renderServer(ArticlesPage());
    expect(container).toHaveTextContent("Only Time Buys Trust");
    expect(container).toHaveTextContent("Energy as Impact");
    expect(container).toHaveTextContent("Psychedelic Medicine");
    expect(screen.getByRole("link", { name: "Subscribe" })).toHaveAttribute("href", "/subscribe");
    expect(container).toHaveTextContent("New essays every week. Subscribe to get them first.");
  });
});
