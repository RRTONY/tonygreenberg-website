"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { sk } from "@/lib/content/sake/nav";

// The Sake app's ContentProtection (client/src/components/ContentProtection.tsx).
// Kept as the app had it: right-click blocked on pictures and protected content ([data-protected],
// .exv-chart, .soul-print), image dragging blocked, Ctrl+U / Ctrl+S / F12 blocked, and copied text
// carries the app's credit line (a copy over 500 characters is cut to 200 plus the full notice).
// Changed (rule 20 and clean-up): copying inside a form field is left alone so people can paste
// their own notes and reviews; the app's hidden "/trap/scraper-detected" link (a page that never
// existed) and its developer-tools console warnings are not carried over. Listeners only live while
// a /sake page is open.

const LONG_COPY = 500;
const NOTICE =
  "\n\n© 2026 Sake for Sake's Sake™. All rights reserved.\nEXV™ is a proprietary scoring system. Unauthorized reproduction prohibited.\nSource: tonygreenberg.com/sake\n\n";
const CREDIT = "\n— Sake for Sake's Sake™";

function inFormField(el: EventTarget | null) {
  const node = el instanceof HTMLElement ? el : null;
  return Boolean(node?.closest("input, textarea, select, [contenteditable='true']"));
}

export function ContentProtection() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" || target.closest("[data-protected], .exv-chart, .soul-print")) e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement)?.tagName === "IMG") e.preventDefault();
    };
    const onCopy = (e: ClipboardEvent) => {
      if (inFormField(e.target) || inFormField(document.activeElement)) return;
      const selected = window.getSelection()?.toString() ?? "";
      if (!selected || !e.clipboardData) return;
      e.preventDefault();
      e.clipboardData.setData(
        "text/plain",
        selected.length > LONG_COPY ? `${selected.substring(0, 200)}...${NOTICE}` : `${selected}${CREDIT}`,
      );
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (e.key === "F12" || (e.ctrlKey && (key === "u" || key === "s"))) e.preventDefault();
    };
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("copy", onCopy);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  return null;
}

/** The app's <Watermark>: faint diagonal stripes over protected content. */
export function Watermark({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className ? `relative ${className}` : "relative"} data-protected="true">
      {children}
      <div aria-hidden="true" className="sk-watermark pointer-events-none absolute inset-0 z-10 select-none" />
    </div>
  );
}

/** The app's footer notice (ContentProtection.tsx CopyrightNotice). Server-rendered; colors follow the look. */
export function CopyrightNotice() {
  return (
    <div className="text-center space-y-3 py-8" data-protected="true">
      <div className="flex items-center justify-center gap-2">
        <span className="text-[1.2rem] text-(--sk-accent)">酒</span>
        <span className="text-xs tracking-[0.2em] uppercase font-semibold text-(--sk-accent)">
          Sake for Sake&apos;s Sake™
        </span>
      </div>

      <p className="text-[10px] tracking-wider text-(--sk-fg-dim)">© 2026 Sake for Sake&apos;s Sake™. All rights reserved.</p>

      <p className="text-[9px] tracking-wider max-w-lg mx-auto leading-relaxed text-(--sk-fg-dim)">
        The EXV™ (Experience Value) scoring system, all original content, photography, and design elements are
        proprietary intellectual property. Unauthorized reproduction, scraping, or competitive analysis is strictly
        prohibited. Protected under international copyright and trademark law.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-x-4 text-[9px] tracking-wider text-(--sk-fg-dim)">
        <Link href={sk("/terms")} className="hover:underline transition-colors">
          Terms of Use
        </Link>
        <span aria-hidden="true">·</span>
        <Link href={sk("/privacy")} className="hover:underline transition-colors">
          Privacy
        </Link>
        <span aria-hidden="true">·</span>
        <Link href={sk("/dmca")} className="hover:underline transition-colors">
          DMCA
        </Link>
        <span aria-hidden="true">·</span>
        <Link href={sk("/producers")} className="hover:underline transition-colors">
          For Producers
        </Link>
      </div>
    </div>
  );
}
