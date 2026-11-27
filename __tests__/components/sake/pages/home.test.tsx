import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeHome, adventureCards, cultureCards, deepCards } from "@/components/sake/pages/home";
import { SakeProviders, useAesthetic } from "@/components/sake/sake-providers";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

function AustereToggle() {
  const { toggleAesthetic } = useAesthetic();
  return (
    <button type="button" onClick={toggleAesthetic}>
      toggle look
    </button>
  );
}

describe("SakeHome", () => {
  it("renders the hero, every section and every card link under /sake", () => {
    const { container } = render(
      <SakeProviders>
        <SakeHome />
      </SakeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "SAKE" })).toBeInTheDocument();
    expect(screen.getByText("What enters the mouth must speak to the mind and stay with the heart.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Find Your Sake by Aroma/ })).toHaveAttribute("href", "/sake/aroma");
    expect(screen.getByRole("link", { name: /Explore the Collection/ })).toHaveAttribute("href", "/sake/collection");
    for (const name of [/Be the\s+Glitch/, /Two Ways to Measure\s+Magic/, /Choose Your\s+Adventure/, /The Deep\s+Culture/, /The Deeper\s+Layers/]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
    for (const card of [...adventureCards, ...cultureCards, ...deepCards]) {
      expect(screen.getAllByRole("link", { name: new RegExp(card.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) })[0]).toHaveAttribute(
        "href",
        `/sake${card.href}`,
      );
    }
    expect(screen.getByText("Extraordinary Value Index")).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/manuscdn/);
  });

  it("swaps the hero for the plain Austere look", async () => {
    const user = userEvent.setup();
    render(
      <SakeProviders>
        <AustereToggle />
        <SakeHome />
      </SakeProviders>,
    );
    expect(screen.getByText("for Sake's Sake")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "toggle look" }));
    expect(screen.getByText("for sake's sake")).toBeInTheDocument();
  });
});
