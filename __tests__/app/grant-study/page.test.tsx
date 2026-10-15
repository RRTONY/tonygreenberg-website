import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import GrantStudyPage, { metadata } from "@/app/grant-study/page";

describe("/grant-study", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Grant Study Assessment");
    expect(metadata.description).toMatch(/85 years, 724 lives/);
    expect(metadata.alternates?.canonical).toBe("/grant-study");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<GrantStudyPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/The Grant Study Life Satisfaction Assessment/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<GrantStudyPage />);
    expect(container).toHaveTextContent("Based on 85 Years of Harvard Research");
    expect(container).toHaveTextContent("Beginning in 1938, it followed 724 participants");
    expect(container).toHaveTextContent("Question 1 of 25");
  });

  it("offers a way to start or move through the questions", () => {
    render(<GrantStudyPage />);
    expect(screen.getAllByRole("button", { name: "Next" }).length).toBeGreaterThan(0);
  });
});
