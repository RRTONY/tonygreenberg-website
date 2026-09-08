"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, FileText, Loader2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { SEARCH_DIRECTORY } from "@/lib/content/search-directory";
import { searchPages, type PageItem } from "@/lib/search-engine";

// Command-palette search overlay — ported behavior from the legacy
// Vite/Express app's `SearchPalette.tsx`: instant client-side scoring over
// the static page directory + a debounced server round-trip for blog posts,
// arrow-key navigation, Enter to open the highlighted result, Escape/
// backdrop close (both free from Radix's `Dialog`, no manual handling
// needed here — unlike legacy's hand-rolled overlay). Built on this repo's
// existing shadcn `Dialog` primitive rather than a new command-palette
// library: this repo has no `cmdk`, and legacy's version leaned on
// `framer-motion` for its open/close animation, which this repo also
// deliberately doesn't carry — Radix's own `data-open`/`data-closed`
// animate-in/out classes (already wired into `dialog.tsx`) cover that.

type PostHit = {
  title: string;
  href: string;
  description: string;
  category?: string;
};

type ResultItem =
  | { kind: "page"; item: PageItem }
  | { kind: "post"; item: PostHit };

const DEBOUNCE_MS = 250;

export function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [posts, setPosts] = useState<PostHit[]>([]);
  // The debouncedQuery value `posts` currently corresponds to — compared
  // against the live `debouncedQuery` to derive a loading flag without ever
  // calling setState synchronously in the fetch effect's body itself (see
  // that effect's comment).
  const [fetchedQuery, setFetchedQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Cmd/Ctrl+K shortcut — mounted once at the header's top level
  // regardless of whether the dialog is currently open, cleaned up on
  // unmount (this component only ever unmounts on a full page teardown,
  // since `SiteHeader` renders it site-wide).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenChange]);

  // Reset transient state each time the modal opens/closes. Adjusted during
  // render (React's documented pattern for "reset state when a prop
  // changes", same idiom `site-header.tsx` already uses for its mobile-menu
  // close-on-route-change) rather than in an effect — an effect that
  // unconditionally calls setState on mount/dependency-change is exactly
  // the `react-hooks/set-state-in-effect` pattern this repo's lint config
  // flags (see CONTRIBUTING.md).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setDebouncedQuery("");
      setPosts([]);
      setSelectedIndex(0);
    }
  }

  // Focusing a DOM node is a real external-system side effect, unlike the
  // state resets above — this one legitimately belongs in an effect.
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  // Debounce the query before firing the blog-post search request. No
  // synchronous setState on the early-return path — an empty/short query
  // simply leaves `debouncedQuery` stale, which is harmless since `results`
  // below only shows posts once `query` itself is non-empty.
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const timer = window.setTimeout(() => setDebouncedQuery(trimmed), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  // Server-side blog post search (see src/app/api/search/route.ts) — only
  // blog posts need a network round trip; the static page directory below
  // is scored entirely client-side and instantly. Every setState call here
  // lives inside a promise callback (`.then`/`.catch`), never synchronously
  // in the effect body — the documented exception to
  // `react-hooks/set-state-in-effect` ("calling setState in a callback
  // function when external state changes"). A superseded/aborted request's
  // catch branch deliberately does NOT set `fetchedQuery`, since the effect
  // instance for the newer `debouncedQuery` will do that itself once it
  // resolves.
  useEffect(() => {
    if (debouncedQuery.length < 2) return;
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: { posts?: PostHit[] }) => {
        setPosts(data.posts ?? []);
        setFetchedQuery(debouncedQuery);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("[search-modal] blog search failed:", err);
          setFetchedQuery(debouncedQuery);
        }
      });
    return () => controller.abort();
  }, [debouncedQuery]);

  // Only show blog results once the debounce has actually settled on a
  // searchable (2+ char) query — guards against rendering posts fetched for
  // a previous, longer query while `posts` state hasn't been touched yet.
  const showPosts = debouncedQuery.length >= 2;
  const isPostsLoading = showPosts && fetchedQuery !== debouncedQuery;
  const visiblePosts = useMemo(
    () => (showPosts && !isPostsLoading ? posts : []),
    [showPosts, isPostsLoading, posts],
  );

  const pages = useMemo(() => {
    if (!query.trim()) return SEARCH_DIRECTORY.slice(0, 6);
    return searchPages(query, SEARCH_DIRECTORY, 6);
  }, [query]);

  const results: ResultItem[] = useMemo(
    () => [
      ...pages.map((item): ResultItem => ({ kind: "page", item })),
      ...(query.trim() ? visiblePosts.map((item): ResultItem => ({ kind: "post", item })) : []),
    ],
    [pages, visiblePosts, query],
  );

  // Reset the highlighted result whenever the query or result set changes.
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSelectedIndex(0);
  }

  const goTo = useCallback(
    (item: PageItem | PostHit) => {
      onOpenChange(false);
      const external = "external" in item && item.external;
      if (external || item.href.startsWith("http")) {
        window.open(item.href, "_blank", "noopener");
      } else {
        router.push(item.href);
      }
    },
    [onOpenChange, router],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        goTo(selected.item);
      } else if (query.trim()) {
        onOpenChange(false);
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
    // Escape is intentionally left unhandled here — Radix's Dialog already
    // closes on Escape from anywhere in the dialog, no manual wiring needed.
  };

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  let itemIndex = -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-24 max-w-[calc(100%-2rem)] translate-y-0 gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-xl">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search pages, essays, and content across the site.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b border-border px-4 py-3 pr-11">
          <Search className="size-4 shrink-0 text-brand-gold" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search everything — pages, essays, content..."
            className="flex-1 border-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
          {isPostsLoading && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />}
        </div>

        <div ref={listRef} className="max-h-[min(60vh,480px)] overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-5 py-10 text-center">
              {isPostsLoading ? (
                <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className="text-sm text-foreground">
                    {query.trim() ? `No results for "${query.trim()}"` : "Start typing to search"}
                  </p>
                  {query.trim() && (
                    <button
                      onClick={() => {
                        onOpenChange(false);
                        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                      }}
                      className="mt-4 inline-flex items-center rounded-lg bg-foreground px-4 py-2 font-mono text-xs tracking-wide text-background uppercase transition-colors hover:bg-foreground/85"
                    >
                      Search all essays
                    </button>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              {pages.length > 0 && (
                <>
                  <div className="px-5 pt-2 pb-1 font-mono text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
                    {query.trim() ? "Pages" : "Featured"}
                  </div>
                  {pages.map((page) => {
                    itemIndex++;
                    const idx = itemIndex;
                    return (
                      <button
                        key={page.href}
                        data-index={idx}
                        onClick={() => goTo(page)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                          selectedIndex === idx ? "bg-brand-gold/10" : "bg-transparent"
                        }`}
                      >
                        <Compass className="size-4 shrink-0 text-brand-gold" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">
                            {page.title}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {page.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </>
              )}

              {query.trim() && visiblePosts.length > 0 && (
                <>
                  <div className="border-t border-border px-5 pt-3 pb-1 font-mono text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
                    Essays
                  </div>
                  {visiblePosts.map((post) => {
                    itemIndex++;
                    const idx = itemIndex;
                    return (
                      <button
                        key={post.href}
                        data-index={idx}
                        onClick={() => goTo(post)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                          selectedIndex === idx ? "bg-brand-gold/10" : "bg-transparent"
                        }`}
                      >
                        <FileText className="size-4 shrink-0 text-brand-gold" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">
                            {post.title}
                          </span>
                          <span className="flex items-center gap-2">
                            {post.category && (
                              <span className="shrink-0 rounded bg-brand-gold/10 px-1.5 py-0.5 font-mono text-[0.6rem] tracking-wide text-brand-gold uppercase">
                                {post.category}
                              </span>
                            )}
                            <span className="truncate text-xs text-muted-foreground">
                              {post.description}
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-5 py-2.5">
          <div className="flex gap-3 font-mono text-[0.65rem] text-muted-foreground">
            <span>
              <kbd className="mr-1 rounded border border-border px-1">↑↓</kbd>navigate
            </span>
            <span>
              <kbd className="mr-1 rounded border border-border px-1">↵</kbd>open
            </span>
          </div>
          <span className="font-mono text-[0.65rem] text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
