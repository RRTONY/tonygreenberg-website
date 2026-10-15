import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/chains/page";
import { CHAIN_RANKINGS } from "@/lib/content/brewsoul-chains";

describe("/brewsoul/chains", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Top 100 Coffee Chains — BrewSoul");
    expect(metadata.description).toMatch(/five dimensions/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/chains");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Top 100 Coffee Chains/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/submit",  "/brewsoul/browse",  "/brewsoul/quiz",  "/brewsoul/follow-the-dollar"]) expect(hrefs).toContain(href);
  });

  it("starts the ranking with the real top chain", () => {
    render(<Page />);
    expect(screen.getAllByText(CHAIN_RANKINGS[0].name).length).toBeGreaterThan(0);
  });
});
