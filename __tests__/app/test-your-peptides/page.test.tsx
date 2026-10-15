import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TestYourPeptidesPage, { metadata } from "@/app/test-your-peptides/page";

describe("/test-your-peptides", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("How to Independently Test Peptides in 2026");
    expect(metadata.description).toMatch(/^Don't Trust\. Verify\. Four ways to know what's actually in your vials/);
    expect(metadata.alternates?.canonical).toBe("/test-your-peptides");
  });

  it("renders one H1 and the intro", () => {
    render(<TestYourPeptidesPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Don't Trust. Verify.");
    expect(screen.getByText(/Independent verification isn't paranoia\. It's basic due diligence\./)).toBeInTheDocument();
  });

  it("covers the four verification options, cheapest to most rigorous", () => {
    render(<TestYourPeptidesPage />);
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([
      "Janoshik Analytical",
      "Community Batch Testing",
      "Eroids Vendor Ratings",
      "Telehealth / Compounding Pharmacy Route",
    ]);
    expect(screen.getByText("~$30–$60 per sample")).toBeInTheDocument();
    expect(screen.getByText(/If your vendor doesn't use Janoshik, ask why\./)).toBeInTheDocument();
  });

  it("links to the testing services and the related peptide pages", () => {
    render(<TestYourPeptidesPage />);
    expect(screen.getByRole("link", { name: "janoshik.com" })).toHaveAttribute("href", "https://janoshik.com");
    expect(screen.getByRole("link", { name: "r/Peptides" })).toHaveAttribute("href", "https://reddit.com/r/peptides");
    expect(screen.getByRole("link", { name: "eroids.com" })).toHaveAttribute("href", "https://eroids.com");
    expect(screen.getByRole("link", { name: "Verify Your COA" })).toHaveAttribute("href", "/verify-your-coa");
    expect(screen.getByRole("link", { name: /Back to Peptide Watch/ })).toHaveAttribute("href", "/peptide-watch");
  });
});
