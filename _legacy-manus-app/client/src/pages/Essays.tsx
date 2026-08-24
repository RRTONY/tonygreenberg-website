import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ARCHETYPES, AUTHORITY_ITEMS, type ArchetypeKey } from "@/data/archetypes";
import blogData from "@/data/blogData.json";
import SEO from "@/components/SEO";

interface Post { slug: string; title: string; excerpt: string; category: string; heroImage?: string; readTime?: string; }

const ARCHETYPE_FILTERS: { key: ArchetypeKey | "all"; label: string }[] = [
  { key: "all", label: "All Paths" },
  { key: "builder", label: "Builder" },
  { key: "crusader", label: "Crusader" },
  { key: "investor", label: "Investor" },
];

export default function Essays() {
  const [search, setSearch] = useState("");
  const [archFilter, setArchFilter] = useState<ArchetypeKey | "all">("all");
  const [catFilter, setCatFilter] = useState("all");

  const allPosts = blogData as Post[];
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allPosts.forEach((p) => cats.add(p.category));
    return Array.from(cats).sort();
  }, [allPosts]);

  const filtered = useMemo(() => {
    let result = allPosts;
    if (archFilter !== "all") {
      const arch = ARCHETYPES[archFilter];
      result = result.filter((p) => arch.categories.includes(p.category));
    }
    if (catFilter !== "all") {
      result = result.filter((p) => p.category === catFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allPosts, archFilter, catFilter, search]);

  return (
    <>
    <SEO
        title="Essays by Tony Greenberg"
        description="118 essays on enterprise technology, psychedelic medicine, regenerative capital, and the systems that need to change."
        path="/essays"
        keywords="Tony Greenberg, essays, Tony Greenberg, systems thinking"
        indexable={true}
      />
      <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <div style={{ background: "#1A1A1A", padding: "10px 0", textAlign: "center", letterSpacing: "0.15em", fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#D4B96A" }}>
        {AUTHORITY_ITEMS.join("  ·  ")}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 120px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", color: "#111", marginBottom: 8, textAlign: "center" }}>Essays</h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 16, color: "#555", textAlign: "center", marginBottom: 32 }}>{allPosts.length} essays · 15 years · Zero algorithm</p>

        {/* Search */}
        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search essays..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", border: "1px solid #D4C9A8", borderRadius: 6, fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, background: "#fff", color: "#222" }}
          />
        </div>

        {/* Archetype filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {ARCHETYPE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setArchFilter(f.key)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                border: archFilter === f.key ? "2px solid #8B6914" : "1px solid #D4C9A8",
                background: archFilter === f.key ? "#8B6914" : "#fff",
                color: archFilter === f.key ? "#fff" : "#333",
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          <button
            onClick={() => setCatFilter("all")}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: "none",
              background: catFilter === "all" ? "#333" : "transparent",
              color: catFilter === "all" ? "#fff" : "#555",
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              style={{
                padding: "6px 12px",
                borderRadius: 4,
                border: "none",
                background: catFilter === cat ? "#333" : "transparent",
                color: catFilter === cat ? "#fff" : "#555",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#888", marginBottom: 20 }}>
          {filtered.length} essay{filtered.length !== 1 ? "s" : ""}
        </div>

        {/* Essay list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ display: "flex", gap: 16, background: "#fff", border: "1px solid #E8E4DA", borderRadius: 8, padding: 16, textDecoration: "none", transition: "border-color 0.2s" }}
            >
              {post.heroImage && <img src={post.heroImage} alt="" sizes="72px" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} loading="lazy" />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#8B6914", textTransform: "uppercase", marginBottom: 4 }}>{post.category}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#111", lineHeight: 1.3, marginBottom: 4 }}>{post.title}</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: "#555", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 16, color: "#888" }}>No essays match your filters.</p>
          </div>
        )}
      </div>
    </div>
    </>);
}
