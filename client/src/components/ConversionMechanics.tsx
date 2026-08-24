import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { JewelPopup } from "@/components/JewelPopup";

function safeSessionGet(key: string): string | null {
  try { return safeSessionGet(key); } catch { return null; }
}
function safeSessionSet(key: string, value: string): void {
  try { sessionStorage.setItem(key, value); } catch { /* noop */ }
}

const STANDALONE_ROUTES = ["/find-your-me", "/discover"];
function useIsStandalone() {
  const [location] = useLocation();
  return STANDALONE_ROUTES.some(r => location === r || location.startsWith(r + "/"));
}

/* ─── Session ID (persisted per tab) ─── */
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
   1. EXIT INTENT POPUP — "The Jewel Box"
   Intimate, precious, warm — like finding a secret room.
   Not a newsletter form. An invitation into something rare.
   ═══════════════════════════════════════════════════════ */

export function ExitIntentPopup() {
  const isStandalone = useIsStandalone();
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dismissed = useRef(false);
  const subscribeMutation = trpc.subscribe.add.useMutation();

  useEffect(() => {
    if (isStandalone) return;
    if (safeSessionGet("tg_exit_shown")) return;
    // Never show to subscribers
    try { if (localStorage.getItem("tg_subscribed") === "true") return; } catch {}

    const handler = (e: MouseEvent) => {
      if (e.clientY < 10 && !dismissed.current) {
        setShow(true);
        safeSessionSet("tg_exit_shown", "1");
      }
    };

    // Wait 60 seconds before even listening for exit intent
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handler);
    }, 60000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handler);
    };
  }, []);

  const handleDismiss = () => { dismissed.current = true; setShow(false); };
  const handleSubmitEmail = async (email: string) => {
    try {
      await subscribeMutation.mutateAsync({ email, source: "exit-intent-jewel" });
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
   2. STICKY SHARING BAR (for blog posts)
   ═══════════════════════════════════════════════════════ */
export function StickyShareBar({ title, slug }: { title: string; slug: string }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [faded, setFaded] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackShareMutation = trpc.analytics.trackShare.useMutation();

  useEffect(() => {
    const handler = () => {
      const scrolled = window.scrollY > 400;
      setVisible(scrolled);
      // Reset fade on scroll
      setFaded(false);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      if (scrolled) {
        fadeTimer.current = setTimeout(() => setFaded(true), 4000);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, []);

  const createShortUrlMut = trpc.shortUrls.create.useMutation();
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  useEffect(() => {
    const path = `/blog/${slug}`;
    createShortUrlMut.mutateAsync({ targetPath: path }).then(r => {
      setShortUrl(`https://tonygreenberg.com${r.shortUrl}`);
    }).catch(() => {});
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  const url = shortUrl || (typeof window !== "undefined" ? window.location.href.replace(/^https?:\/\/[^/]+/, "https://tonygreenberg.com") : "");
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const share = (platform: string) => {
    trackShareMutation.mutate({ postSlug: slug, shareType: platform });
    if (platform === "copy") {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
      return;
    }
    if (platform === "email") {
      window.location.href = `mailto:?subject=${encodedTitle}&body=Read this: ${url}`;
      return;
    }
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };
    const targetUrl = urls[platform];
    if (!targetUrl) return;
    // Use anchor click to avoid popup blockers on mobile
    const a = document.createElement("a");
    a.href = targetUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!visible) return null;

  const stickyItems = [
    {
      platform: "twitter",
      label: "X",
      bg: "#000000",
      color: "#ffffff",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      platform: "linkedin",
      label: "in",
      bg: "#0A66C2",
      color: "#ffffff",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      platform: "email",
      label: "✉",
      bg: "transparent",
      color: "#8B6914",
      icon: null,
    },
    {
      platform: "copy",
      label: copied ? "✓" : "⎘",
      bg: "transparent",
      color: copied ? "#8B6914" : "#999",
      icon: null,
    },
  ];

  /* Mobile-only: compact bottom bar that fades to a thin line after 4s of no scroll,
     reappears on hover/touch. No desktop floating sidebar — inline ShareBar handles it. */
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
        padding: faded ? "2px 1rem" : "0.55rem 1rem",
        paddingBottom: faded ? "2px" : "calc(0.55rem + env(safe-area-inset-bottom, 0px))",
        background: "rgba(250,250,247,0.97)",
        borderTop: "1px solid rgba(139,105,20,0.12)",
        backdropFilter: "blur(8px)",
        transition: "all 0.4s ease",
        opacity: faded ? 0.3 : 1,
        transform: faded ? "translateY(60%)" : "translateY(0)",
      }}
      className="flex md:hidden"
      onMouseEnter={() => setFaded(false)}
      onTouchStart={() => setFaded(false)}
    >
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.65rem",
        color: "#999",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        opacity: faded ? 0 : 1,
        transition: "opacity 0.3s",
        marginRight: "0.2rem",
      }}>Share</span>
      {stickyItems.map(({ icon, platform, label, bg, color }) => (
        <button
          key={platform}
          onClick={() => share(platform)}
          title={label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.25rem",
            height: "32px",
            padding: icon ? "0 0.65rem" : "0 0.55rem",
            background: bg,
            border: bg === "transparent" ? "1px solid rgba(139,105,20,0.2)" : "none",
            borderRadius: "4px",
            color: color,
            fontSize: "0.78rem",
            fontFamily: "'DM Mono', monospace",
            cursor: "pointer",
            transition: "all 0.3s",
            opacity: faded ? 0 : 1,
            transform: faded ? "scale(0.6)" : "scale(1)",
          }}
        >
          {icon}
          {!icon && label}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   3. READING PROGRESS BAR
   ═══════════════════════════════════════════════════════ */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "4px",
      zIndex: 9998,
      background: "rgba(0,0,0,0.08)",
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #8B6914, #D4B96A, #F5E09A)",
        transition: "width 0.15s linear",
        boxShadow: "0 0 8px rgba(212,185,106,0.6)",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   4. MICRO-SURVEY ("Rate This Thinking")
   ═══════════════════════════════════════════════════════ */
export function RateThisThinking({ postSlug, topic }: { postSlug: string; topic: string }) {
  const [rated, setRated] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const rateMutation = trpc.blogRating.rate.useMutation();

  const handleRate = async (rating: string) => {
    setSelected(rating);
    setRated(true);
    try {
      await rateMutation.mutateAsync({
        postSlug,
        rating: rating as "completely" | "partially" | "not-yet",
        sessionId: getSessionId(),
      });
    } catch { /* silent */ }
  };

  return (
    <div style={{
      margin: "1.5rem 0",
      padding: "clamp(1rem, 3vw, 1.8rem)",
      background: "rgba(139,105,20,0.05)",
      borderLeft: "3px solid #8B6914",
    }}>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.72rem",
        color: "#8B6914",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        marginBottom: "0.75rem",
      }}>
        RATE THIS THINKING
      </p>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.15rem",
        color: "#0a0a0a",
        marginBottom: "1.25rem",
      }}>
        Did this change how you see {topic}?
      </p>

      {!rated ? (
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {[
            { value: "completely", label: "Completely", icon: "◉" },
            { value: "partially", label: "Shifted something", icon: "◎" },
            { value: "not-yet", label: "Not yet", icon: "○" },
          ].map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => handleRate(value)}
              style={{
                padding: "0.7rem 1.2rem",
                minHeight: "44px",
                background: "transparent",
                border: "1px solid rgba(139,105,20,0.4)",
                borderRadius: "2px",
                color: "#D4B96A",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      ) : (
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.9rem",
          color: "#8B6914",
        }}>
          {selected === "completely"
            ? "That's the point. The best ideas don't inform — they transform."
            : selected === "partially"
            ? "Good. A crack in the lens is how new light gets in."
            : "Fair. Some seeds take longer. Come back to this one."}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   4b. DISPATCH PREVIEW — "What Happens After You Subscribe"
   ═══════════════════════════════════════════════════════ */
function DispatchPreview() {
  const [open, setOpen] = useState(false);

  const sampleDispatches = [
    {
      subject: "The $2.4 Billion Mistake Nobody Talks About",
      preview: "Three Fortune 500 companies made the same infrastructure bet last quarter. Two of them already regret it. Here's what the third one knows that the others don't — and why it matters for anyone building anything right now.",
      date: "Last Tuesday",
    },
    {
      subject: "I Watched a Mushroom Dissolve 40 Years of Trauma",
      preview: "This isn't metaphor. I was in the room. The clinical data is catching up to what indigenous cultures have known for millennia, and the FDA is finally paying attention. Here's what's actually happening behind the headlines.",
      date: "Two weeks ago",
    },
    {
      subject: "Why Your Vendor Is Lying to You (And How to Prove It)",
      preview: "After 25 years benchmarking $10B+ in enterprise contracts, I can tell you the three sentences every vendor uses right before they overcharge you by 40%. I'm going to teach you to hear them.",
      date: "Last month",
    },
  ];

  return (
    <div style={{ marginTop: "1rem", textAlign: "center" as const }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          color: "rgba(212,185,106,0.35)",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          cursor: "pointer",
          padding: "0.3rem 0",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "rgba(212,185,106,0.7)"; }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(212,185,106,0.35)"; }}
      >
        {open ? "▾" : "▸"} PEEK INSIDE A DISPATCH
      </button>

      {open && (
        <div style={{
          marginTop: "0.8rem",
          animation: "jewelFadeIn 0.4s ease-out",
        }}>
          <div style={{
            border: "1px solid rgba(212,185,106,0.08)",
            background: "rgba(212,185,106,0.015)",
            padding: "1rem 1.2rem",
            maxWidth: "400px",
            margin: "0 auto",
            textAlign: "left" as const,
          }}>
            {/* Fake email header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.6rem",
              paddingBottom: "0.6rem",
              borderBottom: "1px solid rgba(212,185,106,0.06)",
            }}>
              <div style={{
                width: "24px", height: "24px",
                background: "linear-gradient(135deg, #8B6914, #D4B96A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.6rem", fontWeight: 700, color: "#0A0A08",
                fontFamily: "'DM Mono', monospace",
              }}>TG</div>
              <div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.72rem", color: "rgba(245,240,224,0.5)" }}>Tony Greenberg</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "rgba(245,240,224,0.2)" }}>to you</div>
              </div>
              <div style={{ marginLeft: "auto", fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "rgba(245,240,224,0.15)" }}>
                {sampleDispatches[Math.floor(Math.random() * sampleDispatches.length)].date}
              </div>
            </div>

            {/* Sample subject + preview */}
            {(() => {
              const dispatch = sampleDispatches[Math.floor(Date.now() / 10000) % sampleDispatches.length];
              return (
                <>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.95rem",
                    color: "#F5F0E0",
                    lineHeight: 1.4,
                    marginBottom: "0.5rem",
                    fontWeight: 400,
                  }}>
                    {dispatch.subject}
                  </p>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.78rem",
                    color: "rgba(245,240,224,0.35)",
                    lineHeight: 1.6,
                    marginBottom: "0.6rem",
                  }}>
                    {dispatch.preview}
                  </p>
                </>
              );
            })()}

            {/* Fade-out effect */}
            <div style={{
              height: "30px",
              background: "linear-gradient(to bottom, transparent, rgba(10,10,8,0.95))",
              margin: "0 -1.2rem -1rem",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: "0.3rem",
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.55rem",
                color: "rgba(212,185,106,0.3)",
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
              }}>
                subscribe to keep reading →
              </span>
            </div>
          </div>

          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.65rem",
            color: "rgba(245,240,224,0.15)",
            marginTop: "0.5rem",
            fontStyle: "italic",
          }}>
            Arrives when it arrives. No schedule. No algorithm.
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   5. EMAIL CAPTURE — "Subscribe to the Outbursts" + Tip Me Off
   ═══════════════════════════════════════════════════════ */
export function EmailCapture({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(() => {
    try { return localStorage.getItem("tg_subscribed") === "true"; } catch { return false; }
  });
  const [showTipOff, setShowTipOff] = useState(false);
  const [focused, setFocused] = useState(false);
  const subscribeMutation = trpc.subscribe.add.useMutation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeMutation.mutateAsync({ email, source });
      setSubmitted(true);
      try { localStorage.setItem("tg_subscribed", "true"); } catch {}
    } catch {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div style={{
        position: "relative",
        padding: "2.5rem clamp(1.5rem, 4vw, 3rem)",
        textAlign: "center" as const,
      }}>
        {/* Warm ambient glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", width: "180px", height: "180px",
          background: "radial-gradient(circle, rgba(212,185,106,0.08) 0%, transparent 70%)",
          transform: "translateX(-50%)", pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1, animation: "jewelFadeIn 0.6s ease-out" }}>
          <div style={{ fontSize: "1.4rem", color: "#D4B96A", marginBottom: "1rem", animation: "jewelGlyphPulse 3s ease-in-out infinite" }}>◆</div>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.25rem",
            color: "#F5F0E0",
            marginBottom: "0.5rem",
            fontStyle: "italic",
          }}>
            <span className="gold-shimmer">Welcome to the smaller room.</span>
          </p>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.88rem",
            color: "rgba(245,240,224,0.4)",
            lineHeight: 1.6,
            maxWidth: "320px",
            margin: "0 auto",
          }}>
            The next dispatch arrives when it arrives. No schedule. No algorithm. Just the things I can't stop thinking about.
          </p>
        </div>
        <style>{`
          @keyframes jewelFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes jewelGlyphPulse { 0%, 100% { opacity: 0.7; transform: scale(1); filter: drop-shadow(0 0 4px rgba(212,185,106,0.2)); } 50% { opacity: 1; transform: scale(1.05); filter: drop-shadow(0 0 12px rgba(212,185,106,0.4)); } }
        `}</style>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        padding: "1.5rem clamp(1rem, 4vw, 2rem)",
        borderTop: "1px solid rgba(139,105,20,0.18)",
        borderBottom: "1px solid rgba(139,105,20,0.18)",
        background: "rgba(212,185,106,0.03)",
      }}
    >
      {/* Eyebrow */}
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.62rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase" as const,
        color: "#8B6914",
        marginBottom: "0.4rem",
      }}>
        ◆ The Dispatch
      </p>

      {/* Headline */}
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)",
        color: "#1A1710",
        lineHeight: 1.4,
        marginBottom: "0.35rem",
        fontWeight: 600,
        fontStyle: "italic",
      }}>
        Not a newsletter. More like a note left on your windshield.
      </p>
      <p style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "0.88rem",
        color: "#5C5240",
        lineHeight: 1.6,
        marginBottom: "1rem",
      }}>
        Arrives when something is actually worth saying. No cadence. No funnel. Just the things I couldn't not write.
      </p>

      {/* Inline form */}
      <form onSubmit={handleSubmit}>
        <div style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap" as const,
          alignItems: "stretch",
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="your@email.com"
            required
            style={{
              flex: "1 1 180px",
              minWidth: "0",
              padding: "0.65rem 1rem",
              background: "#FAFAF7",
              border: `1px solid ${focused ? "#8B6914" : "rgba(139,105,20,0.25)"}`,
              color: "#1A1710",
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.95rem",
              outline: "none",
              transition: "border-color 0.2s",
              borderRadius: "2px",
            }}
          />
          <button
            type="submit"
            style={{
              flex: "0 0 auto",
              padding: "0.65rem 1.4rem",
              minHeight: "44px",
              background: "#8B6914",
              border: "none",
              color: "#FAFAF7",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
              borderRadius: "2px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#A07A16"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "#8B6914"; }}
          >
            I'm in →
          </button>
        </div>
      </form>

      <p style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "0.72rem",
        color: "rgba(90,80,60,0.45)",
        marginTop: "0.5rem",
        fontStyle: "italic",
      }}>
        No algorithm. No pitch deck. Leave whenever.
      </p>

      <style>{`
        @keyframes jewelFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   6. FLOATING PROMPT ("What's Your Question?")
   ═══════════════════════════════════════════════════════ */
export function FloatingPrompt() {
  const isStandalone = useIsStandalone();
  const [expanded, setExpanded] = useState(false);

  if (isStandalone) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      zIndex: 100,
    }}>
      {expanded ? (
        <div style={{
          background: "#FEFCF7",
          border: "1px solid rgba(139,105,20,0.2)",
          boxShadow: "0 8px 32px rgba(139,105,20,0.12)",
          borderRadius: "2px",
          padding: "1.5rem",
          width: "280px",
          animation: "fadeIn 0.2s ease",
        }}>
          <button
            onClick={() => setExpanded(false)}
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.75rem",
              background: "none",
              border: "none",
              color: "#999",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ×
          </button>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1rem",
            color: "#0a0a0a",
            marginBottom: "0.75rem",
            lineHeight: 1.4,
          }}>
            What's the one question keeping you up at night?
          </p>
          <a
            href="mailto:Tony@joyandwoe.com?subject=The%20question%20keeping%20me%20up"
            style={{
              display: "block",
              padding: "0.6rem 1rem",
              background: "#8B6914",
              borderRadius: "2px",
              color: "#FAFAF7",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            ASK TONY
          </a>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#8B6914",
            border: "none",
            color: "#FAFAF7",
            fontSize: "1.2rem",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(139,105,20,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
          }}
          title="Ask Tony a question"
        >
          ?
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   7. ANALYTICS TRACKER (invisible — fires on every page)
   ═══════════════════════════════════════════════════════ */
// ── GA4 event helper ──
export function fireGA4(eventName: string, params?: Record<string, string | number | boolean>) {
  try {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", eventName, params || {});
    }
  } catch { /* noop */ }
}

export function AnalyticsTracker({ path, postSlug }: { path: string; postSlug?: string }) {
  const trackMutation = trpc.analytics.trackPageView.useMutation();
  const updateMutation = trpc.analytics.updateReadTime.useMutation();
  const pageViewId = useRef<number | null>(null);
  const startTime = useRef(Date.now());
  const scrollMilestonesHit = useRef<Set<number>>(new Set());
  const engagedFired = useRef(false);

  useEffect(() => {
    startTime.current = Date.now();
    scrollMilestonesHit.current = new Set();
    engagedFired.current = false;
    const sid = getSessionId();
    const isArticle = path.startsWith("/blog/");
    const isHomepage = path === "/";

    trackMutation.mutateAsync({
      path,
      postSlug,
      sessionId: sid,
      referrer: document.referrer || undefined,
    }).then((result) => {
      if (result?.id) pageViewId.current = result.id;
    }).catch(() => {});

    // ── Scroll milestone tracking (25/50/75/90%) ──
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      for (const m of [25, 50, 75, 90]) {
        if (pct >= m && !scrollMilestonesHit.current.has(m)) {
          scrollMilestonesHit.current.add(m);
          const evtName = isArticle ? `article_${m}_scroll` : `page_${m}_scroll`;
          fireGA4(evtName, { page_path: path, post_slug: postSlug || "" });
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ── 45-second engaged visitor ──
    const engagedTimer = setTimeout(() => {
      if (!engagedFired.current) {
        engagedFired.current = true;
        fireGA4("engaged_45_seconds", { page_path: path });
      }
    }, 45000);

    // ── Second page view ──
    const prevPath = safeSessionGet("tg_prev_path");
    if (prevPath && prevPath !== path) {
      fireGA4("second_page_view", { from_path: prevPath, to_path: path });
    }
    safeSessionSet("tg_prev_path", path);

    // ── Homepage path click tracking ──
    let homepathListener: ((e: MouseEvent) => void) | null = null;
    if (isHomepage) {
      homepathListener = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest("a[href]");
        if (!target) return;
        const href = (target as HTMLAnchorElement).getAttribute("href") || "";
        if (href.includes("/amplifier") || href.includes("/diamond-cut") || href.includes("/engage")) {
          fireGA4("homepage_path_work", { destination: href });
        } else if (href.includes("/blog") || href.includes("/articles") || href.includes("/essays")) {
          fireGA4("homepage_path_thinking", { destination: href });
        } else if (href.includes("/ecosystem") || href.includes("/invest") || href.includes("/projects")) {
          fireGA4("homepage_path_building", { destination: href });
        } else if (href.includes("/start-here")) {
          fireGA4("start_here_open", { destination: href });
        }
      };
      document.addEventListener("click", homepathListener);
    }

    // ── Read time on unload ──
    let hasSentReadTime = false;
    const sendReadTime = () => {
      if (!pageViewId.current || hasSentReadTime) return;
      const readTimeMs = Date.now() - startTime.current;
      if (readTimeMs < 1000) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0;
      hasSentReadTime = true;
      updateMutation.mutate({ pageViewId: pageViewId.current, readTimeMs, scrollDepth });
    };
    const handleBeforeUnload = () => {
      if (!pageViewId.current || hasSentReadTime) return;
      const readTimeMs = Date.now() - startTime.current;
      if (readTimeMs < 1000) return;
      const scrollable2 = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = scrollable2 > 0 ? Math.min(100, Math.round((window.scrollY / scrollable2) * 100)) : 0;
      hasSentReadTime = true;
      const body = JSON.stringify({ "0": { json: { pageViewId: pageViewId.current, readTimeMs, scrollDepth } } });
      navigator.sendBeacon("/api/trpc/analytics.updateReadTime?batch=1", new Blob([body], { type: "application/json" }));
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendReadTime();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      sendReadTime();
      clearTimeout(engagedTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (homepathListener) document.removeEventListener("click", homepathListener);
    };
  }, [path]); // eslint-disable-line
  return null;
}

/* ═══════════════════════════════════════════════════════
   8. SOCIAL PROOF TICKER
   ═══════════════════════════════════════════════════════ */
export function SocialProofTicker() {
  const items = [
    "Disney — 21× ROI",
    "Blizzard — 24× ROI",
    "$10B+ Benchmarked",
    "Microsoft — 18× ROI",
    "H+ Summit at Harvard with Kurzweil",
    "eBay — 22× ROI",
    "93% Client Success Score",
    "ViacomCBS — 19× ROI",
    "25 Years · 1M+ Data Points",
    "Sony Music — 24× ROI",
    "Goldman Sachs — 16× ROI",
    "Nike — 20× ROI",
    "BBC — 17× ROI",
    "Certified B Corp",
    "19 Client Testimonials",
    "3× Guarantee on Every Retainer",
  ];

  const doubled = [...items, ...items]; // seamless loop

  return (
    <div style={{
      overflow: "hidden",
      background: "rgba(139,105,20,0.08)",
      borderTop: "1px solid rgba(139,105,20,0.15)",
      borderBottom: "1px solid rgba(139,105,20,0.15)",
      padding: "0.6rem 0",
      position: "relative",
    }}>
      <div
        style={{
          display: "flex",
          gap: "3rem",
          animation: "tickerScroll 60s linear infinite",
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "#D4B96A",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
