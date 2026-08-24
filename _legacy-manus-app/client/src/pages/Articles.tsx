/*
 * Articles — Complete Archive
 * Public article archive at /articles
 * All 119+ essays, grouped by category, with dates and canonical links.
 * Optimised for search engine and AI crawler discovery.
 */

import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import blogData from "@/data/blogData.json";
import SEO from "@/components/SEO";

type Post = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  category: string;
  summary?: string;
  tags?: string[];
};

const posts = blogData as Post[];

// ── Discovery Mode Curations ──
const START_HERE_SLUGS = [
  "when-healing-becomes-extraction",
  "energy-is-money-money-is-memory",
  "your-blood-lies-without-your-dna",
  "you-are-the-moat",
  "the-password-is-killing-you",
  "five-cups",
  "the-1000-hour-hold",
];
const CONTRARIAN_SLUGS = [
  "five-cups",
  "marc-andreessen-rebuttal-2020",
  "when-healing-becomes-extraction",
  "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
  "california-toll-roads-legalized-scam",
  "psychedelics-could-become-extractive-capitalism-unless",
  "truth-bias-mutually-exclusive",
  "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine",
];
const CHANGED_MIND_SLUGS = [
  "marc-andreessen-rebuttal-2020",
  "eco-vegan-realities-seriesethical-economic",
  "the-tug-of-war-ethical-vs-economic-decisions",
  "enterprise-blockchain-can-big-business-co-opt-an-existing-technology",
];
const SHORT_READ_SLUGS = [
  "truth-bias-mutually-exclusive",
  "marc-andreessen-rebuttal-2020",
  "the-decay-of-modern-day-communication",
  "eco-vegan-realities-seriesethical-economic",
  "the-tug-of-war-ethical-vs-economic-decisions",
  "building-services-market-transhuman-era",
  "an-ode-to-kusaki-where-plants-become-culinary-art",
];
const DEEP_DIVE_SLUGS = [
  "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
  "is-that-a-lot-clarisse-abelarde",
  "you-are-the-moat",
  "your-blood-lies-without-your-dna",
  "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
  "the-password-is-killing-you",
  "when-healing-becomes-extraction",
  "five-cups",
];

const DISCOVERY_MODES = [
  { id: "All", label: "All Essays", desc: `${posts.length} pieces` },
  { id: "Start Here", label: "Start Here", desc: "7 foundational" },
  { id: "Short Reads", label: "Short Reads", desc: "Under 5 min" },
  { id: "Deep Dives", label: "Deep Dives", desc: "Long-form" },
  { id: "Contrarian", label: "Contrarian", desc: "Uncomfortable truths" },
  { id: "Changed His Mind", label: "Changed His Mind", desc: "Intellectual honesty" },
  { id: "Surprise Me", label: "Surprise Me", desc: "Random" },
];

const CATEGORY_ORDER = [
  "Psychedelic Medicine",
  "Systems & Innovation",
  "Business & Capital",
  "Conscious Capital",
  "Impact & Purpose",
  "Culture & Communication",
  "Living Well",
  "The Crusades",
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Psychedelic Medicine": "Consciousness, therapeutic frontiers, and the science of healing.",
  "Systems & Innovation": "Technology, AI, infrastructure, and the architecture of change.",
  "Business & Capital": "Enterprise strategy, procurement, and the economics of trust.",
  "Conscious Capital": "Impact investing, regenerative business, and capitalism reimagined.",
  "Impact & Purpose": "Social change, mission-driven work, and the long game.",
  "Culture & Communication": "Media, language, society, and the stories we tell.",
  "Living Well": "Health, longevity, performance, and the examined life.",
  "The Crusades": "Accountability, advocacy, and the things worth fighting for.",
};

function parseDate(dateStr: string): Date {
  try {
    return new Date(dateStr);
  } catch {
    return new Date(0);
  }
}

