import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/mold-free/page";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";

describe("/brewsoul/mold-free", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Mold-Free Verified — BrewSoul");
    expect(metadata.description).toMatch(/independently tested/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/mold-free");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Mold-Free Verified/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/health",  "/brewsoul/wall-of-shame",  "/brewsoul/browse"]) expect(hrefs).toContain(href);
  });

  it("links every verified and claimed coffee, and no untested one", () => {
    render(<Page />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href")).filter((h) => h?.startsWith("/brewsoul/coffee/"));
    const expected = BREWSOUL_COFFEES.filter((c) => c.moldTestStatus === "verified" || c.moldTestStatus === "claims").map((c) => `/brewsoul/coffee/${c.id}`);
    expect(expected.length).toBeGreaterThan(0);
    expect([...hrefs].sort()).toEqual([...expected].sort());
  });
});
