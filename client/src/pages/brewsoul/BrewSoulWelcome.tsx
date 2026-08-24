import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import SEO from "@/components/SEO";

/* ── CDN hero images ── */
const HERO_EXPLODE = "/api/img/brewsoul-orig_84eb4bc9.jpg";
const HERO_POUR = "/api/img/brewsoul-orig_84eb4bc9.jpg";
const HERO_EXTRACT = "/api/img/brewsoul-orig_84eb4bc9.jpg";

/* ── Assessment screens data ── */
const SCREENS = [
  {
    q: "Why are you here today?",
    sub: "",
    multi: false,
    opts: [
      { emoji: "\u{1F50D}", text: "I want better coffee at home", tag: "consumer" },
      { emoji: "\u{1F4BC}", text: "I source, sell, or serve coffee professionally", tag: "b2b" },
      { emoji: "\u{1F30D}", text: "I want to understand where my money goes", tag: "impact" },
      { emoji: "\u{1F9EA}", text: "I'm a coffee nerd and I want to go deeper", tag: "connoisseur" },
      { emoji: "\u{1F937}", text: "I'm curious \u2014 surprise me", tag: "discovery" },
    ],
  },
  {
    q: "Your current relationship with coffee \u2014 be honest:",
    sub: "",
    multi: false,
    opts: [
      { emoji: "\u2615", text: "It's fuel. I need it to function. Don't romanticize it.", tag: "functional" },
      { emoji: "\u{1F3AD}", text: "It's a ritual. The making matters as much as the drinking.", tag: "ritual" },
      { emoji: "\u{1F52C}", text: "It's a rabbit hole. I own a refractometer.", tag: "obsessed" },
      { emoji: "\u{1F4B0}", text: "It's a business. I need intelligence, not inspiration.", tag: "professional" },
      { emoji: "\u{1F331}", text: "It's a vote. Every purchase is political.", tag: "activist" },
    ],
  },
  {
    q: "The hard questions \u2014 coffee's dark side:",
    sub: "Coffee isn't all good. We believe in full disclosure. Which concerns you most?",
    multi: false,
    opts: [
      { emoji: "\u{1F634}", text: "Sleep disruption \u2014 caffeine has a 6-hour half-life", tag: "sleep" },
      { emoji: "\u{1F494}", text: "Anxiety & cortisol \u2014 spikes stress hormones", tag: "anxiety" },
      { emoji: "\u{1F9B4}", text: "Bone density \u2014 interferes with calcium absorption", tag: "bone" },
      { emoji: "\u{1F30D}", text: "Environmental cost \u2014 water, deforestation, carbon", tag: "environment" },
      { emoji: "\u{1F468}\u200D\u{1F33E}", text: "Human cost \u2014 poverty wages, child labor", tag: "human" },
      { emoji: "\u2705", text: "None \u2014 the benefits outweigh it for me", tag: "none" },
      { emoji: "\u{1F4DA}", text: "All of them \u2014 show me everything", tag: "all" },
    ],
  },
  {
    q: "And the bright side \u2014 what do you love about it?",
    sub: "",
    multi: false,
    opts: [
      { emoji: "\u{1F9E0}", text: "Cognitive enhancement \u2014 focus, memory, reaction time", tag: "cognitive" },
      { emoji: "\u{1F3C3}", text: "Physical performance \u2014 endurance improvement", tag: "physical" },
      { emoji: "\u2764\uFE0F", text: "Longevity markers \u2014 lower all-cause mortality", tag: "longevity" },
      { emoji: "\u{1F6E1}\uFE0F", text: "Antioxidant powerhouse \u2014 #1 source in Western diets", tag: "antioxidant" },
      { emoji: "\u{1F9EC}", text: "Disease risk reduction \u2014 Parkinson's, diabetes, cancer", tag: "disease" },
      { emoji: "\u{1F3A8}", text: "The experience \u2014 flavor complexity, ritual, community", tag: "experience" },
      { emoji: "\u{1F60A}", text: "It makes me happy \u2014 dopamine is underrated", tag: "happy" },
    ],
  },
  {
    q: "Quick palate check:",
    sub: "These map your flavor preferences to coffee origins and processing methods.",
    multi: false,
    type: "palate" as const,
    opts: [] as { emoji: string; text: string; tag: string }[],
  },
  {
    q: "What would make you pay MORE for coffee?",
    sub: "",
    multi: true,
    opts: [
      { emoji: "\u{1F50D}", text: "Verified farmer payment transparency", tag: "transparency" },
      { emoji: "\u{1F9EB}", text: "Third-party mold/mycotoxin testing", tag: "mold" },
      { emoji: "\u{1F48E}", text: "Rare variety (Gesha, Eugenioides, Laurina)", tag: "rare" },
      { emoji: "\u{1F9EA}", text: "Experimental processing (anaerobic, carbonic)", tag: "experimental" },
      { emoji: "\u{1F3C6}", text: "Competition winner or 90+ SCA score", tag: "competition" },
      { emoji: "\u{1F4B5}", text: "I won't \u2014 price is price", tag: "price" },
    ],
  },
  {
    q: "The weirdness scale \u2014 how deep do you want to go?",
    sub: "",
    multi: false,
    type: "slider" as const,
    opts: [] as { emoji: string; text: string; tag: string }[],
  },
  {
    q: "One last thing \u2014 how do you drink it?",
    sub: "",
    multi: false,
    opts: [
      { emoji: "\u26AB", text: "Black, always", tag: "purist" },
      { emoji: "\u{1F95B}", text: "With milk/oat milk", tag: "latte" },
      { emoji: "\u{1F9CA}", text: "Iced or cold brew", tag: "cold" },
      { emoji: "\u{1F3A8}", text: "It depends on the coffee", tag: "flexible" },
    ],
  },
];