export default function Articles() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeMode, setActiveMode] = useState<string>("All");
  const [randomSeed, setRandomSeed] = useState(0);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map(p => p.category))).filter(Boolean);
    return CATEGORY_ORDER.filter(c => cats.includes(c));
  }, []);

  const handleModeChange = useCallback((mode: string) => {
    setActiveMode(mode);
    setActiveCategory("All");
    setSearch("");
    if (mode === "Surprise Me") setRandomSeed(Math.random());
  }, []);

  const modeFiltered = useMemo(() => {
    if (activeMode === "All") return null;
    if (activeMode === "Start Here") return posts.filter(p => START_HERE_SLUGS.includes(p.slug));
    if (activeMode === "Contrarian") return posts.filter(p => CONTRARIAN_SLUGS.includes(p.slug));
    if (activeMode === "Changed His Mind") return posts.filter(p => CHANGED_MIND_SLUGS.includes(p.slug));
    if (activeMode === "Short Reads") return posts.filter(p => SHORT_READ_SLUGS.includes(p.slug));
    if (activeMode === "Deep Dives") return posts.filter(p => DEEP_DIVE_SLUGS.includes(p.slug));
    if (activeMode === "Surprise Me") {
      const shuffled = [...posts].sort(() => Math.sin(randomSeed * posts.indexOf(posts[0]) + 1) - 0.5);
      return shuffled.slice(0, 7);
    }
    return null;
  }, [activeMode, randomSeed]);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (modeFiltered) return modeFiltered;
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.summary || "").toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    if (activeCategory !== "All" || search.trim() || activeMode !== "All") return null;
    const map: Record<string, Post[]> = {};
    for (const cat of CATEGORY_ORDER) {
      const catPosts = posts
        .filter(p => p.category === cat)
        .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
      if (catPosts.length) map[cat] = catPosts;
    }
    return map;
  }, [activeCategory, search]);

  return (
    <div
      style={{
        background: "#FAFAF7",
        minHeight: "100vh",
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      <SEO
        title="All Articles — Tony Greenberg"
        description="Complete archive of Tony Greenberg's 119+ published essays on enterprise technology, psychedelic medicine, impact investing, systems thinking, and conscious capitalism."
        path="/articles"
        keywords="Tony Greenberg articles, Tony Greenberg essays, enterprise technology, psychedelic medicine, impact investing, systems thinking, conscious capitalism"
        indexable={true}
      />

      {/* ── Header ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "3rem clamp(1.5rem, 5vw, 4rem) 2.5rem",
          borderBottom: "1px solid rgba(212,185,106,0.2)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#D4B96A",
              marginBottom: "1rem",
            }}
          >
            Complete Archive
          </div>
          <h1 id="articles-heading"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
              lineHeight: 1.2,
              margin: "0 0 1rem",
            }}
          >
            All Articles
          </h1>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.55)",
              maxWidth: "600px",
              lineHeight: 1.6,
              margin: "0 0 2rem",
            }}
          >
            {posts.length} essays on enterprise technology, psychedelic medicine, impact investing,
            systems thinking, and the uncommon sense. Every piece is indexed and searchable.
          </p>
          {/* Discovery Mode Selector */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {DISCOVERY_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  padding: "0.45rem 0.9rem",
                  background: activeMode === mode.id ? "#D4B96A" : "rgba(255,255,255,0.08)",
                  border: activeMode === mode.id ? "1px solid #D4B96A" : "1px solid rgba(212,185,106,0.25)",
                  color: activeMode === mode.id ? "#0A0A10" : "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  borderRadius: "2px",
                  transition: "all 0.15s",
                  display: "flex",
                  flexDirection: "column" as const,
                  alignItems: "flex-start",
                  gap: "0.1rem",
                }}
              >
                <span style={{ textTransform: "uppercase" }}>{mode.label}</span>
                <span style={{ fontSize: "0.58rem", opacity: 0.7, letterSpacing: "0.05em" }}>{mode.desc}</span>
              </button>
            ))}
          </div>
          {/* Search */}
          <input
            type="search"
            placeholder="Search articles, topics, or keywords…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "520px",
              padding: "0.75rem 1.2rem",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(212,185,106,0.3)",
              borderRadius: "3px",
              color: "rgba(255,255,255,0.9)",
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1rem",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div
        style={{
          background: "#F0EDE4",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          overflowX: "auto",
          display: activeMode !== "All" ? "none" : undefined,
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            gap: "0",
            whiteSpace: "nowrap",
          }}
        >
          {["All", ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.9rem 1.2rem",
                background: "transparent",
                border: "none",
                borderBottom: activeCategory === cat ? "2px solid #8B6914" : "2px solid transparent",
                color: activeCategory === cat ? "#8B6914" : "#666",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {cat === "All" ? `All (${posts.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2.5rem clamp(1.5rem, 5vw, 4rem)",
        }}
      >
        {/* Discovery mode intro */}
        {activeMode === "Start Here" && (
          <div style={{ marginBottom: "2rem", padding: "1.25rem 1.5rem", background: "rgba(139,105,20,0.06)", borderLeft: "3px solid #8B6914", borderRadius: "2px" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#555", lineHeight: 1.7, margin: 0 }}>
              Seven essays that reveal the worldview connecting everything else on this site. Start anywhere. They're ordered by how often first-time readers come back for more.
            </p>
          </div>
        )}
        {activeMode === "Contrarian" && (
          <div style={{ marginBottom: "2rem", padding: "1.25rem 1.5rem", background: "rgba(139,105,20,0.06)", borderLeft: "3px solid #8B6914", borderRadius: "2px" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#555", lineHeight: 1.7, margin: 0 }}>
              Essays that argue against the consensus. Some of these turned out to be right. Some are still being tested. All of them are worth the argument.
            </p>
          </div>
        )}
        {activeMode === "Changed His Mind" && (
          <div style={{ marginBottom: "2rem", padding: "1.25rem 1.5rem", background: "rgba(139,105,20,0.06)", borderLeft: "3px solid #8B6914", borderRadius: "2px" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#555", lineHeight: 1.7, margin: 0 }}>
              Intellectual honesty is more interesting than consistency. These are essays where Tony publicly updated his position, changed his mind, or admitted he got something wrong.
            </p>
          </div>
        )}
        {activeMode === "Surprise Me" && (
          <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#555", lineHeight: 1.7, margin: 0, flex: 1 }}>
              Seven random essays. Serendipity is part of the product.
            </p>
            <button onClick={() => setRandomSeed(Math.random())} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", padding: "0.5rem 1rem", background: "#8B6914", color: "#fff", border: "none", cursor: "pointer", borderRadius: "2px" }}>
              SHUFFLE AGAIN
            </button>
          </div>
        )}
        {/* Search results or filtered list */}
        {(search.trim() || activeCategory !== "All" || activeMode !== "All") ? (
          <div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#999",
                marginBottom: "1.5rem",
              }}
            >
              {activeMode !== "All" ? `${filtered.length} essays` : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
              {search.trim() ? ` for "${search}"` : ""}
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
            </div>
            <ArticleList posts={filtered} />
          </div>
        ) : (
          /* Grouped by category */
          <div>
            {CATEGORY_ORDER.filter(cat => grouped && grouped[cat]).map(cat => (
              <div key={cat} style={{ marginBottom: "3rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1rem",
                    marginBottom: "0.5rem",
                    borderBottom: "1px solid rgba(139,105,20,0.15)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "#0A0A10",
                      margin: 0,
                    }}
                  >
                    {cat}
                  </h2>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      color: "#999",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {grouped![cat].length} essays
                  </span>
                </div>
                {CATEGORY_DESCRIPTIONS[cat] && (
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.95rem",
                      color: "#666",
                      margin: "0 0 1.2rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {CATEGORY_DESCRIPTIONS[cat]}
                  </p>
                )}
                <ArticleList posts={grouped![cat]} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer CTA ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "2.5rem clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
          marginTop: "2rem",
        }}
      >
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1rem",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "1rem",
          }}
        >
          New essays every week. Subscribe to get them first.
        </p>
        <Link
          href="/subscribe"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.1em",
            color: "#0A0A10",
            background: "#D4B96A",
            padding: "0.7rem 2rem",
            textDecoration: "none",
            borderRadius: "2px",
          }}
        >
          SUBSCRIBE
        </Link>
      </div>
    </div>
  );
}

function ArticleList({ posts }: { posts: Post[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {posts.map(post => (
        <li
          key={post.slug}
          style={{
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            padding: "0.9rem 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                color: "#999",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                paddingTop: "0.2rem",
                minWidth: "90px",
              }}
            >
              {post.date}
            </span>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <Link
                href={`/blog/${post.slug}`}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "#0A0A10",
                  textDecoration: "none",
                  lineHeight: 1.35,
                  display: "block",
                }}
              >
                {post.title}
              </Link>
              {post.subtitle && (
                <span
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.88rem",
                    color: "#666",
                    display: "block",
                    marginTop: "0.15rem",
                    lineHeight: 1.4,
                  }}
                >
                  {post.subtitle}
                </span>
              )}
            </div>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8B6914",
                background: "rgba(139,105,20,0.08)",
                padding: "0.2rem 0.6rem",
                borderRadius: "2px",
                whiteSpace: "nowrap",
                alignSelf: "center",
              }}
            >
              {post.category}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
