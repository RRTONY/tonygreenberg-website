import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as aqueousMotion from "@/components/aqueous/motion";
import * as liquidsunMotion from "@/components/liquidsun/motion";

function stubObserver() {
  const options: (IntersectionObserverInit | undefined)[] = [];
  class FakeObserver {
    constructor(_cb: IntersectionObserverCallback, o?: IntersectionObserverInit) {
      options.push(o);
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  return options;
}

describe("Aqueous motion", () => {
  it("reveals with framer's default viewport margin (0px)", () => {
    const options = stubObserver();
    render(
      <aqueousMotion.Reveal enter="animate-in fade-in" className="card">
        <p>Inside</p>
      </aqueousMotion.Reveal>,
    );
    const box = screen.getByText("Inside").parentElement!;
    expect(box).toHaveClass("card", "opacity-0");
    expect(options[0]?.rootMargin).toBe("0px 0px 0px 0px");
  });

  it("passes a page's own margin through", () => {
    const options = stubObserver();
    render(
      <aqueousMotion.Reveal enter="animate-in" margin="-50px" as="section">
        <p>Inside</p>
      </aqueousMotion.Reveal>,
    );
    expect(screen.getByText("Inside").parentElement!.tagName).toBe("SECTION");
    expect(options[0]?.rootMargin).toBe("0px 0px -50px 0px");
  });

  it("re-exports LiquidSun's presence and reduced-motion helpers", () => {
    expect(aqueousMotion.usePresenceSwap).toBe(liquidsunMotion.usePresenceSwap);
    expect(aqueousMotion.usePrefersReducedMotion).toBe(liquidsunMotion.usePrefersReducedMotion);
  });
});
