/**
 * JourneyBar — Contextual "What's Next" navigation for BrewSoul pages.
 * 
 * Shows the user where they are in the BrewSoul journey and suggests
 * the most relevant next steps based on their current page.
 * 
 * Designed to eliminate dead ends and create a connected experience.
 */
import { Link, useLocation } from "wouter";

/* ── Journey step definitions ── */
const JOURNEY_STEPS = [
  { id: "identity", label: "Identity Quiz", path: "/brewsoul", icon: "🪞", short: "Identity" },
  { id: "first-sip", label: "The First Sip", path: "/brewsoul/first-sip", icon: "✨", short: "Manifesto" },
  { id: "home", label: "Dashboard", path: "/brewsoul/home", icon: "☕", short: "Home" },
  { id: "quiz", label: "Taste Quiz", path: "/brewsoul/quiz", icon: "🎯", short: "Taste" },
  { id: "browse", label: "Catalog", path: "/brewsoul/browse", icon: "📖", short: "Browse" },
  { id: "chains", label: "Chain Rankings", path: "/brewsoul/chains", icon: "🏪", short: "Chains" },
] as const;

/* ── Contextual suggestions per page ── */
type Suggestion = { label: string; path: string; why: string };

const SUGGESTIONS: Record<string, Suggestion[]> = {
  "/brewsoul/first-sip": [
    { label: "Coffee Prescription", path: "/brewsoul/prescription", why: "Your daily recommendation" },
    { label: "Coffee & Health", path: "/brewsoul/health", why: "What science says" },
    { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", why: "Where your money goes" },
  ],
  "/brewsoul/home": [
    { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Find your perfect match" },
    { label: "Browse All 103 Coffees", path: "/brewsoul/browse", why: "Explore the full catalog" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "Is your daily stop worth it?" },
  ],
  "/brewsoul/browse": [
    { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Let us match you" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "Compare chains" },
    { label: "Compare Coffees", path: "/brewsoul/compare", why: "Side by side" },
  ],
  "/brewsoul/quiz": [
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "See all 103 coffees" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "Rate your daily stop" },
    { label: "Dashboard", path: "/brewsoul/home", why: "Back to overview" },
  ],
  "/brewsoul/chains": [
    { label: "Browse Top Coffees", path: "/brewsoul/browse", why: "Find better options" },
    { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Get matched" },
    { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", why: "Where your money goes" },
  ],
  "/brewsoul/wall-of-shame": [
    { label: "Browse Clean Coffees", path: "/brewsoul/browse", why: "Find the good stuff" },
    { label: "Mold-Free Verified", path: "/brewsoul/mold-free", why: "Tested & clean" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "Who's actually good?" },
  ],
  "/brewsoul/follow-the-dollar": [
    { label: "Farm Profiles", path: "/brewsoul/farms", why: "Meet the growers" },
    { label: "Economics Deep Dive", path: "/brewsoul/economics", why: "The full picture" },
    { label: "Browse Ethical Coffees", path: "/brewsoul/browse", why: "Vote with your cup" },
  ],
  "/brewsoul/health": [
    { label: "Mold-Free Verified", path: "/brewsoul/mold-free", why: "Tested & clean" },
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find healthy options" },
    { label: "Processing Methods", path: "/brewsoul/processing", why: "How it's made matters" },
  ],
  "/brewsoul/farms": [
    { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", why: "Where money goes" },
    { label: "Economics", path: "/brewsoul/economics", why: "The supply chain" },
    { label: "Browse Farm Coffees", path: "/brewsoul/browse", why: "Taste the origin" },
  ],
  "/brewsoul/mold-free": [
    { label: "Health Claims", path: "/brewsoul/health", why: "What science says" },
    { label: "Wall of Shame", path: "/brewsoul/wall-of-shame", why: "Who's failing" },
    { label: "Browse Clean Coffees", path: "/brewsoul/browse", why: "Find verified options" },
  ],
  "/brewsoul/experiences": [
    { label: "Food Pairings", path: "/brewsoul/pairings", why: "Perfect combinations" },
    { label: "Blend Builder", path: "/brewsoul/blend-builder", why: "Create your own" },
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find your next cup" },
  ],
  "/brewsoul/varieties": [
    { label: "Processing Methods", path: "/brewsoul/processing", why: "How it's made" },
    { label: "Roaster Profiles", path: "/brewsoul/roasters", why: "Who roasts it" },
    { label: "Browse by Variety", path: "/brewsoul/browse", why: "Taste the difference" },
  ],
  "/brewsoul/processing": [
    { label: "Varieties Guide", path: "/brewsoul/varieties", why: "Bean types explained" },
    { label: "Farm Profiles", path: "/brewsoul/farms", why: "Where it grows" },
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find your method" },
  ],
  "/brewsoul/roasters": [
    { label: "Browse Their Coffees", path: "/brewsoul/browse", why: "Taste their work" },
    { label: "Compare Coffees", path: "/brewsoul/compare", why: "Side by side" },
    { label: "New Drops", path: "/brewsoul/drops", why: "Latest releases" },
  ],
  "/brewsoul/glossary": [
    { label: "Varieties Guide", path: "/brewsoul/varieties", why: "Deep dive" },
    { label: "Processing Methods", path: "/brewsoul/processing", why: "How it's made" },
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Apply what you learned" },
  ],
  "/brewsoul/pairings": [
    { label: "Experiences", path: "/brewsoul/experiences", why: "Coffee moments" },
    { label: "Blend Builder", path: "/brewsoul/blend-builder", why: "Create your own" },
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find the pairing" },
  ],
  "/brewsoul/economics": [
    { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", why: "Your money's path" },
    { label: "Farm Profiles", path: "/brewsoul/farms", why: "Meet the growers" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "Who pays fairly?" },
  ],
  "/brewsoul/compare": [
    { label: "Browse Full Catalog", path: "/brewsoul/browse", why: "Find more to compare" },
    { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Get matched" },
    { label: "Blend Builder", path: "/brewsoul/blend-builder", why: "Create your own" },
  ],
  "/brewsoul/blend-builder": [
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find ingredients" },
    { label: "Varieties Guide", path: "/brewsoul/varieties", why: "Know your beans" },
    { label: "Food Pairings", path: "/brewsoul/pairings", why: "Perfect with..." },
  ],
  "/brewsoul/drops": [
    { label: "Browse Full Catalog", path: "/brewsoul/browse", why: "See everything" },
    { label: "Compare Coffees", path: "/brewsoul/compare", why: "Side by side" },
    { label: "My Collection", path: "/brewsoul/collection", why: "Save favorites" },
  ],
  "/brewsoul/collection": [
    { label: "Browse More", path: "/brewsoul/browse", why: "Discover new coffees" },
    { label: "New Drops", path: "/brewsoul/drops", why: "Latest releases" },
    { label: "Prescription", path: "/brewsoul/prescription", why: "Your daily recommendation" },
  ],
  "/brewsoul/submit": [
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "See what's listed" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "How chains rank" },
    { label: "Dashboard", path: "/brewsoul/home", why: "Back to overview" },
  ],
  "/brewsoul/prescription": [
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find your prescription" },
    { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Refine your profile" },
    { label: "My Collection", path: "/brewsoul/collection", why: "Your saved coffees" },
  ],
  "/brewsoul/biodynamic": [
    { label: "Decaf Done Right", path: "/brewsoul/decaf", why: "Swiss Water vs. paint stripper" },
    { label: "Coffee & Health", path: "/brewsoul/health", why: "Peer-reviewed research" },
    { label: "Farm Profiles", path: "/brewsoul/farms", why: "Meet the growers" },
  ],
  "/brewsoul/decaf": [
    { label: "Biodynamic Census", path: "/brewsoul/biodynamic", why: "Every certified farm on earth" },
    { label: "Coffee & Health", path: "/brewsoul/health", why: "What science says" },
    { label: "Coffee Prescription", path: "/brewsoul/prescription", why: "Your daily recommendation" },
  ],
};

/* ── Default suggestions for coffee detail pages ── */
const DETAIL_SUGGESTIONS: Suggestion[] = [
  { label: "Browse More Coffees", path: "/brewsoul/browse", why: "Explore the catalog" },
  { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Find your match" },
  { label: "Compare Coffees", path: "/brewsoul/compare", why: "Side by side" },
];

/* ── Default fallback ── */
const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { label: "Dashboard", path: "/brewsoul/home", why: "Overview" },
  { label: "Browse Catalog", path: "/brewsoul/browse", why: "All coffees" },
  { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Get matched" },
];

/* ── Styles ── */
const M = { fontFamily: "'DM Mono', monospace" } as const;
const S = { fontFamily: "'Source Sans 3', sans-serif" } as const;

export default function JourneyBar() {
  const [location] = useLocation();

  /* Determine current step */
  const currentStep = JOURNEY_STEPS.find(s =>
    s.path === "/brewsoul" ? location === "/brewsoul" : location.startsWith(s.path)
  );

  /* Get suggestions for current page */
  const isDetail = location.startsWith("/brewsoul/coffee/");
  const suggestions = isDetail
    ? DETAIL_SUGGESTIONS
    : (SUGGESTIONS[location] || DEFAULT_SUGGESTIONS);

  /* Don't show on the welcome/identity quiz page — it has its own flow */
  if (location === "/brewsoul") return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9990,
      background: "rgba(44,24,16,0.92)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(197,162,60,0.2)",
      padding: "0.6rem clamp(0.75rem, 3vw, 2rem)",
    }}>
      {/* Journey progress dots */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "0.35rem", marginBottom: "0.5rem",
      }}>
        {JOURNEY_STEPS.map((step, i) => {
          const isCurrent = currentStep?.id === step.id;
          const isVisited = typeof window !== "undefined" && localStorage.getItem(`brewsoul-visited-${step.id}`);
          return (
            <Link key={step.id} href={step.path} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <div style={{
                width: isCurrent ? "24px" : "8px",
                height: "8px",
                borderRadius: isCurrent ? "4px" : "50%",
                background: isCurrent
                  ? "linear-gradient(135deg, #C5A23C, #D4B96A)"
                  : isVisited
                    ? "rgba(197,162,60,0.5)"
                    : "rgba(255,255,255,0.15)",
                transition: "all 0.3s ease",
              }} />
              {isCurrent && (
                <span style={{
                  ...M, fontSize: "0.58rem", letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "#D4B96A",
                }}>{step.short}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Suggestion pills */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "0.5rem", flexWrap: "wrap",
      }}>
        <span style={{ ...M, fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
          Next →
        </span>
        {suggestions.map(s => (
          <Link key={s.path} href={s.path} style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.35rem 0.75rem", borderRadius: "20px",
              background: "rgba(197,162,60,0.12)",
              border: "1px solid rgba(197,162,60,0.2)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(197,162,60,0.25)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(197,162,60,0.4)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(197,162,60,0.12)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(197,162,60,0.2)";
              }}
            >
              <span style={{ ...S, fontSize: "0.78rem", fontWeight: 600, color: "#F5F0E6" }}>{s.label}</span>
              <span style={{ ...M, fontSize: "0.58rem", color: "rgba(212,185,106,0.7)" }}>{s.why}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Mark a page as visited in localStorage.
 * Call this in useEffect on each BrewSoul page.
 */
export function useMarkVisited(stepId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`brewsoul-visited-${stepId}`, "1");
  }
}
