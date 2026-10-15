import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TermsPage, { metadata } from "@/app/terms/page";

describe("/terms", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Terms of Use");
    expect(metadata.description).toMatch(/not professional advice/);
    expect(metadata.alternates?.canonical).toBe("/terms");
  });

  it("renders one H1 and the date it was last updated", () => {
    render(<TermsPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Terms of Use");
    expect(screen.getByText(/Last updated October 14, 2026/)).toBeInTheDocument();
  });

  it("has every section of the terms", () => {
    render(<TermsPage />);
    for (const h of [
      "Opinions and education, not professional advice",
      "Your account",
      "What you post",
      "Who owns the content",
      "No warranty",
      "Limitation of liability",
      "Governing law",
      "Changes and contact",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
  });

  it("says plainly that health and investment content is not advice", () => {
    const { container } = render(<TermsPage />);
    expect(container.textContent).toContain("is not medical advice, diagnosis or treatment");
    expect(container.textContent).toContain("Nothing on the site is an offer to sell, or a request to buy, any security or investment.");
  });

  it("links the contact email and the privacy policy", () => {
    render(<TermsPage />);
    expect(screen.getByRole("link", { name: "t@ramprate.com" })).toHaveAttribute("href", "mailto:t@ramprate.com");
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
  });
});
