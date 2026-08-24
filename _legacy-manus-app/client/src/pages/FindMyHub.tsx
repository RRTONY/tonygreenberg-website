import { Link } from "wouter";
import SEO from "@/components/SEO";
import { AssessmentProgressBar } from "@/components/AssessmentProgress";
import { useState } from "react";

/* ── ALL ASSESSMENTS — single source of truth ── */
const ALL_LINKS = [
  // Featured / flagship
  { title: "Find My Me", tagline: "Clarity on identity & direction", href: "/find-your-me", icon: "🪞", color: "#D4B96A", featured: true },
  { title: "Find My Love", tagline: "Relational alignment framework", href: "https://intimacyassess-tcir3hon.manus.space", icon: "💕", color: "#C97B7B", featured: true, ext: true },
  { title: "Find My Car", tagline: "Decision tool for major purchases", href: "/find-your-ev", icon: "🚗", color: "#4682B4", featured: true },

  // Body & Health
  { title: "Find My Peptide", tagline: "7-axis clinical assessment · 16 archetypes", href: "/find-your-peptide", icon: "🧬", color: "#2E8B57", category: "body" },
  { title: "Find My Stem Cells", tagline: "22-question clinic-risk assessment · pricing, red flags, and provider scoring", href: "https://findmystem-s3lknc4h.manus.space/", icon: "🧫", color: "#6B8F71", category: "body", ext: true },
  { title: "Find My Diet", tagline: "Food philosophy matching", href: "/find-your-diet", icon: "🥗", color: "#7BC9A4", category: "body" },
  { title: "Find My Movement", tagline: "Exercise & fitness style", href: "/find-your-movement", icon: "🏃", color: "#4682B4", category: "body" },
  { title: "Find My Sleep", tagline: "Sleep optimization assessment", href: "/find-your-sleep", icon: "🌙", color: "#6A5ACD", category: "body" },
  { title: "Find My Coffee", tagline: "Your perfect cup, decoded", href: "/find-your-coffee", icon: "☕", color: "#8B6914", category: "body" },
  { title: "BrewSoul Intelligence", tagline: "100+ coffees ranked · 100 chains scored · Identity-matched", href: "/brewsoul", icon: "☕", color: "#6F4E37", category: "body" },
  { title: "Find My Kitchen", tagline: "Cooking style assessment", href: "/find-your-kitchen", icon: "🍳", color: "#D4A76A", category: "body" },
  { title: "Find My Sake", tagline: "Japanese rice wine profile", href: "/find-your-sake", icon: "🍶", color: "#B8860B", category: "body" },

  // Mind & Spirit
  { title: "Find My Therapy", tagline: "Match the right modality", href: "/find-your-therapy", icon: "🧠", color: "#7BA8C9", category: "mind" },
  { title: "Find My Spirit", tagline: "Discover your spiritual archetype", href: "/find-your-spirit", icon: "✨", color: "#A87BC9", category: "mind" },
  { title: "Find My Religion", tagline: "Philosophical & spiritual alignment", href: "/find-your-religion", icon: "🕊️", color: "#2E8B57", category: "mind" },

  // Relationships
  { title: "Find My Sexuality", tagline: "6-dimension orientation mapping", href: "/find-your-sexuality", icon: "🌈", color: "#C97B7B", category: "relationships" },
  { title: "Find My Attachment Style", tagline: "Attachment theory assessment", href: "/find-your-attachment-style", icon: "🔗", color: "#8B4513", category: "relationships" },
  { title: "Find My Love Language", tagline: "How you give & receive love", href: "/find-your-love-language", icon: "💬", color: "#C97BA8", category: "relationships" },
  { title: "Find My Team", tagline: "Collaboration & leadership style", href: "/flow-circuit", icon: "🤝", color: "#C9A87B", category: "relationships", ext: false },

  // Identity & Style
  { title: "Find My Style", tagline: "Personal fashion & aesthetic", href: "/find-your-style", icon: "👔", color: "#9B2335", category: "identity" },

  // Deep Assessments (from /assessments)
  { title: "Dharma Finder", tagline: "25 questions to discover your purpose", href: "/assessments/dharma-finder", icon: "◎", color: "#D4B96A", category: "deep" },
  { title: "Consciousness Scale", tagline: "Map your consciousness level", href: "/assessments/consciousness-scale", icon: "△", color: "#A87BC9", category: "deep" },
  { title: "Grant Study", tagline: "Harvard's 85-year life satisfaction study", href: "/assessments/grant-study", icon: "♡", color: "#C97B7B", category: "deep" },
  { title: "Life Assessment", tagline: "Comprehensive life satisfaction across all dimensions", href: "/life-assessment", icon: "🎯", color: "#4682B4", category: "deep" },

  // Impact & Scoring
  { title: "SoulScore", tagline: "Impact verification & blockchain certificates", href: "/soulscore", icon: "◉", color: "#D4B96A", category: "impact" },
  { title: "Charity Scorecard", tagline: "Evaluate charities on transparency & impact", href: "/charity-scorecard", icon: "📊", color: "#2E8B57", category: "impact" },
];

