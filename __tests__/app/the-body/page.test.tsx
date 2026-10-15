import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TheBodyPage, { metadata } from "@/app/the-body/page";

describe("/the-body", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Body");
    expect(metadata.description).toMatch(/measurement-driven wellness approach with Oura Ring data/);
    expect(metadata.alternates?.canonical).toBe("/the-body");
  });

  it("renders one H1 and the intro", () => {
    render(<TheBodyPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Health & Longevity");
    expect(screen.getByText(/Not biohacking vanity\. Measurement-driven wellness with accountability built in\./)).toBeInTheDocument();
  });

  it("shows the five-dimension scorecard with its weights", () => {
    render(<TheBodyPage />);
    expect(screen.getByRole("heading", { level: 2, name: "The Alt Therapy Scorecard" })).toBeInTheDocument();
    for (const [dim, weight] of [["Efficacy", "30%"], ["Cost", "25%"], ["Time", "20%"], ["Safety", "15%"], ["Access", "10%"]]) {
      expect(screen.getByText(dim)).toBeInTheDocument();
      expect(screen.getByText(weight)).toBeInTheDocument();
    }
  });

  it("lists the current protocols", () => {
    render(<TheBodyPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Current Protocols" })).toBeInTheDocument();
    expect(screen.getByText(/Peptide therapy — BPC-157, Thymosin Alpha-1, GHK-Cu/)).toBeInTheDocument();
    expect(screen.getByText(/Cold exposure — structured cold plunge protocols/)).toBeInTheDocument();
  });

  it("links to the peptide research tools and the next door", () => {
    render(<TheBodyPage />);
    expect(screen.getByRole("link", { name: /^Supply Chain Transparency/ })).toHaveAttribute("href", "/peptide-supply-chain");
    expect(screen.getByRole("link", { name: /^Provider Assessment Audit/ })).toHaveAttribute("href", "/peptide-hall-of-shame");
    expect(screen.getByRole("link", { name: /^Review vs Evidence Matrix/ })).toHaveAttribute("href", "/peptide-matrix");
    expect(screen.getByRole("link", { name: /Continue to The Nightstand/ })).toHaveAttribute("href", "/the-nightstand");
  });
});
