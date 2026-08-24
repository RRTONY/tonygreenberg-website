/**
 * BehaviorOverlays — returning visitor card, assessment banner, scroll email nudge.
 * RULES:
 * 1. Never show subscribe prompts to people who already subscribed (localStorage flag).
 * 2. Wait at least 60 seconds on the page before any subscribe nudge.
 * 3. Scroll email nudge is a small bottom-corner card, NOT a full-screen modal.
 * 4. Respect dismissals — once dismissed, don't show again for the session.
 * 5. Only one overlay at a time — never stack popups.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useBehavior } from "@/hooks/useBehavior";
import { trpc } from "@/lib/trpc";

/** Check if user has previously subscribed */
function isAlreadySubscribed(): boolean {
  try {
    return localStorage.getItem("tg_subscribed") === "true";
  } catch {
    return false;
  }
}

/** Mark user as subscribed */
function markSubscribed() {
  try {
    localStorage.setItem("tg_subscribed", "true");
  } catch { /* noop */ }
}

export function BehaviorOverlays() {
  const { isReturning, assessmentDone, pageviews, trackPageview, hasSeenScrollModal, markScrollModalShown } = useBehavior();
  const [showScrollNudge, setShowScrollNudge] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(isAlreadySubscribed());
  const [location] = useLocation();
  const pageLoadTime = useRef(Date.now());

  const subscribeMutation = trpc.subscribe.add.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      markSubscribed();
    },
  });

  const handleSubscribe = () => {
    if (!email || subscribed) return;
    subscribeMutation.mutate({ email, source: "scroll-nudge" });
  };

  // Track pageview on route change
  useEffect(() => { trackPageview(); }, [location, trackPageview]);

  // Reset page load time on route change
  useEffect(() => { pageLoadTime.current = Date.now(); }, [location]);

  // Returning visitor popup (show once per session, small card, not modal)
  useEffect(() => {
    if (isReturning && !sessionStorage.getItem("tg_welcome_shown")) {
      const timer = setTimeout(() => {
        setShowWelcome(true);
        sessionStorage.setItem("tg_welcome_shown", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isReturning]);

  // Auto-dismiss welcome after 8 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Assessment banner after 5 pageviews without assessment
  useEffect(() => {
    if (pageviews >= 5 && !assessmentDone && !sessionStorage.getItem("tg_banner_dismissed")) {
      setShowBanner(true);
    }
  }, [pageviews, assessmentDone]);

  // Scroll nudge — small corner card, only after 60s on page AND 70% scroll, never for subscribers
  useEffect(() => {
    if (subscribed || isAlreadySubscribed()) return;
    if (hasSeenScrollModal()) return;

    const onScroll = () => {
      const timeOnPage = Date.now() - pageLoadTime.current;
      if (timeOnPage < 180000) return; // Must be on page 3+ minutes before nudge

      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPct > 0.7) {
        setShowScrollNudge(true);
        markScrollModalShown();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasSeenScrollModal, markScrollModalShown, subscribed]);

  const dismissWelcome = useCallback(() => setShowWelcome(false), []);
  const dismissBanner = useCallback(() => {
    setShowBanner(false);
    sessionStorage.setItem("tg_banner_dismissed", "true");
  }, []);
  const dismissScrollNudge = useCallback(() => setShowScrollNudge(false), []);

  return (
    <>
      {/* Returning visitor — small bottom-right card, auto-dismisses */}
      {showWelcome && (
        <div
          className="welcome-back-card"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 9000,
            maxWidth: 280,
            borderRadius: 12,
            overflow: "hidden",
            animation: "slideUpFade 0.4s ease-out",
          }}
        >
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10, 10, 16, 0.88)",
            backdropFilter: "blur(20px) saturate(1.4)",
            WebkitBackdropFilter: "blur(20px) saturate(1.4)",
            borderRadius: 12,
            border: "1px solid rgba(212, 185, 106, 0.15)",
          }} />
          <div style={{ position: "relative", zIndex: 2, padding: "16px 20px 14px" }}>
            <button
              onClick={dismissWelcome}
              style={{
                position: "absolute", top: 6, right: 10,
                background: "none", border: "none", fontSize: 16,
                color: "rgba(212, 185, 106, 0.4)", cursor: "pointer", lineHeight: 1,
              }}
            >×</button>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 16, fontWeight: 600,
              color: "#F5E6A3", marginBottom: 4,
            }}>
              Oh, it's you again.
            </div>
            <div style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 13, color: "rgba(232, 228, 218, 0.6)",
              lineHeight: 1.5,
            }}>
              Something new since you left.
            </div>
          </div>
        </div>
      )}

      {/* Assessment banner — slim bottom bar */}
      {showBanner && !showWelcome && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 8000,
          background: "#1A1A1A", padding: "10px 20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 12, flexWrap: "wrap",
          animation: "slideUpFade 0.3s ease-out",
        }}>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: "#E8E4DA" }}>
            What does your biology, your risk profile, and your next chapter have in common?
          </span>
          <a href="/assessment" style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            letterSpacing: "0.1em", color: "#D4B96A",
            textDecoration: "none", textTransform: "uppercase",
          }}>Find Out →</a>
          <button onClick={dismissBanner} style={{
            background: "none", border: "none", color: "#666",
            fontSize: 14, cursor: "pointer", marginLeft: 4,
          }}>×</button>
        </div>
      )}

      {/* Scroll subscribe nudge — small corner card, NOT a full-screen modal */}
      {showScrollNudge && !subscribed && (
        <div style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 9500,
          maxWidth: 320, width: "calc(100vw - 40px)",
          borderRadius: 12, overflow: "hidden",
          animation: "slideUpFade 0.4s ease-out",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}>
          <div style={{
            background: "rgba(250, 247, 242, 0.97)",
            backdropFilter: "blur(12px)",
            borderRadius: 12,
            border: "1px solid rgba(139, 105, 20, 0.15)",
            padding: "16px 18px 14px",
          }}>
            <button onClick={dismissScrollNudge} style={{
              position: "absolute", top: 8, right: 12,
              background: "none", border: "none", fontSize: 16,
              color: "#999", cursor: "pointer",
            }}>×</button>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 15, color: "#111", marginBottom: 6,
            }}>
              Enjoying this?
            </div>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 13, color: "#666", lineHeight: 1.5,
              marginBottom: 10, marginTop: 0,
            }}>
              New essays delivered when they're ready. No spam.
            </p>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1, padding: "8px 10px",
                  border: "1px solid #D4C9A8", borderRadius: 4,
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: 13,
                  background: "#fff", color: "#222", minWidth: 0,
                }}
              />
              <button
                onClick={handleSubscribe}
                disabled={subscribeMutation.isPending || subscribed || !email}
                style={{
                  background: subscribed ? "#2D5A27" : "#8B6914",
                  color: "#fff", border: "none", borderRadius: 4,
                  padding: "8px 14px",
                  fontFamily: "'DM Mono', monospace", fontSize: 10,
                  letterSpacing: "0.08em", cursor: subscribed ? "default" : "pointer",
                  opacity: subscribeMutation.isPending ? 0.7 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {subscribed ? "Done ✓" : subscribeMutation.isPending ? "..." : "Subscribe"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
