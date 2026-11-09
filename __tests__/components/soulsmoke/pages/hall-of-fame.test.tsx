import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HallOfFame } from "@/components/soulsmoke/pages/hall-of-fame";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

const renderPage = () =>
  render(
    <SoulsmokeProviders>
      <HallOfFame />
    </SoulsmokeProviders>,
  );

beforeEach(() => localStorage.clear());

describe("HallOfFame", () => {
  it("renders the hero, philosophy, six heroes and the onward links", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hall ofFame");
    for (const name of ["Real Minero", "Fortaleza", "El Tesoro", "Fane Kantsini", "Tapatio", "Del Maguey"]) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
    }
    expect(screen.getAllByText("mezcal")[0]).toHaveClass("text-amber-400");
    expect(screen.getAllByText("tequila")[0]).toHaveClass("text-blue-400");
    expect(screen.getAllByRole("img", { name: "5 of 5" })).toHaveLength(5);
    expect(screen.getByRole("img", { name: "4 of 5" })).toBeInTheDocument();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/soul-smoke/us-hunt", "/soul-smoke/mexico-source", "/soul-smoke/assholes", "/soul-smoke/fane-kantsini"]) {
      expect(hrefs).toContain(href);
    }
  });

  it("speaks Spanish when the visitor chose ES", () => {
    localStorage.setItem("soulsmoke-language", JSON.stringify("es"));
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Salón de laFama");
    expect(screen.getByText("Los Puristas")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Leer la Historia/ })).toBeInTheDocument();
  });
});
