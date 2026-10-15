import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ASSESSMENTS } from "@/lib/content/assessments-hub";
import AssessmentsPage, { metadata } from "@/app/assessments/page";

describe("/assessments", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Self-Assessment Tools");
    expect(metadata.description).toMatch(/Dharma Finder, Consciousness Scale, and the Grant Study Assessment/);
    expect(metadata.alternates?.canonical).toBe("/assessments");
  });

  it("renders one H1 and the real intro copy", () => {
    const { container } = render(<AssessmentsPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Three Maps\.\s*One Journey\./);
    expect(container).toHaveTextContent("Purpose. Consciousness. Satisfaction.");
    expect(container).toHaveTextContent("Together, they're a triangulation of the soul.");
  });

  it("starts with the first assessment", () => {
    render(<AssessmentsPage />);
    expect(screen.getByRole("link", { name: /Begin Your First Assessment/ })).toHaveAttribute("href", `/${ASSESSMENTS[0].slug}`);
  });

  it("lists a card for each of the three assessments", () => {
    render(<AssessmentsPage />);
    expect(ASSESSMENTS).toHaveLength(3);
    for (const a of ASSESSMENTS) {
      expect(screen.getByRole("heading", { level: 2, name: a.title })).toBeInTheDocument();
      expect(screen.getAllByRole("link").some((l) => l.getAttribute("href") === `/${a.slug}`)).toBe(true);
    }
  });
});
