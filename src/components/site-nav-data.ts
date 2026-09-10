// Real nav structure, ported from the legacy client/src/components/Layout.tsx
// (primaryNavLinks / navCategories / findYourMeExperiences / socialLinks).
// Engagement widgets that lived alongside this nav in the legacy app
// (StartHereBanner, ExitIntentTony, TonyAvatarTrigger, NotificationBell,
// ReadingStreakBadge, WhereNext) are deliberately NOT ported here — they're
// separate behavioral features, not core layout, and aren't in this
// migration pass's scope yet. See NEXTJS-MIGRATION-TODO.md.

export type NavLink = { href: string; label: string; external?: boolean };

export const primaryNavLinks: NavLink[] = [
  { href: "/blog", label: "Read" },
  { href: "/find-my", label: "Fix Myself" },
  { href: "/amplifier", label: "Fix My Company" },
  { href: "/engage", label: "Build With Me" },
];

export const navCategories: { title: string; items: (NavLink & { foundation?: string })[] }[] = [
  {
    title: "Find Yourself",
    items: [
      { href: "/find-my", label: "Find My" },
      { href: "/self-portrait", label: "Self-Portrait" },
      { href: "/ecosystem-map", label: "Ecosystem Map" },
      { href: "/humanos", label: "Human OS 2.0", foundation: "/living-declaration" },
    ],
  },
  {
    title: "Read",
    items: [
      { href: "/articles", label: "All Essays" },
      { href: "/thesis-threads", label: "Thesis Threads" },
      { href: "/impact-futurism", label: "Impact Futurism" },
      { href: "/the-letter", label: "The Letter" },
      { href: "/attention-theft", label: "Attention Theft Manifesto" },
      { href: "/published", label: "Published" },
      { href: "/series", label: "Series" },
      { href: "/the-nightstand", label: "The Nightstand" },
    ],
  },
  {
    title: "Explore",
    items: [
      { href: "/walk-through", label: "Walk Through" },
      { href: "/the-territory", label: "The Territory" },
      { href: "/the-web", label: "The Web" },
      { href: "/framework", label: "Framework" },
      { href: "/soulscore", label: "SoulScore™" },
      { href: "/impact-dashboard", label: "Impact Dashboard" },
    ],
  },
  {
    title: "Engage",
    items: [
      { href: "/amplifier", label: "The Amplifier" },
      { href: "/diamond-cut", label: "The Diamond Cut" },
      { href: "/invest", label: "Invest (ABIT Waitlist)" },
      { href: "/subscribe", label: "Subscribe" },
      { href: "/engage", label: "Enter The Gate" },
      { href: "/pick-up-the-phone", label: "Connect" },
    ],
  },
  {
    title: "The Work",
    items: [
      { href: "/engine-room", label: "Engine Room" },
      { href: "/under-nda", label: "Under NDA" },
      { href: "/intel", label: "Intel" },
      { href: "/clients", label: "The Rolodex" },
      { href: "/recent-creations", label: "Built by Tony G" },
    ],
  },
  {
    title: "Body & Spirit",
    items: [
      { href: "/the-body", label: "The Body" },
      { href: "/spirits", label: "The Liquid Library" },
      { href: "/brewsoul", label: "BrewSoul (Coffee)" },
      { href: "/kava", label: "Kava Encyclopedia" },
      { href: "/journeys", label: "Journeys" },
      { href: "/fauxtony", label: "FauxTony" },
    ],
  },
  {
    title: "The Crusades",
    items: [
      { href: "/attention-theft", label: "Attention Theft" },
      { href: "/attention-theft/weapons", label: "The 10 Weapons" },
      { href: "/attention-theft/report", label: "Report A Spammer" },
      { href: "/attention-theft/legal", label: "Legal Database" },
    ],
  },
];

export const findYourMeGroups: { category: string; items: (NavLink & { badge?: string })[] }[] = [
  {
    category: "Know Thyself",
    items: [
      { href: "/find-my", label: "Find My", badge: "Start" },
      { href: "/self-portrait", label: "Self-Portrait" },
      { href: "/assessments/dharma-finder", label: "Find Your Purpose" },
      { href: "/the-mirror", label: "Find Your Mirror" },
      { href: "/assessments/consciousness-scale", label: "Find Your Level" },
      { href: "/assessments/grant-study", label: "Find Your Score" },
      { href: "/find-your-spirit", label: "Find Your Spirit" },
    ],
  },
  {
    category: "Love & Belonging",
    items: [
      { href: "/community", label: "Find Your Tribe" },
      { href: "/find-your-attachment-style", label: "Find Your Attachment Style" },
      { href: "/find-your-love-language", label: "Find Your Love Language" },
      { href: "/find-your-sexuality", label: "Find Your Sexuality" },
    ],
  },
  {
    category: "Body & Temple",
    items: [
      { href: "/find-your-diet", label: "Find Your Diet" },
      { href: "/find-your-movement", label: "Find Your Movement" },
      { href: "/find-your-sleep", label: "Find Your Sleep" },
    ],
  },
  {
    category: "Taste & Ritual",
    items: [
      { href: "/find-your-sake", label: "Find Your Sake" },
      { href: "/find-your-coffee", label: "Find Your Coffee" },
      { href: "/brewsoul", label: "BrewSoul Intelligence" },
      { href: "/find-your-kitchen", label: "Find Your Kitchen" },
    ],
  },
  {
    category: "Mind & Systems",
    items: [
      { href: "/living-declaration", label: "Find Your Blueprint" },
      { href: "/find-your-peptide", label: "Find Your Peptide" },
      { href: "/peptide-watch", label: "PeptideWatch: Safety Guide" },
      { href: "/find-your-therapy", label: "Find Your Therapy" },
      { href: "/find-your-religion", label: "Find Your Religion" },
      { href: "/find-your-style", label: "Find Your Style" },
      { href: "/soulscore", label: "SoulScore™ Impact" },
    ],
  },
];

export const socialLinks = [
  { href: "https://x.com/ThinkTony", label: "X" },
  { href: "https://linkedin.com/in/tonygreenberg", label: "LinkedIn" },
];
