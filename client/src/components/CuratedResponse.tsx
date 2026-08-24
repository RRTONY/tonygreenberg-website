/**
 * CuratedResponse — replaces the open comment section.
 *
 * Philosophy: deep discourse is welcome. A form is not the right door.
 * Three ways to reach Tony: Telegram, email, or the ethereal route (FauxTony).
 *
 * Optional: pass a `featuredResponse` prop to surface a curated letter
 * from a reader who earned the spotlight.
 */
import { useRef, useState, useEffect } from "react";

export interface FeaturedLetter {
  /** Short eyebrow — e.g. "A RESPONSE WORTH KEEPING" */
  eyebrow: string;
  /** Italic pull headline — e.g. "A physician with 50 years of practice responds." */
  headline: string;
  /** Attribution line shown before the letter body */
  attribution: string;
  /** Full letter body — supports **bold**, *italic*, and > blockquote markdown */
  body: string;
  /** Optional sign-off line */
  signoff?: string;
}

interface CuratedResponseProps {
  postSlug: string;
  featuredResponse?: FeaturedLetter;
}

/** Minimal inline markdown renderer for the letter body */
function LetterBody({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {lines.map((line, i) => {
        if (!line.trim()) return null;

        const isBlockquote = line.startsWith("> ");
        const content = isBlockquote ? line.slice(2) : line;

        // Inline bold/italic
        const renderInline = (s: string) => {
          const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
          return parts.map((p, j) => {
            if (p.startsWith("**") && p.endsWith("**"))
              return <strong key={j} style={{ fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
            if (p.startsWith("*") && p.endsWith("*"))
              return <em key={j}>{p.slice(1, -1)}</em>;
            return p;
          });
        };

        if (isBlockquote) {
          return (
            <blockquote
              key={i}
              style={{
                borderLeft: "2px solid rgba(139,105,20,0.4)",
                paddingLeft: "1.25rem",
                margin: "0.25rem 0",
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1rem, 2vw, 1.1rem)",
                fontStyle: "italic",
                color: "#2A2010",
                lineHeight: 1.75,
              }}
            >
              {renderInline(content)}
            </blockquote>
          );
        }

        return (
          <p
            key={i}
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
              color: "#3A3020",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {renderInline(content)}
          </p>
        );
      })}
    </div>
  );
}

export default function CuratedResponse({ postSlug, featuredResponse }: CuratedResponseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const openFauxTony = () => {
    window.dispatchEvent(new CustomEvent("open-fauxtony", {
      detail: { question: "" }
    }));
  };

  return (
    <div
      ref={containerRef}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        marginTop: "3rem",
      }}
    >
      {/* ── FEATURED LETTER (optional) ── */}
      {featuredResponse && (
        <div style={{
          background: "rgba(250,250,247,0.6)",
          border: "1px solid rgba(139,105,20,0.15)",
          borderRadius: "2px",
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
          marginBottom: "2.5rem",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: 0, right: 0,
            width: "200px", height: "200px",
            background: "radial-gradient(circle, rgba(212,185,106,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Eyebrow */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            marginBottom: "1.25rem",
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(139,105,20,0.2)" }} />
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8B6914",
              whiteSpace: "nowrap",
            }}>
              {featuredResponse.eyebrow}
            </p>
            <div style={{ flex: 1, height: "1px", background: "rgba(139,105,20,0.2)" }} />
          </div>

          {/* Pull headline */}
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.15rem, 2.5vw, 1.45rem)",
            fontStyle: "italic",
            color: "#1A1710",
            lineHeight: 1.45,
            marginBottom: "1.5rem",
          }}>
            {featuredResponse.headline}
          </p>

          {/* Attribution */}
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.88rem",
            color: "#5C5240",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
            fontStyle: "italic",
          }}>
            {featuredResponse.attribution}
          </p>

          {/* Ornamental divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            margin: "1.5rem 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(139,105,20,0.15)" }} />
            <span style={{ color: "rgba(139,105,20,0.4)", fontSize: "0.7rem", letterSpacing: "0.3em" }}>✦ ✦ ✦</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(139,105,20,0.15)" }} />
          </div>

          {/* Letter body */}
          <LetterBody text={featuredResponse.body} />

          {/* Sign-off */}
          {featuredResponse.signoff && (
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.9rem",
              fontStyle: "italic",
              color: "#8B6914",
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(139,105,20,0.12)",
            }}>
              {featuredResponse.signoff}
            </p>
          )}
        </div>
      )}

      {/* ── REACH TONY ── */}
      <div style={{
        borderTop: "1px solid rgba(139,105,20,0.15)",
        paddingTop: "2rem",
      }}>
        {/* Eyebrow */}
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(139,105,20,0.6)",
          marginBottom: "0.6rem",
        }}>
          ◆ Discourse
        </p>

        {/* Headline */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.1rem, 2.2vw, 1.3rem)",
          fontStyle: "italic",
          color: "#1A1710",
          lineHeight: 1.45,
          marginBottom: "0.5rem",
        }}>
          Deep thought is welcome here. Genuinely.
        </p>

        {/* Subtext */}
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.9rem",
          color: "#5C5240",
          lineHeight: 1.7,
          marginBottom: "1.75rem",
          maxWidth: "540px",
        }}>
          If this piece moved something in you — agreement, fury, a half-formed theory at 2am — 
          don't leave it in a tab. The best responses to things I write have come from people 
          who just said what they actually thought.
        </p>

        {/* Three channels */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
        }}>
          {/* Telegram */}
          <a
            href="https://t.me/rrtpny"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.1rem",
              background: "rgba(139,105,20,0.06)",
              border: "1px solid rgba(139,105,20,0.18)",
              borderRadius: "2px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              color: "#8B6914",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(139,105,20,0.12)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,105,20,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(139,105,20,0.06)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,105,20,0.18)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.26 13.928l-2.95-.924c-.64-.203-.653-.64.136-.954l11.57-4.461c.537-.194 1.006.131.878.632z"/>
            </svg>
            Telegram @rrtpny
          </a>

          {/* Email */}
          <a
            href="mailto:tony@impactsoul.com?subject=Re: this piece"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.1rem",
              background: "rgba(139,105,20,0.06)",
              border: "1px solid rgba(139,105,20,0.18)",
              borderRadius: "2px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              color: "#8B6914",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(139,105,20,0.12)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,105,20,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(139,105,20,0.06)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,105,20,0.18)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            tony@impactsoul.com
          </a>

          {/* Ethereal / FauxTony */}
          <button
            onClick={openFauxTony}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.1rem",
              background: "none",
              border: "1px solid rgba(139,105,20,0.12)",
              borderRadius: "2px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              color: "rgba(139,105,20,0.55)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#8B6914";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,105,20,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(139,105,20,0.55)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,105,20,0.12)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10"/>
              <path d="M12 8v4l3 3"/>
              <path d="M18 2v6h6"/>
            </svg>
            or shout into the ether
          </button>
        </div>

        {/* Quiet footnote */}
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.72rem",
          color: "rgba(90,80,60,0.4)",
          marginTop: "1rem",
          fontStyle: "italic",
        }}>
          The best ones get published. With your permission, obviously.
        </p>
      </div>
    </div>
  );
}
