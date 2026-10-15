import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostCard } from "@/components/blog/post-card";

const base = { _id: "1", title: "Five Cups", slug: { current: "five-cups" }, publishedAt: "2025-03-14T18:30:00Z" };

describe("PostCard", () => {
  it("links the title to the essay with an h3 by default and shows date and read time", () => {
    render(<PostCard post={{ ...base, readTime: 7, subtitle: "A coffee essay" }} />);
    const heading = screen.getByRole("heading", { level: 3, name: "Five Cups" });
    expect(heading.querySelector("a")).toHaveAttribute("href", "/blog/five-cups");
    expect(screen.getByText("7 min read")).toBeInTheDocument();
    expect(screen.getByText("A coffee essay")).toBeInTheDocument();
    expect(screen.getByText("March 15, 2025")).toBeInTheDocument();
  });

  it("uses h2 when asked and links the category", () => {
    render(<PostCard headingLevel="h2" post={{ ...base, category: { title: "Coffee", slug: { current: "coffee" } } }} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Coffee" })).toHaveAttribute("href", "/blog/category/coffee");
  });

  it("hides the image link from assistive tech and uses the default image when there is none", () => {
    const { container } = render(<PostCard post={base} />);
    const imageLink = container.querySelector('a[aria-hidden="true"]')!;
    expect(imageLink).toHaveAttribute("tabindex", "-1");
    const img = imageLink.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "");
    expect(img.getAttribute("src")).not.toMatch(/manuscdn|manus-storage|\/api\/img\//);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("loads the image eagerly only when asked", () => {
    const { container, rerender } = render(<PostCard post={base} eager />);
    expect(container.querySelector("img")).toHaveAttribute("loading", "eager");
    rerender(<PostCard post={base} />);
    expect(container.querySelector("img")).not.toHaveAttribute("loading");
  });

  it("links a redirected essay straight to its destination", () => {
    render(<PostCard post={{ ...base, slug: { current: "akbar-cuisine-restoration-economics" } }} />);
    expect(screen.getByRole("link", { name: "Five Cups" })).toHaveAttribute("href", "/akbar");
  });
});
