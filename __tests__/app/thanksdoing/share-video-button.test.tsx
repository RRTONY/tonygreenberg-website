import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareVideoButton } from "@/app/thanksdoing/share-video-button";

const FALLBACK = "Use Download MP4, then share the saved video from Files or Photos.";

function mockFetch(ok = true) {
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok, blob: async () => new Blob(["mp4"], { type: "video/mp4" }) })));
}
function mockShare(canShare: boolean, share: () => Promise<void> = async () => {}) {
  Object.defineProperty(navigator, "canShare", { configurable: true, value: vi.fn(() => canShare) });
  Object.defineProperty(navigator, "share", { configurable: true, value: vi.fn(share) });
}
afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, "canShare");
  Reflect.deleteProperty(navigator, "share");
});

async function ready() {
  const button = screen.getByRole("button", { name: /share video/i });
  await waitFor(() => expect(button).toBeEnabled());
  return button;
}

describe("ShareVideoButton", () => {
  it("shows a spinner and stays disabled while the video loads", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    const { container } = render(<ShareVideoButton src="/v.mp4" />);
    expect(screen.getByRole("button", { name: /share video/i })).toBeDisabled();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shares the MP4 file itself, not a link", async () => {
    mockFetch();
    mockShare(true);
    render(<ShareVideoButton src="/v.mp4" />);
    await userEvent.setup().click(await ready());
    const [[arg]] = vi.mocked(navigator.share).mock.calls as unknown as [[{ files: File[] }]];
    expect(arg.files[0].name).toBe("ThanksDOING.mp4");
    expect(arg.files[0].type).toBe("video/mp4");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("falls back to download advice when file sharing isn't supported", async () => {
    mockFetch();
    mockShare(false);
    render(<ShareVideoButton src="/v.mp4" />);
    await userEvent.setup().click(await ready());
    expect(screen.getByRole("status")).toHaveTextContent(FALLBACK);
    expect(navigator.share).not.toHaveBeenCalled();
  });

  it("stays quiet when the person cancels, and advises download on a real error", async () => {
    mockFetch();
    mockShare(true, async () => { throw new DOMException("cancelled", "AbortError"); });
    const { unmount } = render(<ShareVideoButton src="/v.mp4" />);
    await userEvent.setup().click(await ready());
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    unmount();

    mockShare(true, async () => { throw new Error("boom"); });
    render(<ShareVideoButton src="/v.mp4" />);
    await userEvent.setup().click(await ready());
    expect(screen.getByRole("status")).toHaveTextContent(FALLBACK);
  });

  it("enables the button with download advice if the video can't be fetched", async () => {
    mockFetch(false);
    render(<ShareVideoButton src="/v.mp4" />);
    await ready();
    expect(screen.getByRole("status")).toHaveTextContent(FALLBACK);
  });

  it("ignores the abort when it unmounts mid-download", async () => {
    vi.stubGlobal("fetch", vi.fn((_: string, init: { signal: AbortSignal }) => new Promise((_r, reject) => init.signal.addEventListener("abort", () => reject(new DOMException("a", "AbortError"))))));
    const { unmount } = render(<ShareVideoButton src="/v.mp4" />);
    unmount();
    await new Promise((r) => setTimeout(r, 0));
  });
});
