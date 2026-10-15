import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeptideLegalTable, type PeptideRegEntry } from "@/components/marketing/peptide-legal-table";

const e = (compound: string, userRisk: PeptideRegEntry["userRisk"], us = "Grey market"): PeptideRegEntry => ({
  compound,
  us,
  uk: "Prescription only",
  australia: "Banned",
  rxPath: "Yes",
  userRisk,
});
const DATA = [e("Semaglutide", "LOW", "FDA Approved"), e("BPC-157", "MEDIUM"), e("Melanotan II", "VERY HIGH"), e("TB-500", "LOW-MEDIUM")];
const rows = () => screen.queryAllByRole("row").slice(1).map((r) => r.firstElementChild!.textContent);

describe("PeptideLegalTable", () => {
  it("shows every compound with colour-coded status and risk chips", () => {
    render(<PeptideLegalTable data={DATA} />);
    expect(rows()).toEqual(["Semaglutide", "BPC-157", "Melanotan II", "TB-500"]);
    expect(screen.getByText("FDA Approved")).toHaveClass("bg-emerald-100");
    expect(screen.getAllByText("Banned")[0]).toHaveClass("bg-red-100");
    expect(screen.getByText("VERY HIGH")).toHaveClass("bg-red-100");
  });

  it("filters by risk band", async () => {
    const user = userEvent.setup();
    render(<PeptideLegalTable data={DATA} />);
    await user.click(screen.getByRole("button", { name: "medium risk" }));
    expect(rows()).toEqual(["BPC-157", "TB-500"]);
    await user.click(screen.getByRole("button", { name: "high risk" }));
    expect(rows()).toEqual(["Melanotan II"]);
    await user.click(screen.getByRole("button", { name: "low risk" }));
    expect(rows()).toEqual(["Semaglutide"]);
  });

  it("searches by compound name and shows an empty state", async () => {
    const user = userEvent.setup();
    render(<PeptideLegalTable data={DATA} />);
    await user.type(screen.getByPlaceholderText("Search compound..."), "bpc");
    expect(rows()).toEqual(["BPC-157"]);
    await user.type(screen.getByPlaceholderText("Search compound..."), "zzz");
    expect(screen.getByText("No compounds match your filter.")).toBeInTheDocument();
  });
});
