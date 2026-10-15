import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourSexualityPage, { metadata } from "@/app/find-your-sexuality/page";

describe("/find-your-sexuality", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Sexuality");
    expect(metadata.description).toMatch(/evidence-based assessment/);
    expect(metadata.alternates?.canonical).toBe("/find-your-sexuality");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourSexualityPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Sexuality/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourSexualityPage />);
    expect(container).toHaveTextContent("The body knows what the mind is still debating.");
    expect(container).toHaveTextContent("without judgment, without labels");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourSexualityPage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });

  it("links on to the next places to go", () => {
    render(<FindYourSexualityPage />);
    expect(screen.getAllByRole("link", { name: new RegExp("Take Another Assessment") })[0]).toHaveAttribute("href", "/find-my");
    expect(screen.getAllByRole("link", { name: new RegExp("Read Related Essays") })[0]).toHaveAttribute("href", "/blog");
    expect(screen.getAllByRole("link", { name: new RegExp("Explore the Ecosystem") })[0]).toHaveAttribute("href", "/ecosystem");
  });
});
