import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PilgrimageGuide } from "@/components/soulsmoke/pages/pilgrimage-guide";

describe("PilgrimageGuide", () => {
  it("renders the guide: itinerary, stays, food, tips, warnings and the map link", () => {
    render(<PilgrimageGuide />);
    expect(screen.getByRole("heading", { level: 1, name: "The Pilgrimage Guide" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Home" })).toHaveAttribute("href", "/soul-smoke");
    for (const name of ["Casa Silencio", "6-Day Itinerary", "Where to Stay", "Where to Eat", "Essential Tips"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { level: 3, name: "Arrival & Orientation" })).toBeInTheDocument();
    // The featured hotel is shown above, not repeated in Where to Stay.
    expect(screen.getByRole("heading", { level: 3, name: "Casa Oaxaca" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Casa Silencio" })).toBeNull();
    expect(screen.getByRole("link", { name: "casasilencio.com" })).toHaveAttribute("href", "https://www.casasilencio.com");
    expect(screen.getByText("Chichilorev").closest("a")).toBeNull();
    expect(screen.getByRole("link", { name: "View Oaxaca Map" })).toHaveAttribute("href", "/soul-smoke/oaxaca-map");
  });
});
