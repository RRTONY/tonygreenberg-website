import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImpactFuturismExplorer, type FuturismPost } from "@/components/blog/impact-futurism-explorer";
import { FEATURED_COUNT, IMPACT_FUTURISM_ENTRIES } from "@/lib/content/impact-futurism";

// One published post per curated entry, plus one that isn't curated.
const posts: FuturismPost[] = [
  ...IMPACT_FUTURISM_ENTRIES.map((e, i) => ({ _id: `p${i}`, title: `Title ${i}`, slug: e.slug, publishedAt: "2025-03-15T00:00:00Z", readTime: 6 })),
  { _id: "x", title: "Uncurated", slug: "uncurated", publishedAt: "2025-01-01T00:00:00Z" },
];

describe("ImpactFuturismExplorer", () => {
  it("features the first entries and lists every curated, published one", () => {
    render(<ImpactFuturismExplorer posts={posts} />);
    expect(screen.getByRole("heading", { level: 1, name: "Impact Futurism" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 }).filter((h) => h.textContent?.startsWith("Title"))).toHaveLength(FEATURED_COUNT);
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(IMPACT_FUTURISM_ENTRIES.length);
    expect(screen.queryByText("Uncurated")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: `All ${posts.length} Essays` })).toHaveAttribute("href", "/articles");
    expect(screen.getAllByText(/6 min read/)).toHaveLength(FEATURED_COUNT);
  });

  it("skips entries whose essay isn't published", () => {
    render(<ImpactFuturismExplorer posts={posts.slice(1, 2)} />);
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(1);
  });

  it("the tag filter narrows the list to that tag", async () => {
    const user = userEvent.setup();
    render(<ImpactFuturismExplorer posts={posts} />);
    await user.click(screen.getByRole("button", { name: "Infrastructure" }));
    const expected = IMPACT_FUTURISM_ENTRIES.filter((e) => e.tag === "Infrastructure").length;
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(expected);
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(IMPACT_FUTURISM_ENTRIES.length);
  });

  it("links every card to its essay", () => {
    render(<ImpactFuturismExplorer posts={posts} />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const e of IMPACT_FUTURISM_ENTRIES) expect(hrefs).toContain(`/blog/${e.slug}`);
  });
});
