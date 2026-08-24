import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { COFFEES } from "@/data/brewsoul-coffees";
import { computeQPR, computeTier, tierEmoji } from "@/lib/intelligence-engine/scoring";
import JourneyBar, { useMarkVisited } from "./JourneyBar";
import SEO from "@/components/SEO";

/* ── CDN hero images (same as welcome page) ── */
const HERO_EXPLODE = "/api/img/brewsoul-orig_84eb4bc9.jpg";
const HERO_POUR = "/api/img/brewsoul-orig_84eb4bc9.jpg";
const HERO_EXTRACT = "/api/img/brewsoul-orig_84eb4bc9.jpg";

const QUESTIONS = [
  { q: "How do you feel about bright, citrusy acidity?", dim: "acidity", icon: "\u{1F34B}", opts: [
    { text: "Love it \u2014 the brighter the better", score: 9 },
    { text: "I enjoy some brightness", score: 6 },
    { text: "Prefer smooth and mellow", score: 3 },
    { text: "Hate it \u2014 give me zero acidity", score: 1 },
  ]},
  { q: "Body preference \u2014 how heavy in the mouth?", dim: "body", icon: "\u2615", opts: [
    { text: "Tea-like, delicate, transparent", score: 3 },
    { text: "Medium, balanced, silky", score: 5 },
    { text: "Full, creamy, coating", score: 8 },
    { text: "Thick, syrupy, chewy", score: 10 },
  ]},
  { q: "Sweetness \u2014 what kind?", dim: "sweetness", icon: "\u{1F36F}", opts: [
    { text: "Floral honey, raw sugar", score: 8 },
    { text: "Stone fruit, caramel", score: 6 },
    { text: "Dark chocolate, molasses", score: 4 },
    { text: "I don't care about sweetness", score: 2 },
  ]},
  { q: "Complexity \u2014 how adventurous?", dim: "complexity", icon: "\u{1F9EA}", opts: [
    { text: "Surprise me \u2014 the weirder the better", score: 10 },
    { text: "I like interesting but approachable", score: 7 },
    { text: "Clean and predictable is fine", score: 4 },
    { text: "Just good coffee, nothing fancy", score: 2 },
  ]},
  { q: "Fruit forward or chocolate forward?", dim: "fruitiness", icon: "\u{1F352}", opts: [
    { text: "Berries, citrus, tropical fruit all day", score: 9 },
    { text: "Some fruit is nice, balanced", score: 6 },
    { text: "Chocolate, nuts, caramel please", score: 3 },
    { text: "No preference", score: 5 },
  ]},
  { q: "How do you usually brew?", dim: "brew", icon: "\u{1F4A7}", opts: [
    { text: "Pour-over (V60, Chemex, Kalita)", score: 0 },
    { text: "Espresso", score: 0 },
    { text: "French press / AeroPress", score: 0 },
    { text: "Cold brew", score: 0 },
    { text: "Drip machine", score: 0 },
  ]},
  { q: "Budget per bag?", dim: "budget", icon: "\u{1F4B0}", opts: [
    { text: "Under $15", score: 15 },
    { text: "$15\u201325", score: 25 },
    { text: "$25\u201345", score: 45 },
    { text: "$45+ \u2014 quality over price", score: 200 },
  ]},
];

function matchScore(coffee: typeof COFFEES[0], prefs: Record<string, number>): number {
  let score = 0;
  const fp = coffee.flavorProfile;
  const dims = ["acidity", "body", "sweetness", "complexity", "fruitiness"];
  for (const dim of dims) {
    if (prefs[dim] != null && fp[dim] != null) {
      const diff = Math.abs(prefs[dim] - fp[dim]);
      score += Math.max(0, 10 - diff);
    }
  }
  if (prefs.budget && coffee.priceUsd <= prefs.budget) score += 5;
  return score;
}

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
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.2 - 0.02,
        r: Math.random() * 2 + 0.5,
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

