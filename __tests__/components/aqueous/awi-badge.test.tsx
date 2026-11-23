import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AWIBadge, AWICompareBar, AWIInline, hexPoints } from "@/components/aqueous/awi-badge";
import type { AWIScore } from "@/lib/content/aqueous/awi-engine";

function awi(personalScore: number, extra: Partial<AWIScore> = {}): AWIScore {
  return {
    personalScore,
    industryConsensus: 40,
    grade: personalScore <= 10 ? "PURE" : personalScore <= 25 ? "CLEAN" : "MURKY",
    crossRefSources: 3,
    personalInsight: "Great for your priorities.",
    ...extra,
  } as AWIScore;
}

describe("AWIBadge", () => {
  it("draws the ring after mount and glows for a pure score", async () => {
    const { container } = render(<AWIBadge awi={awi(5)} size="lg" showConsensus showInsight />);
    expect(screen.getByRole("img", { name: "AWI score 5, PURE" })).toBeInTheDocument();
    expect(container.innerHTML).toContain("shadow-[0_0_24px_6px_rgba(10,135,84,0.3)]");
    const ring = container.querySelector("polygon[data-drawn]")!;
    await waitFor(() => expect(ring).toHaveAttribute("data-drawn", "true"));
    expect(Number(ring.getAttribute("stroke-dashoffset"))).toBeLessThan(Number(ring.getAttribute("stroke-dasharray")));
    expect(screen.getByText("Industry:")).toBeInTheDocument();
    expect(screen.getByText("(3 sources)")).toBeInTheDocument();
    expect(screen.getByText("Great for your priorities.")).toBeInTheDocument();
    expect(screen.getByText("AWI Score")).toHaveClass("text-[10px]");
  });

  it("renders a static ring and lighter glows for higher scores", () => {
    const { container, rerender } = render(<AWIBadge awi={awi(20, { crossRefSources: 0 })} size="sm" animated={false} showConsensus />);
    expect(container.querySelector("polygon[data-drawn]")).toHaveAttribute("data-drawn", "static");
    expect(container.innerHTML).toContain("shadow-[0_0_16px_4px_rgba(45,157,90,0.2)]");
    expect(screen.queryByText(/sources/)).toBeNull();
    rerender(<AWIBadge awi={awi(60)} size="xl" />);
    expect(container.innerHTML).toContain("shadow-[0_0_8px_2px_transparent]");
    expect(screen.queryByText("Industry:")).toBeNull();
    rerender(<AWIBadge awi={awi(60)} />);
    expect(screen.getByText("AWI Score")).toHaveClass("text-[8px]");
  });

  it("computes six hexagon points", () => {
    expect(hexPoints(10, 5).split(" ")).toHaveLength(6);
  });
});

describe("AWIInline", () => {
  it("shows score, grade and an optional label", () => {
    const { rerender } = render(<AWIInline score={8} className="extra" />);
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("PURE")).toBeInTheDocument();
    expect(screen.getByText("AWI")).toBeInTheDocument();
    rerender(<AWIInline score={90} showLabel={false} />);
    expect(screen.getByText("TOXIC")).toBeInTheDocument();
    expect(screen.queryByText("AWI")).toBeNull();
  });
});

describe("AWICompareBar", () => {
  it("places both markers and grows them after mount", async () => {
    render(<AWICompareBar personalScore={1} industryConsensus={100} />);
    const personal = screen.getByTestId("awi-personal-marker");
    expect(personal.style.left).toBe("0%");
    expect(screen.getByTestId("awi-industry-marker").style.left).toBe("100%");
    await waitFor(() => expect(personal).toHaveClass("scale-y-100"));
    expect(screen.getByText("Your Score:")).toBeInTheDocument();
  });
});
