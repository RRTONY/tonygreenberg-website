import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourCoffeePage, { metadata } from "@/app/find-your-coffee/page";

describe("/find-your-coffee", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Coffee");
    expect(metadata.description).toMatch(/coffee archetype across 6 dimensions/);
    expect(metadata.alternates?.canonical).toBe("/find-your-coffee");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourCoffeePage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your\s*Coffee/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourCoffeePage />);
    expect(container).toHaveTextContent("Every cup is a conversation between");
    expect(container).toHaveTextContent("DISCOVER YOUR ARCHETYPE");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourCoffeePage />);
    expect(screen.getAllByRole("button", { name: "Begin the Ritual" }).length).toBeGreaterThan(0);
  });
});
