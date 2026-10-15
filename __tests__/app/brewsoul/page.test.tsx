import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/page";

describe("/brewsoul (welcome)", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Welcome to BrewSoul");
    expect(metadata.description).toMatch(/specialty coffee intelligence platform/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul");
  });

  it("renders the welcome quiz with one H1", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
