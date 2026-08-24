/**
 * ContentProtection — Prevents content theft while preserving share functionality.
 * 
 * Blocks: right-click, text selection, copy/paste, view-source shortcuts, drag
 * Preserves: share buttons, form inputs, highlight-save feature for logged-in users
 * 
 * EXEMPTIONS: Certain posts are marked as "open access" and bypass all protections.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

/** Slugs that are fully open — anyone can copy, select, print, share, use freely */
const OPEN_ACCESS_SLUGS = [
  "is-that-a-lot-clarisse-abelarde",
];

function isOpenAccessPage(pathname: string): boolean {
  return OPEN_ACCESS_SLUGS.some(slug => pathname.includes(`/blog/${slug}`));
}

export function ContentProtection() {
  const [location] = useLocation();

  useEffect(() => {
    // If we're on an open-access page, don't attach any protection handlers
    if (isOpenAccessPage(location)) {
      // Add open-access class for CSS-level exemptions (selection + print)
      document.body.classList.add("open-access");
      return () => {
        document.body.classList.remove("open-access");
      };
    }

    // Ensure open-access class is removed on protected pages
    document.body.classList.remove("open-access");

    // ── Disable right-click context menu ──
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      e.preventDefault();
    };

    // ── Disable copy (Ctrl+C / Cmd+C) except in inputs ──
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      e.preventDefault();
    };

    // ── Block keyboard shortcuts for view-source and dev tools ──
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "u") { e.preventDefault(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === "a") { e.preventDefault(); return; }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) { e.preventDefault(); return; }
      if (e.key === "F12") { e.preventDefault(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") { e.preventDefault(); return; }
    };

    // ── Disable drag (prevents dragging images/text) ──
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // ── Disable text selection via selectstart ──
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      if (target.closest("[data-allow-select]")) return;
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, [location]);

  return null;
}
