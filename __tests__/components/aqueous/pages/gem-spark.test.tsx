import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GemSpark, journeySteps } from "@/components/aqueous/pages/gem-spark";

vi.mock("@/components/aqueous/share-button", () => ({
  ShareButton: ({ text }: { text?: string }) => <button type="button">share {text}</button>,
  FloatingShare: () => <div data-testid="floating-share" />,
}));

describe("GemSpark", () => {
  it("renders the hero with the looping sway and bob, and all six phases", () => {
    const { container } = render(<GemSpark />);
    expect(screen.getByRole("heading", { level: 1, name: "The Gem Spark" })).toBeInTheDocument();
    expect(container.querySelector(".aq-sway")).not.toBeNull();
    expect(container.querySelector(".aq-bob")).not.toBeNull();
    journeySteps.forEach((step, i) => {
      expect(screen.getByRole("heading", { level: 3, name: step.title })).toBeInTheDocument();
      expect(screen.getByText(`PHASE ${String(i + 1).padStart(2, "0")} — ${step.phase}`)).toBeInTheDocument();
    });
    expect(screen.getByText("See clearly")).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/tonygreenberg\.com\//);
  });

  it("routes actions through /aqueous and reading to this site's posts", () => {
    render(<GemSpark />);
    expect(screen.getByRole("link", { name: /Explore the AWI Index/ })).toHaveAttribute("href", "/aqueous/awi");
    expect(screen.getByRole("link", { name: /Read the Manifesto/ })).toHaveAttribute("href", "/aqueous/manifesto");
    expect(screen.getByRole("link", { name: /Begin Your Journey/ })).toHaveAttribute("href", "/aqueous/tap-water");
    expect(screen.getByRole("link", { name: "See Pricing & Impact" })).toHaveAttribute("href", "/aqueous/pricing");
    expect(screen.getByRole("link", { name: /The Ties That Bind/ })).toHaveAttribute(
      "href",
      "/blog/the-ties-that-bind-interpersonal-relationships",
    );
    expect(screen.getByRole("button", { name: /The Flow Circuit — Finding your tribe/ })).toBeInTheDocument();
  });
});
