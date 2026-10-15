import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TheTerritoryPage, { metadata } from "@/app/the-territory/page";

describe("/the-territory", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Territory");
    expect(metadata.description).toMatch(/From Arnold Patent to Ram Dass to systems thinking\./);
    expect(metadata.alternates?.canonical).toBe("/the-territory");
  });

  it("renders one H1 and the intro", () => {
    render(<TheTerritoryPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Heroes & Influences");
    expect(screen.getByText(/None of this was built alone\./)).toBeInTheDocument();
  });

  it("names the heroes and what each one taught", () => {
    const { container } = render(<TheTerritoryPage />);
    for (const name of ["Arnold Patent", "Buckminster Fuller", "Ram Dass", "Donella Meadows", "Rick Doblin"]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(container.textContent).toContain("Three words that took me twenty years to understand.");
  });

  it("states the operating philosophy", () => {
    render(<TheTerritoryPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Operating Philosophy" })).toBeInTheDocument();
    expect(screen.getByText(/I'm a satisficer, not a maximizer\./)).toBeInTheDocument();
  });

  it("links to the related pages and the next door", () => {
    render(<TheTerritoryPage />);
    expect(screen.getByRole("link", { name: /^The Nightstand/ })).toHaveAttribute("href", "/the-nightstand");
    expect(screen.getByRole("link", { name: /^The Amplifier/ })).toHaveAttribute("href", "/amplifier");
    expect(screen.getByRole("link", { name: /Continue to The Engine Room/ })).toHaveAttribute("href", "/engine-room");
  });
});
