import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourJourneyPage, { metadata } from "@/app/find-your-journey/page";

describe("/find-your-journey", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Journey");
    expect(metadata.description).toMatch(/Five questions/);
    expect(metadata.alternates?.canonical).toBe("/find-your-journey");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourJourneyPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Not what you should read\.\s*What you can't stop thinking about\./);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourJourneyPage />);
    expect(container).toHaveTextContent("5 Questions. Your Path.");
    expect(container).toHaveTextContent("Ninety-one essays. Six territories.");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourJourneyPage />);
    expect(screen.getAllByRole("button", { name: /^Begin$/ }).length).toBeGreaterThan(0);
  });
});
