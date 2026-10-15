import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourKitchenPage, { metadata } from "@/app/find-your-kitchen/page";

describe("/find-your-kitchen", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Kitchen");
    expect(metadata.description).toMatch(/cooking style/);
    expect(metadata.alternates?.canonical).toBe("/find-your-kitchen");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourKitchenPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Kitchen/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourKitchenPage />);
    expect(container).toHaveTextContent("The kitchen is the last honest room in the house.");
    expect(container).toHaveTextContent("Fifteen questions to find out who you really are when you cook.");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourKitchenPage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });

  it("links on to the next places to go", () => {
    render(<FindYourKitchenPage />);
    expect(screen.getAllByRole("link", { name: new RegExp("Take Another Assessment") })[0]).toHaveAttribute("href", "/find-my");
    expect(screen.getAllByRole("link", { name: new RegExp("Read Related Essays") })[0]).toHaveAttribute("href", "/blog");
    expect(screen.getAllByRole("link", { name: new RegExp("Explore the Ecosystem") })[0]).toHaveAttribute("href", "/ecosystem");
  });
});
