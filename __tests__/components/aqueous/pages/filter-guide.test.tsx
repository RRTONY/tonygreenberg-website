import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { costComparison, FilterGuide, glassBottles, roFilters } from "@/components/aqueous/pages/filter-guide";

vi.mock("@/components/aqueous/share-button", () => ({ FloatingShare: () => <div data-testid="floating-share" /> }));

describe("FilterGuide", () => {
  it("renders the hero, cost table, ranked filters, glass bottles and manifesto link", async () => {
    render(<FilterGuide />);
    expect(screen.getByRole("heading", { level: 1, name: "The Filter Guide" })).toHaveClass("text-[#F5F0E8]");
    expect(screen.getByText("89 QPR")).toHaveClass("text-[#4ECDC4]");

    const rows = screen.getAllByRole("row").slice(1, costComparison.length + 1);
    expect(rows).toHaveLength(costComparison.length);
    // Dasani: cheap but low QPR; FIJI: over $1,000 a year; APEC: the highlighted RO rows.
    expect(within(rows[0]).getByText("$912")).not.toHaveClass("text-red-500");
    expect(within(rows[0]).getByText("35")).toHaveClass("text-red-500");
    expect(within(rows[1]).getByText("$3,650")).toHaveClass("text-red-500");
    expect(within(rows[2]).getByText("55")).toHaveClass("text-amber-600");
    expect(rows[3]).toHaveClass("bg-emerald-500/5");
    expect(within(rows[3]).getByText("$233")).toHaveClass("text-emerald-600");
    expect(within(rows[3]).getByText("89")).toHaveClass("text-emerald-600");
    expect(within(rows[3]).getByText("0")).toHaveClass("text-emerald-600");
    expect(within(rows[3]).getByText("<0.1 ppt")).toHaveClass("text-emerald-600");

    for (const f of roFilters) expect(screen.getByRole("heading", { name: f.name })).toBeInTheDocument();
    expect(screen.getByText("AQUEOUS TOP PICK")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "View on Amazon" })).toHaveLength(roFilters.length + glassBottles.length);
    expect(screen.getAllByRole("link", { name: "View on Amazon" })[0]).toHaveAttribute("href", roFilters[0].amazonUrl);
    for (const b of glassBottles) expect(screen.getByRole("heading", { name: b.name })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Read Our Manifesto" })).toHaveAttribute("href", "/aqueous/manifesto");
    expect(screen.getByTestId("floating-share")).toBeInTheDocument();
  });
});
