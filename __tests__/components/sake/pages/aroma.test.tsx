import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeAroma } from "@/components/sake/pages/aroma";
import { aromaFamilies } from "@/lib/content/sake/sake-data";
import { renderSake } from "../sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("SakeAroma", () => {
  it("picks aromas, shows matching bottles, removes and clears them", async () => {
    const user = userEvent.setup();
    renderSake(<SakeAroma />);
    expect(screen.getByRole("heading", { level: 1, name: /Aroma/ })).toBeInTheDocument();
    expect(screen.getByText(/Select an aroma family above/)).toBeInTheDocument();

    const family = aromaFamilies[0];
    const familyBtn = screen.getByRole("button", { name: new RegExp(family.name) });
    await user.click(familyBtn);
    expect(familyBtn).toHaveAttribute("aria-expanded", "true");
    const aroma = family.aromas[0];
    await user.click(screen.getByRole("button", { name: aroma.name }));
    expect(screen.getByRole("button", { name: aroma.name })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Your aromas:")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: `Remove ${aroma.name.toLowerCase()}` }));
    expect(screen.queryByText("Your aromas:")).toBeNull();

    for (const a of family.aromas) await user.click(screen.getByRole("button", { name: a.name }));
    expect(screen.getByRole("heading", { level: 2, name: /Bottles Match Your Nose/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.queryByRole("heading", { level: 2, name: /Bottles Match Your Nose/ })).toBeNull();
    await user.click(familyBtn);
    expect(familyBtn).toHaveAttribute("aria-expanded", "false");
  });
});
