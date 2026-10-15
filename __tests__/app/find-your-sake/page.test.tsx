import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourSakePage, { metadata } from "@/app/find-your-sake/page";

describe("/find-your-sake", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Sake");
    expect(metadata.description).toMatch(/sake archetype across 5 dimensions/);
    expect(metadata.alternates?.canonical).toBe("/find-your-sake");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourSakePage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Sake/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourSakePage />);
    expect(container).toHaveTextContent("Every cup holds a thousand years of intention.");
    expect(container).toHaveTextContent("Sake is not just a drink");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourSakePage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });
});
