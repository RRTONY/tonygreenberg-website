"use client";

import { ForwardIcon } from "@/components/ui/inline-icons";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CORE_THESIS,
  THESIS_THREADS,
  SECTION_THESIS_MAP,
  RESEARCH_LIBRARY,
  LP_COMPARABLES,
  CONTENT_RULES,
  NEVER_USE,
  THESIS_CONNECTORS,
  type ThesisThread,
} from "@/lib/content/thesis-threads";
import type { ArchivePost } from "@/components/blog/articles-explorer";

const THREAD_ACCENT: Record<string, { border: string; text: string; wash: string }> = {
  "opacity-tax": { border: "border-red-500/30", text: "text-red-400", wash: "bg-red-500/10" },
  "trust-economics": {
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    wash: "bg-emerald-500/10",
  },
  "regenerative-proof": {
    border: "border-amber-500/30",
    text: "text-amber-400",
    wash: "bg-amber-500/10",
  },
  "founder-track-record": {
    border: "border-violet-500/30",
    text: "text-violet-400",
    wash: "bg-violet-500/10",
  },
  "market-intelligence": {
    border: "border-blue-500/30",
    text: "text-blue-400",
    wash: "bg-blue-500/10",
  },
  "culture-decay": { border: "border-rose-500/30", text: "text-rose-400", wash: "bg-rose-500/10" },
};
const DEFAULT_ACCENT = {
  border: "border-brand-gold/30",
  text: "text-brand-gold-light",
  wash: "bg-brand-gold/10",
};

