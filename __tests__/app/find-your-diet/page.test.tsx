import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourDietPage, { metadata } from "@/app/find-your-diet/page";

describe("/find-your-diet", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Diet");
    expect(metadata.description).toMatch(/nutritional approach/);
    expect(metadata.alternates?.canonical).toBe("/find-your-diet");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourDietPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Diet/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourDietPage />);
    expect(container).toHaveTextContent("Your body has been trying to tell you what it needs.");
    expect(container).toHaveTextContent("This isn't another meal plan quiz.");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourDietPage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });

  it("links on to the next places to go", () => {
    render(<FindYourDietPage />);
    expect(screen.getAllByRole("link", { name: new RegExp("Take Another Assessment") })[0]).toHaveAttribute("href", "/find-my");
    expect(screen.getAllByRole("link", { name: new RegExp("Read Related Essays") })[0]).toHaveAttribute("href", "/blog");
    expect(screen.getAllByRole("link", { name: new RegExp("Explore the Ecosystem") })[0]).toHaveAttribute("href", "/ecosystem");
  });
});
