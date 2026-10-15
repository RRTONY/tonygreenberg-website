import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EcosystemCTA } from "@/components/marketing/ecosystem-cta";

describe("EcosystemCTA", () => {
  it("shows the live essay count and real copy", () => {
    render(<EcosystemCTA essayCount={312} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("The thinking doesn't stop here.");
    expect(screen.getByText(/312 essays and counting/)).toBeInTheDocument();
  });

  it("links to Find Your Fit and The Ecosystem", () => {
    render(<EcosystemCTA essayCount={1} />);
    expect(screen.getByRole("link", { name: "Find Your Fit" })).toHaveAttribute("href", "/find-my");
    expect(screen.getByRole("link", { name: /The Ecosystem/ })).toHaveAttribute("href", "/ecosystem");
  });
});
