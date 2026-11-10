import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { UsHunt, usHuntMezcals } from "@/components/soulsmoke/pages/us-hunt";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

function renderPage() {
  return render(
    <SoulsmokeProviders>
      <UsHunt />
    </SoulsmokeProviders>,
  );
}

function cardTitles() {
  return screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
}

describe("UsHunt", () => {
  it("lists every bottle, sorted by experience (EEI) first", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The US Hunt");
    const byEei = [...usHuntMezcals].sort((a, b) => b.eei - a.eei).map((m) => m.brand);
    expect(cardTitles()).toEqual(byEei);
    expect(screen.getByRole("button", { name: /EEI/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("re-sorts by value (EVI) and back", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /EVI/ }));
    expect(screen.getByRole("button", { name: /EVI/ })).toHaveAttribute("aria-pressed", "true");
    expect(cardTitles()).toEqual([...usHuntMezcals].sort((a, b) => b.evi - a.evi).map((m) => m.brand));
    fireEvent.click(screen.getByRole("button", { name: /EEI/ }));
    expect(screen.getByRole("button", { name: /EEI/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("shows a QPR badge for bottles found in the enriched data", () => {
    renderPage();
    expect(screen.getAllByTitle(/^QPR: /).length).toBeGreaterThan(0);
  });

  it("shows the Spanish copy when the visitor picked Spanish", () => {
    window.localStorage.setItem("soulsmoke-language", JSON.stringify("es"));
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("La Cacería USA");
    expect(screen.getByText("Ordenar por:")).toBeInTheDocument();
    expect(screen.getAllByText("El Glitch").length).toBe(usHuntMezcals.length);
    expect(screen.getByRole("link", { name: /Volver/ })).toHaveAttribute("href", "/soul-smoke");
  });
});
