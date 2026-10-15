import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/varieties/page";
import { VARIETIES } from "@/lib/content/brewsoul-encyclopedia";

describe("/brewsoul/varieties", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Variety Encyclopedia — BrewSoul");
    expect(metadata.description).toMatch(/genetics, cup profiles/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/varieties");
  });

  it("renders exactly one H1 and the Continue Your Journey links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Variety Encyclopedia");
    expect(screen.getByText("Continue Your Journey")).toBeInTheDocument();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/processing", "/brewsoul/roasters", "/brewsoul/browse"]) expect(hrefs).toContain(href);
  });

  it("lists the real varieties", () => {
    render(<Page />);
    expect(screen.getAllByText(VARIETIES[0].name).length).toBeGreaterThan(0);
  });
});
