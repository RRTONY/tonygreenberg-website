import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/first-sip/page";

describe("/brewsoul/first-sip", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("First Sip — BrewSoul");
    expect(metadata.description).toMatch(/guided introduction/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/first-sip");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/\w/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/economics",  "/brewsoul/compare",  "/brewsoul/health",  "/brewsoul/prescription",  "/brewsoul/pairings",  "/blog/forever-chemicals-in-my-blood-pfas-and-microplastics",  "/blog/how-to-alienate-a-loyal-vegan"]) expect(hrefs).toContain(href);
  });
});
