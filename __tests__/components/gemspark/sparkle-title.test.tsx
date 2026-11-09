import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { SparkleTitle } from "@/components/gemspark/sparkle-title";

describe("SparkleTitle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("bursts stars around the pointer while hovered, stops on leave, and clears them", () => {
    render(
      <SparkleTitle>
        <h1>The GemSpark</h1>
      </SparkleTitle>,
    );
    const wrapper = screen.getByRole("heading").parentElement!;
    fireEvent.mouseEnter(wrapper, { clientX: 100, clientY: 50 });
    fireEvent.mouseMove(wrapper, { clientX: 120, clientY: 60 });
    expect(screen.getAllByTestId("gemspark-sparkle")).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    const count = screen.getAllByTestId("gemspark-sparkle").length;
    expect(count).toBeGreaterThan(1);
    const star = screen.getAllByTestId("gemspark-sparkle")[0];
    expect(star).toHaveClass("gemspark-sparkle");
    expect(star.style.animationDuration).toMatch(/ms$/);
    expect(star.style.getPropertyValue("--gemspark-rotation")).toMatch(/deg$/);

    fireEvent.mouseLeave(wrapper);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.queryAllByTestId("gemspark-sparkle")).toHaveLength(0);
  });

  it("stops emitting when unmounted mid-hover", () => {
    const { unmount } = render(
      <SparkleTitle>
        <h1>The GemSpark</h1>
      </SparkleTitle>,
    );
    fireEvent.mouseEnter(screen.getByRole("heading").parentElement!, { clientX: 10, clientY: 10 });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
