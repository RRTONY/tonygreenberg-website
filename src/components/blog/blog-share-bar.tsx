"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Mail, Share2 } from "lucide-react";
import { SITE_URL } from "@/components/ai-summary-links";
import { FacebookIcon, LinkedinIcon, XIcon } from "@/components/icons/brand-icons";

// Live's labelled share buttons (legacy BlogPost.tsx ShareBar): X, LinkedIn,
// Facebook, More (the device's share sheet, where there is one), Email, Copy
// link. 44px tall tap targets.
const PILL_CLASS =
  "inline-flex min-h-11 items-center gap-2 rounded-xs px-3.5 font-mono text-xs no-underline transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md";
const OUTLINE_CLASS = `${PILL_CLASS} border border-brand-gold/25 text-brand-gold hover:bg-brand-gold/6`;

export function BlogShareBar({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
  // The share sheet exists only in some browsers; known after hydration.
  const canShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator.share === "function",
    () => false,
  );
  // Always the production URL: share targets and AI tools need a public
  // address, not localhost or a deploy preview.
  const url = `${SITE_URL}${path}`;

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="py-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase">Share this essay</span>
        <div className="h-px flex-1 bg-brand-gold/12" />
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"

          className={`${PILL_CLASS} bg-black text-white hover:bg-neutral-800`}
        >
          <XIcon aria-hidden="true" className="size-3.5" />
          Share on X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"

          className={`${PILL_CLASS} bg-[#0A66C2] text-white hover:bg-[#004182]`}
        >
          <LinkedinIcon aria-hidden="true" className="size-3.5" />
          Share on LinkedIn
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${PILL_CLASS} bg-[#1877F2] text-white hover:bg-[#0f5fc9]`}
        >
          <FacebookIcon aria-hidden="true" className="size-3.5" />
          Share on Facebook
        </a>
        {canShare && (
          <button
            type="button"
            onClick={() => navigator.share({ title, url }).catch(() => {})}
            className={OUTLINE_CLASS}
          >
            <Share2 aria-hidden="true" className="size-3.5" />
            More
          </button>
        )}
        <a
          href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`}
          className={OUTLINE_CLASS}
        >
          <Mail aria-hidden="true" className="size-3.5" />
          Email
        </a>
        <button
          type="button"
          onClick={copyLink}
          className={OUTLINE_CLASS}
        >
          {copied ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />}
          {copied ? "Copied" : "Copy link"}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? "Link copied" : ""}
        </span>
      </div>
    </div>
  );
}
