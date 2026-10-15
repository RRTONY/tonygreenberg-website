import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HumanosFooter } from "@/components/humanos/humanos-footer";

describe("HumanosFooter", () => {
  it("links every system page and a way back to the main site", () => {
    render(<HumanosFooter />);
    const href = (name: string | RegExp) => screen.getByRole("link", { name }).getAttribute("href");
    expect(href("The Philosophy")).toBe("/humanos/philosophy");
    expect(href("The Ecosystem")).toBe("/humanos/ecosystem");
    expect(href("Resources")).toBe("/humanos/resources");
    expect(href("Living Declaration")).toBe("/living-declaration");
    expect(href("Path to Here")).toBe("/humanos/path-to-here");
    expect(href("Contact")).toBe("/humanos/connect");
    expect(href(/TonyGreenberg\.com/)).toBe("/");
  });

  it("'Investment Portfolio' goes to /invest (the old /portfolio link was dead)", () => {
    render(<HumanosFooter />);
    expect(screen.getByRole("link", { name: "Investment Portfolio" })).toHaveAttribute("href", "/invest");
    expect(document.querySelector('a[href="/portfolio"]')).toBeNull();
  });

  it("opens outside links in a new tab", () => {
    render(<HumanosFooter />);
    expect(screen.getByRole("link", { name: "ImpactSoul" })).toHaveAttribute("href", "https://impactsoul.com");
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("target", "_blank");
    expect(screen.getByText(/The machine is perfect. Be the glitch./)).toBeInTheDocument();
  });
});
