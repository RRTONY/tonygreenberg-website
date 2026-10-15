import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeptideLibraryList, type PeptideProfile } from "@/components/marketing/peptide-library-list";

const pep = (name: string, category: PeptideProfile["category"], safetyTier: PeptideProfile["safetyTier"], keyStudy?: string): PeptideProfile => ({
  name,
  category,
  safetyTier,
  evidence: 7,
  regulatoryStatus: "Rx only",
  priceRange: "$100–$200 / month research",
  stackPartners: ["Partner A"],
  ouraTracking: "Watch HRV",
  tgTake: "Start low.",
  mechanism: "Binds the GLP-1 receptor and slows gastric emptying, which reduces appetite over many weeks of use.",
  keyStudy,
});
const PEPTIDES = [pep("Semaglutide", "metabolic", "green", "STEP-1 trial"), pep("BPC-157", "recovery", "yellow"), pep("Dihexa", "cognitive", "red")];

describe("PeptideLibraryList", () => {
  it("shows every peptide with counts per category", () => {
    render(<PeptideLibraryList peptides={PEPTIDES} />);
    expect(screen.getByRole("button", { name: "All (3)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Metabolic / GLP-1 (1)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sexual Health (0)" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.getAllByText("7/10")).toHaveLength(3);
  });

  it("filters by category", async () => {
    render(<PeptideLibraryList peptides={PEPTIDES} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Recovery / Repair (1)" }));
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["BPC-157"]);
  });

  it("expands a peptide to its full profile with links to legal and price pages", async () => {
    const user = userEvent.setup();
    render(<PeptideLibraryList peptides={PEPTIDES} />);
    await user.click(screen.getByRole("button", { name: /Semaglutide/ }));
    expect(screen.getByText("Green — Established Safety")).toBeInTheDocument();
    expect(screen.getByText("STEP-1 trial")).toBeInTheDocument();
    expect(screen.getByText('"Start low."')).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Full regulatory details/ })).toHaveAttribute("href", "/whats-legal");
    expect(screen.getByRole("link", { name: /Compare all prices/ })).toHaveAttribute("href", "/price-tracker");
    await user.click(screen.getByRole("button", { name: /Semaglutide/ }));
    expect(screen.queryByText("STEP-1 trial")).not.toBeInTheDocument();
  });
});
