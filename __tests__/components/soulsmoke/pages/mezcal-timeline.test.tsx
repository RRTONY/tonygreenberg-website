import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MezcalTimeline } from "@/components/soulsmoke/pages/mezcal-timeline";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

function renderTimeline() {
  return render(
    <SoulsmokeProviders>
      <MezcalTimeline />
    </SoulsmokeProviders>,
  );
}

describe("MezcalTimeline", () => {
  it("renders the six eras, the hierarchy and the CTA links", () => {
    renderTimeline();
    expect(screen.getByRole("heading", { level: 1, name: /From Worm\s*to Wonder/ })).toBeInTheDocument();
    for (const name of ["The Dark Ages", "The Awakening", "The Education", "The Recognition", "The Ascension", "The Higher Power"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getByText("Cognac")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find Your Agave" })).toHaveAttribute("href", "/soul-smoke/scent-finder");
    expect(screen.getByRole("link", { name: "Explore the Hunt" })).toHaveAttribute("href", "/soul-smoke/us-hunt");
  });

  it("fills the progress bar as the visitor scrolls", () => {
    const { container } = renderTimeline();
    const bar = container.querySelector("[style]") as HTMLElement;
    expect(bar.style.width).toBe("0%");
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 2000 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 500 });
    fireEvent.scroll(window);
    expect(bar.style.width).toBe("50%");
    Object.defineProperty(window, "scrollY", { configurable: true, value: 5000 });
    fireEvent.scroll(window);
    expect(bar.style.width).toBe("100%");
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 1000 });
    fireEvent.scroll(window);
    expect(bar.style.width).toBe("0%");
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });
});
