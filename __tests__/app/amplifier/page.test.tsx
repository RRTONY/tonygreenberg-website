import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AmplifierPage, { metadata } from "@/app/amplifier/page";

describe("/amplifier", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Amplifier — Networked Advisory");
    expect(metadata.description).toMatch(/Tony opens rooms\. You walk through them\./);
    expect(metadata.alternates?.canonical).toBe("/amplifier");
  });

  it("renders one H1 and the real copy", () => {
    const { container } = render(<AmplifierPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Matt builds the CEO\.\s*I expand the arena the CEO gets to play in\./);
    expect(container).toHaveTextContent("If you can get both — get both.");
    expect(container).toHaveTextContent("I have known Matt Mochary for 25 years.");
    expect(container).toHaveTextContent("Follow his method to the letter.");
  });

  it("links to Matt Mochary", () => {
    render(<AmplifierPage />);
    expect(screen.getByRole("link", { name: "Matt Mochary" })).toHaveAttribute("href", "https://mochary.com");
  });

  it("routes calls to action through the gate or a pre-filled email", () => {
    render(<AmplifierPage />);
    for (const g of screen.getAllByRole("link", { name: /Enter the Gate/ })) expect(g).toHaveAttribute("href", "/engage");
    expect(screen.getByRole("link", { name: /Make Your Case/ })).toHaveAttribute("href", "mailto:tony@impactsoul.is?subject=Board%20/%20Advisory%20Inquiry");
    expect(screen.getAllByRole("link", { name: "tony@impactsoul.is" })[0]).toHaveAttribute("href", "mailto:tony@impactsoul.is");
  });

  it("links to the related pages", () => {
    render(<AmplifierPage />);
    expect(screen.getByRole("link", { name: /The Diamond Cut/ })).toHaveAttribute("href", "/diamond-cut");
    expect(screen.getByRole("link", { name: /The Territory/ })).toHaveAttribute("href", "/the-territory");
  });
});
