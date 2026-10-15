import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeptideMatrixMethodology } from "@/components/marketing/peptide-matrix-methodology";
import { EVIDENCE_CRITERIA, REVIEW_SOURCES } from "@/lib/content/peptide-matrix";

describe("PeptideMatrixMethodology", () => {
  it("keeps the criteria and sources in the HTML while closed (forceMount)", () => {
    render(<PeptideMatrixMethodology />);
    expect(screen.getByRole("button", { name: /Evidence Scoring Methodology/ })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText(EVIDENCE_CRITERIA[0].label)).toBeInTheDocument();
    expect(screen.getByText(REVIEW_SOURCES[0])).toBeInTheDocument();
  });

  it("opens to show the scoring criteria with their points", async () => {
    render(<PeptideMatrixMethodology />);
    await userEvent.setup().click(screen.getByRole("button", { name: /Evidence Scoring Methodology/ }));
    expect(screen.getByRole("button", { name: /Evidence Scoring Methodology/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("heading", { name: "Evidence Score Criteria" })).toBeVisible();
    expect(screen.getByText(EVIDENCE_CRITERIA[0].label).nextElementSibling).toHaveTextContent(EVIDENCE_CRITERIA[0].points);
  });
});
