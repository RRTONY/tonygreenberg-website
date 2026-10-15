import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArticlesExplorer, type ArchivePost } from "@/components/blog/articles-explorer";
import { START_HERE_SLUGS } from "@/lib/content/articles-discovery";

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
});
