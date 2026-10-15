import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";

describe("AssessmentRadarChart", () => {
  it("draws one point and one label per dimension, plus 4 rings and a spoke each", () => {
    const { container } = render(<AssessmentRadarChart scores={{ A: 1, B: 2, C: 3 }} max={4} accentColor="#123456" />);
    expect(container.querySelectorAll("circle")).toHaveLength(3);
    expect([...container.querySelectorAll("text")].map((t) => t.textContent)).toEqual(["A", "B", "C"]);
    expect(container.querySelectorAll("line")).toHaveLength(3);
    expect(container.querySelectorAll("path")).toHaveLength(5);
  });

  it("scales values against max and clamps out-of-range values", () => {
    const { container } = render(<AssessmentRadarChart scores={{ A: 10, B: -5 }} max={5} accentColor="#123456" />);
    const [a, b] = [...container.querySelectorAll("circle")];
    // A is clamped to max: full radius (110) straight up from the centre (150,150).
    expect(Number(a.getAttribute("cx"))).toBeCloseTo(150);
    expect(Number(a.getAttribute("cy"))).toBeCloseTo(40);
    // B is clamped to 0: the centre.
    expect(Number(b.getAttribute("cx"))).toBeCloseTo(150);
    expect(Number(b.getAttribute("cy"))).toBeCloseTo(150);
  });

  it("uses the accent color for the data shape", () => {
    const { container } = render(<AssessmentRadarChart scores={{ A: 1, B: 1, C: 1 }} max={2} accentColor="#ABCDEF" />);
    const data = [...container.querySelectorAll("path")].find((p) => p.getAttribute("stroke") === "#ABCDEF");
    expect(data?.getAttribute("fill")).toBe("#ABCDEF26");
  });
});
