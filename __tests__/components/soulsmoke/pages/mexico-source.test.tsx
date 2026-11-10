import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { getEnrichedMezcalByBrandExpression, type MezcalEnriched } from "@/lib/content/soulsmoke/mezcal-enriched";
import { MexicoSource, mexicoSourceMezcals } from "@/components/soulsmoke/pages/mexico-source";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

vi.mock("@/lib/content/soulsmoke/mezcal-enriched", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/content/soulsmoke/mezcal-enriched")>();
  return { ...real, getEnrichedMezcalByBrandExpression: vi.fn(real.getEnrichedMezcalByBrandExpression) };
});

function renderPage() {
  return render(
    <SoulsmokeProviders>
      <MexicoSource />
    </SoulsmokeProviders>,
  );
}

function cardTitles() {
  return screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
}

describe("MexicoSource", () => {
  it("lists every bottle, sorted by experience (EEI) first", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Mexico Source");
    const byEei = [...mexicoSourceMezcals].sort((a, b) => b.eei - a.eei).map((m) => m.producer);
    expect(cardTitles()).toEqual(byEei);
    expect(screen.getByRole("button", { name: /EEI/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("re-sorts by value (EVI) and back", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /EVI/ }));
    expect(screen.getByRole("button", { name: /EVI/ })).toHaveAttribute("aria-pressed", "true");
    expect(cardTitles()).toEqual([...mexicoSourceMezcals].sort((a, b) => b.evi - a.evi).map((m) => m.producer));
    fireEvent.click(screen.getByRole("button", { name: /EEI/ }));
    expect(screen.getByRole("button", { name: /EEI/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("shows no QPR badge: producer names don't match the enriched data's brands (same as live)", () => {
    renderPage();
    expect(screen.queryAllByTitle(/^QPR: /)).toHaveLength(0);
  });

  it("colors the QPR badge by its band when a bottle does match", () => {
    vi.mocked(getEnrichedMezcalByBrandExpression).mockReturnValue({ qpr: 9.1 } as MezcalEnriched);
    renderPage();
    const badges = screen.getAllByTitle("QPR: 9.1 — Extraordinary Value");
    expect(badges).toHaveLength(mexicoSourceMezcals.length);
    expect(badges[0]).toHaveClass("border-[#22c55e]");
  });

  it("shows the Spanish copy when the visitor picked Spanish", () => {
    window.localStorage.setItem("soulsmoke-language", JSON.stringify("es"));
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("La Fuente México");
    expect(screen.getByText("Ordenar por:")).toBeInTheDocument();
    expect(screen.getAllByText("El Glitch").length).toBe(mexicoSourceMezcals.length);
    expect(screen.getByRole("link", { name: /Volver/ })).toHaveAttribute("href", "/soul-smoke");
  });
});
