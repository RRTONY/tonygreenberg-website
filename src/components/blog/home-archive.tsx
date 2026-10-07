"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { PostCard } from "@/components/blog/post-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CURATED_JOURNEYS } from "@/lib/content/curated-journeys";
import { socialLinks } from "@/components/site-nav-data";
import { urlFor } from "@/lib/sanity/image";
import { postHref } from "@/lib/content/post-redirects";

type Post = {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  heroImage?: Parameters<typeof urlFor>[0];
  readTime?: number;
  tags?: string[];
  category?: { title: string; slug: string };
};

const PAGE_SIZE = 12;

// Ported from legacy client/src/pages/Blog.tsx's search/filter bar + full
// archive + sidebar. Legacy loaded its entire post corpus client-side for
// search/category/theme filtering rather than paging server-side — same
// approach here (all posts are fetched server-side once in page.tsx and
// passed in as a prop; ~120 posts is small enough that this is simpler and
// snappier than a server round-trip per filter change).
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
export function HomeArchive({ posts, eagerFirstCard = false }: { posts: Post[]; eagerFirstCard?: boolean }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const categories = useMemo(() => {
    const seen = new Map<string, number>();
    for (const p of posts) {
      if (!p.category) continue;
      seen.set(p.category.title, (seen.get(p.category.title) ?? 0) + 1);
    }
    return Array.from(seen.entries());
  }, [posts]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return posts.filter((p) => {
      const matchesCat = activeCategory === "All" || p.category?.title === activeCategory;
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? "").toLowerCase().includes(q) ||
        (p.category?.title ?? "").toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const isSearching = searchQuery.length > 0 || activeCategory !== "All";
  const visiblePosts = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  const hasMore = filtered.length > PAGE_SIZE && !showAll;

  return (
    <div>
      {/* top-14 matches site-header.tsx's h-14 — sticks directly below the
          fixed site header instead of competing with it at the same top-0
          position (both being sticky at top-0 made this row render behind/
          overlapping the header instead of stacking under it). */}
      <div id="essays-archive" className="sticky top-14 z-40 scroll-mt-14 border-b border-border bg-secondary/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative min-w-45 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search essays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 bg-background pl-8"
              />
            </div>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <Button
              variant={activeCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("All")}
              className="shrink-0 font-mono text-xs tracking-wide uppercase"
            >
              All ({posts.length})
            </Button>
            {categories.map(([title, count]) => {
              const isActive = activeCategory === title;
              return (
                <Button
                  key={title}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(isActive ? "All" : title)}
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
        <div className="min-w-0">
          {isSearching ? (
            <h2 className="sr-only">Matching essays</h2>
          ) : (
            <h2 className="mb-5 border-b-2 border-brand-gold pb-1.5 font-mono text-xs tracking-[0.12em] text-brand-gold uppercase">
              Full Archive — All {posts.length} Essays
            </h2>
          )}

          {visiblePosts.length > 0 ? (
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
                onClick={() => setShowAll(true)}
                className="border-brand-gold/30 px-8 font-mono text-sm tracking-wide text-brand-gold uppercase hover:bg-brand-gold/5 hover:text-brand-gold"
              >
                Show all {filtered.length} essays →
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
            {CURATED_JOURNEYS.map((journey) => (
              <Link
                key={journey.id}
                href="/journeys"
                className="flex items-center gap-2 border-b border-border/50 py-2"
              >
                <journey.icon className="size-4 text-brand-gold" strokeWidth={1.75} />
                <div>
                  <div className="font-heading text-sm font-semibold text-foreground">
                    {journey.title}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {journey.postSlugs.length} posts
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mb-5 rounded-md border border-brand-gold/15 bg-brand-gold/5 p-4">
            <div className="mb-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase">
              Tip Me Off
            </div>
            <p className="mb-2 text-sm text-muted-foreground">See an injustice worth exposing?</p>
            <a
              href="mailto:tony@joyandwoe.com?subject=Tip%20for%20TonyG"
              className="inline-block rounded-sm border border-brand-gold/25 px-3 py-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase"
            >
              Send a Tip →
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
