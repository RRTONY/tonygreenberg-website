import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeHero } from "@/components/marketing/home-hero";

describe("HomeHero", () => {
  it("has exactly one H1 and the real headline", () => {
    render(<HomeHero essayCount={300} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Tony Greenberg — Strategist, Author & Systems Thinker");
    expect(screen.getByText(/I expose broken systems./)).toBeInTheDocument();
    expect(screen.getByText("Then I build what comes next.")).toBeInTheDocument();
  });

  it("shows the essay count and the main links", () => {
    render(<HomeHero essayCount={312} />);
    expect(screen.getByText(/312 ESSAYS/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find Your Fit" })).toHaveAttribute("href", "/find-my");
    expect(screen.getByRole("link", { name: "READ" })).toHaveAttribute("href", "#essays-archive");
    expect(screen.getByRole("link", { name: "DIAGNOSE" })).toHaveAttribute("href", "/find-my");
    expect(screen.getByRole("link", { name: "ENGAGE" })).toHaveAttribute("href", "/engage");
  });

  it("includes the ABIT waitlist form and a Sanity hero image with alt text", () => {
    render(<HomeHero essayCount={1} />);
    expect(screen.getByRole("button", { name: "Join Waitlist" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Kintsugi bowl/ }).getAttribute("src")).toMatch(/^https:\/\/cdn\.sanity\.io\//);
  });
});
