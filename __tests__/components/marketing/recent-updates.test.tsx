import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecentUpdates } from "@/components/marketing/recent-updates";
import type { RecentUpdatePost } from "@/lib/content/recent-updates";

const POSTS: RecentUpdatePost[] = [
  { _id: "1", title: "Capital One", slug: "cap-one", publishedAt: "2026-09-01T12:00:00Z", excerpt: "Money", category: { title: "Business & Capital", slug: "business-capital" } },
  { _id: "2", title: "AI Two", slug: "ai-two", category: { title: "Enterprise Technology & AI", slug: "enterprise-technology-ai" } },
  { _id: "3", title: "Capital Three", slug: "cap-three", category: { title: "Business & Capital", slug: "business-capital" } },
  { _id: "4", title: "Fourth", slug: "fourth" },
];

describe("RecentUpdates", () => {
  it("shows at most three essays with links, starting on All Categories", () => {
    render(<RecentUpdates posts={POSTS} />);
    expect(screen.getByRole("heading", { level: 2, name: "Recent Updates" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All Categories" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByRole("link", { name: /Capital One/ })).toHaveAttribute("href", "/blog/cap-one");
  });

  it("filters by topic", async () => {
    const user = userEvent.setup();
    render(<RecentUpdates posts={POSTS} />);
    await user.click(screen.getByRole("button", { name: "Business & Capital" }));
    expect(screen.getByRole("button", { name: "Business & Capital" })).toHaveAttribute("aria-pressed", "true");
    const titles = screen.getAllByRole("article").map((a) => within(a).getByRole("heading").textContent);
    expect(titles).toEqual(["Capital One", "Capital Three"]);
  });

  it("says when a topic has no essays", async () => {
    render(<RecentUpdates posts={POSTS} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Psychedelic Medicine" }));
    expect(screen.getByText("No essays in this topic yet.")).toBeInTheDocument();
  });
});
