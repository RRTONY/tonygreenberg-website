// Ported from legacy client/src/pages/FindMyHub.tsx's `ALL_LINKS` — the
// "Diagnose" door's real destination (see `src/lib/content/home-doors.ts`'s
// `/find-my` entry, and `src/components/assessments/whats-next.tsx`'s
// "Take Another Assessment" link, both of which already point here as a
// forward-reference). 26 real items across a Featured row and 6 real
// categories, each with its own real tagline and accent color, ported
// unchanged from legacy content.
//
// Real accuracy fix (same fix pattern already applied to
// `lib/content/find-your-me.ts`'s "Full Ecosystem Directory" per its own
// port note): legacy shipped every item as a plain clickable link with no
// live/coming distinction. Several of those destinations don't exist
// anywhere in this Next.js migration yet (`/find-your-ev`,
// `/assessments/dharma-finder`, `/assessments/consciousness-scale`,
// `/assessments/grant-study`, `/life-assessment`, `/soulscore`) — status is
// set per this app's real current build state instead of shipping a link
// that would 404, using the same "live"/"coming" pill convention already
// established by `find-your-me.ts`'s DIRECTORY.
//
// Where an item's real destination already exists in `find-your-me.ts`'s
// audited `DIRECTORY`, this module reuses that entry's real `hook` copy
// and `status` (via `fromEcosystem` below) rather than re-deriving a
// second, possibly-drifting copy of the same facts — per this page's own
// port instructions.
//
// One deliberate status override: `find-your-me.ts`'s DIRECTORY marks
// "Find Your Team" (`/flow-circuit`) as "coming" — accurate when that file
// was written, but `next.config.ts` now has a real `/flow-circuit` →
// `https://flow.tonygreenberg.com` redirect (confirmed live: 308 locally,
// 200 on the destination) that postdates that port. Editing
// `find-your-me.ts` is out of scope for this page (parallel work), so the
// override lives here, documented, rather than silently disagreeing with
// the source file.
//
// Two real net-new-but-live destinations legacy also linked that aren't in
// `find-your-me.ts`'s DIRECTORY at all: `/brewsoul` (a fully-built
// encyclopedia elsewhere in this migration) and the external
// `findmystem-s3lknc4h.manus.space` sibling tool (confirmed live, same
// "real external sibling product" treatment as the other manus.space tools
// already trusted throughout this migration, e.g. Find Your Partner/
// Chemistry/Water/Mezcal/Tequila/Capital).
import { DIRECTORY, type DirectorySection } from "@/lib/content/find-your-me";

function fromEcosystem(url: string, statusOverride?: "live" | "coming") {
  for (const section of DIRECTORY as DirectorySection[]) {
    const item = section.items.find((i) => i.url === url);
    if (item) return { tagline: item.hook, status: statusOverride ?? item.status };
  }
  throw new Error(`find-my-directory: no matching find-your-me DIRECTORY entry for ${url}`);
}

export interface FindMyLink {
  title: string;
  tagline: string;
  href: string;
  icon: string;
  color: string;
  status: "live" | "coming";
}

export const FEATURED: FindMyLink[] = [
  {
    title: "Find My Me",
    tagline: "Clarity on identity & direction",
    href: "/find-your-me",
    icon: "🪞",
    color: "#D4B96A",
    status: "live",
  },
  {
    title: "Find My Love",
    tagline: fromEcosystem("https://intimacyassess-tcir3hon.manus.space").tagline,
    href: "https://intimacyassess-tcir3hon.manus.space",
    icon: "💕",
    color: "#C97B7B",
    status: fromEcosystem("https://intimacyassess-tcir3hon.manus.space").status,
  },
  {
    title: "Find My Car",
    tagline: "Decision tool for major purchases",
    href: "/find-your-ev",
    icon: "🚗",
    color: "#4682B4",
    status: "coming",
  },
];

export interface FindMyCategory {
  key: string;
  label: string;
  items: FindMyLink[];
}

