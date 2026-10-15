import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CostCalculator } from "@/components/brewsoul/cost-calculator";

const cost = (label: string) => screen.getByText(label).nextElementSibling?.textContent;

describe("CostCalculator", () => {
  it("prices 2 cups a day by default", () => {
    render(<CostCalculator />);
    expect(cost("Conventional")).toBe(`$${Math.round(2 * 365 * 0.12)}`);
    expect(cost("Organic")).toBe(`$${Math.round(2 * 365 * 0.22)}`);
    expect(cost("Biodynamic")).toBe(`$${Math.round(2 * 365 * 0.38)}`);
    expect(screen.getByText(`$${Math.round(2 * 365 * 0.26)}/year`)).toBeInTheDocument();
  });

  it("recalculates every figure when the cups slider moves", () => {
    render(<CostCalculator />);
    fireEvent.change(screen.getByLabelText("Cups of coffee per day"), { target: { value: "5" } });
    expect(cost("Conventional")).toBe("$219");
    expect(cost("Biodynamic")).toBe("$694");
    expect(screen.getByText("$475/year")).toBeInTheDocument();
    expect(screen.getByText(/about \$1\.30\/day/)).toBeInTheDocument();
  });
});
