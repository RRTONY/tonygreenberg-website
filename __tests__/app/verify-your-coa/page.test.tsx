import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerifyYourCoaPage, { metadata } from "@/app/verify-your-coa/page";

function checklistItems() {
  return screen.getAllByRole("button").filter((b) => /^\d\. /.test(b.querySelector("h3")?.textContent ?? ""));
}

describe("/verify-your-coa", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("How to Read a Peptide COA — 7 Red Flags");
    expect(metadata.description).toMatch(/^Every peptide vendor will hand you a Certificate of Analysis\./);
    expect(metadata.alternates?.canonical).toBe("/verify-your-coa");
  });

  it("renders one H1 and the intro", () => {
    render(<VerifyYourCoaPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("A COA Is Only As Good As the LabThat Wrote It.");
    expect(screen.getByText(/Some are the same document copy-pasted with different dates\./)).toBeInTheDocument();
  });

  it("lists all seven checks with what counts as a pass", () => {
    render(<VerifyYourCoaPage />);
    expect(checklistItems()).toHaveLength(7);
    expect(screen.getByRole("heading", { level: 3, name: "1. The Lab Is Named and Findable" })).toBeInTheDocument();
    expect(screen.getByText("Pass = Lot/batch number matches your order")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "The Two-Minute Check" })).toBeInTheDocument();
  });

  it("scores the COA live as items are ticked and unticked", async () => {
    const user = userEvent.setup();
    render(<VerifyYourCoaPage />);
    expect(screen.getByText("0/7")).toBeInTheDocument();
    expect(screen.getByText("Walk Away")).toBeInTheDocument();

    const items = checklistItems();
    for (const item of items.slice(0, 3)) await user.click(item);
    expect(screen.getByText("3/7")).toBeInTheDocument();
    expect(screen.getByText("Red Flag")).toBeInTheDocument();

    for (const item of items.slice(3, 5)) await user.click(item);
    expect(screen.getByText("Questionable")).toBeInTheDocument();

    for (const item of items.slice(5)) await user.click(item);
    expect(screen.getByText("7/7")).toBeInTheDocument();
    expect(screen.getByText("Clean")).toBeInTheDocument();

    await user.click(items[0]);
    expect(screen.getByText("6/7")).toBeInTheDocument();
  });

  it("links to Janoshik and the related peptide pages", () => {
    render(<VerifyYourCoaPage />);
    expect(screen.getByRole("link", { name: "janoshik.com" })).toHaveAttribute("href", "https://janoshik.com");
    expect(screen.getByRole("link", { name: "What's Legal" })).toHaveAttribute("href", "/whats-legal");
    expect(screen.getByRole("link", { name: "Test Your Peptides" })).toHaveAttribute("href", "/test-your-peptides");
  });
});
