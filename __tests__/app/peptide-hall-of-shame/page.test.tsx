import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PeptideHallOfShamePage, { metadata } from "@/app/peptide-hall-of-shame/page";

describe("/peptide-hall-of-shame", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Peptide Assessment Hall of Shame — How 20 US Clinics Score");
    expect(metadata.description).toMatch(/We audited 20 peptide clinics/);
    expect(metadata.alternates?.canonical).toBe("/peptide-hall-of-shame");
  });

  it("renders one H1 and the audit summary stats worked out from the 20 clinics", () => {
    render(<PeptideHallOfShamePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Peptide AssessmentHall of Shame");
    expect(screen.getByText("95/100")).toBeInTheDocument();
    expect(screen.getByText("8/20")).toBeInTheDocument();
    expect(screen.getByText("1/20")).toBeInTheDocument();
    expect(screen.getByText("3/20")).toBeInTheDocument();
  });

  it.fails("BUG: the meta description says the average is 93/100 but the page works it out as 95/100", () => {
    render(<PeptideHallOfShamePage />);
    const shown = screen.getByText(/^\d+\/100$/).textContent!;
    expect(metadata.description).toContain(shown);
  });

  it("shows the methodology copy and every ranked clinic", () => {
    const { container } = render(<PeptideHallOfShamePage />);
    expect(screen.getByRole("heading", { level: 2, name: "Scoring Methodology" })).toBeInTheDocument();
    expect(screen.getByText(/lead generation forms wearing a lab coat/)).toBeInTheDocument();
    expect(screen.getByText("Screens Contraindications")).toBeInTheDocument();
    for (const name of ["Admire Medical", "Defy Medical", "Peter Attia MD", "AgelessRx"]) {
      expect(container.textContent).toContain(name);
    }
  });

  it("links to the assessment and the related peptide tools", () => {
    render(<PeptideHallOfShamePage />);
    for (const a of screen.getAllByRole("link", { name: /Take the Assessment/ })) {
      expect(a).toHaveAttribute("href", "/find-your-peptide");
    }
    expect(screen.getByRole("link", { name: "Full breakdown" })).toHaveAttribute("href", "/rip-peptide-sciences");
    expect(screen.getByRole("link", { name: /Appeals Process/ })).toHaveAttribute("href", "/peptide-matrix#appeals");
    expect(screen.getByRole("link", { name: /25-Question Quiz/ })).toHaveAttribute("href", "/quiz_25q");
    expect(screen.getByRole("link", { name: /PeptideWatch Safety Guide/ })).toHaveAttribute("href", "/peptide-watch");
  });
});
