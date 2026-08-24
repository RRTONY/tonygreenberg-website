import { useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

/* ── Category color system ── */
const CAT_COLORS: Record<string, { bg: string; border: string; badge: string; badgeText: string }> = {
  "Start Here":            { bg: "rgba(197,162,60,0.06)", border: "rgba(197,162,60,0.18)", badge: "#C5A23C", badgeText: "#FAFAF7" },
  "The Intelligence Engine": { bg: "rgba(59,130,246,0.05)", border: "rgba(59,130,246,0.15)", badge: "#3B82F6", badgeText: "#FAFAF7" },
  "Deep Research":         { bg: "rgba(139,92,246,0.05)", border: "rgba(139,92,246,0.15)", badge: "#8B5CF6", badgeText: "#FAFAF7" },
  "Reference Library":     { bg: "rgba(16,185,129,0.05)", border: "rgba(16,185,129,0.15)", badge: "#10B981", badgeText: "#FAFAF7" },
  "Tools & Discovery":     { bg: "rgba(249,115,22,0.05)", border: "rgba(249,115,22,0.15)", badge: "#F97316", badgeText: "#FAFAF7" },
  "Guest Series":           { bg: "rgba(139,69,19,0.06)", border: "rgba(139,69,19,0.18)", badge: "#8B4513", badgeText: "#FAFAF7" },
};

/* ── Page thumbnails (emoji-based for speed, consistent visual weight) ── */
const CATEGORIES = [
  {
    title: "Start Here",
    emoji: "🚀",
    desc: "New to BrewSoul? Begin your journey.",
    pages: [
      { label: "The First Sip", path: "/brewsoul/first-sip", desc: "Why your coffee is lying to you — the essay that started it all", icon: "📜" },
      { label: "Taste Quiz", path: "/brewsoul/quiz", desc: "6 archetypes. 12 questions. Find your coffee identity.", icon: "🎯" },
      { label: "Your Prescription", path: "/brewsoul/prescription", desc: "AI-powered daily protocol — genetics, timing, goals", icon: "💊" },
    ],
  },
  {
    title: "The Intelligence Engine",
    emoji: "📊",
    desc: "Data-driven coffee research you can't find anywhere else.",
    pages: [
      { label: "Browse All 103 Coffees", path: "/brewsoul/browse", desc: "Every coffee scored on quality, value, sourcing, and experience", icon: "☕" },
      { label: "Chain Rankings", path: "/brewsoul/chains", desc: "100 coffee chains ranked S through F tier", icon: "🏪" },
      { label: "City Coffee Rankings", path: "/brewsoul/cities", desc: "Best coffee cities ranked worldwide", icon: "🌆" },
      { label: "Compare Coffees", path: "/brewsoul/compare", desc: "Side-by-side comparison tool", icon: "⚖️" },
      { label: "Coffee Economics", path: "/brewsoul/economics", desc: "Industry economics dashboard", icon: "💰" },
    ],
  },
  {
    title: "Deep Research",
    emoji: "🔬",
    desc: "Peer-reviewed science and investigative reporting.",
    pages: [
      { label: "Coffee & Health", path: "/brewsoul/health", desc: "8 longevity benefits, 7 real risks, CYP1A2 genetics", icon: "🧬" },
      { label: "Biodynamic Census", path: "/brewsoul/biodynamic", desc: "All 3 Demeter-certified farms, 6 roasters, every product", icon: "🌱" },
      { label: "Decaf Done Right", path: "/brewsoul/decaf", desc: "13 clean brands vs. methylene chloride offenders", icon: "🧪" },
      { label: "Mold-Free Coffee", path: "/brewsoul/mold-free", desc: "Mycotoxin-free guide — actually clean coffee", icon: "🛡️" },
      { label: "Follow The Dollar", path: "/brewsoul/follow-the-dollar", desc: "Where your coffee dollar actually goes", icon: "💵" },
      { label: "Wall of Shame", path: "/brewsoul/wall-of-shame", desc: "Fraud, greenwashing, commodity deception exposed", icon: "🚩" },
    ],
  },
  {
    title: "Reference Library",
    emoji: "📖",
    desc: "Everything you need to understand coffee deeper.",
    pages: [
      { label: "Coffee Varieties", path: "/brewsoul/varieties", desc: "25 varieties — genetics, cup profiles, rarity", icon: "🌿" },
      { label: "Processing Methods", path: "/brewsoul/processing", desc: "Natural, washed, anaerobic, honey — every method", icon: "⚙️" },
      { label: "Roaster Directory", path: "/brewsoul/roasters", desc: "30+ roasters with transparency scores", icon: "🔥" },
      { label: "Farm Passports", path: "/brewsoul/farms", desc: "Origin stories and farm-level transparency", icon: "🏔️" },
      { label: "Coffee Glossary", path: "/brewsoul/glossary", desc: "Terminology — from crema to channeling", icon: "📝" },
      { label: "Coffee Pairings", path: "/brewsoul/pairings", desc: "Coffee and food pairing guide", icon: "🍫" },
    ],
  },
  {
    title: "Tools & Discovery",
    emoji: "🛠️",
    desc: "Interactive tools to explore, build, and collect.",
    pages: [
      { label: "Blend Builder", path: "/brewsoul/blend-builder", desc: "Build your own custom coffee blend", icon: "🎨" },
      { label: "Limited Drops", path: "/brewsoul/drops", desc: "Limited edition and seasonal coffee drops", icon: "✨" },
      { label: "Coffee Experiences", path: "/brewsoul/experiences", desc: "Tastings and experiences worldwide", icon: "🗺️" },
      { label: "My Collection", path: "/brewsoul/my-coffees", desc: "Your personal coffee journal and favorites", icon: "📓" },
    ],
  },
  {
    title: "Guest Series",
    emoji: "🎤",
    desc: "Expert voices interrogating industry systems.",
    pages: [
      { label: "Shanita Nicholas", path: "/brewsoul/guest/shanita-nicholas", desc: "Fair trade theater, roasting deception, and regeneration economics", icon: "☕" },
    ],
  },
];

const TOTAL_PAGES = CATEGORIES.reduce((sum, c) => sum + c.pages.length, 0);

/* ── Export category lookup for badges on other pages ── */
export const PAGE_CATEGORY_MAP: Record<string, { category: string; color: string }> = {};
CATEGORIES.forEach(cat => {
  const c = CAT_COLORS[cat.title];
  cat.pages.forEach(p => {
    PAGE_CATEGORY_MAP[p.path] = { category: cat.title, color: c?.badge || "#6F4E37" };
  });
});

export default function BrewSoulDirectory() {
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter ? CATEGORIES.filter(c => c.title === filter) : CATEGORIES;

  return (
    <>
    <SEO
        title="Coffee Directory — BrewSoul"
        description="A curated directory of specialty coffee roasters, farms, and importers."
        path="/brewsoul/directory"
        keywords="Tony Greenberg, coffee directory, specialty roasters, coffee farms"
        indexable={true}
      />
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.25em",
          textTransform: "uppercase", color: "#C5A23C", marginBottom: "0.75rem",
        }}>
          Complete Index
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 700, color: "#2C1810", lineHeight: 1.15, marginBottom: "1rem",
        }}>
          Everything Inside BrewSoul
        </h1>
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.1rem",
          color: "#6B5B4F", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6,
        }}>
          {TOTAL_PAGES} pages of coffee intelligence. Every page free.
        </p>
      </div>

      {/* Category filter pills */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap",
        marginBottom: "2.5rem",
      }}>
        <button
          onClick={() => setFilter(null)}
          style={{
            padding: "0.4rem 1rem", borderRadius: "20px", cursor: "pointer",
            fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.1em",
            textTransform: "uppercase", border: "1px solid rgba(111,78,55,0.15)",
            background: !filter ? "#6F4E37" : "transparent",
            color: !filter ? "#FAFAF7" : "#6F4E37",
            transition: "all 0.2s",
          }}
        >
          All ({TOTAL_PAGES})
        </button>
        {CATEGORIES.map(cat => {
          const c = CAT_COLORS[cat.title];
          const active = filter === cat.title;
          return (
            <button
              key={cat.title}
              onClick={() => setFilter(active ? null : cat.title)}
              style={{
                padding: "0.4rem 1rem", borderRadius: "20px", cursor: "pointer",
                fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.1em",
                textTransform: "uppercase", border: `1px solid ${c.border}`,
                background: active ? c.badge : "transparent",
                color: active ? c.badgeText : c.badge,
                transition: "all 0.2s",
              }}
            >
              {cat.emoji} {cat.title} ({cat.pages.length})
            </button>
          );
        })}
      </div>

      {/* Visual card grid by category */}
      {filtered.map(cat => {
        const c = CAT_COLORS[cat.title];
        return (
          <div key={cat.title} style={{ marginBottom: "3rem" }}>
            {/* Category header */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              marginBottom: "1rem", paddingBottom: "0.75rem",
              borderBottom: `2px solid ${c.border}`,
            }}>
              <span style={{ fontSize: "1.5rem" }}>{cat.emoji}</span>
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif", fontSize: "1.25rem",
                  fontWeight: 700, color: "#2C1810",
                }}>
                  {cat.title}
                </div>
                <div style={{
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem",
                  color: "#6B5B4F",
                }}>
                  {cat.desc}
                </div>
              </div>
            </div>

            {/* Cards grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}>
              {cat.pages.map(page => (
                <Link key={page.path} href={page.path} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      padding: "1.25rem", borderRadius: "12px",
                      background: c.bg, border: `1px solid ${c.border}`,
                      transition: "all 0.25s ease",
                      cursor: "pointer", height: "100%",
                      display: "flex", flexDirection: "column",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${c.border}`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Icon + badge row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <span style={{
                        fontSize: "1.75rem", width: "44px", height: "44px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "10px", background: "rgba(255,255,255,0.6)",
                      }}>
                        {page.icon}
                      </span>
                      <span style={{
                        fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        padding: "0.2rem 0.5rem", borderRadius: "4px",
                        background: c.badge, color: c.badgeText,
                      }}>
                        {cat.title}
                      </span>
                    </div>

                    {/* Title */}
                    <div style={{
                      fontFamily: "'Playfair Display', serif", fontSize: "1.05rem",
                      fontWeight: 700, color: "#2C1810", marginBottom: "0.4rem",
                      lineHeight: 1.3,
                    }}>
                      {page.label}
                    </div>

                    {/* Description */}
                    <div style={{
                      fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem",
                      color: "#6B5B4F", lineHeight: 1.5, flex: 1,
                    }}>
                      {page.desc}
                    </div>

                    {/* Arrow */}
                    <div style={{
                      fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
                      color: c.badge, marginTop: "0.75rem",
                      display: "flex", alignItems: "center", gap: "0.3rem",
                    }}>
                      Explore →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bottom CTA */}
      <div style={{
        textAlign: "center", marginTop: "2rem", padding: "2rem",
        borderRadius: "12px", background: "rgba(111,78,55,0.04)",
        border: "1px solid rgba(111,78,55,0.1)",
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontSize: "1.3rem",
          fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem",
        }}>
          Don't know where to start?
        </div>
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem",
          color: "#6B5B4F", marginBottom: "1.25rem",
        }}>
          Take the 2-minute Taste Quiz and we'll point you
          to the pages that matter for your palate.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/brewsoul/quiz">
            <button style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em",
              textTransform: "uppercase", padding: "0.75rem 1.5rem", borderRadius: "6px",
              background: "#6F4E37", color: "#FAFAF7", border: "none", cursor: "pointer",
            }}>
              Take the Quiz
            </button>
          </Link>
          <Link href="/brewsoul/first-sip">
            <button style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em",
              textTransform: "uppercase", padding: "0.75rem 1.5rem", borderRadius: "6px",
              background: "transparent", color: "#6F4E37", border: "1px solid rgba(111,78,55,0.3)",
              cursor: "pointer",
            }}>
              Read The First Sip
            </button>
          </Link>
        </div>
      </div>
    </div>
    </>);
}
