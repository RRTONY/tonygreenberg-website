"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Brain,
  ClipboardList,
  Coffee,
  FileText,
  Globe,
  Heart,
  Link2,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { SEARCH_DIRECTORY } from "@/lib/content/search-directory";
import { searchPages, type PageItem } from "@/lib/search-engine";
import type { SearchPostHit } from "@/app/api/search/route";

// /search, laid out like live (2026-10-06): back arrow, one big box, filter
// chips, "Search Everything" empty state. Live's own results never appear
// (its search backend is gone), so this runs on this site's working search:
// the static page directory is scored in the browser (same as the header's
// search modal), and essays, coffees and charities come from /api/search?all=1.
type Filter = "all" | "essays" | "brewsoul" | "peptides" | "humanos" | "assessments" | "kava" | "pages";

const FILTERS: { key: Filter; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "All", icon: Globe },
  { key: "essays", label: "Essays", icon: BookOpen },
  { key: "brewsoul", label: "BrewSoul", icon: Coffee },
  { key: "peptides", label: "Peptides", icon: Link2 },
  { key: "humanos", label: "Human OS", icon: Brain },
  { key: "assessments", label: "Assessments", icon: ClipboardList },
  { key: "kava", label: "Kava", icon: Heart },
  { key: "pages", label: "Pages", icon: FileText },
];

const GROUP_LABELS: Record<Exclude<Filter, "all">, string> = {
  essays: "Essays",
  brewsoul: "BrewSoul",
  peptides: "Peptides",
  humanos: "Human OS",
  assessments: "Assessments",
  kava: "Kava",
  pages: "Pages",
};

// Which filter a directory page belongs to, by its address.
function groupOf(href: string): Exclude<Filter, "all"> {
  if (href.startsWith("/brewsoul") || href === "/find-your-coffee") return "brewsoul";
  if (/peptide|quiz_25q/.test(href)) return "peptides";
  if (href.startsWith("/humanos")) return "humanos";
  if (href.startsWith("/kava")) return "kava";
  if (/^\/(find-your|find-my|assessments|dharma-finder|grant-study|consciousness-scale|soulscore|self-portrait|life-assessment|the-mirror)/.test(href)) return "assessments";
  return "pages";
}

type Hit = { title: string; href: string; description: string; external?: boolean; group: Exclude<Filter, "all"> };

export function SiteSearch({ initialQuery, emptyStateLine }: { initialQuery: string; emptyStateLine: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<Filter>("all");
  const [remote, setRemote] = useState<{ posts: SearchPostHit[]; coffees: SearchPostHit[]; charities: SearchPostHit[] }>({
    posts: [],
    coffees: [],
    charities: [],
  });
  const [debounced, setDebounced] = useState(initialQuery.trim());

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  // Keep ?q= in the address bar so a search can be shared or reloaded.
  useEffect(() => {
    const url = debounced ? `/search?q=${encodeURIComponent(debounced)}` : "/search";
    window.history.replaceState(null, "", url);
  }, [debounced]);

  useEffect(() => {
    if (debounced.length < 2) return;
    const controller = new AbortController();
    fetch(`/api/search?all=1&q=${encodeURIComponent(debounced)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setRemote({ posts: data.posts ?? [], coffees: data.coffees ?? [], charities: data.charities ?? [] }))
      .catch(() => {});
    return () => controller.abort();
  }, [debounced]);

  const hits = useMemo<Hit[]>(() => {
    if (debounced.length < 2) return [];
    const pages: Hit[] = searchPages(debounced, SEARCH_DIRECTORY, 40).map((p: PageItem) => ({ ...p, group: groupOf(p.href) }));
    return [
      ...remote.posts.map((p) => ({ ...p, group: "essays" as const })),
      ...pages,
      ...remote.coffees.map((p) => ({ ...p, group: "brewsoul" as const })),
      ...remote.charities.map((p) => ({ ...p, group: "pages" as const })),
    ];
  }, [debounced, remote]);

  const visible = filter === "all" ? hits : hits.filter((h) => h.group === filter);
  const groups = (Object.keys(GROUP_LABELS) as Exclude<Filter, "all">[])
    .map((g) => ({ key: g, items: visible.filter((h) => h.group === g) }))
    .filter((g) => g.items.length > 0);
  const searching = debounced.length >= 2;

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <h1 className="sr-only">Search</h1>
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-250 px-4 pt-3 pb-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
              aria-label="Go back"
              className="flex size-11 shrink-0 items-center justify-center text-foreground/70 hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="size-5" />
            </button>
            <label className="relative flex-1">
              <span className="sr-only">Search everything</span>
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search everything..."
                autoFocus
                className="h-11 w-full rounded-lg border border-border bg-[#FBFAF6] pr-10 pl-10 text-sm text-foreground outline-none focus:border-brand-gold-light focus-visible:ring-2 focus-visible:ring-brand-gold-light/40 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              )}
            </label>
          </div>
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filter results">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={
                  filter === f.key
                    ? "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#0A0A10] px-3.5 font-mono text-[0.7rem] tracking-[0.08em] text-white uppercase"
                    : "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#F0EDE6] px-3.5 font-mono text-[0.7rem] tracking-[0.08em] text-[#555] uppercase hover:bg-[#E8E4DB]"
                }
              >
                <f.icon aria-hidden="true" className="size-3.5" />
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-250 px-4 py-10 sm:px-6" aria-live="polite">
        {!searching ? (
          <div className="mx-auto max-w-110 py-12 text-center">
            <Search aria-hidden="true" className="mx-auto mb-4 size-11 text-[#ccc]" strokeWidth={1.75} />
            <h2 className="mb-2 font-heading text-[1.4rem] text-foreground">Search Everything</h2>
            <p className="text-sm/[1.5] text-[#666]">{emptyStateLine}</p>
          </div>
        ) : groups.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#666]">No results for &ldquo;{debounced}&rdquo;.</p>
        ) : (
          <div className="flex flex-col gap-10">
            {groups.map((g) => (
              <section key={g.key}>
                <h2 className="mb-3 font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold uppercase">
                  {GROUP_LABELS[g.key]} <span className="text-[#767676]">({g.items.length})</span>
                </h2>
                <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white">
                  {g.items.map((h) => (
                    <li key={h.href + h.title}>
                      <Link
                        href={h.href}
                        {...(h.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="flex items-start justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-[#FBFAF6]"
                      >
                        <span className="min-w-0">
                          <span className="block font-heading text-base leading-snug text-foreground">{h.title}</span>
                          {h.description && <span className="mt-0.5 line-clamp-2 block text-sm text-[#666]">{h.description}</span>}
                        </span>
                        {h.external && <ArrowUpRight aria-label="Opens another site" className="mt-1 size-4 shrink-0 text-muted-foreground" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
