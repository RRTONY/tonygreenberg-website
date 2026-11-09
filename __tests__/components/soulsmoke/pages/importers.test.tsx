import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Importers } from "@/components/soulsmoke/pages/importers";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("Importers", () => {
  it("ranks importers in four tiers with their contacts and shame reasons", () => {
    render(
      <SoulsmokeProviders>
        <Importers />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "The Gatekeepers" })).toBeInTheDocument();
    for (const name of ["THE GUARDIANS", "SOLID CHOICES", "COMMERCIAL", "WALL OF SHAME"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getByText("Founded by Nicolas Palazzi")).toBeInTheDocument();
    expect(screen.getByText("Est. 1982")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "meryl@pmspirits.com" })).toHaveAttribute("href", "mailto:meryl@pmspirits.com");
    expect(screen.getByRole("link", { name: "(646) 247-2009" })).toHaveAttribute("href", "tel:6462472009");
    expect(screen.getByText(/only 33% agave content/)).toBeInTheDocument();
    expect(screen.getByText("Casamigos")).toHaveClass("text-red-300");
    expect(screen.getByText("NETA")).toHaveClass("text-gray-200");
    expect(screen.getByRole("heading", { level: 3, name: "Diageo" })).toHaveClass("text-red-400");
  });
});
