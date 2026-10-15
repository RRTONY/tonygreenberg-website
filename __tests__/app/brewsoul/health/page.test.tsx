import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/health/page";

describe("/brewsoul/health", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Coffee and Health — BrewSoul");
    expect(metadata.description).toMatch(/Every claim cited/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/health");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/\w/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/biodynamic",  "/brewsoul/decaf",  "/brewsoul/prescription"]) expect(hrefs).toContain(href);
  });

  it("cites the real studies behind the longevity claims", () => {
    render(<Page />);
    expect(screen.getAllByText(/Poole et al., BMJ 2017/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Liver Protection").length).toBeGreaterThan(0);
  });
});