const PALATE_QUESTIONS = [
  { label: "Grapefruit:", options: ["Love it", "Tolerate it", "Hate it"], dim: "acid" },
  { label: "Dark chocolate:", options: ["55%", "72%", "85%+"], dim: "bitter" },
  { label: "Wine:", options: ["Clean whites", "Natural/funky", "Big reds", "Don't drink wine"], dim: "processing" },
  { label: "Toast:", options: ["Barely golden", "Golden brown", "Dark & crunchy"], dim: "roast" },
];

const IDENTITIES = [
  { id: "terroir-purist", name: "The Terroir Purist", badge: "\u{1F33F}", color: "#4A7C59",
    desc: "You want the bean to speak. Light roasts, washed processing, single origins. Your heroes are Tim Wendelboe and George Howell. You probably own a refractometer.",
    path: ["Varieties", "Farm Passports", "QPR Best Value"],
    gear: [{ name: "Hario V60", price: "$9" }, { name: "Fellow Stagg EKG", price: "$165" }, { name: "Baratza Encore ESP", price: "$170" }],
  },
  { id: "fermentation-explorer", name: "The Fermentation Explorer", badge: "\u{1F9EA}", color: "#8B4585",
    desc: "You want coffee that makes you question what coffee IS. Anaerobic, carbonic maceration, thermal shock, koji. You're the natural wine person of the coffee world.",
    path: ["Processing Deep-Dive", "Experimental Lots", "Weirdest Coffees"],
    gear: [{ name: "AeroPress Clear", price: "$40" }, { name: "Timemore C3", price: "$70" }, { name: "Acaia Pearl", price: "$150" }],
  },
  { id: "ritual-architect", name: "The Ritual Architect", badge: "\u{1F3AD}", color: "#6F4E37",
    desc: "The making is the meditation. Pour-over is prayer with caffeine. Every variable is intentional. Your grinder cost more than your couch.",
    path: ["Brew Guide", "Gear Recs", "Daily Rotation Builder"],
    gear: [{ name: "Origami Dripper", price: "$38" }, { name: "Comandante C40", price: "$280" }, { name: "Fellow Atmos", price: "$30" }],
  },
  { id: "impact-alchemist", name: "The Impact Alchemist", badge: "\u{1F30D}", color: "#C5A23C",
    desc: "Where the dollar goes matters as much as what's in the cup. You want transparency, farmer equity, proof. Every purchase is a vote.",
    path: ["Follow The Dollar", "Transparency Scoreboard", "Farm Passports"],
    gear: [{ name: "Clever Dripper", price: "$25" }, { name: "JavaPresse", price: "$40" }, { name: "KeepCup", price: "$20" }],
  },
  { id: "pressure-seeker", name: "The Pressure Seeker", badge: "\u2615", color: "#8B2500",
    desc: "Espresso is your language. Crema is your metric. Intensity, body, speed. Dialing in a new single-origin espresso is your weekend project.",
    path: ["Espresso Catalog", "Gear", "Roaster Directory"],
    gear: [{ name: "Flair Signature", price: "$179" }, { name: "Normcore V4", price: "$40" }, { name: "Eureka Mignon Notte", price: "$249" }],
  },
  { id: "the-awakening", name: "The Awakening", badge: "\u2728", color: "#D4A574",
    desc: "You know you want better than Starbucks but don't know where to start. Perfect. That's exactly why we built this.",
    path: ["Coffee 101", "Taste Quiz", "Top 10 QPR"],
    gear: [{ name: "AeroPress Go", price: "$35" }, { name: "Timemore C2", price: "$55" }, { name: "Fellow Carter", price: "$30" }],
  },
];

