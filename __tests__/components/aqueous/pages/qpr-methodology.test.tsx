import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { dataSources, gradingScale, pillars, QPRMethodology } from "@/components/aqueous/pages/qpr-methodology";
import { aqueousImages } from "@/lib/content/aqueous/images";

vi.mock("@/components/aqueous/share-button", () => ({ FloatingShare: () => <div data-testid="floating-share" /> }));

describe("QPRMethodology", () => {
  it("renders the lab hero, scoring, pillars, grades, sources and calls to action", () => {
    render(<QPRMethodology />);
    expect(screen.getByRole("heading", { level: 1, name: "The QPR Engine" })).toBeInTheDocument();
    expect(screen.getByAltText(aqueousImages.waterTestingLab.alt)).toHaveAttribute("src", aqueousImages.waterTestingLab.src);
    expect(screen.getByText("Example: Mountain Valley Spring")).toBeInTheDocument();
    expect(screen.getByText(/QPR = \(Quality × 0.333\)/)).toBeInTheDocument();

    for (const p of pillars) {
      expect(screen.getByRole("heading", { level: 3, name: p.title })).toHaveClass(p.text);
      for (const s of p.subcategories) expect(screen.getByRole("heading", { level: 4, name: s.name })).toBeInTheDocument();
    }
    for (const g of gradingScale) expect(screen.getByText(g.grade, { selector: "span" })).toHaveClass(g.color);
    for (const d of dataSources) expect(screen.getByRole("link", { name: new RegExp(d.name) })).toHaveAttribute("href", d.url);

    expect(screen.getByRole("link", { name: "Explore Waters" })).toHaveAttribute("href", "/aqueous/explore");
    expect(screen.getByRole("link", { name: "Check Your Tap Water" })).toHaveAttribute("href", "/aqueous/tap-water");
    expect(screen.getByTestId("floating-share")).toBeInTheDocument();
  });
});
