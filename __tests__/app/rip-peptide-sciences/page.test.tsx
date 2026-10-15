import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RipPeptideSciencesPage, { metadata } from "@/app/rip-peptide-sciences/page";

describe("/rip-peptide-sciences", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("What Happened to Peptide Sciences? (They Pulled a Houdini)");
    expect(metadata.description).toMatch(/^On March 6, 2026, Peptide Sciences/);
    expect(metadata.alternates?.canonical).toBe("/rip-peptide-sciences");
  });

  it("renders one H1 and the shutdown notice they posted", () => {
    render(<RipPeptideSciencesPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "They Made $7.4 Million a Month.Then Posted Three Sentences and Disappeared.",
    );
    expect(screen.getByText(/We have voluntarily decided to shut down operations/)).toBeInTheDocument();
  });

  it("walks through the timeline and the three likely reasons", () => {
    render(<RipPeptideSciencesPage />);
    expect(screen.getByRole("heading", { level: 2, name: "The Timeline" })).toBeInTheDocument();
    expect(screen.getByText("Domain registered.")).toBeInTheDocument();
    for (const r of ["Regulatory Pressure", "Pharma Litigation", "Payment Processing Collapse"]) {
      expect(screen.getByRole("heading", { level: 3, name: r })).toBeInTheDocument();
    }
  });

  it("scores the alternative vendors, including the flagged ones", () => {
    const { container } = render(<RipPeptideSciencesPage />);
    expect(screen.getByRole("heading", { level: 2, name: /Scored Without Bias/ })).toBeInTheDocument();
    for (const v of ["Ascension Peptides", "Core Peptides", "SwissChems", "Paradigm Peptides"]) {
      expect(container.textContent).toContain(v);
    }
    expect(container.textContent).toContain("Federal prosecution case — avoid");
  });

  it("links to the COA guide and the other peptide tools", () => {
    render(<RipPeptideSciencesPage />);
    expect(screen.getByRole("link", { name: /Learn How to Verify Any COA Yourself/ })).toHaveAttribute("href", "/verify-your-coa");
    expect(screen.getByRole("link", { name: "What's Legal" })).toHaveAttribute("href", "/whats-legal");
    expect(screen.getByRole("link", { name: "Price Tracker" })).toHaveAttribute("href", "/price-tracker");
    expect(screen.getByRole("link", { name: /Back to Peptide Watch/ })).toHaveAttribute("href", "/peptide-watch");
  });
});
