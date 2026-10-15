import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/cities/page";
import { CITIES } from "@/lib/content/brewsoul-cities";

describe("/brewsoul/cities", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Coffee Cities — BrewSoul");
    expect(metadata.description).toMatch(/25 American cities/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/cities");
  });

  it("renders one H1 and a card for all 25 cities, linking only those with shop data", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 3 }).filter((h) => CITIES.some((c) => c.name === h.textContent))).toHaveLength(25);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const c of CITIES) {
      if (c.bestShops.length > 0) expect(hrefs).toContain(`/brewsoul/cities/${c.slug}`);
      else expect(hrefs).not.toContain(`/brewsoul/cities/${c.slug}`);
    }
  });
});
