import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import { sanityFetch } from "@/lib/sanity/client";
import { postsBySlugsQuery } from "@/lib/sanity/queries";
import { ALL_ARTICLE_SLUGS } from "@/lib/content/find-your-me";
import FindYourMePage, { metadata } from "@/app/find-your-me/page";

describe("/find-your-me", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockResolvedValue([{ slug: ALL_ARTICLE_SLUGS[0], title: "A Real Essay Title" }]);
  });

  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find My to Find Your We");
    expect(metadata.description).toMatch(/five-question mirror/);
    expect(metadata.alternates?.canonical).toBe("/find-your-me");
  });

  it("looks up the titles of every essay the archetypes can recommend", async () => {
    await renderServer(FindYourMePage());
    expect(sanityFetch).toHaveBeenCalledWith({
      query: postsBySlugsQuery,
      params: { slugs: ALL_ARTICLE_SLUGS },
      tags: ["post"],
    });
  });

  it("renders one H1 and the real intro copy", async () => {
    const { container } = await renderServer(FindYourMePage());
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Find Your Me");
    expect(container).toHaveTextContent("Five Questions. No Escape Hatch.");
    expect(container).toHaveTextContent("The word your contains our.");
    expect(screen.getByRole("button", { name: "Show Me What I Already Know" })).toBeInTheDocument();
  });

  it("links to the other assessments in the ecosystem", async () => {
    await renderServer(FindYourMePage());
    expect(screen.getAllByRole("link", { name: "Find Your Mirror" })[0]).toHaveAttribute("href", "/the-mirror");
    expect(screen.getAllByRole("link", { name: "Find Your Purpose" })[0]).toHaveAttribute("href", "/dharma-finder");
    expect(screen.getAllByRole("link", { name: "Find Your Score" })[0]).toHaveAttribute("href", "/grant-study");
  });
});
