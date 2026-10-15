import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReturningVisitorHero } from "@/components/marketing/returning-visitor-hero";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

describe("ReturningVisitorHero", () => {
  it("shows nothing for a new visitor", () => {
    const { container } = render(<ReturningVisitorHero />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows nothing before the third visit", () => {
    setCookie("tg_visit_count", "2");
    const { container } = render(<ReturningVisitorHero />);
    expect(container).toBeEmptyDOMElement();
  });

  it("welcomes a returning visitor back to their last essay", () => {
    setCookie("tg_visit_count", "3");
    setCookie("tg_last_blog_slug", "five-cups");
    setCookie("tg_last_blog_title", "Five Cups of Coffee and a Very Long Title Indeed");
    render(<ReturningVisitorHero />);
    expect(screen.getByText("Welcome back.")).toBeInTheDocument();
    const cont = screen.getByRole("link", { name: /Continue:/ });
    expect(cont).toHaveAttribute("href", "/blog/five-cups");
    expect(cont).toHaveTextContent("Continue: Five Cups of Coffee and a Very…");
    expect(screen.getByRole("link", { name: /Pick up where you left off/ })).toHaveAttribute("href", "/find-my");
  });
});
