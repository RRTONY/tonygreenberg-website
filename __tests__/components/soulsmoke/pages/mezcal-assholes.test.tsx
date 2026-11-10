import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MezcalAssholes } from "@/components/soulsmoke/pages/mezcal-assholes";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

function renderPage() {
  return render(
    <SoulsmokeProviders>
      <MezcalAssholes />
    </SoulsmokeProviders>,
  );
}

afterEach(() => window.localStorage.clear());

describe("MezcalAssholes", () => {
  it("renders the hero, the wall of shame and the sources", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("MezcalAssholes");
    expect(screen.getByText("BUYER BEWARE")).toBeInTheDocument();
    for (const brand of ["Casamigos", "Clase Azul", "Dos Hombres", "818 Tequila", "Cincoro", "Jose Cuervo Especial", "Don Julio", "Sauza"]) {
      expect(screen.getByRole("heading", { level: 3, name: brand })).toBeInTheDocument();
    }
    expect(screen.getAllByText("THE EVIDENCE:")).toHaveLength(8);
    expect(screen.getAllByRole("img", { name: "5 of 5" })).toHaveLength(3);
    expect(screen.getByRole("link", { name: /Source: Mezcalistas/ })).toHaveAttribute(
      "href",
      "https://www.mezcalistas.com/casamigos-lawsuit/",
    );
    expect(container.innerHTML).not.toMatch(/manus/i);
  });

  it("links the antidote buttons inside /soul-smoke", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /The US Hunt/ })).toHaveAttribute("href", "/soul-smoke/us-hunt");
    expect(screen.getByRole("link", { name: /The Mexico Source/ })).toHaveAttribute("href", "/soul-smoke/mexico-source");
  });

  it("shows the Spanish copy when the visitor picked Spanish", () => {
    window.localStorage.setItem("soulsmoke-language", JSON.stringify("es"));
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LosCabrones");
    expect(screen.getByText("CUIDADO COMPRADOR")).toBeInTheDocument();
    expect(screen.getByText("El Muro de la Vergüenza")).toBeInTheDocument();
    expect(screen.getAllByText("LA EVIDENCIA:")).toHaveLength(8);
    expect(screen.getByText("El Antídoto")).toBeInTheDocument();
    expect(screen.getByText("Descargo de responsabilidad:")).toBeInTheDocument();
  });
});
