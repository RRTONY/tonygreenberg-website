import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { DiscoveryEngine } from "@/components/soulsmoke/pages/discovery-engine";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import { getAllEnrichedMezcals } from "@/lib/content/soulsmoke/mezcal-enriched";

const all = getAllEnrichedMezcals();
const renderPage = () =>
  render(
    <SoulsmokeProviders>
      <DiscoveryEngine />
    </SoulsmokeProviders>,
  );
const count = () => Number(screen.getByText("results").parentElement?.querySelector("strong")?.textContent);
const brands = () => screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);

describe("DiscoveryEngine", () => {
  it("lists every bottle, best QPR first, with the tasting notes in the HTML", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Discovery Engine" })).toBeInTheDocument();
    expect(count()).toBe(all.length);
    const best = [...all].sort((a, b) => b.qpr - a.qpr)[0];
    expect(brands()[0]).toBe(best.brand);
    expect(screen.getAllByText(`"${best.tastingNotes}"`)[0]).toBeInTheDocument();
  });

  it("searches, counts active filters and resets", () => {
    renderPage();
    fireEvent.change(screen.getByRole("textbox", { name: /Search by name/ }), { target: { value: "real minero" } });
    expect(count()).toBe(
      all.filter((b) => [b.name, b.brand, b.agave, b.producer, b.region].some((v) => v.toLowerCase().includes("real minero"))).length,
    );
    expect(screen.getByText("(1 active filters)")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: /Search by name/ }), { target: { value: "zzzz-nothing" } });
    expect(screen.getByText(/No bottles match your criteria/)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "Reset All Filters" })[1]);
    expect(count()).toBe(all.length);
  });

  it("applies every range and chip filter, then sorts every way", () => {
    renderPage();
    for (const label of ["Price", "QPR Index", "Value Index (EVI)", "Experience Index (EEI)", "Complexity"]) {
      fireEvent.change(screen.getByRole("slider", { name: `${label} min` }), { target: { value: "1" } });
      fireEvent.change(screen.getByRole("slider", { name: `${label} max` }), { target: { value: "9" } });
    }
    for (const chip of ["Easy", "Same Day", "● Common", "Continuous", "Ancestral", "US"]) {
      fireEvent.click(screen.getByRole("button", { name: chip }));
    }
    for (const more of screen.getAllByRole("button", { name: /more$/ })) fireEvent.click(more);
    expect(screen.getAllByRole("button", { name: "Show less" }).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole("button", { name: all[0].agave, pressed: false })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: all[0].foodPairings[0].category, pressed: false })[0]);
    expect(screen.getByText(/\(13 active filters\)/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Easy" }));
    expect(screen.getByRole("button", { name: "Easy" })).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getAllByRole("button", { name: "Reset All Filters" })[0]);

    const sort = screen.getByRole("combobox", { name: "Sort By" });
    for (const key of ["price", "evi", "eei", "name", "rarity", "availability", "qpr"]) {
      fireEvent.change(sort, { target: { value: key } });
      expect(count()).toBe(all.length);
    }
    fireEvent.change(sort, { target: { value: "name" } });
    fireEvent.click(screen.getByRole("button", { name: "Descending" }));
    expect(brands()[0]).toBe([...all].sort((a, b) => a.brand.localeCompare(b.brand))[0].brand);
    expect(screen.getByRole("button", { name: "Ascending" })).toBeInTheDocument();
  });

  it("hides the filter panel, toggles a card's breakdown and hunt list, and opens the want modal", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.queryByRole("combobox", { name: "Sort By" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));

    const card = screen.getAllByRole("heading", { level: 3 })[0].closest(".group") as HTMLElement;
    const c = within(card);
    fireEvent.click(c.getByRole("button", { name: "Show QPR Breakdown" }));
    expect(c.getByText("Experience (35%)")).toBeVisible();
    fireEvent.click(c.getByRole("button", { name: "Hide QPR Breakdown" }));

    fireEvent.click(c.getByRole("button", { name: "Add to Hunt List" }));
    expect(JSON.parse(window.localStorage.getItem("mezcal-favorites") ?? "[]")).toHaveLength(1);
    expect(c.getByRole("button", { name: "Remove from Hunt List" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(c.getByRole("button", { name: "I Want This Bottle" }));
    expect(screen.getByRole("dialog", { name: "I Want This Bottle" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows Spanish copy and the Aficionado look", () => {
    window.localStorage.setItem("soulsmoke-language", JSON.stringify("es"));
    window.localStorage.setItem("mezcal-view-mode", JSON.stringify("aficionado"));
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Motor de Descubrimiento" })).toHaveClass("font-sans");
    fireEvent.click(screen.getByRole("button", { name: "Filtros" }));
    expect(screen.getByRole("button", { name: "Filtros" })).toHaveClass("border-stone-300");
  });

  // Live link check 2026-11-13: "Buy" linked each store name as a URL, so every one opened
  // /soul-smoke/<store name> (404). Store names are labels; every link on the page must go somewhere real.
  it("shows where-to-buy store names as text, never as broken links", () => {
    const { container } = renderPage();
    const stores = new Set(all.flatMap((b) => b.whereToBuy ?? []));
    expect(stores.size).toBeGreaterThan(0);
    for (const a of container.querySelectorAll("a[href]")) {
      const href = a.getAttribute("href") ?? "";
      expect(stores.has(href), `link to store name "${href}"`).toBe(false);
      expect(href, `relative link "${href}"`).toMatch(/^(\/|#|https?:\/\/|mailto:)/);
    }
    const withStores = [...all].sort((a, b) => b.qpr - a.qpr).find((b) => b.whereToBuy?.length);
    expect(screen.getAllByText(withStores!.whereToBuy![0]).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Find at:").length).toBeGreaterThan(0);
  });
});
