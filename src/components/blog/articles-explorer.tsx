"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Shuffle } from "lucide-react";
import {
  START_HERE_SLUGS,
  CONTRARIAN_SLUGS,
  CHANGED_MIND_SLUGS,
  SHORT_READ_SLUGS,
  DEEP_DIVE_SLUGS,
  DISCOVERY_MODES,
  CATEGORY_ORDER,
  CATEGORY_DESCRIPTIONS,
} from "@/lib/content/articles-discovery";

export type ArchivePost = {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  tags?: string[];
  category?: { title: string; slug: string };
};

const MODE_INTROS: Record<string, string> = {
  "Start Here":
    "Seven essays that reveal the worldview connecting everything else on this site. Start anywhere. They're ordered by how often first-time readers come back for more.",
  Contrarian:
    "Essays that argue against the consensus. Some of these turned out to be right. Some are still being tested. All of them are worth the argument.",
  "Changed His Mind":
    "Intellectual honesty is more interesting than consistency. These are essays where Tony publicly updated his position, changed his mind, or admitted he got something wrong.",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ArticleList({ posts }: { posts: ArchivePost[] }) {
  return (
    <ul className="list-none p-0">
      {posts.map((post) => (
        <li key={post.slug} className="border-b border-border py-3.5">
          <div className="flex flex-wrap items-start gap-4">
            <span className="min-w-22 pt-0.5 font-mono text-xs whitespace-nowrap text-muted-foreground">
              {formatDate(post.publishedAt)}
            </span>
            <div className="min-w-50 flex-1">
              <Link href={`/blog/${post.slug}`} className="block font-heading text-base font-semibold text-foreground hover:text-brand-gold">
                {post.title}
              </Link>
              {post.subtitle && <span className="mt-0.5 block text-sm text-muted-foreground">{post.subtitle}</span>}
            </div>
            {post.category && (
              <span className="self-center rounded-sm bg-brand-gold/8 px-2.5 py-1 font-mono text-[0.65rem] tracking-wide whitespace-nowrap text-brand-gold uppercase">
                {post.category.title}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ArticlesExplorer({ posts }: { posts: ArchivePost[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMode, setActiveMode] = useState("All");
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category?.title).filter((c): c is string => Boolean(c)));
    return CATEGORY_ORDER.filter((c) => cats.has(c));
  }, [posts]);

  const handleModeChange = useCallback((mode: string) => {
    setActiveMode(mode);
    setActiveCategory("All");
    setSearch("");
    if (mode === "Surprise Me") setShuffleSeed(Math.random());
  }, []);

  const modeFiltered = useMemo(() => {
    switch (activeMode) {
      case "Start Here":
        return posts.filter((p) => START_HERE_SLUGS.includes(p.slug));
      case "Contrarian":
        return posts.filter((p) => CONTRARIAN_SLUGS.includes(p.slug));
      case "Changed His Mind":
        return posts.filter((p) => CHANGED_MIND_SLUGS.includes(p.slug));
      case "Short Reads":
        return posts.filter((p) => SHORT_READ_SLUGS.includes(p.slug));
      case "Deep Dives":
        return posts.filter((p) => DEEP_DIVE_SLUGS.includes(p.slug));
      case "Surprise Me":
        return [...posts].sort(() => Math.sin(shuffleSeed * 9301 + 1) - 0.5).slice(0, 7);
      default:
        return null;
    }
  }, [activeMode, posts, shuffleSeed]);

  const filtered = useMemo(() => {
    if (modeFiltered) return modeFiltered;
    let result = [...posts];
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category?.title === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt ?? "").toLowerCase().includes(q) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
          (p.category?.title ?? "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [modeFiltered, posts, activeCategory, search]);

  const grouped = useMemo(() => {
    if (activeCategory !== "All" || search.trim() || activeMode !== "All") return null;
    const map: Record<string, ArchivePost[]> = {};
    for (const cat of CATEGORY_ORDER) {
      const catPosts = posts.filter((p) => p.category?.title === cat);
      if (catPosts.length) map[cat] = catPosts;
    }
    return map;
  }, [posts, activeCategory, search, activeMode]);

  const isFiltering = search.trim() || activeCategory !== "All" || activeMode !== "All";

  return (
    <div>
      {/* Dark section — discovery modes + search, matching the legacy
          header's own background rather than the light content area below. */}
      <div className="bg-[#0A0A10] px-6 pb-10 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex flex-wrap gap-2">
            {DISCOVERY_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                className={`flex flex-col items-start gap-0.5 rounded-sm border px-3.5 py-2 font-mono text-xs tracking-wide ${
                  activeMode === mode.id
                    ? "border-brand-gold bg-brand-gold text-[#0A0A10]"
                    : "border-brand-gold/25 bg-white/8 text-white/70"
                }`}
              >
                <span className="uppercase">{mode.label}</span>
                {"desc" in mode && <span className="text-[0.58rem] opacity-70">{mode.desc}</span>}
              </button>
            ))}
          </div>

          <input
            type="search"
            placeholder="Search articles, topics, or keywords…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg rounded-sm border border-brand-gold/30 bg-white/7 px-5 py-3 text-white/90 outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Light section — category tabs + content, matching the legacy
          body's light background. */}
      <div className={`overflow-x-auto border-b border-border bg-secondary px-6 sm:px-10 ${activeMode !== "All" ? "hidden" : ""}`}>
        <div className="mx-auto flex max-w-3xl gap-0 whitespace-nowrap">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`border-b-2 px-4 py-3.5 font-mono text-xs tracking-wide uppercase ${
                activeCategory === cat ? "border-brand-gold text-brand-gold" : "border-transparent text-muted-foreground"
              }`}
            >
              {cat === "All" ? `All (${posts.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        {MODE_INTROS[activeMode] && (
          <div className="mb-8 rounded-sm border-l-2 border-brand-gold bg-brand-gold/6 px-6 py-5">
            <p className="leading-relaxed text-foreground/80">{MODE_INTROS[activeMode]}</p>
          </div>
        )}
        {activeMode === "Surprise Me" && (
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <p className="flex-1 leading-relaxed text-foreground/80">
              Seven random essays. Serendipity is part of the product.
            </p>
            <button
              onClick={() => setShuffleSeed(Math.random())}
              className="flex items-center gap-1.5 rounded-sm bg-brand-gold px-4 py-2 font-mono text-xs tracking-wide text-white"
            >
              <Shuffle className="size-3.5" />
              Shuffle Again
            </button>
          </div>
        )}

        {isFiltering ? (
          <div>
            <div className="mb-6 font-mono text-xs tracking-wide text-muted-foreground uppercase">
              {activeMode !== "All" ? `${filtered.length} essays` : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
              {search.trim() ? ` for "${search}"` : ""}
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
            </div>
            <ArticleList posts={filtered} />
          </div>
        ) : (
          <div>
            {CATEGORY_ORDER.filter((cat) => grouped?.[cat]).map((cat) => (
              <div key={cat} className="mb-12">
                <div className="mb-2 flex items-baseline gap-4 border-b border-brand-gold/15 pb-3">
                  <h2 className="font-heading text-xl font-bold text-foreground">{cat}</h2>
                  <span className="font-mono text-xs tracking-wide text-muted-foreground">{grouped![cat].length} essays</span>
                </div>
                {CATEGORY_DESCRIPTIONS[cat] && (
                  <p className="mt-0 mb-5 leading-relaxed text-muted-foreground">{CATEGORY_DESCRIPTIONS[cat]}</p>
                )}
                <ArticleList posts={grouped![cat]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
