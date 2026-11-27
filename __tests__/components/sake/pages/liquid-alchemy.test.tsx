import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeLiquidAlchemy } from "@/components/sake/pages/liquid-alchemy";
import { SakeProviders, useAesthetic, useMode } from "@/components/sake/sake-providers";
import { alcoholComparisons, aminoAcids, bioactiveCompounds, healthBenefits } from "@/lib/content/sake/alchemy-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

function Switches() {
  const { toggleMode } = useMode();
  const { toggleAesthetic } = useAesthetic();
  return (
    <>
      <button type="button" onClick={toggleMode}>
        switch mode
      </button>
      <button type="button" onClick={toggleAesthetic}>
        switch look
      </button>
    </>
  );
}

const renderPage = () =>
  render(
    <SakeProviders>
      <Switches />
      <SakeLiquidAlchemy />
    </SakeProviders>,
  );

describe("SakeLiquidAlchemy", () => {
  it("renders the hero, sections, links and disclaimer", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Liquid\s+Alchemy/ })).toBeInTheDocument();
    for (const h of ["10x More Than Wine", "The Bioactive Arsenal", "How Sake Benefits You", "Sake vs. Everything Else"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /Explore Namazake/ })).toHaveAttribute("href", "/sake/namazake");
    expect(screen.getByRole("link", { name: /The EXV Rating System/ })).toHaveAttribute("href", "/sake/exv");
    expect(screen.getByText(/It is not medical advice/)).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/🍶|🍷|🍺|🥃|manuscdn/);
  });

  it("opens an amino acid, a compound (science in Connoisseur mode) and a benefit", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    const aa = aminoAcids[0];
    const aaButton = screen.getAllByRole("button", { name: new RegExp(aa.name) })[0];
    await user.click(aaButton);
    expect(aaButton).toHaveAttribute("aria-expanded", "true");
    expect(aaButton).toHaveTextContent(aa.role);
    await user.click(aaButton);
    expect(aaButton).not.toHaveTextContent(aa.role);

    await user.click(screen.getByRole("button", { name: "switch mode" }));
    const compound = bioactiveCompounds[0];
    await user.click(screen.getAllByRole("button", { name: new RegExp(compound.name) })[0]);
    expect(screen.getAllByRole("button", { name: new RegExp(compound.name) })[0]).toHaveTextContent(compound.science);

    const panel = container.querySelector("#alchemy-benefit-0") as HTMLElement;
    expect(panel).toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(healthBenefits[0].description);
    await user.click(container.querySelector('[aria-controls="alchemy-benefit-0"]') as HTMLElement);
    expect(panel).not.toHaveAttribute("hidden");
    expect(panel).toHaveTextContent("RESEARCH:");
  });

  it("shows six comparisons, then all, and follows the Austere look", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    expect(container.querySelectorAll("tbody tr")).toHaveLength(Math.min(6, alcoholComparisons.length));
    await user.click(screen.getByRole("button", { name: "Show All Comparisons" }));
    expect(container.querySelectorAll("tbody tr")).toHaveLength(alcoholComparisons.length);
    expect(screen.queryByRole("button", { name: "Show All Comparisons" })).toBeNull();
    expect(container.querySelector(".bg-\\[\\#0d1321\\]")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "switch look" }));
    expect(container.querySelector(".bg-\\[\\#f5f0e8\\]")).not.toBeNull();
  });
});
