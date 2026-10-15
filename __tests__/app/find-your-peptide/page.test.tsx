import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourPeptidePage, { metadata } from "@/app/find-your-peptide/page";

describe("/find-your-peptide", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Peptide — The Peptide Clarity Index™");
    expect(metadata.description).toMatch(/7 clinical axes/);
    expect(metadata.alternates?.canonical).toBe("/find-your-peptide");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourPeptidePage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Peptide/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourPeptidePage />);
    expect(container).toHaveTextContent("Your biology is speaking in molecules.");
    expect(container).toHaveTextContent("Peptides are the body's signaling molecules");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourPeptidePage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });
});
