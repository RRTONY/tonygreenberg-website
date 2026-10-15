import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BioChainCTA } from "@/components/marketing/biochain-cta";

describe("BioChainCTA", () => {
  it("shows both intake links and the overview by default, with the default copy", () => {
    render(<BioChainCTA />);
    expect(screen.getByText(/Supplier and buyer intake for peptides, stem cells, and exosomes/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Supplier Application/ })).toHaveAttribute("href", "https://ramprate.com/biochain/supplier-intake");
    expect(screen.getByRole("link", { name: /Buyer \/ Distribution Partner/ })).toHaveAttribute("href", "https://ramprate.com/biochain/buyer-intake");
    expect(screen.getByRole("link", { name: /BioChain Overview/ })).toHaveAttribute("href", "https://ramprate.com/biochain");
  });

  it("supplier variant hides the buyer link", () => {
    render(<BioChainCTA variant="supplier" />);
    expect(screen.queryByRole("link", { name: /Buyer/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Supplier Application/ })).toBeInTheDocument();
  });

  it("buyer variant hides the supplier link and uses custom context", () => {
    render(<BioChainCTA variant="buyer" context="Buying peptides?" />);
    expect(screen.queryByRole("link", { name: /Supplier/ })).not.toBeInTheDocument();
    expect(screen.getByText("Buying peptides?")).toBeInTheDocument();
  });

  it("every link opens in a new tab with noopener", () => {
    render(<BioChainCTA />);
    for (const a of screen.getAllByRole("link")) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
    }
  });
});