const HERO_IMG = "/api/img/findme-orig_c4cf916c.jpg";

/* ── Link Button ── */
function LinkButton({ item }: { item: typeof ALL_LINKS[0] }) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.5rem",
        borderRadius: "60px",
        border: `2px solid ${hovered ? item.color : "rgba(139,105,20,0.15)"}`,
        background: hovered ? `${item.color}0D` : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-2px) scale(1.01)" : "none",
        boxShadow: hovered ? `0 8px 24px ${item.color}20` : "0 2px 8px rgba(0,0,0,0.04)",
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto",
        textDecoration: "none",
      }}
    >
      <span style={{
        fontSize: "1.5rem",
        flexShrink: 0,
        width: "2.5rem",
        height: "2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: `${item.color}15`,
      }}>
        {item.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.1rem",
          fontWeight: 500,
          color: "#0A0A10",
          lineHeight: 1.3,
        }}>
          {item.title}
        </div>
        <div style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.85rem",
          color: "#777",
          lineHeight: 1.4,
          marginTop: "0.15rem",
        }}>
          {item.tagline}
        </div>
      </div>
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.75rem",
        color: hovered ? item.color : "#bbb",
        transition: "all 0.3s ease",
        flexShrink: 0,
        transform: hovered ? "translateX(3px)" : "none",
      }}>
        →
      </span>
    </div>
  );

  if (item.ext) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
        {inner}
      </a>
    );
  }
  return <Link href={item.href} style={{ textDecoration: "none", display: "block" }}>{inner}</Link>;
}

/* ── Category labels ── */
const CATEGORY_LABELS: Record<string, string> = {
  body: "BODY & HEALTH",
  mind: "MIND & SPIRIT",
  relationships: "RELATIONSHIPS",
  identity: "IDENTITY & STYLE",
  deep: "DEEP ASSESSMENTS",
  impact: "IMPACT & SCORING",
};

