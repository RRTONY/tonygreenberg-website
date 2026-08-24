import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { FadeIn } from "@/components/Editorial";
import blogData from "@/data/blogData.json";
import themeMap from "@/data/themeMap.json";
import SEO from "@/components/SEO";
import ReturningVisitorHero from "@/components/ReturningVisitorHero";
import { JewelPopup } from "@/components/JewelPopup";
import { trpc } from "@/lib/trpc";
import BrewSoulHero from "@/components/BrewSoulHero";
import FourDoorsModal, { type DoorData } from "@/components/FourDoorsModal";


/* ── TYPES ── */
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  originalUrl: string;
  originalContent: string;
  updatedContent: string;
  formatTag: string;
  validityScore: number;
  validityLabel: string;
  reads: number;
  keywords?: string[];
  relevantParties?: { name: string; reason: string }[];
  supportingNews?: { headline: string; source: string; year: string; connection: string };
}

const allPostsRaw: BlogPost[] = blogData as BlogPost[];
const posts: BlogPost[] = allPostsRaw.filter((p: any) => !p.unpublished);

const KINTSUGI_IMG = "/api/img/homepage-hero-original_d3e7447d.jpg";
const TONY_HEADSHOT = "/api/img/tony-headshot_2d63de23.jpg";

const formatColors: Record<string, string> = {
  "The Crusade": "#8B0000",
  "The Field Report": "#2E8B57",
  "The Systems Map": "#4682B4",
  "The Lesson": "#8B6914",
  "The Manifesto": "#6A5ACD",
  "The Review": "#B8860B",
  "The Reckoning": "#9B2335",
};

const placeholderGradients = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #1a2a1a 0%, #0f3460 50%, #1a1a2e 100%)",
  "linear-gradient(135deg, #3a1a0f 0%, #1a1a2e 50%, #2d1b4e 100%)",
  "linear-gradient(135deg, #0f3460 0%, #1a1a2e 50%, #3a1a0f 100%)",
];

/* Permanent category art for legacy posts whose former session images expired.
   These route through resolveImgSrc below, so iOS Safari receives a direct image response. */
const thematicArticleCovers: Record<string, string> = {
  "Business & Capital": "/manus-storage/article-cover-business-capital_3823c08d.jpg",
  "Systems & Innovation": "/manus-storage/article-cover-systems-innovation_21e7d6b6.jpg",
  "Enterprise Technology & AI": "/manus-storage/article-cover-systems-innovation_21e7d6b6.jpg",
  "Culture & Communication": "/manus-storage/article-cover-culture-communication_e988720b.jpg",
  "Psychedelic Medicine": "/manus-storage/article-cover-culture-communication_e988720b.jpg",
  "Living Well": "/manus-storage/article-cover-living-well_3a8dcbd6.jpg",
  "Impact & Purpose": "/manus-storage/article-cover-impact-purpose_dcff7724.jpg",
  "Conscious Capital": "/manus-storage/article-cover-impact-purpose_dcff7724.jpg",
  "The Crusades": "/manus-storage/article-cover-crusades_7fc4bc27.jpg",
};

/* ── THEME DEFINITIONS ── */
const themes = [
  { key: "Systems & Innovation", icon: "⚙️", color: "#4682B4", description: "Blockchain, AI, transhumanism, and the architecture of what's next" },
  { key: "Business & Capital", icon: "💰", color: "#8B6914", description: "Enterprise, sourcing, payments, and the machinery of money" },
  { key: "Culture & Communication", icon: "🔥", color: "#9B2335", description: "Health, relationships, rebellion, and the human operating system" },
  { key: "The Crusades", icon: "⚔️", color: "#B22222", description: "Consumer action, corporate accountability, and holding the line" },
];
/* NOTE: Living Well & Impact & Purpose content still accessible via category filters — just not featured as theme cards */

/* ── CURATED JOURNEYS ── */
const curatedJourneys = [
  { id: "crusades", title: "The Crusade Files", icon: "⚔️", postSlugs: ["how-to-alienate-a-loyal-vegan", "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud", "dmn8-the-most-beautiful-crooked-gym-in-the-world", "bread-stuck-with-no-customer-service", "hiding-fees-tips-in-the-transparent-age"] },
  { id: "consciousness", title: "Consciousness & Technology", icon: "🧠", postSlugs: ["boiling-the-human-summit-harvard-kurzweil", "psychedelics-could-become-extractive-capitalism", "the-way-of-dao", "building-services-market-transhuman-era"] },
  { id: "trust", title: "The Trust Economy", icon: "🔐", postSlugs: ["only-time-buys-trust", "why-good-service-is-all-about-trust", "customer-service-key-to-business-success", "the-buyers-sellers-honesty-dance-2"] },
  { id: "personal", title: "Personal Provocations", icon: "🪞", postSlugs: ["grateful-smuggest-sentiment-or-selfish-act", "apologize", "human-operating-system", "the-arithmetic-of-relationships"] },
  { id: "systems", title: "Systems Architecture", icon: "🏗️", postSlugs: ["the-ball-and-blockchain-decentralization", "enterprise-blockchain-can-big-business-co-opt", "key-cloud-migration-decisions", "profiling-the-public-cloud-buyer"] },
  { id: "relationships", title: "The Relationship Circuit", icon: "💫", postSlugs: ["love-as-dharma-a-science-based-playbook-for-magnetic-partnership", "the-ties-that-bind-interpersonal-relationships", "the-arithmetic-of-relationships", "the-decay-of-modern-day-communication"] },
  { id: "culture", title: "Culture & Communication", icon: "🎨", postSlugs: ["is-that-a-lot-clarisse-abelarde", "the-decay-of-modern-day-communication", "grateful-smuggest-sentiment-or-selfish-act", "apologize"] },
];

