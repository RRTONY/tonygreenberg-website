"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ARROW =
  "flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-gold/20 bg-white/70 text-foreground/75 transition-colors hover:border-brand-gold/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-35 dark:bg-card";

/**
 * One row of buttons that scrolls sideways on every screen size (The Index
 * concepts, the Blog categories). Phones swipe; from `sm` up, left/right
 * arrows sit at the end of the row because a mouse can't swipe. The arrows
 * grey out at each end and hide when everything already fits.
 */
export function ScrollRow({
  children,
  label,
  labelledBy,
  className,
}: {
  children: ReactNode;
  /** What the arrows scroll, e.g. "concepts" → "Scroll concepts left". */
  label: string;
  labelledBy?: string;
  className?: string;
}) {
  const row = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const update = () => {
    const el = row.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
  };

  useEffect(() => {
    update();
    const el = row.current;
    if (!el) return;
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = row.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-2">
      <div
        ref={row}
        onScroll={update}
        role="group"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        className={cn(
          "flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        {children}
      </div>
      {!(edges.start && edges.end) && (
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button type="button" onClick={() => scroll(-1)} disabled={edges.start} aria-label={`Scroll ${label} left`} className={ARROW}>
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>
          <button type="button" onClick={() => scroll(1)} disabled={edges.end} aria-label={`Scroll ${label} right`} className={ARROW}>
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
