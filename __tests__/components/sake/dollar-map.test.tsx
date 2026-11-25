import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DollarMap } from "@/components/sake/dollar-map";
import { SakeProviders, useAesthetic } from "@/components/sake/sake-providers";
import { generateSupplyChainMap, sakeSupplyChains } from "@/lib/content/sake/supply-chain-engine";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

function LookSwitch() {
  const { toggleAesthetic } = useAesthetic();
  return (
    <button type="button" onClick={toggleAesthetic}>
      switch look
    </button>
  );
}

const map = generateSupplyChainMap(sakeSupplyChains[0]);

const wrap = (ui: React.ReactNode) =>
  render(
    <SakeProviders>
      <LookSwitch />
      {ui}
    </SakeProviders>,
  );

describe("DollarMap", () => {
  it("shows the stats, one card per step, the dollar bar and the restaurant path", () => {
    const { container } = wrap(<DollarMap supplyChain={map} />);
    expect(screen.getByText("Retail Price")).toBeInTheDocument();
    expect(screen.getByText(`$${map.totalRetailPrice}`)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(map.nodes.length);
    expect(screen.getByText("Where Your Dollar Goes")).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBe(6);
    if (map.restaurantMarkup) expect(screen.getByText("Restaurant Path")).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/style="[^"]*color/);
  });

  it("switches to the carbon view and opens a step's details", async () => {
    const user = userEvent.setup();
    wrap(<DollarMap supplyChain={map} />);
    await user.click(screen.getByRole("button", { name: /Carbon Journey/ }));
    expect(screen.getByRole("button", { name: /Carbon Journey/ })).toHaveAttribute("aria-pressed", "true");
    const node = screen.getAllByRole("button", { expanded: false })[0];
    await user.click(node);
    expect(node).toHaveAttribute("aria-expanded", "true");
    expect(node).toHaveTextContent("Cost In");
    expect(node).toHaveTextContent(map.nodes[0].notes);
    await user.click(screen.getByRole("button", { name: /Dollar Flow/ }));
    expect(screen.getByRole("button", { name: /Dollar Flow/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("hides the restaurant step and the stats when asked, and follows the Austere look", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<DollarMap supplyChain={map} showRestaurant={false} compact />);
    expect(screen.queryByText("Retail Price")).toBeNull();
    expect(screen.queryByText("Restaurant Path")).toBeNull();
    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(map.nodes.filter((n) => n.role !== "restaurant").length);
    await user.click(screen.getByRole("button", { name: "switch look" }));
    expect(container.querySelector(".bg-stone-100")).not.toBeNull();
  });
});
