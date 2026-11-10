import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { AncestralProcess, processStages } from "@/components/soulsmoke/pages/ancestral-process";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

function renderPage() {
  return render(
    <SoulsmokeProviders>
      <AncestralProcess />
    </SoulsmokeProviders>,
  );
}

describe("AncestralProcess", () => {
  it("renders the six stages with their quotes", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Ancestral Process");
    for (const stage of processStages) {
      expect(screen.getByRole("heading", { level: 2, name: stage.title })).toBeInTheDocument();
      expect(screen.getByText(`"${stage.quote}"`)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /Back/ })).toHaveAttribute("href", "/soul-smoke");
    expect(screen.getByRole("link", { name: /Explore the Agaves/ })).toHaveAttribute(
      "href",
      "/soul-smoke/agave-encyclopedia",
    );
  });

  it("moves the progress bar and active dot as the page scrolls", () => {
    const { container } = renderPage();
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 7000 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 3000 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    const bar = container.querySelector(".fixed.top-0 > div") as HTMLElement;
    expect(bar.style.width).toBe("50%");
    // 3000 / (6000 / 6) = stage index 3 is active, earlier ones are "done".
    expect(screen.getByRole("button", { name: "The Fermentation" })).toHaveClass("scale-150");
    expect(screen.getByRole("button", { name: "The Harvest" })).toHaveClass("bg-lime-500/50");
    expect(screen.getByRole("button", { name: "The Resting" })).toHaveClass("bg-stone-700");
  });

  it("scrolls to a stage when its dot is clicked", () => {
    renderPage();
    const spy = vi.spyOn(Element.prototype, "scrollIntoView");
    fireEvent.click(screen.getByRole("button", { name: "The Roasting" }));
    expect(spy).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("shows the Spanish copy when the visitor picked Spanish", () => {
    window.localStorage.setItem("soulsmoke-language", JSON.stringify("es"));
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("El Proceso Ancestral");
    expect(screen.getByRole("link", { name: /Volver/ })).toBeInTheDocument();
    expect(screen.getByText("EL VIAJE CONTINÚA")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Encuentra Tu Sabor/ })).toBeInTheDocument();
  });
});
