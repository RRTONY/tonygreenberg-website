// Ported from legacy client/src/pages/brewsoul/BrewSoulDirectory.tsx's
// CATEGORIES/CAT_COLORS/PAGE_CATEGORY_MAP — the master page index that
// powers both the /brewsoul/directory page and CategoryBadge (the small
// colored badge shown at the top of every BrewSoul page, auto-detected
// from the current path). Real content, unchanged. Most linked pages
// aren't built yet — this data module is intentionally ported ahead of
// them (same "forward-reference" pattern as /find-my elsewhere in this
// migration): CategoryBadge only renders a badge for paths that exist in
// PAGE_CATEGORY_MAP, so it's a no-op on any page not built yet, and
// /brewsoul/directory itself (built once the rest of this phase lands)
// is where these become real links.
export interface BrewSoulPageEntry {
  label: string;
  path: string;
  desc: string;
  icon: string;
}

export interface BrewSoulCategory {
  title: string;
  emoji: string;
  desc: string;
  pages: BrewSoulPageEntry[];
}

export const CAT_COLORS: Record<
  string,
  { bg: string; border: string; badge: string; badgeText: string }
> = {
  "Start Here": {
    bg: "rgba(197,162,60,0.06)",
    border: "rgba(197,162,60,0.18)",
    badge: "#C5A23C",
    badgeText: "#FAFAF7",
  },
  "The Intelligence Engine": {
    bg: "rgba(59,130,246,0.05)",
    border: "rgba(59,130,246,0.15)",
    badge: "#3B82F6",
    badgeText: "#FAFAF7",
  },
  "Deep Research": {
    bg: "rgba(139,92,246,0.05)",
    border: "rgba(139,92,246,0.15)",
    badge: "#8B5CF6",
    badgeText: "#FAFAF7",
  },
  "Reference Library": {
    bg: "rgba(16,185,129,0.05)",
    border: "rgba(16,185,129,0.15)",
    badge: "#10B981",
    badgeText: "#FAFAF7",
  },
  "Tools & Discovery": {
    bg: "rgba(249,115,22,0.05)",
    border: "rgba(249,115,22,0.15)",
    badge: "#F97316",
    badgeText: "#FAFAF7",
  },
  "Guest Series": {
    bg: "rgba(139,69,19,0.06)",
    border: "rgba(139,69,19,0.18)",
    badge: "#8B4513",
    badgeText: "#FAFAF7",
  },
};

