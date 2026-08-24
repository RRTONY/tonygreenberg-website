import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { COFFEES } from "@/data/brewsoul-coffees";
import { computeQPR, computeTier } from "@/lib/intelligence-engine/scoring";
import type { CatalogItem } from "@/lib/intelligence-engine/types";
import BrewSoulLayout from "./BrewSoulLayout";
import { CoffeeCard } from "./BrewSoulHome";
import JourneyBar, { useMarkVisited } from "./JourneyBar";
import SEO from "@/components/SEO";

type SortKey = "qpr" | "price-asc" | "price-desc" | "cupping" | "name";

const ORIGINS = Array.from(new Set(COFFEES.map(c => c.originCountry))).sort();
const PROCESSES = Array.from(new Set(COFFEES.map(c => c.processingMethod))).sort();
const ROASTERS = Array.from(new Set(COFFEES.map(c => c.producer))).sort();

/* ── CDN hero images ── */
const HERO_BEANS = "/api/img/brewsoul-orig_84eb4bc9.jpg";

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
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.12,
        vy: -Math.random() * 0.18 - 0.02,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.45 + 0.12,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let t = 0;
    const draw = () => {
      t += 0.005;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.pulse) * 0.06;
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
function GlassCard({ children, style, hover = true }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hover?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
<div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.88)"
          : "rgba(255,255,255,0.55)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        border: hovered
          ? "1.5px solid rgba(139,105,20,0.45)"
          : "1px solid rgba(139,105,20,0.12)",
        borderRadius: "14px",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-3px) scale(1.005)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 14px 44px rgba(139,105,20,0.18), 0 0 0 1px rgba(212,185,106,0.12), inset 0 1px 0 rgba(255,255,255,0.8)"
          : "0 4px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.6)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Parallax hero background ── */
