import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeFoodPairing } from "@/components/sake/pages/food-pairing";
import { foodPairings, pairingPrinciples } from "@/lib/content/sake/education-data";
import { renderSake } from "../sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("SakeFoodPairing", () => {
  it("shows the first style's dishes and switches styles", async () => {
    const user = userEvent.setup();
    renderSake(<SakeFoodPairing />);
    expect(screen.getByRole("heading", { level: 1, name: /Food/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: foodPairings[0].sakeStyle })).toBeInTheDocument();
    for (const d of foodPairings[0].pairings) expect(screen.getByText(d.dishEn)).toBeInTheDocument();
    const second = foodPairings[1];
    await user.click(screen.getByRole("button", { name: second.sakeStyle }));
    expect(screen.getByRole("heading", { level: 2, name: second.sakeStyle })).toBeInTheDocument();
    expect(screen.getAllByText(`${second.pairings[0].intensityMatch}/10`).length).toBeGreaterThan(0);
  });

  it("keeps the principles in the HTML and opens them", async () => {
    const user = userEvent.setup();
    const { container } = renderSake(<SakeFoodPairing />);
    const panel = container.querySelector("#sake-pairing-principles") as HTMLElement;
    expect(panel).toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(pairingPrinciples[0].nameEn);
    await user.click(screen.getByRole("button", { name: /The 6 Principles/ }));
    expect(panel).not.toHaveAttribute("hidden");
  });

  it("adds the connoisseur note and the Austere colors", async () => {
    const user = userEvent.setup();
    const { container } = renderSake(<SakeFoodPairing />);
    await user.click(screen.getByTestId("toggle-mode"));
    expect(screen.getByText("Connoisseur Note")).toBeInTheDocument();
    await user.click(screen.getByTestId("toggle-austere"));
    expect(container.querySelector(".bg-stone-200\\/50")).not.toBeNull();
  });
});
