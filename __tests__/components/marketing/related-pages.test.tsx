import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { RelatedPages } from "@/components/marketing/related-pages";
import { RELATED_PAGES } from "@/lib/content/related-pages";

describe("RelatedPages", () => {
  it("renders nothing for a path with no entry", () => {
    const { container } = render(<RelatedPages path="/no-such-page" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists the three related pages for /amplifier with their links", () => {
    render(<RelatedPages path="/amplifier" />);
    const section = screen.getByRole("region", { name: "Related" });
    const links = within(section).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(RELATED_PAGES["/amplifier"].map((p) => p.href));
    expect(section).toHaveTextContent(RELATED_PAGES["/amplifier"][0].title);
  });

  it("dark tone uses the dark band and accepts extra classes", () => {
    render(<RelatedPages path="/amplifier" tone="dark" className="mt-20" />);
    const section = screen.getByRole("region", { name: "Related" });
    expect(section).toHaveClass("bg-[#0A0A10]", "mt-20");
  });
});
