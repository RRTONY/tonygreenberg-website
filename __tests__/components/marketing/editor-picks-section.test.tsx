import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import { EditorPicksSection } from "@/components/marketing/editor-picks-section";
import { sanityFetch } from "@/lib/sanity/client";
import { EDITOR_PICK_SLUGS } from "@/lib/content/editor-picks";

const post = (slug: string, extra = {}) => ({ title: `Title ${slug}`, slug, ...extra });

describe("EditorPicksSection", () => {
  it("renders nothing when none of the picks exist", async () => {
    const { container } = await renderServer(EditorPicksSection());
    expect(container).toBeEmptyDOMElement();
  });

  it("asks Sanity for the pick slugs and shows them in the editor's order", async () => {
    const [a, b, c] = EDITOR_PICK_SLUGS;
    vi.mocked(sanityFetch).mockResolvedValue([post(c), post(a, { readTime: 7, excerpt: "Lead excerpt" }), post(b)]);
    await renderServer(EditorPicksSection());
    expect(sanityFetch).toHaveBeenCalledWith(expect.objectContaining({ params: { slugs: EDITOR_PICK_SLUGS }, tags: ["post"] }));
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Editor's Picks");
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual([`Title ${a}`, `Title ${b}`, `Title ${c}`]);
    expect(screen.getByText("7 min read")).toBeInTheDocument();
    expect(screen.getByText("Lead excerpt")).toBeInTheDocument();
  });

  it("links each card to its essay", async () => {
    const [a] = EDITOR_PICK_SLUGS;
    vi.mocked(sanityFetch).mockResolvedValue([post(a)]);
    await renderServer(EditorPicksSection());
    expect(screen.getByRole("link", { name: new RegExp(`Title ${a}`) }).getAttribute("href")).toMatch(/^\//);
  });
});
