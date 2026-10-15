import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/esoteric/page";
import { ESOTERIC_COFFEES } from "@/lib/content/brewsoul-esoteric";

describe("/brewsoul/esoteric", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Esoteric Coffee Index — BrewSoul");
    expect(metadata.description).toMatch(/legendary coffees/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/esoteric");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Esoteric Coffee Index/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/browse",  "/brewsoul/varieties",  "/brewsoul/home"]) expect(hrefs).toContain(href);
  });

  it("links every buy source out in a new tab", () => {
    render(<Page />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const c of ESOTERIC_COFFEES) for (const s of c.buySources) expect(hrefs).toContain(s.url);
    const external = screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("http"));
    for (const a of external) expect(a).toHaveAttribute("target", "_blank");
  });
});
