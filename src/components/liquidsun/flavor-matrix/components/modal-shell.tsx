"use client";

import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { usePresenceSwap } from "@/components/liquidsun/motion";

// The Flavor Matrix modals' shared frame. In the app each was framer-motion: the backdrop faded
// (opacity 0 -> 1) and the panel rose and grew (scale 0.9 -> 1, y 20 -> 0), both reversed on close
// (AnimatePresence). Here: tw-animate enter/exit classes, and the panel stays mounted for the
// 300ms exit before it goes. Added (rule 20): role="dialog", Escape closes, the close button is labelled.

const EXIT_MS = 300;

/** The value to render: the live one, or the previous one while the exit animation plays. */
export function usePresence<T>(value: T | null) {
  const { shown } = usePresenceSwap(value, EXIT_MS);
  const item = value ?? shown;
  return { item, open: value !== null };
}

export function ModalShell({
  open,
  onClose,
  panelClassName,
  closingPanelClassName,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** Full literal class list for the panel while open (with its enter animation). */
  panelClassName: string;
  /** Full literal class list for the panel while closing (with its exit animation). */
  closingPanelClassName: string;
  title: string;
  children: (titleId: string) => ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={
        open
          ? "fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-300 fade-in"
          : "pointer-events-none fixed inset-0 z-50 flex animate-out items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-300 fade-out fill-mode-forwards"
      }
    >
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className={open ? panelClassName : closingPanelClassName}>
        <button type="button" onClick={onClose} aria-label={`Close ${title}`} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X aria-hidden="true" className="size-5" />
        </button>
        {children(titleId)}
      </div>
    </div>
  );
}
