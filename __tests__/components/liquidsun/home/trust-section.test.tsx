import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrustSection } from "@/components/liquidsun/home/trust-section";

describe("TrustSection", () => {
  it("shows the promise, the four stats, the four credentials and the data sources", async () => {
    render(<TrustSection />);
    expect(screen.getByRole("heading", { name: "Why Trust Us" })).toBeInTheDocument();
    expect(screen.getByText("We protect you from bad tequila.")).toBeInTheDocument();
    for (const label of ["Curated Bottles", "Highest Panel Score", "Additive-Free", "Distilleries Visited"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    for (const title of ["CRT-Certified Panel", "Jalisco-Based Research", "Additive-Free Only", "Panel-Scored"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Tequila Matchmaker" })).toHaveAttribute("href", "https://www.agavematchmaker.com/");
    // No IntersectionObserver in jsdom: the reveals show right away.
    expect(await screen.findByText("Panel-Scored")).toBeVisible();
  });
});
