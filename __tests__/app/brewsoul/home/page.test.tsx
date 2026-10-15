import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/home/page";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { SHAME_ENTRIES } from "@/lib/content/brewsoul-encyclopedia";
import { computeQPR } from "@/lib/intelligence-engine/scoring";

describe("/brewsoul/home", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("BrewSoul — Specialty Coffee Intelligence");
    expect(metadata.description).toMatch(/\w/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/home");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/\w/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/quiz",  "/brewsoul/browse",  "/brewsoul/chains",  "/brewsoul/drops",  "/brewsoul/wall-of-shame",  "/brewsoul/biodynamic",  "/brewsoul/decaf",  "/brewsoul/health",  "/brewsoul/prescription"]) expect(hrefs).toContain(href);
  });

  it("features the six best-value coffees by QPR", () => {
    render(<Page />);
    const top = [...BREWSOUL_COFFEES].sort((a, b) => computeQPR(b, BREWSOUL_COFFEES) - computeQPR(a, BREWSOUL_COFFEES)).slice(0, 6);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const c of top) expect(hrefs).toContain(`/brewsoul/coffee/${c.id}`);
  });

  it("previews the top three Wall of Shame entries", () => {
    render(<Page />);
    const text = document.body.textContent ?? "";
    for (const s of SHAME_ENTRIES.slice(0, 3)) expect(text).toContain(s.brand);
    expect(text).not.toContain(SHAME_ENTRIES[3].brand);
  });
});
