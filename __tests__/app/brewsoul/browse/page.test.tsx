import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/browse/page";

describe("/brewsoul/browse", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Browse Coffee — BrewSoul");
    expect(metadata.description).toMatch(/origin, process, roast level/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/browse");
  });

  it("renders the catalog with one H1 and links to coffee pages", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const coffeeLinks = screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("/brewsoul/coffee/"));
    expect(coffeeLinks.length).toBeGreaterThan(0);
  });
});
