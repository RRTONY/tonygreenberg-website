import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrewSoulHomeSection } from "@/components/marketing/brewsoul-home-section";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { CHAIN_RANKINGS } from "@/lib/content/brewsoul-chains";

describe("BrewSoulHomeSection", () => {
  it("shows the heading, real copy and live stats", () => {
    render(<BrewSoulHomeSection />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("BrewSoul");
    expect(screen.getByText(/most consumed psychoactive substance on earth/)).toBeInTheDocument();
    expect(screen.getByText("Coffees Scored").previousElementSibling).toHaveTextContent(String(BREWSOUL_COFFEES.length));
    expect(screen.getByText("Chains Ranked").previousElementSibling).toHaveTextContent(String(CHAIN_RANKINGS.length));
  });

  it("links to the BrewSoul quiz, browse and chain rankings", () => {
    render(<BrewSoulHomeSection />);
    expect(screen.getByRole("link", { name: "Discover Your Identity" })).toHaveAttribute("href", "/brewsoul");
    expect(screen.getByRole("link", { name: /Browse Top QPR/ })).toHaveAttribute("href", "/brewsoul/browse");
    expect(screen.getByRole("link", { name: /Chain Rankings/ })).toHaveAttribute("href", "/brewsoul/chains");
  });

  it("uses a Sanity-hosted hero image with alt text", () => {
    render(<BrewSoulHomeSection />);
    const img = screen.getByRole("img", { name: /coffee/i });
    expect(img.getAttribute("src")).toMatch(/^https:\/\/cdn\.sanity\.io\//);
  });
});
