import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/compare/page";

describe("/brewsoul/compare", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Compare Coffees — BrewSoul");
    expect(metadata.description).toMatch(/up to 4 coffees/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/compare");
  });

  it("renders exactly one H1 with the real heading", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Compare Coffees");
  });
});
