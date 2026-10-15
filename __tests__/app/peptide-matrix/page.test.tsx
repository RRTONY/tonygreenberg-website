import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PeptideMatrixPage, { metadata } from "@/app/peptide-matrix/page";

describe("/peptide-matrix", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Peptide Evidence Matrix — Reviews vs. Scientific Evidence");
    expect(metadata.description).toMatch(/Where 5-star reviews and FDA-approved efficacy diverge/);
    expect(metadata.alternates?.canonical).toBe("/peptide-matrix");
  });

  it("renders one H1 and the main section headings", () => {
    render(<PeptideMatrixPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("5-Star Reviews ≠ FDA-Approved Efficacy");
    for (const h of ["All Entities Ranked", "The Four Quadrants", "Appeals & Corrections"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
  });

  it("shows the quadrant copy and the ranked entities", () => {
    const { container } = render(<PeptideMatrixPage />);
    expect(screen.getByText(/Patient satisfaction and scientific validation are different metrics/)).toBeInTheDocument();
    expect(screen.getByText("Q4: Danger Zone")).toBeInTheDocument();
    expect(container.textContent).toContain("Ways2Well");
    expect(container.textContent).toContain("USADA");
  });

  it("keeps the collapsed scoring methodology in the HTML", () => {
    render(<PeptideMatrixPage />);
    expect(screen.getByText("Evidence Score Criteria")).toBeInTheDocument();
  });

  it("has an appeals anchor with the contact address", () => {
    const { container } = render(<PeptideMatrixPage />);
    const appeals = container.querySelector("#appeals");
    expect(appeals).not.toBeNull();
    expect(appeals).toHaveTextContent("Contact: appeals@impactsoul.is");
    expect(appeals).toHaveTextContent("reviewed within 14 business days");
  });

  it("links to the rest of the Peptide Truth System", () => {
    render(<PeptideMatrixPage />);
    expect(screen.getByRole("link", { name: /^Hall of Shame/ })).toHaveAttribute("href", "/peptide-hall-of-shame");
    expect(screen.getByRole("link", { name: /^Peptide Clarity Index/ })).toHaveAttribute("href", "/find-your-peptide");
    expect(screen.getByRole("link", { name: /^The Investigation/ })).toHaveAttribute(
      "href",
      "/blog/the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine",
    );
    expect(screen.getByRole("link", { name: "Appeals Process" })).toHaveAttribute("href", "#appeals");
  });
});
