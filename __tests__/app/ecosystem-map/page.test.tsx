import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import EcosystemMapPage, { metadata } from "@/app/ecosystem-map/page";

describe("/ecosystem-map", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Ecosystem Map");
    expect(metadata.description).toMatch(/regenerative economy/);
    expect(metadata.alternates?.canonical).toBe("/ecosystem-map");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<EcosystemMapPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Your Journey Through\s*Self-Discovery/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<EcosystemMapPage />);
    expect(container).toHaveTextContent("18 experiences across 6 phases.");
    expect(container).toHaveTextContent("Who are you when nobody's watching?");
  });

  it("offers a way to start or move through the questions", () => {
    render(<EcosystemMapPage />);
    expect(screen.getAllByRole("button", { name: "View Full Journey Map" }).length).toBeGreaterThan(0);
  });

  it("links on to the next places to go", () => {
    render(<EcosystemMapPage />);
    expect(screen.getAllByRole("link", { name: new RegExp("Back to Portal") })[0]).toHaveAttribute("href", "/find-your-me");
    expect(screen.getAllByRole("link", { name: new RegExp("TonyG Home") })[0]).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("link", { name: new RegExp("Find Your Mirror") })[0]).toHaveAttribute("href", "/the-mirror");
  });
});
