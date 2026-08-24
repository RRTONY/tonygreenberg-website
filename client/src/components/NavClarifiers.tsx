/**
 * NavClarifiers — micro-clarity layer for abstract nav items.
 *
 * Desktop: soft-fade tooltip on hover (neutral, no shadow, max 8 words).
 * Mobile: muted grey helper line under the label.
 * Skip obvious items: Blog, Invest, Shop, Subscribe, Connect.
 *
 * "Start Here → 90-second orientation" footer in every dropdown.
 */

import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";

/* ── Clarifier map ── */
export const clarifiers: Record<string, string> = {
  /* Primary bar */
  "/amplifier": "Collaborate or expand this work",
  "/diamond-cut": "Premium strategy and sharpening",

  /* Find Yourself category */
  "/find-my": "Identity clarity assessments",
  "/my-journey": "Track progress and next steps",
  "/self-portrait": "Your traits, values, profile",
  "/ecosystem-map": "Visual map of your life system",

  /* Read category */
  "/the-letter": "Simple overview of this project",
  "/living-declaration": "Core worldview and principles",
  "/published": "Finished public essays",
  "/series": "Multi-part themed collections",
  "/the-nightstand": "Books and influences",

  /* Explore category */
  "/walk-through": "Guided site tour",
  "/the-territory": "Core ideas and how they connect",
  "/the-index": "Everything organized in one place",
  "/the-web": "Connected thinking across projects",
  "/framework": "Models you can apply immediately",

  /* Engage category */
  "/engage": "Qualification audit before booking",

  /* The Work category */
  "/engine-room": "Active builds and operations",
  "/under-nda": "Restricted private work",
  "/intel": "Research and strategic notes",
  "/clients": "Trusted people and partners",
  "/recent-creations": "Things Tony built",

  /* Body & Spirit category */
  "/the-body": "Health and performance protocols",
  "/spirits": "Plant medicine resources and ceremony prep",
  "/journeys": "Guided transformation paths",
  "/fauxtony": "AI trained on Tony's thinking and work",
  "/brewsoul": "Coffee intelligence — 103 coffees, 100 chains",

  /* ── Find Your Me assessment sub-items ── */

  /* Know Thyself */
  "/the-mirror": "Honest life-stage reflection",
  "/assessments/dharma-finder": "Discover your life purpose",
  "/assessments/consciousness-scale": "Map your awareness level",
  "/assessments/grant-study": "Score your life satisfaction",
  "/find-your-spirit": "Spiritual archetype assessment",

  /* Love & Belonging */
  "/community": "Find your people and tribe",
  "/find-your-attachment-style": "How you bond in relationships",
  "/find-your-love-language": "How you give and receive love",
  "/find-your-sexuality": "Explore your identity spectrum",

  /* Body & Temple */
  "/find-your-diet": "Nutrition matched to your body",
  "/find-your-movement": "Exercise style that fits you",
  "/find-your-sleep": "Optimize your rest patterns",

  /* Taste & Ritual */
  "/find-your-sake": "Japanese sake pairing guide",
  "/find-your-coffee": "Your ideal coffee profile",
  "/find-your-kitchen": "Cooking style and preferences",
  "/brewsoul/chains": "100 chains ranked S through F",
  "/brewsoul/prescription": "AI coffee recommendations",
  "/brewsoul/browse": "All 103 coffees scored and rated",

  /* Mind & Systems */
  "/find-your-peptide": "Peptide therapy matched to you",
  "/peptide-supply-chain": "Follow the money in peptides",
  "/peptide-hall-of-shame": "Bad actors in peptide industry",
  "/peptide-matrix": "Review versus clinical evidence",
  "/quiz_25q": "Test your peptide knowledge",
  "/peptide-watch": "Consumer safety guide with checklists",
  "/find-your-therapy": "Therapeutic modality matched to you",
  "/find-your-religion": "Spiritual tradition explorer",
  "/find-your-style": "Personal style and aesthetic profile",

  /* Psychedelic Readiness */
  "/psychedelic-readiness-index": "25 medicines, 25 questions, safety data",
  "/peyote-mescaline": "Pharmacology, Latuda Mirror, outcomes",
};

/* Items to skip (obvious enough) */
const skipPaths = new Set([
  "/", "/blog", "/invest", "/shop", "/subscribe",
  "/pick-up-the-phone",
]);

export function getClarifier(href: string): string | undefined {
  if (skipPaths.has(href)) return undefined;
  return clarifiers[href];
}

/* ── Desktop Tooltip wrapper ── */
export function NavTooltip({
  href,
  children,
  isDark,
}: {
  href: string;
  children: React.ReactNode;
  isDark: boolean;
}) {
  const clarifier = getClarifier(href);
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  if (!clarifier) return <>{children}</>;

  const handleEnter = () => {
    timeoutRef.current = setTimeout(() => setShow(true), 150);
  };
  const handleLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
    >
      {children}
      {show && (
        <span
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.68rem",
            fontWeight: 400,
            letterSpacing: "0.02em",
            textTransform: "none",
            color: isDark ? "#999" : "#777",
            background: isDark ? "rgba(26,26,34,0.95)" : "rgba(250,250,247,0.95)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            borderRadius: "4px",
            padding: "3px 8px",
            zIndex: 300,
            pointerEvents: "none",
            animation: "navTooltipFade 0.2s ease-out",
          }}
        >
          {clarifier}
        </span>
      )}
    </span>
  );
}

/* ── Mobile helper line ── */
export function MobileHelper({ href }: { href: string }) {
  const clarifier = getClarifier(href);
  if (!clarifier) return null;

  return (
    <span
      style={{
        display: "block",
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "0.65rem",
        fontWeight: 400,
        letterSpacing: "0.01em",
        textTransform: "none",
        color: "#888",
        marginTop: "-2px",
        lineHeight: 1.3,
      }}
    >
      {clarifier}
    </span>
  );
}

/* ── Dropdown orientation footer ── */
export function DropdownOrientationFooter({
  isDark,
  onClose,
}: {
  isDark: boolean;
  onClose?: () => void;
}) {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        borderTop: `1px solid rgba(139,105,20,0.1)`,
        paddingTop: "0.5rem",
        marginTop: "0.25rem",
        textAlign: "center",
      }}
    >
      <Link
        href="/walk-through"
        onClick={onClose}
        className="no-underline"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.58rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: isDark ? "#888" : "#999",
          textDecoration: "none",
          transition: "color 0.15s",
        }}
      >
        Start Here → 90-second orientation
      </Link>
    </div>
  );
}
