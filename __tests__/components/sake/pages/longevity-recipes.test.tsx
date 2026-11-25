import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeLongevityRecipes } from "@/components/sake/pages/longevity-recipes";
import { longevityRecipes, recipeCategories } from "@/lib/content/sake/experience-data";
import { renderSake } from "../sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("SakeLongevityRecipes", () => {
  it("lists every recipe with its method in the HTML, and opens one", async () => {
    const user = userEvent.setup();
    const { container } = renderSake(<SakeLongevityRecipes />);
    expect(screen.getByRole("heading", { level: 1, name: /Longevity/ })).toBeInTheDocument();
    for (const r of longevityRecipes) expect(screen.getByText(r.name)).toBeInTheDocument();
    const first = longevityRecipes[0];
    expect(container.innerHTML).toContain(first.preparation);
    const toggle = screen.getByRole("button", { name: new RegExp(first.name) });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(first.preparation)).toBeVisible();
    expect(screen.getByRole("link", { name: /The Full Science/ })).toHaveAttribute("href", "/sake/liquid-alchemy");
    expect(screen.getByRole("link", { name: /Explore Namazake/ })).toHaveAttribute("href", "/sake/namazake");
  });

  it("filters by category and shows science notes for connoisseurs", async () => {
    const user = userEvent.setup();
    renderSake(<SakeLongevityRecipes />);
    const cat = recipeCategories[0];
    await user.click(screen.getByRole("button", { name: cat.name }));
    const shown = longevityRecipes.filter((r) => r.category === cat.key);
    for (const r of longevityRecipes) {
      if (shown.includes(r)) expect(screen.getByText(r.name)).toBeInTheDocument();
      else expect(screen.queryByText(r.name)).toBeNull();
    }
    await user.click(screen.getByRole("button", { name: cat.name }));
    expect(screen.getByRole("button", { name: "All Recipes" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByTestId("toggle-mode"));
    expect(screen.getAllByText("Science Note").length).toBe(longevityRecipes.length);
    await user.click(screen.getByTestId("toggle-austere"));
    expect(document.querySelector(".bg-\\[\\#f5f0e8\\]")).not.toBeNull();
  });
});
