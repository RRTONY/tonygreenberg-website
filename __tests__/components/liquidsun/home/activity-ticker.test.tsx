import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { ActivityTicker, seededActivities } from "@/components/liquidsun/home/activity-ticker";

describe("ActivityTicker", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows the first line, slides it out after 4s and the next one in 0.4s later, looping", () => {
    render(<ActivityTicker />);
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText(seededActivities[0].text)).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(4000));
    // Exit phase: still the old line, now animating out.
    expect(screen.getByText(seededActivities[0].text).parentElement).toHaveClass("animate-out");
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByText(seededActivities[1].text).parentElement).toHaveClass("animate-in");

    // Twelve lines later it wraps back to the first.
    // The line changes every 4s whatever the swap is doing: 11 more ticks reach line 12 -> line 1.
    for (let i = 0; i < seededActivities.length - 1; i++) act(() => vi.advanceTimersByTime(4000));
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByText(seededActivities[0].text)).toBeInTheDocument();
  });
});
