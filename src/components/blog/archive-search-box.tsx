"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Folder, Loader2, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { SearchPostHit } from "@/app/api/search/route";

// The essay archive's search box (HomeArchive, on "/" and "/blog") with
// search-as-you-type suggestions (owner asked, 2026-10-14). Matching
// categories and topics are suggested instantly from the archive summary;
// essays come from /api/search, which also matches words deep inside an
// essay's text (the grid below only filters on title, excerpt and tags).
// Same debounce + fetchedQuery pattern as search-modal.tsx, so no setState
// runs synchronously inside an effect.
const DEBOUNCE_MS = 250;
const MAX_ESSAYS = 6;
const MAX_LABELS = 3;

type Suggestion =
  | { kind: "essay"; title: string; href: string; detail?: string }
  | { kind: "category" | "topic"; title: string };

export function ArchiveSearchBox({
  value,
  onChange,
  onActivate,
  categories,
  topics,
  onPickCategory,
  onPickTopic,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Called on focus/typing: the archive loads its full list then. */
  onActivate: () => void;
  categories: string[];
  topics: string[];
  onPickCategory: (title: string) => void;
  onPickTopic: (label: string) => void;
}) {
  const router = useRouter();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [debounced, setDebounced] = useState("");
  const [essays, setEssays] = useState<SearchPostHit[]>([]);
  const [fetchedQuery, setFetchedQuery] = useState("");

  const q = value.trim();

  useEffect(() => {
    if (q.length < 2) return;
    const timer = window.setTimeout(() => setDebounced(q), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    if (debounced.length < 2) return;
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: { posts?: SearchPostHit[] }) => {
        setEssays(data.posts ?? []);
        setFetchedQuery(debounced);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== "AbortError") {
          setEssays([]);
          setFetchedQuery(debounced);
        }
      });
    return () => controller.abort();
  }, [debounced]);

  const searchable = q.length >= 2;
  const loadingEssays = searchable && (debounced !== q || fetchedQuery !== q);
  const needle = q.toLowerCase();
  const labels: Suggestion[] = searchable
    ? [
        ...categories.filter((c) => c.toLowerCase().includes(needle)).map((title) => ({ kind: "category" as const, title })),
        ...topics.filter((t) => t.toLowerCase().includes(needle)).map((title) => ({ kind: "topic" as const, title })),
      ].slice(0, MAX_LABELS)
    : [];
  const essayItems: Suggestion[] =
    searchable && !loadingEssays
      ? essays.slice(0, MAX_ESSAYS).map((e) => ({ kind: "essay", title: e.title, href: e.href, detail: e.category }))
      : [];
  const items = [...labels, ...essayItems];
  const showList = open && searchable;

  function choose(item: Suggestion) {
    setOpen(false);
    setActive(-1);
    if (item.kind === "essay") router.push(item.href);
    else if (item.kind === "category") {
      onChange("");
      onPickCategory(item.title);
    } else {
      onChange("");
      onPickTopic(item.title);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    } else if (e.key === "ArrowDown" && items.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp" && items.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? items.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (showList && active >= 0 && items[active]) {
        e.preventDefault();
        choose(items[active]);
      } else setOpen(false);
    }
  }

  const optionId = (i: number) => `${listId}-option-${i}`;

  return (
    <div className="relative min-w-45 flex-1">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="text"
        role="combobox"
        aria-label="Search essays"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
        autoComplete="off"
        placeholder="Search essays..."
        value={value}
        onFocus={() => {
          onActivate();
          setOpen(true);
        }}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          onActivate();
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
        className="h-9 bg-background pl-8"
      />

      {showList && (
        <div
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          className="absolute top-full right-0 left-0 z-50 mt-1 max-h-[min(24rem,60vh)] overflow-y-auto rounded-md border border-border bg-popover py-1 shadow-lg"
        >
          {items.map((item, i) => {
            const Icon = item.kind === "essay" ? FileText : item.kind === "category" ? Folder : Tag;
            return (
              <div
                key={`${item.kind}:${item.title}`}
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                // mousedown, not click: the input's blur would close the list first.
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(item);
                }}
                onMouseEnter={() => setActive(i)}
                className={
                  i === active
                    ? "flex min-h-11 cursor-pointer items-center gap-2.5 bg-accent px-3 py-2 text-left"
                    : "flex min-h-11 cursor-pointer items-center gap-2.5 px-3 py-2 text-left"
                }
              >
                <Icon aria-hidden="true" className="size-4 shrink-0 text-brand-gold dark:text-brand-gold-light" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm text-foreground">{item.title}</span>
                  <span className="block truncate font-mono text-xs text-muted-foreground">
                    {item.kind === "essay" ? (item.detail ?? "Essay") : item.kind === "category" ? "Show this category" : "Show this topic"}
                  </span>
                </span>
              </div>
            );
          })}
          {loadingEssays && (
            <div role="status" className="flex items-center gap-2 px-3 py-2.5 font-mono text-xs text-muted-foreground">
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Searching inside the essays
            </div>
          )}
          {!loadingEssays && items.length === 0 && (
            <div className="px-3 py-2.5 font-mono text-xs text-muted-foreground">No essays mention &ldquo;{q}&rdquo;.</div>
          )}
        </div>
      )}
    </div>
  );
}
