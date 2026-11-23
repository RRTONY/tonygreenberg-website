"use client";

import { useEffect } from "react";

// The Aqueous app's ContentProtection (client/src/components/ContentProtection.tsx), the softened
// version it shipped: desktop right-click blocked except on inputs and sharing elements
// ([data-shareable], .share-zone, .referral-zone), source-view/save shortcuts (F12, Ctrl+U, Ctrl+S,
// Ctrl+Shift+I/J) blocked, image dragging blocked. Print is blocked in aqueous.css. Text selection
// and copying stay allowed, as on the app. Listeners only live while an /aqueous page is open.

function isInteractiveElement(el: HTMLElement | null): boolean {
  while (el) {
    const tag = el.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable) return true;
    if (el.hasAttribute?.("data-shareable")) return true;
    const cls = typeof el.className === "string" ? el.className : "";
    if (cls.includes("share-zone") || cls.includes("referral-zone")) return true;
    el = el.parentElement;
  }
  return false;
}

export function ContentProtection() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      // Touch devices need long-press for the native share sheet.
      if ("ontouchstart" in window) return;
      if (isInteractiveElement(e.target as HTMLElement)) return;
      e.preventDefault();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        e.key === "F12" ||
        (e.ctrlKey && !e.shiftKey && (key === "u" || key === "s")) ||
        (e.ctrlKey && e.shiftKey && (key === "i" || key === "j"))
      ) {
        e.preventDefault();
      }
    };
    const onDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement)?.tagName?.toLowerCase() === "img") e.preventDefault();
    };
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("dragstart", onDragStart);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);
  return null;
}
