import { describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeValueMatrix } from "@/components/sake/pages/value-matrix";
import { valueMatrix } from "@/lib/content/sake/education-data";
import { renderSake } from "../sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const firstName = () => screen.getAllByRole("heading", { level: 3 })[0].textContent;

describe("SakeValueMatrix", () => {
  it("ranks by value first, then by EXV and availability", async () => {
    const user = userEvent.setup();
    renderSake(<SakeValueMatrix />);
    expect(screen.getByRole("heading", { level: 1, name: /Value/ })).toBeInTheDocument();
    const byValue = [...valueMatrix].sort((a, b) => b.valueRatio - a.valueRatio)[0];
    expect(firstName()).toBe(byValue.nameEn);

    await user.click(screen.getByRole("button", { name: "Best EXV" }));
    const byExv = [...valueMatrix].sort((a, b) => b.exvScore - a.exvScore)[0];
    expect(firstName()).toBe(byExv.nameEn);

    await user.click(screen.getByRole("button", { name: "Easiest to Find" }));
    expect(screen.getByRole("button", { name: "Easiest to Find" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Japan Prices" }));
    expect(screen.getByRole("button", { name: "Japan Prices" })).toHaveAttribute("aria-pressed", "true");
  });

  it("shows prices for the chosen country and flavor notes for connoisseurs", async () => {
    const user = userEvent.setup();
    renderSake(<SakeValueMatrix />);
    const item = [...valueMatrix].sort((a, b) => b.valueRatio - a.valueRatio)[0];
    const card = screen.getByRole("heading", { level: 3, name: item.nameEn }).closest("div.rounded-sm") as HTMLElement;
    expect(within(card).getByText(item.priceUS)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Japan Prices" }));
    expect(screen.getAllByText(item.priceJapan).length).toBeGreaterThan(0);
    await user.click(screen.getByTestId("toggle-mode"));
    expect(screen.getByText(item.flavorEn)).toBeInTheDocument();
    await user.click(screen.getByTestId("toggle-austere"));
    expect(document.querySelector(".bg-stone-50")).not.toBeNull();
  });
});
