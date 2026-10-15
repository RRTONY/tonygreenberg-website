import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WalkThroughPage, { metadata } from "@/app/walk-through/page";

const DOORS = [
  "Enterprise Technology & AI",
  "Social Impact & Tokenization",
  "Psychedelic Medicine",
  "Payments & The Corridor",
  "Health & Longevity",
  "Consumer Advocacy",
  "Decentralized Governance & Web3",
];

describe("/walk-through", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Seven Doors");
    expect(metadata.description).toMatch(/^Walk through Tony Greenberg's seven domains/);
    expect(metadata.alternates?.canonical).toBe("/walk-through");
  });

  it("renders one H1 and the intro", () => {
    render(<WalkThroughPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Seven Doors");
    expect(screen.getByText(/The magic happens at the intersections\./)).toBeInTheDocument();
  });

  it("has all seven doors in order", () => {
    render(<WalkThroughPage />);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(DOORS);
    expect(screen.getByText(/Four live token ecosystems: BEYOND/)).toBeInTheDocument();
  });

  it("links each door to the company or deep dive behind it", () => {
    render(<WalkThroughPage />);
    expect(screen.getByRole("link", { name: /^RampRate/ })).toHaveAttribute("href", "https://ramprate.com");
    expect(screen.getByRole("link", { name: /^ImpactSoul/ })).toHaveAttribute("href", "https://impactsoul.is");
    expect(screen.getByRole("link", { name: /^Homeaglow Exposed/ })).toHaveAttribute("href", "https://homeaglowexposed.com");
    for (const a of screen.getAllByRole("link", { name: /See the full portfolio/ })) expect(a).toHaveAttribute("href", "/invest");
    expect(screen.getByRole("link", { name: /Continue to The Territory/ })).toHaveAttribute("href", "/the-territory");
  });
});
