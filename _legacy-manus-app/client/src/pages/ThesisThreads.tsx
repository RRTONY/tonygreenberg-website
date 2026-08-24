/**
 * THESIS THREADS — Newsletter Content Layer
 * 
 * Curates all 109 articles by thesis thread, showing how every piece
 * connects to the extractive-vs-regenerative thesis. This is the
 * editorial dashboard for newsletter curation and the reader's
 * guided journey through the intellectual foundation.
 */

import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  CORE_THESIS,
  THESIS_THREADS,
  SECTION_THESIS_MAP,
  RESEARCH_LIBRARY,
  LP_COMPARABLES,
  CONTENT_RULES,
  THESIS_CONNECTORS,
  type ThesisThread,
} from "@/data/sitePrompt";
import blogData from "@/data/blogData.json";
import SEO from "@/components/SEO";

/* ── tiny helpers ─────────────────────────────────────────────────── */

const articles = (blogData as any[]).filter(
  (a) => a.slug && a.title && a.category
);

function getArticlesForThread(thread: ThesisThread) {
  return thread.articleSlugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean);
}

function getUnthreadedArticles() {
  const allThreadedSlugs = new Set(
    THESIS_THREADS.flatMap((t) => t.articleSlugs)
  );
  return articles.filter((a) => !allThreadedSlugs.has(a.slug));
}

/* ── floating particles (reused pattern) ─────────────────────────── */

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        dur: 6 + Math.random() * 6,
        size: 2 + Math.random() * 3,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    []
  );
  return (
<div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: "-4px",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(180,140,60,${p.opacity}) 0%, transparent 70%)`,
            animation: `floatUp ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── glass card wrapper ──────────────────────────────────────────── */

