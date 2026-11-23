import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Philosophy, principles } from "@/components/aqueous/pages/philosophy";
import { aqueousImages } from "@/lib/content/aqueous/images";

vi.mock("@/components/aqueous/share-button", () => ({
  ShareButton: () => <button type="button">share</button>,
  FloatingShare: () => <div data-testid="floating-share" />,
}));

describe("Philosophy", () => {
  it("renders the hero, four principles with quotes and the Sanity photos", () => {
    const { container } = render(<Philosophy />);
    expect(screen.getByRole("heading", { level: 1, name: /Built for a\s*New Tomorrow/ })).toBeInTheDocument();
    for (const p of principles) {
      expect(screen.getByRole("heading", { level: 2, name: p.title })).toBeInTheDocument();
      expect(screen.getByText(p.quote)).toBeInTheDocument();
      expect(screen.getByText(`— ${p.attribution}`)).toBeInTheDocument();
    }
    // Side cards for 0, 2, 3; the drops photo for principle 1.
    for (const h of ["Consume Less. Live More.", "Within the Doughnut", "Simplicity is Power"]) {
      expect(screen.getByText(h)).toBeInTheDocument();
    }
    expect(screen.getByAltText(aqueousImages.natureSpringSource.alt)).toBeInTheDocument();
    expect(screen.getByAltText(aqueousImages.waterDropsMacro.alt)).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/manus/i);
    expect(screen.getByTestId("floating-share")).toBeInTheDocument();
  });

  it("links the CTAs inside /aqueous", () => {
    render(<Philosophy />);
    expect(screen.getByRole("link", { name: /Explore Waters/ })).toHaveAttribute("href", "/aqueous/explore");
    expect(screen.getByRole("link", { name: "Check Your Tap Water" })).toHaveAttribute("href", "/aqueous/tap-water");
  });
});
