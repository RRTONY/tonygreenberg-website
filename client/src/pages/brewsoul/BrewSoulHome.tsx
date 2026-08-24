import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { COFFEES } from "@/data/brewsoul-coffees";
import JourneyBar, { useMarkVisited } from "./JourneyBar";
import { BREWSOUL_CONFIG } from "@/data/brewsoul-config";
import { SHAME_ENTRIES } from "@/data/brewsoul-encyclopedia";
import { computeQPR, computeAvailability, computeScarcity, computeWow, computeTier, computeFreshness } from "@/lib/intelligence-engine/scoring";
import type { CatalogItem } from "@/lib/intelligence-engine/types";
import SEO from "@/components/SEO";

/* ── CDN hero images ── */
const HERO_EXPLODE = "/api/img/brewsoul-orig_84eb4bc9.jpg";
const HERO_POUR = "/api/img/brewsoul-orig_84eb4bc9.jpg";
const HERO_EXTRACT = "/api/img/brewsoul-orig_84eb4bc9.jpg";

/* ── Floating warm particles (golden dust) ── */
function WarmParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; pulse: number }[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.2 - 0.02,
        r: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let t = 0;
    const draw = () => {
      t += 0.005;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.pulse) * 0.08;
        p.y += p.vy;
        p.pulse += 0.01;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `rgba(196, 162, 60, ${a * 0.4})`);
        grad.addColorStop(1, `rgba(196, 162, 60, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(212, 185, 106, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 3 }}
    />
  );
}

/* ── Glass card ── */
function GlassCard({ children, style, onClick, hover = true, glow = false }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
  glow?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
<div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.88)"
          : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        border: hovered
          ? "1.5px solid rgba(139,105,20,0.5)"
          : "1px solid rgba(139,105,20,0.15)",
        borderRadius: "16px",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: onClick ? "pointer" : "default",
        transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 16px 48px rgba(139,105,20,0.22), 0 0 0 1px rgba(212,185,106,0.15), inset 0 1px 0 rgba(255,255,255,0.8)"
          : glow
            ? "0 8px 32px rgba(139,105,20,0.12), 0 0 0 1px rgba(212,185,106,0.08), inset 0 1px 0 rgba(255,255,255,0.6)"
            : "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Parallax section background ── */
function ParallaxBg({ src, height = "55vh" }: { src: string; height?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setOffset(-rect.top * 0.25);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} style={{ position: "absolute", top: 0, left: 0, right: 0, height, overflow: "hidden", zIndex: 0 }}>
      <img
        src={src} alt=""
        style={{
          width: "100%", height: "140%", objectFit: "cover",
          objectPosition: "center 30%",
          filter: "saturate(1.2) brightness(1.05)",
          transform: `translateY(${offset}px) scale(1.1)`,
          transition: "transform 0.1s linear",
        }}
      />
      {/* Warm gradient fade — NOT dark */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "65%",
        background: "linear-gradient(to top, #F0E8D8 0%, rgba(240,232,216,0.8) 40%, transparent 100%)",
        zIndex: 1,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(240,232,216,0.35) 100%)",
        zIndex: 1,
      }} />
    </div>
  );
}

function tierStars(score: number) {
  if (score >= 92) return "\u{1F451}";
  if (score >= 90) return "\u2615\u2615\u2615";
  if (score >= 86) return "\u2615\u2615";
  return "\u2615";
}

type Scores = { qpr: number; availability: number; scarcity: number; wow: number; tier: 1|2|3|4; freshness: string };

function CoffeeCard({ c, scores }: { c: CatalogItem; scores: Scores }) {
  return (
    <GlassCard glow hover style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#2C1810" }}>{c.name}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#6F4E37" }}>{c.producer}</div>
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", fontWeight: 700,
          color: scores.qpr >= 80 ? "#4A7C59" : scores.qpr >= 60 ? "#C5A23C" : "#8B2500",
          textShadow: scores.qpr >= 80 ? "0 1px 6px rgba(74,124,89,0.2)" : "none",
        }}>QPR {scores.qpr}</div>
      </div>
      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: "#6B5B4F", marginBottom: "0.5rem" }}>
        {c.originCountry} {'\u00B7'} {c.variety} {'\u00B7'} {c.processingMethod}
      </div>
      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#999", fontStyle: "italic", marginBottom: "0.75rem" }}>
        {c.tastingNotes?.join(", ") || "Complex, nuanced"}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", padding: "0.15rem 0.5rem",
            borderRadius: "10px", background: "rgba(139,105,20,0.08)", color: "#6F4E37",
          }}>
            {tierStars(c.cuppingScore || 0)} {c.cuppingScore}
          </span>
          {c.moldTestStatus === "verified" && (
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", padding: "0.15rem 0.5rem",
              borderRadius: "10px", background: "rgba(74,124,89,0.1)", color: "#4A7C59",
            }}>
              {"Mold-Free \u2713"}
            </span>
          )}
          {c.limitedRelease && (
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", padding: "0.15rem 0.5rem",
              borderRadius: "10px", background: "rgba(197,162,60,0.1)", color: "#C5A23C",
            }}>
              Limited
            </span>
          )}
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.88rem", fontWeight: 600, color: "#2C1810" }}>
          ${c.priceUsd}
        </div>
      </div>
    </GlassCard>
  );
}

export { CoffeeCard };

const HEALTH_FACTS = [
  "3-5 cups/day = 12-15% lower all-cause mortality (Annals of Internal Medicine)",
  "Caffeine half-life: 6 hours. Your 2pm coffee is still 25% active at midnight.",
  "#1 source of antioxidants in most Western diets",
  "3-6% endurance improvement (Journal of Sports Science meta-analysis)",
  "Spikes cortisol 30% on empty stomach. CYP1A2 slow metabolizers feel it 2-3x longer.",
  "30% lower risk of Parkinson's disease",
  "Withdrawal headaches within 12-24 hours \u2014 real physiological dependence",
  "25% lower risk of Type 2 diabetes",
];

/* ── Stat counter with glow ── */
function StatGlow({ value, label }: { value: string; label: string }) {
  return (
    <GlassCard hover={false} glow style={{ padding: "1.25rem 1.5rem", textAlign: "center", flex: "1 1 140px" }}>
      <div style={{
        fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
        fontWeight: 700, color: "#8B6914",
        textShadow: "0 2px 12px rgba(139,105,20,0.25)",
        lineHeight: 1.1,
      }}>{value}</div>
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em",
        textTransform: "uppercase", color: "rgba(90,74,32,0.5)", marginTop: "0.35rem",
      }}>{label}</div>
    </GlassCard>
  );
}

export default function BrewSoulHome() {
  useMarkVisited("home");
  const [healthIdx, setHealthIdx] = useState(0);

  const allScored = useMemo(() => {
    return COFFEES.map(c => ({ coffee: c, scores: {
      qpr: computeQPR(c, COFFEES),
      availability: computeAvailability(c),
      scarcity: computeScarcity(c),
      wow: computeWow(c),
      tier: computeTier(c.cuppingScore || 0),
      freshness: computeFreshness(c),
    }}));
  }, []);

  const topQPR = [...allScored].sort((a, b) => b.scores.qpr - a.scores.qpr).slice(0, 6);
  const newDrops = [...allScored].filter(x => x.coffee.limitedRelease || x.coffee.inStock).slice(0, 4);
  const shamePreview = SHAME_ENTRIES.slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", color: "#2C1810" }}>
      <SEO
        title="BrewSoul — Specialty Coffee Intelligence"
        description="The world's most rigorous specialty coffee platform. Sourcing, roasting, and brewing intelligence for serious coffee people."
        path="/brewsoul"
        keywords="Tony Greenberg, specialty coffee, coffee sourcing, BrewSoul, coffee intelligence"
        indexable={true}
      />

      {/* ═══════════════════════════════════════════════════════════════
          HERO — Full-bleed explosive coffee imagery with parallax
         ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative", overflow: "hidden",
        minHeight: "100vh",
        background: "linear-gradient(170deg, #FAFAF7 0%, #F0E8D8 30%, #E8DCC8 60%, #F5F0E6 100%)",
      }}>
        <ParallaxBg src={HERO_EXPLODE} height="65vh" />
        <WarmParticles />

        {/* Content overlaying the hero */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "clamp(8rem, 18vh, 14rem) 1.5rem 3rem",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.35em",
            textTransform: "uppercase", color: "#8B6914", marginBottom: "1.25rem",
            textShadow: "0 1px 8px rgba(250,250,247,0.8)",
          }}>The Coffee Intelligence Engine</div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 7vw, 3.8rem)",
            fontWeight: 700, color: "#1A1A1A", lineHeight: 1.1,
            marginBottom: "1.25rem",
            textShadow: "0 2px 16px rgba(250,250,247,0.7)",
          }}>
            Find the Coffee You'll<br />
            Actually <em style={{ color: "#8B6914", fontStyle: "italic" }}>Love</em>
          </h1>

          <p style={{
            fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", lineHeight: 1.8,
            color: "#4A4A4A", maxWidth: "540px",
            background: "rgba(250,250,247,0.7)", borderRadius: "14px", padding: "1rem 1.5rem",
            backdropFilter: "blur(16px)",
            marginBottom: "2rem",
          }}>
            Taste-matched. QPR-scored. Mold-tested. Farm-traced. Dollar-tracked.
            <br />103 coffees scored. 100 chains ranked. 6 identity archetypes.
          </p>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center",
            marginBottom: "2.5rem", maxWidth: "600px",
          }}>
            <StatGlow value="103" label="Coffees Scored" />
            <StatGlow value="100" label="Chains Ranked" />
            <StatGlow value="6" label="Identity Types" />
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
            <Link href="/brewsoul/quiz" style={{ textDecoration: "none" }}>
              <button style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", letterSpacing: "0.15em",
                textTransform: "uppercase", padding: "1rem 2.5rem", borderRadius: "8px",
                background: "linear-gradient(135deg, #C5A23C, #8B6914)", color: "#FAFAF7",
                border: "none", cursor: "pointer", fontWeight: 700,
                boxShadow: "0 8px 32px rgba(139,105,20,0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(139,105,20,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,105,20,0.4)"; }}
              >{"Start Taste Quiz \u2192"}</button>
            </Link>
            <Link href="/brewsoul/browse" style={{ textDecoration: "none" }}>
              <button style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", letterSpacing: "0.15em",
                textTransform: "uppercase", padding: "1rem 2.5rem", borderRadius: "8px",
                background: "rgba(255,255,255,0.7)", color: "#8B6914",
                border: "1.5px solid rgba(139,105,20,0.3)", cursor: "pointer", fontWeight: 700,
                backdropFilter: "blur(12px)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(139,105,20,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >Browse Top QPR</button>
            </Link>
            <Link href="/brewsoul/chains" style={{ textDecoration: "none" }}>
              <button style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", letterSpacing: "0.15em",
                textTransform: "uppercase", padding: "1rem 2.5rem", borderRadius: "8px",
                background: "rgba(255,255,255,0.7)", color: "#8B6914",
                border: "1.5px solid rgba(139,105,20,0.3)", cursor: "pointer", fontWeight: 700,
                backdropFilter: "blur(12px)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(139,105,20,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >Chain Rankings</button>
            </Link>
          </div>

          {/* ─── CONTEXTUAL INTRO ─── */}
          <GlassCard hover={false} glow style={{
            padding: "1.5rem 1.75rem", maxWidth: "600px", textAlign: "left",
          }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#5A4A20", lineHeight: 1.7, marginBottom: "0.6rem" }}>
              <strong style={{ color: "#8B6914" }}>{"What you\u2019re looking at:"}</strong> An intelligence engine that objectively scores every coffee and chain on quality, value, sourcing ethics, and experience {'\u2014'} then matches you to your identity through a 6-archetype taste quiz.
            </p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#5A4A20", lineHeight: 1.7, marginBottom: "0.6rem" }}>
              <strong style={{ color: "#8B6914" }}>Why it matters:</strong> Coffee is the most consumed psychoactive substance on earth, yet most people have no idea what they're actually drinking. This engine replaces marketing with measurement.
            </p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#5A4A20", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#8B6914" }}>What to do:</strong> Take the taste quiz to discover your BrewSoul identity. Browse the catalog to find your next cup. Check the chain rankings to see if your daily stop is worth the money.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOLLOW THE DOLLAR — Dramatic parallax section
         ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "0", minHeight: "50vh",
        background: "linear-gradient(170deg, #F5F0E6 0%, #EDE7D9 50%, #F0E8D8 100%)",
      }}>
        <ParallaxBg src={HERO_POUR} height="50vh" />
        <WarmParticles />
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "clamp(6rem, 14vh, 10rem) 1.5rem 4rem",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.3em",
            textTransform: "uppercase", color: "#8B6914", marginBottom: "1rem",
            textShadow: "0 1px 8px rgba(250,250,247,0.8)",
          }}>Follow The Dollar</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
            fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2, marginBottom: "1rem",
            textShadow: "0 2px 12px rgba(250,250,247,0.6)",
          }}>
            The farmer gets $0.40<br />of your $5 latte.
          </h2>
          <GlassCard hover={false} glow style={{ padding: "1.25rem 1.5rem", maxWidth: "520px", marginBottom: "1.5rem" }}>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#4A4A4A",
              lineHeight: 1.7, margin: 0,
            }}>
              {"That\u2019s 8%. Specialty coffee has "}<em>less</em>{" equitable distribution than mainstream. We show you exactly where every dollar goes."}
            </p>
          </GlassCard>
          <Link href="/brewsoul/follow-the-dollar" style={{ textDecoration: "none" }}>
            <button style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.15em",
              textTransform: "uppercase", padding: "0.85rem 2rem", borderRadius: "6px",
              background: "linear-gradient(135deg, #C5A23C, #8B6914)", color: "#FAFAF7",
              border: "none", cursor: "pointer", fontWeight: 700,
              boxShadow: "0 6px 24px rgba(139,105,20,0.35)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >{"See the Full Breakdown \u2192"}</button>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TOP QPR — Glass cards grid
         ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        padding: "5rem 1.5rem", maxWidth: "1100px", margin: "0 auto",
        background: "transparent",
      }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.3em",
            textTransform: "uppercase", color: "#8B6914", marginBottom: "0.75rem",
          }}>Best Value Right Now</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem",
          }}>Top QPR Coffees</h2>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.92rem", color: "#6B5B4F",
            maxWidth: "480px", margin: "0 auto",
          }}>Quality-to-Price Ratio {'\u2014'} the coffees that punch above their weight class.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {topQPR.map(({ coffee, scores }) => (
            <Link key={coffee.id} href={`/brewsoul/coffee/${coffee.id}`} style={{ textDecoration: "none" }}>
              <CoffeeCard c={coffee} scores={scores} />
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/brewsoul/browse" style={{
            textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
            letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B6914",
          }}>{"Browse All 103 Coffees \u2192"}</Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2025 CRISIS — Dramatic parallax
         ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative", overflow: "hidden",
        minHeight: "45vh",
        background: "linear-gradient(170deg, #F0E8D8 0%, #E8DCC8 50%, #F5F0E6 100%)",
      }}>
        <ParallaxBg src={HERO_EXTRACT} height="45vh" />
        <WarmParticles />
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "clamp(6rem, 14vh, 10rem) 1.5rem 4rem",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.3em",
            textTransform: "uppercase", color: "#8B2500", marginBottom: "1rem",
            textShadow: "0 1px 8px rgba(250,250,247,0.8)",
          }}>The 2025 Crisis</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.5rem, 4.5vw, 2.4rem)",
            fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2, marginBottom: "1rem",
            textShadow: "0 2px 12px rgba(250,250,247,0.6)",
          }}>
            Arabica hit $4.41/lb.<br />50% of coffee land gone by 2050.
          </h2>
          <GlassCard hover={false} glow style={{ padding: "1.25rem 1.5rem", maxWidth: "480px" }}>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#4A4A4A",
              lineHeight: 1.7, margin: 0,
            }}>
              Your choices matter more now than ever. Every cup is a vote for the future of coffee.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          NEW DROPS
         ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 1.5rem 4rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem" }}>
          <div>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.3em",
              textTransform: "uppercase", color: "#8B6914", marginBottom: "0.25rem",
            }}>Fresh</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#2C1810" }}>
              New Drops
            </h2>
          </div>
          <Link href="/brewsoul/drops" style={{
            textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem",
            color: "#8B6914", letterSpacing: "0.1em",
          }}>{"See all \u2192"}</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
          {newDrops.map(({ coffee, scores }) => (
            <Link key={coffee.id} href={`/brewsoul/coffee/${coffee.id}`} style={{ textDecoration: "none" }}>
              <CoffeeCard c={coffee} scores={scores} />
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WALL OF SHAME
         ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: "4rem 1.5rem",
        background: "linear-gradient(180deg, #F5F0E6 0%, #FAFAF7 100%)",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.3em",
              textTransform: "uppercase", color: "#8B2500", marginBottom: "0.5rem",
            }}>Accountability</div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#2C1810",
            }}>Wall of Shame</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {shamePreview.map((s: any, i: number) => (
              <GlassCard key={i} hover glow style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "1rem 1.25rem",
              }}>
                <div>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#2C1810" }}>{s.brand}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#999", marginLeft: "0.75rem" }}>{s.category}</span>
                </div>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.88rem", fontWeight: 700,
                  color: s.severity >= 80 ? "#8B2500" : s.severity >= 50 ? "#C5A23C" : "#6B5B4F",
                  textShadow: s.severity >= 80 ? "0 1px 6px rgba(139,37,0,0.2)" : "none",
                }}>{s.severity}/100</span>
              </GlassCard>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link href="/brewsoul/wall-of-shame" style={{
              textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
              letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B2500",
            }}>{"See the Full Wall \u2192"}</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          RESEARCH HUB
         ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "4rem 1.5rem", background: "linear-gradient(180deg, transparent 0%, rgba(139,105,20,0.03) 50%, transparent 100%)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.5rem" }}>Deep Research</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#2C1810" }}>The Intelligence Library</h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.92rem", color: "#6B5B4F", maxWidth: 520, margin: "0.75rem auto 0", lineHeight: 1.6 }}>Peer-reviewed research. Complete brand censuses. Personalized protocols. No sponsored content.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {[
              { path: "/brewsoul/biodynamic", icon: "\u{1F33F}", title: "Biodynamic Census", sub: "3 Demeter farms, 6 roasters, every product priced", tag: "COMPLETE" },
              { path: "/brewsoul/decaf", icon: "\u{1F4A7}", title: "Decaf Done Right", sub: "13 clean brands vs. 10+ using paint stripper", tag: "13 BRANDS" },
              { path: "/brewsoul/health", icon: "\u{1F9EC}", title: "Coffee & Health", sub: "8 longevity benefits, 7 real risks, CYP1A2 genetics", tag: "SCIENCE" },
              { path: "/brewsoul/prescription", icon: "\u{1F489}", title: "Your Prescription", sub: "AI-powered daily protocol based on your genetics", tag: "AI" },
            ].map(card => (
              <Link key={card.path} href={card.path} style={{ textDecoration: "none" }}>
                <GlassCard glow hover style={{ padding: "1.5rem", height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.8rem" }}>{card.icon}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.15em", background: "rgba(139,105,20,0.08)", color: "#8B6914", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>{card.tag}</span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.4rem" }}>{card.title}</div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: "#6B5B4F", lineHeight: 1.5 }}>{card.sub}</div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HEALTH TICKER
         ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: "4rem 1.5rem", textAlign: "center",
        background: "transparent",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.3em",
            textTransform: "uppercase", color: "#8B6914", marginBottom: "1.25rem",
          }}>Health & Science</div>
          <GlassCard hover={false} glow style={{ padding: "2rem 1.5rem", marginBottom: "1rem" }}>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#2C1810",
              lineHeight: 1.7, fontStyle: "italic", minHeight: "3rem", margin: 0,
            }}>
              {'\u201C'}{HEALTH_FACTS[healthIdx]}{'\u201D'}
            </p>
          </GlassCard>
          <button onClick={() => setHealthIdx((healthIdx + 1) % HEALTH_FACTS.length)} style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.15em",
            textTransform: "uppercase", padding: "0.75rem 1.5rem", borderRadius: "6px",
            background: "rgba(255,255,255,0.6)", color: "#8B6914",
            border: "1px solid rgba(139,105,20,0.2)", cursor: "pointer",
            backdropFilter: "blur(12px)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >{"Next Fact \u2192"}</button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER — Warm glass
         ═══════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: "linear-gradient(180deg, #F5F0E6, #EDE7D9)",
        borderTop: "1px solid rgba(139,105,20,0.1)",
        padding: "3rem 1.5rem 2rem", textAlign: "center",
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#6F4E37", marginBottom: "0.5rem" }}>
          {"BrewSoul \u2014 The Coffee Intelligence Engine"}
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: "1.5rem" }}>
          Every Cup Is a Vote
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <a href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6F4E37", textDecoration: "none" }}>Tony Greenberg</a>
          <a href="https://mezcalagave-ahru9fq8.manus.space" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6F4E37", textDecoration: "none" }}>SoulSmoke</a>
          <a href="https://tequilaazul-fxqrr3js.manus.space" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6F4E37", textDecoration: "none" }}>LiquidSun</a>
          <a href="/find-your-sake" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6F4E37", textDecoration: "none" }}>Find Your Sake</a>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#BBB", letterSpacing: "0.1em" }}>
          Original content. No copying from Cup of Excellence/ACE/third parties. All prices USD.
        </div>
      </footer>
      <JourneyBar />
      <div style={{ height: "80px" }} />{/* spacer for fixed JourneyBar */}
    </div>
  );
}
