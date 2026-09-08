"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { FacebookIcon, LinkedinIcon, XIcon } from "@/components/icons/brand-icons";

// Ported from legacy's `PriShareBar` — real social/copy/email share intents,
// unchanged. Legacy's share URL pointed at the stale `onlytimebuystrust.com`
// domain — corrected to this site's real canonical domain (see
// `src/lib/structured-data.ts`'s `siteUrl`).
const SHARE_URL = "https://tonygreenberg.com/psychedelic-readiness-index";
const SHARE_TEXT = "The Psychedelic Readiness Index ... find your medicine match. 39 substances, 6 domains, hard-stop screening, medication interaction matrix.";

const BTN_CLASS =
  "flex items-center gap-1.5 rounded-lg border border-pri-purple-light/30 bg-pri-purple/12 px-4 py-2 text-[.82rem] text-pri-cream no-underline transition-colors hover:bg-pri-purple/20";

export function PriShareBar() {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(SHARE_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="text-center">
      <div className="mb-3 text-xs font-bold tracking-[0.12em] text-pri-purple-light uppercase">Share This Instrument</div>
      <div className="flex flex-wrap justify-center gap-3">
        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`} target="_blank" rel="noopener noreferrer" className={BTN_CLASS}>
          <XIcon className="size-3.5" /> X / Twitter
        </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`} target="_blank" rel="noopener noreferrer" className={BTN_CLASS}>
          <LinkedinIcon className="size-3.5" /> LinkedIn
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`} target="_blank" rel="noopener noreferrer" className={BTN_CLASS}>
          <FacebookIcon className="size-3.5" /> Facebook
        </a>
        <a href={`mailto:?subject=${encodeURIComponent("The Psychedelic Readiness Index")}&body=${encodeURIComponent(SHARE_TEXT + "\n\n" + SHARE_URL)}`} className={BTN_CLASS}>
          <Mail className="size-3.5" /> Send by Email
        </a>
        <button onClick={copyLink} className={BTN_CLASS}>
          {copied ? (
            <>
              <Check className="size-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