/* ── Glass card on LIGHT background ── */
function GlassCard({ children, style, onClick, hover = true, selected = false }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
  selected?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = hovered || selected;
  return (
<div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: isActive
          ? "rgba(255,255,255,0.85)"
          : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        border: isActive
          ? "1.5px solid rgba(139,105,20,0.5)"
          : "1px solid rgba(139,105,20,0.15)",
        borderRadius: "14px",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: onClick ? "pointer" : "default",
        transform: isActive ? "translateY(-3px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: isActive
          ? "0 12px 40px rgba(139,105,20,0.2), 0 0 0 1px rgba(212,185,106,0.15), inset 0 1px 0 rgba(255,255,255,0.8)"
          : "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function BrewSoulQuiz() {
  useMarkVisited("quiz");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [fadeIn, setFadeIn] = useState(true);
  const done = step >= QUESTIONS.length;

  const matches = useMemo(() => {
    if (!done) return [];
    return COFFEES
      .map(c => ({ coffee: c, match: matchScore(c, answers), qpr: computeQPR(c, COFFEES), tier: computeTier(c.cuppingScore || 0) }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 8);
  }, [done, answers]);

  const pick = (dim: string, score: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [dim]: score }));
      setStep(step + 1);
      setFadeIn(true);
    }, 250);
  };

  // Cycle hero images based on question
  const heroImg = step < 3 ? HERO_EXPLODE : step < 5 ? HERO_POUR : HERO_EXTRACT;
  const progress = done ? 100 : (step / QUESTIONS.length) * 100;

  /* ── RESULTS SCREEN ── */
  if (done) {
    return (
      <div style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        background: "linear-gradient(170deg, #FAFAF7 0%, #F0E8D8 30%, #E8DCC8 60%, #F5F0E6 100%)",
      }}>
        {/* Parallax hero image */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "50vh",
          overflow: "hidden", zIndex: 0,
        }}>
          <img
            src={HERO_EXPLODE} alt="Coffee explosion"
            style={{
              width: "100%", height: "130%", objectFit: "cover",
              objectPosition: "center 30%",
              filter: "saturate(1.15) brightness(1.05)",
            }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
            background: "linear-gradient(to top, #F0E8D8 0%, rgba(240,232,216,0.7) 40%, transparent 100%)",
            zIndex: 1,
          }} />
        </div>
        <WarmParticles />

        {/* Progress bar */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "4px", background: "rgba(139,105,20,0.08)" }}>
          <div style={{
            height: "100%", background: "linear-gradient(90deg, #C5A23C, #8B6914)",
            width: "100%",
            boxShadow: "0 0 12px rgba(197,162,60,0.4)",
          }} />
        </div>

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          minHeight: "100vh", padding: "42vh 1.5rem 3rem", textAlign: "center",
        }}>
          <div style={{ maxWidth: "700px", width: "100%" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.3em",
              textTransform: "uppercase", color: "#8B6914", marginBottom: "0.75rem",
            }}>Your Palate Matches</div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
              fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2, marginBottom: "0.5rem",
            }}>We Found Your Coffees</h1>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#6A6A6A",
              marginBottom: "2rem", lineHeight: 1.6,
            }}>Ranked by how well they match your palate preferences across acidity, body, sweetness, complexity, and fruit.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {matches.map(({ coffee, match, qpr, tier }, i) => (
                <Link key={coffee.id} href={`/brewsoul/coffee/${coffee.id}`} style={{ textDecoration: "none" }}>
                  <GlassCard
                    hover={true}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      padding: "1rem 1.25rem", textAlign: "left",
                      border: i === 0 ? "2px solid rgba(139,105,20,0.4)" : undefined,
                    }}
                  >
                    <div style={{
                      fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700,
                      color: i === 0 ? "#8B6914" : "rgba(139,105,20,0.4)",
                      width: "2.5rem", textAlign: "center",
                      textShadow: i === 0 ? "0 2px 8px rgba(139,105,20,0.3)" : "none",
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#2C1810" }}>
                        {coffee.name}
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#6F4E37", letterSpacing: "0.03em" }}>
                        {coffee.producer} {'\u00B7'} {coffee.originCountry} {'\u00B7'} {coffee.variety}
                      </div>
                      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem", color: "#999", fontStyle: "italic" }}>
                        {coffee.tastingNotes.slice(0, 4).join(", ")}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{
                        fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", fontWeight: 700,
                        color: "#4A7C59",
                        textShadow: "0 1px 4px rgba(74,124,89,0.15)",
                      }}>
                        {Math.round((match / 55) * 100)}% match
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#999" }}>
                        QPR {qpr} {'\u00B7'} {tierEmoji(tier)} {'\u00B7'} ${coffee.priceUsd}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
              <button onClick={() => { setStep(0); setAnswers({}); }} style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.15em",
                textTransform: "uppercase", padding: "0.85rem 2rem", borderRadius: "6px",
                background: "linear-gradient(135deg, #C5A23C, #8B6914)", color: "#FAFAF7",
                border: "none", cursor: "pointer", fontWeight: 700,
                boxShadow: "0 6px 24px rgba(139,105,20,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,105,20,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(139,105,20,0.35)"; }}
              >{"Retake Quiz \u2192"}</button>
              <Link href="/brewsoul/browse" style={{ textDecoration: "none" }}>
                <button style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", padding: "0.85rem 2rem", borderRadius: "6px",
                  background: "rgba(255,255,255,0.7)", color: "#8B6914",
                  border: "1.5px solid rgba(139,105,20,0.3)", cursor: "pointer", fontWeight: 700,
                  backdropFilter: "blur(12px)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(139,105,20,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >{"Browse All Coffees"}</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── QUIZ QUESTION SCREENS ── */
  const cur = QUESTIONS[step];
  return (
    <div style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      background: "linear-gradient(170deg, #FAFAF7 0%, #F0E8D8 30%, #E8DCC8 60%, #F5F0E6 100%)",
    }}>
      <SEO
        title="Coffee Quiz — BrewSoul"
        description="Find your perfect coffee match with BrewSoul's diagnostic quiz."
        path="/brewsoul/quiz"
        keywords="Tony Greenberg, coffee quiz, find my coffee, coffee match"
        indexable={true}
      />
      {/* Parallax hero image — vivid, NOT dimmed */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "50vh",
        overflow: "hidden", zIndex: 0,
      }}>
        <img
          src={heroImg} alt="Coffee"
          style={{
            width: "100%", height: "130%", objectFit: "cover",
            objectPosition: "center 30%",
            filter: "saturate(1.15) brightness(1.05)",
            transition: "opacity 0.8s ease",
          }}
        />
        {/* Gradient fade to warm tan — NOT dark overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
          background: "linear-gradient(to top, #F0E8D8 0%, rgba(240,232,216,0.7) 40%, transparent 100%)",
          zIndex: 1,
        }} />
        {/* Subtle side vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(240,232,216,0.4) 100%)",
          zIndex: 1,
        }} />
      </div>
      <WarmParticles />

      {/* Progress bar — warm gold on light track */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "4px", background: "rgba(139,105,20,0.08)" }}>
        <div style={{
          height: "100%", background: "linear-gradient(90deg, #C5A23C, #8B6914)",
          width: `${progress}%`, transition: "width 0.5s ease",
          boxShadow: "0 0 12px rgba(197,162,60,0.4)",
        }} />
      </div>

      {/* Content wrapper */}
      <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Screen 0 cinematic header */}
        {step === 0 && (
          <div style={{
            textAlign: "center", padding: "6rem 1.5rem 1.5rem", maxWidth: "640px", margin: "0 auto",
            position: "relative", zIndex: 5,
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.35em",
              textTransform: "uppercase", color: "#8B6914", marginBottom: "1.25rem",
              textShadow: "0 1px 8px rgba(250,250,247,0.8)",
            }}>{"Taste Profile Builder"}</div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
              fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3,
              marginBottom: "1.25rem",
              textShadow: "0 2px 12px rgba(250,250,247,0.6)",
            }}>
              Seven questions.<br />
              <span style={{ color: "#8B6914" }}>Your perfect cup, decoded.</span>
            </h1>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.92rem", lineHeight: 1.8,
              color: "#4A4A4A", maxWidth: "520px", margin: "0 auto",
              background: "rgba(250,250,247,0.7)", borderRadius: "12px", padding: "1rem 1.25rem",
              backdropFilter: "blur(12px)",
            }}>
              We'll map your palate across acidity, body, sweetness, complexity, and fruit preference {'\u2014'} then match you to coffees from our catalog of 103 scored beans.
            </p>
          </div>
        )}

        {/* Question area */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: step === 0 ? "1rem 1.5rem 2rem" : "52vh 1.5rem 2rem",
          opacity: fadeIn ? 1 : 0, transition: "opacity 0.3s ease",
        }}>
          <div style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>
            {/* Step indicator */}
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.25em",
              textTransform: "uppercase", color: "rgba(139,105,20,0.5)", marginBottom: "1.5rem",
            }}>
              {step + 1} / {QUESTIONS.length}
            </div>

            {/* Question icon */}
            <div style={{
              fontSize: "2.5rem", marginBottom: "0.75rem",
              filter: "drop-shadow(0 4px 12px rgba(139,105,20,0.25))",
            }}>{cur.icon}</div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
              fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, marginBottom: "1.5rem",
            }}>{cur.q}</h2>

            {/* Options as glass cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {cur.opts.map((o, i) => (
                <GlassCard
                  key={i}
                  onClick={() => pick(cur.dim, o.score)}
                  style={{
                    padding: "0.85rem 1.25rem", textAlign: "left",
                    display: "flex", alignItems: "center", gap: "0.75rem",
                  }}
                >
                  {/* Option number badge */}
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(139,105,20,0.08), rgba(139,105,20,0.15))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", fontWeight: 700,
                    color: "#8B6914", flexShrink: 0,
                    border: "1px solid rgba(139,105,20,0.12)",
                  }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span style={{
                    fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.92rem", color: "#2A2A2A",
                  }}>{o.text}</span>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Back / Skip */}
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", padding: "1rem", paddingBottom: "2.5rem" }}>
          {step > 0 && (
            <button onClick={() => { setFadeIn(false); setTimeout(() => { setStep(step - 1); setFadeIn(true); }, 250); }} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
              color: "rgba(90,74,32,0.35)", letterSpacing: "0.12em",
            }}>{"\u2190 Back"}</button>
          )}
          <Link href="/brewsoul/browse" style={{ textDecoration: "none" }}>
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
              color: "rgba(90,74,32,0.25)", letterSpacing: "0.12em",
              cursor: "pointer",
            }}>{"Skip \u2014 browse all coffees \u2192"}</span>
          </Link>
        </div>
      </div>
      <JourneyBar />
      <div style={{ height: "80px" }} />
    </div>
  );
}
