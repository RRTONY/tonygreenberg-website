import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CityDetailTabs, GradeBadge } from "@/components/brewsoul/city-detail-tabs";
import { CITIES, SCORING_DIMENSIONS, type CityData } from "@/lib/content/brewsoul-cities";

const city = CITIES.find((c) => c.bestShops.length > 0)!;

function renderTabs(c: CityData = city) {
  render(<CityDetailTabs city={c} />);
  return userEvent.setup();
}

describe("CityDetailTabs", () => {
  it("opens on the Best tab listing every best shop", () => {
    renderTabs();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(`Best ${city.bestShops.length} Coffee Shops in ${city.name}`);
    for (const s of city.bestShops) expect(screen.getByText(s.name)).toBeInTheDocument();
  });

  it("expands a shop to show its blurb, all 7 score bars and what to order", async () => {
    const user = renderTabs();
    const shop = city.bestShops[0];
    expect(screen.queryByText(shop.blurb)).not.toBeInTheDocument();
    await user.click(screen.getByText(shop.name));
    expect(screen.getByText(shop.blurb)).toBeInTheDocument();
    for (const d of SCORING_DIMENSIONS) expect(screen.getByText(d.label)).toBeInTheDocument();
    expect(screen.getByText(shop.orderThis)).toBeInTheDocument();
    await user.click(screen.getByText(shop.name));
    expect(screen.queryByText(shop.blurb)).not.toBeInTheDocument();
  });

  it("a worst shop shows the crime and where to go instead", async () => {
    const user = renderTabs();
    await user.click(screen.getByRole("button", { name: `Worst ${city.worstShops.length}` }));
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(`Worst ${city.worstShops.length} Coffee Shops`);
    const shop = city.worstShops.find((s) => s.crime) ?? city.worstShops[0];
    await user.click(screen.getByText(shop.name));
    if (shop.crime) expect(screen.getByText(shop.crime)).toBeInTheDocument();
    if (shop.insteadGoTo) expect(screen.getByText(shop.insteadGoTo)).toBeInTheDocument();
  });

  it("switches to the chain report, bridge drinks and non-coffee tabs", async () => {
    const user = renderTabs();
    await user.click(screen.getByRole("button", { name: "Chain Report" }));
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(`Chain Report Card — ${city.name}`);
    if (city.chainScores[0]) expect(screen.getByText(city.chainScores[0].chainName)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Bridge Drinks" }));
    if (city.bridgeDrinks[0]) expect(screen.getByText(city.bridgeDrinks[0].drink)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Not Coffee?" }));
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(`Not a Coffee Person? — ${city.name}`);
    if (city.nonCoffeeSpots[0]) expect(screen.getByText(city.nonCoffeeSpots[0].name)).toBeInTheDocument();
  });

  it("says data is coming soon when a tab has nothing", async () => {
    const user = renderTabs({ ...city, chainScores: [], bridgeDrinks: [], nonCoffeeSpots: [] });
    await user.click(screen.getByRole("button", { name: "Chain Report" }));
    expect(screen.getByText("Chain data coming soon.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Bridge Drinks" }));
    expect(screen.getByText("Bridge drink data coming soon.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Not Coffee?" }));
    expect(screen.getByText("Non-coffee data coming soon.")).toBeInTheDocument();
  });

  it("GradeBadge shows the grade", () => {
    render(<GradeBadge grade="A-" size="lg" />);
    expect(screen.getByText("A-").className).toContain("size-20");
  });
});
