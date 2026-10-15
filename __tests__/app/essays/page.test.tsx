import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import { POST_ORDER } from "@/lib/content/post-order";
import EssaysPage, { metadata } from "@/app/essays/page";

const [FIRST, SECOND] = POST_ORDER;
// Sanity returns newest first; SECOND is "newer" here than FIRST on purpose.
const POSTS = [
  { _id: "n", title: "A Brand New Essay", slug: "a-brand-new-essay-not-in-the-list", publishedAt: "2026-10-01" },
  { _id: "2", title: "Second In Editorial Order", slug: SECOND, publishedAt: "2025-01-02" },
  { _id: "1", title: "First In Editorial Order", slug: FIRST, publishedAt: "2020-01-01" },
];

describe("/essays", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockResolvedValue(POSTS);
  });
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Essays");
    expect(metadata.description).toMatch(/enterprise technology, psychedelic medicine, regenerative capital/);
    expect(metadata.alternates?.canonical).toBe("/essays");
  });

  it("renders one H1, the live count and the authority strip", async () => {
    const { container } = await renderServer(EssaysPage());
    expect(sanityFetch).toHaveBeenCalledWith({ query: allPostsForArchiveQuery, tags: ["post"] });
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Essays");
    expect(container).toHaveTextContent("3 essays · 15 years · Zero algorithm");
    expect(container).toHaveTextContent("Harvard H+");
  });

  it("puts essays newer than the editorial list first, then follows the editorial order", async () => {
    const { container } = await renderServer(EssaysPage());
    const text = container.textContent ?? "";
    const iNew = text.indexOf("A Brand New Essay");
    const i1 = text.indexOf("First In Editorial Order");
    const i2 = text.indexOf("Second In Editorial Order");
    expect(iNew).toBeGreaterThanOrEqual(0);
    expect(iNew).toBeLessThan(i1);
    expect(i1).toBeLessThan(i2);
  });
});
