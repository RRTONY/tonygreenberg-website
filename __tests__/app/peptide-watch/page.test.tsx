import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PeptideWatchPage, { metadata } from "@/app/peptide-watch/page";
import { WALL_OF_SHAME } from "@/lib/content/peptide-watch";

describe("/peptide-watch", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("PeptideWatch — The Definitive Consumer Safety Guide");
    expect(metadata.description).toMatch(/12 documented fraud patterns, 30\+ named enforcement actions/);
    expect(metadata.alternates?.canonical).toBe("/peptide-watch");
  });

  it("renders one H1, the breaking-news line and the hero stats", () => {
    render(<PeptideWatchPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Peptide Watchdog Manual");
    expect(screen.getByText(/voluntarily shut down March 6, 2026/)).toBeInTheDocument();
    expect(screen.getByText("$328M")).toBeInTheDocument();
    expect(screen.getByText("Gray-Market Imports 2025")).toBeInTheDocument();
  });

  it("shows the three markets and the main sections", () => {
    render(<PeptideWatchPage />);
    expect(screen.getByText("Feral Underbelly")).toBeInTheDocument();
    for (const h of ["Three Markets, One Syringe", "The Wall of Shame", "12 Recurring Fraud Patterns", "How to Become a Whistleblower"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
  });

  it("lists every Wall of Shame vendor", () => {
    const { container } = render(<PeptideWatchPage />);
    for (const entry of WALL_OF_SHAME) expect(container.textContent).toContain(entry.vendor);
  });

  it("links to the reporting channels and the related peptide pages", () => {
    render(<PeptideWatchPage />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("https://reportfraud.ftc.gov/");
    expect(hrefs).toContain("https://oig.hhs.gov/fraud/report-fraud/");
    expect(hrefs).toContain("https://www.finnrick.com");
    expect(screen.getAllByRole("link", { name: "Find My Peptide" })[0]).toHaveAttribute("href", "/find-your-peptide");
    expect(screen.getByRole("link", { name: /^What's Legal/ })).toHaveAttribute("href", "/whats-legal");
  });
});