/* Editor's Picks — hand-selected */
const editorPickSlugs = [
  "when-healing-becomes-extraction",
  "five-cups",
  "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
  "is-that-a-lot-clarisse-abelarde",
  "only-time-buys-trust",
];

/* ── HELPER: image background ── */
function imgBg(post: BlogPost) {
  const unusableImage = !post.image
    || post.image.includes("placeholder")
    || post.image.includes("og-default")
    || post.image.includes("tony-headshot");

  if (!unusableImage) return post.image;
  return thematicArticleCovers[post.category] || thematicArticleCovers["Systems & Innovation"];
}

/* ── HELPER: resolve image src — route all images through proxy for mobile Safari ── */
function resolveImgSrc(url: string, w: number): string {
  if (!url) return url;
  // /api/img/ paths are already proxied — just add resize params
  if (url.startsWith("/api/img/")) return `${url}?w=${w}&q=75`;
  // Relative /manus-storage/ paths — route through proxy
  if (url.startsWith("/manus-storage/")) {
    const key = url.replace("/manus-storage/", "");
    return `/api/img/${key}?w=${w}&q=75`;
  }
  // Full-domain manus-storage URLs — extract key and proxy (mobile Safari 307 fix)
  if (url.includes("manus-storage")) {
    const msMatch = url.match(/manus-storage\/([^?]+)/);
    if (msMatch) return `/api/img/${msMatch[1]}?w=${w}&q=75`;
  }
  // CloudFront CDN URLs served directly (no 307 redirect issue)
  if (url.includes("cloudfront.net")) return url;
  // External URLs go through the proxy
  if (url.startsWith("http")) return `/api/img?url=${encodeURIComponent(url)}&w=${w}&q=75`;
  return url;
}

/* ═══════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════ */
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      <h2 style={{
        fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
        fontWeight: 700, color: "#111", marginBottom: "0.2rem",
      }}>{title}</h2>
      <p style={{
        fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.1rem",
        color: "#777", lineHeight: 1.5,
      }}>{subtitle}</p>
      <div style={{ width: "40px", height: "3px", background: "#8B6914", marginTop: "0.5rem" }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EDITOR PICK CARD
   ═══════════════════════════════════════════════════════ */
function EditorPickCard({ post, size = "large", eager = false }: { post: BlogPost; size?: "large" | "medium"; eager?: boolean }) {
  const isLarge = size === "large";
  const bg = imgBg(post);
  const gradientIdx = Math.abs(post.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % placeholderGradients.length;
  const readTime = Math.max(3, Math.round((post.originalContent || "").split(/\s+/).length / 220));

  return (
    <Link href={`/blog/${post.slug}`}>
      <div style={{
        position: "relative", borderRadius: "6px", overflow: "hidden",
        height: isLarge ? "clamp(280px, 40vw, 420px)" : "clamp(130px, 15vw, 195px)",
        cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s",
        background: "#111",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {bg ? (
          <img
            src={resolveImgSrc(bg, isLarge ? 900 : 600)}
            srcSet={bg.includes("manus-storage") || bg.includes("cloudfront.net") ? undefined : bg.startsWith("http") ? [300,600,900,1200].map(w => `/api/img?url=${encodeURIComponent(bg)}&w=${w}&q=75 ${w}w`).join(", ") : undefined}
            alt={post.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            decoding={eager ? "sync" : "async"}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: placeholderGradients[gradientIdx] }} />
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)",
        }} />
        <div style={{ position: "absolute", top: "0.8rem", left: "0.8rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            background: "rgba(255,255,255,0.9)", color: "#222",
            padding: "0.25rem 0.6rem", borderRadius: "3px",
          }}>EDITOR'S PICK</span>
          {post.formatTag && (
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              background: formatColors[post.formatTag] || "#555",
              color: "#fff", padding: "0.25rem 0.6rem", borderRadius: "3px",
            }}>{post.formatTag}</span>
          )}
          {post.slug === "when-healing-becomes-extraction" && (
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              background: "#C84B31", color: "#fff",
              padding: "0.25rem 0.6rem", borderRadius: "3px",
              animation: "pulse 2s ease-in-out infinite",
            }}>NEW</span>
          )}
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: isLarge ? "1.5rem" : "0.8rem",
        }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.3rem" }}>
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
              color: "rgba(255,255,255,0.7)",
            }}>{readTime} min read</span>
          </div>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isLarge ? "clamp(1.4rem, 2.5vw, 2rem)" : "1.1rem",
            fontWeight: 700, color: "#fff", lineHeight: 1.2,
            marginBottom: isLarge ? "0.4rem" : "0",
            textShadow: "0 1px 8px rgba(0,0,0,0.4)",
          }}>{post.title}</h3>
          {isLarge && (
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem",
              color: "rgba(255,255,255,0.8)", lineHeight: 1.4,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>{post.summary}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════
   GRID CARD
   ═══════════════════════════════════════════════════════ */
function GridCard({ post, eager = false }: { post: BlogPost; eager?: boolean }) {
  const bg = imgBg(post);
  const gradientIdx = Math.abs(post.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % placeholderGradients.length;

  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="card-lift" style={{ cursor: "pointer" }}>
        <div className="img-hover-zoom" style={{
          position: "relative", borderRadius: "5px", overflow: "hidden",
          height: "clamp(180px, 22vw, 240px)",
        }}>
          {bg ? (
            <img
              src={resolveImgSrc(bg, 600)}
              srcSet={bg.includes("manus-storage") || bg.includes("cloudfront.net") ? undefined : bg.startsWith("http") ? [300,600,900].map(w => `/api/img?url=${encodeURIComponent(bg)}&w=${w}&q=80 ${w}w`).join(", ") : undefined}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              alt={post.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 1 }}
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: placeholderGradients[gradientIdx] }} />
          )}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.5) 100%)",
          }} />
          {post.formatTag && (
            <span style={{
              position: "absolute", bottom: "0.5rem", left: "0.5rem",
              fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              background: formatColors[post.formatTag] || "#555",
              color: "#fff", padding: "0.18rem 0.45rem", borderRadius: "2px",
            }}>{post.formatTag}</span>
          )}
        </div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "1.05rem",
          fontWeight: 600, color: "#222", lineHeight: 1.3,
          marginTop: "0.5rem", marginBottom: "0.2rem",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{post.title}</h3>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
          color: "#999", display: "flex", gap: "0.4rem",
        }}>
          <span suppressHydrationWarning>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          <span>·</span>
          <span>{(post.reads || 500).toLocaleString()} reads</span>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPACT LIST ITEM (sidebar)
   ═══════════════════════════════════════════════════════ */
