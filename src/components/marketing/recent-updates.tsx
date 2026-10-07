"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPostDate } from "@/lib/format-post-date";
import { postHref } from "@/lib/content/post-redirects";

// Rebuilt from the live tonygreenberg.com homepage's "Recent Updates" band
// (its source is a newer Blog.tsx than the snapshot in _legacy-manus-app/,
// so this was matched against the live page's rendered markup and styles
// on 2026-09-29). Newest three essays, filterable by the same five topic
// pills live shows, next to a dark "24 hour traffic snapshot" panel whose
// numbers are hardcoded on live too (a dated observation, not a counter).
// Replaces the older "Latest Thinking" pair, which live no longer shows.
// The first render (All Categories) is in the server HTML; the filter is
// the only reason this is a Client Component.

export type RecentUpdatePost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  category?: { title: string; slug: string };
};

const FILTERS = [
  { label: "All Categories", slug: null },
  { label: "Business & Capital", slug: "business-capital" },
  { label: "Enterprise Technology & AI", slug: "enterprise-technology-ai" },
  { label: "Psychedelic Medicine", slug: "psychedelic-medicine" },
  { label: "Conscious Capital", slug: "conscious-capital" },
  { label: "Systems & Innovation", slug: "systems-innovation" },
] as const;

const MAX_POSTS = 3;

export function RecentUpdates({ posts }: { posts: RecentUpdatePost[] }) {
  const [active, setActive] = useState<string | null>(null);
  const shown = posts.filter((p) => active === null || p.category?.slug === active).slice(0, MAX_POSTS);

  return (
    <section
      aria-labelledby="recent-updates-heading"
      className="border-y border-[#343434]/14 bg-[#F1EBDD] px-4 py-[clamp(2.5rem,6vw,4.5rem)] text-[#111111]"
    >
      <div className="mx-auto max-w-300">
        <div className="mb-6 max-w-190">
          <p className="mb-3 font-mono text-[0.72rem] tracking-[0.18em] text-[#8E1E25] uppercase">In motion</p>
          <h2
            id="recent-updates-heading"
            className="font-heading text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-bold text-[#111111]"
          >
            Recent Updates
          </h2>
        </div>

        <div role="group" aria-label="Filter recent articles by topic" className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const pressed = active === f.slug;
            return (
              <button
                key={f.label}
                type="button"
                aria-pressed={pressed}
                onClick={() => setActive(f.slug)}
                className={
                  pressed
                    ? "min-h-11 cursor-pointer rounded-full border border-[#33243F] bg-[#33243F] px-3.5 py-2.5 font-mono text-[0.72rem] tracking-[0.08em] text-[#F1EBDD] uppercase transition-colors duration-150"
                    : "min-h-11 cursor-pointer rounded-full border border-[#33243F]/42 bg-transparent px-3.5 py-2.5 font-mono text-[0.72rem] tracking-[0.08em] text-[#33243F] uppercase transition-colors duration-150 hover:bg-[#33243F]/8"
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(240px,0.72fr)_minmax(0,1.8fr)]">
          <aside className="flex flex-col justify-between border-t-4 border-[#B7352C] bg-[#33243F] p-[clamp(1.5rem,3vw,2rem)] text-[#F1EBDD]">
            <div>
              <p className="mb-5 font-mono text-[0.68rem] tracking-[0.16em] uppercase opacity-84">
                24 hour traffic snapshot
              </p>
              <p className="font-heading text-[clamp(3.2rem,6vw,4.5rem)] leading-[0.9] font-bold tracking-[-0.04em]">117</p>
              <p className="mt-2 text-lg leading-[1.45]">human pageviews found their way here.</p>
            </div>
            <p className="mt-8 font-mono text-[0.72rem] leading-[1.65] text-[#F1EBDD]/84">
              117 sessions. 5 identified search engine crawls. Observed September 16, 2026.
            </p>
          </aside>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-px border border-[#343434]/18 bg-[#343434]/18">
            {shown.length === 0 ? (
              <p className="bg-[#F8F5EE] p-6 text-[#343434]">No essays in this topic yet.</p>
            ) : (
              shown.map((post) => (
                <Link key={post._id} href={postHref(post.slug)} className="group block h-full">
                  <article className="flex h-full flex-col justify-between bg-[#F8F5EE] p-6 transition-colors duration-150 group-hover:bg-[#FCFAF5]">
                    <div>
                      {post.publishedAt && (
                        <p className="mb-4 font-mono text-[0.68rem] tracking-[0.12em] text-[#8E1E25] uppercase">
                          {formatPostDate(post.publishedAt)}
                        </p>
                      )}
                      {post.category && (
                        <p className="mb-3 font-mono text-[0.68rem] tracking-[0.1em] text-[#343434] uppercase">
                          {post.category.title}
                        </p>
                      )}
                      <h3 className="mb-3.5 font-heading text-[clamp(1.45rem,2.2vw,1.85rem)] leading-[1.08] font-bold text-[#111111] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                        {post.title}
                      </h3>
                      {post.excerpt && <p className="text-lg leading-normal text-[#343434]">{post.excerpt}</p>}
                    </div>
                    <span className="mt-6 font-mono text-[0.7rem] tracking-[0.12em] text-[#8E1E25] uppercase">
                      Read the essay
                    </span>
                  </article>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
