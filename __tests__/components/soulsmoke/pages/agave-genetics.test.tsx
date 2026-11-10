import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AgaveGenetics } from "@/components/soulsmoke/pages/agave-genetics";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("AgaveGenetics", () => {
  it("renders the hero, species guide, terroir and conservation sections", () => {
    render(
      <SoulsmokeProviders>
        <AgaveGenetics />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Agave Genetics" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Home" })).toHaveAttribute("href", "/soul-smoke");
    for (const name of ["Espadín", "Tobalá", "Tepeztate", "Coyote"]) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
    }
    for (const name of ["Terroir: Why Location Matters", "The Conservation Crisis", "Every Bottle Tells a Story"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
  });

  it("colors the cultivation badge by type", () => {
    render(<AgaveGenetics />);
    expect(screen.getByText("Cultivated")).toHaveClass("text-amber-400");
    expect(screen.getAllByText("Wild")[0]).toHaveClass("text-green-400");
    expect(screen.getAllByText("Wild / Semi-wild")[0]).toHaveClass("text-blue-400");
  });
});
