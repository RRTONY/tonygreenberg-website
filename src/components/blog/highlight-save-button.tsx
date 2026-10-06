"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Highlighter, Loader2 } from "lucide-react";
import { saveHighlight } from "@/app/my-highlights/actions";

// Select 10-2,000 characters of an essay and a "Save Highlight" button
// appears above the selection; saved passages show on /my-highlights.
// Ported from legacy EngagementFeatures.tsx's HighlightSaveButton. Shown to
// every reader (no login code is loaded on essay pages); a signed-out reader
// who clicks it gets a sign-in link instead.
type Selected = { text: string; context: string; x: number; y: number };

export function HighlightSaveButton({ postSlug }: { postSlug: string }) {
  const [selected, setSelected] = useState<Selected | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "login" | "error">("idle");

  const onSelectionEnd = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim() ?? "";
    if (!sel || sel.isCollapsed || text.length < 10 || text.length > 2000) {
      setSelected(null);
      return;
    }
    const range = sel.getRangeAt(0);
    // Only selections inside the essay body count.
    const body = (range.commonAncestorContainer instanceof Element ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement)?.closest(".article-body");
    if (!body) return setSelected(null);
    const rect = range.getBoundingClientRect();
    const paragraph = (range.startContainer.parentElement?.closest("p, li, blockquote")?.textContent ?? "").trim();
    setSelected({ text, context: paragraph, x: rect.left + rect.width / 2, y: rect.top });
    setStatus("idle");
  }, []);

  useEffect(() => {
    // The button sits at the selection's on-screen spot, so hide it on scroll.
    const hide = () => setSelected(null);
    document.addEventListener("mouseup", onSelectionEnd);
    document.addEventListener("touchend", onSelectionEnd);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("mouseup", onSelectionEnd);
      document.removeEventListener("touchend", onSelectionEnd);
      window.removeEventListener("scroll", hide);
    };
  }, [onSelectionEnd]);

  if (!selected) return null;

  const save = async () => {
    setStatus("saving");
    const res = await saveHighlight({ postSlug, text: selected.text, context: selected.context });
    setStatus(res.ok ? "saved" : res.needsLogin ? "login" : "error");
  };

  const base =
    "fixed z-50 inline-flex -translate-x-1/2 -translate-y-full items-center gap-1.5 rounded-lg border border-brand-gold-light bg-[#0A0A10] px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.08em] whitespace-nowrap text-brand-gold-light uppercase shadow-[0_4px_16px_rgba(0,0,0,0.2)]";
  // Position is the selection's, known only at runtime.
  const position = { left: Math.min(Math.max(selected.x, 80), window.innerWidth - 80), top: Math.max(selected.y - 8, 48) };

  if (status === "login") {
    return (
      <Link href={`/login?next=${encodeURIComponent(`/blog/${postSlug}`)}`} className={base} style={position}>
        Sign in to save highlights
      </Link>
    );
  }
  return (
    <button
      type="button"
      // Keep the text selected while pressing the button.
      onMouseDown={(e) => e.preventDefault()}
      onClick={save}
      disabled={status === "saving" || status === "saved"}
      className={base}
      style={position}
    >
      {status === "saving" && <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />}
      {status === "saved" && <Check aria-hidden="true" className="size-3.5" />}
      {status === "idle" && <Highlighter aria-hidden="true" className="size-3.5" />}
      {status === "saved" ? "Saved to your Commonplace Book" : status === "error" ? "Couldn't save. Try again" : "Save Highlight"}
    </button>
  );
}
