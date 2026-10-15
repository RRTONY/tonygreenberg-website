import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/blend-builder/page";

describe("/brewsoul/blend-builder", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Blend Builder — BrewSoul");
    expect(metadata.description).toMatch(/Combine up to 5 coffees/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/blend-builder");
  });

  it("renders exactly one H1 with the real heading", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Blend Builder");
  });
});
