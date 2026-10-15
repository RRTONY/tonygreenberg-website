import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/processing/page";
import { PROCESSING_METHODS } from "@/lib/content/brewsoul-encyclopedia";

describe("/brewsoul/processing", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Processing Methods — BrewSoul");
    expect(metadata.description).toMatch(/up to 60% of its final flavor/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/processing");
  });

  it("renders exactly one H1 and the Continue Your Journey links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Processing Methods");
    expect(screen.getByText("Continue Your Journey")).toBeInTheDocument();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/varieties", "/brewsoul/farms", "/brewsoul/browse"]) expect(hrefs).toContain(href);
  });

  it("shows one card per real processing method", () => {
    render(<Page />);
    const cards = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(cards).toEqual(PROCESSING_METHODS.map((m) => m.name));
  });
});
