import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourLoveLanguagePage, { metadata } from "@/app/find-your-love-language/page";

describe("/find-your-love-language", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Love Language");
    expect(metadata.description).toMatch(/love language/);
    expect(metadata.alternates?.canonical).toBe("/find-your-love-language");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourLoveLanguagePage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Love Language/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourLoveLanguagePage />);
    expect(container).toHaveTextContent("It's five — and you've been mistranslating.");
    expect(container).toHaveTextContent("Based on the five love languages framework");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourLoveLanguagePage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });
});
