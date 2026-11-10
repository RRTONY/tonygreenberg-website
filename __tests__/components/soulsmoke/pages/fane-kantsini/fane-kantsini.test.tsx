import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import type { FaneKantsiniMedia } from "@/components/soulsmoke/pages/fane-kantsini/fane-kantsini.data";

// The real media map is all null (not rescued from Manus yet). Tests switch it to a filled-in
// map to cover the player, photos and vault.
const mediaState = vi.hoisted(() => ({ filled: false }));
vi.mock("@/components/soulsmoke/pages/fane-kantsini/fane-kantsini.data", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/components/soulsmoke/pages/fane-kantsini/fane-kantsini.data")>();
  const pic = (n: string) => ({ src: `https://cdn.sanity.io/images/x/y/${n}.webp`, width: 800, height: 1000, alt: n });
  const filled: FaneKantsiniMedia = {
    logo: pic("logo"),
    heroBg: pic("bg"),
    agaveTexture: pic("texture"),
    videos: { main: "https://cdn.sanity.io/files/x/y/main.mp4", business: "https://cdn.sanity.io/files/x/y/biz.mp4" },
    photos: real.faneKantsiniMedia.photos.map((p, i) => ({ ...p, image: pic(`p${i}`) })),
  };
  return {
    ...real,
    get faneKantsiniMedia() {
      return mediaState.filled ? filled : real.faneKantsiniMedia;
    },
  };
});

const { FaneKantsini } = await import("@/components/soulsmoke/pages/fane-kantsini/fane-kantsini");

function renderPage() {
  return render(
    <SoulsmokeProviders>
      <FaneKantsini />
    </SoulsmokeProviders>,
  );
}

let observers: { cb: IntersectionObserverCallback; el?: Element }[] = [];

beforeEach(() => {
  observers = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      entry: { cb: IntersectionObserverCallback; el?: Element };
      constructor(cb: IntersectionObserverCallback) {
        this.entry = { cb };
        observers.push(this.entry);
      }
      observe(el: Element) {
        this.entry.el = el;
      }
      disconnect() {}
    },
  );
});

afterEach(() => {
  mediaState.filled = false;
  window.localStorage.clear();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("FaneKantsini", () => {
  it("renders the story, transcript and collective copy without the unrescued media", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Fane Kantsini");
    expect(screen.getByRole("heading", { level: 2, name: "How I Found the Unfindable" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "fifty bottles" })).toHaveAttribute("href", "/soul-smoke/us-hunt");
    expect(screen.getByText("This is devoted to Sosima of Fane Kantsini.")).toBeInTheDocument();
    expect(screen.getByText("Cheers to that.")).toBeInTheDocument();
    expect(screen.getByText("THE TASMANIAN TIGER OF AGAVES")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Philosophy of the Soil" })).toBeInTheDocument();
    expect(screen.queryByText("THE VAULT")).toBeNull();
    expect(container.querySelector("video")).toBeNull();
    expect(container.innerHTML).not.toMatch(/manus/i);
    // Transcript lines do nothing without a video.
    fireEvent.click(screen.getByText("Cheers to that.").closest("button")!);
  });

  it("reveals sections as they scroll into view", () => {
    renderPage();
    const label = screen.getByText("THE ORIGIN").parentElement!;
    expect(label.className).toContain("opacity-0");
    const target = observers.find((o) => o.el === label)!;
    act(() => target.cb([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(label.className).toContain("opacity-0");
    act(() => target.cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(label.className).toContain("opacity-100");
  });

  it("fades the hero out as the page scrolls", () => {
    renderPage();
    const hero = screen.getByRole("heading", { level: 1 }).closest("section")!.firstElementChild as HTMLElement;
    expect(hero.style.opacity).toBe("1");
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 1900 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 900 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 100 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(hero.style.opacity).toBe("0.5");
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 900 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(hero.style.opacity).toBe("1");
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });

  it("scrolls to the montage from Begin The Journey", () => {
    renderPage();
    const montage = document.getElementById("montage")!;
    montage.scrollIntoView = vi.fn();
    fireEvent.click(screen.getByRole("button", { name: "Begin The Journey" }));
    expect(montage.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("shows the Spanish origin story", () => {
    window.localStorage.setItem("soulsmoke-language", JSON.stringify("es"));
    renderPage();
    expect(screen.getByText("EL ORIGEN")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "cincuenta botellas" })).toBeInTheDocument();
  });

  describe("with the media rescued", () => {
    beforeEach(() => {
      mediaState.filled = true;
      vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
      vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    });

    it("shows the logo, photos and the vault", () => {
      renderPage();
      expect(screen.getByRole("img", { name: "Fane Kantsini Logo" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Sosima Olivera" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Women of Fane Kantsini" })).toBeInTheDocument();
      expect(screen.getByText("THE VAULT")).toBeInTheDocument();
      expect(screen.getByText("Business Discussion")).toBeInTheDocument();
      expect(screen.getAllByText("PHOTOGRAPHY")).toHaveLength(5);
    });

    it("plays, pauses and seeks the montage, highlighting the current line", () => {
      vi.useFakeTimers();
      const { container } = renderPage();
      const [main, business] = Array.from(container.querySelectorAll("video"));
      fireEvent.click(screen.getByRole("button", { name: "Play" }));
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("button", { name: "Play" })).toBeNull();

      Object.defineProperty(main, "currentTime", { configurable: true, writable: true, value: 1 });
      act(() => {
        vi.advanceTimersByTime(150);
      });
      // Highlighted line floats over the video.
      expect(screen.getByRole("heading", { level: 3, name: /Tasmanian Tiger of agaves/ })).toBeInTheDocument();

      fireEvent.click(main);
      expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();

      fireEvent.click(screen.getByText("Cheers to that.").closest("button")!);
      expect(main.currentTime).toBe(95);
      act(() => {
        vi.advanceTimersByTime(150);
      });
      expect(screen.getByText("Cheers to that.").closest("button")!.className).toContain("text-white");

      Object.defineProperty(main, "currentTime", { configurable: true, writable: true, value: 500 });
      act(() => {
        vi.advanceTimersByTime(150);
      });
      expect(screen.queryByRole("heading", { level: 3, name: /Tasmanian Tiger of agaves/ })).toBeNull();

      fireEvent.mouseEnter(business);
      fireEvent.mouseLeave(business);
      expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(2);
    });
  });
});
