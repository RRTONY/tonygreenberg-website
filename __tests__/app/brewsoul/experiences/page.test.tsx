import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/experiences/page";
import { EXPERIENCES } from "@/lib/content/brewsoul-encyclopedia";

describe("/brewsoul/experiences", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Experience Map — BrewSoul");
    expect(metadata.description).toMatch(/Curated, not sponsored/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/experiences");
  });

  it("renders exactly one H1 and the Continue Your Journey links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Experience Map");
    expect(screen.getByText("Continue Your Journey")).toBeInTheDocument();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/pairings", "/brewsoul/blend-builder", "/brewsoul/browse"]) expect(hrefs).toContain(href);
  });

  it("lists the real experiences", () => {
    render(<Page />);
    expect(screen.getAllByText(EXPERIENCES[0].name).length).toBeGreaterThan(0);
  });
});
