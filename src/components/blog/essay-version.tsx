"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { Sparkle } from "lucide-react";
import type { TocHeading } from "@/lib/sanity/essay-body";
import { ArticleToc } from "./article-toc";

// Legacy BlogPost.tsx's "Original post / Updated for today" switch. Both
// versions are rendered on the server (the original visible, the updated one
// hidden), so switching needs no request; the Contents sidebar follows the
// version on screen. One shared value per page, as a tiny external store.

type Version = "original" | "updated";
// Keyed by essay, so moving to another essay starts on its original again.
let current: { slug: string; version: Version } = { slug: "", version: "original" };
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
function setVersion(slug: string, version: Version) {
  current = { slug, version };
  listeners.forEach((l) => l());
}
const useVersion = (slug: string) =>
  useSyncExternalStore(
    subscribe,
    () => (current.slug === slug ? current.version : "original"),
    () => "original" as Version,
  );

export function EssayVersionToggle({ slug }: { slug: string }) {
  const version = useVersion(slug);
  const base = "inline-flex min-h-11 items-center gap-1.5 border border-foreground/15 px-5 font-mono text-xs tracking-[0.06em] transition-colors";
  return (
    <div role="group" aria-label="Essay version" className="mb-3 flex flex-wrap">
      <button
        type="button"
        aria-pressed={version === "original"}
        onClick={() => setVersion(slug, "original")}
        className={`${base} rounded-l-[3px] border-r-0 ${version === "original" ? "bg-[#111] font-semibold text-[#F5F0E0]" : "text-muted-foreground hover:text-foreground"}`}
      >
        ORIGINAL POST
      </button>
      <button
        type="button"
        aria-pressed={version === "updated"}
        onClick={() => setVersion(slug, "updated")}
        className={`${base} rounded-r-[3px] ${version === "updated" ? "bg-[#111] font-semibold text-[#F5F0E0]" : "text-muted-foreground hover:text-foreground"}`}
      >
        <Sparkle aria-hidden="true" className="size-3" />
        UPDATED FOR TODAY
      </button>
    </div>
  );
}

// Wraps one version's body; hidden while the other version is showing.
export function EssayVersionPanel({ slug, version, children }: { slug: string; version: Version; children: ReactNode }) {
  const active = useVersion(slug);
  return <div hidden={active !== version}>{children}</div>;
}

export function EssayVersionToc({ slug, original, updated }: { slug: string; original: TocHeading[]; updated: TocHeading[] }) {
  const version = useVersion(slug);
  return <ArticleToc key={version} headings={version === "updated" ? updated : original} />;
}
