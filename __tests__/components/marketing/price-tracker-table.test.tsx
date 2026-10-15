import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PriceTrackerTable, type PriceEntry } from "@/components/marketing/price-tracker-table";

const p = (compound: string, rl: number, rh: number, tl: number, th: number, tgTake?: string): PriceEntry => ({
  compound,
  researchVendor: `$${rl}`,
  telehealth: tl ? `$${tl}` : "N/A",
  monthlyEst: "-",
  verdict: "ok",
  tgTake,
  researchLow: rl,
  researchHigh: rh,
  telehealthLow: tl,
  telehealthHigh: th,
});
const PRICES = [
  p("Tirzepatide (Mounjaro)", 100, 150, 500, 900, "Worth it."),
  p("BPC-157", 40, 60, 0, 0),
  p("Semaglutide (Ozempic)", 80, 120, 300, 600),
  p("Ipamorelin", 30, 50, 200, 300),
  p("CJC-1295", 35, 55, 220, 320),
];
const rows = () => screen.getAllByRole("row").slice(1).map((r) => r.firstElementChild!.textContent);

describe("PriceTrackerTable", () => {
  it("sorts by name, research price and telehealth price (no Rx path last)", async () => {
    const user = userEvent.setup();
    render(<PriceTrackerTable prices={PRICES} />);
    expect(rows()[0]).toBe("BPC-157");
    await user.click(screen.getByRole("button", { name: "Research $" }));
    expect(rows()).toEqual(["Ipamorelin", "CJC-1295", "BPC-157", "Semaglutide (Ozempic)", "Tirzepatide (Mounjaro)"]);
    await user.click(screen.getByRole("button", { name: "Telehealth $" }));
    expect(rows()[0]).toBe("Ipamorelin");
    expect(rows().at(-1)).toBe("BPC-157");
  });

  it("shows Tony's takes", () => {
    render(<PriceTrackerTable prices={PRICES} />);
    expect(screen.getByText('"Worth it."')).toBeInTheDocument();
  });

  it("adds up a stack's monthly cost and caps it at 4 compounds", async () => {
    const user = userEvent.setup();
    render(<PriceTrackerTable prices={PRICES} />);
    await user.click(screen.getByRole("button", { name: "Tirzepatide" }));
    await user.click(screen.getByRole("button", { name: "BPC-157" }));
    expect(screen.getByText("$140 – $210")).toBeInTheDocument();
    expect(screen.getByText(/2 compounds · Research vendor pricing/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Semaglutide" }));
    await user.click(screen.getByRole("button", { name: "Ipamorelin" }));
    expect(screen.getByRole("button", { name: "CJC-1295" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Ipamorelin" }));
    expect(screen.getByRole("button", { name: "CJC-1295" })).toBeEnabled();
  });

  it("telehealth mode leaves out compounds with no Rx path and shows the research alternative", async () => {
    const user = userEvent.setup();
    render(<PriceTrackerTable prices={PRICES} />);
    await user.click(screen.getByRole("button", { name: "Telehealth / Rx" }));
    expect(screen.getByRole("button", { name: /BPC-157/ })).toHaveTextContent("No Rx path");
    await user.click(screen.getByRole("button", { name: "Tirzepatide" }));
    await user.click(screen.getByRole("button", { name: /BPC-157/ }));
    expect(screen.getByText("$500 – $900")).toBeInTheDocument();
    expect(screen.getByText(/Research vendor alternative/)).toHaveTextContent("$140 – $210/mo");
    expect(screen.getByRole("link", { name: "What's Legal" })).toHaveAttribute("href", "/whats-legal");
  });
});
