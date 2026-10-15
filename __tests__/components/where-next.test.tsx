import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { WhereNext } from "@/components/where-next";
import { navigation } from "@tests/helpers/next";

describe("WhereNext", () => {
  it("shows the page's own suggestions plus Home, Site Index and All Assessments", () => {
    navigation.pathname = "/blog";
    render(<WhereNext />);
    const nav = screen.getByRole("navigation", { name: "Keep going" });
    expect(within(nav).getByRole("link", { name: /Series/ })).toHaveAttribute("href", "/series");
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(nav).getByRole("link", { name: "Site Index" })).toHaveAttribute("href", "/the-index");
    expect(within(nav).getByRole("link", { name: "All Assessments" })).toHaveAttribute("href", "/find-my");
  });

  it("falls back to the default suggestions and never links to the current page", () => {
    navigation.pathname = "/the-letter";
    render(<WhereNext />);
    const cards = within(screen.getByRole("list")).getAllByRole("link");
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThanOrEqual(3);
    for (const c of cards) expect(c).not.toHaveAttribute("href", "/the-letter");
  });

  it.each(["/find-my", "/find-your-me/x", "/discover"])("is hidden on %s", (path) => {
    navigation.pathname = path;
    const { container } = render(<WhereNext />);
    expect(container).toBeEmptyDOMElement();
  });
});