function computeIdentity(answers: Record<number, string | string[]>): typeof IDENTITIES[0] {
  const scores: Record<string, number> = {};
  IDENTITIES.forEach(i => { scores[i.id] = 0; });
  const a0 = answers[0] as string;
  if (a0 === "consumer") { scores["ritual-architect"] += 2; scores["the-awakening"] += 2; }
  if (a0 === "b2b") { scores["pressure-seeker"] += 2; }
  if (a0 === "impact") { scores["impact-alchemist"] += 3; }
  if (a0 === "connoisseur") { scores["terroir-purist"] += 2; scores["fermentation-explorer"] += 2; }
  if (a0 === "discovery") { scores["fermentation-explorer"] += 1; scores["the-awakening"] += 2; }
  const a1 = answers[1] as string;
  if (a1 === "functional") { scores["the-awakening"] += 2; }
  if (a1 === "ritual") { scores["ritual-architect"] += 3; }
  if (a1 === "obsessed") { scores["terroir-purist"] += 2; scores["fermentation-explorer"] += 2; }
  if (a1 === "professional") { scores["pressure-seeker"] += 2; }
  if (a1 === "activist") { scores["impact-alchemist"] += 3; }
  const a7 = answers[7] as string;
  if (a7 === "purist") { scores["terroir-purist"] += 2; }
  if (a7 === "latte") { scores["pressure-seeker"] += 2; }
  if (a7 === "cold") { scores["fermentation-explorer"] += 1; }
  if (a7 === "flexible") { scores["ritual-architect"] += 1; }
  const weirdness = answers[6] as string;
  const w = parseInt(weirdness) || 5;
  if (w >= 7) { scores["fermentation-explorer"] += 3; }
  else if (w >= 4) { scores["terroir-purist"] += 1; }
  else { scores["the-awakening"] += 2; }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return IDENTITIES.find(i => i.id === best) || IDENTITIES[5];
}

/* ── Parallax hero image with scroll ── */
function ParallaxHero({ src, alt, speed = 0.3 }: { src: string; alt: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = -rect.top * speed;
      setOffset(scrolled);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
<div ref={ref} style={{
      position: "absolute", inset: "-20%", zIndex: 0, overflow: "hidden",
    }}>
      <img
        src={src} alt={alt}
        style={{
          width: "100%", height: "140%", objectFit: "cover",
          transform: `translateY(${offset}px) scale(1.1)`,
          transition: "transform 0.1s linear",
        }}
      />
    </div>
  );
}

