import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AudioController, ContentProtection, crossfade } from "@/components/liquidsun/liquidsun-effects";
import { LIQUIDSUN_AUDIO } from "@/lib/content/liquidsun/images";

function keydown(init: KeyboardEventInit) {
  const event = new KeyboardEvent("keydown", { ...init, bubbles: true, cancelable: true });
  document.dispatchEvent(event);
  return event.defaultPrevented;
}

describe("ContentProtection", () => {
  it("blocks the right-click menu, save/source/print/devtools keys and dragging images while mounted", () => {
    const { unmount } = render(<ContentProtection />);
    const menu = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    document.dispatchEvent(menu);
    expect(menu.defaultPrevented).toBe(true);

    expect(keydown({ key: "s", ctrlKey: true })).toBe(true);
    expect(keydown({ key: "U", ctrlKey: true })).toBe(true);
    expect(keydown({ key: "p", metaKey: true })).toBe(true);
    expect(keydown({ key: "I", ctrlKey: true, shiftKey: true })).toBe(true);
    expect(keydown({ key: "j", ctrlKey: true, shiftKey: true })).toBe(true);
    expect(keydown({ key: "c", ctrlKey: true, shiftKey: true })).toBe(true);
    expect(keydown({ key: "i", metaKey: true, altKey: true })).toBe(true);
    expect(keydown({ key: "F12" })).toBe(true);

    expect(keydown({ key: "c", ctrlKey: true })).toBe(false);
    expect(keydown({ key: "a" })).toBe(false);
    expect(keydown({ key: "i", ctrlKey: true })).toBe(false);

    const img = document.createElement("img");
    document.body.appendChild(img);
    const drag = new Event("dragstart", { bubbles: true, cancelable: true });
    img.dispatchEvent(drag);
    expect(drag.defaultPrevented).toBe(true);
    const textDrag = new Event("dragstart", { bubbles: true, cancelable: true });
    document.body.dispatchEvent(textDrag);
    expect(textDrag.defaultPrevented).toBe(false);
    img.remove();

    unmount();
    const after = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    document.dispatchEvent(after);
    expect(after.defaultPrevented).toBe(false);
  });
});

describe("crossfade", () => {
  it("is wind at the top, a blend in the middle and grind at the bottom", () => {
    expect(crossfade(0)).toEqual({ wind: 0.3, grind: 0, track: "wind" });
    expect(crossfade(Number.NaN)).toEqual({ wind: 0.3, grind: 0, track: "wind" });
    const mid = crossfade(0.5);
    expect(mid.track).toBeNull();
    expect(mid.wind).toBeCloseTo(0.15);
    expect(mid.grind).toBeCloseTo(0.2);
    expect(crossfade(0.9)).toEqual({ wind: 0, grind: 0.4, track: "grind" });
  });
});

describe("AudioController", () => {
  let play: ReturnType<typeof vi.fn>;
  let pause: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    play = vi.fn(() => Promise.resolve());
    pause = vi.fn();
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(play as never);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pause as never);
  });
  afterEach(() => vi.useRealTimers());

  it("loads the rescued sounds muted, then plays and labels the track", async () => {
    vi.useFakeTimers();
    const { container } = render(<AudioController />);
    const [wind, grind] = Array.from(container.querySelectorAll("audio"));
    expect(wind).toHaveAttribute("src", LIQUIDSUN_AUDIO.wind);
    expect(grind).toHaveAttribute("src", LIQUIDSUN_AUDIO.grind);
    expect(wind.loop).toBe(true);
    expect(wind.volume).toBeCloseTo(0.3);
    expect(grind.volume).toBe(0);

    const button = screen.getByRole("button", { name: "Play ambient sound" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(button);
    expect(play).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Now Playing: Agave Fields (Night)")).toHaveClass("animate-in");
    act(() => vi.advanceTimersByTime(200));

    fireEvent.click(screen.getByRole("button", { name: "Mute ambient sound" }));
    expect(pause).toHaveBeenCalledTimes(2);
    // The label slides out for 200ms before it goes.
    act(() => vi.advanceTimersByTime(0));
    expect(screen.getByText(/Now Playing/)).toHaveClass("animate-out");
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText(/Now Playing/)).not.toBeInTheDocument();
  });

  it("crossfades the two loops as the page scrolls", () => {
    const { container } = render(<AudioController />);
    const [wind, grind] = Array.from(container.querySelectorAll("audio"));
    fireEvent.click(screen.getByRole("button", { name: "Play ambient sound" }));
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 2000 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000 });

    Object.defineProperty(window, "scrollY", { configurable: true, value: 500 });
    fireEvent.scroll(window);
    expect(wind.volume).toBeCloseTo(0.15);
    expect(grind.volume).toBeCloseTo(0.2);

    Object.defineProperty(window, "scrollY", { configurable: true, value: 950 });
    fireEvent.scroll(window);
    expect(grind.volume).toBeCloseTo(0.4);
    expect(screen.getByText("Now Playing: Volcanic Tahona (Grind)")).toBeInTheDocument();

    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 1000 });
    fireEvent.scroll(window);
    expect(wind.volume).toBeCloseTo(0.3);
    expect(screen.getByText("Now Playing: Agave Fields (Night)")).toBeInTheDocument();
  });

  it("stays quiet when the browser blocks playback", async () => {
    play.mockImplementation(() => Promise.reject(new Error("NotAllowedError")));
    render(<AudioController />);
    fireEvent.click(screen.getByRole("button", { name: "Play ambient sound" }));
    await act(async () => {});
    expect(screen.getByRole("button", { name: "Mute ambient sound" })).toBeInTheDocument();
  });
});
