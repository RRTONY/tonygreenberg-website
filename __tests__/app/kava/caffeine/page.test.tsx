import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/kava/caffeine/page";


describe("/kava/caffeine", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Kava and Caffeine Interactions");
    expect(String(metadata.description).length).toBeGreaterThan(40);
    expect(metadata.alternates?.canonical).toBe("/kava/caffeine");
  });

  it("has exactly one H1", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Caffeine Interactions");
  });

  it("ends with the medical disclaimer", () => {
    render(<Page />);
    expect(screen.getByText(/Consult a licensed medical professional/)).toBeInTheDocument();
  });

  it("explains the 56% CYP1A2 slow-down, the cutoff protocol and the head-to-head", () => {
    render(<Page />);
    expect(screen.getByText(/Kava inhibits CYP1A2 by 56%/)).toBeInTheDocument();
    for (const h of ["The Core Biochemical Mechanism", "Caffeine Cutoff Protocol for Threshold Ceremony", "Kava vs. Coffee — Head to Head"])
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    expect(screen.getByText("Adenosine receptor antagonism")).toBeInTheDocument();
  });
});
