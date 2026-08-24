/*
 * Commitment Escalation Components
 * Micro-yes flow: read → share → signup → contact
 * Social proof cascading: proof at moments of doubt
 * Return visitor hooks: different content on repeat visits
 * Punched-up subscribe hooks with "outbursts" framing
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

function safeSessionGet(key: string): string | null {
  try { return safeSessionGet(key); } catch { return null; }
}
function safeSessionSet(key: string, value: string): void {
  try { sessionStorage.setItem(key, value); } catch { /* noop */ }
}

/* ─── Session helpers ─── */
function getVisitCount(): number {
  const count = parseInt(localStorage.getItem("tg_visit_count") || "0", 10);
  return count;
}
function incrementVisitCount(): number {
  const count = getVisitCount() + 1;
  localStorage.setItem("tg_visit_count", String(count));
  return count;
}
function getSessionId() {
  try {
    let sid = safeSessionGet("tg_sid");
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      safeSessionSet("tg_sid", sid);
    }
    return sid;
  } catch { return "ssr"; }
}

/* ═══════════════════════════════════════════════════════
   1. MICRO-YES ESCALATION BAR
   Shows at bottom of blog posts after 60% scroll depth
   Progressive: Share → Subscribe → Contact
   ═══════════════════════════════════════════════════════ */
