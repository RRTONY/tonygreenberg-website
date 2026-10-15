import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/collection/page";

describe("/brewsoul/collection", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("My Collection — BrewSoul");
    expect(metadata.description).toMatch(/saved, tried/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/collection");
  });

  it("renders exactly one H1 with the real heading", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("My Collection");
  });
});
