"use client";

import { ForwardIcon } from "@/components/ui/inline-icons";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/content/content-image";
import { DEFAULT_OG_IMAGE } from "@/lib/content/default-image";
import {
  FEATURED_COUNT,
  IMPACT_FUTURISM_ENTRIES,
  TAG_BADGE,
  type ImpactFuturismEntry,
} from "@/lib/content/impact-futurism";
import type { ArchivePost } from "@/components/blog/articles-explorer";

// allPostsForArchiveQuery also selects heroImage/readTime, but the
// ArchivePost type (defined for articles-explorer's narrower needs) omits
// them — extend it here rather than widen that shared type for one page.
export type FuturismPost = ArchivePost & {
  heroImage?: Parameters<typeof urlFor>[0];
  readTime?: number;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function TagBadge({ tag }: { tag: string }) {
  return (
    <span
      className={`rounded-sm px-2.5 py-1 font-mono text-[0.6rem] tracking-widest uppercase ${TAG_BADGE[tag] ?? "bg-neutral-900 text-neutral-100"}`}
    >
      {tag}
    </span>
  );
}

function FeaturedCard({ post, entry }: { post: FuturismPost; entry: ImpactFuturismEntry }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-brand-gold/15 bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-video bg-muted">
        {post.heroImage ? (
          <Image
            src={urlFor(post.heroImage).width(800).height(450).url()}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Image
            src={DEFAULT_OG_IMAGE}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute top-3 left-3">
          <TagBadge tag={entry.tag} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 font-mono text-[0.65rem] tracking-wide text-brand-gold">
          {formatDate(post.publishedAt)}
          {post.readTime ? ` · ${post.readTime} min read` : ""}
        </div>
        <h3 className="mb-2.5 flex-1 font-heading text-lg font-bold leading-snug text-foreground">
          {post.title}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{entry.teaser}</p>
        <div className="font-mono text-xs tracking-wide text-brand-gold">
          Read <ForwardIcon aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}

function ArticleListRow({
  post,
  entry,
  index,
}: {
  post: FuturismPost;
  entry: ImpactFuturismEntry;
  index: number;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="grid grid-cols-[auto_1fr_auto] items-start gap-4 rounded-sm border-b border-brand-gold/10 px-2 py-5 transition-colors hover:bg-brand-gold/4"
    >
      <div className="min-w-6 pt-0.5 font-mono text-xs text-brand-gold/50">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2.5">
          <TagBadge tag={entry.tag} />
          <span className="font-mono text-[0.6rem] text-brand-gold/60">
            {formatDate(post.publishedAt)}
          </span>
        </div>
        <h4 className="mb-1 font-heading text-base font-bold leading-snug text-foreground">
          {post.title}
        </h4>
        <p className="text-sm leading-relaxed text-muted-foreground">{entry.teaser}</p>
      </div>
      <div className="pt-0.5 font-mono text-xs whitespace-nowrap text-brand-gold">
        <ForwardIcon aria-hidden="true" />
      </div>
    </Link>
  );
}

export function ImpactFuturismExplorer({ posts }: { posts: FuturismPost[] }) {
  const [activeTag, setActiveTag] = useState("All");

  const entries = useMemo(() => {
    const bySlug = new Map(posts.map((p) => [p.slug, p]));
    return IMPACT_FUTURISM_ENTRIES.map((entry) => ({ entry, post: bySlug.get(entry.slug) })).filter(
      (x): x is { entry: ImpactFuturismEntry; post: FuturismPost } => Boolean(x.post),
    );
  }, [posts]);

  const featured = entries.slice(0, FEATURED_COUNT);
  const all = entries;
  const tags = useMemo(() => ["All", ...Array.from(new Set(all.map((e) => e.entry.tag)))], [all]);
  const filtered = activeTag === "All" ? all : all.filter((e) => e.entry.tag === activeTag);

  return (
    <div>
      {/* Hero — fixed dark brand band, not the light/dark toggle, matching
          the same call made on home-hero.tsx and articles-explorer's header. */}
      <div className="relative overflow-hidden bg-[#0A0A10] px-6 py-20 sm:px-10">
        <div className="pointer-events-none absolute -top-16 right-[10%] size-100 rounded-full bg-purple-900/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-[5%] size-75 rounded-full bg-blue-900/30 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold-light uppercase">
            ◆ Tony Greenberg
          </div>
          <h1 className="mb-5 font-heading text-4xl leading-tight text-white/95 italic sm:text-6xl">
            Impact Futurism
          </h1>
          <p className="mb-8 max-w-xl leading-relaxed text-white/65">
            The systems that run your health, your money, and your future are broken. These essays
            are about what comes next — written from the inside of $10B+ in transactions, six
            psychedelic investments, and twenty-five years of watching institutions fail the people
            they were built to serve.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="rounded-sm bg-brand-gold-light px-7 py-3 font-mono text-xs font-semibold tracking-wide text-[#0A0A10] uppercase"
            >
              Get the Dispatch
            </Link>
            <Link
              href="/articles"
              className="rounded-sm border border-brand-gold-light/30 px-7 py-3 font-mono text-xs tracking-wide text-white/70 uppercase"
            >
              All {posts.length} Essays
            </Link>
          </div>
        </div>
      </div>

      {/* Featured three */}
      <div className="bg-background px-6 py-14 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Featured
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map(({ post, entry }) => (
              <FeaturedCard key={post.slug} post={post} entry={entry} />
            ))}
          </div>
        </div>
      </div>

      {/* All articles with tag filter */}
      <div className="bg-secondary px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`rounded-full border border-brand-gold/40 px-4 py-1.5 font-mono text-xs tracking-wide uppercase ${
                  activeTag === tag ? "bg-brand-gold text-white" : "text-brand-gold"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex flex-col">
            {filtered.map(({ post, entry }, i) => (
              <ArticleListRow key={post.slug} post={post} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter footer — fixed dark band, same call as the hero above. */}
      <div className="bg-linear-to-br from-[#0A0A10] to-[#1a1020] px-6 py-16 text-center sm:px-10">
        <div className="mx-auto max-w-md">
          <div className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold-light uppercase">
            ◆ The Dispatch
          </div>
          <h3 className="mb-3 font-heading text-2xl leading-tight text-white/95 italic">
            The next dispatch arrives when it&apos;s ready.
          </h3>
          <p className="mb-6 leading-relaxed text-white/55">
            No cadence. No algorithm. Just the things I couldn&apos;t not write — about the systems
            breaking around us and what comes next.
          </p>
          <Link
            href="/blog"
            className="inline-block rounded-sm bg-brand-gold-light px-9 py-3.5 font-mono text-xs font-semibold tracking-wide text-[#0A0A10] uppercase"
          >
            Send Me the Dispatch
          </Link>
        </div>
      </div>
    </div>
  );
}
