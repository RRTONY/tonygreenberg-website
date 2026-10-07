import {
  Banknote,
  BookOpen,
  Building2,
  ChartColumn,
  Coffee,
  Cog,
  Coins,
  Cookie,
  Dna,
  Flag,
  Flame,
  FlaskConical,
  Leaf,
  MapIcon,
  Mic,
  Microscope,
  Mountain,
  Notebook,
  NotebookPen,
  Palette,
  Pill,
  Rocket,
  Scale,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  Target,
  Wrench,
  type LucideIcon,
} from "lucide-react";

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
  icon: LucideIcon;
}

export interface BrewSoulCategory {
  title: string;
  icon: LucideIcon;
  desc: string;
  pages: BrewSoulPageEntry[];
}

// Badge colours match CategoryBadge's darker shades (WCAG AA on cream and
// as text on the tinted cards; the original 500-weight hues failed, 2026-10-02).
// Per-category classes, full literal strings (no inline style; Tailwind only sees complete
// class names). `chip`/`chipActive` are the filter buttons, `card` the page cards, `rule` the
// category heading underline, `badge` the small label, `accent` the "Explore" link text.
export const CAT_COLORS: Record<string, { card: string; rule: string; badge: string; accent: string; chip: string; chipActive: string }> = {
  "Start Here": {
    card: "border-[#C5A23C]/18 bg-[#C5A23C]/6",
    rule: "border-[#C5A23C]/18",
    badge: "bg-[#836311] text-[#FAFAF7]",
    accent: "text-[#836311]",
    chip: "border-[#C5A23C]/18 text-[#836311]",
    chipActive: "border-[#C5A23C]/18 bg-[#836311] text-[#FAFAF7]",
  },
  "The Intelligence Engine": {
    card: "border-[#3B82F6]/15 bg-[#3B82F6]/5",
    rule: "border-[#3B82F6]/15",
    badge: "bg-[#2563EB] text-[#FAFAF7]",
    accent: "text-[#2563EB]",
    chip: "border-[#3B82F6]/15 text-[#2563EB]",
    chipActive: "border-[#3B82F6]/15 bg-[#2563EB] text-[#FAFAF7]",
  },
  "Deep Research": {
    card: "border-[#8B5CF6]/15 bg-[#8B5CF6]/5",
    rule: "border-[#8B5CF6]/15",
    badge: "bg-[#7C3AED] text-[#FAFAF7]",
    accent: "text-[#7C3AED]",
    chip: "border-[#8B5CF6]/15 text-[#7C3AED]",
    chipActive: "border-[#8B5CF6]/15 bg-[#7C3AED] text-[#FAFAF7]",
  },
  "Reference Library": {
    card: "border-[#10B981]/15 bg-[#10B981]/5",
    rule: "border-[#10B981]/15",
    badge: "bg-[#047857] text-[#FAFAF7]",
    accent: "text-[#047857]",
    chip: "border-[#10B981]/15 text-[#047857]",
    chipActive: "border-[#10B981]/15 bg-[#047857] text-[#FAFAF7]",
  },
  "Tools & Discovery": {
    card: "border-[#F97316]/15 bg-[#F97316]/5",
    rule: "border-[#F97316]/15",
    badge: "bg-[#C2410C] text-[#FAFAF7]",
    accent: "text-[#C2410C]",
    chip: "border-[#F97316]/15 text-[#C2410C]",
    chipActive: "border-[#F97316]/15 bg-[#C2410C] text-[#FAFAF7]",
  },
  "Guest Series": {
    card: "border-[#8B4513]/18 bg-[#8B4513]/6",
    rule: "border-[#8B4513]/18",
    badge: "bg-[#8B4513] text-[#FAFAF7]",
    accent: "text-[#8B4513]",
    chip: "border-[#8B4513]/18 text-[#8B4513]",
    chipActive: "border-[#8B4513]/18 bg-[#8B4513] text-[#FAFAF7]",
  },
};