function ParallaxHero({ src }: { src: string }) {
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
    <div ref={ref} style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", overflow: "hidden", zIndex: 0 }}>
      <img
        src={src} alt=""
        style={{
          width: "100%", height: "140%", objectFit: "cover",
          objectPosition: "center 40%",
          filter: "saturate(1.15) brightness(1.05)",
          transform: `translateY(${offset}px) scale(1.1)`,
          transition: "transform 0.1s linear",
        }}
      />
      {/* Warm gradient fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "70%",
        background: "linear-gradient(to top, #F0E8D8 0%, rgba(240,232,216,0.85) 45%, transparent 100%)",
        zIndex: 1,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(240,232,216,0.3) 100%)",
        zIndex: 1,
      }} />
    </div>
  );
}

/* ── Glass select ── */
function GlassSelect({ value, onChange, children }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.72rem",
        padding: "0.55rem 0.85rem",
        borderRadius: "10px",
        border: "1px solid rgba(139,105,20,0.15)",
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "#2C1810",
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {children}
    </select>
  );
}

export default function BrewSoulBrowse() {
  const [sort, setSort] = useState<SortKey>("qpr");
  const [origin, setOrigin] = useState("");
  const [process, setProcess] = useState("");
  const [roaster, setRoaster] = useState("");
  const [moldOnly, setMoldOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);
  const [search, setSearch] = useState("");

  const scored = useMemo(() => {
    return COFFEES.map(c => ({
      coffee: c,
      scores: {
        qpr: computeQPR(c, COFFEES),
        tier: computeTier(c.cuppingScore || 0),
        availability: 0, scarcity: 0, wow: 0, freshness: "green" as const,
      },
    }));
  }, []);

  const filtered = useMemo(() => {
    let items = scored;
    if (origin) items = items.filter(x => x.coffee.originCountry === origin);
    if (process) items = items.filter(x => x.coffee.processingMethod === process);
    if (roaster) items = items.filter(x => x.coffee.producer === roaster);
    if (moldOnly) items = items.filter(x => x.coffee.moldTestStatus === "verified");
    items = items.filter(x => x.coffee.priceUsd <= maxPrice);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(x =>
        x.coffee.name.toLowerCase().includes(q) ||
        x.coffee.producer.toLowerCase().includes(q) ||
        x.coffee.variety.toLowerCase().includes(q) ||
        x.coffee.tastingNotes.some(n => n.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case "qpr": return [...items].sort((a, b) => b.scores.qpr - a.scores.qpr);
      case "price-asc": return [...items].sort((a, b) => a.coffee.priceUsd - b.coffee.priceUsd);
      case "price-desc": return [...items].sort((a, b) => b.coffee.priceUsd - a.coffee.priceUsd);
      case "cupping": return [...items].sort((a, b) => (b.coffee.cuppingScore || 0) - (a.coffee.cuppingScore || 0));
      case "name": return [...items].sort((a, b) => a.coffee.name.localeCompare(b.coffee.name));
      default: return items;
    }
  }, [scored, origin, process, roaster, moldOnly, maxPrice, search, sort]);

  useMarkVisited("browse");
  return (
    <>
      <SEO
        title="Browse Coffee — BrewSoul"
        description="Browse specialty coffees by origin, process, roast level, and flavor profile."
        path="/brewsoul/browse"
        keywords="Tony Greenberg, browse coffee, specialty coffee, coffee catalog"
        indexable={true}
      />
    <BrewSoulLayout>
      {/* ═══════ HERO SECTION ═══════ */}
      <section style={{ position: "relative", minHeight: "clamp(340px, 45vh, 500px)", overflow: "hidden" }}>
        <ParallaxHero src={HERO_BEANS} />
        <WarmParticles />

        <div style={{
          position: "relative", zIndex: 4,
          maxWidth: "900px", margin: "0 auto",
          padding: "clamp(3rem, 8vh, 5rem) 1.5rem 2rem",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "#C5A23C", marginBottom: "0.75rem",
            textShadow: "0 1px 8px rgba(139,105,20,0.15)",
          }}>
            The Catalog
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            fontWeight: 700, color: "#2C1810",
            lineHeight: 1.15, marginBottom: "0.75rem",
          }}>
            Browse All Coffees
          </h1>

          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "clamp(0.92rem, 1.5vw, 1.1rem)",
            color: "#6B5B4F", maxWidth: "600px", margin: "0 auto 1.5rem",
            lineHeight: 1.6,
          }}>
            {COFFEES.length} coffees scored, tested, and traced. Filter by what matters to you.
          </p>

          {/* Stat pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {[
              { val: String(COFFEES.length), label: "Coffees" },
              { val: String(ORIGINS.length), label: "Origins" },
              { val: String(ROASTERS.length), label: "Roasters" },
            ].map(s => (
              <GlassCard key={s.label} hover={false} style={{ padding: "0.6rem 1.25rem", textAlign: "center" }}>
                <span style={{
                  fontFamily: "'Playfair Display', serif", fontSize: "1.3rem",
                  fontWeight: 700, color: "#8B6914",
                  textShadow: "0 1px 8px rgba(139,105,20,0.2)",
                }}>{s.val}</span>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "rgba(90,74,32,0.5)", marginLeft: "0.5rem",
                }}>{s.label}</span>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CONTEXTUAL INTRO (glass card) ═══════ */}
      <section style={{
        background: "linear-gradient(180deg, #F0E8D8 0%, #FAFAF7 100%)",
        padding: "0 1.5rem 2rem",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <GlassCard hover={false} style={{ padding: "1.25rem 1.5rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#6B5B4F", lineHeight: 1.65, marginBottom: "0.5rem" }}>
              <strong style={{ color: "#6F4E37" }}>What you're looking at:</strong> Every coffee in the BrewSoul catalog — from competition-winning micro-lots to commodity blends — scored on cupping quality, value (QPR), sourcing ethics, and traceability. The best and worst extremes are both here, intentionally.
            </p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#6B5B4F", lineHeight: 1.65, marginBottom: "0.5rem" }}>
              <strong style={{ color: "#6F4E37" }}>Why it matters:</strong> Most coffee ratings are pay-to-play or self-reported. This catalog aggregates SCA cupping scores, blind panel results, and supply chain audits into a single, objective profile for each coffee.
            </p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#6B5B4F", lineHeight: 1.65, margin: 0 }}>
              <strong style={{ color: "#6F4E37" }}>What to do:</strong> Sort by QPR (quality-to-price ratio) to find the best value. Filter by origin, process, or roast level. Click any card for the full scoring breakdown and tasting notes.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* ═══════ FILTERS & SEARCH (glass toolbar) ═══════ */}
      <section style={{
        position: "sticky", top: "52px", zIndex: 100,
        background: "rgba(250,250,247,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(139,105,20,0.08)",
        padding: "0.75rem 1.5rem",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Search bar */}
          <div style={{ marginBottom: "0.75rem" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, roaster, variety, or tasting note..."
              style={{
                width: "100%", maxWidth: "500px",
                fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.92rem",
                padding: "0.7rem 1rem",
                borderRadius: "12px",
                border: "1px solid rgba(139,105,20,0.12)",
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                color: "#2C1810",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
                transition: "all 0.25s ease",
              }}
            />
          </div>

          {/* Filter row */}
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
            <GlassSelect value={sort} onChange={e => setSort(e.target.value as SortKey)}>
              <option value="qpr">Sort: Best QPR</option>
              <option value="cupping">Sort: Highest Score</option>
              <option value="price-asc">Sort: Price Low→High</option>
              <option value="price-desc">Sort: Price High→Low</option>
              <option value="name">Sort: A→Z</option>
            </GlassSelect>

            <GlassSelect value={origin} onChange={e => setOrigin(e.target.value)}>
              <option value="">All Origins</option>
              {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
            </GlassSelect>

            <GlassSelect value={process} onChange={e => setProcess(e.target.value)}>
              <option value="">All Processing</option>
              {PROCESSES.map(p => <option key={p} value={p}>{p}</option>)}
            </GlassSelect>

            <GlassSelect value={roaster} onChange={e => setRoaster(e.target.value)}>
              <option value="">All Roasters</option>
              {ROASTERS.map(r => <option key={r} value={r}>{r}</option>)}
            </GlassSelect>

            <label style={{
              display: "flex", alignItems: "center", gap: "0.35rem",
              fontFamily: "'DM Mono', monospace", fontSize: "0.72rem",
              color: "#4A7C59", cursor: "pointer",
              background: "rgba(74,124,89,0.06)",
              padding: "0.45rem 0.75rem",
              borderRadius: "10px",
              border: "1px solid rgba(74,124,89,0.12)",
            }}>
              <input type="checkbox" checked={moldOnly} onChange={e => setMoldOnly(e.target.checked)}
                style={{ accentColor: "#4A7C59" }} />
              Mold-Free Only
            </label>

            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(255,255,255,0.5)",
              padding: "0.4rem 0.75rem",
              borderRadius: "10px",
              border: "1px solid rgba(139,105,20,0.1)",
            }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#6F4E37" }}>
                Max ${maxPrice}
              </span>
              <input type="range" min={10} max={200} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ accentColor: "#8B6914", width: "100px" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ RESULTS GRID ═══════ */}
      <section style={{
        background: "linear-gradient(180deg, #FAFAF7 0%, #F5F0E6 50%, #FAFAF7 100%)",
        padding: "2rem 1.5rem 4rem",
        minHeight: "60vh",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Results count */}
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.72rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "#C5A23C", marginBottom: "1.25rem",
          }}>
            {filtered.length} coffee{filtered.length !== 1 ? "s" : ""} found
          </div>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}>
            {filtered.map(({ coffee, scores }) => (
              <Link key={coffee.id} href={`/brewsoul/coffee/${coffee.id}`} style={{ textDecoration: "none" }}>
                <CoffeeCard c={coffee} scores={scores} />
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <GlassCard hover={false} style={{ textAlign: "center", padding: "4rem 2rem", maxWidth: "500px", margin: "2rem auto" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>☕</div>
              <p style={{
                fontFamily: "'Playfair Display', serif", fontSize: "1.2rem",
                color: "#2C1810", marginBottom: "0.5rem",
              }}>
                No coffees match your filters.
              </p>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.92rem",
                color: "#6B5B4F",
              }}>
                Try broadening your search or resetting a filter.
              </p>
            </GlassCard>
          )}
        </div>
      </section>
    </BrewSoulLayout>
    <JourneyBar />
    <div style={{ height: "80px" }} />
  </>
  );
}
