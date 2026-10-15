import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArticleToc } from "@/components/blog/article-toc";

const headings = [
  { id: "one", text: "One", level: 2 as const },
  { id: "two", text: "Two", level: 2 as const },
  { id: "three", text: "Three", level: 3 as const },
];

describe("ArticleToc", () => {
  it("renders nothing for fewer than three headings", () => {
    const { container } = render(<ArticleToc headings={headings.slice(0, 2)} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists every heading as an anchor link", () => {
    render(<ArticleToc headings={headings} />);
    const nav = screen.getByRole("navigation", { name: "Contents" });
    expect(nav).toBeInTheDocument();
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["#one", "#two", "#three"]);
  });

  it("scrolls smoothly to the heading on click and updates the address", async () => {
    const target = document.createElement("h2");
    target.id = "two";
    document.body.appendChild(target);
    const user = userEvent.setup();
    render(<ArticleToc headings={headings} />);
    await user.click(screen.getByRole("link", { name: "Two" }));
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(window.location.hash).toBe("#two");
    target.remove();
  });

  it("marks the last heading above the reading line as the current one", async () => {
    const els = headings.map(({ id }, i) => {
      const el = document.createElement("h2");
      el.id = id;
      el.getBoundingClientRect = () => ({ top: i < 2 ? 50 : 900 }) as DOMRect;
      document.body.appendChild(el);
      return el;
    });
    render(<ArticleToc headings={headings} />);
    window.dispatchEvent(new Event("scroll"));
    await new Promise((r) => setTimeout(r, 200));
    expect(await screen.findByRole("link", { name: "Two" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "One" })).not.toHaveAttribute("aria-current");
    els.forEach((el) => el.remove());
  });
});
