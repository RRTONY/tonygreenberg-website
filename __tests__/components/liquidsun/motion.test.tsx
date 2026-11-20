import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Reveal, usePrefersReducedMotion, usePresenceSwap } from "@/components/liquidsun/motion";

function stubReducedMotion(matches: boolean) {
  const listeners: (() => void)[] = [];
  const mq = {
    matches,
    addEventListener: vi.fn((_: string, l: () => void) => listeners.push(l)),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal("matchMedia", vi.fn(() => mq));
  window.matchMedia = vi.fn(() => mq) as unknown as typeof window.matchMedia;
  return { mq, fire: () => listeners.forEach((l) => l()) };
}

// An IntersectionObserver the test can trigger.
function stubObserver() {
  const instances: { cb: IntersectionObserverCallback; options?: IntersectionObserverInit; disconnect: ReturnType<typeof vi.fn> }[] = [];
  class FakeObserver {
    disconnect = vi.fn();
    constructor(
      public cb: IntersectionObserverCallback,
      public options?: IntersectionObserverInit,
    ) {
      instances.push(this);
    }
    observe = vi.fn();
    unobserve = vi.fn();
  }
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  return instances;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("Reveal", () => {
  it("starts transparent and adds its enter classes once it scrolls into view", () => {
    stubReducedMotion(false);
    const observers = stubObserver();
    render(
      <Reveal enter="animate-in fade-in" className="base" delay={0.3}>
        <p>Inside</p>
      </Reveal>,
    );
    const box = screen.getByText("Inside").parentElement!;
    expect(box).toHaveClass("base", "opacity-0");
    expect(box).toHaveAttribute("data-revealed", "false");
    expect(observers[0].options?.rootMargin).toBe("0px 0px -100px 0px");

    act(() => observers[0].cb([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(box).toHaveClass("opacity-0");
    act(() => observers[0].cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(box).toHaveClass("base", "animate-in", "fade-in");
    expect(box).not.toHaveClass("opacity-0");
    expect(box.style.animationDelay).toBe("0.3s");
    expect(observers[0].disconnect).toHaveBeenCalled();
  });

  it("renders as another tag and with a custom margin", () => {
    stubReducedMotion(false);
    const observers = stubObserver();
    render(
      <ul>
        <Reveal as="li" enter="animate-in" margin="0px">
          Item
        </Reveal>
      </ul>,
    );
    expect(screen.getByText("Item").tagName).toBe("LI");
    expect(observers[0].options?.rootMargin).toBe("0px 0px 0px 0px");
  });

  it("shows right away without an IntersectionObserver", () => {
    vi.useFakeTimers();
    stubReducedMotion(false);
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Reveal enter="animate-in">Plain</Reveal>);
    expect(screen.getByText("Plain")).toHaveClass("opacity-0");
    act(() => vi.runAllTimers());
    expect(screen.getByText("Plain")).toHaveClass("animate-in");
    expect(screen.getByText("Plain").style.animationDelay).toBe("");
  });

  it("shows at once for reduce-motion visitors", () => {
    stubReducedMotion(true);
    stubObserver();
    render(<Reveal enter="animate-in">Still</Reveal>);
    expect(screen.getByText("Still")).toHaveAttribute("data-revealed", "true");
  });
});

describe("usePrefersReducedMotion", () => {
  it("follows the system setting", () => {
    const { mq, fire } = stubReducedMotion(false);
    const { result, unmount } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
    mq.matches = true;
    act(() => fire());
    expect(result.current).toBe(true);
    unmount();
    expect(mq.removeEventListener).toHaveBeenCalled();
  });
});

describe("usePresenceSwap", () => {
  it("keeps the old value while it leaves, then shows the new one", () => {
    vi.useFakeTimers();
    stubReducedMotion(false);
    const { result, rerender } = renderHook(({ v }) => usePresenceSwap(v, 300), { initialProps: { v: "a" } });
    expect(result.current).toEqual({ shown: "a", leaving: false });
    rerender({ v: "b" });
    expect(result.current).toEqual({ shown: "a", leaving: true });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current.shown).toBe("a");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toEqual({ shown: "b", leaving: false });
  });

  it("swaps immediately for reduce-motion visitors", () => {
    vi.useFakeTimers();
    stubReducedMotion(true);
    const { result, rerender } = renderHook(({ v }) => usePresenceSwap(v, 300), { initialProps: { v: 1 } });
    rerender({ v: 2 });
    act(() => vi.advanceTimersByTime(0));
    expect(result.current).toEqual({ shown: 2, leaving: false });
  });
});
