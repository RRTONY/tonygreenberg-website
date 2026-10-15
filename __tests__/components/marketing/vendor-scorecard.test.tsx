import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VendorScorecard, type Vendor } from "@/components/marketing/vendor-scorecard";

const v = (vendor: string, score: number): Vendor => ({ vendor, score, coa: "Janoshik", purity: "99%", usShip: "Yes", notes: "-" });
const VENDORS = [v("Beta Labs", 72), v("Alpha Peptides", 91), v("Gamma Co", 40), v("Delta Bio", 95)];
const rows = () => screen.getAllByRole("row").slice(1).map((r) => r.firstElementChild!.textContent);

describe("VendorScorecard", () => {
  it("sorts by score by default with colour-coded badges", () => {
    render(<VendorScorecard vendors={VENDORS} />);
    expect(rows()).toEqual(["Delta Bio", "Alpha Peptides", "Beta Labs", "Gamma Co"]);
    expect(screen.getByText("91")).toHaveClass("bg-emerald-700");
    expect(screen.getByText("72")).toHaveClass("bg-amber-700");
    expect(screen.getByText("40")).toHaveClass("bg-red-600");
  });

  it("sorts by name", async () => {
    render(<VendorScorecard vendors={VENDORS} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Sort by Name" }));
    expect(rows()).toEqual(["Alpha Peptides", "Beta Labs", "Delta Bio", "Gamma Co"]);
  });

  it("the table scrolls sideways in a focusable labelled region", () => {
    render(<VendorScorecard vendors={VENDORS} />);
    expect(screen.getByRole("region", { name: "Table (scrolls sideways)" })).toHaveAttribute("tabindex", "0");
  });
});
