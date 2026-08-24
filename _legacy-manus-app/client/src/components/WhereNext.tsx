/**
 * WhereNext — Contextual "where to go next" suggestions at the bottom of every page.
 * Clean, quiet, editorial. 2–3 suggestions + sitemap link + home.
 * Never overwhelming. Just enough to keep people moving.
 */
import { Link, useLocation } from "wouter";

interface PageSuggestion {
  href: string;
  label: string;
  teaser: string;
}

/**
 * Page relationship map — each path gets 2–3 contextual suggestions.
 * Grouped by content clusters so suggestions feel natural, not random.
 */
const PAGE_SUGGESTIONS: Record<string, PageSuggestion[]> = {
  /* ── The Walk-Through chain ── */
  "/the-letter": [
    { href: "/walk-through", label: "The Walk-Through", teaser: "90-second orientation" },
    { href: "/the-territory", label: "The Territory", teaser: "Where I operate" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
  ],
  "/walk-through": [
    { href: "/the-territory", label: "The Territory", teaser: "Where I operate" },
    { href: "/engine-room", label: "The Engine Room", teaser: "How it works" },
    { href: "/about", label: "About", teaser: "The full story" },
  ],
  "/the-territory": [
    { href: "/engine-room", label: "The Engine Room", teaser: "How it works" },
    { href: "/under-nda", label: "Under NDA", teaser: "What I can't tell you" },
    { href: "/clients", label: "Clients", teaser: "Who I've worked with" },
  ],
  "/engine-room": [
    { href: "/under-nda", label: "Under NDA", teaser: "What I can't tell you" },
    { href: "/the-body", label: "The Body", teaser: "Health & optimization" },
    { href: "/recent-creations", label: "Recent Creations", teaser: "Portfolio" },
  ],
  "/under-nda": [
    { href: "/the-body", label: "The Body", teaser: "Health & optimization" },
    { href: "/the-nightstand", label: "The Nightstand", teaser: "What I'm reading" },
    { href: "/clients", label: "Clients", teaser: "Who I've worked with" },
  ],
  "/the-body": [
    { href: "/the-nightstand", label: "The Nightstand", teaser: "What I'm reading" },
    { href: "/the-web", label: "The Web", teaser: "Digital presence" },
    { href: "/find-my", label: "Find Your...", teaser: "Assessments hub" },
  ],
  "/the-nightstand": [
    { href: "/the-web", label: "The Web", teaser: "Digital presence" },
    { href: "/pick-up-the-phone", label: "Pick Up the Phone", teaser: "Let's talk" },
    { href: "/published", label: "Published", teaser: "Media & appearances" },
  ],
  "/the-web": [
    { href: "/pick-up-the-phone", label: "Pick Up the Phone", teaser: "Let's talk" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/ecosystem", label: "The Ecosystem", teaser: "Everything connected" },
  ],
  "/pick-up-the-phone": [
    { href: "/engage", label: "Engage", teaser: "Work together" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/the-letter", label: "The Letter", teaser: "Start from the beginning" },
  ],

  /* ── Content pages ── */
  "/": [
    { href: "/the-letter", label: "The Letter", teaser: "Start here" },
    { href: "/find-my", label: "Find Your...", teaser: "Assessments hub" },
    { href: "/the-index", label: "The Index", teaser: "Search everything" },
  ],
  "/blog": [
    { href: "/the-letter", label: "The Letter", teaser: "Start here" },
    { href: "/series", label: "Series", teaser: "Themed collections" },
    { href: "/the-index", label: "The Index", teaser: "Search everything" },
  ],
  "/about": [
    { href: "/the-letter", label: "The Letter", teaser: "Start here" },
    { href: "/clients", label: "Clients", teaser: "Who I've worked with" },
    { href: "/ecosystem", label: "The Ecosystem", teaser: "Everything connected" },
  ],
  "/clients": [
    { href: "/recent-creations", label: "Recent Creations", teaser: "Portfolio" },
    { href: "/engage", label: "Engage", teaser: "Work together" },
    { href: "/intel", label: "Intel", teaser: "Market intelligence" },
  ],
  "/recent-creations": [
    { href: "/clients", label: "Clients", teaser: "Who I've worked with" },
    { href: "/intel", label: "Intel", teaser: "Market intelligence" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
  ],
  "/intel": [
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/the-index", label: "The Index", teaser: "Search everything" },
    { href: "/engage", label: "Engage", teaser: "Work together" },
  ],
  "/the-open-door": [
    { href: "/pick-up-the-phone", label: "Pick Up the Phone", teaser: "Let's talk" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/community", label: "Community", teaser: "Join the conversation" },
  ],
  "/the-index": [
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/series", label: "Series", teaser: "Themed collections" },
    { href: "/find-my", label: "Find Your...", teaser: "Assessments hub" },
  ],
  "/ecosystem": [
    { href: "/find-my", label: "Find Your...", teaser: "Assessments hub" },
    { href: "/community", label: "Community", teaser: "Join the conversation" },
    { href: "/invest", label: "Invest", teaser: "Impact investing" },
  ],
  "/start-here": [
    { href: "/walk-through", label: "The Walk-Through", teaser: "90-second orientation" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/find-my", label: "Find Your...", teaser: "Assessments hub" },
  ],
  "/published": [
    { href: "/about", label: "About", teaser: "The full story" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/clients", label: "Clients", teaser: "Who I've worked with" },
  ],
  "/series": [
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/the-index", label: "The Index", teaser: "Search everything" },
    { href: "/living-declaration", label: "A Living Declaration", teaser: "What I believe" },
  ],
  "/living-declaration": [
    { href: "/attention-theft", label: "Attention Theft", teaser: "The crusade against spam" },
    { href: "/community", label: "Community", teaser: "Join the conversation" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
  ],
  "/community": [
    { href: "/living-declaration", label: "A Living Declaration", teaser: "What I believe" },
    { href: "/engage", label: "Engage", teaser: "Work together" },
    { href: "/ecosystem", label: "The Ecosystem", teaser: "Everything connected" },
  ],
  "/engage": [
    { href: "/pick-up-the-phone", label: "Pick Up the Phone", teaser: "Let's talk" },
    { href: "/clients", label: "Clients", teaser: "Who I've worked with" },
    { href: "/framework", label: "The Framework", teaser: "How I think" },
  ],
  "/spirits": [
    { href: "/find-your-spirit", label: "Find Your Spirit", teaser: "Spirit assessment" },
    { href: "/find-your-sake", label: "Find Your Sake", teaser: "Sake assessment" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
  ],
  "/assessments": [
    { href: "/find-my", label: "Find Your...", teaser: "Full assessments hub" },
    { href: "/psychedelic-readiness-index", label: "Psychedelic Readiness", teaser: "PRI assessment" },
    { href: "/life-assessment", label: "Life Assessment", teaser: "The Mirror" },
  ],
  "/find-my": [
    { href: "/assessments", label: "Assessments", teaser: "More assessments" },
    { href: "/psychedelic-readiness-index", label: "Psychedelic Readiness", teaser: "PRI assessment" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
  ],
  "/invest": [
    { href: "/ecosystem", label: "The Ecosystem", teaser: "Everything connected" },
    { href: "/engage", label: "Engage", teaser: "Work together" },
    { href: "/living-declaration", label: "A Living Declaration", teaser: "What I believe" },
  ],
  "/shop": [
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/find-my", label: "Find Your...", teaser: "Assessments hub" },
    { href: "/engage", label: "Engage", teaser: "Work together" },
  ],
  "/framework": [
    { href: "/engage", label: "Engage", teaser: "Work together" },
    { href: "/clients", label: "Clients", teaser: "Who I've worked with" },
    { href: "/recent-creations", label: "Recent Creations", teaser: "Portfolio" },
  ],
  "/diamond-cut": [
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/engage", label: "Engage", teaser: "Work together" },
    { href: "/find-my", label: "Find Your...", teaser: "Assessments hub" },
  ],
  "/amplifier": [
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/engage", label: "Engage", teaser: "Work together" },
    { href: "/ecosystem", label: "The Ecosystem", teaser: "Everything connected" },
  ],
  "/essays": [
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/the-index", label: "The Index", teaser: "Search everything" },
    { href: "/series", label: "Series", teaser: "Themed collections" },
  ],
  "/fauxtony": [
    { href: "/about", label: "About", teaser: "The real Tony" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/find-my", label: "Find Your...", teaser: "Assessments hub" },
  ],
  "/journeys": [
    { href: "/find-my", label: "Find Your...", teaser: "Assessments hub" },
    { href: "/find-your-journey", label: "Journey Finder", teaser: "Find your path" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
  ],
  "/subscribe": [
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/find-my", label: "Find Your...", teaser: "Assessments hub" },
    { href: "/the-letter", label: "The Letter", teaser: "Start here" },
  ],

  /* ── Peptide cluster ── */
  "/peptide-watch": [
    { href: "/find-your-peptide", label: "Find Your Peptide", teaser: "Peptide assessment" },
    { href: "/peptide-hall-of-shame", label: "Hall of Shame", teaser: "Vendor analysis" },
    { href: "/peptide-supply-chain", label: "Supply Chain", teaser: "How peptides move" },
  ],
  "/peptide-hall-of-shame": [
    { href: "/peptide-watch", label: "Peptide Watch", teaser: "Market overview" },
    { href: "/peptide-supply-chain", label: "Supply Chain", teaser: "How peptides move" },
    { href: "/peptide-matrix", label: "Peptide Matrix", teaser: "Compare peptides" },
  ],
  "/peptide-supply-chain": [
    { href: "/peptide-watch", label: "Peptide Watch", teaser: "Market overview" },
    { href: "/peptide-hall-of-shame", label: "Hall of Shame", teaser: "Vendor analysis" },
    { href: "/find-your-peptide", label: "Find Your Peptide", teaser: "Peptide assessment" },
  ],
  "/peptide-matrix": [
    { href: "/peptide-watch", label: "Peptide Watch", teaser: "Market overview" },
    { href: "/find-your-peptide", label: "Find Your Peptide", teaser: "Peptide assessment" },
    { href: "/peptide-supply-chain", label: "Supply Chain", teaser: "How peptides move" },
  ],

  /* ── PRI cluster ── */
  "/psychedelic-readiness-index": [
    { href: "/facilitator-index", label: "Facilitator Index", teaser: "Know who you go with" },
    { href: "/iboga-ibogaine", label: "Iboga vs Ibogaine", teaser: "The Plant vs The Isolate" },
    { href: "/peyote-mescaline", label: "Mescaline Deep Dive", teaser: "Pharmacology & readiness" },
  ],
  "/peyote-mescaline": [
    { href: "/iboga-ibogaine", label: "Iboga vs Ibogaine", teaser: "The Plant vs The Isolate" },
    { href: "/psychedelic-readiness-index", label: "Back to PRI", teaser: "Full readiness index" },
    { href: "/the-body", label: "The Body", teaser: "Health & optimization" },
  ],
  "/iboga-ibogaine": [
    { href: "/peyote-mescaline", label: "Mescaline Deep Dive", teaser: "Pharmacology & readiness" },
    { href: "/psychedelic-readiness-index", label: "Back to PRI", teaser: "Full readiness index" },
    { href: "/find-my", label: "Find Your...", teaser: "More assessments" },
  ],

  /* ── Charity ── */
  "/charity-scorecard": [
    { href: "/ecosystem", label: "The Ecosystem", teaser: "Everything connected" },
    { href: "/invest", label: "Invest", teaser: "Impact investing" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
  ],

  /* ── Standalone assessments (Find Your...) ── */
  "/find-your-me": [
    { href: "/find-my", label: "All Assessments", teaser: "Explore more" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/ecosystem", label: "The Ecosystem", teaser: "Everything connected" },
  ],
  "/find-your-therapy": [
    { href: "/psychedelic-readiness-index", label: "Psychedelic Readiness", teaser: "PRI assessment" },
    { href: "/find-my", label: "All Assessments", teaser: "Explore more" },
    { href: "/the-body", label: "The Body", teaser: "Health & optimization" },
  ],
  "/find-your-peptide": [
    { href: "/peptide-watch", label: "Peptide Watch", teaser: "Market overview" },
    { href: "/peptide-matrix", label: "Peptide Matrix", teaser: "Compare peptides" },
    { href: "/find-my", label: "All Assessments", teaser: "Explore more" },
  ],

  /* ── Kava Encyclopedia cluster ── */
  "/kava": [
    { href: "/kava/origins", label: "Island Origins", teaser: "3,000 years of kava" },
    { href: "/kava/interactions", label: "Drug Interactions", teaser: "24 substances checked" },
    { href: "/kava/science", label: "Kavalactone Science", teaser: "6 compounds decoded" },
  ],
  "/kava/origins": [
    { href: "/kava", label: "Kava Home", teaser: "Back to encyclopedia" },
    { href: "/kava/science", label: "Kavalactone Science", teaser: "The chemistry" },
    { href: "/kava/hawaii", label: "Hawaii & Awa", teaser: "ICE crisis recovery" },
  ],
  "/kava/interactions": [
    { href: "/kava/caffeine", label: "Kava & Caffeine", teaser: "CYP1A2 inhibition" },
    { href: "/kava/myths", label: "Myths Debunked", teaser: "7 myths examined" },
    { href: "/kava", label: "Kava Home", teaser: "Back to encyclopedia" },
  ],
  "/kava/science": [
    { href: "/kava/origins", label: "Island Origins", teaser: "Where it grows" },
    { href: "/kava/products", label: "Product Index", teaser: "Buy with confidence" },
    { href: "/kava", label: "Kava Home", teaser: "Back to encyclopedia" },
  ],
  "/kava/assessment": [
    { href: "/kava", label: "Kava Home", teaser: "Back to encyclopedia" },
    { href: "/psychedelic-readiness-index", label: "PRI Assessment", teaser: "Full readiness index" },
    { href: "/find-my", label: "All Assessments", teaser: "Explore more" },
  ],
  "/kava/hawaii": [
    { href: "/kava/origins", label: "Island Origins", teaser: "Pacific kava culture" },
    { href: "/kava/myths", label: "Myths Debunked", teaser: "Separate fact from fiction" },
    { href: "/kava", label: "Kava Home", teaser: "Back to encyclopedia" },
  ],
  "/kava/myths": [
    { href: "/kava/interactions", label: "Drug Interactions", teaser: "Real safety data" },
    { href: "/kava/science", label: "Kavalactone Science", teaser: "The evidence" },
    { href: "/kava", label: "Kava Home", teaser: "Back to encyclopedia" },
  ],
  "/kava/caffeine": [
    { href: "/kava/interactions", label: "All Interactions", teaser: "24 substances" },
    { href: "/brewsoul", label: "BrewSoul", teaser: "Coffee intelligence" },
    { href: "/kava", label: "Kava Home", teaser: "Back to encyclopedia" },
  ],
  "/kava/products": [
    { href: "/kava/certification", label: "Get Certified", teaser: "Facilitator training" },
    { href: "/kava/science", label: "Kavalactone Science", teaser: "Know what you’re buying" },
    { href: "/kava", label: "Kava Home", teaser: "Back to encyclopedia" },
  ],
  "/kava/certification": [
    { href: "/kava/products", label: "Product Index", teaser: "Ceremonial supplies" },
    { href: "/kava/origins", label: "Island Origins", teaser: "Cultural context" },
    { href: "/kava", label: "Kava Home", teaser: "Back to encyclopedia" },
  ],

  /* ── BrewSoul cluster ── */
  "/brewsoul": [
    { href: "/brewsoul/browse", label: "Browse Coffees", teaser: "Explore the collection" },
    { href: "/brewsoul/quiz", label: "Coffee Quiz", teaser: "Find your coffee" },
    { href: "/kava/caffeine", label: "Kava & Caffeine", teaser: "CYP1A2 interaction" },
  ],

  /* ── CheshireGrin ── */
  "/alex-azzi": [
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/the-letter", label: "The Letter", teaser: "Start here" },
    { href: "/engage", label: "Engage", teaser: "Work together" },
  ],
  "/cheshire-grin": [
    { href: "/", label: "The Essays", teaser: "Read the blog" },
    { href: "/the-letter", label: "The Letter", teaser: "Start here" },
    { href: "/engage", label: "Engage", teaser: "Work together" },
  ],

  /* ── Life Assessment ── */
  "/life-assessment": [
    { href: "/find-my", label: "All Assessments", teaser: "Explore more" },
    { href: "/psychedelic-readiness-index", label: "Psychedelic Readiness", teaser: "PRI assessment" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
  ],
  "/the-mirror": [
    { href: "/find-my", label: "All Assessments", teaser: "Explore more" },
    { href: "/psychedelic-readiness-index", label: "Psychedelic Readiness", teaser: "PRI assessment" },
    { href: "/", label: "The Essays", teaser: "Read the blog" },
  ],
  /* ── Attention Theft Manifesto cluster ── */
  "/attention-theft": [
    { href: "/attention-theft/weapons", label: "The 10 Weapons", teaser: "Your arsenal" },
    { href: "/attention-theft/economics", label: "Economics", teaser: "$997B in stolen time" },
    { href: "/attention-theft/report", label: "Report A Spammer", teaser: "Public accountability" },
  ],
  "/attention-theft/economics": [
    { href: "/attention-theft/weapons", label: "The 10 Weapons", teaser: "Fight back" },
    { href: "/attention-theft/legal", label: "Legal Database", teaser: "Laws & action" },
    { href: "/attention-theft", label: "The Manifesto", teaser: "Full manifesto" },
  ],
  "/attention-theft/blocker-finder": [
    { href: "/attention-theft/weapons", label: "The 10 Weapons", teaser: "More weapons" },
    { href: "/attention-theft/report", label: "Report A Spammer", teaser: "Name them" },
    { href: "/attention-theft", label: "The Manifesto", teaser: "Full manifesto" },
  ],
  "/attention-theft/legal": [
    { href: "/attention-theft/weapons", label: "The 10 Weapons", teaser: "Take action" },
    { href: "/attention-theft/economics", label: "Economics", teaser: "$997B in stolen time" },
    { href: "/attention-theft", label: "The Manifesto", teaser: "Full manifesto" },
  ],
  "/attention-theft/weapons": [
    { href: "/attention-theft/blocker-finder", label: "AI Blocker Finder", teaser: "Find your tools" },
    { href: "/attention-theft/report", label: "Report A Spammer", teaser: "Public accountability" },
    { href: "/attention-theft", label: "The Manifesto", teaser: "Full manifesto" },
  ],
  "/attention-theft/report": [
    { href: "/attention-theft/weapons", label: "The 10 Weapons", teaser: "Your arsenal" },
    { href: "/attention-theft/legal", label: "Legal Database", teaser: "Laws & action" },
    { href: "/attention-theft", label: "The Manifesto", teaser: "Full manifesto" },
  ],
};

/** Default suggestions for any page not in the map */
const DEFAULT_SUGGESTIONS: PageSuggestion[] = [
  { href: "/", label: "The Essays", teaser: "Read the blog" },
  { href: "/find-my", label: "Find Your...", teaser: "Assessments hub" },
  { href: "/the-letter", label: "The Letter", teaser: "Start here" },
];

/**
 * WhereNext renders at the bottom of a page.
 * Props:
 * - isDark: whether the current page has a dark background
 * - suggestions: optional override for the auto-detected suggestions
 */
export default function WhereNext({
  isDark = false,
  suggestions,
}: {
  isDark?: boolean;
  suggestions?: PageSuggestion[];
}) {
  const [location] = useLocation();

  // Get suggestions for this page, filtering out the current page
  const items = (suggestions || PAGE_SUGGESTIONS[location] || DEFAULT_SUGGESTIONS)
    .filter((s) => s.href !== location)
    .slice(0, 3);

  const textColor = isDark ? "rgba(245, 240, 224, 0.7)" : "#666";
  const headingColor = isDark ? "#F5E6A3" : "#8B6914";
  const cardBg = isDark ? "rgba(245, 240, 224, 0.04)" : "rgba(139, 105, 20, 0.04)";
  const cardBorder = isDark ? "rgba(212, 185, 106, 0.12)" : "rgba(139, 105, 20, 0.12)";
  const cardHoverBg = isDark ? "rgba(245, 240, 224, 0.08)" : "rgba(139, 105, 20, 0.08)";
  const labelColor = isDark ? "#F5F0E0" : "#1C1410";
  const linkColor = isDark ? "#D4B96A" : "#8B6914";

  return (
    <div
      style={{
        padding: "2rem clamp(1rem, 4vw, 3rem) 1.5rem",
        borderTop: `1px solid ${cardBorder}`,
      }}
    >
      {/* Section label */}
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: headingColor,
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ width: "1rem", height: 1, background: headingColor, display: "block" }} />
        Keep going
      </div>

      {/* Suggestion cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="no-underline"
            style={{
              display: "block",
              padding: "0.75rem 1rem",
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "8px",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = cardHoverBg;
              (e.currentTarget as HTMLAnchorElement).style.borderColor = linkColor;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = cardBg;
              (e.currentTarget as HTMLAnchorElement).style.borderColor = cardBorder;
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: labelColor,
                marginBottom: "0.15rem",
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.75rem",
                color: textColor,
                lineHeight: 1.4,
              }}
            >
              {item.teaser}
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom row: Home + Sitemap */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          className="no-underline"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: linkColor,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          ← Home
        </Link>
        <span style={{ color: textColor, fontSize: "0.6rem" }}>·</span>
        <Link
          href="/the-index"
          className="no-underline"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: linkColor,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          Site Index
        </Link>
        <span style={{ color: textColor, fontSize: "0.6rem" }}>·</span>
        <Link
          href="/find-my"
          className="no-underline"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: linkColor,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          All Assessments
        </Link>
      </div>
    </div>
  );
}
