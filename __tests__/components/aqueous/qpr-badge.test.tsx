import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { QPRBadge } from "@/components/aqueous/qpr-badge";

describe("QPRBadge", () => {
  it("shows the score and grade", () => {
    const { container } = render(<QPRBadge score={89} grade="A" size="lg" />);
    expect(screen.getByRole("img", { name: "QPR score 89, grade A" })).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("pulse-glow", "rounded-full");
  });

  it("can hide the grade and skip the animation", () => {
    const { container } = render(<QPRBadge score={40} grade="D" size="sm" showGrade={false} animated={false} />);
    expect(screen.queryByText("D")).toBeNull();
    expect(container.querySelector("polygon[data-drawn]")).toHaveAttribute("data-drawn", "static");
    render(<QPRBadge score={70} grade="B" />);
    expect(screen.getByText("70")).toBeInTheDocument();
  });
});