export const BREWSOUL_CATEGORIES: BrewSoulCategory[] = [
  {
    title: "Start Here",
    emoji: "🚀",
    desc: "New to BrewSoul? Begin your journey.",
    pages: [
      {
        label: "The First Sip",
        path: "/brewsoul/first-sip",
        desc: "Why your coffee is lying to you — the essay that started it all",
        icon: "📜",
      },
      {
        label: "Taste Quiz",
        path: "/brewsoul/quiz",
        desc: "6 archetypes. 12 questions. Find your coffee identity.",
        icon: "🎯",
      },
      {
        label: "Your Prescription",
        path: "/brewsoul/prescription",
        desc: "AI-powered daily protocol — genetics, timing, goals",
        icon: "💊",
      },
    ],
  },
  {
    title: "The Intelligence Engine",
    emoji: "📊",
    desc: "Data-driven coffee research you can't find anywhere else.",
    pages: [
      {
        label: "Browse All Coffees",
        path: "/brewsoul/browse",
        desc: "Every coffee scored on quality, value, sourcing, and experience",
        icon: "☕",
      },
      {
        label: "Chain Rankings",
        path: "/brewsoul/chains",
        desc: "100 coffee chains ranked S through F tier",
        icon: "🏪",
      },
      {
        label: "City Coffee Rankings",
        path: "/brewsoul/cities",
        desc: "Best coffee cities ranked worldwide",
        icon: "🌆",
      },
      {
        label: "Compare Coffees",
        path: "/brewsoul/compare",
        desc: "Side-by-side comparison tool",
        icon: "⚖️",
      },
      {
        label: "Coffee Economics",
        path: "/brewsoul/economics",
        desc: "Industry economics dashboard",
        icon: "💰",
      },
    ],
  },
  {
    title: "Deep Research",
    emoji: "🔬",
    desc: "Peer-reviewed science and investigative reporting.",
    pages: [
      {
        label: "Coffee & Health",
        path: "/brewsoul/health",
        desc: "8 longevity benefits, 7 real risks, CYP1A2 genetics",
        icon: "🧬",
      },
      {
        label: "Biodynamic Census",
        path: "/brewsoul/biodynamic",
        desc: "All 3 Demeter-certified farms, 6 roasters, every product",
        icon: "🌱",
      },
      {
        label: "Decaf Done Right",
        path: "/brewsoul/decaf",
        desc: "13 clean brands vs. methylene chloride offenders",
        icon: "🧪",
      },
      {
        label: "Mold-Free Coffee",
        path: "/brewsoul/mold-free",
        desc: "Mycotoxin-free guide — actually clean coffee",
        icon: "🛡️",
      },
      {
        label: "Follow The Dollar",
        path: "/brewsoul/follow-the-dollar",
        desc: "Where your coffee dollar actually goes",
        icon: "💵",
      },
      {
        label: "Wall of Shame",
        path: "/brewsoul/wall-of-shame",
        desc: "Fraud, greenwashing, commodity deception exposed",
        icon: "🚩",
      },
    ],
  },
  {
    title: "Reference Library",
    emoji: "📖",
    desc: "Everything you need to understand coffee deeper.",
    pages: [
      {
        label: "Coffee Varieties",
        path: "/brewsoul/varieties",
        desc: "25 varieties — genetics, cup profiles, rarity",
        icon: "🌿",
      },
      {
        label: "Processing Methods",
        path: "/brewsoul/processing",
        desc: "Natural, washed, anaerobic, honey — every method",
        icon: "⚙️",
      },
      {
        label: "Roaster Directory",
        path: "/brewsoul/roasters",
        desc: "30+ roasters with transparency scores",
        icon: "🔥",
      },
      {
        label: "Farm Passports",
        path: "/brewsoul/farms",
        desc: "Origin stories and farm-level transparency",
        icon: "🏔️",
      },
      {
        label: "Coffee Glossary",
        path: "/brewsoul/glossary",
        desc: "Terminology — from crema to channeling",
        icon: "📝",
      },
      {
        label: "Coffee Pairings",
        path: "/brewsoul/pairings",
        desc: "Coffee and food pairing guide",
        icon: "🍫",
      },
    ],
  },
  {
    title: "Tools & Discovery",
    emoji: "🛠️",
    desc: "Interactive tools to explore, build, and collect.",
    pages: [
      {
        label: "Blend Builder",
        path: "/brewsoul/blend-builder",
        desc: "Build your own custom coffee blend",
        icon: "🎨",
      },
      {
        label: "Limited Drops",
        path: "/brewsoul/drops",
        desc: "Limited edition and seasonal coffee drops",
        icon: "✨",
      },
      {
        label: "Coffee Experiences",
        path: "/brewsoul/experiences",
        desc: "Tastings and experiences worldwide",
        icon: "🗺️",
      },
      {
        label: "My Collection",
        path: "/brewsoul/collection",
        desc: "Your personal coffee journal and favorites",
        icon: "📓",
      },
    ],
  },
  {
    title: "Guest Series",
    emoji: "🎤",
    desc: "Expert voices interrogating industry systems.",
    pages: [
      {
        label: "Shanita Nicholas",
        path: "/brewsoul/guest/shanita-nicholas",
        desc: "Fair trade theater, roasting deception, and regeneration economics",
        icon: "☕",
      },
    ],
  },
];

export const BREWSOUL_TOTAL_PAGES = BREWSOUL_CATEGORIES.reduce((sum, c) => sum + c.pages.length, 0);

export const PAGE_CATEGORY_MAP: Record<string, { category: string; color: string }> = {};
for (const cat of BREWSOUL_CATEGORIES) {
  const c = CAT_COLORS[cat.title];
  for (const p of cat.pages) {
    PAGE_CATEGORY_MAP[p.path] = { category: cat.title, color: c?.badge || "#6F4E37" };
  }
}
