import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourMovementPage, { metadata } from "@/app/find-your-movement/page";

describe("/find-your-movement", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Movement");
    expect(metadata.description).toMatch(/movement assessment/);
    expect(metadata.alternates?.canonical).toBe("/find-your-movement");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourMovementPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Movement/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourMovementPage />);
    expect(container).toHaveTextContent("The body moves the way the soul needs to go.");
    expect(container).toHaveTextContent("Not a fitness quiz.");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourMovementPage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });

  it("links on to the next places to go", () => {
    render(<FindYourMovementPage />);
    expect(screen.getAllByRole("link", { name: new RegExp("Take Another Assessment") })[0]).toHaveAttribute("href", "/find-my");
    expect(screen.getAllByRole("link", { name: new RegExp("Read Related Essays") })[0]).toHaveAttribute("href", "/blog");
    expect(screen.getAllByRole("link", { name: new RegExp("Explore the Ecosystem") })[0]).toHaveAttribute("href", "/ecosystem");
  });
});
