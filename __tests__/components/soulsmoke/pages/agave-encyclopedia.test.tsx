import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { AgaveEncyclopedia, getTopBottlesForAgave } from "@/components/soulsmoke/pages/agave-encyclopedia";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

function renderPage() {
  return render(
    <SoulsmokeProviders>
      <AgaveEncyclopedia />
    </SoulsmokeProviders>,
  );
}

const cardNames = () => screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);

afterEach(() => {
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe("AgaveEncyclopedia", () => {
  it("lists all 15 agaves with their details in the server HTML", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Agave Encyclopedia");
    expect(cardNames()).toHaveLength(15);
    expect(screen.getByText("15 varieties")).toBeInTheDocument();
    // The collapsed panel's text is rendered (hidden by height), so crawlers see it.
    expect(screen.getByText(/The workhorse of mezcal/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back/ })).toHaveAttribute("href", "/soul-smoke");
    expect(screen.getByRole("link", { name: /Explore the Quadrant/ })).toHaveAttribute("href", "/soul-smoke/quadrant");
    expect(container.innerHTML).not.toMatch(/manus|src="\/images\//i);
  });

  it("filters by flavor, rarity and region, and clears from the empty state", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /^Filters/ }));
    fireEvent.click(within(screen.getByRole("group", { name: "Flavor Profile" })).getByRole("button", { name: "Floral" }));
    expect(cardNames()).toEqual(["Tobalá", "Mexicano", "Largo"]);
    fireEvent.click(within(screen.getByRole("group", { name: "Rarity" })).getByRole("button", { name: "Uncommon" }));
    expect(cardNames()).toEqual(["Mexicano"]);
    expect(screen.getByText("1 variety")).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("group", { name: "Region" })).getByRole("button", { name: "Guerrero" }));
    expect(screen.getByText("No agaves match your filters")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Filters/ })).toHaveTextContent("3");
    fireEvent.click(screen.getByRole("button", { name: "Clear Filters" }));
    expect(cardNames()).toHaveLength(15);
    fireEvent.click(screen.getByRole("button", { name: /^Filters/ }));
    expect(screen.queryByRole("group", { name: "Rarity" })).toBeNull();
  });

  it("expands a card, shows its top bottles and saves one", () => {
    renderPage();
    const toggle = screen.getByRole("button", { name: "Show Espadín details" });
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Hide Espadín details" })).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById("agave-1-details")!;
    expect(panel.className).toContain("max-h-150");
    const top = getTopBottlesForAgave("Espadín");
    expect(top.length).toBeGreaterThan(0);
    expect(within(panel).getByText(top[0].name)).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: /View all Espadín in Quadrant/ })).toHaveAttribute(
      "href",
      "/soul-smoke/quadrant?agave=Espad%C3%ADn",
    );
    expect(within(panel).getAllByRole("link", { name: /in the Quadrant/ })[0]).toHaveAttribute(
      "href",
      `/soul-smoke/quadrant?bottle=${top[0].id}`,
    );
    fireEvent.click(within(panel).getByRole("button", { name: `Add ${top[0].name} to favorites` }));
    expect(within(panel).getByRole("button", { name: `Remove ${top[0].name} from favorites` })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // The heading and image toggle too.
    fireEvent.click(screen.getByRole("heading", { level: 3, name: "Espadín" }));
    expect(panel.className).toContain("max-h-0");
    fireEvent.click(screen.getByRole("img", { name: "Espadín agave" }).parentElement!);
    expect(panel.className).toContain("max-h-150");
  });

  it("says when an agave has no bottles yet", () => {
    renderPage();
    const empty = ["Cuixe", "Cirial", "Barril", "Coyote", "Sierra Negra", "Cuishe", "Largo", "Cenizo", "Jabalí", "Madrecuixe", "Mexicano", "Arroqueño", "Tepeztate", "Tobalá"].filter(
      (name) => getTopBottlesForAgave(name).length === 0,
    );
    expect(empty.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/No bottles currently in our database/).length).toBe(empty.length);
  });

  it("fades cards in as they scroll into view", () => {
    let callback: IntersectionObserverCallback = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb;
        }
        observe() {}
        disconnect() {}
      },
    );
    const { container } = renderPage();
    const card = container.querySelector('[data-id="2"]')!;
    const other = container.querySelector('[data-id="3"]')!;
    expect(card.className).toContain("opacity-0");
    act(() =>
      callback(
        [
          { isIntersecting: true, target: card },
          { isIntersecting: false, target: other },
        ] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ),
    );
    expect(card.className).toContain("opacity-100");
    expect(other.className).toContain("opacity-0");
  });

  it("shows the Spanish copy when the visitor picked Spanish", () => {
    window.localStorage.setItem("soulsmoke-language", JSON.stringify("es"));
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Enciclopedia del Agave");
    expect(screen.getByText("LA BIBLIOTECA VIVIENTE")).toBeInTheDocument();
    expect(screen.getByText("15 variedades")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Filtros/ }));
    expect(screen.getByRole("group", { name: "Perfil de Sabor" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Rareza" })).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("group", { name: "Región" })).getByRole("button", { name: "Guerrero" }));
    expect(screen.getByText("1 variedad")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Volver/ })).toBeInTheDocument();
  });
});
