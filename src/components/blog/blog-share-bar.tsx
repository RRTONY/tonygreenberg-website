"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Mail, Sparkles } from "lucide-react";
import { FacebookIcon, LinkedinIcon, XIcon } from "@/components/icons/brand-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SITE_URL = "https://tonygreenberg.com";

// "?q=" prefill is the de-facto convention several AI chat products settled
// on for "open with this question already typed in" links — same idea as a
// mailto: body, just aimed at a chat composer instead of an email client.
// Each product still opens fine without ever reading the query if a given
// tool drops support for it; only the prefill is lost, not the link.
const AI_TOOLS = [
  { label: "ChatGPT", buildHref: (prompt: string) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}` },
  { label: "Claude", buildHref: (prompt: string) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}` },
  { label: "Gemini", buildHref: (prompt: string) => `https://gemini.google.com/app?q=${encodeURIComponent(prompt)}` },
  { label: "Perplexity", buildHref: (prompt: string) => `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}` },
];

const emptySubscribe = () => () => {};

// window.location.origin is browser-only state — reading it directly at
// render time (as legacy's `typeof window !== "undefined"` checks did)
// renders the SSR fallback and the real origin in the same pass, which
// React flags as a hydration mismatch. useSyncExternalStore is the
// documented fix: the server snapshot always wins on the hydrating pass,
// then the real value takes over right after.
function useOrigin() {
  return useSyncExternalStore(emptySubscribe, () => window.location.origin, () => SITE_URL);
}

const PILL_CLASS =
  "flex min-h-11 items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-medium no-underline transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md";
const OUTLINE_CLASS = `${PILL_CLASS} border border-brand-gold/25 text-brand-gold hover:bg-brand-gold/6`;

export function BlogShareBar({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();

  const url = `${origin}${path}`;
  const aiPrompt = `Please read and summarize this article for me: ${url}`;

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
          <XIcon className="size-3.5" /> Share on X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${PILL_CLASS} bg-[#0A66C2] text-white hover:bg-[#004182]`}
        >
          <LinkedinIcon className="size-3.5" /> Share on LinkedIn
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={OUTLINE_CLASS}
        >
          <FacebookIcon className="size-3.5" /> Facebook
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`}
          className={OUTLINE_CLASS}
        >
          <Mail className="size-3.5" /> Email
        </a>
        <button type="button" onClick={copyLink} className={OUTLINE_CLASS}>
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

        <DropdownMenu>
          <DropdownMenuTrigger className={OUTLINE_CLASS}>
            <Sparkles className="size-3.5" /> Ask AI
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {AI_TOOLS.map((tool) => (
              <DropdownMenuItem key={tool.label} asChild>
                <a href={tool.buildHref(aiPrompt)} target="_blank" rel="noopener noreferrer">
                  Summarize with {tool.label}
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
