import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/follow-the-dollar/page";
import { DOLLAR_BREAKDOWNS } from "@/lib/content/brewsoul-encyclopedia";

describe("/brewsoul/follow-the-dollar", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Follow the Dollar — BrewSoul");
    expect(metadata.description).toMatch(/supply-chain economics/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/follow-the-dollar");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Follow the Dollar/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/farms",  "/brewsoul/economics",  "/brewsoul/browse"]) expect(hrefs).toContain(href);
  });

  it("shows the farmer share for each price point", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(DOLLAR_BREAKDOWNS.map((d) => d.segment));
    for (const d of DOLLAR_BREAKDOWNS) {
      expect(screen.getByText(`Farmer gets: $${d.farmerDollars.toFixed(2)} of $${d.totalPrice}`)).toBeInTheDocument();
    }
  });
});
