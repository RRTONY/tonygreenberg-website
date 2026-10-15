import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThesisThreadsExplorer } from "@/components/blog/thesis-threads-explorer";
import { NEVER_USE, RESEARCH_LIBRARY, THESIS_THREADS } from "@/lib/content/thesis-threads";

const [first, second] = THESIS_THREADS;
const posts = [
  { _id: "a", title: "Mapped A", slug: first.articleSlugs[0], publishedAt: "2025-01-01T00:00:00Z" },
  { _id: "b", title: "Mapped B", slug: second.articleSlugs[0], publishedAt: "2025-01-01T00:00:00Z" },
  ...Array.from({ length: 22 }, (_, i) => ({ _id: `u${i}`, title: `Loose ${i}`, slug: `loose-${i}`, publishedAt: "2025-01-01T00:00:00Z" })),
];

describe("ThesisThreadsExplorer", () => {
  it("shows the counts in the hero", () => {
    render(<ThesisThreadsExplorer posts={posts} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Thesis Threads");
    const stat = (label: string) => screen.getByText(label, { selector: "div" }).previousElementSibling?.textContent;
    expect(stat("Essays")).toBe("24");
    expect(stat("Mapped")).toBe("2");
    expect(stat("Unmapped")).toBe("22");
    expect(stat("Citations")).toBe(String(RESEARCH_LIBRARY.length));
  });

  it("opens on the first thread and switches threads on click", async () => {
    const user = userEvent.setup();
    render(<ThesisThreadsExplorer posts={posts} />);
    expect(screen.getByRole("heading", { level: 2, name: first.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /mapped a/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: new RegExp(second.title) }));
    expect(screen.getByRole("heading", { level: 2, name: second.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /mapped b/i })).toHaveAttribute("href", `/blog/${second.articleSlugs[0]}`);
  });

  it("lists up to 20 unmapped essays and counts the rest", () => {
    render(<ThesisThreadsExplorer posts={posts} />);
    expect(screen.getByRole("heading", { name: "Unmapped Articles (22)" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /loose/i })).toHaveLength(20);
    expect(screen.getByText("+ 2 more unmapped articles")).toBeInTheDocument();
  });

  it("says when a thread has no published essays", async () => {
    const user = userEvent.setup();
    render(<ThesisThreadsExplorer posts={[]} />);
    expect(screen.getByText("No articles mapped to this thread yet.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Content Rules" }));
    expect(screen.getByText(NEVER_USE[0])).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Research Library" }));
    expect(screen.getByRole("heading", { name: "LP Comparables" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Section Map" }));
    expect(screen.getByRole("heading", { name: "Tech Section" })).toBeInTheDocument();
  });
});
