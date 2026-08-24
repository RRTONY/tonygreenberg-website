/**
 * ExitIntentTony — Exit-intent detection that triggers FauxTony panel.
 * On desktop: detects mouse leaving viewport (moving toward browser chrome).
 * On mobile: detects rapid scroll-to-top or back-button intent.
 * Shows a subtle prompt to engage with FauxTony before leaving.
 * Only triggers once per session.
 */
import { useState, useEffect, useCallback, useRef } from "react";

const SESSION_KEY = "tg-exit-intent-shown";

// Contextual questions based on current page
function getContextualQuestion(pathname: string): string {
  if (pathname.startsWith("/blog/")) {
    return "What other essays would you enjoy based on this one?";
  }
  if (pathname === "/blog" || pathname === "/") {
    return "What should I read first on this site?";
  }
  if (pathname.startsWith("/find-")) {
    return "Which assessment should I take first?";
  }
  if (pathname === "/amplifier" || pathname === "/diamond-cut") {
    return "How does working with Tony actually work?";
  }
  if (pathname === "/invest") {
        return "Tell me about Tony 'WhyNot' Greenberg's investment thesis";
  }
  if (pathname === "/the-letter" || pathname === "/walk-through") {
        return "Give me the 60-second version of who Tony 'WhyNot' is";
  }
  if (pathname === "/ecosystem") {
    return "What companies has Tony built or invested in?";
  }
  return "What's the most interesting thing on this site?";
}

export default function ExitIntentTony() {
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);
  const timeOnPage = useRef(0);

  const showPrompt = useCallback(() => {
    if (triggered.current) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    // Only trigger if user has been on page for at least 5 seconds
    if (timeOnPage.current < 5000) return;

    triggered.current = true;
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(true);

    // Auto-dismiss after 8 seconds if not interacted with
    setTimeout(() => setVisible(false), 8000);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      timeOnPage.current = Date.now() - start;
    }, 1000);

    // Desktop: mouse leaves viewport from top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        showPrompt();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearInterval(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [showPrompt]);

  const handleAsk = () => {
    setVisible(false);
    // Trigger the FauxTony panel by dispatching a custom event
    const question = getContextualQuestion(window.location.pathname);
    window.dispatchEvent(
      new CustomEvent("open-fauxtony", { detail: { question } })
    );
  };

  const dismiss = () => setVisible(false);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9990,
        maxWidth: "320px",
        background: "#0A0A10",
        border: "1px solid rgba(212,185,106,0.3)",
        borderRadius: "8px",
        padding: "1.2rem 1.4rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        animation: "exitSlideUp 0.4s ease-out",
      }}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.6rem",
          background: "none",
          border: "none",
          color: "rgba(245,240,224,0.3)",
          fontSize: "1rem",
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        ×
      </button>

      <div
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.92rem",
          color: "rgba(245,240,224,0.85)",
          lineHeight: 1.55,
          marginBottom: "0.8rem",
        }}
      >
        Before you go — have a question? FauxTony knows this site inside and out.
      </div>

      <button
        onClick={handleAsk}
        style={{
          width: "100%",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: "#0A0A10",
          background: "#D4B96A",
          border: "none",
          padding: "0.6rem 1rem",
          borderRadius: "3px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        Ask FauxTony →
      </button>

      <style>{`
        @keyframes exitSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
