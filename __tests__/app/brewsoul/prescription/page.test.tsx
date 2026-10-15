import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/prescription/page";

describe("/brewsoul/prescription", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Coffee Prescription — BrewSoul");
    expect(metadata.description).toMatch(/health goals, taste preferences/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/prescription");
  });

  it("renders the wizard and the three next-step links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/biodynamic", "/brewsoul/decaf", "/brewsoul/health"]) expect(hrefs).toContain(href);
  });
});
