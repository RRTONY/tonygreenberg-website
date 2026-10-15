import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { PostClosing, PostCtas, ThreadContinues } from "@/components/blog/post-closing";

describe("PostCtas", () => {
  it("links to the assessments and ImpactSoul", () => {
    render(<PostCtas />);
    expect(screen.getByRole("link", { name: "Start Assessment" })).toHaveAttribute("href", "/find-my");
    expect(screen.getByRole("link", { name: "Explore ImpactSoul" })).toHaveAttribute("target", "_blank");
  });
});

describe("PostClosing", () => {
  it("shows the original URL and previous/next links", () => {
    render(
      <PostClosing
        originalUrl="https://old.example/post"
        prev={{ slug: "akbar-cuisine-restoration-economics", title: "Akbar" }}
        next={{ slug: "next-one", title: "Next One" }}
      />,
    );
    expect(screen.getByRole("link", { name: "tonygreenberg.com" })).toHaveAttribute("href", "https://old.example/post");
    const nav = screen.getByRole("navigation", { name: "More essays" });
    expect(within(nav).getByRole("link", { name: /previous\s*akbar/i })).toHaveAttribute("href", "/akbar");
    expect(within(nav).getByRole("link", { name: /next\s*next one/i })).toHaveAttribute("href", "/blog/next-one");
  });

  it("leaves out the nav and original link when there are none", () => {
    render(<PostClosing prev={null} next={null} />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByText(/originally published/i)).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Tony Greenberg" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Subscribe free" })).toHaveAttribute("href", "/subscribe");
  });
});

describe("ThreadContinues", () => {
  it("renders nothing without posts", () => {
    const { container } = render(<ThreadContinues posts={[]} reasons={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("numbers each pick, shows its reason and trims long excerpts", () => {
    const long = "x".repeat(120);
    render(
      <ThreadContinues
        posts={[
          { _id: "a", title: "First", slug: { current: "first" }, excerpt: long, formatTag: "Essay", categoryTitle: "Tech" },
          { _id: "b", title: "Second", slug: { current: "second" }, excerpt: "short" },
        ]}
        reasons={{ first: "Because you liked this" }}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "The thread continues." })).toBeInTheDocument();
    const [first, second] = screen.getAllByRole("link");
    expect(first).toHaveAttribute("href", "/blog/first");
    expect(first).toHaveTextContent("01");
    expect(first).toHaveTextContent("Because you liked this");
    expect(first).toHaveTextContent(`${"x".repeat(100)}…`);
    expect(second).toHaveTextContent("02");
    expect(second).toHaveTextContent("short");
    for (const img of screen.getAllByRole("presentation")) expect(img).toHaveAttribute("alt", "");
  });
});
