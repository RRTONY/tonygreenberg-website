import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourSleepPage, { metadata } from "@/app/find-your-sleep/page";

describe("/find-your-sleep", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Sleep");
    expect(metadata.description).toMatch(/chronotype/);
    expect(metadata.alternates?.canonical).toBe("/find-your-sleep");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourSleepPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Sleep/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourSleepPage />);
    expect(container).toHaveTextContent("The night knows things the day refuses to admit.");
    expect(container).toHaveTextContent("Your sleep architecture is as unique as your fingerprint.");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourSleepPage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });

  it("links on to the next places to go", () => {
    render(<FindYourSleepPage />);
    expect(screen.getAllByRole("link", { name: new RegExp("Take Another Assessment") })[0]).toHaveAttribute("href", "/find-my");
    expect(screen.getAllByRole("link", { name: new RegExp("Read Related Essays") })[0]).toHaveAttribute("href", "/blog");
    expect(screen.getAllByRole("link", { name: new RegExp("Explore the Ecosystem") })[0]).toHaveAttribute("href", "/ecosystem");
  });
});
