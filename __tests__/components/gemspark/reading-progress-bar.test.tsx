import { describe, expect, it } from "vitest";
import { act, render } from "@testing-library/react";
import { ReadingProgressBar } from "@/components/gemspark/reading-progress-bar";

function setScroll(y: number, scrollHeight: number) {
  Object.defineProperty(document.documentElement, "scrollHeight", { value: scrollHeight, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
}

describe("ReadingProgressBar", () => {
  it("stays hidden at the top and grows with the scroll", () => {
    setScroll(0, 3000);
    const { container } = render(<ReadingProgressBar />);
    expect(container.firstChild).toBeNull();

    act(() => {
      setScroll(1000, 3000);
      window.dispatchEvent(new Event("scroll"));
    });
    expect(container.querySelector<HTMLElement>(".h-full")!.style.width).toBe("50%");

    act(() => {
      setScroll(5000, 3000);
      window.dispatchEvent(new Event("scroll"));
    });
    expect(container.querySelector<HTMLElement>(".h-full")!.style.width).toBe("100%");
  });

  it("hides when the page is shorter than the window", () => {
    setScroll(500, 3000);
    const { container } = render(<ReadingProgressBar />);
    act(() => window.dispatchEvent(new Event("scroll")));
    expect(container.firstChild).not.toBeNull();
    act(() => {
      setScroll(0, 800);
      window.dispatchEvent(new Event("scroll"));
    });
    expect(container.firstChild).toBeNull();
  });
});
