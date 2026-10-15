import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CharityScorecardPage, { metadata } from "@/app/charity-scorecard/page";
import { STATS } from "@/lib/content/charity-data";

describe("/charity-scorecard", () => {
  it("has its title, a description with the real charity count, and canonical", () => {
    expect(metadata.title).toBe("The Grand Impact Accountability Index — Charity Scorecard");
    expect(metadata.description).toContain(`${STATS.totalCharities} charities.`);
    expect(metadata.alternates?.canonical).toBe("/charity-scorecard");
  });

  it("renders one H1 and the headline stats", () => {
    render(<CharityScorecardPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Where Does Your Dollar\s*Actually Go\?/);
    expect(screen.getByText("Charities Scored")).toBeInTheDocument();
    expect(screen.getByText("Opacity Warnings")).toBeInTheDocument();
    expect(screen.getAllByText(STATS.totalCharities.toString()).length).toBeGreaterThan(0);
  });
});
