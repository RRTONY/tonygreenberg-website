import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourTherapyPage, { metadata } from "@/app/find-your-therapy/page";

describe("/find-your-therapy", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Therapy");
    expect(metadata.description).toMatch(/therapeutic archetype across 6 dimensions/);
    expect(metadata.alternates?.canonical).toBe("/find-your-therapy");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourTherapyPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Therapy/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourTherapyPage />);
    expect(container).toHaveTextContent("The right therapy isn't about fixing what's broken.");
    expect(container).toHaveTextContent("CBT, psychodynamic, somatic, EMDR");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourTherapyPage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });
});
