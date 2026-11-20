import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Quadrant } from "@/components/liquidsun/pages/quadrant";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

describe("Quadrant", () => {
  it("shows the Flavor Matrix heading, axis note, matrix and sound button", () => {
    render(
      <LiquidsunProviders>
        <Quadrant />
      </LiquidsunProviders>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "The Flavor Matrix" })).toBeInTheDocument();
    expect(screen.getByText(/X-Axis: Terroir/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Find My Palate/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play ambient sound" })).toBeInTheDocument();
  });
});
