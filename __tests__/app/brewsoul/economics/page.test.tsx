import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/economics/page";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { ROASTERS, VARIETIES } from "@/lib/content/brewsoul-encyclopedia";

describe("/brewsoul/economics", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Economics Dashboard — BrewSoul");
    expect(metadata.description).toMatch(/farmer equity/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/economics");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Economics Dashboard/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/follow-the-dollar",  "/brewsoul/farms",  "/brewsoul/chains"]) expect(hrefs).toContain(href);
  });

  it("shows live counts from the catalog, not hardcoded numbers", () => {
    render(<Page />);
    const origins = new Set(BREWSOUL_COFFEES.map((c) => c.originCountry)).size;
    const pairs: [string, number][] = [["Coffees", BREWSOUL_COFFEES.length], ["Origins", origins], ["Roasters", ROASTERS.length], ["Varieties", VARIETIES.length]];
    for (const [label, value] of pairs) {
      const match = screen.getAllByText(label).find((el) => el.parentElement?.textContent === `${value}${label}`);
      expect(match, `${label} = ${value}`).toBeTruthy();
    }
  });
});
