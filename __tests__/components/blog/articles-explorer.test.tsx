import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArticlesExplorer, type ArchivePost } from "@/components/blog/articles-explorer";
import {
  CHANGED_MIND_SLUGS,
  CONTRARIAN_SLUGS,
  DEEP_DIVE_SLUGS,
  SHORT_READ_SLUGS,
  START_HERE_SLUGS,
} from "@/lib/content/articles-discovery";

const posts: ArchivePost[] = [
  { _id: "1", title: "Healing as Extraction", slug: START_HERE_SLUGS[0], publishedAt: "2025-01-01", category: { title: "Psychedelic Medicine", slug: "pm" } },
  { _id: "2", title: "Iboga Notes", slug: "iboga-notes", publishedAt: "2025-02-01", tags: ["ibogaine"], category: { title: "Psychedelic Medicine", slug: "pm" } },
  { _id: "3", title: "Grid Thinking", slug: "grid-thinking", publishedAt: "2025-03-01", excerpt: "Energy systems", category: { title: "Systems & Innovation", slug: "si" } },
  { _id: "4", title: "No Category", slug: "no-cat", publishedAt: "2025-04-01" },
];

const links = () => screen.queryAllByRole("link").map((a) => a.textContent);

describe("ArticlesExplorer", () => {
  it("groups essays under their categories with counts by default", () => {
    render(<ArticlesExplorer posts={posts} />);
    expect(screen.getByRole("heading", { name: "Psychedelic Medicine" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Systems & Innovation" })).toBeInTheDocument();
    expect(screen.getByText("2 essays")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All (4)" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Iboga Notes" })).toHaveAttribute("href", "/blog/iboga-notes");
  });

  it("search matches title, excerpt and tags, and shows the result count", async () => {
    const user = userEvent.setup();
    render(<ArticlesExplorer posts={posts} />);
    await user.type(screen.getByPlaceholderText(/search articles/i), "energy");
    expect(links()).toEqual(["Grid Thinking"]);
    expect(screen.getByText('1 result for "energy"')).toBeInTheDocument();
    await user.clear(screen.getByPlaceholderText(/search articles/i));
    await user.type(screen.getByPlaceholderText(/search articles/i), "ibogaine");
    expect(links()).toEqual(["Iboga Notes"]);
    await user.clear(screen.getByPlaceholderText(/search articles/i));
    await user.type(screen.getByPlaceholderText(/search articles/i), "xyz");
    expect(screen.getByText('0 results for "xyz"')).toBeInTheDocument();
  });

  it("a category tab narrows the list", async () => {
    const user = userEvent.setup();
    render(<ArticlesExplorer posts={posts} />);
    await user.click(screen.getByRole("button", { name: "Systems & Innovation" }));
    expect(links()).toEqual(["Grid Thinking"]);
    expect(screen.getByText("1 result in Systems & Innovation")).toBeInTheDocument();
  });

  it("'Start Here' shows only the foundational essays with its intro", async () => {
    const user = userEvent.setup();
    render(<ArticlesExplorer posts={posts} />);
    await user.click(screen.getByRole("button", { name: /start here/i }));
    expect(links()).toEqual(["Healing as Extraction"]);
    expect(screen.getByText("1 essays")).toBeInTheDocument();
    expect(screen.getByText(/Seven essays that reveal the worldview/)).toBeInTheDocument();
  });

  it("'Surprise Me' shows up to seven essays and can shuffle again", async () => {
    const user = userEvent.setup();
    render(<ArticlesExplorer posts={posts} />);
    await user.click(screen.getByRole("button", { name: /surprise me/i }));
    expect(links()).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: /shuffle again/i }));
    expect(links().sort()).toEqual(posts.map((p) => p.title).sort());
  });

  describe("the other discovery modes pick their essays from the curated slug lists", () => {
    // One post on each list (plus one on none), titled after the list.
    const curated: ArchivePost[] = [
      { _id: "c", title: "Contrarian Pick", slug: CONTRARIAN_SLUGS.find((s) => !CHANGED_MIND_SLUGS.includes(s) && !SHORT_READ_SLUGS.includes(s) && !DEEP_DIVE_SLUGS.includes(s))!, publishedAt: "2025-01-01" },
      { _id: "m", title: "Changed Mind Pick", slug: CHANGED_MIND_SLUGS.find((s) => !CONTRARIAN_SLUGS.includes(s) && !SHORT_READ_SLUGS.includes(s) && !DEEP_DIVE_SLUGS.includes(s))!, publishedAt: "2025-01-02" },
      { _id: "s", title: "Short Pick", slug: SHORT_READ_SLUGS.find((s) => !CONTRARIAN_SLUGS.includes(s) && !CHANGED_MIND_SLUGS.includes(s) && !DEEP_DIVE_SLUGS.includes(s))!, publishedAt: "2025-01-03" },
      { _id: "d", title: "Deep Pick", slug: DEEP_DIVE_SLUGS.find((s) => !CONTRARIAN_SLUGS.includes(s) && !CHANGED_MIND_SLUGS.includes(s) && !SHORT_READ_SLUGS.includes(s))!, publishedAt: "2025-01-04" },
      { _id: "n", title: "Uncurated", slug: "uncurated", publishedAt: "2025-01-05" },
    ];

    it.each([
      [/^contrarian/i, "Contrarian Pick", /Essays that argue against the consensus/],
      [/^changed his mind/i, "Changed Mind Pick", /publicly updated his position/],
      [/^short reads/i, "Short Pick", null],
      [/^deep dives/i, "Deep Pick", null],
    ])("mode %s shows only its essay", async (mode, title, intro) => {
      const user = userEvent.setup();
      render(<ArticlesExplorer posts={curated} />);
      await user.click(screen.getByRole("button", { name: mode }));
      expect(links()).toEqual([title]);
      expect(screen.getByText("1 essays")).toBeInTheDocument();
      if (intro) expect(screen.getByText(intro)).toBeInTheDocument();
      // Category tabs are hidden while a mode is on.
      expect(screen.getByRole("button", { name: "All (5)", hidden: true }).parentElement!.parentElement).toHaveClass("hidden");
    });

    it("switching modes clears the search and going back to All restores the grouped view", async () => {
      const user = userEvent.setup();
      render(<ArticlesExplorer posts={posts} />);
      const box = screen.getByPlaceholderText(/search articles/i);
      await user.type(box, "grid");
      await user.click(screen.getByRole("button", { name: /^contrarian/i }));
      expect(box).toHaveValue("");
      await user.click(screen.getByRole("button", { name: /^all essays/i }));
      expect(screen.getByRole("heading", { name: "Psychedelic Medicine" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^all essays/i })).toHaveClass("bg-brand-gold");
    });
  });
});
