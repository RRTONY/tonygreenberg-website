import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/quiz/page";

describe("/brewsoul/quiz", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Coffee Quiz — BrewSoul");
    expect(metadata.description).toMatch(/perfect coffee match/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/quiz");
  });

  it("renders the taste quiz, starting on the first question", () => {
    render(<Page />);
    expect(screen.getAllByRole("button").length).toBeGreaterThan(1);
    expect(screen.getByText(/1\s*\/\s*\d+|question 1/i)).toBeInTheDocument();
  });
});
