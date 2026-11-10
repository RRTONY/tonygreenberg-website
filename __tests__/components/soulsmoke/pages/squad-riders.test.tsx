import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SquadRiders } from "@/components/soulsmoke/pages/squad-riders";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("SquadRiders", () => {
  it("shows the tier legend, every tier section and each rider's flags", () => {
    render(
      <SoulsmokeProviders>
        <SquadRiders />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "The Squad Riders" })).toBeInTheDocument();
    for (const name of ["LEGEND", "TRUSTED", "SOLID", "MIXED", "SUSPECT", "SHILL"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { level: 3, name: "Ulises Torrentera" })).toBeInTheDocument();
    expect(screen.getByText("@insaboramezcal")).toBeInTheDocument();
    expect(screen.getAllByText("GREEN FLAGS").length).toBeGreaterThan(0);
    expect(screen.getAllByText("RED FLAGS").length).toBeGreaterThan(0);
    expect(screen.getByText("• Academic rigor")).toBeInTheDocument();
    expect(screen.getByText("A Note on This List")).toBeInTheDocument();
  });
});
