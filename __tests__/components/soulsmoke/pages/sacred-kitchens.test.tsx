import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SacredKitchens, restaurants } from "@/components/soulsmoke/pages/sacred-kitchens";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("SacredKitchens", () => {
  it("lists every restaurant with its rating, links and review note", () => {
    render(
      <SoulsmokeProviders>
        <SacredKitchens />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Sacred\s*Kitchens/);
    for (const r of restaurants) {
      expect(screen.getByRole("heading", { level: 2, name: r.name })).toBeInTheDocument();
    }
    expect(screen.getAllByText("EXTRAORDINARY")).toHaveLength(5);
    expect(screen.getByText("EXCELLENT")).toHaveClass("bg-sage");
    expect(screen.getAllByRole("link", { name: /Visit Website/ })).toHaveLength(3);
    expect(screen.getByText("Read our full review (coming soon)")).toBeInTheDocument();
    expect(screen.getByText("Chef Rodolfo Castellanos")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore Mexico's Finest Bottles/ })).toHaveAttribute(
      "href",
      "/soul-smoke/mexico-source",
    );
  });
});