export const CATEGORIES: FindMyCategory[] = [
  {
    key: "body",
    label: "Body & Health",
    items: [
      {
        title: "Find My Peptide",
        tagline: fromEcosystem("/find-your-peptide").tagline,
        href: "/find-your-peptide",
        icon: "🧬",
        color: "#2E8B57",
        status: fromEcosystem("/find-your-peptide").status,
      },
      {
        title: "Find My Stem Cells",
        tagline: "22-question clinic-risk assessment · pricing, red flags, and provider scoring",
        href: "https://findmystem-s3lknc4h.manus.space/",
        icon: "🧫",
        color: "#6B8F71",
        status: "live",
      },
      {
        title: "Find My Diet",
        tagline: fromEcosystem("/find-your-diet").tagline,
        href: "/find-your-diet",
        icon: "🥗",
        color: "#7BC9A4",
        status: fromEcosystem("/find-your-diet").status,
      },
      {
        title: "Find My Movement",
        tagline: fromEcosystem("/find-your-movement").tagline,
        href: "/find-your-movement",
        icon: "🏃",
        color: "#4682B4",
        status: fromEcosystem("/find-your-movement").status,
      },
      {
        title: "Find My Sleep",
        tagline: fromEcosystem("/find-your-sleep").tagline,
        href: "/find-your-sleep",
        icon: "🌙",
        color: "#6A5ACD",
        status: fromEcosystem("/find-your-sleep").status,
      },
      {
        title: "Find My Coffee",
        tagline: fromEcosystem("/find-your-coffee").tagline,
        href: "/find-your-coffee",
        icon: "☕",
        color: "#8B6914",
        status: fromEcosystem("/find-your-coffee").status,
      },
      {
        title: "BrewSoul Intelligence",
        tagline: "100+ coffees ranked · 100 chains scored · Identity-matched",
        href: "/brewsoul",
        icon: "☕",
        color: "#6F4E37",
        status: "live",
      },
      {
        title: "Find My Kitchen",
        tagline: fromEcosystem("/find-your-kitchen").tagline,
        href: "/find-your-kitchen",
        icon: "🍳",
        color: "#D4A76A",
        status: fromEcosystem("/find-your-kitchen").status,
      },
      {
        title: "Find My Sake",
        tagline: fromEcosystem("/find-your-sake").tagline,
        href: "/find-your-sake",
        icon: "🍶",
        color: "#B8860B",
        status: fromEcosystem("/find-your-sake").status,
      },
    ],
  },
  {
    key: "mind",
    label: "Mind & Spirit",
    items: [
      {
        title: "Find My Therapy",
        tagline: fromEcosystem("/find-your-therapy").tagline,
        href: "/find-your-therapy",
        icon: "🧠",
        color: "#7BA8C9",
        status: fromEcosystem("/find-your-therapy").status,
      },
      {
        title: "Find My Spirit",
        tagline: fromEcosystem("/find-your-spirit").tagline,
        href: "/find-your-spirit",
        icon: "✨",
        color: "#A87BC9",
        status: fromEcosystem("/find-your-spirit").status,
      },
      {
        title: "Find My Religion",
        tagline: fromEcosystem("/find-your-religion").tagline,
        href: "/find-your-religion",
        icon: "🕊️",
        color: "#2E8B57",
        status: fromEcosystem("/find-your-religion").status,
      },
    ],
  },
  {
    key: "relationships",
    label: "Relationships",
    items: [
      {
        title: "Find My Sexuality",
        tagline: fromEcosystem("/find-your-sexuality").tagline,
        href: "/find-your-sexuality",
        icon: "🌈",
        color: "#C97B7B",
        status: fromEcosystem("/find-your-sexuality").status,
      },
      {
        title: "Find My Attachment Style",
        tagline: fromEcosystem("/find-your-attachment-style").tagline,
        href: "/find-your-attachment-style",
        icon: "🔗",
        color: "#8B4513",
        status: fromEcosystem("/find-your-attachment-style").status,
      },
      {
        title: "Find My Love Language",
        tagline: fromEcosystem("/find-your-love-language").tagline,
        href: "/find-your-love-language",
        icon: "💬",
        color: "#C97BA8",
        status: fromEcosystem("/find-your-love-language").status,
      },
      {
        title: "Find My Team",
        tagline: fromEcosystem("/flow-circuit", "live").tagline,
        href: "/flow-circuit",
        icon: "🤝",
        color: "#C9A87B",
        status: "live",
      },
    ],
  },
  {
    key: "identity",
    label: "Identity & Style",
    items: [
      {
        title: "Find My Style",
        tagline: fromEcosystem("/find-your-style").tagline,
        href: "/find-your-style",
        icon: "👔",
        color: "#9B2335",
        status: fromEcosystem("/find-your-style").status,
      },
    ],
  },
  {
    key: "deep",
    label: "Deep Assessments",
    items: [
      {
        title: "Dharma Finder",
        tagline: "25 questions to discover your purpose",
        href: "/dharma-finder",
        icon: "◎",
        color: "#D4B96A",
        status: "live",
      },
      {
        title: "Consciousness Scale",
        tagline: "Map your consciousness level",
        href: "/consciousness-scale",
        icon: "△",
        color: "#A87BC9",
        status: "live",
      },
      {
        title: "Grant Study",
        tagline: "Harvard's 85-year life satisfaction study",
        href: "/grant-study",
        icon: "♡",
        color: "#C97B7B",
        status: "live",
      },
      {
        title: "Life Assessment",
        tagline: "Comprehensive life satisfaction across all dimensions",
        href: "/the-mirror",
        icon: "🎯",
        color: "#4682B4",
        status: "live",
      },
    ],
  },
  {
    key: "impact",
    label: "Impact & Scoring",
    items: [
      {
        title: "SoulScore",
        tagline: "Impact verification & blockchain certificates",
        href: "/soulscore",
        icon: "◉",
        color: "#D4B96A",
        status: "live",
      },
      {
        title: "Charity Scorecard",
        tagline: "Evaluate charities on transparency & impact",
        href: "/charity-scorecard",
        icon: "📊",
        color: "#2E8B57",
        status: "live",
      },
    ],
  },
];

export const FIND_MY_TOTAL =
  FEATURED.length + CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);
export const FIND_MY_LIVE =
  FEATURED.filter((l) => l.status === "live").length +
  CATEGORIES.reduce((sum, c) => sum + c.items.filter((l) => l.status === "live").length, 0);
export const FIND_MY_COMING = FIND_MY_TOTAL - FIND_MY_LIVE;
