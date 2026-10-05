"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

// "Share the question" rail on /america-unbundled. Ported from the live
// page's inline script: X and LinkedIn are plain links (in the server HTML),
// "Copy link" copies the article URL, and "Share" opens the device share sheet
// where the browser supports it.
const ARTICLE_URL = "https://tonygreenberg.com/america-unbundled";
const SHARE_TITLE = "AI Does Not Have a Candidate: Politics for the AI Age";
const SHARE_TEXT = "Why America needs an independent civic grid to govern AI, energy, and political power.";

const itemClass =
  "inline-flex min-h-11 items-center gap-1.5 border-b border-foreground/60 text-xs font-bold tracking-[0.08em] uppercase hover:text-[#5b3ca8] sm:min-h-0 dark:hover:text-[#b3a1ec]";

export function ShareRail() {
  const [copyLabel, setCopyLabel] = useState("Copy link");
  const [shareLabel, setShareLabel] = useState("Share");

  async function copy() {
    try {
      await navigator.clipboard.writeText(ARTICLE_URL);
      setCopyLabel("Copied");
    } catch {
      setCopyLabel("Copy unavailable");
    }
  }

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: ARTICLE_URL });
      } catch {
        // Share sheet dismissed: nothing to do.
      }
    } else {
      setShareLabel("Use Copy link");
    }
  }

  return (
    <div
      aria-label="Share this article"
      className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border pb-4"
    >
      <span className="text-xs font-bold tracking-[0.14em] text-brand-gold uppercase">Share the question</span>
      <a
        href="https://twitter.com/intent/tweet?text=AI%20Does%20Not%20Have%20a%20Candidate&url=https%3A%2F%2Ftonygreenberg.com%2Famerica-unbundled"
        target="_blank"
        rel="noopener"
        className={itemClass}
      >
        X <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </a>
      <a
        href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Ftonygreenberg.com%2Famerica-unbundled"
        target="_blank"
        rel="noopener"
        className={itemClass}
      >
        LinkedIn <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </a>
      <button type="button" onClick={copy} className={itemClass} aria-live="polite">
        {copyLabel}
      </button>
      <button type="button" onClick={share} className={itemClass}>
        {shareLabel}
        {shareLabel === "Share" && <ArrowUpRight aria-hidden="true" className="size-3.5" />}
      </button>
    </div>
  );
}
