import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { AmbientSound } from "@/components/sake/ambient-sound";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

function fakeAudio() {
  const param = () => ({ value: 0, linearRampToValueAtTime: vi.fn() });
  const node = () => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn(), frequency: param(), Q: param(), gain: param(), type: "", buffer: null, loop: false });
  const close = vi.fn(async () => {});
  class Ctx {
    sampleRate = 100;
    currentTime = 0;
    destination = {};
    close = close;
    createBuffer = () => ({ getChannelData: () => new Float32Array(1000) });
    createBufferSource = node;
    createBiquadFilter = node;
    createOscillator = node;
    createGain = node;
  }
  vi.stubGlobal("AudioContext", Ctx);
  return { close };
}

afterEach(() => vi.unstubAllGlobals());

describe("AmbientSound", () => {
  it("does nothing until clicked, then plays and stops", async () => {
    const { close } = fakeAudio();
    const user = userEvent.setup();
    const { unmount } = render(
      <SakeProviders>
        <AmbientSound type="wind" />
      </SakeProviders>,
    );
    const button = screen.getByRole("button", { name: "Mountain wind" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.click(button);
    unmount();
    expect(close).toHaveBeenCalled();
  });

  it.each(["rain", "brewery", "stream"] as const)("builds the %s soundscape", async (type) => {
    fakeAudio();
    const user = userEvent.setup();
    render(
      <SakeProviders>
        <AmbientSound type={type} label={{ en: `play ${type}`, ja: "x" }} />
      </SakeProviders>,
    );
    await user.click(screen.getByRole("button", { name: `play ${type}` }));
    expect(screen.getByRole("button", { name: `play ${type}` })).toHaveAttribute("aria-pressed", "true");
  });
});