const TABS = [
  { id: "threads", label: "Thesis Threads" },
  { id: "sections", label: "Section Map" },
  { id: "research", label: "Research Library" },
  { id: "rules", label: "Content Rules" },
] as const;

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 ${className}`}>{children}</div>
  );
}

function ThreadCard({
  thread,
  count,
  isActive,
  onClick,
}: {
  thread: ThesisThread;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const accent = THREAD_ACCENT[thread.id] ?? DEFAULT_ACCENT;
  return (
    <button onClick={onClick} className="block w-full text-left">
      <GlassCard
        className={`p-5 transition-colors ${isActive ? `${accent.border} ${accent.wash}` : "hover:border-white/20"}`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className={`font-mono text-xs uppercase tracking-widest ${accent.text}`}>
            {count} article{count === 1 ? "" : "s"}
          </span>
          {isActive && (
            <span className={`size-2 rounded-full ${accent.text.replace("text-", "bg-")}`} />
          )}
        </div>
        <h3 className="mb-1 font-heading text-lg text-white/95">{thread.title}</h3>
        <p className="text-sm leading-relaxed text-white/60 italic">{thread.tagline}</p>
      </GlassCard>
    </button>
  );
}

function ArticleRow({ post }: { post: ArchivePost }) {
  const connector = THESIS_CONNECTORS[post.slug];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block rounded-xl border border-white/5 p-4 transition-colors hover:border-brand-gold/30 hover:bg-white/5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h4 className="font-medium leading-snug text-white/90">{post.title}</h4>
          <div className="mt-1.5 flex items-center gap-3">
            {post.category && (
              <span className="font-mono text-xs tracking-wide text-white/45">
                {post.category.title}
              </span>
            )}
            <span className="text-xs text-white/35">{formatDate(post.publishedAt)}</span>
          </div>
          {connector && (
            <p className="mt-2 text-xs leading-relaxed text-brand-gold-light/80 italic">
              Thesis: {connector}
            </p>
          )}
        </div>
        <span className="mt-1 shrink-0 text-sm text-white/35">
          <ForwardIcon aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function ThesisThreadsExplorer({ posts }: { posts: ArchivePost[] }) {
  const [activeThreadId, setActiveThreadId] = useState(THESIS_THREADS[0].id);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("threads");

  const postBySlug = useMemo(() => new Map(posts.map((p) => [p.slug, p])), [posts]);

  const threadArticles = useMemo(
    () =>
      THESIS_THREADS.map((thread) => ({
        thread,
        posts: thread.articleSlugs
          .map((slug) => postBySlug.get(slug))
          .filter((p): p is ArchivePost => Boolean(p)),
      })),
    [postBySlug],
  );

  const unthreaded = useMemo(() => {
    const threadedSlugs = new Set(THESIS_THREADS.flatMap((t) => t.articleSlugs));
    return posts.filter((p) => !threadedSlugs.has(p.slug));
  }, [posts]);

  const totalThreaded = threadArticles.reduce((sum, t) => sum + t.posts.length, 0);
  const current = threadArticles.find((t) => t.thread.id === activeThreadId)!;

  return (
    <div className="bg-[#0A0A10] text-white/90">
      {/* Hero */}
      <div className="mx-auto max-w-5xl px-6 pt-16 pb-12 sm:px-10">
        <p className="mb-4 font-mono text-xs tracking-[0.3em] text-brand-gold uppercase">
          Content Intelligence
        </p>
        <h1 className="mb-4 font-heading text-4xl leading-tight text-white/95 sm:text-6xl">
          The Thesis <span className="text-brand-gold-light italic">Threads</span>
        </h1>
        <p className="mb-8 max-w-2xl leading-relaxed text-white/60">{CORE_THESIS.statement}</p>

        <div className="flex flex-wrap gap-6">
          {[
            { n: posts.length, l: "Essays" },
            { n: THESIS_THREADS.length, l: "Thesis Threads" },
            { n: totalThreaded, l: "Mapped" },
            { n: unthreaded.length, l: "Unmapped" },
            { n: RESEARCH_LIBRARY.length, l: "Citations" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-heading text-2xl text-brand-gold-light">{s.n}</div>
              <div className="font-mono text-xs tracking-wider text-white/45 uppercase">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0A0A10]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-6 sm:px-10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`border-b-2 px-4 py-3.5 font-mono text-xs tracking-wide whitespace-nowrap uppercase ${
                tab === t.id
                  ? "border-brand-gold text-brand-gold-light"
                  : "border-transparent text-white/45 hover:text-white/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
        {tab === "threads" && (
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="space-y-3">
              {threadArticles.map(({ thread, posts: p }) => (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  count={p.length}
                  isActive={activeThreadId === thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                />
              ))}
            </div>

            <div>
              <GlassCard className="mb-6 p-6">
                <h2 className="mb-2 font-heading text-2xl text-white/95">{current.thread.title}</h2>
                <p className="mb-3 text-sm text-brand-gold-light italic">
                  {current.thread.tagline}
                </p>
                <p className="text-sm leading-relaxed text-white/65">
                  {current.thread.description}
                </p>
              </GlassCard>

              <div className="space-y-1">
                {current.posts.map((post) => (
                  <ArticleRow key={post.slug} post={post} />
                ))}
                {current.posts.length === 0 && (
                  <p className="py-8 text-center text-sm text-white/40 italic">
                    No articles mapped to this thread yet.
                  </p>
                )}
              </div>

              {unthreaded.length > 0 && (
                <div className="mt-12">
                  <h3 className="mb-4 font-heading text-lg text-white/70">
                    Unmapped Articles ({unthreaded.length})
                  </h3>
                  <p className="mb-4 text-xs text-white/45">
                    These articles haven&apos;t been assigned to a thesis thread yet. Each one needs
                    at least one sentence connecting it to the extractive-vs-regenerative thesis.
                  </p>
                  <div className="space-y-1 opacity-60">
                    {unthreaded.slice(0, 20).map((post) => (
                      <ArticleRow key={post.slug} post={post} />
                    ))}
                    {unthreaded.length > 20 && (
                      <p className="py-4 text-center text-xs text-white/35">
                        + {unthreaded.length - 20} more unmapped articles
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "sections" && (
          <div>
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-white/55">
              Each section of the site maps to a specific facet of the thesis. The anchor content,
              data points, and tone are calibrated to serve that facet while maintaining the
              site-wide voice.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {SECTION_THESIS_MAP.map((section) => (
                <GlassCard key={section.slug} className="p-6">
                  <h3 className="mb-1 font-heading text-lg text-white/95">{section.title}</h3>
                  <p className="mb-3 font-mono text-xs tracking-widest text-brand-gold-light/80 uppercase">
                    {section.mapsTo}
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-white/65">
                    {section.impactSoulConnection}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {section.dataPoints.map((dp) => (
                      <span
                        key={dp}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/50"
                      >
                        {dp}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-white/40 italic">Tone: {section.tone}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {tab === "research" && (
          <div>
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-white/55">
              The research library. Cite as needed. Every article should include at least one
              external data point or research citation.
            </p>
            <div className="space-y-4">
              {RESEARCH_LIBRARY.map((cite, i) => (
                <GlassCard key={`${cite.author}-${cite.year}`} className="p-5">
                  <div className="flex items-start gap-4">
                    <span className="font-heading text-2xl leading-none text-brand-gold-light/40">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-white/90">
                        {cite.author} ({cite.year})
                      </h4>
                      <p className="text-sm text-white/70 italic">&ldquo;{cite.title}&rdquo;</p>
                      <p className="mt-1 text-xs text-white/45">{cite.publisher}</p>
                      <p className="mt-2 text-xs text-brand-gold-light/70">
                        Relevance: {cite.relevance}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            <h3 className="mt-12 mb-6 font-heading text-xl text-white/85">LP Comparables</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {LP_COMPARABLES.map((comp) => (
                <GlassCard
                  key={comp.name}
                  className={`p-5 ${comp.name === "ABITs (ImpactSoul)" ? "border-brand-gold/30" : ""}`}
                >
                  <h4 className="mb-1 font-medium text-white/90">{comp.name}</h4>
                  <p className="text-sm text-white/55">{comp.model}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-brand-gold-light/80">
                      {comp.entryPoint}
                    </span>
                    <span className="max-w-[60%] text-right text-xs text-white/40 italic">
                      {comp.limitation}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {tab === "rules" && (
          <div className="max-w-2xl">
            <GlassCard className="mb-8 p-8">
              <h3 className="mb-4 font-heading text-xl text-white/95">Voice</h3>
              <p className="mb-3 text-sm leading-relaxed text-white/65">
                {CORE_THESIS.authorVoice}
              </p>
              <p className="text-sm text-brand-gold-light/80 italic">{CORE_THESIS.toneRule}</p>
            </GlassCard>

            <h3 className="mb-4 font-heading text-lg text-white/85">Content Rules</h3>
            <div className="space-y-3">
              {Object.entries(CONTENT_RULES).map(([key, rule]) => (
                <GlassCard key={key} className="p-4">
                  <span className="mb-1 block font-mono text-xs tracking-wider text-brand-gold-light/60 uppercase">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <p className="text-sm leading-relaxed text-white/70">{rule}</p>
                </GlassCard>
              ))}
            </div>

            <h3 className="mt-8 mb-4 font-heading text-lg text-white/85">Never Use</h3>
            <GlassCard className="p-5">
              <div className="flex flex-wrap gap-2">
                {NEVER_USE.map((word) => (
                  <span
                    key={word}
                    className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 line-through"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 py-12 text-center">
        <p className="font-mono text-xs tracking-widest text-white/30 uppercase">
          {CORE_THESIS.shortForm}
        </p>
      </div>
    </div>
  );
}
