"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Diamond, Loader2, Search, X } from "lucide-react";
import {
  INDEX_CONCEPTS,
  conceptsMatching,
  expandIndexQuery,
  indexItemText,
  matchesCharity,
  scoreIndexItem,
  sortIndexByDate,
  type IndexItem,
} from "@/lib/content/the-index";
import { getIndexNextReads, searchIndexBodies, type IndexNextRead } from "@/app/the-index/actions";

const RECENT_COUNT = 18;

// Live's /the-index explorer: search box, concept buttons, then either the
// newest 18 items or the results, each opening a TLDR with three next reads.
// Title/summary/tag matching is instant here; essay body matches arrive from
// the server a moment later (searchIndexBodies) and merge into the same list.
export function TheIndexExplorer({ items, charityCount }: { items: IndexItem[]; charityCount: number }) {
  const [query, setQuery] = useState("");
  const [conceptKey, setConceptKey] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [bodyHits, setBodyHits] = useState<{ query: string; slugs: Set<string> } | null>(null);
  const [nextReads, setNextReads] = useState<{ id: string; reads: IndexNextRead[] } | null>(null);
  const searchSeq = useRef(0);

  const q = query.trim();
  const concept = INDEX_CONCEPTS.find((c) => c.key === conceptKey) ?? null;
  const bodyPending = q !== "" && bodyHits?.query !== q;

  // Debounced full-text request; stale answers are dropped by sequence number.
  useEffect(() => {
    if (!q) return;
    const seq = ++searchSeq.current;
    const timer = setTimeout(async () => {
      const slugs = await searchIndexBodies(q);
      if (seq === searchSeq.current) setBodyHits({ query: q, slugs: new Set(slugs) });
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    if (!openId) return;
    let live = true;
    getIndexNextReads(openId).then((reads) => {
      if (live) setNextReads({ id: openId, reads });
    });
    return () => {
      live = false;
    };
  }, [openId]);

  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const newest = useMemo(() => sortIndexByDate(items).slice(0, RECENT_COUNT), [items]);

  const results = useMemo(() => {
    if (!q && !concept) return newest;
    let found: IndexItem[] = [];
    if (concept) {
      found = concept.slugs.map((s) => byId.get(s)).filter((i): i is IndexItem => Boolean(i));
    }
    if (q) {
      const terms = expandIndexQuery(q);
      const hits = bodyHits?.query === q ? bodyHits.slugs : null;
      const scored = items
        .map((item) => {
          let score = scoreIndexItem(item, terms, indexItemText(item));
          if (score === 0 && item.kind === "essay" && hits?.has(item.id)) score = 2;
          return { item, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ item }) => item);
      const fromConcepts = conceptsMatching(q)
        .flatMap((c) => c.slugs)
        .map((s) => byId.get(s))
        .filter((i): i is IndexItem => Boolean(i));
      const seen = new Set<string>();
      found = [...scored, ...fromConcepts].filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)));
    }
    return sortIndexByDate(found);
  }, [q, concept, items, byId, newest, bodyHits]);

  const showCharity = matchesCharity(q);
  const filtering = q !== "" || concept !== null;

  function onType(value: string) {
    setQuery(value);
    setConceptKey(null);
    setOpenId(null);
  }

  function reset() {
    setQuery("");
    setConceptKey(null);
    setOpenId(null);
  }

  function pickConcept(key: string) {
    setConceptKey(conceptKey === key ? null : key);
    setQuery("");
    setOpenId(null);
  }

  return (
    <div>
      <div className="mb-10 flex max-w-[43.75rem] items-center rounded-sm border border-brand-gold/20 bg-white transition-colors focus-within:border-brand-gold/60 dark:bg-card">
        <Search aria-hidden="true" className="mx-3 size-5 shrink-0 text-brand-gold" />
        <label htmlFor="the-index-search" className="sr-only">
          Search the Index
        </label>
        <input
          id="the-index-search"
          type="search"
          value={query}
          onChange={(e) => onType(e.target.value)}
          placeholder="Search full text, ideas, companies, people, or questions..."
          className="min-w-0 flex-1 bg-transparent py-3.5 text-[1.05rem] text-foreground outline-none placeholder:text-muted-foreground sm:text-[1.1rem] [&::-webkit-search-cancel-button]:hidden"
        />
        {filtering && (
          <button
            type="button"
            onClick={reset}
            aria-label="Clear search"
            className="flex size-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>

      <div className="mb-12">
        <p className="mb-4 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">Browse by concept</p>
        <div className="flex flex-wrap gap-2">
          {INDEX_CONCEPTS.map((c) => {
            const active = c.key === conceptKey;
            return (
              <button
                key={c.key}
                type="button"
                aria-pressed={active}
                onClick={() => pickConcept(c.key)}
                className={
                  active
                    ? "min-h-11 rounded-[3px] border border-brand-gold bg-[#111] px-4 py-2 text-left font-mono text-[0.78rem] tracking-[0.04em] text-brand-gold-light transition-colors"
                    : "min-h-11 rounded-[3px] border border-brand-gold/15 bg-transparent px-4 py-2 text-left font-mono text-[0.78rem] tracking-[0.04em] text-foreground/70 transition-colors hover:border-brand-gold/40 hover:text-foreground"
                }
              >
                {c.label}
                <span className="ml-1.5 opacity-60">({c.slugs.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {concept && (
        <div className="mb-8 max-w-[43.75rem] border-l-[3px] border-l-brand-gold bg-brand-gold/3 px-7 py-5">
          <p className="mb-1.5 font-heading text-xl font-semibold text-foreground">{concept.label}</p>
          <p className="font-serif text-[1.05rem] text-foreground/65">{concept.description}</p>
          {concept.key === "charity" && (
            <Link
              href="/charity-scorecard"
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 border-b border-brand-gold/30 font-mono text-[0.82rem] tracking-[0.08em] text-brand-gold uppercase no-underline"
            >
              Explore the Grand Impact Accountability Index
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p className="mb-4 flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground" aria-live="polite">
            {filtering ? `${results.length} ${results.length === 1 ? "RESULT" : "RESULTS"}` : "RECENTLY ADDED TO THE INDEX"}
            {bodyPending && <Loader2 aria-label="Searching full text" className="size-3.5 animate-spin" />}
          </p>
          <ul className="grid grid-cols-1 gap-3">
            {results.map((item) => {
              const open = item.id === openId;
              return (
                <li key={item.id} className="min-w-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={open ? `index-tldr-${item.id}` : undefined}
                    onClick={() => setOpenId(open ? null : item.id)}
                    className={
                      open
                        ? "flex w-full gap-4 rounded-sm border border-brand-gold/25 bg-brand-gold/5 px-4 py-4 text-left transition-all sm:px-5"
                        : "flex w-full gap-4 rounded-sm border border-brand-gold/8 bg-white/70 px-4 py-4 text-left transition-all hover:translate-x-1 hover:border-brand-gold/25 hover:bg-brand-gold/5 sm:px-5 dark:bg-card"
                    }
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt=""
                        width={80}
                        height={55}
                        className="h-[55px] w-20 shrink-0 rounded-[3px] object-cover"
                      />
                    )}
                    <span className="block min-w-0 flex-1">
                      <span className="mb-1 block font-heading text-[1.05rem]/snug font-semibold text-foreground sm:text-[1.1rem]">
                        {item.title}
                      </span>
                      {item.formatTag && (
                        <span className="mb-1 block font-mono text-[0.7rem] tracking-[0.06em] text-brand-gold">{item.formatTag}</span>
                      )}
                      <span className="block truncate font-serif text-[0.98rem]/normal text-foreground/65">{item.summary}</span>
                    </span>
                  </button>
                  {open && (
                    <IndexTldr
                      item={item}
                      reads={nextReads?.id === item.id ? nextReads.reads : null}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {showCharity && (
        <Link
          href="/charity-scorecard"
          className="mt-3 flex gap-4 rounded-sm border border-brand-gold/20 bg-brand-gold/6 px-4 py-4 no-underline transition-colors hover:border-brand-gold/40 sm:px-5"
        >
          <span className="flex h-[55px] w-20 shrink-0 items-center justify-center rounded-[3px] bg-[#111]">
            <Diamond aria-hidden="true" className="size-6 fill-brand-gold-light text-brand-gold-light" />
          </span>
          <span className="block min-w-0 flex-1">
            <span className="mb-1 block font-heading text-[1.1rem] font-semibold text-foreground">
              The Grand Impact Accountability Index
            </span>
            <span className="mb-1 block font-mono text-[0.7rem] tracking-[0.06em] text-brand-gold">INTERACTIVE TOOL</span>
            <span className="block font-serif text-[0.98rem]/normal text-foreground/65">
              {charityCount} charities scored across 7 dimensions from 8 evaluators. Where does your dollar actually go?
            </span>
          </span>
        </Link>
      )}

      {filtering && results.length === 0 && !showCharity && conceptKey !== "charity" && !bodyPending && (
        <p className="py-12 text-center font-serif text-[1.08rem] text-muted-foreground">
          No essays found for &ldquo;{q || concept?.label}&rdquo;. Try a different search term.
        </p>
      )}
    </div>
  );
}

function IndexTldr({ item, reads }: { item: IndexItem; reads: IndexNextRead[] | null }) {
  return (
    <aside
      id={`index-tldr-${item.id}`}
      aria-label={`${item.title} preview`}
      className="mt-3 mb-2 border-l-[3px] border-l-essay-red bg-essay-red/4 p-6"
    >
      <p className="mb-2 font-mono text-[0.72rem] tracking-[0.12em] text-essay-red">TLDR</p>
      <h2 className="mb-2 font-heading text-[1.6rem]/tight text-foreground sm:text-[2.15rem]/tight">{item.title}</h2>
      <p className="font-serif text-[1.06rem]/[1.65] text-foreground/85">{item.summary}</p>

      <div className="mt-5">
        <p className="mb-2 font-mono text-[0.7rem] tracking-widest text-muted-foreground">THREE RELATED PLACES TO GO NEXT</p>
        {reads === null ? (
          <Loader2 aria-label="Loading next reads" className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <ul className="grid grid-cols-1 gap-1.5">
            {reads.map((r) => (
              <li key={r.id}>
                <IndexLink href={r.href} external={r.external} className="font-serif text-[#33243F] underline underline-offset-[3px] dark:text-brand-gold-light">
                  {r.title}
                </IndexLink>
              </li>
            ))}
          </ul>
        )}
      </div>

      <IndexLink
        href={item.href}
        external={item.external}
        className="mt-5 inline-flex min-h-11 items-center border border-[#B7AEA1] bg-[#F1EBDD] px-4 py-3 font-mono text-[0.78rem] tracking-[0.08em] text-[#111] uppercase no-underline"
      >
        Read {item.title}
      </IndexLink>
    </aside>
  );
}

function IndexLink({ href, external, className, children }: { href: string; external?: boolean; className: string; children: React.ReactNode }) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