export default function FindMyHub() {
  const featured = ALL_LINKS.filter(l => l.featured);
  const categories = ["body", "mind", "relationships", "identity", "deep", "impact"];

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <SEO
        title="Find What's Yours — All Assessments"
        description="Decision frameworks that reduce friction and create clarity. 20+ assessments across health, mind, relationships, identity, and impact."
        path="/find-my"
        indexable={true}
      />

      {/* ── HERO BANNER ── */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "200px",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "brightness(0.4) saturate(1.2)",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(10,10,16,0.3) 0%, rgba(10,10,16,0.7) 100%)",
        }} />
      </div>

      {/* ── AVATAR + TITLE (overlapping banner) ── */}
      <div style={{
        textAlign: "center",
        marginTop: "-60px",
        position: "relative",
        zIndex: 10,
        padding: "0 1.5rem",
      }}>
        {/* Avatar circle */}
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #8B6914 0%, #D4B96A 50%, #8B6914 100%)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "4px solid #FAFAF7",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2.2rem",
            color: "#fff",
            fontWeight: 700,
            lineHeight: 1,
          }}>
            T
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
          fontWeight: 400,
          color: "#0A0A10",
          lineHeight: 1.2,
          marginTop: "1.25rem",
          marginBottom: "0.5rem",
        }}>
          Find What's Yours
        </h1>

        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "1rem",
          color: "#777",
          lineHeight: 1.6,
          maxWidth: "420px",
          margin: "0 auto",
        }}>
          20+ decision frameworks that reduce friction and create clarity. No sales pitch. Just tools.
        </p>

        {/* ─── CONTEXTUAL INTRO ─── */}
        <div style={{
          background: "rgba(139,105,20,0.04)",
          border: "1px solid rgba(139,105,20,0.12)",
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          maxWidth: "480px",
          margin: "1.25rem auto 0",
          textAlign: "left",
        }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#555", lineHeight: 1.65, marginBottom: "0.6rem" }}>
            <strong style={{ color: "#8B6914" }}>What you're looking at:</strong> Every assessment Tony has built — from identity and relationships to health, consciousness, and impact — organized in one place. Each one takes 5–10 minutes and gives you an immediate, personalized result.
          </p>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#555", lineHeight: 1.65, marginBottom: "0.6rem" }}>
            <strong style={{ color: "#8B6914" }}>Why it matters:</strong> Most people make major life decisions — what to eat, who to trust, how to heal — with borrowed frameworks or no framework at all. These tools give you your own data about yourself.
          </p>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#555", lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: "#8B6914" }}>What to do:</strong> Start with a Featured assessment, or scroll by category. Your progress bar tracks which ones you've completed. No login required.
          </p>
        </div>

        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.68rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#bbb",
          marginTop: "0.75rem",
        }}>
          5–10 MIN EACH · FREE · INSTANT RESULTS
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div style={{ maxWidth: "520px", margin: "1.5rem auto 0", padding: "0 1.5rem" }}>
        <AssessmentProgressBar />
      </div>

      {/* ── FEATURED LINKS ── */}
      <section style={{
        maxWidth: "520px",
        margin: "2rem auto 0",
        padding: "0 1.5rem",
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.68rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8B6914",
          marginBottom: "1rem",
          textAlign: "center",
        }}>
          FEATURED
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {featured.map(link => (
            <LinkButton key={link.title} item={link} />
          ))}
        </div>
      </section>

      {/* ── CATEGORIZED LINKS ── */}
      {categories.map(cat => {
        const items = ALL_LINKS.filter(l => l.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} style={{
            maxWidth: "520px",
            margin: "2.5rem auto 0",
            padding: "0 1.5rem",
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#999",
              marginBottom: "1rem",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}>
              <span style={{ flex: 1, height: "1px", background: "rgba(139,105,20,0.12)" }} />
              {CATEGORY_LABELS[cat] || cat.toUpperCase()}
              <span style={{ flex: 1, height: "1px", background: "rgba(139,105,20,0.12)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {items.map(link => (
                <LinkButton key={link.title} item={link} />
              ))}
            </div>
          </section>
        );
      })}

      {/* ── SELF-PORTRAIT CTA ── */}
      <section style={{
        maxWidth: "520px",
        margin: "3rem auto 0",
        padding: "0 1.5rem",
        textAlign: "center",
      }}>
        <div style={{
          padding: "2rem 1.5rem",
          borderRadius: "16px",
          background: "#0A0A10",
          border: "1px solid rgba(212,185,106,0.2)",
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#D4B96A",
            marginBottom: "0.75rem",
          }}>UNLOCK YOUR COMPOSITE</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.4rem",
            fontWeight: 400,
            color: "#FAFAF7",
            marginBottom: "0.5rem",
          }}>Self-Portrait</h2>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.9rem",
            color: "#999",
            lineHeight: 1.6,
            marginBottom: "1.25rem",
          }}>
            Complete 5+ assessments to unlock your composite identity map — a unified radar chart of who you are across all dimensions.
          </p>
          <Link href="/self-portrait">
            <span style={{
              display: "inline-block",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0.75rem 2rem",
              border: "1px solid #D4B96A",
              borderRadius: "60px",
              color: "#D4B96A",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}>
              View Self-Portrait →
            </span>
          </Link>
        </div>
      </section>

      {/* ── CONNECT ── */}
      <section style={{
        textAlign: "center",
        padding: "2.5rem 1.5rem 1.5rem",
        maxWidth: "520px",
        margin: "0 auto",
      }}>
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.9rem",
          color: "#999",
          marginBottom: "0.75rem",
        }}>
          Connect with Tony
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
          <Link href="/pick-up-the-phone">
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              color: "#8B6914",
              textDecoration: "none",
              cursor: "pointer",
            }}>
              📞 PICK UP THE PHONE
            </span>
          </Link>
          <Link href="/fauxtony">
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              color: "#8B6914",
              textDecoration: "none",
              cursor: "pointer",
            }}>
              🤖 ASK FAUXTONY
            </span>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <section style={{
        textAlign: "center",
        padding: "1rem 1.5rem 2rem",
      }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          color: "#ccc",
          letterSpacing: "0.08em",
        }}>
          All assessments are free · Your data is never sold · Results delivered immediately
        </p>
      </section>
    </div>
  );
}
