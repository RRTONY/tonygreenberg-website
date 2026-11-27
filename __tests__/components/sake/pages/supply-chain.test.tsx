import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeSupplyChain, SakeSupplyChainFromQuery } from "@/components/sake/pages/supply-chain";
import { SakeProviders, useAesthetic } from "@/components/sake/sake-providers";
import { carbonTiers, getAllSupplyChainsSortedByCarbon, usBreweries } from "@/lib/content/sake/supply-chain-engine";
import { navigation } from "@tests/helpers/next";

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

const wrap = (ui: React.ReactNode) =>
  render(
    <SakeProviders>
      <LookSwitch />
      {ui}
    </SakeProviders>,
  );

const sorted = getAllSupplyChainsSortedByCarbon();

beforeEach(() => {
  navigation.searchParams = new URLSearchParams();
});

describe("SakeSupplyChain", () => {
  it("renders the carbon view: American breweries, tiers, the sake list and the Juyondai story", () => {
    wrap(<SakeSupplyChain />);
    expect(screen.getByRole("heading", { level: 1, name: /Where Every\s+Dollar Goes/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Zero Ocean Miles" })).toBeInTheDocument();
    for (const b of usBreweries) expect(screen.getByText(b.name)).toBeInTheDocument();
    for (const tier of carbonTiers) expect(screen.getAllByText(tier.tier).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { level: 3, name: "The Juyondai Problem" })).toBeInTheDocument();
  });

  it("switches views and opens a sake's dollar map with its links", async () => {
    const user = userEvent.setup();
    wrap(<SakeSupplyChain />);
    await user.click(screen.getByRole("button", { name: "Integrity Score" }));
    expect(screen.getByRole("heading", { level: 2, name: "Who's Trying Hard vs Too Hard" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: "Zero Ocean Miles" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Dollar Map" }));
    expect(screen.getByRole("heading", { level: 2, name: "Follow Every Dollar" })).toBeInTheDocument();

    const first = sorted[0];
    const row = screen.getByRole("button", { name: new RegExp(first.productName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) });
    await user.click(row);
    expect(row).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Where Your Dollar Goes")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View & Buy" })).toHaveAttribute("href", `/sake/bottle/${first.productId}`);
    expect(screen.getByRole("link", { name: "Find Retailer" }).getAttribute("href")).toMatch(/^\/sake\/retailer-finder\?sake=/);
    await user.click(row);
    expect(screen.queryByText("Where Your Dollar Goes")).toBeNull();
  });

  it("opens the sake named in ?sake= and ignores unknown ids", () => {
    const target = sorted[1];
    navigation.searchParams = new URLSearchParams(`sake=${target.productId}`);
    const { unmount } = wrap(<SakeSupplyChainFromQuery />);
    expect(screen.getByText("Where Your Dollar Goes")).toBeInTheDocument();
    unmount();
    navigation.searchParams = new URLSearchParams("sake=not-a-sake");
    wrap(<SakeSupplyChainFromQuery />);
    expect(screen.queryByText("Where Your Dollar Goes")).toBeNull();
  });

  it("follows the Austere look", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<SakeSupplyChain />);
    expect(container.querySelector(".bg-\\[\\#0a0e1a\\]")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "switch look" }));
    expect(container.querySelector(".bg-stone-50")).not.toBeNull();
  });
});
