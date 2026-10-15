import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EssaysList } from "@/components/blog/essays-list";

const posts = [
  { _id: "1", title: "Grid Systems", slug: "grid", excerpt: "Energy", category: { title: "Systems & Innovation", slug: "si" } },
  { _id: "2", title: "Fraud Watch", slug: "fraud", category: { title: "The Crusades", slug: "cr" } },
  { _id: "3", title: "Capital Moves", slug: "capital", category: { title: "Business & Capital", slug: "bc" } },
  { _id: "4", title: "Loose Thought", slug: "loose" },
];

const shown = () => screen.queryAllByRole("link").map((a) => a.getAttribute("href"));

describe("EssaysList", () => {
  it("shows every essay with the count and sorted category buttons", () => {
    render(<EssaysList posts={posts} />);
    expect(screen.getByText("4 essays")).toBeInTheDocument();
    expect(shown()).toEqual(["/blog/grid", "/blog/fraud", "/blog/capital", "/blog/loose"]);
    const cats = ["All Categories", "Business & Capital", "Systems & Innovation", "The Crusades"];
    for (const c of cats) expect(screen.getByRole("button", { name: c })).toBeInTheDocument();
  });

  it("the archetype filter keeps only that path's categories", async () => {
    const user = userEvent.setup();
    render(<EssaysList posts={posts} />);
    await user.click(screen.getByRole("button", { name: "Builder" }));
    expect(shown()).toEqual(["/blog/grid", "/blog/capital"]);
    await user.click(screen.getByRole("button", { name: "Crusader" }));
    expect(shown()).toEqual(["/blog/fraud"]);
    expect(screen.getByText("1 essay")).toBeInTheDocument();
  });

  it("combines category and search, and shows the empty state", async () => {
    const user = userEvent.setup();
    render(<EssaysList posts={posts} />);
    await user.click(screen.getByRole("button", { name: "Systems & Innovation" }));
    expect(shown()).toEqual(["/blog/grid"]);
    await user.type(screen.getByPlaceholderText("Search essays..."), "energy");
    expect(shown()).toEqual(["/blog/grid"]);
    await user.type(screen.getByPlaceholderText("Search essays..."), "zzz");
    expect(screen.getByText("No essays match your filters.")).toBeInTheDocument();
    expect(screen.getByText("0 essays")).toBeInTheDocument();
  });
});