/* ── Floating warm particles (golden dust in light) ── */
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
    for (let i = 0; i < 40; i++) {
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
        // Warm golden glow
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
function GlassCard({ children, style, onClick, hover = true, className = "", selected = false }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
  className?: string;
  selected?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = hovered || selected;
  return (
    <div
      className={className}
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
        borderRadius: "16px",
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

/* ── Main Component ── */
export default function BrewSoulWelcome() {
  const [, navigate] = useLocation();
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [palateAnswers, setPalateAnswers] = useState<Record<string, string>>({});
  const [weirdness, setWeirdness] = useState(5);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [identity, setIdentity] = useState<typeof IDENTITIES[0] | null>(null);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("brewsoul-identity");
    if (saved) navigate("/brewsoul/home");
  }, []);

  const totalScreens = SCREENS.length;
  const progress = identity ? 100 : ((screen) / totalScreens) * 100;

  const advance = useCallback((tag: string) => {
    setFadeIn(false);
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [screen]: tag }));
      if (screen < totalScreens - 1) {
        setScreen(screen + 1);
      } else {
        const result = computeIdentity({ ...answers, [screen]: tag });
        setIdentity(result);
        localStorage.setItem("brewsoul-identity", result.id);
      }
      setFadeIn(true);
    }, 300);
  }, [screen, answers, totalScreens]);

  const advanceMulti = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [screen]: multiSelect }));
      setMultiSelect([]);
      if (screen < totalScreens - 1) setScreen(screen + 1);
      setFadeIn(true);
    }, 300);
  }, [screen, multiSelect, totalScreens]);

  const advancePalate = useCallback(() => {
    if (Object.keys(palateAnswers).length < PALATE_QUESTIONS.length) return;
    setFadeIn(false);
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [screen]: JSON.stringify(palateAnswers) }));
      setScreen(screen + 1);
      setFadeIn(true);
    }, 300);
  }, [screen, palateAnswers]);

  const advanceSlider = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [screen]: String(weirdness) }));
      setScreen(screen + 1);
      setFadeIn(true);
    }, 300);
  }, [screen, weirdness]);

  const cur = SCREENS[screen];

  // Pick hero image based on screen
  const heroImg = screen < 3 ? HERO_EXPLODE : screen < 6 ? HERO_POUR : HERO_EXTRACT;

  /* ── IDENTITY REVEAL ── */
  if (identity) {
    return (
      <div style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        background: "linear-gradient(170deg, #FAFAF7 0%, #F0E8D8 30%, #E8DCC8 60%, #F5F0E6 100%)",
      }}>
        {/* Parallax hero image */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55vh", overflow: "hidden", zIndex: 0 }}>
          <ParallaxHero src={HERO_EXPLODE} alt="Coffee explosion" speed={0.2} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
            background: "linear-gradient(to top, #FAFAF7, transparent)",
            zIndex: 2,
          }} />
        </div>
        <WarmParticles />

        {/* Progress bar */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "4px", background: "rgba(139,105,20,0.08)" }}>
          <div style={{
            height: "100%", background: "linear-gradient(90deg, #C5A23C, #8B6914)",
            width: `${progress}%`, transition: "width 0.5s ease",
            boxShadow: "0 0 12px rgba(197,162,60,0.4)",
          }} />
        </div>

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          minHeight: "100vh", padding: "45vh 1.5rem 3rem", textAlign: "center",
        }}>
          <div style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.6s ease", maxWidth: "560px" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem", filter: "drop-shadow(0 4px 12px rgba(139,105,20,0.3))" }}>
              {identity.badge}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.3em",
              textTransform: "uppercase", color: "#8B6914", marginBottom: "0.75rem",
            }}>Your Coffee Identity</div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 6vw, 3rem)",
              fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2, marginBottom: "1rem",
            }}>{identity.name}</h1>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", lineHeight: 1.7,
              color: "#4A4A4A", marginBottom: "2rem",
            }}>{identity.desc}</p>

            {/* Recommended path */}
            <GlassCard hover={false} style={{ padding: "1.25rem", marginBottom: "1.25rem" }}>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em",
                textTransform: "uppercase", color: "#8B6914", marginBottom: "0.75rem",
              }}>Your Recommended Path</div>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                {identity.path.map((p, i) => (
                  <span key={i} style={{
                    fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem",
                    padding: "0.35rem 0.75rem", borderRadius: "20px",
                    background: "rgba(139,105,20,0.08)", color: "#5A4A20",
                    border: "1px solid rgba(139,105,20,0.15)",
                  }}>{i > 0 && "\u2192 "}{p}</span>
                ))}
              </div>
            </GlassCard>

            {/* Gear recs */}
            <GlassCard hover={false} style={{ padding: "1.25rem", marginBottom: "2rem" }}>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em",
                textTransform: "uppercase", color: "#8B6914", marginBottom: "0.75rem",
              }}>Starter Gear</div>
              {identity.gear.map((g, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", padding: "0.4rem 0",
                  borderBottom: i < identity.gear.length - 1 ? "1px solid rgba(139,105,20,0.08)" : "none",
                }}>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#2A2A2A" }}>{g.name}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", color: "#8B6914" }}>{g.price}</span>
                </div>
              ))}
            </GlassCard>

            <button onClick={() => navigate("/brewsoul/home")} style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", letterSpacing: "0.15em",
              textTransform: "uppercase", padding: "1rem 2.5rem", borderRadius: "6px",
              background: "linear-gradient(135deg, #C5A23C, #8B6914)", color: "#FAFAF7",
              border: "none", cursor: "pointer", fontWeight: 700,
              boxShadow: "0 6px 24px rgba(139,105,20,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,105,20,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(139,105,20,0.35)"; }}
            >
              {"Enter BrewSoul \u2192"}
            </button>

            <button onClick={() => navigate("/brewsoul/quiz")} style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "0.75rem 2rem", borderRadius: "6px",
              background: "rgba(197,162,60,0.1)", color: "#8B6914",
              border: "1px solid rgba(197,162,60,0.3)", cursor: "pointer",
              transition: "all 0.2s", marginTop: "0.5rem",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(197,162,60,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(197,162,60,0.1)"; }}
            >
              {"Or: Take the Taste Quiz \u2192"}
            </button>

            <button onClick={() => {
              setIdentity(null); setScreen(0); setAnswers({});
              localStorage.removeItem("brewsoul-identity");
            }} style={{
              display: "block", margin: "1rem auto 0", background: "none", border: "none",
              fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(90,74,32,0.4)",
              cursor: "pointer", letterSpacing: "0.1em",
            }}>Retake assessment</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── QUIZ SCREENS ── */
  return (
    <div style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      background: "linear-gradient(170deg, #FAFAF7 0%, #F0E8D8 30%, #E8DCC8 60%, #F5F0E6 100%)",
    }}>
      <SEO
        title="Welcome to BrewSoul"
        description="Start your BrewSoul journey — the world's most rigorous specialty coffee intelligence platform."
        path="/brewsoul/welcome"
        keywords="Tony Greenberg, BrewSoul, specialty coffee, coffee intelligence"
        indexable={true}
      />
      {/* Parallax hero image — visible, vivid, NOT dimmed */}
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

        {/* Screen 0 cinematic header — text overlays the vivid image */}
        {screen === 0 && (
          <div style={{
            textAlign: "center", padding: "6rem 1.5rem 1.5rem", maxWidth: "640px", margin: "0 auto",
            position: "relative", zIndex: 5,
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.35em",
              textTransform: "uppercase", color: "#8B6914", marginBottom: "1.25rem",
              textShadow: "0 1px 8px rgba(250,250,247,0.8)",
            }}>{"Before We Pour \u2014 Who Are You?"}</div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
              fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3,
              marginBottom: "1.25rem",
              textShadow: "0 2px 12px rgba(250,250,247,0.6)",
            }}>
              The world's most complex legal drug.<br />
              <span style={{ color: "#8B6914" }}>Let's find out who you are inside it.</span>
            </h1>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.92rem", lineHeight: 1.8,
              color: "#4A4A4A", maxWidth: "520px", margin: "0 auto",
              background: "rgba(250,250,247,0.7)", borderRadius: "12px", padding: "1rem 1.25rem",
              backdropFilter: "blur(12px)",
            }}>
              1,000+ flavor compounds. $200B industry. 125 million people depend on it for survival.
              Your relationship with coffee says more about you than you think.
              Eight questions. No wrong answers. A path built just for you.
            </p>
          </div>
        )}

        {/* Question area */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: screen === 0 ? "1rem 1.5rem 2rem" : "52vh 1.5rem 2rem",
          opacity: fadeIn ? 1 : 0, transition: "opacity 0.3s ease",
        }}>
          <div style={{ maxWidth: "580px", width: "100%", textAlign: "center" }}>
            {/* Step indicator */}
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.25em",
              textTransform: "uppercase", color: "rgba(139,105,20,0.5)", marginBottom: "1.5rem",
            }}>
              {screen + 1} / {totalScreens}
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
              fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, marginBottom: "0.75rem",
            }}>{cur.q}</h2>

            {cur.sub && (
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem",
                color: "#6A6A6A", lineHeight: 1.6, marginBottom: "1.5rem",
                fontStyle: "italic",
              }}>{cur.sub}</p>
            )}

            {/* ── Palate screen ── */}
            {cur.type === "palate" && (
              <div style={{ textAlign: "left", marginTop: "1rem" }}>
                {PALATE_QUESTIONS.map(pq => (
                  <div key={pq.dim} style={{ marginBottom: "1.25rem" }}>
                    <div style={{
                      fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem",
                      fontWeight: 600, color: "#2A2A2A", marginBottom: "0.5rem",
                    }}>{pq.label}</div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {pq.options.map(o => (
                        <button key={o} onClick={() => setPalateAnswers(prev => ({ ...prev, [pq.dim]: o }))} style={{
                          fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem",
                          padding: "0.5rem 1rem", borderRadius: "20px", cursor: "pointer",
                          border: palateAnswers[pq.dim] === o ? "2px solid #8B6914" : "1px solid rgba(139,105,20,0.15)",
                          background: palateAnswers[pq.dim] === o ? "rgba(139,105,20,0.1)" : "rgba(255,255,255,0.6)",
                          color: palateAnswers[pq.dim] === o ? "#8B6914" : "#4A4A4A",
                          transition: "all 0.2s",
                          backdropFilter: "blur(8px)",
                        }}>{o}</button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={advancePalate} disabled={Object.keys(palateAnswers).length < PALATE_QUESTIONS.length} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", padding: "0.85rem 2rem", borderRadius: "6px", marginTop: "1rem",
                  background: Object.keys(palateAnswers).length >= PALATE_QUESTIONS.length
                    ? "linear-gradient(135deg, #C5A23C, #8B6914)" : "rgba(139,105,20,0.06)",
                  color: Object.keys(palateAnswers).length >= PALATE_QUESTIONS.length
                    ? "#FAFAF7" : "rgba(139,105,20,0.3)",
                  border: "none", fontWeight: 700,
                  cursor: Object.keys(palateAnswers).length >= PALATE_QUESTIONS.length ? "pointer" : "default",
                  boxShadow: Object.keys(palateAnswers).length >= PALATE_QUESTIONS.length ? "0 4px 20px rgba(139,105,20,0.3)" : "none",
                }}>{"Continue \u2192"}</button>
              </div>
            )}

            {/* ── Slider screen ── */}
            {cur.type === "slider" && (
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ position: "relative", padding: "0 0.5rem" }}>
                  <input type="range" min={1} max={10} value={weirdness} onChange={e => setWeirdness(Number(e.target.value))} style={{
                    width: "100%", accentColor: "#8B6914", height: "8px",
                  }} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(90,74,32,0.45)" }}>{"1 \u2014 Just give me good coffee"}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(90,74,32,0.45)" }}>{"10 \u2014 Koji eugenioides"}</span>
                  </div>
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 700,
                  color: "#8B6914", margin: "1.5rem 0",
                  textShadow: "0 2px 12px rgba(139,105,20,0.2)",
                }}>{weirdness}</div>
                <div style={{
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem",
                  color: "#6A6A6A", fontStyle: "italic", marginBottom: "1.5rem",
                }}>
                  {weirdness <= 2 && "Reliable, well-sourced, no surprises."}
                  {weirdness === 3 && "Single-origin, well-sourced, traceable."}
                  {weirdness === 4 && "You appreciate variety and processing differences."}
                  {weirdness === 5 && "You want to understand what makes each coffee unique."}
                  {weirdness === 6 && "Experimental processing? Yes please."}
                  {weirdness === 7 && "Anaerobic fermentation, Sidra variety, thermal shock."}
                  {weirdness === 8 && "You seek out the unusual and the boundary-pushing."}
                  {weirdness === 9 && "Koji-fermented, single-tree lots, species experiments."}
                  {weirdness === 10 && "You'll pay $150 for 100g of koji-fermented eugenioides from a single tree."}
                </div>
                <button onClick={advanceSlider} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", padding: "0.85rem 2rem", borderRadius: "6px",
                  background: "linear-gradient(135deg, #C5A23C, #8B6914)", color: "#FAFAF7",
                  border: "none", cursor: "pointer", fontWeight: 700,
                  boxShadow: "0 4px 20px rgba(139,105,20,0.3)",
                }}>{"Continue \u2192"}</button>
              </div>
            )}

            {/* ── Multi-select screen ── */}
            {cur.multi && !cur.type && (
              <div style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {cur.opts.map(o => (
                    <GlassCard
                      key={o.tag}
                      selected={multiSelect.includes(o.tag)}
                      onClick={() => {
                        setMultiSelect(prev => prev.includes(o.tag) ? prev.filter(t => t !== o.tag) : [...prev, o.tag]);
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "0.85rem 1.25rem", textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem", filter: "drop-shadow(0 2px 6px rgba(139,105,20,0.2))" }}>{o.emoji}</span>
                      <span style={{
                        fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.92rem",
                        color: multiSelect.includes(o.tag) ? "#8B6914" : "#2A2A2A",
                        fontWeight: multiSelect.includes(o.tag) ? 600 : 400,
                      }}>{o.text}</span>
                    </GlassCard>
                  ))}
                </div>
                <button onClick={advanceMulti} disabled={multiSelect.length === 0} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", padding: "0.85rem 2rem", borderRadius: "6px", marginTop: "1.25rem",
                  background: multiSelect.length > 0 ? "linear-gradient(135deg, #C5A23C, #8B6914)" : "rgba(139,105,20,0.06)",
                  color: multiSelect.length > 0 ? "#FAFAF7" : "rgba(139,105,20,0.3)",
                  border: "none", fontWeight: 700,
                  cursor: multiSelect.length > 0 ? "pointer" : "default",
                  boxShadow: multiSelect.length > 0 ? "0 4px 20px rgba(139,105,20,0.3)" : "none",
                }}>{"Continue \u2192"}</button>
              </div>
            )}

            {/* ── Standard single-select ── */}
            {!cur.multi && !cur.type && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1rem" }}>
                {cur.opts.map(o => (
                  <GlassCard
                    key={o.tag}
                    onClick={() => advance(o.tag)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.85rem 1.25rem", textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "1.3rem", filter: "drop-shadow(0 2px 6px rgba(139,105,20,0.2))" }}>{o.emoji}</span>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.92rem", color: "#2A2A2A" }}>{o.text}</span>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Skip link */}
        <div style={{ textAlign: "center", padding: "1rem", paddingBottom: "2.5rem" }}>
          <button onClick={() => {
            localStorage.setItem("brewsoul-identity", "the-awakening");
            navigate("/brewsoul/home");
          }} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
            color: "rgba(90,74,32,0.25)", letterSpacing: "0.12em",
          }}>{"Skip \u2014 take me straight to the coffee \u2192"}</button>
        </div>
      </div>
    </div>
  );
}
