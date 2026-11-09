import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoulsmokeEffects } from "@/components/soulsmoke/soulsmoke-effects";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

class FakeAudio {
  static last: FakeAudio | null = null;
  src: string;
  loop = false;
  volume = 1;
  preload = "";
  play = vi.fn(() => Promise.resolve());
  pause = vi.fn();
  constructor(src: string) {
    this.src = src;
    FakeAudio.last = this;
  }
}

function renderEffects() {
  return render(
    <SoulsmokeProviders>
      <SoulsmokeEffects />
    </SoulsmokeProviders>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("SoulsmokeEffects", () => {
  it("plays and stops the fire sound from Sanity (not Manus)", async () => {
    vi.stubGlobal("Audio", FakeAudio);
    const user = userEvent.setup();
    const { unmount } = renderEffects();
    expect(FakeAudio.last!.src).toContain("cdn.sanity.io");
    expect(FakeAudio.last!.loop).toBe(true);
    const button = screen.getByRole("button", { name: "Ambient sound" });
    expect(button).toHaveTextContent("Light fire");
    await user.click(button);
    expect(FakeAudio.last!.play).toHaveBeenCalled();
    expect(button).toHaveTextContent("Fire on");
    await user.click(button);
    expect(FakeAudio.last!.pause).toHaveBeenCalled();
    expect(button).toHaveTextContent("Light fire");
    unmount();
  });

  it("resets the button if the browser blocks playback, and speaks Spanish", async () => {
    class BlockedAudio extends FakeAudio {
      play = vi.fn(() => Promise.reject(new Error("NotAllowedError")));
    }
    vi.stubGlobal("Audio", BlockedAudio);
    window.localStorage.setItem("soulsmoke-language", '"es"');
    const user = userEvent.setup();
    renderEffects();
    const button = screen.getByRole("button", { name: "Sonido ambiente" });
    expect(button).toHaveTextContent("Encender fuego");
    await user.click(button);
    await act(async () => {});
    expect(button).toHaveTextContent("Encender fuego");
  });

  it("draws smoke that follows the mouse and fades", () => {
    vi.stubGlobal("Audio", FakeAudio);
    vi.useFakeTimers();
    const { container } = renderEffects();
    const layer = container.querySelector(".smoke-cursor-container")!;
    act(() => {
      fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });
    });
    expect(layer.children.length).toBe(1);
    act(() => {
      fireEvent.mouseMove(window, { clientX: 300, clientY: 300 }); // throttled
      vi.advanceTimersByTime(60);
      fireEvent.mouseMove(window, { clientX: 104, clientY: 104 }); // too small a move
    });
    expect(layer.children.length).toBe(1);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(layer.children.length).toBe(0);
  });

  it("hides smoke and sound in Aficionado mode", () => {
    vi.stubGlobal("Audio", FakeAudio);
    window.localStorage.setItem("mezcal-view-mode", '"aficionado"');
    const { container } = renderEffects();
    expect(container.querySelector(".smoke-cursor-container")).toBeNull();
    expect(screen.queryByRole("button", { name: "Ambient sound" })).toBeNull();
  });

  it("blocks the right-click menu, save/view-source shortcuts and image dragging", () => {
    vi.stubGlobal("Audio", FakeAudio);
    renderEffects();
    const blocked = (event: Event) => {
      document.dispatchEvent(event);
      return event.defaultPrevented;
    };
    expect(blocked(new MouseEvent("contextmenu", { cancelable: true }))).toBe(true);
    expect(blocked(new KeyboardEvent("keydown", { key: "s", ctrlKey: true, cancelable: true }))).toBe(true);
    expect(blocked(new KeyboardEvent("keydown", { key: "u", metaKey: true, cancelable: true }))).toBe(true);
    expect(blocked(new KeyboardEvent("keydown", { key: "I", ctrlKey: true, shiftKey: true, cancelable: true }))).toBe(true);
    expect(blocked(new KeyboardEvent("keydown", { key: "i", metaKey: true, altKey: true, cancelable: true }))).toBe(true);
    expect(blocked(new KeyboardEvent("keydown", { key: "F12", cancelable: true }))).toBe(true);
    expect(blocked(new KeyboardEvent("keydown", { key: "a", cancelable: true }))).toBe(false);
    const img = document.createElement("img");
    document.body.appendChild(img);
    const drag = new Event("dragstart", { bubbles: true, cancelable: true });
    img.dispatchEvent(drag);
    expect(drag.defaultPrevented).toBe(true);
    const textDrag = new Event("dragstart", { bubbles: true, cancelable: true });
    document.body.dispatchEvent(textDrag);
    expect(textDrag.defaultPrevented).toBe(false);
    img.remove();
  });
});
