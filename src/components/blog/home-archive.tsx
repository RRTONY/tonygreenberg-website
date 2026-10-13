"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, X, ArrowRight, SlidersHorizontal } from "lucide-react";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { PostCard } from "@/components/blog/post-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArchiveSearchBox } from "@/components/blog/archive-search-box";
import { CURATED_JOURNEYS } from "@/lib/content/curated-journeys";
import { socialLinks } from "@/components/site-nav-data";
import { postHref } from "@/lib/content/post-redirects";
import {
  ARCHIVE_JSON_PATH,
  ARCHIVE_PAGE_SIZE as PAGE_SIZE,
  LENGTH_FILTERS,
  readingMinutes,
  topicKey,
  type ArchivePost as Post,
  type ArchiveSummary,
} from "@/lib/content/essay-archive";

// Ported from legacy client/src/pages/Blog.tsx's search/filter bar + full
// archive + sidebar. Legacy loaded its entire post corpus client-side for
// search/category/theme filtering rather than paging server-side. Same idea
// here, but the page only carries the first PAGE_SIZE posts and the counts
// (summarizeArchive); the full list is the static ARCHIVE_JSON_PATH, fetched
// once when someone points at, focuses or uses the search/filter controls
// or "Show all" (2026-10-09: every post inside the page tripled the
// homepage's HTML). Filtering itself stays in the browser.
//
// "Most Read" and "Most Provocative" — legacy's other two sidebar widgets —
// ranked posts by a `reads` count that defaulted to a flat 500 for any post
// without one. The live site now shows both lists (2026-10-01), so the two
// rankings are ported as fixed lists of the same posts in live's order, but
// WITHOUT the read counts: this migration doesn't publish numbers it can't
// back. Revisit once real view-count data exists (see NEXTJS-MIGRATION-TODO.md).
const MOST_READ = [
  { slug: "boiling-the-human-summit-harvard-kurzweil", title: "“Boiling the Human” H+ Summit Transcript / Harvard-Kurzweil" },
  { slug: "the-restaurant-with-no-menu-prices-ai-ethics-manifesto", title: "Zuck: Fix This Now & Lead AI Toward Ethical Billing" },
  { slug: "only-time-buys-trust", title: "Trust Us? Are You Really My Friend?" },
  { slug: "return-on-investment-going-green-going-green-2", title: "Return on Investment - Are You Going Green?" },
  { slug: "customer-service-key-to-business-success", title: "Customer Service: The Key to Business Success" },
];

const MOST_PROVOCATIVE = [
  { slug: "boiling-the-human-summit-harvard-kurzweil", title: "“Boiling the Human” H+ Summit Transcript / Harvard-Kurzweil" },
  { slug: "the-restaurant-with-no-menu-prices-ai-ethics-manifesto", title: "Zuck: Fix This Now & Lead AI Toward Ethical Billing" },
  { slug: "the-ball-and-blockchain-decentralization", title: "The Ball and Blockchain: Obstacles to a World-Changing Trajectory" },
  { slug: "grateful-smuggest-sentiment-or-selfish-act", title: "Grateful: Smuggest Sentiment or Second Most Selfish Act?" },
  { slug: "apologize", title: "I Apologize. Not Me. Nix “I Am Sorry” From Our Lexicon" },
];

