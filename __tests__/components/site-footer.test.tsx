import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SiteFooter } from "@/components/site-footer";

describe("SiteFooter", () => {
  it("has the Contact, Privacy and Terms links", () => {
    render(<SiteFooter />);
    const nav = screen.getByRole("navigation", { name: "Legal and contact" });
    expect(within(nav).getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
    expect(within(nav).getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(within(nav).getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });

  it("has Tony's email as a mailto link", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "t@ramprate.com" })).toHaveAttribute("href", "mailto:t@ramprate.com");
  });

  it("shows the real tagline and copyright year", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/Only time buys trust. The gold is in the cracks./)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Tony Greenberg`))).toBeInTheDocument();
  });

  it("external links open in a new tab with noopener", () => {
    render(<SiteFooter />);
    const external = screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("http"));
    expect(external.length).toBeGreaterThan(5);
    for (const a of external) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
    }
    expect(screen.getByRole("link", { name: "Book Time with Me" })).toHaveAttribute("href", "https://linktr.ee/TonyG2");
  });

  it("includes the AI summary tiles for the homepage", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Request an AI summary of Tony Greenberg")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Summarize with Claude" }).getAttribute("href")).toContain(
      encodeURIComponent("https://tonygreenberg.com/"),
    );
  });
});
