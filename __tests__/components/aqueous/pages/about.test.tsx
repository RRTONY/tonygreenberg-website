import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { About, ecosystem } from "@/components/aqueous/pages/about";

vi.mock("@/components/aqueous/share-button", () => ({
  ShareButton: ({ title }: { title?: string }) => <button type="button">share {title}</button>,
  FloatingShare: () => <div data-testid="floating-share" />,
}));

describe("About", () => {
  it("renders the story, quote and Connect section", () => {
    render(<About />);
    expect(screen.getByRole("heading", { level: 1, name: "Only Time Buys Trust" })).toBeInTheDocument();
    for (const h of ["The Spark", "Everything Connects", "Connect"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
    expect(screen.getByText(/The gold is in the cracks/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /About Tony Greenberg & Aqueous/ })).toBeInTheDocument();
  });

  it("drops The Way Out and fauxTony and points the essays at /essays", () => {
    const { container } = render(<About />);
    expect(ecosystem.map((p) => p.name)).toEqual(["TonyG — Essays & Frameworks", "RampRate", "ImpactSoul", "Joy and Woe"]);
    expect(screen.queryByText("The Way Out")).toBeNull();
    expect(screen.queryByText("fauxTony")).toBeNull();
    expect(container.innerHTML).not.toMatch(/manus|tonygreenberg\.com/i);

    const hub = screen.getByRole("link", { name: /TonyG — Essays & Frameworks/ });
    expect(hub).toHaveAttribute("href", "/essays");
    expect(hub).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: /RampRate Enterprise/ })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Read the Essays" })).toHaveAttribute("href", "/essays");
    expect(screen.getByRole("link", { name: /Site Directory/ })).toHaveAttribute("href", "/aqueous/directory");
    expect(screen.getByRole("link", { name: "t@ramprate.com" })).toHaveAttribute("href", "mailto:t@ramprate.com");
  });
});