export function MicroYesBar({ title, slug }: { title: string; slug: string }) {
  const [step, setStep] = useState(0); // 0=hidden, 1=share, 2=subscribe, 3=contact, 4=done
  const [email, setEmail] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const triggered = useRef(false);
  const subscribeMutation = trpc.subscribe.add.useMutation();

  useEffect(() => {
    if (safeSessionGet(`tg_microyes_${slug}`)) {
      setDismissed(true);
      return;
    }

    const handler = () => {
      if (triggered.current) return;
      const scrollPct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPct > 55) {
        triggered.current = true;
        setStep(1);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [slug]);

  const handleShare = () => {
    const url = `https://tonygreenberg.com/blog/${slug}`;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
    }
    setStep(2);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeMutation.mutateAsync({ email, source: `micro-yes-${slug}` });
    } catch {}
    setStep(3);
  };

  const handleDismiss = () => {
    setDismissed(true);
    safeSessionSet(`tg_microyes_${slug}`, "1");
  };

  if (dismissed || step === 0) return null;

  const prompts = [
    null, // step 0
    { // step 1 — share
      label: "THIS LANDED",
      text: "If this shifted something, pass it on.",
      cta: "Share this essay",
      action: handleShare,
    },
    { // step 2 — subscribe
      label: "STILL HERE?",
      text: "The outbursts arrive when they arrive. No algorithm. No schedule.",
      cta: null, // custom form
    },
    { // step 3 — contact
      label: "YOU'RE IN",
      text: "Got something broken that needs naming? A question that won't let go?",
      cta: "Ask Tony directly",
      action: () => { window.location.href = "mailto:tony@tonygreenberg.com?subject=From%20a%20reader"; },
    },
  ];

  const current = prompts[step];
  if (!current) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        background: "linear-gradient(180deg, rgba(10,10,16,0.95) 0%, #0A0A10 100%)",
        borderTop: "1px solid rgba(139,105,20,0.3)",
        padding: "1rem 1.5rem",
        animation: "slideUp 0.4s ease",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            color: "#8B6914",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            {current.label}
          </span>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.8)",
            margin: "0.25rem 0 0",
            lineHeight: 1.4,
          }}>
            {current.text}
          </p>
        </div>

        {step === 2 ? (
          <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.4rem" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                padding: "0.5rem 0.8rem",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(139,105,20,0.3)",
                borderRadius: "2px",
                color: "#FAFAF7",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.9rem",
                outline: "none",
                width: "180px",
              }}
            />
            <button type="submit" style={{
              padding: "0.5rem 1rem",
              background: "#8B6914",
              border: "none",
              borderRadius: "2px",
              color: "#FAFAF7",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}>
              SEND IT
            </button>
          </form>
        ) : current.cta ? (
          <button
            onClick={current.action}
            style={{
              padding: "0.5rem 1.2rem",
              background: step === 3 ? "transparent" : "#8B6914",
              border: step === 3 ? "1px solid rgba(139,105,20,0.4)" : "none",
              borderRadius: "2px",
              color: "#FAFAF7",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {current.cta}
          </button>
        ) : null}

        <button
          onClick={handleDismiss}
          style={{
            background: "none",
            border: "none",
            color: "#555",
            cursor: "pointer",
            fontSize: "1.1rem",
            padding: "0.25rem",
            lineHeight: 1,
          }}
          title="Dismiss"
        >
          ×
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   2. SOCIAL PROOF CASCADING
   Appears at strategic moments of doubt:
   - After 30% scroll on blog post (credibility reinforcement)
   - Near subscribe forms (trust signal)
   ═══════════════════════════════════════════════════════ */
const proofPoints = [
  { stat: "$10B+", label: "benchmarked across enterprise tech", source: "RampRate SPY Index" },
  { stat: "25 years", label: "advising Fortune 500 on infrastructure", source: "Microsoft, Disney, Goldman Sachs" },
  { stat: "93%", label: "client success score across all engagements", source: "19 client testimonials" },
  { stat: "5", label: "active psychedelic medicine investments", source: "MycoMedica, AtaiBeckley, Wake Network, Radicle Science, Tripp" },
  { stat: "1M+", label: "data points in the SPY Index", source: "Largest independent benchmark" },
  { stat: "4", label: "live impact token ecosystems", source: "ImpactSoul — Certified B Corp" },
];

export function SocialProofCascade({ variant = "inline" }: { variant?: "inline" | "sidebar" }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pick 3 random proof points
  const [selected] = useState(() => {
    const shuffled = [...proofPoints].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  if (variant === "sidebar") {
    return (
      <div ref={ref} style={{
        padding: "1rem",
        background: "rgba(139,105,20,0.04)",
        borderLeft: "2px solid rgba(139,105,20,0.2)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(10px)",
        transition: "all 0.6s ease",
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          color: "#8B6914",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "0.75rem",
        }}>
          WHY LISTEN
        </div>
        {selected.map((p, i) => (
          <div key={i} style={{ marginBottom: i < selected.length - 1 ? "0.6rem" : 0 }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#111",
            }}>
              {p.stat}
            </span>
            <span style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.85rem",
              color: "#666",
              marginLeft: "0.4rem",
            }}>
              {p.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} style={{
      display: "flex",
      gap: "clamp(1rem, 4vw, 2rem)",
      flexWrap: "wrap",
      justifyContent: "center",
      padding: "1rem 0",
      borderTop: "1px solid rgba(139,105,20,0.1)",
      borderBottom: "1px solid rgba(139,105,20,0.1)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(15px)",
      transition: "all 0.8s ease",
    }}>
      {selected.map((p, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#8B6914",
          }}>
            {p.stat}
          </div>
          <div style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.82rem",
            color: "#888",
            maxWidth: "160px",
          }}>
            {p.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   3. RETURN VISITOR HOOK
   Shows different content based on visit count
   ═══════════════════════════════════════════════════════ */
export function ReturnVisitorBanner() {
  const [location] = useLocation();
  const [visitCount, setVisitCount] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [fading, setFading] = useState(false);

  // Hide on standalone pages
  const standaloneRoutes = ["/", "/find-your-me", "/discover", "/blog"];
  const isStandalone = standaloneRoutes.some(r => location === r || location.startsWith(r + "/"));

  useEffect(() => {
    const count = incrementVisitCount();
    setVisitCount(count);
    if (safeSessionGet("tg_return_dismissed")) {
      setDismissed(true);
    }
  }, []);

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    if (visitCount >= 2 && !dismissed) {
      const timer = setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          setDismissed(true);
          safeSessionSet("tg_return_dismissed", "1");
        }, 400);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [visitCount, dismissed]);

  if (isStandalone) return null;

  const handleDismiss = () => {
    setFading(true);
    setTimeout(() => {
      setDismissed(true);
      safeSessionSet("tg_return_dismissed", "1");
    }, 300);
  };

  // Only show for return visitors (2nd visit onwards), not first-timers
  if (visitCount < 2 || dismissed) return null;

  const messages = [
    null, // visit 1 — no message
    { // visit 2
      text: "You came back.",
      cta: "What's new",
      href: "/",
    },
    { // visit 3
      text: "Third time — you're studying now.",
      cta: "Start here",
      href: "/start-here",
    },
    { // visit 4
      text: "Four visits. Just subscribe already.",
      cta: "Join",
      href: "/ecosystem",
    },
    { // visit 5+
      text: "Welcome home.",
      cta: "Pick up the phone",
      href: "/pick-up-the-phone",
    },
  ];

  const msg = messages[Math.min(visitCount, messages.length - 1)];
  if (!msg) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "1.5rem",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9998,
      background: "rgba(10,10,16,0.92)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderRadius: "999px",
      padding: "0.45rem 0.6rem 0.45rem 1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      animation: fading ? "toastOut 0.4s ease forwards" : "toastIn 0.5s ease",
      maxWidth: "calc(100vw - 2rem)",
    }}>
      <span style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "0.82rem",
        color: "rgba(255,255,255,0.85)",
        whiteSpace: "nowrap",
      }}>
        {msg.text}
      </span>
      <a
        href={msg.href}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          color: "#D4B96A",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          textDecoration: "none",
          whiteSpace: "nowrap",
          borderBottom: "1px solid rgba(212,185,106,0.4)",
          paddingBottom: "1px",
        }}
      >
        {msg.cta} →
      </a>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.4)",
          cursor: "pointer",
          fontSize: "0.85rem",
          padding: "0 0.15rem",
          lineHeight: 1,
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(1rem); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to { opacity: 0; transform: translateX(-50%) translateY(1rem); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   4. PUNCHED-UP SUBSCRIBE OUTBURST
   Mid-article interrupt — appears after 40% scroll on blog posts
   More personality than the standard email capture
   ═══════════════════════════════════════════════════════ */
export function SubscribeOutburst({ slug }: { slug: string }) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const triggered = useRef(false);
  const subscribeMutation = trpc.subscribe.add.useMutation();

  const outbursts = [
    {
      hook: "You're still here.",
      pitch: "Most people left two scrolls ago. You didn't. That tells me you're the kind of person who reads the whole thing, asks the second question, and stays after the talk ends. The dispatches are for people like you.",
    },
    {
      hook: "Quick confession.",
      pitch: "I write these for the people who make it to the middle. Not the headline-scanners. Not the hot-take tourists. The ones who actually want to understand how things work — and what's broken. You're one of them.",
    },
    {
      hook: "This is the quiet part.",
      pitch: "The part most people never reach. But you're here, which means you're either deeply curious or deeply procrastinating. Either way, the dispatches will find you at the right moment.",
    },
    {
      hook: "A thought, before you scroll on.",
      pitch: "There's a version of this conversation that goes deeper. Frameworks I'm still testing. Ideas that aren't ready for the main stage yet. The unpolished version. It arrives when it arrives.",
    },
  ];

  const [outburst] = useState(() => {
    const hash = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return outbursts[hash % outbursts.length];
  });

  useEffect(() => {
    if (safeSessionGet(`tg_outburst_${slug}`)) return;

    const handler = () => {
      if (triggered.current) return;
      const scrollPct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPct > 35) {
        triggered.current = true;
        setVisible(true);
        safeSessionSet(`tg_outburst_${slug}`, "1");
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeMutation.mutateAsync({ email, source: `outburst-${slug}` });
    } catch {}
    setSubmitted(true);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        margin: "2.5rem 0",
        position: "relative",
        overflow: "hidden",
        animation: "outburstReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Outer glow border */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(212,185,106,0.15) 0%, rgba(139,105,20,0.03) 40%, rgba(212,185,106,0.12) 60%, rgba(139,105,20,0.03) 100%)",
        backgroundSize: "300% 300%",
        animation: "outburstBorderShift 8s ease infinite",
      }} />

      <div style={{
        position: "relative",
        margin: "1px",
        padding: "2rem clamp(1.2rem, 3vw, 2rem)",
        background: "linear-gradient(160deg, #0D0C08 0%, #141210 40%, #0A0A08 100%)",
      }}>
        {/* Warm ambient glow */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", width: "200px", height: "150px",
          background: "radial-gradient(circle, rgba(212,185,106,0.05) 0%, transparent 70%)",
          transform: "translateX(-50%)", pointerEvents: "none",
        }} />

        {!submitted ? (
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Diamond glyph */}
            <div style={{
              textAlign: "center" as const,
              fontSize: "0.75rem",
              color: "rgba(212,185,106,0.35)",
              marginBottom: "1rem",
              letterSpacing: "0.4em",
            }}>
              ◇ ◆ ◇
            </div>

            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.15rem, 2.5vw, 1.35rem)",
              color: "#F5F0E0",
              marginBottom: "0.5rem",
              lineHeight: 1.4,
              fontWeight: 400,
              textAlign: "center" as const,
              fontStyle: "italic",
            }}>
              {outburst.hook}
            </p>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.88rem",
              color: "rgba(245,240,224,0.4)",
              lineHeight: 1.65,
              marginBottom: "1.5rem",
              textAlign: "center" as const,
              maxWidth: "420px",
              margin: "0 auto 1.5rem",
            }}>
              {outburst.pitch}
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", flexDirection: "column" as const, maxWidth: "400px", margin: "0 auto" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  minWidth: "0",
                  width: "100%",
                  padding: "0.75rem 1.1rem",
                  background: "rgba(212,185,106,0.03)",
                  border: `1px solid ${focused ? "rgba(212,185,106,0.4)" : "rgba(212,185,106,0.1)"}`,
                  color: "#F5F0E0",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "all 0.3s",
                  boxShadow: focused ? "0 0 0 3px rgba(212,185,106,0.05)" : "none",
                }}
              />
              <button
                type="submit"
                className="magnetic-cta"
                style={{
                  padding: "0.85rem 1.5rem",
                  minHeight: "44px",
                  width: "100%",
                  background: "linear-gradient(135deg, #8B6914 0%, #A07A16 50%, #D4B96A 100%)",
                  backgroundSize: "200% 100%",
                  border: "none",
                  color: "#0A0A08",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                  whiteSpace: "nowrap" as const,
                  transition: "background-position 0.4s",
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundPosition = "100% 0"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundPosition = "0% 0"; }}
              >
                LET ME IN
              </button>
            </form>
          </div>
        ) : (
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" as const, animation: "outburstWelcome 0.6s ease-out" }}>
            <div style={{ fontSize: "1.2rem", color: "#D4B96A", marginBottom: "0.8rem", animation: "outburstGlyphPulse 3s ease-in-out infinite" }}>◆</div>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.15rem",
              color: "#F5F0E0",
              marginBottom: "0.3rem",
              fontStyle: "italic",
            }}>
              <span className="gold-shimmer">Welcome to the smaller room.</span>
            </p>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.85rem",
              color: "rgba(245,240,224,0.4)",
              lineHeight: 1.6,
            }}>
              The next dispatch arrives when it arrives. No schedule. No algorithm.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes outburstReveal {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes outburstBorderShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes outburstWelcome {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes outburstGlyphPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); filter: drop-shadow(0 0 4px rgba(212,185,106,0.2)); }
          50% { opacity: 1; transform: scale(1.05); filter: drop-shadow(0 0 10px rgba(212,185,106,0.35)); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   5. SCROLL-TRIGGERED SOCIAL PROOF NUGGET
   Small, unobtrusive proof point that appears near
   subscribe forms or at 30% scroll
   ═══════════════════════════════════════════════════════ */
const nuggets = [
  "Trusted by Microsoft, Disney, Goldman Sachs, Nike, and 200+ enterprises",
  "25 years of naming what's broken and building what replaces it",
  "Six active psychedelic medicine investments. Spoke at Harvard H+ with Kurzweil.",
  "Featured in Forbes, Wired, HuffPost. Certified B Corp.",
  "$10B+ benchmarked. 93% client success score. 3× guarantee.",
  "91 essays. 15 years. Zero algorithm.",
];

export function ProofNugget() {
  const [nugget] = useState(() => nuggets[Math.floor(Math.random() * nuggets.length)]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.5rem 0",
    }}>
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.68rem",
        color: "#999",
        
        letterSpacing: "0.02em",
      }}>
        {nugget}
      </span>
    </div>
  );
}
