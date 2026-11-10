import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OaxacaMap, osmEmbedUrl } from "@/components/soulsmoke/pages/oaxaca-map";

const mapFrame = () => document.querySelector("iframe") as HTMLIFrameElement;

describe("osmEmbedUrl", () => {
  it("builds an OpenStreetMap embed with a bbox around the center, and a marker when asked", () => {
    expect(osmEmbedUrl({ lat: 16.9, lng: -96.7, zoom: 8, marker: false })).toBe(
      "https://www.openstreetmap.org/export/embed.html?bbox=-98.8094,15.3180,-94.5906,18.4820&layer=mapnik",
    );
    expect(osmEmbedUrl({ lat: 17.0614, lng: -96.7256, zoom: 14, marker: true })).toMatch(
      /&marker=17\.0614,-96\.7256$/,
    );
  });
});

describe("OaxacaMap", () => {
  it("starts on Oaxaca and shows the regions, legend and counts", () => {
    render(<OaxacaMap />);
    expect(screen.getByRole("heading", { level: 1, name: "The Sacred Geography" })).toBeInTheDocument();
    expect(mapFrame()).toHaveAttribute("title", "Map of the mezcal regions of Oaxaca");
    expect(mapFrame().src).toContain("bbox=-98.8094,15.3180,-94.5906,18.4820");
    expect(screen.getByText("Palenque / Producer")).toBeInTheDocument();
    for (const name of ["Real Minero", "Mezcalogía", "Origen"]) {
      expect(screen.getByRole("button", { name: new RegExp(name) })).toBeInTheDocument();
    }
  });

  it("filters the places by type", async () => {
    render(<OaxacaMap />);
    await userEvent.click(screen.getByRole("button", { name: "Bars" }));
    expect(screen.getByRole("button", { name: /In Situ/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Real Minero/ })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Food" }));
    expect(screen.getByRole("button", { name: /Criollo/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Palenques" }));
    expect(screen.getByRole("button", { name: /Lalocura/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Criollo/ })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByRole("button", { name: /Criollo/ })).toBeInTheDocument();
  });

  it("opens a place's details and re-centers the map with a marker", async () => {
    render(<OaxacaMap />);
    await userEvent.click(screen.getByRole("button", { name: /Real Minero/ }));
    const details = screen.getByRole("heading", { level: 2, name: "Real Minero" }).parentElement as HTMLElement;
    expect(within(details).getByText("Familia Ángeles")).toBeInTheDocument();
    expect(within(details).getByText("VISITING")).toBeInTheDocument();
    expect(mapFrame()).toHaveAttribute("title", "Map of Oaxaca: Real Minero");
    expect(mapFrame().src).toContain("marker=16.8667,-96.5833");

    await userEvent.click(screen.getByRole("button", { name: /Mezcalogía/ }));
    expect(screen.getByText("Reforma 506, Centro", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("MUST TRY")).toBeInTheDocument();
    expect(screen.getByText("Hours: Mon-Sat 1pm-11pm")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
  });

  it("focuses a region and resets the view", async () => {
    render(<OaxacaMap />);
    expect(screen.queryByRole("button", { name: "Reset View" })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: /Sierra Norte/ }));
    expect(screen.getByText(/High mountain villages like Santa María Ixcatlán/)).toBeInTheDocument();
    expect(mapFrame().src).not.toContain("marker=");
    await userEvent.click(screen.getByRole("button", { name: /Origen/ }));
    await userEvent.click(screen.getByRole("button", { name: "Reset View" }));
    expect(screen.queryByText(/High mountain villages/)).toBeNull();
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
    expect(mapFrame().src).toContain("bbox=-98.8094,15.3180,-94.5906,18.4820");
  });
});
