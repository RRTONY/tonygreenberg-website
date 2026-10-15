import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ConsciousnessScalePage, { metadata } from "@/app/consciousness-scale/page";

describe("/consciousness-scale", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Consciousness Scale");
    expect(metadata.description).toMatch(/Hawkins Map of Consciousness/);
    expect(metadata.alternates?.canonical).toBe("/consciousness-scale");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<ConsciousnessScalePage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Where Does Your Consciousness Actually Calibrate\?/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<ConsciousnessScalePage />);
    expect(container).toHaveTextContent("Inspired by David R. Hawkins");
    expect(container).toHaveTextContent("Answer who you are on a Tuesday at 2pm");
    expect(container).toHaveTextContent("Question 1 of 25");
  });

  it("offers a way to start or move through the questions", () => {
    render(<ConsciousnessScalePage />);
    expect(screen.getAllByRole("button", { name: "Next" }).length).toBeGreaterThan(0);
  });
});