export const BREWSOUL_CATEGORIES: BrewSoulCategory[] = [
  {
    title: "Start Here",
    icon: Rocket,
    desc: "New to BrewSoul? Begin your journey.",
    pages: [
      { label: "The First Sip", path: "/brewsoul/first-sip", desc: "Why your coffee is lying to you — the essay that started it all", icon: ScrollText },
      { label: "Taste Quiz", path: "/brewsoul/quiz", desc: "6 archetypes. 12 questions. Find your coffee identity.", icon: Target },
      { label: "Your Prescription", path: "/brewsoul/prescription", desc: "AI-powered daily protocol — genetics, timing, goals", icon: Pill },
    ],
  },
  {
    title: "The Intelligence Engine",
    icon: ChartColumn,
    desc: "Data-driven coffee research you can't find anywhere else.",
    pages: [
      { label: "Browse All Coffees", path: "/brewsoul/browse", desc: "Every coffee scored on quality, value, sourcing, and experience", icon: Coffee },
      { label: "Chain Rankings", path: "/brewsoul/chains", desc: "100 coffee chains ranked S through F tier", icon: Store },
      { label: "City Coffee Rankings", path: "/brewsoul/cities", desc: "Best coffee cities ranked worldwide", icon: Building2 },
      { label: "Compare Coffees", path: "/brewsoul/compare", desc: "Side-by-side comparison tool", icon: Scale },
      { label: "Coffee Economics", path: "/brewsoul/economics", desc: "Industry economics dashboard", icon: Coins },
    ],
  },
  {
    title: "Deep Research",
    icon: Microscope,
    desc: "Peer-reviewed science and investigative reporting.",
    pages: [
      { label: "Coffee & Health", path: "/brewsoul/health", desc: "8 longevity benefits, 7 real risks, CYP1A2 genetics", icon: Dna },
      { label: "Biodynamic Census", path: "/brewsoul/biodynamic", desc: "All 3 Demeter-certified farms, 6 roasters, every product", icon: Sprout },
      { label: "Decaf Done Right", path: "/brewsoul/decaf", desc: "13 clean brands vs. methylene chloride offenders", icon: FlaskConical },
      { label: "Mold-Free Coffee", path: "/brewsoul/mold-free", desc: "Mycotoxin-free guide — actually clean coffee", icon: ShieldCheck },
      { label: "Follow The Dollar", path: "/brewsoul/follow-the-dollar", desc: "Where your coffee dollar actually goes", icon: Banknote },
      { label: "Wall of Shame", path: "/brewsoul/wall-of-shame", desc: "Fraud, greenwashing, commodity deception exposed", icon: Flag },
    ],
  },
  {
    title: "Reference Library",
    icon: BookOpen,
    desc: "Everything you need to understand coffee deeper.",
    pages: [
      { label: "Coffee Varieties", path: "/brewsoul/varieties", desc: "25 varieties — genetics, cup profiles, rarity", icon: Leaf },
      { label: "Processing Methods", path: "/brewsoul/processing", desc: "Natural, washed, anaerobic, honey — every method", icon: Cog },
      { label: "Roaster Directory", path: "/brewsoul/roasters", desc: "30+ roasters with transparency scores", icon: Flame },
      { label: "Farm Passports", path: "/brewsoul/farms", desc: "Origin stories and farm-level transparency", icon: Mountain },
      { label: "Coffee Glossary", path: "/brewsoul/glossary", desc: "Terminology — from crema to channeling", icon: NotebookPen },
      { label: "Coffee Pairings", path: "/brewsoul/pairings", desc: "Coffee and food pairing guide", icon: Cookie },
    ],
  },
  {
    title: "Tools & Discovery",
    icon: Wrench,
    desc: "Interactive tools to explore, build, and collect.",
    pages: [
      { label: "Blend Builder", path: "/brewsoul/blend-builder", desc: "Build your own custom coffee blend", icon: Palette },
      { label: "Limited Drops", path: "/brewsoul/drops", desc: "Limited edition and seasonal coffee drops", icon: Sparkles },
      { label: "Coffee Experiences", path: "/brewsoul/experiences", desc: "Tastings and experiences worldwide", icon: MapIcon },
      { label: "My Collection", path: "/brewsoul/collection", desc: "Your personal coffee journal and favorites", icon: Notebook },
    ],
  },
  {
    title: "Guest Series",
    icon: Mic,
    desc: "Expert voices interrogating industry systems.",
    pages: [
      { label: "Shanita Nicholas", path: "/brewsoul/guest/shanita-nicholas", desc: "Fair trade theater, roasting deception, and regeneration economics", icon: Coffee },
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
