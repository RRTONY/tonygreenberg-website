import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  CloakBadge,
  CloakPanel,
  EvaluatorBadges,
  GradeBadge,
  RadarChart,
  ScoreBar,
  evaluatorBadges,
} from "@/components/marketing/charity-badges";
import { SCORE_DIMENSIONS, type ScoreBreakdown } from "@/lib/content/charity-data";

describe("charity badges", () => {
  it("GradeBadge colours by grade and size", () => {
    const { rerender } = render(<GradeBadge grade="A+" />);
    expect(screen.getByText("A+")).toHaveClass("bg-emerald-100", "text-xs");
    rerender(<GradeBadge grade="F" size="lg" />);
    expect(screen.getByText("F")).toHaveClass("bg-red-100", "text-2xl");
  });

  it("CloakBadge and CloakPanel show the label and description", () => {
    render(
      <>
        <CloakBadge status="mostly-clear" />
        <CloakPanel status="opaque" />
      </>,
    );
    expect(screen.getByText("Mostly Clear")).toBeInTheDocument();
    expect(screen.getByText("Opaque")).toBeInTheDocument();
    expect(screen.getByText("Material information withheld.")).toBeInTheDocument();
  });

  it("ScoreBar shows weight and score with the right colour band", () => {
    const { container } = render(<ScoreBar score={85} label="Transparency" weight={20} />);
    expect(screen.getByText("Transparency")).toBeInTheDocument();
    expect(container).toHaveTextContent("20% weight · 85/100");
    const fill = container.querySelector(".bg-blue-500") as HTMLElement;
    expect(fill.style.width).toBe("85%");
  });

  it("evaluatorBadges builds one badge per rating", () => {
    expect(evaluatorBadges({ givewell: null, cnStars: null, charityWatch: null, candidSeal: null })).toEqual([]);
    const b = evaluatorBadges({ givewell: "top", cnStars: 3, charityWatch: "A+", candidSeal: "platinum" });
    expect(b.map((x) => `${x.label}: ${x.value}`)).toEqual(["GiveWell: Top", "CN: 3 / 4", "CW: A+", "Candid: Platinum"]);
    expect(b[1].cls).toContain("amber");
  });

  it("EvaluatorBadges says Not rated when there are none", () => {
    render(<EvaluatorBadges charity={{ givewell: null, cnStars: null, charityWatch: null, candidSeal: null }} />);
    expect(screen.getByText("Not rated")).toBeInTheDocument();
  });

  it("RadarChart draws one point and label per dimension", () => {
    const scores = Object.fromEntries(SCORE_DIMENSIONS.map((d) => [d.key, 80])) as unknown as ScoreBreakdown;
    const { container } = render(<RadarChart scores={scores} />);
    expect(container.querySelectorAll("circle")).toHaveLength(SCORE_DIMENSIONS.length);
    expect(container.querySelectorAll("text")).toHaveLength(SCORE_DIMENSIONS.length);
    expect(container).toHaveTextContent("Verified Impact");
  });
});
