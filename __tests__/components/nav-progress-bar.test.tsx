import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { NavProgressBar } from "@/components/nav-progress-bar";

function bar(container: HTMLElement) {
  return container.firstElementChild!.firstElementChild as HTMLDivElement;
}

describe("NavProgressBar", () => {
  afterEach(() => {
    delete (window as unknown as { navigation?: unknown }).navigation;
  });

  it("is hidden and decorative when the Navigation API is missing", () => {
    const { container } = render(<NavProgressBar />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(bar(container).style.width).toBe("0%");
    expect(bar(container).style.opacity).toBe("0");
  });

  it("shows on navigate and fills to 100% on success", async () => {
    const nav = new EventTarget();
    (window as unknown as { navigation: EventTarget }).navigation = nav;
    const { container } = render(<NavProgressBar />);
    await act(async () => {
      nav.dispatchEvent(new Event("navigate"));
      await Promise.resolve();
    });
    expect(bar(container).style.width).toBe("15%");
    expect(bar(container).style.opacity).toBe("1");
    await act(async () => {
      nav.dispatchEvent(new Event("navigatesuccess"));
      await Promise.resolve();
    });
    expect(bar(container).style.width).toBe("100%");
  });

  describe("with timers", () => {
    let nav: EventTarget;
    const fire = async (type: string) => {
      await act(async () => {
        nav.dispatchEvent(new Event(type));
        await Promise.resolve();
      });
    };

    beforeEach(() => {
      vi.useFakeTimers();
      nav = new EventTarget();
      (window as unknown as { navigation: EventTarget }).navigation = nav;
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("creeps toward 85% while a navigation is in flight but never past it", async () => {
      const { container } = render(<NavProgressBar />);
      await fire("navigate");
      act(() => {
        vi.advanceTimersByTime(200);
      });
      // 15 + (85 - 15) * 0.1
      expect(parseFloat(bar(container).style.width)).toBeCloseTo(22, 5);
      act(() => {
        vi.advanceTimersByTime(200 * 300);
      });
      const w = parseFloat(bar(container).style.width);
      expect(w).toBeGreaterThan(84);
      expect(w).toBeLessThanOrEqual(85);
    });

    it("hides and resets 200ms after the navigation finishes", async () => {
      const { container } = render(<NavProgressBar />);
      await fire("navigate");
      await fire("navigatesuccess");
      expect(bar(container).style.width).toBe("100%");
      act(() => {
        vi.advanceTimersByTime(199);
      });
      expect(bar(container).style.opacity).toBe("1");
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(bar(container).style.opacity).toBe("0");
      expect(bar(container).style.width).toBe("0%");
      // The creep stopped at finish: no more progress afterwards.
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(bar(container).style.width).toBe("0%");
    });

    it("a failed navigation also completes the bar", async () => {
      const { container } = render(<NavProgressBar />);
      await fire("navigate");
      await fire("navigateerror");
      expect(bar(container).style.width).toBe("100%");
    });

    it("a new navigation during the hide delay restarts the bar instead of hiding it", async () => {
      const { container } = render(<NavProgressBar />);
      await fire("navigate");
      await fire("navigatesuccess");
      await fire("navigate");
      act(() => {
        vi.advanceTimersByTime(200);
      });
      // The pending hide was cancelled; the bar is visible and creeping again.
      expect(bar(container).style.opacity).toBe("1");
      expect(parseFloat(bar(container).style.width)).toBeCloseTo(22, 5);
    });

    it("stops listening and clears its timers when unmounted", async () => {
      const remove = vi.spyOn(nav, "removeEventListener");
      const { unmount } = render(<NavProgressBar />);
      await fire("navigate");
      await fire("navigatesuccess");
      expect(vi.getTimerCount()).toBeGreaterThan(0);
      unmount();
      expect(remove.mock.calls.map((c) => c[0]).sort()).toEqual(["navigate", "navigateerror", "navigatesuccess"]);
      expect(vi.getTimerCount()).toBe(0);
    });
  });
});
