import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { SoulsmokeHome } from "@/components/soulsmoke/pages/soulsmoke-home";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

function renderHome() {
  return render(
    <SoulsmokeProviders>
      <SoulsmokeHome />
    </SoulsmokeProviders>,
  );
}

describe("SoulsmokeHome", () => {
  it("shows the hero, the manifesto and the adventure cards linking inside /soul-smoke", () => {
    renderHome();
    expect(screen.getByRole("heading", { level: 1, name: "SOULSMOKE" })).toBeInTheDocument();
    expect(screen.getByText("The Miracle of Mezcal")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Find Your Agave by Scent/ })).toHaveAttribute(
      "href",
      "/soul-smoke/scent-finder",
    );
    expect(screen.getByText(/Veuve Clicquot of Mezcal/)).toBeInTheDocument();
    for (const [name, href] of [
      [/The US Hunt/, "/soul-smoke/us-hunt"],
      [/The Mexico Source/, "/soul-smoke/mexico-source"],
      [/Scent-to-Agave Finder/, "/soul-smoke/scent-finder"],
      [/Agave Encyclopedia/, "/soul-smoke/agave-encyclopedia"],
      [/The Ancestral Process/, "/soul-smoke/ancestral-process"],
    ] as const) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
    expect(screen.getByRole("heading", { name: "Join the Hunt" })).toBeInTheDocument();
    expect(screen.getByText("YOUR JOURNEY")).toBeInTheDocument();
  });

  it("fades the hero as the visitor scrolls", () => {
    const { container } = renderHome();
    const hero = container.querySelector("section")!;
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 300, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(hero.style.opacity).toBe("0.5");
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it("in Aficionado mode titles it MEZCAL GUIDE without the smoke layers, and speaks Spanish", () => {
    window.localStorage.setItem("mezcal-view-mode", '"aficionado"');
    window.localStorage.setItem("soulsmoke-language", '"es"');
    const { container } = renderHome();
    expect(screen.getByRole("heading", { level: 1, name: "MEZCAL GUIDE" })).toBeInTheDocument();
    expect(container.querySelector(".smoke-wisps")).toBeNull();
    expect(screen.getByText("La Cacería USA")).toBeInTheDocument();
    expect(screen.getByText(/Dos Formas de/)).toBeInTheDocument();
  });
});
