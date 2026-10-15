import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/pairings/page";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { FLIGHTS } from "@/lib/content/brewsoul-encyclopedia";

describe("/brewsoul/pairings", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Coffee Pairings — BrewSoul");
    expect(metadata.description).toMatch(/flavor chemistry/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/pairings");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Coffee Pairings/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/experiences",  "/brewsoul/blend-builder",  "/brewsoul/browse"]) expect(hrefs).toContain(href);
  });

  it("links each tasting-flight coffee that exists to its page", () => {
    render(<Page />);
    const ids = new Set(BREWSOUL_COFFEES.map((c) => c.id));
    const linked = screen.getAllByRole("link").map((a) => a.getAttribute("href")).filter((h) => h?.startsWith("/brewsoul/coffee/"));
    const expected = FLIGHTS.flatMap((f) => f.coffeeIds).filter((id) => ids.has(id)).map((id) => `/brewsoul/coffee/${id}`);
    expect(linked).toEqual(expected);
  });

  it("every coffee a flight names exists in the catalog", () => {
    const ids = new Set(BREWSOUL_COFFEES.map((c) => c.id));
    expect(FLIGHTS.flatMap((f) => f.coffeeIds).filter((id) => !ids.has(id))).toEqual([]);
  });
});
