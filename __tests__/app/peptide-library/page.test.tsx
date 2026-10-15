import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PeptideLibraryPage, { metadata } from "@/app/peptide-library/page";

describe("/peptide-library", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Peptide Library — Every Compound Profiled");
    expect(metadata.description).toMatch(/Zero affiliate links/);
    expect(metadata.alternates?.canonical).toBe("/peptide-library");
  });

  it("renders one H1 and the hero counts", () => {
    render(<PeptideLibraryPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Complete Peptide Library");
    expect(screen.getByText("Compounds").previousElementSibling).toHaveTextContent("21");
    expect(screen.getByText("Affiliate Links").previousElementSibling).toHaveTextContent("0");
    expect(screen.getByText(/No affiliate links\. No vendor partnerships\. Just data\./)).toBeInTheDocument();
  });

  it("lists the compound profiles in the HTML", () => {
    const { container } = render(<PeptideLibraryPage />);
    for (const name of ["Semaglutide", "Tirzepatide", "BPC-157", "SS-31 (Elamipretide)"]) {
      expect(container.textContent).toContain(name);
    }
    expect(screen.getByText("All (21)")).toBeInTheDocument();
  });

  it("links out to the other peptide tools and BioChain", () => {
    render(<PeptideLibraryPage />);
    const links: Record<string, string> = {
      "Find Your Peptide (Quiz)": "/find-your-peptide",
      "Price Tracker": "/price-tracker",
      "What's Legal": "/whats-legal",
      "Verify Your COA": "/verify-your-coa",
      "Test Your Peptides": "/test-your-peptides",
      "Peptide Watchdog": "/peptide-watch",
    };
    for (const [name, href] of Object.entries(links)) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
    expect(screen.getByRole("link", { name: /BioChain Overview/ })).toHaveAttribute("href", "https://ramprate.com/biochain");
  });
});
