import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PriceTrackerPage, { metadata } from "@/app/price-tracker/page";

describe("/price-tracker", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Peptide Prices 2026 — What You Should Actually Pay");
    expect(metadata.description).toMatch(/the information asymmetry IS the markup/);
    expect(metadata.alternates?.canonical).toBe("/price-tracker");
  });

  it("renders one H1 and Tony's intro", () => {
    render(<PriceTrackerPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Here Is What Peptides Actually Cost.");
    expect(screen.getByText("(And here is what some people are being charged, which is a different number.)")).toBeInTheDocument();
  });

  it("shows the price table with research and telehealth ranges and verdicts", () => {
    const { container } = render(<PriceTrackerPage />);
    expect(container.textContent).toContain("BPC-157 (5mg x10 vials)");
    expect(container.textContent).toContain("Research wins on price. Same molecule.");
    expect(container.textContent).toContain("$400–$900");
    expect(container.textContent).toContain("Thymosin Alpha-1 (1mg x10)");
  });

  it("includes the monthly protocol cost calculator", () => {
    render(<PriceTrackerPage />);
    expect(screen.getByRole("heading", { level: 2, name: "What Will Your Protocol Actually Cost Per Month?" })).toBeInTheDocument();
  });

  it("links to the related peptide pages", () => {
    render(<PriceTrackerPage />);
    expect(screen.getByRole("link", { name: "RIP Peptide Sciences" })).toHaveAttribute("href", "/rip-peptide-sciences");
    for (const a of screen.getAllByRole("link", { name: "What's Legal" })) expect(a).toHaveAttribute("href", "/whats-legal");
    expect(screen.getByRole("link", { name: "Verify Your COA" })).toHaveAttribute("href", "/verify-your-coa");
    expect(screen.getByRole("link", { name: "Test Your Peptides" })).toHaveAttribute("href", "/test-your-peptides");
  });
});
