import { Cog, Wallet, Flame, Swords, type LucideIcon } from "lucide-react";

// Ported from the `themes` array in legacy client/src/pages/Blog.tsx. Only 4
// themes are featured as cards on the homepage (legacy comment: "Living Well
// & Impact & Purpose content still accessible via category filters — just not
// featured as theme cards"). Legacy's hand-kept themeMap.json (slug lists per
// theme) was dropped 2026-10-06: its counts disagreed with the archive's own
// category counts, and the cards now link to the real category pages.
// Legacy used an emoji per theme; this app uses lucide-react for icons.

export type Theme = {
  key: string;
  // The matching Sanity category, so each card links to a real, crawlable
  // /blog/category/<slug> page and counts that category's posts.
  categorySlug: string;
  icon: LucideIcon;
  color: string;
  description: string;
};

export const FEATURED_THEMES: Theme[] = [
  {
    key: "Systems & Innovation",
    categorySlug: "systems-innovation",
    icon: Cog,
    color: "#4682B4",
    description: "Blockchain, AI, transhumanism, and the architecture of what's next",
  },
  {
    key: "Business & Capital",
    categorySlug: "business-capital",
    icon: Wallet,
    color: "#836311",
    description: "Enterprise, sourcing, payments, and the machinery of money",
  },
  {
    key: "Culture & Communication",
    categorySlug: "culture-communication",
    icon: Flame,
    color: "#9B2335",
    description: "Health, relationships, rebellion, and the human operating system",
  },
  {
    key: "The Crusades",
    categorySlug: "the-crusades",
    icon: Swords,
    color: "#B22222",
    description: "Consumer action, corporate accountability, and holding the line",
  },
];
