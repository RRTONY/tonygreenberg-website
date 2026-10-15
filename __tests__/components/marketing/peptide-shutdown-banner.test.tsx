import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PeptideShutdownBanner } from "@/components/marketing/peptide-shutdown-banner";

describe("PeptideShutdownBanner", () => {
  it("shows the FDA shutdown notice and links to the breakdown", () => {
    render(<PeptideShutdownBanner />);
    expect(screen.getByText("March 2026")).toBeInTheDocument();
    expect(screen.getByText(/Peptide Sciences shut down by FDA/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Full breakdown/ })).toHaveAttribute("href", "/rip-peptide-sciences");
  });
});
