import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/directory/page";
import { BREWSOUL_TOTAL_PAGES } from "@/lib/content/brewsoul-directory";

describe("/brewsoul/directory", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Coffee Directory — BrewSoul");
    expect(metadata.description).toMatch(/every page inside BrewSoul/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/directory");
  });

  it("renders one H1 and the real page count", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Everything Inside BrewSoul");
    expect(screen.getByText(`${BREWSOUL_TOTAL_PAGES} pages of coffee intelligence. Every page free.`)).toBeInTheDocument();
  });

  it("points newcomers at the quiz and The First Sip", () => {
    render(<Page />);
    expect(screen.getByRole("link", { name: "Take the Quiz" })).toHaveAttribute("href", "/brewsoul/quiz");
    expect(screen.getByRole("link", { name: "Read The First Sip" })).toHaveAttribute("href", "/brewsoul/first-sip");
  });
});
