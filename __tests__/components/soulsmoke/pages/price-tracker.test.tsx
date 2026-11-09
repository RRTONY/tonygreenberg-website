import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PRICE_ALERTS_KEY, PriceTracker } from "@/components/soulsmoke/pages/price-tracker";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

const renderPage = () =>
  render(
    <SoulsmokeProviders>
      <PriceTracker />
    </SoulsmokeProviders>,
  );
const saved = () => JSON.parse(window.localStorage.getItem(PRICE_ALERTS_KEY) ?? "[]");

describe("PriceTracker", () => {
  it("shows the tracked bottles, trends, history charts and retailers, and filters by search", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Price Tracker" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
    expect(screen.getAllByLabelText("Price rising")).toHaveLength(2);
    expect(screen.getByLabelText("Price falling")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Price stable")).toHaveLength(2);
    expect(screen.getByTitle("2025-08: $169")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "K&L Wine" })).toHaveAttribute("href", "https://klwines.com");
    expect(screen.queryByText(/Sign In/)).toBeNull();
    fireEvent.change(screen.getByRole("textbox", { name: "Search bottles" }), { target: { value: "vago" } });
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Vago Elote"]);
  });

  it("creates alerts in the browser without an account, newest first, and removes them", () => {
    renderPage();
    expect(screen.queryByText("Your Active Alerts")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Set Price Alert" }));
    expect(screen.getByRole("button", { name: "Create Alert" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Select Mezcal"), { target: { value: "Largo" } });
    fireEvent.change(screen.getByLabelText("Target Price (optional)"), { target: { value: "150" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Alert" }));
    expect(saved()).toEqual([expect.objectContaining({ mezcalName: "Largo", targetPrice: 15000 })]);
    expect(screen.getByText("Under $150")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Set Price Alert" }));
    fireEvent.change(screen.getByLabelText("Select Mezcal"), { target: { value: "Tobalá" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Alert" }));
    expect(saved().map((a: { mezcalName: string }) => a.mezcalName)).toEqual(["Tobalá", "Largo"]);
    expect(saved()[0].targetPrice).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Set Price Alert" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Remove alert for Largo" }));
    expect(saved().map((a: { mezcalName: string }) => a.mezcalName)).toEqual(["Tobalá"]);
  });
});
