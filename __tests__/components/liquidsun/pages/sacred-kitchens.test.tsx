import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SacredKitchens } from "@/components/liquidsun/pages/sacred-kitchens";

describe("SacredKitchens", () => {
  it("shows the distillery lunch and all four kitchens with their pairings", () => {
    render(<SacredKitchens />);
    expect(screen.getByRole("heading", { level: 1, name: "Sacred Kitchens" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Distillery Lunch" })).toBeInTheDocument();
    for (const name of ["La Alteña (Arandas)", "Fortaleza (Tequila)", "Birria Chololo (Guadalajara)", "Cantina La Fuente (Guadalajara)"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getByText("Tapatio Blanco 110 Proof")).toBeInTheDocument();
    expect(screen.getByText("Fortaleza Still Strength")).toBeInTheDocument();
  });
});
