import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import Link from "next/link";
import { GaEvents } from "@/components/ga-events";
import { navigation } from "@tests/helpers/next";

let gtag: ReturnType<typeof vi.fn>;
const names = () => gtag.mock.calls.map((c) => c[1]);

function scrollTo(pct: number) {
  Object.defineProperty(document.documentElement, "scrollHeight", { value: 2000, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
  Object.defineProperty(window, "scrollY", { value: (pct / 100) * 1000, configurable: true });
  fireEvent.scroll(window);
}

describe("GaEvents", () => {
  beforeEach(() => {
    gtag = vi.fn();
    vi.stubGlobal("gtag", gtag);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends nothing and doesn't crash when gtag isn't loaded", () => {
    vi.stubGlobal("gtag", undefined);
    navigation.pathname = "/blog/five-cups";
    render(<GaEvents />);
    expect(() => scrollTo(95)).not.toThrow();
  });

  it("fires article scroll milestones once each on an essay", () => {
    navigation.pathname = "/blog/five-cups";
    render(<GaEvents />);
    scrollTo(55);
    scrollTo(60);
    expect(names()).toEqual(["article_25_scroll", "article_50_scroll"]);
    expect(gtag).toHaveBeenCalledWith("event", "article_50_scroll", { page_path: "/blog/five-cups", post_slug: "five-cups" });
    scrollTo(95);
    expect(names()).toEqual(["article_25_scroll", "article_50_scroll", "article_75_scroll", "article_90_scroll"]);
  });

  it("uses page_ milestones on non-essay pages (including blog categories)", () => {
    navigation.pathname = "/blog/category/body";
    render(<GaEvents />);
    scrollTo(30);
    expect(gtag).toHaveBeenCalledWith("event", "page_25_scroll", { page_path: "/blog/category/body", post_slug: "" });
  });

  it("fires engaged_45_seconds after 45 seconds", () => {
    vi.useFakeTimers();
    navigation.pathname = "/about";
    render(<GaEvents />);
    vi.advanceTimersByTime(44_999);
    expect(names()).not.toContain("engaged_45_seconds");
    vi.advanceTimersByTime(1);
    expect(gtag).toHaveBeenCalledWith("event", "engaged_45_seconds", { page_path: "/about" });
  });

  it("fires second_page_view when the visitor moves to another page", () => {
    navigation.pathname = "/";
    const { rerender } = render(<GaEvents />);
    expect(names()).not.toContain("second_page_view");
    navigation.pathname = "/blog";
    rerender(<GaEvents />);
    expect(gtag).toHaveBeenCalledWith("event", "second_page_view", { from_path: "/", to_path: "/blog" });
  });

  it("tracks homepage path clicks", () => {
    navigation.pathname = "/";
    render(
      <>
        <GaEvents />
        <Link href="/amplifier">work</Link>
        <Link href="/blog">thinking</Link>
        <Link href="/invest">building</Link>
        <Link href="/start-here">start</Link>
      </>,
    );
    for (const a of Array.from(document.querySelectorAll("a"))) {
      a.addEventListener("click", (e) => e.preventDefault());
      fireEvent.click(a);
    }
    expect(names()).toEqual(["homepage_path_work", "homepage_path_thinking", "homepage_path_building", "start_here_open"]);
  });
});
