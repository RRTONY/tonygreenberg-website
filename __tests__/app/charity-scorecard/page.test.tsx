import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CharityScorecardPage, { metadata } from "@/app/charity-scorecard/page";
import { CHARITIES, STATS } from "@/lib/content/charity-data";

describe("/charity-scorecard", () => {
  it("has its title, a description with the real charity count, and canonical", () => {
    expect(metadata.title).toEqual({ absolute: "The Grand Impact Accountability Index — Charity Scorecard" });
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
  it("links every charity's own page in the HTML, without opening a row first", () => {
    const { container } = render(<CharityScorecardPage />);
    const hrefs = new Set([...container.querySelectorAll("a")].map((a) => a.getAttribute("href")));
    for (const c of CHARITIES) expect(hrefs.has(`/charity-scorecard/${c.slug}`)).toBe(true);
    expect(screen.getByText(`All ${CHARITIES.length} charities, by sector`).closest("details")).not.toHaveAttribute("open");
  });
});
