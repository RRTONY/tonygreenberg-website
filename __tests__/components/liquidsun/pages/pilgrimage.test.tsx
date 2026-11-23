import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Pilgrimage, osmEmbedUrl, sacredZones } from "@/components/liquidsun/pages/pilgrimage";

describe("Pilgrimage", () => {
  it("shows the OpenStreetMap overview and a pin per zone", () => {
    render(<Pilgrimage />);
    expect(screen.getByRole("heading", { level: 1, name: "The Pilgrimage" })).toBeInTheDocument();
    const map = screen.getByTitle("Map of the tequila regions of Jalisco");
    expect(map.getAttribute("src")).toMatch(/^https:\/\/www\.openstreetmap\.org\/export\/embed\.html\?bbox=/);
    expect(map.getAttribute("src")).not.toContain("marker=");
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(sacredZones.length + 1); // + sound
  });

  it("zooms to a zone with a marker, shows its card, and closes it", () => {
    render(<Pilgrimage />);
    fireEvent.click(screen.getByRole("button", { name: "Arandas" }));
    expect(screen.getByRole("button", { name: "Arandas" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTitle("Map of Arandas, Jalisco").getAttribute("src")).toContain("marker=20.7050,-102.3460");
    expect(screen.getByRole("heading", { level: 2, name: "Arandas" })).toBeInTheDocument();
    expect(screen.getByText("Highlands (Los Altos)")).toBeInTheDocument();
    expect(screen.getByText("Tequila Ocho")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "El Arenal" }));
    expect(screen.getByText("Valley (Valles)")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close El Arenal" }));
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("builds a bbox around the center that narrows as the zoom grows", () => {
    const wide = osmEmbedUrl({ lat: 20, lng: -103, zoom: 9 });
    const close = osmEmbedUrl({ lat: 20, lng: -103, zoom: 13, marker: true });
    const width = (url: string) => {
      const [w, , e] = new URL(url).searchParams.get("bbox")!.split(",").map(Number);
      return e - w;
    };
    expect(width(wide)).toBeGreaterThan(width(close));
    expect(close).toContain("&marker=20.0000,-103.0000");
  });
});
