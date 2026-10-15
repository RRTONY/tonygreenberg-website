import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/biodynamic/page";

describe("/brewsoul/biodynamic", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Biodynamic Coffee — BrewSoul");
    expect(metadata.description).toMatch(/3 farms, 6 roasters/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/biodynamic");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/\w/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/decaf",  "/brewsoul/health",  "/brewsoul/prescription"]) expect(hrefs).toContain(href);
  });
});
