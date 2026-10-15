import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WhatsLegalPage, { metadata } from "@/app/whats-legal/page";

function compounds() {
  const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);
  return rows.map((r) => within(r).getAllByRole("cell")[0].textContent);
}

describe("/whats-legal", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("What's Legal? — Peptide Regulatory Status by Country (2026)");
    expect(metadata.description).toMatch(/targeted vendors, not users/);
    expect(metadata.alternates?.canonical).toBe("/whats-legal");
  });

  it("renders one H1 and the not-legal-advice context", () => {
    render(<WhatsLegalPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Actual Legal Status of Every PeptideThat Matters.");
    expect(screen.getByText(/Not legal advice\. Not a scare piece\./)).toBeInTheDocument();
    expect(screen.getByText(/No user has been prosecuted for personal peptide possession in the US\./, { exact: false })).toBeInTheDocument();
  });

  it("shows the status of all 17 compounds across the US, UK and Australia", () => {
    render(<WhatsLegalPage />);
    expect(compounds()).toHaveLength(17);
    const bpc = within(screen.getByRole("table")).getByText("BPC-157").closest("tr")!;
    expect(bpc).toHaveTextContent("Scheduled (S4)");
    expect(screen.getByRole("heading", { level: 2, name: "Key Distinctions That Actually Matter" })).toBeInTheDocument();
  });

  it("filters by risk and by search, and says when nothing matches", async () => {
    const user = userEvent.setup();
    render(<WhatsLegalPage />);
    await user.click(screen.getByRole("button", { name: "high risk" }));
    expect(compounds()).toEqual(expect.arrayContaining(["Semaglutide", "Tirzepatide"]));
    expect(compounds()).not.toContain("BPC-157");

    await user.click(screen.getByRole("button", { name: "All" }));
    await user.type(screen.getByPlaceholderText("Search compound..."), "sema");
    expect(compounds()).toEqual(["Semaglutide", "Semax"]);

    await user.type(screen.getByPlaceholderText("Search compound..."), "zzz");
    expect(screen.getByText("No compounds match your filter.")).toBeInTheDocument();
  });

  it("links to the related peptide pages", () => {
    render(<WhatsLegalPage />);
    expect(screen.getByRole("link", { name: "RIP Peptide Sciences" })).toHaveAttribute("href", "/rip-peptide-sciences");
    expect(screen.getByRole("link", { name: "Verify Your COA" })).toHaveAttribute("href", "/verify-your-coa");
    expect(screen.getByRole("link", { name: "Price Tracker" })).toHaveAttribute("href", "/price-tracker");
  });
});
