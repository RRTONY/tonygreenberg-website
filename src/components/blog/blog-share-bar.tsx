"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Mail, Share2, Smartphone } from "lucide-react";
import { SITE_URL } from "@/components/ai-summary-links";
import { LinkedinIcon, XIcon } from "@/components/icons/brand-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// One compact "Share" button that opens a menu: X, LinkedIn, email, copy
// link, and the device's share sheet where there is one. Replaced the row of
// six 44px squares (legacy BlogPost.tsx ShareBar, icon-only since 2026-10-07)
// so the essay starts sooner on a phone (2026-11-03).
const ITEM_CLASS =
  "flex min-h-11 w-full items-center gap-3 rounded-xs px-3 text-left text-sm text-foreground no-underline transition-colors hover:bg-brand-gold/6 focus-visible:bg-brand-gold/6 focus-visible:outline-hidden";

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
    <div className="flex items-center gap-3 py-3">
      <Popover>
        <PopoverTrigger
          aria-label="Share this essay"
          className="inline-flex h-11 items-center gap-2 rounded-xs border border-brand-gold/25 px-4 font-mono text-xs tracking-[0.12em] text-brand-gold uppercase transition-colors hover:bg-brand-gold/6 data-[state=open]:bg-brand-gold/6"
        >
          <Share2 aria-hidden="true" className="size-4" />
          Share
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 gap-0.5 p-1.5">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={ITEM_CLASS}
          >
            <XIcon aria-hidden="true" className="size-4" />
            Share on X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={ITEM_CLASS}
          >
            <LinkedinIcon aria-hidden="true" className="size-4 text-[#0A66C2]" />
            Share on LinkedIn
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`}
            className={ITEM_CLASS}
          >
            <Mail aria-hidden="true" className="size-4 text-brand-gold" />
            Share by email
          </a>
          <button type="button" onClick={copyLink} className={ITEM_CLASS}>
            {copied ? (
              <Check aria-hidden="true" className="size-4 text-brand-gold" />
            ) : (
              <Copy aria-hidden="true" className="size-4 text-brand-gold" />
            )}
            {copied ? "Link copied" : "Copy link"}
          </button>
          {canShare && (
            <button
              type="button"
              onClick={() => navigator.share({ title, url }).catch(() => {})}
              className={ITEM_CLASS}
            >
              <Smartphone aria-hidden="true" className="size-4 text-brand-gold" />
              More ways to share
            </button>
          )}
          <span className="sr-only" aria-live="polite">
            {copied ? "Link copied" : ""}
          </span>
        </PopoverContent>
      </Popover>
      <div className="h-px flex-1 bg-brand-gold/12" />
    </div>
  );
}
