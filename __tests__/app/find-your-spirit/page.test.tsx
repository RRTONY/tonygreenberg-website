import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourSpiritPage, { metadata } from "@/app/find-your-spirit/page";

describe("/find-your-spirit", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Spirit");
    expect(metadata.description).toMatch(/35-question assessment/);
    expect(metadata.alternates?.canonical).toBe("/find-your-spirit");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourSpiritPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Spirit/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourSpiritPage />);
    expect(container).toHaveTextContent("The spirit doesn't need to be found. It needs to be remembered.");
    expect(container).toHaveTextContent("Not religion. Not dogma.");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourSpiritPage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });
});
