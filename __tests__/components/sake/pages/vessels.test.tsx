import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeVessels } from "@/components/sake/pages/vessels";
import { SakeProviders, useMode } from "@/components/sake/sake-providers";
import { pairingMatrix, vesselGuides } from "@/lib/content/sake/vessels-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

function ModeSwitch() {
  const { toggleMode } = useMode();
  return (
    <button type="button" onClick={toggleMode}>
      switch mode
    </button>
  );
}

const renderPage = () =>
  render(
    <SakeProviders>
      <ModeSwitch />
      <SakeVessels />
    </SakeProviders>,
  );

describe("SakeVessels", () => {
  it("renders the hero, every vessel and the pairing matrix", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /The Cup Shapes/ })).toBeInTheDocument();
    for (const v of vesselGuides) expect(screen.getAllByText(v.kanji).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { level: 2, name: "The Pairing Matrix" })).toBeInTheDocument();
    for (const row of pairingMatrix) expect(screen.getAllByText(row.style).length).toBeGreaterThan(0);
    expect(container.querySelectorAll("tbody tr")).toHaveLength(pairingMatrix.length);
    expect(container.innerHTML).not.toMatch(/manuscdn/);
  });

  it("switches vessel and keeps closed sections in the page", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    const second = vesselGuides[1];
    await user.click(screen.getByRole("button", { name: new RegExp(second.name) }));
    expect(screen.getByRole("heading", { level: 2, name: second.name })).toBeInTheDocument();

    const ritual = container.querySelector("#vessel-section-ritual") as HTMLElement;
    expect(ritual).toHaveAttribute("hidden");
    expect(ritual).toHaveTextContent(second.ritual);
    const toggle = screen.getByRole("button", { name: /The Ritual/ });
    await user.click(toggle);
    expect(ritual).not.toHaveAttribute("hidden");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(toggle);
    expect(ritual).toHaveAttribute("hidden");
  });

  it("shows the connoisseur note only in Connoisseur mode", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.queryByText("Connoisseur's Deep Note")).toBeNull();
    await user.click(screen.getByRole("button", { name: "switch mode" }));
    expect(screen.getByText("Connoisseur's Deep Note")).toBeInTheDocument();
  });
});
