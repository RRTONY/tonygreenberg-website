import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/wall-of-shame/page";
import { SHAME_ENTRIES } from "@/lib/content/brewsoul-encyclopedia";

describe("/brewsoul/wall-of-shame", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Wall of Shame — BrewSoul");
    expect(metadata.description).toMatch(/exploit farmers/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/wall-of-shame");
  });

  it("renders exactly one H1 and the Continue Your Journey links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Wall of Shame");
    expect(screen.getByText("Continue Your Journey")).toBeInTheDocument();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/browse", "/brewsoul/mold-free", "/brewsoul/chains"]) expect(hrefs).toContain(href);
  });

  it("names the real brands on the wall", () => {
    render(<Page />);
    const names = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(names).toEqual(SHAME_ENTRIES.map((s) => `#${s.rank} ${s.brand}`));
  });
});
