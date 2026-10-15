import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CitiesExplorer } from "@/components/brewsoul/cities-explorer";
import { CITIES, NATIONAL_STATS, NUANCED_CHAINS, SCORING_DIMENSIONS, UNIVERSAL_CHAINS } from "@/lib/content/brewsoul-cities";

const cityNames = () =>
  screen
    .queryAllByRole("heading", { level: 3 })
    .map((h) => h.textContent)
    .filter((t) => CITIES.some((c) => c.name === t));

function renderIt() {
  render(<CitiesExplorer cities={CITIES} nationalStats={NATIONAL_STATS} />);
  return userEvent.setup();
}

describe("CitiesExplorer", () => {
  it("shows the hero, the national stats and all 25 cities", () => {
    renderIt();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/The Best & Worst Coffee\s*in 25 American Cities/);
    expect(screen.getByText("1,250")).toBeInTheDocument();
    expect(screen.getByText(NATIONAL_STATS.bestShopNational)).toBeInTheDocument();
    expect(cityNames()).toEqual(CITIES.map((c) => c.name));
  });

  it.each(["A", "B", "C"])("the %s-Grade filter keeps only cities with that letter grade", async (letter) => {
    const user = renderIt();
    await user.click(screen.getByRole("button", { name: `${letter}-Grade` }));
    expect(cityNames()).toEqual(CITIES.filter((c) => c.grade.startsWith(letter)).map((c) => c.name));
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(cityNames()).toHaveLength(CITIES.length);
  });

  it("only links cities that have shop-level data", () => {
    renderIt();
    const linked = screen.getAllByRole("link").map((a) => a.getAttribute("href")).filter((h) => h?.startsWith("/brewsoul/cities/"));
    expect(linked).toEqual(CITIES.filter((c) => c.bestShops.length > 0).map((c) => `/brewsoul/cities/${c.slug}`));
    expect(screen.getAllByText("Full data coming soon")).toHaveLength(CITIES.filter((c) => c.bestShops.length === 0).length);
  });

  it("shows four chains, then the rest and the nuanced chains on Show All", async () => {
    const user = renderIt();
    expect(screen.getByText(UNIVERSAL_CHAINS[0].chainName)).toBeInTheDocument();
    expect(screen.queryByText(NUANCED_CHAINS[0].chainName)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show All" }));
    expect(screen.getByText(NUANCED_CHAINS[0].chainName)).toBeInTheDocument();
    if (UNIVERSAL_CHAINS.length > 4) expect(screen.getByText(UNIVERSAL_CHAINS[4].chainName)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Hide" }));
    expect(screen.queryByText(NUANCED_CHAINS[0].chainName)).not.toBeInTheDocument();
  });

  it("opens and closes the methodology with all 7 scoring dimensions", async () => {
    const user = renderIt();
    await user.click(screen.getByRole("button", { name: "Our Methodology" }));
    expect(screen.getByRole("heading", { name: "Scoring Methodology" })).toBeInTheDocument();
    for (const d of SCORING_DIMENSIONS) expect(screen.getByText(d.label)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("heading", { name: "Scoring Methodology" })).not.toBeInTheDocument();
  });
});
