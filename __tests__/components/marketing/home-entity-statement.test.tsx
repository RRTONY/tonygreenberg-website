import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeEntityStatement } from "@/components/marketing/home-entity-statement";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { CHAIN_RANKINGS } from "@/lib/content/brewsoul-chains";

describe("HomeEntityStatement", () => {
  it("is a labelled section with the entity copy and live BrewSoul counts", () => {
    render(<HomeEntityStatement />);
    const section = screen.getByRole("region", { name: "About Tony Greenberg" });
    expect(section).toHaveTextContent("Tony Greenberg is a strategist, author, and CEO of RampRate");
    expect(section).toHaveTextContent(`${BREWSOUL_COFFEES.length} specialty coffees and ${CHAIN_RANKINGS.length} coffee chains`);
  });

  it("links to the ecosystem page", () => {
    render(<HomeEntityStatement />);
    expect(screen.getByRole("link", { name: /Explore the RampRate, ImpactSoul and BrewSoul ecosystem/ })).toHaveAttribute("href", "/ecosystem");
  });
});