function CompactListItem({ post, rank }: { post: BlogPost; rank: number }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div style={{
        display: "flex", gap: "0.5rem", alignItems: "flex-start",
        padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.04)",
        cursor: "pointer", transition: "all 0.2s",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "0.3rem"; }}
        onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; }}
      >
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: "1rem",
          color: "#D4B96A", fontWeight: 700, lineHeight: 1.3,
          minWidth: "1.5rem",
        }}>{rank}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontSize: "1rem",
            fontWeight: 600, color: "#222", lineHeight: 1.3,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{post.title}</div>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#999",
          }}>{(post.reads || 500).toLocaleString()} reads</div>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════
   THEME CARD
   ═══════════════════════════════════════════════════════ */
function ThemeCard({ theme, count }: { theme: typeof themes[0]; count: number }) {
  return (
    <div style={{
      padding: "1rem", borderRadius: "6px",
      border: "1px solid rgba(0,0,0,0.06)",
      background: "#FAFAF7",
      transition: "all 0.25s",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.color;
        e.currentTarget.style.boxShadow = `0 4px 16px ${theme.color}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>{theme.icon}</div>
      <h3 style={{
        fontFamily: "'Playfair Display', serif", fontSize: "1.15rem",
        fontWeight: 700, color: "#222", marginBottom: "0.2rem",
      }}>{theme.key}</h3>
      <p style={{
        fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem",
        color: "#777", lineHeight: 1.4, marginBottom: "0.4rem",
      }}>{theme.description}</p>
      <span style={{
        fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
        color: theme.color, letterSpacing: "0.06em", textTransform: "uppercase",
      }}>{count} ESSAYS →</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   THE JEWEL INVITATION — Surreal glass-morphism portal
   Uses shared JewelPopup component for uniform magnificence.
   ═══════════════════════════════════════════════════════ */
function QuirkyEmailPopup() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const subscribeMutation = trpc.subscribe.add.useMutation();
  useEffect(() => {
    if (sessionStorage.getItem("tg-popup-shown")) return;
    // Never show to subscribers
    try { if (localStorage.getItem("tg_subscribed") === "true") return; } catch {}
    const timer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem("tg-popup-shown", "1");
    }, 180000); // 3 minutes — give readers time to engage before interrupting
    return () => clearTimeout(timer);
  }, []);
  const handleDismiss = () => setShow(false);
  const handleSubmitEmail = async (email: string) => {
    try {
      await subscribeMutation.mutateAsync({ email, source: "blog-jewel-popup" });
      try { localStorage.setItem("tg_subscribed", "true"); } catch {}
    } catch {}
    setSubmitted(true);
  };

  return (
    <JewelPopup
      show={show}
      onDismiss={handleDismiss}
      onSubmitEmail={handleSubmitEmail}
      submitted={submitted}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   SITEWIDE CTA BLOCK
   ═══════════════════════════════════════════════════════ */
function EcosystemCTA() {
  return (
    <section style={{
      background: "#0A0A10",
      padding: "clamp(2rem, 4vh, 3rem) clamp(1rem, 4vw, 3rem)",
      textAlign: "center",
    }}>
      <FadeIn>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: "1.05rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#D4B96A", marginBottom: "1rem",
        }}>THE THROUGHLINE</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
          fontWeight: 400, color: "#F5F0E0", lineHeight: 1.2,
          maxWidth: "700px", margin: "0 auto 1rem",
        }}>
          The thinking doesn't stop here.
        </h2>
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.15rem",
          color: "rgba(255,255,255,0.6)", lineHeight: 1.7,
          maxWidth: "600px", margin: "0 auto 2rem",
        }}>
          Ninety-one essays and counting. If something here made you think differently — or made you angry enough to act — that's the point.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/find-my">
            <span style={{
              display: "inline-block", padding: "0.7rem 1.8rem",
              fontFamily: "'DM Mono', monospace", fontSize: "1.05rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              background: "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
              color: "#fff", borderRadius: "4px", cursor: "pointer",
              textDecoration: "none", fontWeight: 700,
            }} className="cta-glow">Find Your Fit</span>
          </Link>
          <Link href="/ecosystem">
            <span style={{
              display: "inline-block", padding: "0.7rem 1.8rem",
              fontFamily: "'DM Mono', monospace", fontSize: "1.05rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              border: "1px solid rgba(123, 63, 160,0.4)", color: "#D4B96A",
              borderRadius: "4px", cursor: "pointer", textDecoration: "none",
            }}>The Ecosystem →</span>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO PARTICLES — Floating golden dust
   ═══════════════════════════════════════════════════════ */
function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => { canvas.width = canvas.offsetWidth * dpr; canvas.height = canvas.offsetHeight * dpr; ctx.scale(dpr, dpr); };
    resize();
    window.addEventListener("resize", resize);
    const particles: { x: number; y: number; r: number; vx: number; vy: number; a: number; da: number }[] = [];
    const COUNT = 35;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.01,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.a += p.da;
        if (p.a > 1) p.da = -Math.abs(p.da);
        if (p.a < 0) p.da = Math.abs(p.da);
        if (p.y < -10) { p.y = canvas.offsetHeight + 10; p.x = Math.random() * canvas.offsetWidth; }
        if (p.x < -10) p.x = canvas.offsetWidth + 10;
        if (p.x > canvas.offsetWidth + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123, 63, 160,${p.a * 0.6})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(123, 63, 160,0.3)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }} />;
}

/* ═══════════════════════════════════════════════════════
   HERO GLOW ANIMATIONS (injected once)
   ═══════════════════════════════════════════════════════ */
const heroGlowStyleId = "hero-glow-animations";
if (typeof document !== "undefined" && !document.getElementById(heroGlowStyleId)) {
  const style = document.createElement("style");
  style.id = heroGlowStyleId;
  style.textContent = `
    @keyframes bowlPulseHero { 0%,100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
    @keyframes bowlPulseInnerHero { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
    @keyframes raysSpinHero { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeDoor, setActiveDoor] = useState<DoorData | null>(null);
  const openDoor = useCallback((door: DoorData) => setActiveDoor(door), []);
  const closeDoor = useCallback(() => setActiveDoor(null), []);

  const BLOG_DOORS: DoorData[] = [
    {
      num: "01", title: "Read", sub: "Essays on culture, capital & consciousness",
      href: "#essays-archive",
      img: "/api/img/door01_634cd4d4.webp",
      headline: "Twenty-five years of thinking, unfiltered",
      body: "Essays that challenge extractive systems and explore what comes next. Culture, capital, consciousness — written for people who are tired of being managed and ready to think for themselves.",
      bullets: [
        "118 essays spanning enterprise technology, psychedelic medicine, and social impact",
        "Featured in Harvard H+, Davos 2022, and independent media",
        "No paywall. No algorithm. Just the work.",
      ],
      cta: "Read the Essays",
    },
    {
      num: "02", title: "Diagnose", sub: "Assessments that clarify who you are",
      href: "/find-my",
      img: "/api/img/door02_8abcc1e9.webp",
      headline: "Clarity is a competitive advantage",
      body: "Short assessments — five to ten minutes — that surface decisions you've been avoiding. Who you are, what you want, and what's getting in the way. Immediate insight, no consultant required.",
      bullets: [
        "Psychographic profiling across leadership, risk, and values",
        "Calibrated against 25 years of pattern recognition",
        "Results you can actually act on",
      ],
      cta: "Find Your Fit",
    },
    {
      num: "03", title: "Engage", sub: "Builders & investors in regenerative systems",
      href: "/ecosystem",
      img: "/api/img/door03_ac43a96c.webp",
      headline: "The people building what comes after extraction",
      body: "A curated network of builders, investors, and operators who are done with the old playbook. Real capital. Real projects. No pitch decks required — just alignment on what matters.",
      bullets: [
        "Active investments across psychedelic medicine, impact tokens, and payments infrastructure",
        "ImpactSoul — a Certified B Corp tokenizing cultural and real estate assets",
        "Introductions by merit, not by LinkedIn connection count",
      ],
      cta: "Explore the Ecosystem",
    },
    {
      num: "04", title: "Verify", sub: "COA checks, testing & vendor scoring",
      href: "/verify-your-coa",
      img: "/api/img/door04_f682151b.webp",
      headline: "Trust, but verify. Actually, just verify.",
      body: "Before you order anything from anyone — peptides, supplements, compounds — here's how to actually confirm what you're getting. COA interpretation, independent testing labs, and vendor scoring built from real sourcing experience.",
      bullets: [
        "Certificate of Analysis (COA) reading guide",
        "Independent third-party lab recommendations",
        "Vendor scoring rubric based on $10B+ procurement experience",
      ],
      cta: "Verify Your Source",
    },
  ];

  // Hero email capture
  const [heroEmail, setHeroEmail] = useState("");
  const [heroSubmitted, setHeroSubmitted] = useState(() => {
    try { return typeof window !== "undefined" && localStorage.getItem("tg_subscribed") === "true"; } catch { return false; }
  });
  const heroSubscribeMutation = trpc.subscribe.add.useMutation();
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroEmail) return;
    try {
      await heroSubscribeMutation.mutateAsync({ email: heroEmail, source: "hero-abit-waitlist" });
      try { localStorage.setItem("tg_subscribed", "true"); } catch {}
    } catch {}
    setHeroSubmitted(true);
  };

  const categories = useMemo(() => [
    "All",
    ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean))),
  ], []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesCat = activeCategory === "All" || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.keywords || []).some(k => k.toLowerCase().includes(q));
      const matchesTheme = !activeTheme || (themeMap as Record<string, string[]>)[activeTheme]?.includes(p.slug);
      return matchesCat && matchesSearch && matchesTheme;
    });
  }, [activeCategory, searchQuery, activeTheme]);

  const mostRead = useMemo(() => {
    return [...posts].sort((a, b) => (b.reads || 500) - (a.reads || 500)).slice(0, 5);
  }, []);

  const mostProvocative = useMemo(() => {
    return posts
      .filter(p => ["The Crusade", "The Manifesto", "The Reckoning"].includes(p.formatTag))
      .sort((a, b) => (b.reads || 500) - (a.reads || 500))
      .slice(0, 5);
  }, []);

  const latestPosts = useMemo(() => [...posts].slice(0, 6), []);

  const editorPicks = useMemo(() => {
    return editorPickSlugs.map(slug => posts.find(p => p.slug === slug)).filter(Boolean) as BlogPost[];
  }, []);

  const isSearching = searchQuery.length > 0 || activeCategory !== "All" || activeTheme !== null;
  const visiblePosts = showAll ? filtered : filtered.slice(0, 12);
  const hasMore = filtered.length > 12 && !showAll;

  return (
    <div>
      <SEO title="Tony Greenberg | Strategist, Author & Systems Thinker" description="Tony Greenberg — strategist, author, and systems thinker. 25 years exposing broken systems and building replacements. Essays on business, AI, trust, and culture." keywords="Tony Greenberg, systems thinking, enterprise strategy, impact investing, AI ethics, trust economy, essays, regenerative capital" path="/" image="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/og-homepage-iNW3EF7wNGKzB7HUYuj6tn.png"
        indexable={true} />

      {/* Returning visitor personalization */}
      <ReturningVisitorHero />

      {/* Quirky timed popup */}
      <QuirkyEmailPopup />

      {/* ═══════════════════════════════════════════════════
          HERO — THOUGHT LEADERSHIP (Glass-Morphism Enhanced)
         ═══════════════════════════════════════════════════ */}
      {!isSearching && (
        <section style={{
          position: "relative",
          minHeight: "clamp(300px, 42vh, 420px)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}>
          {/* Kintsugi background */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${KINTSUGI_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }} />

          {/* ★ BOWL GLOW — radial warm light bloom */}
          <div style={{
            position: "absolute",
            top: "25%", right: "18%",
            width: "420px", height: "420px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(123, 63, 160,0.35) 0%, rgba(123, 63, 160,0.15) 30%, rgba(180,140,50,0.08) 55%, transparent 75%)",
            filter: "blur(40px)",
            animation: "bowlPulseHero 4s ease-in-out infinite",
            pointerEvents: "none", zIndex: 1,
          }} />
          {/* ★ Inner glow — tighter, brighter */}
          <div style={{
            position: "absolute",
            top: "32%", right: "22%",
            width: "200px", height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,220,130,0.4) 0%, rgba(123, 63, 160,0.2) 40%, transparent 70%)",
            filter: "blur(25px)",
            animation: "bowlPulseInnerHero 3s ease-in-out infinite 0.5s",
            pointerEvents: "none", zIndex: 1,
          }} />
          {/* ★ Light rays emanating from bowl */}
          <div style={{
            position: "absolute",
            top: "20%", right: "14%",
            width: "500px", height: "500px",
            background: "conic-gradient(from 0deg, transparent 0deg, rgba(123, 63, 160,0.06) 15deg, transparent 30deg, transparent 60deg, rgba(123, 63, 160,0.04) 75deg, transparent 90deg, transparent 120deg, rgba(123, 63, 160,0.05) 135deg, transparent 150deg, transparent 180deg, rgba(123, 63, 160,0.06) 195deg, transparent 210deg, transparent 240deg, rgba(123, 63, 160,0.04) 255deg, transparent 270deg, transparent 300deg, rgba(123, 63, 160,0.05) 315deg, transparent 330deg, transparent 360deg)",
            borderRadius: "50%",
            filter: "blur(20px)",
            animation: "raysSpinHero 30s linear infinite",
            pointerEvents: "none", zIndex: 1,
          }} />

          {/* ★ Floating golden particles */}
          <HeroParticles />

          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(10,10,16,0.45) 0%, rgba(10,10,16,0.18) 50%, rgba(10,10,16,0.35) 100%)",
            backdropFilter: "blur(1px)", WebkitBackdropFilter: "blur(1px)",
            zIndex: 2,
          }} />
          <div style={{
            position: "relative", width: "100%",
            maxWidth: "900px", margin: "0 auto",
            padding: "clamp(1.5rem, 3vh, 2.5rem) clamp(1.2rem, 4vw, 3rem)",
            zIndex: 3,
          }}>
            <FadeIn>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: "1.05rem",
                letterSpacing: "0.25em", textTransform: "uppercase",
                color: "#D4B96A", marginBottom: "1rem",
              }}>TONY GREENBERG</div>

              <h1 className="sr-only">Tony Greenberg — Strategist, Author &amp; Systems Thinker</h1>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 400, lineHeight: 1.1, color: "#F5F0E0",
                marginBottom: "0.8rem",
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}>
                I expose broken systems.<br />
                <em style={{ fontStyle: "normal" }} className="gold-shimmer">Then I build what <br className="hero-mobile-break" />comes next.</em>
              </p>

              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
                color: "rgba(255,255,255,0.92)", lineHeight: 1.65,
                maxWidth: "560px", marginBottom: "1.2rem",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}>
                $10B+ transactions · Microsoft, Disney, Goldman Sachs · 25 years
              </p>

              {/* ── PRIMARY CTA ── */}
              <Link href="/find-my">
                <span style={{
                  display: "inline-block", padding: "0.75rem 2rem",
                  fontFamily: "'DM Mono', monospace", fontSize: "1.05rem",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  background: "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
                  color: "#fff", borderRadius: "4px",
                  cursor: "pointer", textDecoration: "none", fontWeight: 700,
                  marginBottom: "1.2rem",
                }} className="cta-glow">Find Your Fit</span>
              </Link>

              {/* ── ABIT WAITLIST EMAIL CAPTURE ── */}
              <div style={{ marginTop: "1rem", maxWidth: "480px" }}>
                {heroSubmitted ? (
                  <div style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.95rem",
                    color: "#D4B96A",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}>
                    <span style={{ fontSize: "1.1rem" }}>◆</span>
                    <span>You're on the list. ABIT updates come when they're ready.</span>
                  </div>
                ) : (
                  <>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(212,185,106,0.7)",
                      marginBottom: "0.5rem",
                    }}>ABIT Waitlist — Asset-Backed Impact Tokens</div>
                    <form
                      onSubmit={handleHeroSubmit}
                      style={{
                        display: "flex",
                        gap: "0",
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid rgba(212,185,106,0.35)",
                        background: "rgba(255,255,255,0.06)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <input
                        type="email"
                        value={heroEmail}
                        onChange={(e) => setHeroEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        style={{
                          flex: 1,
                          padding: "0.65rem 1rem",
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.95rem",
                          color: "#F5F0E0",
                          minWidth: 0,
                        }}
                      />
                      <button
                        type="submit"
                        disabled={heroSubscribeMutation.isPending}
                        style={{
                          padding: "0.65rem 1.2rem",
                          background: "rgba(139,105,20,0.85)",
                          border: "none",
                          color: "#FAFAF7",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.78rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          cursor: heroSubscribeMutation.isPending ? "wait" : "pointer",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          transition: "background 0.2s",
                        }}
                      >
                        {heroSubscribeMutation.isPending ? "…" : "Join Waitlist"}
                      </button>
                    </form>
                  </>
                )}
              </div>

              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.72rem",
                color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em",
                marginTop: "1rem",
              }}>
                {posts.length} ESSAYS ·{" "}
                <a href="#essays-archive" onClick={(e) => { e.preventDefault(); gridRef.current?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: "rgba(212,185,106,0.6)", textDecoration: "none", borderBottom: "1px solid rgba(212,185,106,0.2)" }}>READ</a>
                {" · DIAGNOSE · ENGAGE"}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ═══ BREAKING BANNER — moved to peptide pages ═══ */}

      {/* ═══════════════════════════════════════════════════
          FOUR-DOOR ROUTING
         ═══════════════════════════════════════════════════ */}
      {!isSearching && (
        <section style={{
          background: "#0E0C09",
          padding: "clamp(2rem, 4vh, 3rem) clamp(1rem, 4vw, 3rem)",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}>

          <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
            {/* Section header */}
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: "clamp(1.5rem, 3vh, 2rem)" }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "#D4B96A", marginBottom: "0.8rem", opacity: 0.7,
                }}>Four Doors</div>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  fontWeight: 400, color: "#fff", lineHeight: 1.2,
                  margin: 0,
                }}>Choose how you want to <em style={{ fontStyle: "italic", color: "#D4B96A" }}>begin</em></h2>
              </div>
            </FadeIn>

            {/* Four Doors — image-first tap cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "2px",
              }}
              className="lg:!grid-cols-4"
            >
              {BLOG_DOORS.map((door) => (
                <button
                  key={door.num}
                  onClick={() => openDoor(door)}
                  className="four-door-tap-card"
                  style={{
                    display: "block",
                    position: "relative",
                    overflow: "hidden",
                    height: "220px",
                    cursor: "pointer",
                    border: "none",
                    padding: 0,
                    background: "none",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  {/* Full-bleed image — img tag so mobile Safari follows the storage proxy redirect */}
                  <img
                    src={door.img}
                    alt={door.title}
                    className="four-door-img"
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                      willChange: "transform",
                      display: "block",
                    }}
                  />
                  {/* Bottom gradient */}
                  <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 50%, transparent 80%)",
                  }} />
                  {/* Text at bottom */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "0.85rem 1rem 0.9rem",
                    zIndex: 2,
                  }}>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.58rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase" as const,
                      color: "rgba(212,185,106,0.75)",
                      marginBottom: "0.2rem",
                    }}>{door.num}</div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.2rem",
                      fontWeight: 500,
                      color: "#FAFAF7",
                      lineHeight: 1.15,
                      marginBottom: "0.25rem",
                      textShadow: "0 1px 8px rgba(0,0,0,0.6)",
                    }}>{door.title}</div>
                    <div style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.72rem",
                      color: "rgba(250,250,247,0.7)",
                      lineHeight: 1.35,
                      textShadow: "0 1px 4px rgba(0,0,0,0.7)",
                    }}>{door.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Modal */}
            <FourDoorsModal door={activeDoor} onClose={closeDoor} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          EDITOR'S PICKS + LATEST THINKING (reduced)
         ═══════════════════════════════════════════════════ */}
      {!isSearching && (
        <section style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "clamp(2rem, 3vw, 2.5rem) 1rem 1.5rem",
          boxSizing: "border-box",
        }}>
          <FadeIn>
            <SectionHeader title="Editor's Picks" subtitle="The essays that define the mission" />
          </FadeIn>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.2rem",
          }} className="md:!grid-cols-[1.5fr_1fr]">
            {editorPicks[0] && (
              <EditorPickCard post={editorPicks[0]} size="large" eager={true} />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {editorPicks.slice(1, 3).map((post) => (
                <FadeIn key={post.slug}>
                  <EditorPickCard post={post} size="medium" />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          FRAUD ALERT — compact inline link (downgraded)
         ═══════════════════════════════════════════════════ */}
      {!isSearching && (
        <section style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 1rem 0.75rem",
          boxSizing: "border-box",
        }}>
          <FadeIn>
            <Link href="/protecting-your-business">
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
                padding: "0.5rem 0.9rem",
                background: "rgba(185,28,28,0.06)",
                border: "1px solid rgba(185,28,28,0.18)",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(185,28,28,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(185,28,28,0.06)"; }}
              >
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#B91C1C", fontWeight: 700 }}>Case File</span>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#4A4A4A" }}>She Had Two Theft Convictions. I Hired Her Anyway. She Stole $46,795. — Kristi Klawiter, documented.</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#B91C1C", letterSpacing: "0.05em" }}>→</span>
              </div>
            </Link>
          </FadeIn>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          GEMSPARK STRIP
         ═══════════════════════════════════════════════════ */}
      {!isSearching && (() => {
        const gemPosts = (posts as typeof blogData).filter((p: any) => {
          const c = p.content || p.originalContent || '';
          return /GemSpark/i.test(c);
        });
        if (gemPosts.length === 0) return null;
        return (
          <section style={{
            background: 'linear-gradient(135deg, #FFFBF0 0%, #FFF8E7 100%)',
            borderTop: '1px solid rgba(200,134,10,0.2)',
            borderBottom: '1px solid rgba(200,134,10,0.2)',
            padding: '2.5rem 1rem',
            margin: '0',
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <FadeIn>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
                  {/* Left: what is GemSpark */}
                  <div style={{ flex: '1 1 280px', minWidth: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                      <span style={{ fontFamily: "'IM Fell English', serif", fontSize: '1.5rem', color: '#C8860A', lineHeight: 1 }}>✦</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C8860A' }}>GemSpark</span>
                    </div>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.92rem', color: '#5C3A1E', lineHeight: 1.7, margin: 0, maxWidth: '340px' }}>
                      A GemSpark is a real moment — a conversation, an encounter, a collision of people and ideas — that illuminates something larger. Not a theory. Not a framework. A spark. Every essay Tony publishes includes one.
                    </p>
                  </div>
                  {/* Right: GemSpark entries */}
                  <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#8B6914', marginBottom: '0.25rem' }}>Recent GemSparks</div>
                    {gemPosts.slice(0, 5).map((p: any) => {
                      const content = p.content || p.originalContent || '';
                      const m = content.match(/## .*?GemSpark.*?(?:—\s*(.+))?$/m);
                      const subtitle = m && m[1] ? m[1].trim() : '';
                      return (
                        <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            background: 'rgba(255,255,255,0.7)',
                            border: '1px solid rgba(200,134,10,0.18)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s, background 0.2s',
                          }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,134,10,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,251,240,1)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,134,10,0.18)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.7)'; }}
                          >
                            <span style={{ fontFamily: "'IM Fell English', serif", fontSize: '1rem', color: '#C8860A', flexShrink: 0 }}>✦</span>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.88rem', fontStyle: 'italic', color: '#3D2B1F', marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                              {subtitle && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: '#8B6914', textTransform: 'uppercase' as const }}>{subtitle}</div>}
                            </div>
                            <span style={{ marginLeft: 'auto', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: '#C8860A', flexShrink: 0 }}>→</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>
        );
      })()}

      {/* ═══════════════════════════════════════════════════
          LATEST THINKING (1-2 recent posts)
         ═══════════════════════════════════════════════════ */}
      {!isSearching && (
        <section style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "1rem 1rem 2rem",
          boxSizing: "border-box",
        }}>
          <FadeIn>
            <SectionHeader title="Latest Thinking" subtitle="The most recent dispatches" />
          </FadeIn>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: "1.2rem",
          }}>
            {latestPosts.slice(0, 2).map((post, idx) => (
              <FadeIn key={post.slug} delay={idx * 0.05}>
                <GridCard post={post} eager />
              </FadeIn>
            ))}
          </div>
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <a href="#essays-archive" onClick={(e) => { e.preventDefault(); gridRef.current?.scrollIntoView({ behavior: 'smooth' }); }} style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.85rem",
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: "#8B6914", textDecoration: "none",
              borderBottom: "1px solid rgba(74, 29, 107,0.3)",
              paddingBottom: "2px", cursor: "pointer",
            }}>View All {posts.length} Essays &rarr;</a>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          POSITIONING STATEMENT
         ═══════════════════════════════════════════════════ */}
      {!isSearching && (
        <div style={{
          textAlign: "center",
          padding: "1.5rem 1rem",
          borderTop: "1px solid rgba(74, 29, 107,0.06)",
          borderBottom: "1px solid rgba(74, 29, 107,0.06)",
        }}>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.92rem",
            color: "#999",
            lineHeight: 1.6,
            maxWidth: "600px",
            margin: "0 auto",
            fontStyle: "italic",
          }}>A platform for ideas and tools that help people make better decisions about identity, relationships, and assets.</p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          CORE THEMES
         ═══════════════════════════════════════════════════ */}
      {!isSearching && (
        <section style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "1.5rem 1rem 1.5rem",
          boxSizing: "border-box",
        }}>
          <FadeIn>
            <SectionHeader title="Core Themes" subtitle="Six lenses on a life spent building bridges between what is and what could be" />
          </FadeIn>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "0.8rem",
          }} className="sm:!grid-cols-2 lg:!grid-cols-3">
            {themes.map((theme) => {
              const count = ((themeMap as Record<string, string[]>)[theme.key] || []).length;
              return (
                <FadeIn key={theme.key}>
                  <div onClick={() => { setActiveTheme(theme.key); gridRef.current?.scrollIntoView({ behavior: "smooth" }); }} style={{ cursor: "pointer" }} className="card-lift">
                    <ThemeCard theme={theme} count={count} />
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>
      )}



      {/* ═══════════════════════════════════════════════════
          BREWSOUL INTELLIGENCE ENGINE
         ═══════════════════════════════════════════════════ */}
      {!isSearching && <BrewSoulHero />}

      {/* ═══════════════════════════════════════════════════
          ECOSYSTEM CTA
         ═══════════════════════════════════════════════════ */}
      {!isSearching && <EcosystemCTA />}

      {/* ═══════════════════════════════════════════════════
          SEARCH & FILTER BAR
         ═══════════════════════════════════════════════════ */}
      <div ref={gridRef} style={{
        background: "#FAFAF7",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "1.2rem 1rem",
        position: "sticky", top: 0, zIndex: 50,
        boxSizing: "border-box",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "420px", minWidth: "180px" }}>
              <span style={{
                position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)",
                fontSize: "1rem", color: "#999", pointerEvents: "none",
              }}>⌕</span>
              <input
                type="text" placeholder="Search essays..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setActiveTheme(null); }}
                style={{
                  width: "100%", padding: "0.55rem 0.8rem 0.55rem 2rem",
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem",
                  border: "1px solid rgba(74, 29, 107,0.18)", borderRadius: "4px",
                  background: "#fff", outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(74, 29, 107,0.4)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(74, 29, 107,0.18)"; }}
              />
            </div>
            {activeTheme && (
              <button onClick={() => setActiveTheme(null)} style={{
                fontFamily: "'DM Mono', monospace", fontSize: "1.05rem",
                padding: "0.4rem 0.8rem", borderRadius: "3px",
                border: "1px solid #8B6914", background: "rgba(74, 29, 107,0.08)",
                color: "#8B6914", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem",
              }}>{activeTheme} ✕</button>
            )}
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#999",
              letterSpacing: "0.05em", whiteSpace: "nowrap",
            }}>{filtered.length} essays</span>
          </div>
          <div style={{
            display: "flex", gap: "0.25rem", overflowX: "auto",
            WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
          }}>
            {categories.map((cat) => {
              const count = cat === "All" ? posts.length : posts.filter(p => p.category === cat).length;
              return (
                <button key={cat}
                  onClick={() => { setActiveCategory(cat); setActiveTheme(null); }}
                  style={{
fontFamily: "'DM Mono', monospace", fontSize: "1.05rem",
            letterSpacing: "0.06em", textTransform: "uppercase",
            padding: "0.4rem 0.8rem", borderRadius: "3px", border: "none",
                    background: activeCategory === cat ? "#8B6914" : "transparent",
                    color: activeCategory === cat ? "#fff" : "#777",
                    cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0,
                  }}
                >{cat} ({count})</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          FULL ARCHIVE (grid + sidebar)
         ═══════════════════════════════════════════════════ */}
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "1.5rem 1rem",
        display: "grid", gridTemplateColumns: "1fr",
        gap: "2rem", boxSizing: "border-box",
      }} className="lg:!grid-cols-[1fr_260px]">
        {/* Left: Posts grid */}
        <div style={{ minWidth: 0 }}>
          {!isSearching && (
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "1.05rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#8B6914", marginBottom: "1.2rem",
              paddingBottom: "0.4rem", borderBottom: "2px solid #8B6914",
            }}>FULL ARCHIVE — ALL {posts.length} ESSAYS</div>
          )}

          {visiblePosts.length > 0 ? (
            <div className="stagger-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
              gap: "1.2rem",
            }}>
              {visiblePosts.map((post, idx) => (
                <FadeIn key={post.slug} delay={Math.min(idx * 0.02, 0.15)}>
                  <GridCard post={post} eager={idx < 4} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: "2rem 0", color: "#888",
              fontFamily: "'DM Mono', monospace", fontSize: "1.05rem",
            }}>No essays match your search.</div>
          )}

          {hasMore && (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <button onClick={() => setShowAll(true)} style={{
                fontFamily: "'DM Mono', monospace", fontSize: "1.05rem",
                letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "0.7rem 2.2rem", border: "1.5px solid rgba(74, 29, 107,0.3)",
                borderRadius: "4px", background: "transparent",
                color: "#8B6914", cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(74, 29, 107,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >Show all {filtered.length} essays →</button>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <aside className="hidden lg:block" style={{ minWidth: 0 }}>
          {/* Most Read */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#8B6914", marginBottom: "0.5rem",
              paddingBottom: "0.4rem", borderBottom: "2px solid #8B6914",
            }}>MOST READ</div>
            {mostRead.map((post, idx) => (
              <CompactListItem key={post.slug} post={post} rank={idx + 1} />
            ))}
          </div>

          {/* Most Provocative */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#9B2335", marginBottom: "0.5rem",
              paddingBottom: "0.4rem", borderBottom: "2px solid #9B2335",
            }}>MOST PROVOCATIVE</div>
            {mostProvocative.map((post, idx) => (
              <CompactListItem key={post.slug} post={post} rank={idx + 1} />
            ))}
          </div>

          {/* Curated Journeys */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#8B6914", marginBottom: "0.5rem",
              paddingBottom: "0.4rem", borderBottom: "2px solid #8B6914",
            }}>CURATED JOURNEYS</div>
            {curatedJourneys.map((journey) => (
              <Link key={journey.id} href="/journeys">
                <div style={{
                  display: "flex", gap: "0.4rem", alignItems: "center",
                  padding: "0.4rem 0", borderBottom: "1px solid rgba(0,0,0,0.04)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "0.3rem"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; }}
                >
                  <span style={{ fontSize: "1rem" }}>{journey.icon}</span>
                  <div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif", fontSize: "1rem",
                      fontWeight: 600, color: "#222", lineHeight: 1.3,
                    }}>{journey.title}</div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#999",
                    }}>{journey.postSlugs.length} posts</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Tip Me Off */}
          <div style={{
            padding: "1rem",
            background: "rgba(74, 29, 107,0.05)",
            borderRadius: "5px",
            border: "1px solid rgba(74, 29, 107,0.12)",
            marginBottom: "1.2rem",
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#8B6914", marginBottom: "0.4rem",
            }}>TIP ME OFF</div>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem",
              color: "#555", lineHeight: 1.5, marginBottom: "0.5rem",
            }}>See an injustice worth exposing?</p>
            <a href="mailto:tony@joyandwoe.com?subject=Tip%20for%20TonyG" style={{
              display: "inline-block", padding: "0.35rem 0.7rem",
              border: "1px solid rgba(74, 29, 107,0.25)", borderRadius: "3px",
              color: "#8B6914", fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem", letterSpacing: "0.06em",
              textTransform: "uppercase", textDecoration: "none",
            }}>SEND A TIP →</a>
          </div>

          {/* Follow */}
          <div style={{ padding: "0.8rem 0" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#8B6914", marginBottom: "0.5rem",
            }}>FOLLOW</div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <a href="https://x.com/ThinkTony" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'DM Mono', monospace", fontSize: "1.05rem", padding: "0.35rem 0.8rem",
                border: "1px solid rgba(74, 29, 107,0.2)", borderRadius: "3px", color: "#8B6914", textDecoration: "none",
              }}>𝕏</a>
              <a href="https://linkedin.com/in/tonygreenberg" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'DM Mono', monospace", fontSize: "1.05rem", padding: "0.35rem 0.8rem",
                border: "1px solid rgba(74, 29, 107,0.2)", borderRadius: "3px", color: "#8B6914", textDecoration: "none",
              }}>in</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
