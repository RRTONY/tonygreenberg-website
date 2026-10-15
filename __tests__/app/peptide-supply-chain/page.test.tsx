import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PeptideSupplyChainPage, { metadata } from "@/app/peptide-supply-chain/page";
import { PROVIDERS } from "@/lib/content/supply-chain-providers";

describe("/peptide-supply-chain", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Where Does Your Peptide Dollar Go? — Supply Chain Transparency");
    expect(metadata.description).toMatch(/We mapped the supply chain of 12 peptide providers/);
    expect(metadata.alternates?.canonical).toBe("/peptide-supply-chain");
  });

  it("renders one H1 and the per-dollar averages", () => {
    render(<PeptideSupplyChainPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Where Does YourPeptide Dollar Go?");
    expect(screen.getByText("Avg. Marketing")).toBeInTheDocument();
    expect(screen.getByText("Avg. Profit")).toBeInTheDocument();
  });

  it("explains how to read the split and names every cost category", () => {
    render(<PeptideSupplyChainPage />);
    expect(screen.getByRole("heading", { level: 2, name: "How to Read This" })).toBeInTheDocument();
    expect(screen.getByText(/you're funding their Instagram ads and shareholder returns/)).toBeInTheDocument();
    for (const c of ["Manufacturing", "Physician Oversight", "Profit Margin"]) {
      expect(screen.getAllByText(c).length).toBeGreaterThan(0);
    }
  });

  it("ranks every provider in the data", () => {
    const { container } = render(<PeptideSupplyChainPage />);
    expect(PROVIDERS.length).toBe(12);
    for (const p of PROVIDERS) expect(container.textContent).toContain(p.name);
  });

  it("links to the assessment and the other audits", () => {
    render(<PeptideSupplyChainPage />);
    expect(screen.getByRole("link", { name: /Take the Assessment/ })).toHaveAttribute("href", "/find-your-peptide");
    expect(screen.getByRole("link", { name: /See the Hall of Shame/ })).toHaveAttribute("href", "/peptide-hall-of-shame");
    expect(screen.getByRole("link", { name: /Review vs Evidence Matrix/ })).toHaveAttribute("href", "/peptide-matrix");
    expect(screen.getByRole("link", { name: /Appeals Process/ })).toHaveAttribute("href", "/peptide-matrix#appeals");
  });
});