function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`
        relative rounded-2xl border border-white/10
        bg-gradient-to-br from-white/8 to-white/3
        backdrop-blur-xl shadow-lg
        ${hover ? "transition-all duration-300 hover:shadow-2xl hover:border-amber-500/20 hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* ── thread card ─────────────────────────────────────────────────── */

function ThreadCard({
  thread,
  isActive,
  onClick,
}: {
  thread: ThesisThread;
  isActive: boolean;
  onClick: () => void;
}) {
  const count = getArticlesForThread(thread).length;
  const colors: Record<string, string> = {
    "opacity-tax": "from-red-500/20 to-orange-500/10",
    "trust-economics": "from-emerald-500/20 to-teal-500/10",
    "regenerative-proof": "from-amber-500/20 to-yellow-500/10",
    "founder-track-record": "from-violet-500/20 to-purple-500/10",
    "market-intelligence": "from-blue-500/20 to-cyan-500/10",
    "culture-decay": "from-rose-500/20 to-pink-500/10",
  };
  const accents: Record<string, string> = {
    "opacity-tax": "text-red-400",
    "trust-economics": "text-emerald-400",
    "regenerative-proof": "text-amber-400",
    "founder-track-record": "text-violet-400",
    "market-intelligence": "text-blue-400",
    "culture-decay": "text-rose-400",
  };

  return (
    <button onClick={onClick} className="text-left w-full group">
      <GlassCard
        className={`p-5 ${isActive ? "ring-2 ring-amber-500/40 border-amber-500/30" : ""}`}
      >
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors[thread.id] || "from-white/5 to-white/2"} opacity-60`}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-mono tracking-widest uppercase ${accents[thread.id] || "text-amber-400"}`}
            >
              {count} articles
            </span>
            {isActive && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>
          <h3 className="text-lg font-serif text-stone-100 mb-1 group-hover:text-amber-200 transition-colors">
            {thread.title}
          </h3>
          <p className="text-sm text-stone-400 italic leading-relaxed">
            {thread.tagline}
          </p>
        </div>
      </GlassCard>
    </button>
  );
}

/* ── article row ─────────────────────────────────────────────────── */

function ArticleRow({ article }: { article: any }) {
  const connector = THESIS_CONNECTORS[article.slug];
  return (
    <Link href={`/read/${article.slug}`}>
      <div className="group p-4 rounded-xl border border-white/5 hover:border-amber-500/20 hover:bg-white/5 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-stone-200 font-medium group-hover:text-amber-200 transition-colors leading-snug">
              {article.title}
            </h4>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs font-mono text-stone-500 tracking-wide">
                {article.category}
              </span>
              {article.date && (
                <span className="text-xs text-stone-600">
                  {article.date}
                </span>
              )}
            </div>
            {connector && (
              <p className="mt-2 text-xs text-amber-500/70 italic leading-relaxed">
                Thesis: {connector}
              </p>
            )}
          </div>
          <span className="text-stone-600 group-hover:text-amber-400 transition-colors text-sm mt-1 shrink-0">
            &#8594;
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── section thesis card ─────────────────────────────────────────── */

function SectionThesisCard({
  section,
}: {
  section: (typeof SECTION_THESIS_MAP)[0];
}) {
  return (
    <GlassCard className="p-6" hover={false}>
      <h3 className="text-lg font-serif text-stone-100 mb-1">
        {section.title}
      </h3>
      <p className="text-xs font-mono text-amber-400/70 tracking-widest uppercase mb-3">
        {section.mapsTo}
      </p>
      <p className="text-sm text-stone-300 leading-relaxed mb-4">
        {section.impactSoulConnection}
      </p>
      <div className="flex flex-wrap gap-2">
        {section.dataPoints.map((dp, i) => (
          <span
            key={i}
            className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-400"
          >
            {dp}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-stone-500 italic">
        Tone: {section.tone}
      </p>
    </GlassCard>
  );
}

/* ── main component ──────────────────────────────────────────────── */

export default function ThesisThreads() {
  const [activeThread, setActiveThread] = useState<string>(
    THESIS_THREADS[0].id
  );
  const [tab, setTab] = useState<
    "threads" | "sections" | "research" | "rules"
  >("threads");
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentThread = THESIS_THREADS.find((t) => t.id === activeThread)!;
  const threadArticles = getArticlesForThread(currentThread);
  const unthreaded = getUnthreadedArticles();

  const totalThreaded = THESIS_THREADS.reduce(
    (sum, t) => sum + getArticlesForThread(t).length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100">
      <SEO
        title="Thesis Threads"
        description="The connective tissue between Tony Greenberg's essays — recurring themes, arguments, and intellectual threads."
        path="/thesis-threads"
        keywords="Tony Greenberg, thesis, intellectual framework, Tony Greenberg essays"
        indexable={true}
      />
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80")',
            transform: `translateY(${scrollY * 0.3}px)`,
            filter: "brightness(0.3) saturate(0.8)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950" />
        <Particles />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
          <p className="text-xs font-mono tracking-[0.3em] text-amber-400/70 uppercase mb-4">
            Content Intelligence
          </p>
          <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-4">
            The Thesis{" "}
            <span className="italic text-amber-300">Threads</span>
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl leading-relaxed mb-8">
            {CORE_THESIS.statement}
          </p>

          {/* stats strip */}
          <div className="flex flex-wrap gap-6">
            {[
              { n: articles.length, l: "Essays" },
              { n: THESIS_THREADS.length, l: "Thesis Threads" },
              { n: totalThreaded, l: "Mapped" },
              { n: unthreaded.length, l: "Unmapped" },
              { n: RESEARCH_LIBRARY.length, l: "Citations" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-serif text-amber-300">
                  {s.n}
                </div>
                <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB BAR ───────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-stone-950/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {(
            [
              { id: "threads", label: "Thesis Threads" },
              { id: "sections", label: "Section Map" },
              { id: "research", label: "Research Library" },
              { id: "rules", label: "Content Rules" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-mono tracking-wide transition-colors whitespace-nowrap border-b-2 ${
                tab === t.id
                  ? "border-amber-400 text-amber-300"
                  : "border-transparent text-stone-500 hover:text-stone-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* THREADS TAB */}
        {tab === "threads" && (
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* thread selector */}
            <div className="space-y-3">
              {THESIS_THREADS.map((thread) => (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  isActive={activeThread === thread.id}
                  onClick={() => setActiveThread(thread.id)}
                />
              ))}
            </div>

            {/* thread detail */}
            <div>
              <GlassCard className="p-6 mb-6" hover={false}>
                <h2 className="text-2xl font-serif text-stone-100 mb-2">
                  {currentThread.title}
                </h2>
                <p className="text-amber-400/80 italic text-sm mb-3">
                  {currentThread.tagline}
                </p>
                <p className="text-stone-300 leading-relaxed text-sm">
                  {currentThread.description}
                </p>
              </GlassCard>

              <div className="space-y-1">
                {threadArticles.map((article: any) => (
                  <ArticleRow key={article.slug} article={article} />
                ))}
                {threadArticles.length === 0 && (
                  <p className="text-stone-500 text-sm italic py-8 text-center">
                    No articles mapped to this thread yet.
                  </p>
                )}
              </div>

              {/* unthreaded articles */}
              {unthreaded.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-serif text-stone-400 mb-4">
                    Unmapped Articles ({unthreaded.length})
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    These articles haven't been assigned to a thesis thread
                    yet. Each one needs at least one sentence connecting it
                    to the extractive-vs-regenerative thesis.
                  </p>
                  <div className="space-y-1 opacity-60">
                    {unthreaded.slice(0, 20).map((article: any) => (
                      <ArticleRow key={article.slug} article={article} />
                    ))}
                    {unthreaded.length > 20 && (
                      <p className="text-stone-600 text-xs text-center py-4">
                        + {unthreaded.length - 20} more unmapped articles
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTIONS TAB */}
        {tab === "sections" && (
          <div>
            <p className="text-stone-400 text-sm leading-relaxed mb-8 max-w-2xl">
              Each section of the site maps to a specific facet of the
              thesis. The anchor content, data points, and tone are
              calibrated to serve that facet while maintaining the
              site-wide voice.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {SECTION_THESIS_MAP.map((section) => (
                <SectionThesisCard key={section.slug} section={section} />
              ))}
            </div>
          </div>
        )}

        {/* RESEARCH TAB */}
        {tab === "research" && (
          <div>
            <p className="text-stone-400 text-sm leading-relaxed mb-8 max-w-2xl">
              The research library. Cite as needed. Every article should
              include at least one external data point or research
              citation.
            </p>
            <div className="space-y-4">
              {RESEARCH_LIBRARY.map((cite, i) => (
                <GlassCard key={i} className="p-5" hover={false}>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-serif text-amber-400/40 leading-none mt-1">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="text-stone-200 font-medium">
                        {cite.author} ({cite.year})
                      </h4>
                      <p className="text-stone-300 italic text-sm">
                        "{cite.title}"
                      </p>
                      <p className="text-stone-500 text-xs mt-1">
                        {cite.publisher}
                      </p>
                      <p className="text-amber-400/60 text-xs mt-2">
                        Relevance: {cite.relevance}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* LP Comparables */}
            <h3 className="text-xl font-serif text-stone-200 mt-12 mb-6">
              LP Comparables
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {LP_COMPARABLES.map((comp, i) => (
                <GlassCard
                  key={i}
                  className={`p-5 ${comp.name === "ABITs (ImpactSoul)" ? "ring-1 ring-amber-500/30" : ""}`}
                  hover={false}
                >
                  <h4 className="text-stone-200 font-medium mb-1">
                    {comp.name}
                  </h4>
                  <p className="text-sm text-stone-400">{comp.model}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-amber-400/70 font-mono">
                      {comp.entryPoint}
                    </span>
                    <span className="text-xs text-stone-500 italic max-w-[60%] text-right">
                      {comp.limitation}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* RULES TAB */}
        {tab === "rules" && (
          <div className="max-w-2xl">
            <GlassCard className="p-8 mb-8" hover={false}>
              <h3 className="text-xl font-serif text-stone-100 mb-4">
                Voice
              </h3>
              <p className="text-stone-300 leading-relaxed text-sm mb-3">
                {CORE_THESIS.authorVoice}
              </p>
              <p className="text-amber-400/70 italic text-sm">
                {CORE_THESIS.toneRule}
              </p>
            </GlassCard>

            <h3 className="text-lg font-serif text-stone-200 mb-4">
              Content Rules
            </h3>
            <div className="space-y-3">
              {Object.entries(CONTENT_RULES).map(([key, rule]) => (
                <GlassCard key={key} className="p-4" hover={false}>
                  <span className="text-xs font-mono text-amber-400/50 tracking-wider uppercase block mb-1">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    {rule}
                  </p>
                </GlassCard>
              ))}
            </div>

            <h3 className="text-lg font-serif text-stone-200 mt-8 mb-4">
              Never Use
            </h3>
            <GlassCard className="p-5" hover={false}>
              <div className="flex flex-wrap gap-2">
                {[
                  "synergy",
                  "leverage (as verb)",
                  "disrupt (as adjective)",
                  "passionate about",
                  "at the end of the day",
                  "I AM",
                ].map((word) => (
                  <span
                    key={word}
                    className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 line-through"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* ── FOOTER MOTIF ──────────────────────────────────────────── */}
      <div className="border-t border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-stone-600 text-xs font-mono tracking-widest uppercase">
            {CORE_THESIS.shortForm}
          </p>
        </div>
      </div>
    </div>
  );
}
