import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RecentCreationsPage, { metadata } from "@/app/recent-creations/page";

describe("/recent-creations", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Built by Tony G");
    expect(metadata.description).toBe("A living portfolio of digital creation. Eleven sites, eleven ideas that needed a home.");
    expect(metadata.alternates?.canonical).toBe("/recent-creations");
  });

  it("renders one H1 and the explainer copy", () => {
    render(<RecentCreationsPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Built by Tony G");
    expect(screen.getByText(/Eleven ideas that needed a home\. Each one built in days, not months\./)).toBeInTheDocument();
    expect(screen.getByText(/meaningful software can be built in days when the thinking has been done in decades/)).toBeInTheDocument();
  });

  it("shows all eleven project cards", () => {
    const { container } = render(<RecentCreationsPage />);
    for (const t of ["Human OS V2.0", "Find Your Team (The Flow Circuit)", "The Gem Spark", "FusionRamp / STRATUM", "Homeaglow Exposed"]) {
      expect(container.textContent).toContain(t);
    }
    expect(container.textContent!.match(/Narrative Essay|Interactive Diagnostic|Web3 Infrastructure|Consumer Crusade/g)!.length).toBeGreaterThan(3);
  });

  it("links working projects, opens outside sites in a new tab, and has no Manus links", () => {
    const { container } = render(<RecentCreationsPage />);
    expect(screen.getByRole("link", { name: /Human OS V2\.0/ })).toHaveAttribute("href", "/humanos");
    expect(screen.getByRole("link", { name: /The Flow Circuit/ })).toHaveAttribute("href", "/flow-circuit");
    const homeaglow = screen.getByRole("link", { name: /Homeaglow Exposed/ });
    expect(homeaglow).toHaveAttribute("href", "https://homeaglowexposed.com");
    expect(homeaglow).toHaveAttribute("target", "_blank");
    expect(homeaglow).toHaveAttribute("rel", "noopener noreferrer");
    expect(container.innerHTML).not.toMatch(/manus\.space|manuscdn|\/manus-storage\//);
  });

  it("links back to The Broadsheet", () => {
    render(<RecentCreationsPage />);
    for (const a of screen.getAllByRole("link", { name: /Back to The Broadsheet/ })) {
      expect(a).toHaveAttribute("href", "/the-letter");
    }
  });
});
