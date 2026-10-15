import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/decaf/page";
import { FAME } from "@/lib/content/brewsoul-decaf";

describe("/brewsoul/decaf", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Swiss Water Decaf: Paint Stripper or Pure Water? — BrewSoul");
    expect(metadata.description).toMatch(/methylene chloride/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/decaf");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/\w/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/biodynamic",  "/brewsoul/health",  "/brewsoul/prescription"]) expect(hrefs).toContain(href);
  });

  it("lists every clean decaf brand", () => {
    render(<Page />);
    for (const b of FAME) expect(screen.getAllByText(b.name).length).toBeGreaterThan(0);
  });
});
