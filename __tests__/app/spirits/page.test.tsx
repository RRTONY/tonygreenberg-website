import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SpiritsPage, { metadata } from "@/app/spirits/page";

// The shared next/font/google fake is a Proxy with no `has` trap, so vitest
// reports named imports (Fraunces, ...) as missing. Stub the page-fonts module.
vi.mock("@/lib/fonts/page-fonts", () => ({ pageFontVariables: "page-fonts" }));

describe("/spirits", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Wine, Sake, Spirits & Mezcal");
    expect(metadata.description).toMatch(/^Tony's liquid obsessions — mezcal, tequila, sake, and wine\./);
    expect(metadata.alternates?.canonical).toBe("/spirits");
  });

  it("renders one H1 and the opening line", () => {
    render(<SpiritsPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Wine, Sake, Spirits& Mezcal");
    expect(screen.getByText(/What enters the mouth must speak to the mind and stay with the heart\./)).toBeInTheDocument();
  });

  it("has a section per drink with Tony's current obsessions", () => {
    render(<SpiritsPage />);
    for (const h of ["Mezcal", "Tequila", "Sake", "Coffee", "Wine"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
    expect(screen.getByText(/Mezcal is not a drink\. It's a conversation between fire, earth/)).toBeInTheDocument();
    expect(screen.getByText(/Wild agave varieties — Tobalá, Tepeztate, Jabalí, Cuishe/)).toBeInTheDocument();
  });

  it("shows retired companion sites without a link, and no Manus addresses", () => {
    const { container } = render(<SpiritsPage />);
    const soulSmoke = screen.getByRole("heading", { level: 3, name: "SoulSmoke" });
    expect(soulSmoke.closest("a")).toBeNull();
    expect(screen.getAllByText("Companion Site, No Longer Live").length).toBeGreaterThan(0);
    expect(container.innerHTML).not.toMatch(/manus\.space|manuscdn|\/manus-storage\//);
  });

  it("links to BrewSoul, the letter and recent creations", () => {
    render(<SpiritsPage />);
    expect(screen.getByRole("link", { name: /BrewSoul/ })).toHaveAttribute("href", "/brewsoul");
    expect(screen.getByRole("link", { name: /Read the Letter/ })).toHaveAttribute("href", "/the-letter");
    expect(screen.getByRole("link", { name: /Recent Creations/ })).toHaveAttribute("href", "/recent-creations");
  });
});
