"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { SITE_URL } from "@/components/ai-summary-links";
import { FacebookIcon, LinkedinIcon, XIcon } from "@/components/icons/brand-icons";

// Icon-only square buttons (44px tap target); each keeps its full name as
// aria-label and a hover tooltip.
const PILL_CLASS =
  "flex size-11 items-center justify-center rounded-md no-underline transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md";
const OUTLINE_CLASS = `${PILL_CLASS} border border-brand-gold/25 text-brand-gold hover:bg-brand-gold/6`;

export function BlogShareBar({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
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
          aria-label="Share on X"
          title="Share on X"
          className={`${PILL_CLASS} bg-black text-white hover:bg-neutral-800`}
        >
          <XIcon className="size-4" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
          className={`${PILL_CLASS} bg-[#0A66C2] text-white hover:bg-[#004182]`}
        >
          <LinkedinIcon className="size-4" />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          title="Share on Facebook"
          className={OUTLINE_CLASS}
        >
          <FacebookIcon className="size-4" />
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`}
          aria-label="Share by email"
          title="Share by email"
          className={OUTLINE_CLASS}
        >
          <Mail className="size-4" />
        </a>
        <button
          type="button"
          onClick={copyLink}
          aria-label={copied ? "Link copied" : "Copy link"}
          title={copied ? "Link copied" : "Copy link"}
          className={OUTLINE_CLASS}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? "Link copied" : ""}
        </span>
      </div>
    </div>
  );
}
