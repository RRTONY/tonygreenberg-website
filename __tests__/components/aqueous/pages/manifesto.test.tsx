import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Manifesto, keyReadings } from "@/components/aqueous/pages/manifesto";
import { aqueousImages } from "@/lib/content/aqueous/images";

vi.mock("@/components/aqueous/share-button", () => ({
  ShareButton: () => <button type="button">share</button>,
  FloatingShare: () => <div data-testid="floating-share" />,
}));

describe("Manifesto", () => {
  it("renders every section and the spring photo", () => {
    const { container } = render(<Manifesto />);
    expect(screen.getByRole("heading", { level: 1, name: /Finding Value\.\s*Finding Your Dharma\./ })).toBeInTheDocument();
    for (const h of [
      "The Only Way to Save Ourselves from Ourselves",
      "The Conscious Satisfier",
      "Human 2.0: Finding Your Dharma",
      "The Great Simplification",
      "The Philanthropy Model",
      "Essential Readings & Resources",
      "Cleanliness Is Next to Godliness",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
    expect(screen.getByText("Spending Less Creates More")).toBeInTheDocument();
    expect(screen.getByText("The Aqueous Commitment")).toBeInTheDocument();
    expect(screen.getByAltText(aqueousImages.natureSpringSource.alt)).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/manus|tonygreenberg\.com\//i);
  });

  it("sends Tony's essays to this site's posts and outside sources to a new tab", () => {
    render(<Manifesto />);
    const founder = screen.getByRole("link", { name: /India: My Virtual Soul & Home/ });
    expect(founder).toHaveAttribute("href", "/blog/india-my-virtual-soul-home");
    expect(founder).not.toHaveAttribute("target");
    const pnas = screen.getByRole("link", { name: /240,000 Nanoplastics/ });
    expect(pnas).toHaveAttribute("href", "https://www.pnas.org/doi/10.1073/pnas.2300582121");
    expect(pnas).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "The Way of Dao" })).toHaveAttribute("href", "/blog/the-way-of-dao");
    expect(screen.getByRole("link", { name: "Conscious Satisfier article" })).toHaveAttribute(
      "href",
      "/blog/return-on-investment-going-green-going-green-2",
    );
    const items = keyReadings.flatMap((s) => s.items);
    expect(items).toHaveLength(17);
    expect(screen.getByRole("link", { name: /Explore Water Ratings/ })).toHaveAttribute("href", "/aqueous/explore");
    expect(screen.getByRole("link", { name: /See the Wall of Shame/ })).toHaveAttribute("href", "/aqueous/wall-of-shame");
  });
});
