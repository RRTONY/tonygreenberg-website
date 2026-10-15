import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/farms/page";
import { FARMS } from "@/lib/content/brewsoul-encyclopedia";

describe("/brewsoul/farms", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Farm Passports — BrewSoul");
    expect(metadata.description).toMatch(/Meet the people who grow your coffee/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/farms");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Farm Passports/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/follow-the-dollar",  "/brewsoul/economics",  "/brewsoul/browse"]) expect(hrefs).toContain(href);
  });

  it("shows every real farm", () => {
    render(<Page />);
    for (const f of FARMS) expect(screen.getAllByText(f.name).length).toBeGreaterThan(0);
  });
});
