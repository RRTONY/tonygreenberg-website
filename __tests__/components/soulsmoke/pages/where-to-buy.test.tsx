import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhereToBuy } from "@/components/soulsmoke/pages/where-to-buy";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("WhereToBuy", () => {
  it("lists retailers by tier, Mexico shops, the avoid list and the Quadrant link", () => {
    render(
      <SoulsmokeProviders>
        <WhereToBuy />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Where to Buy" })).toBeInTheDocument();
    for (const label of ["ELITE", "EXCELLENT", "SOLID"]) expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Old Town Tequila" }).closest(".rounded-xl")).toHaveClass("border-amber-500");
    expect(screen.getAllByRole("link", { name: /Visit Store/ })[0]).toHaveAttribute("href", "https://www.oldtowntequila.com");
    expect(screen.getByText(/Texas shipping only/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "In Situ" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /^Visit$/ })).toHaveLength(2);
    expect(screen.getByText("Amazon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore the Quadrant" })).toHaveAttribute("href", "/soul-smoke/quadrant");
  });
});
