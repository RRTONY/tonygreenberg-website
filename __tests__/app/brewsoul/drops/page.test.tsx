import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/drops/page";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { computeToolScores } from "@/lib/content/brewsoul-tool-scores";

describe("/brewsoul/drops", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Latest Drops — BrewSoul");
    expect(metadata.description).toMatch(/newest arrivals/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/drops");
  });

  it("shows the 12 highest-scoring coffees in score order, each linking to its page", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const expected = [...BREWSOUL_COFFEES]
      .map((c) => ({ c, s: computeToolScores(c).overall || 0 }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map(({ c }) => `/brewsoul/coffee/${c.id}`);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(expected);
    expect(screen.getAllByText("NEW")).toHaveLength(12);
  });
});
