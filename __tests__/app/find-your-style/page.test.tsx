import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourStylePage, { metadata } from "@/app/find-your-style/page";

describe("/find-your-style", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Style");
    expect(metadata.description).toMatch(/personal style/);
    expect(metadata.alternates?.canonical).toBe("/find-your-style");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourStylePage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Style/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourStylePage />);
    expect(container).toHaveTextContent("Style isn't what you wear. It's what you can't hide.");
    expect(container).toHaveTextContent("Fifteen questions to find the style that was always there.");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourStylePage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });

  it("links on to the next places to go", () => {
    render(<FindYourStylePage />);
    expect(screen.getAllByRole("link", { name: new RegExp("Take Another Assessment") })[0]).toHaveAttribute("href", "/find-my");
    expect(screen.getAllByRole("link", { name: new RegExp("Read Related Essays") })[0]).toHaveAttribute("href", "/blog");
    expect(screen.getAllByRole("link", { name: new RegExp("Explore the Ecosystem") })[0]).toHaveAttribute("href", "/ecosystem");
  });
});
