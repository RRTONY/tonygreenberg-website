"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/sanity/essay-body";

// Legacy BlogPost.tsx ArticleTOC: the sticky parchment "Contents" card beside
// the essay on wide screens (1280px+, as on live), listing its section titles.
// The section being read is highlighted as you scroll. Clicking one scrolls to it smoothly
// (scroll-mt on the headings keeps it clear of the header). Needs 3+ titles.
export function ArticleToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length < 3) return;
    const targets = headings.map(({ id }) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    // The active section is the last title that has passed the reading line
    // (140px from the top). An IntersectionObserver (the css-tricks
    // "sticky table of contents" pattern) tells us when a title crosses that
    // band; the positions are then re-read, so a fast scroll that skips past
    // several titles still lands on the right one.
    const update = () => {
      let current = "";
      for (const el of targets) if (el.getBoundingClientRect().top <= 140) current = el.id;
      setActiveId(current);
    };
    const observer = new IntersectionObserver(update, { rootMargin: "-140px 0px -55% 0px", threshold: [0, 1] });
    targets.forEach((el) => observer.observe(el));
    // A jump (Home/End, a long fling) can carry a title clean over the band
    // between two frames without an observer callback: re-check once the
    // scroll settles.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(update, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <aside className="sticky top-24 mt-10 hidden w-55 shrink-0 self-start xl:block">
      <nav
        aria-label="Contents"
        className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-sm border border-essay-brown/18 bg-essay-parchment px-4 pt-5 pb-6 shadow-[0_2px_16px_rgba(44,24,16,0.06)]"
      >
        <p className="mb-3.5 border-b border-essay-brown/20 pb-2.5 text-center font-fell text-[0.8rem] tracking-[0.06em] text-essay-brown italic">
          Contents
        </p>
        <ul className="flex flex-col gap-0.5">
          {headings.map(({ id, text, level }) => {
            const active = activeId === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active ? "location" : undefined}
                  onClick={(e) => {
                    const el = document.getElementById(id);
                    if (!el) return;
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.replaceState(null, "", `#${id}`);
                  }}
                  className={
                    level === 2
                      ? active
                        ? "block rounded-r-sm border-l-2 border-essay-brown bg-essay-brown/8 py-1.5 pr-2 pl-3 font-fell text-[0.88rem] leading-snug text-essay-ink italic no-underline transition-colors"
                        : "block rounded-r-sm border-l-2 border-transparent py-1.5 pr-2 pl-3 font-fell text-[0.88rem] leading-snug text-essay-sepia italic no-underline transition-colors hover:text-essay-ink"
                      : active
                        ? "block rounded-r-sm border-l-2 border-essay-brown bg-essay-brown/8 py-1 pr-2 pl-5 font-mono text-[0.68rem] leading-snug tracking-[0.06em] text-essay-ink uppercase no-underline transition-colors"
                        : "block rounded-r-sm border-l-2 border-transparent py-1 pr-2 pl-5 font-mono text-[0.68rem] leading-snug tracking-[0.06em] text-essay-sepia uppercase no-underline transition-colors hover:text-essay-ink"
                  }
                >
                  {text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