const RANKED_LISTS = [
  { heading: "Most Read", posts: MOST_READ },
  { heading: "Most Provocative", posts: MOST_PROVOCATIVE },
];
// `eagerFirstCard`: on /blog the first card is the largest image on screen,
// so it loads right away; on the homepage the archive is far below the fold.
export function HomeArchive({
  archive,
  eagerFirstCard = false,
}: {
  archive: ArchiveSummary;
  eagerFirstCard?: boolean;
}) {
  const { firstPosts, total, categories, years, topics, journeyCounts } = archive;
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  // Extra filters (owner asked, 2026-10-14). "all" = not filtering.
  const [sort, setSort] = useState("newest");
  const [year, setYear] = useState("all");
  const [length, setLength] = useState("all");
  const [topic, setTopic] = useState("all");
  // A Curated Journey from the sidebar (its id), shown as a filter chip above the grid.
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const journey = CURATED_JOURNEYS.find((j) => j.id === journeyId);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [allPosts, setAllPosts] = useState<Post[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const loading = useRef(false);

  // Called from event handlers only (pointer/focus on the controls, typing,
  // a filter or "Show all"), so nothing is fetched for readers who just scroll.
  function loadAll() {
    if (allPosts || loading.current) return;
    loading.current = true;
    setLoadFailed(false);
    fetch(ARCHIVE_JSON_PATH)
      .then((r) => (r.ok ? (r.json() as Promise<Post[]>) : Promise.reject(new Error(String(r.status)))))
      .then(setAllPosts)
      .catch(() => setLoadFailed(true))
      .finally(() => {
        loading.current = false;
      });
  }

  const posts = allPosts ?? firstPosts;
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const range = LENGTH_FILTERS.find((l) => l.value === length);
    const matches = posts.filter((p) => {
      const matchesCat = activeCategory === "All" || p.category?.title === activeCategory;
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? "").toLowerCase().includes(q) ||
        (p.category?.title ?? "").toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
      const matchesYear = year === "all" || p.publishedAt?.startsWith(year);
      const minutes = readingMinutes(p);
      const matchesLength = !range || (minutes >= range.min && minutes <= range.max);
      const matchesTopic = topic === "all" || (p.tags ?? []).some((t) => topicKey(t) === topic);
      const matchesJourney = !journey || journey.postSlugs.includes(p.slug);
      return matchesCat && matchesSearch && matchesYear && matchesLength && matchesTopic && matchesJourney;
    });
    // Posts arrive newest first; reverse for "oldest".
    return sort === "oldest" ? [...matches].reverse() : matches;
  }, [posts, activeCategory, searchQuery, year, length, topic, sort, journey]);

  const extraFilters = [sort !== "newest", year !== "all", length !== "all", topic !== "all"].filter(Boolean).length;
  const isSearching = searchQuery.length > 0 || activeCategory !== "All" || extraFilters > 0 || !!journey;

  function clearFilters() {
    setSort("newest");
    setYear("all");
    setLength("all");
    setTopic("all");
  }


  // Until the full list arrives, a search, filter or "Show all" can only be
  // answered from the first page, so show a spinner (or a retry) instead.
  const waiting = !allPosts && (isSearching || showAll);
  const visiblePosts = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  const matchCount = allPosts ? filtered.length : total;
  const hasMore = !waiting && matchCount > PAGE_SIZE && !showAll;

  return (
    <div>
      {/* top-14 matches site-header.tsx's h-14 — sticks directly below the
          fixed site header instead of competing with it at the same top-0
          position (both being sticky at top-0 made this row render behind/
          overlapping the header instead of stacking under it). */}
      <div
        id="essays-archive"
        onPointerEnter={loadAll}
        onFocusCapture={loadAll}
        className="sticky top-14 z-40 scroll-mt-14 border-b border-border bg-secondary/95 px-4 py-4 backdrop-blur sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-center gap-2">
            <ArchiveSearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              onActivate={loadAll}
              categories={categories.map(([title]) => title)}
              topics={topics.map(([label]) => label)}
              onPickCategory={(title) => setActiveCategory(title)}
              onPickTopic={(label) => setTopic(topicKey(label))}
            />
            {/* Phones fold the four filters behind this button so the sticky bar stays short.
                Every filter calls loadAll(): the page only carries the first 12 posts. */}
            <Button
              variant="outline"
              size="sm"
              aria-expanded={filtersOpen}
              aria-controls="archive-filters"
              onClick={() => setFiltersOpen((o) => !o)}
              className="h-9 shrink-0 gap-1.5 font-mono text-xs tracking-wide uppercase sm:hidden"
            >
              <SlidersHorizontal aria-hidden="true" className="size-4" />
              Filters{extraFilters > 0 && ` (${extraFilters})`}
            </Button>
          </div>

          <div
            id="archive-filters"
            className={
              filtersOpen
                ? "mb-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center"
                : "mb-3 hidden grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center"
            }
          >
            <Select value={sort} onValueChange={(v) => {
                loadAll();
                setSort(v);
              }}>
              <SelectTrigger aria-label="Sort essays" size="sm" className="w-full bg-background sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={(v) => {
                loadAll();
                setYear(v);
              }}>
              <SelectTrigger aria-label="Filter by year" size="sm" className="w-full bg-background sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any year</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={length} onValueChange={(v) => {
                loadAll();
                setLength(v);
              }}>
              <SelectTrigger aria-label="Filter by reading time" size="sm" className="w-full bg-background sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any length</SelectItem>
                {LENGTH_FILTERS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={topic} onValueChange={(v) => {
                loadAll();
                setTopic(v);
              }}>
              <SelectTrigger aria-label="Filter by topic" size="sm" className="w-full bg-background sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any topic</SelectItem>
                {topics.map(([label, count]) => (
                  <SelectItem key={label} value={topicKey(label)}>
                    {label} ({count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {extraFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="col-span-2 gap-1.5 font-mono text-xs tracking-wide text-muted-foreground uppercase"
              >
                <X aria-hidden="true" className="size-3.5" />
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <Button
              variant={activeCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("All")}
              className="shrink-0 font-mono text-xs tracking-wide uppercase"
            >
              All ({total})
            </Button>
            {categories.map(([title, count]) => {
              const isActive = activeCategory === title;
              return (
                <Button
                  key={title}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  aria-pressed={isActive}
                  onClick={() => {
                    loadAll();
                    setActiveCategory(isActive ? "All" : title);
                  }}
                  className="shrink-0 gap-1.5 font-mono text-xs tracking-wide uppercase"
                >
                  {title} ({count})
                  {isActive && <X aria-hidden="true" className="size-3.5" />}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_260px]">
        {/* scroll-mt clears the fixed header plus the sticky filter bar above. */}
        <div id="archive-results" className="min-w-0 scroll-mt-56">
          {journey ? (
            <div className="mb-5 flex flex-wrap items-center gap-3 border-b-2 border-brand-gold pb-1.5">
              <h2 className="font-mono text-xs tracking-[0.12em] text-brand-gold uppercase">
                Curated Journey — {journey.title}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setJourneyId(null)}
                className="h-7 gap-1 px-2 font-mono text-xs tracking-wide text-muted-foreground uppercase"
              >
                <X aria-hidden="true" className="size-3.5" />
                Show all essays
              </Button>
            </div>
          ) : isSearching ? (
            <h2 className="sr-only">Matching essays</h2>
          ) : (
            <h2 className="mb-5 border-b-2 border-brand-gold pb-1.5 font-mono text-xs tracking-[0.12em] text-brand-gold uppercase">
              Full Archive — All {total} Essays
            </h2>
          )}

          {waiting ? (
            <div role="status" className="flex items-center justify-center gap-2 py-8 font-mono text-sm text-muted-foreground">
              {loadFailed ? (
                <>
                  Couldn&apos;t load the full archive.
                  <Button variant="outline" size="sm" onClick={loadAll}>
                    Try again
                  </Button>
                </>
              ) : (
                <>
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  Loading all essays
                </>
              )}
            </div>
          ) : visiblePosts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visiblePosts.map((post, i) => (
                <PostCard
                  key={post._id}
                  eager={eagerFirstCard && i === 0}
                  post={{
                    ...post,
                    slug: { current: post.slug },
                    category: post.category
                      ? { title: post.category.title, slug: { current: post.category.slug } }
                      : undefined,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center font-mono text-sm text-muted-foreground">
              No essays match your search.
            </div>
          )}

          {hasMore && (
            <div className="py-6 text-center">
              <Button
                variant="outline"
                onClick={() => {
                  loadAll();
                  setShowAll(true);
                }}
                className="border-brand-gold/30 px-8 font-mono text-sm tracking-wide text-brand-gold uppercase hover:bg-brand-gold/5 hover:text-brand-gold"
              >
                <span className="inline-flex items-center gap-1.5">
                  Show all {matchCount} essays
                  <ArrowRight aria-hidden="true" className="size-[1em] shrink-0" />
                </span>
              </Button>
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          {RANKED_LISTS.map((list) => (
            <div key={list.heading} className="mb-6">
              <div className="mb-2 border-b-2 border-brand-gold pb-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase">
                {list.heading}
              </div>
              <ol>
                {list.posts.map((post, i) => (
                  <li key={post.slug} className="border-b border-border/50">
                    <Link href={postHref(post.slug)} className="flex items-baseline gap-2.5 py-2">
                      <span className="font-mono text-xs text-brand-gold">{i + 1}</span>
                      <span className="font-heading text-sm leading-snug font-semibold text-foreground">
                        {post.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ))}

          <div className="mb-6">
            <div className="mb-2 border-b-2 border-brand-gold pb-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase">
              Curated Journeys
            </div>
            {/* Live linked every journey to /journeys, where 5 of the 7 don't exist (a
                dead end); here a journey filters the archive to its own essays instead. */}
            {CURATED_JOURNEYS.map((j) => {
              const isActive = j.id === journeyId;
              return (
                <button
                  key={j.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    loadAll();
                    setJourneyId(isActive ? null : j.id);
                    document.getElementById("archive-results")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={
                    isActive
                      ? "flex w-full items-center gap-2 border-b border-border/50 bg-brand-gold/10 py-2 text-left"
                      : "flex w-full items-center gap-2 border-b border-border/50 py-2 text-left hover:bg-brand-gold/5"
                  }
                >
                  <j.icon aria-hidden="true" className="size-4 shrink-0 text-brand-gold" strokeWidth={1.75} />
                  <span>
                    <span className="block font-heading text-sm font-semibold text-foreground">{j.title}</span>
                    <span className="block font-mono text-xs text-muted-foreground">
                      {journeyCounts[j.id] ?? 0} {journeyCounts[j.id] === 1 ? "essay" : "posts"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mb-5 rounded-md border border-brand-gold/15 bg-brand-gold/5 p-4">
            <div className="mb-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase">
              Tip Me Off
            </div>
            <p className="mb-2 text-sm text-muted-foreground">See an injustice worth exposing?</p>
            <a
              href="mailto:tony@tonygreenberg.com?subject=Tip%20for%20TonyG"
              className="inline-block rounded-sm border border-brand-gold/25 px-3 py-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase"
            >
              <span className="inline-flex items-center gap-1.5">
                Send a Tip
                <ArrowRight aria-hidden="true" className="size-[1em] shrink-0" />
              </span>
            </a>
          </div>

          <div>
            <div className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
              Follow
            </div>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Tony Greenberg on ${s.label}`}
                  className="rounded-sm border border-border p-2 text-brand-gold"
                >
                  {s.label === "X" ? <FaXTwitter size={15} /> : <FaLinkedin size={15} />}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
