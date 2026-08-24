/**
 * BREWSOUL GLASS HERO — Inline section for the homepage
 * 
 * Same visual DNA as JewelPopup: aurora nebula backdrop, floating particles,
 * prismatic light refraction, sacred geometry, glass-morphism cards.
 * But rendered as a full-width scroll-stopping section, not a popup.
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";

const HERO_IMG = "/api/img/brewsoul-orig_84eb4bc9.jpg";

/* ── Floating Particles Canvas (amber cathedral dust) ── */
function CoffeeParticles() {
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

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; hue: number; alpha: number; pulse: number }[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.35 - 0.05,
        r: Math.random() * 1.8 + 0.4,
        hue: Math.random() * 40 + 20,
        alpha: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let t = 0;
    const draw = () => {
      t += 0.008;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.pulse) * 0.12;
        p.y += p.vy;
        p.pulse += 0.015;

        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const glow = Math.sin(p.pulse) * 0.3 + 0.7;
        const a = p.alpha * glow;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
        grad.addColorStop(0, `hsla(${p.hue}, 75%, 60%, ${a * 0.35})`);
        grad.addColorStop(1, `hsla(${p.hue}, 75%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsla(${p.hue}, 85%, 75%, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 3,
      }}
    />
  );
}

/* ── Animated counter ── */
function AnimCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const dur = 1800;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(target * ease));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div ref={ref} style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "clamp(2rem, 5vw, 3rem)",
      fontWeight: 700,
      lineHeight: 1,
      backgroundImage: "linear-gradient(135deg, #C4841D, #F5EDE0, #D4B96A)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "bshTextShimmer 4s ease infinite",
    }}>
      {val}{suffix}
    </div>
  );
}

/* ── Glass stat card ── */
function GlassStat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "1.5rem 1.2rem",
        borderRadius: "16px",
        background: hovered
          ? "linear-gradient(165deg, rgba(196,132,29,0.12) 0%, rgba(13,11,10,0.7) 100%)"
          : "linear-gradient(165deg, rgba(245,237,224,0.06) 0%, rgba(13,11,10,0.6) 100%)",
        backdropFilter: "blur(20px) saturate(1.3)",
        border: `1px solid ${hovered ? "rgba(196,132,29,0.25)" : "rgba(245,237,224,0.06)"}`,
        boxShadow: hovered
          ? "0 12px 40px rgba(196,132,29,0.15), inset 0 1px 0 rgba(245,237,224,0.1)"
          : "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(245,237,224,0.05)",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "none",
        textAlign: "center",
        flex: 1,
        minWidth: "120px",
        cursor: "default",
      }}
    >
      <AnimCounter target={value} suffix={suffix} />
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.62rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(245,237,224,0.4)",
        marginTop: "0.5rem",
      }}>{label}</div>
    </div>
  );
}

/* ── Main Component ── */
export default function BrewSoulHero() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setMounted(true); },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "clamp(500px, 70vh, 700px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 1: Photo background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${HERO_IMG})`,
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        filter: "brightness(0.35) saturate(1.3)",
        transform: "scale(1.05)",
        transition: "transform 8s ease-out",
      }} />

      {/* Layer 2: Aurora nebula gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 25% 30%, rgba(196,132,29,0.15) 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(111,78,55,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(61,139,110,0.06) 0%, transparent 60%)",
        zIndex: 1,
      }} />

      {/* Layer 3: Animated aurora sweep */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden",
        opacity: mounted ? 0.25 : 0,
        transition: "opacity 2s ease",
        zIndex: 2,
      }}>
        <div style={{
          position: "absolute", inset: "-50%",
          background: "conic-gradient(from 0deg at 50% 50%, #C4841D15, #6F4E3715, #3D8B6E15, #C4841D15, #D4B96A15, #C4841D15)",
          animation: "bshAuroraRotate 30s linear infinite",
          filter: "blur(60px)",
        }} />
      </div>

      {/* Layer 4: Floating particles */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: mounted ? 1 : 0,
        transition: "opacity 2s ease 0.5s",
      }}>
        <CoffeeParticles />
      </div>

      {/* Layer 5: Sacred geometry watermark */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: "500px", height: "500px",
        transform: "translate(-50%, -50%)",
        opacity: mounted ? 0.04 : 0,
        transition: "opacity 3s ease 0.5s",
        animation: "bshGeoSpin 50s linear infinite",
        pointerEvents: "none", zIndex: 2,
      }}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
          <circle cx="100" cy="100" r="90" stroke="url(#bshGrad)" strokeWidth="0.4" />
          <circle cx="100" cy="55" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
          <circle cx="100" cy="145" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
          <circle cx="61" cy="77" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
          <circle cx="139" cy="77" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
          <circle cx="61" cy="123" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
          <circle cx="139" cy="123" r="45" stroke="url(#bshGrad)" strokeWidth="0.25" />
          <polygon points="100,10 177.3,55 177.3,145 100,190 22.7,145 22.7,55" stroke="url(#bshGrad)" strokeWidth="0.3" />
          <line x1="100" y1="10" x2="100" y2="190" stroke="url(#bshGrad)" strokeWidth="0.15" />
          <line x1="22.7" y1="55" x2="177.3" y2="145" stroke="url(#bshGrad)" strokeWidth="0.15" />
          <line x1="22.7" y1="145" x2="177.3" y2="55" stroke="url(#bshGrad)" strokeWidth="0.15" />
          <defs>
            <linearGradient id="bshGrad" x1="0" y1="0" x2="200" y2="200">
              <stop offset="0%" stopColor="#C4841D" />
              <stop offset="50%" stopColor="#D4B96A" />
              <stop offset="100%" stopColor="#C4841D" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Layer 6: Prismatic light streak */}
      <div style={{
        position: "absolute", top: "30%", left: "-100%",
        width: "200%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(196,132,29,0.4), rgba(212,185,106,0.3), rgba(196,132,29,0.4), transparent)",
        animation: "bshLightStreak 8s ease-in-out infinite",
        pointerEvents: "none", zIndex: 4,
      }} />

      {/* Content Container */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: "1100px", width: "100%",
        padding: "clamp(3rem, 6vh, 5rem) clamp(1.5rem, 4vw, 3rem)",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "2.5rem",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(30px)",
        transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s",
      }}>
        {/* Eyebrow */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.68rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(196,132,29,0.7)",
          textAlign: "center",
        }}>
          THE INTELLIGENCE ENGINE
        </div>

        {/* Headline with glitch treatment */}
        <div style={{ textAlign: "center" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            color: "rgba(245,237,224,0.95)",
            marginBottom: "0.4rem",
            position: "relative",
          }}>
            <span style={{ display: "inline-block", position: "relative" }}>
              <span aria-label="BrewSoul">BrewSoul</span>
              <span aria-hidden="true" style={{
                position: "absolute", top: "2px", left: "3px",
                color: "rgba(196,132,29,0.15)",
                clipPath: "inset(10% 0 60% 0)",
                animation: "bshGlitch 6s ease-in-out infinite",
                pointerEvents: "none",
              }}>BrewSoul</span>
            </span>
          </h2>

          {/* Contextual intro — WHAT / WHY / WHAT TO DO */}
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "rgba(245,237,224,0.55)",
            lineHeight: 1.7,
            maxWidth: "640px",
            margin: "0.5rem auto 0",
          }}>
            Coffee is the most consumed psychoactive substance on earth, yet most people have no idea what they're actually drinking. BrewSoul is an intelligence engine that objectively scores every coffee and chain on value, sourcing ethics, and experience — then matches you to your identity through what you drink.
          </p>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "rgba(212,185,106,0.6)",
            marginTop: "1rem",
            letterSpacing: "0.1em",
          }}>
            Take the quiz. Browse the scores. Find your soul.
          </p>
        </div>

        {/* Glass stat cards */}
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
          maxWidth: "600px",
          margin: "0 auto",
          width: "100%",
        }}>
          <GlassStat value={103} label="Coffees Scored" />
          <GlassStat value={100} label="Chains Ranked" />
          <GlassStat value={6} label="Soul Archetypes" />
        </div>

        {/* CTA buttons — prismatic glass */}
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}>
          <Link href="/brewsoul">
            <span style={{
              display: "inline-block",
              position: "relative",
              overflow: "hidden",
              padding: "0.9rem 2.2rem",
              background: "linear-gradient(135deg, #C4841D 0%, #6F4E37 50%, #D4B96A 100%)",
              backgroundSize: "200% 200%",
              animation: "bshCtaShimmer 4s ease infinite",
              borderRadius: "8px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "#F5EDE0",
              textDecoration: "none",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(196,132,29,0.25), 0 2px 10px rgba(0,0,0,0.2)",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px) scale(1.03)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 45px rgba(196,132,29,0.35), 0 4px 15px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "none";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(196,132,29,0.25), 0 2px 10px rgba(0,0,0,0.2)";
              }}
            >
              <span style={{
                position: "absolute", top: 0, left: "-100%",
                width: "100%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(245,237,224,0.12), transparent)",
                animation: "bshBtnSweep 3s ease-in-out infinite",
                pointerEvents: "none",
              }} />
              <span style={{ position: "relative", zIndex: 1 }}>Discover Your Identity</span>
            </span>
          </Link>

          <Link href="/brewsoul/browse">
            <span style={{
              display: "inline-block",
              padding: "0.9rem 2.2rem",
              background: "rgba(245,237,224,0.04)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(196,132,29,0.25)",
              borderRadius: "8px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "rgba(212,185,106,0.8)",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(196,132,29,0.1)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,132,29,0.5)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(245,237,224,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,132,29,0.25)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >Browse Top QPR →</span>
          </Link>

          <Link href="/brewsoul/chains">
            <span style={{
              display: "inline-block",
              padding: "0.9rem 2.2rem",
              background: "rgba(245,237,224,0.04)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(111,78,55,0.2)",
              borderRadius: "8px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "rgba(245,237,224,0.5)",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(111,78,55,0.1)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(111,78,55,0.4)";
                (e.currentTarget as HTMLElement).style.color = "rgba(245,237,224,0.7)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(245,237,224,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(111,78,55,0.2)";
                (e.currentTarget as HTMLElement).style.color = "rgba(245,237,224,0.5)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >Chain Rankings →</span>
          </Link>
        </div>

        {/* Tagline */}
        <div style={{
          textAlign: "center",
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.82rem",
          color: "rgba(245,237,224,0.25)",
          fontStyle: "italic",
        }}>
          "The cup doesn't lie. It just waits for you to listen."
        </div>
      </div>

      {/* Bottom gradient fade into page */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "80px",
        background: "linear-gradient(to bottom, transparent, #FAFAF7)",
        zIndex: 5,
      }} />

      {/* Animations */}
      <style>{`
        @keyframes bshAuroraRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bshGeoSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes bshLightStreak {
          0%, 100% { transform: translateX(-30%); opacity: 0; }
          35% { opacity: 0.8; }
          50% { transform: translateX(30%); opacity: 0.8; }
          85%, 100% { transform: translateX(60%); opacity: 0; }
        }
        @keyframes bshTextShimmer {
          0% { background-position: 0% center; }
          50% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }
        @keyframes bshCtaShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bshBtnSweep {
          0%, 100% { left: -100%; }
          50% { left: 100%; }
        }
        @keyframes bshGlitch {
          0%, 90%, 100% { clip-path: inset(10% 0 60% 0); opacity: 0; }
          92% { clip-path: inset(20% 0 40% 0); opacity: 1; transform: translate(2px, -1px); }
          94% { clip-path: inset(50% 0 10% 0); opacity: 1; transform: translate(-3px, 1px); }
          96% { clip-path: inset(5% 0 70% 0); opacity: 1; transform: translate(1px, 2px); }
          98% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
