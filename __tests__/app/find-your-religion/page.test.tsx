import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourReligionPage, { metadata } from "@/app/find-your-religion/page";

describe("/find-your-religion", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Religion");
    expect(metadata.description).toMatch(/spiritual archetype across 8 dimensions/);
    expect(metadata.alternates?.canonical).toBe("/find-your-religion");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourReligionPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Religion/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourReligionPage />);
    expect(container).toHaveTextContent("Faith isn't inherited. It's discovered.");
    expect(container).toHaveTextContent("No judgment. No conversion.");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourReligionPage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });
});
