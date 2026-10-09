"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// GA4 custom events, ported from legacy client/src/components/
// ConversionMechanics.tsx (`AnalyticsTracker` + `fireGA4`, rendered on every
// page by App.tsx) with the same event names and parameters, so the existing
// GA4 reports keep working after the switch from Manus:
//   article_25/50/75/90_scroll (essays) or page_25/50/75/90_scroll (others),
//   engaged_45_seconds, second_page_view, and on the homepage
//   homepage_path_work / _thinking / _building, start_here_open.
// Sends nothing unless google-analytics.tsx loaded gtag (tonygreenberg.com
// only). Legacy's own page_view on every history change is NOT ported: GA4's
// Enhanced measurement already counts in-site page changes, so it would
// double-count. Legacy's Manus-hosted Umami analytics is gone with Manus.

type Gtag = (command: "event", name: string, params?: Record<string, string | number | boolean>) => void;

function fire(name: string, params?: Record<string, string | number | boolean>) {
  try {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag === "function") gtag("event", name, params ?? {});
  } catch {
    // Analytics must never break the page.
  }
}

function sessionGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function sessionSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Private mode or blocked storage: skip.
  }
}

export function GaEvents() {
  const path = usePathname();

  // Listeners and timers against the browser (an external system), reset per
  // page, so an effect keyed on the path is the right tool.
  useEffect(() => {
    const essay = /^\/blog\/(?!category\/)[^/]+$/.exec(path);
    const postSlug = essay ? path.slice("/blog/".length) : "";
    const prefix = essay ? "article" : "page";

    const hit = new Set<number>();
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      for (const m of [25, 50, 75, 90]) {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          fire(`${prefix}_${m}_scroll`, { page_path: path, post_slug: postSlug });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const engaged = setTimeout(() => fire("engaged_45_seconds", { page_path: path }), 45_000);

    const prevPath = sessionGet("tg_prev_path");
    if (prevPath && prevPath !== path) fire("second_page_view", { from_path: prevPath, to_path: path });
    sessionSet("tg_prev_path", path);

    let onClick: ((e: MouseEvent) => void) | undefined;
    if (path === "/") {
      onClick = (e) => {
        const link = (e.target as HTMLElement | null)?.closest("a[href]");
        const href = link?.getAttribute("href") ?? "";
        if (!href) return;
        if (/\/(amplifier|diamond-cut|engage)/.test(href)) fire("homepage_path_work", { destination: href });
        else if (/\/(blog|articles|essays)/.test(href)) fire("homepage_path_thinking", { destination: href });
        else if (/\/(ecosystem|invest|projects)/.test(href)) fire("homepage_path_building", { destination: href });
        else if (href.includes("/start-here")) fire("start_here_open", { destination: href });
      };
      document.addEventListener("click", onClick);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(engaged);
      if (onClick) document.removeEventListener("click", onClick);
    };
  }, [path]);

  return null;
}
