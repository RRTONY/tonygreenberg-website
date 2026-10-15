import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DiamondCutPage, { metadata } from "@/app/diamond-cut/page";

describe("/diamond-cut", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Diamond Cut — Services to Product");
    expect(metadata.description).toMatch(/For services businesses not yet at product scale/);
    expect(metadata.alternates?.canonical).toBe("/diamond-cut");
  });

  it("renders one H1 and the real copy", () => {
    const { container } = render(<DiamondCutPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Every services business has\s*a product trapped inside it\./);
    expect(container).toHaveTextContent("Tony is not a great CEO. He is a magnificent number two.");
    expect(container).toHaveTextContent("It is not coaching. It is not consulting.");
  });

  it("sends technology founders to Matt Mochary", () => {
    render(<DiamondCutPage />);
    expect(screen.getByRole("link", { name: "Matt Mochary" })).toHaveAttribute("href", "https://mochary.com");
  });

  it("routes every call to action through the gate or a pre-filled email", () => {
    render(<DiamondCutPage />);
    const gates = screen.getAllByRole("link", { name: /Enter the Gate/ });
    expect(gates.length).toBeGreaterThan(0);
    for (const g of gates) expect(g).toHaveAttribute("href", "/engage");
    expect(screen.getByRole("link", { name: /Make Your Case/ })).toHaveAttribute(
      "href",
      "mailto:tony@impactsoul.is?subject=Diamond%20Cut%20-%20The%20Setting",
    );
  });

  it("links to the related advisory pages", () => {
    render(<DiamondCutPage />);
    expect(screen.getByRole("link", { name: /The Amplifier/ })).toHaveAttribute("href", "/amplifier");
    expect(screen.getByRole("link", { name: /How I'd Approach Your Problem/ })).toHaveAttribute("href", "/framework");
  });
});
