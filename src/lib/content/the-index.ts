// /the-index ("The Index — Searchable Idea Database"). Ported from live
// tonygreenberg.com/the-index (its TheIndex bundle and searchTerms module,
// read 2026-10-07), which is newer than legacy
// client/src/pages/TheIndex.tsx: same concept map, plus related-term query
// expansion, site resources in the results, a "recently added" list and the
// TLDR + "three related places to go next" panel. Application data and pure
// logic, shared by the page, its Client Component and its Server Actions.
//
// Left out on purpose: live's read counters (made-up numbers, same call as
// the essay pages) and live's "The Stack" entry (/the-stack isn't a route on
// this site).

import { SEARCH_DIRECTORY } from "@/lib/content/search-directory";

export type IndexConcept = {
  key: string;
  label: string;
  description: string;
  /** Post slugs, all present in Sanity (checked 2026-10-07). */
  slugs: string[];
};

// Unchanged from live (and legacy, which has the same map). Live shows the
// counts in brackets and, when a concept is picked, its results newest first.
export const INDEX_CONCEPTS: IndexConcept[] = [
  {
    key: "trust",
    label: "Trust & Relationships",
    description: "The currency that takes years to build and seconds to destroy",
    slugs: ["the-1000-hour-hold", "love-as-dharma-a-science-based-playbook-for-magnetic-partnership", "the-ties-that-bind-interpersonal-relationships", "the-decay-of-modern-day-communication", "only-time-buys-trust", "why-good-service-is-all-about-trust", "the-arithmetic-of-relationships", "the-buyers-and-sellers-honesty-dance-1", "the-buyers-sellers-honesty-dance-2", "customer-service-key-to-business-success"],
  },
  {
    key: "negotiation",
    label: "Negotiation & Deal-Making",
    description: "The art of getting to yes without losing your soul",
    slugs: ["mastering-bd-the-art-of-the-no-that-opens-the-real-door", "the-cios-guide-to-smarter-vendor-negotiation", "thing-price-gouging-price-fixing", "hiding-fees-tips-in-the-transparent-age", "mastering-human-and-business-development"],
  },
  {
    key: "technology",
    label: "Technology & Infrastructure",
    description: "Where silicon meets strategy and billion-dollar decisions are made",
    slugs: ["profiling-the-public-cloud-buyer", "it-challenges-buyers-are-ok-are-you-sure-part-1", "so-now-that-we-admit-we-have-a-problem-part-2", "fast-growth-companies-likely-to-fall-part-3", "business-at-the-speed-of-light-millisecond-worth", "cios-maximize-roi-or-find-new-role-joe-weinman", "productivity-apps-that-rocked-my-world-in-2024", "productivity-apps-that-rock-my-world-in-2026"],
  },
  {
    key: "blockchain",
    label: "Blockchain & Decentralization",
    description: "The promise, the reality, and the space between",
    slugs: ["what-solutions-are-best-built-with-blockchain", "the-ball-and-blockchain-decentralization"],
  },
  {
    key: "health",
    label: "Health & Longevity",
    description: "The body as the ultimate technology platform",
    slugs: ["forever-chemicals-in-my-blood-pfas-and-microplastics", "elixir-of-life-device-and-journey", "forward-health-is-a-sideway-step-at-best", "boiling-the-human-summit-harvard-kurzweil"],
  },
  {
    key: "psychedelics",
    label: "Psychedelics & Consciousness",
    description: "Expanding the operating system of the human mind",
    slugs: ["psychedelics-could-become-extractive-capitalism"],
  },
  {
    key: "ethics",
    label: "Ethics & Values",
    description: "When doing the right thing and doing the profitable thing collide",
    slugs: ["the-tug-of-war-ethical-vs-economic-decisions", "eco-vegan-realities-seriesethical-economic", "how-to-alienate-a-loyal-vegan", "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants", "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet", "grateful-smuggest-sentiment-or-selfish-act", "return-on-investment-going-green-going-green-2"],
  },
  {
    key: "communication",
    label: "Communication & Language",
    description: "What we say, what we mean, and the chasm between",
    slugs: ["clear-communication", "apologize", "6-act-of-speech-speaking-as-a-tool", "the-decay-of-modern-day-communication", "the-decay-of-professional-phone-calls"],
  },
  {
    key: "entrepreneurship",
    label: "Entrepreneurship & Startups",
    description: "Building something from nothing and surviving the process",
    slugs: ["save-entrepreneurs-big-business-buying-startup-2", "when-valuations-dont-mean-valuable", "innovative-thinking-with-tony-greenberg-scale-up-show", "founders-institute-tony-outsourci", "would-you-hire-someone-who-led-a-rebellion"],
  },
  {
    key: "media",
    label: "Media & Entertainment",
    description: "Hollywood, streaming, and the death of the old guard",
    slugs: ["jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again", "amazon-trumps-all-other-suitors-quest-hulu", "clout-v-klout-differences-and-never-be-the-same"],
  },
  {
    key: "food",
    label: "Food & Hospitality",
    description: "Where craft meets commerce and every detail matters",
    slugs: ["restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants", "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet", "an-ode-to-kusaki-where-plants-become-culinary-masterpieces", "origen-restaurant", "bread-stuck-with-no-customer-service", "luz-lounge-where-loyalty-goes-to-die-groupon"],
  },
  {
    key: "fitness",
    label: "Fitness & Fraud",
    description: "When the wellness industry sells you a beautiful lie",
    slugs: ["trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud", "dmn8-the-most-beautiful-crooked-gym-in-the-world"],
  },
  {
    key: "covid",
    label: "Pandemic & Society",
    description: "What COVID revealed about who we really are",
    slugs: ["more-ignorance-or-indignance-in-the-wake-of-covid-19", "covid-deniers-need-to-take-a-breath"],
  },
  {
    key: "philosophy",
    label: "Philosophy & Consciousness",
    description: "The operating system beneath the operating system",
    slugs: ["the-way-of-dao", "human-operating-system", "high-hells-demise-of-powerful-femininity"],
  },
  {
    key: "leadership",
    label: "Leadership & Management",
    description: "The difference between managing people and leading them",
    slugs: ["10-magic-questions-for-projects-success-kick-ass", "marc-andreessen-rebuttal-2020"],
  },
  {
    key: "predictions",
    label: "Predictions & Forecasting",
    description: "Putting your reputation where your mouth is",
    slugs: ["the-2011-cynic-measures-his-predictions"],
  },
  {
    key: "sustainability",
    label: "Sustainability & EV",
    description: "The economics of doing right by the planet",
    slugs: ["my-other-car-is-a-bentley-not-car-to-leaf-alone", "return-on-investment-going-green-going-green-2"],
  },
  {
    key: "community",
    label: "Community & Culture",
    description: "Where people gather and ideas collide",
    slugs: ["summit-series-weekend-community", "davos-2022-world-economic-forum-here-we-come", "india-my-virtual-soul-home"],
  },
  {
    key: "customer-service",
    label: "Customer Service & Time Theft",
    description: "When companies steal your time and call it 'service'",
    slugs: ["the-1000-hour-hold", "california-toll-roads-legalized-scam", "why-good-service-is-all-about-trust", "customer-service-key-to-business-success", "bread-stuck-with-no-customer-service", "luz-lounge-where-loyalty-goes-to-die-groupon"],
  },
  {
    key: "charity",
    label: "Charity & Impact",
    description: "Where does your dollar actually go — and who's watching",
    slugs: [],
  },
];

/** Live's stat line says 18 concepts (its copy, kept as is). */
export const INDEX_STATS_CONCEPTS = "18";
export const INDEX_STATS_YEARS = "25+";

// Live's searchTerms module: a query that touches any word in a group is
// widened to the whole group ("related terms" in live's meta description).
const RELATED_TERM_GROUPS: string[][] = [
  ["health", "healthcare", "wellness", "longevity", "body", "recovery"],
  ["dna", "genetic", "genetics", "genome", "genomic", "sequencing", "whole genome", "30x"],
  ["blood", "bloodwork", "blood work", "labs", "laboratory", "biomarkers", "diagnostics"],
  ["test", "testing", "assessment", "quiz", "screening", "evaluation", "scorecard"],
  ["doctor", "doctors", "clinician", "clinicians", "physician", "medical", "practitioner", "provider"],
  ["therapy", "therapist", "counseling", "counsellor", "psychotherapy", "mental health", "mental wellness"],
  ["psychedelic", "psychedelics", "plant medicine", "entheogen", "readiness", "integration", "harm reduction"],
  ["peptide", "peptides", "compound", "compounds", "research peptide", "supply chain", "coa", "certificate of analysis"],
  ["coffee", "espresso", "caffeine", "brew", "brewing", "roaster", "beans", "cup"],
  ["sleep", "rest", "insomnia", "circadian", "chronotype", "recovery"],
  ["food", "diet", "nutrition", "eating", "meal", "vegan", "keto", "paleo"],
  ["movement", "exercise", "fitness", "workout", "gym", "training", "yoga", "running"],
  ["consciousness", "awareness", "spiritual", "spirituality", "meditation", "mindfulness", "meaning"],
  ["relationship", "relationships", "love", "attachment", "intimacy", "connection", "dating"],
  ["business", "enterprise", "technology", "tech", "procurement", "vendor", "negotiation", "consulting"],
  ["ai", "artificial intelligence", "machine learning", "automation", "algorithm", "llm"],
  ["invest", "investment", "investing", "investor", "portfolio", "capital", "venture"],
  ["impact", "social impact", "sustainability", "regenerative", "esg", "philanthropy", "charity"],
  ["trust", "transparency", "accountability", "evidence", "verification", "provenance"],
  ["scam", "fraud", "deception", "consumer protection", "complaint", "warning", "wall of shame"],
  ["privacy", "data", "data ownership", "personal data", "records", "health records", "control"],
];

export function normalizeIndexQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

/** The query plus every related term from any group it overlaps (live's logic). */
export function expandIndexQuery(query: string): string[] {
  const q = normalizeIndexQuery(query);
  if (!q) return [];
  const terms = new Set([q]);
  for (const group of RELATED_TERM_GROUPS) {
    if (group.some((t) => q.includes(t) || t.includes(q))) group.forEach((t) => terms.add(t));
  }
  return Array.from(terms);
}

// Searching any of these (either way round) also shows the Charity Scorecard card.
const CHARITY_KEYWORDS = ["charity", "impact", "accountability", "scorecard", "giving", "philanthropy", "nonprofit", "donation", "donate"];

export function matchesCharity(query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return false;
  return CHARITY_KEYWORDS.some((k) => k.includes(q) || q.includes(k));
}

/** One searchable row: an essay (from Sanity) or a page from the site directory. */
export type IndexItem = {
  /** Post slug, or `page:<href>` for a site resource. */
  id: string;
  kind: "essay" | "page";
  title: string;
  href: string;
  /** ISO date for essays; null for site resources (they sort last, like live). */
  date: string | null;
  category: string;
  summary: string;
  formatTag: string | null;
  /** Thumbnail URL (Sanity CDN), essays only. */
  image: string | null;
  tags: string[];
  external?: boolean;
};

export type IndexPostRow = {
  slug: string;
  title: string;
  publishedAt: string | null;
  excerpt: string | null;
  formatTag: string | null;
  category: string | null;
  tags: string[] | null;
};

export function essayToIndexItem(post: IndexPostRow, image: string | null): IndexItem {
  return {
    id: post.slug,
    kind: "essay",
    title: post.title,
    href: `/blog/${post.slug}`,
    date: post.publishedAt,
    category: post.category ?? "",
    summary: post.excerpt ?? "",
    formatTag: post.formatTag,
    image,
    tags: post.tags ?? [],
  };
}

/** Every page in the site directory except the Index itself (live does the same). */
export function siteResourceItems(): IndexItem[] {
  return SEARCH_DIRECTORY.filter((p) => p.href !== "/the-index").map((p) => ({
    id: `page:${p.href}`,
    kind: "page",
    title: p.title,
    href: p.href,
    date: null,
    category: "Site Resource",
    summary: p.description,
    formatTag: "SITE RESOURCE",
    image: null,
    tags: p.tags ?? [],
    external: p.external,
  }));
}

/** Title, category, summary and tags, lowercased (the essay body is added server-side). */
export function indexItemText(item: IndexItem): string {
  return [item.title, item.category, item.summary, ...item.tags].join(" ").toLowerCase();
}

export function indexDateValue(date: string | null): number {
  const t = date ? Date.parse(date) : Number.NEGATIVE_INFINITY;
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}

/** Newest first; undated site resources keep their incoming order at the end. */
export function sortIndexByDate(items: IndexItem[]): IndexItem[] {
  return [...items].sort((a, b) => indexDateValue(b.date) - indexDateValue(a.date));
}

/**
 * Live's per-item score: for each expanded term, 12 if it's in the title,
 * else 6 in the summary, else 5 if a tag overlaps it, else 2 anywhere in the
 * searchable text (`fullText`, which server-side includes the essay body).
 */
export function scoreIndexItem(item: IndexItem, terms: string[], fullText: string): number {
  const title = item.title.toLowerCase();
  const summary = item.summary.toLowerCase();
  const tags = item.tags.map((t) => t.toLowerCase());
  return terms.reduce((score, term) => {
    if (title.includes(term)) return score + 12;
    if (summary.includes(term)) return score + 6;
    if (tags.some((t) => t.includes(term) || term.includes(t))) return score + 5;
    if (fullText.includes(term)) return score + 2;
    return score;
  }, 0);
}

/** Concepts whose label or description contains the raw query. */
export function conceptsMatching(query: string): IndexConcept[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return INDEX_CONCEPTS.filter((c) => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
}

/**
 * Live's "three related places to go next": every other item scored by how
 * many of this item's category and tags appear in its searchable text (most
 * first, then newest), topped up with the newest items if fewer than three.
 */
export function pickNextReads(item: IndexItem, items: IndexItem[], textOf: (i: IndexItem) => string): IndexItem[] {
  const keys = Array.from(new Set([item.category.toLowerCase(), ...item.tags.map((t) => t.toLowerCase())].filter(Boolean)));
  const scored = items
    .filter((other) => other.id !== item.id)
    .map((other) => {
      const text = textOf(other);
      return { other, score: keys.reduce((n, k) => (text.includes(k) ? n + 1 : n), 0) };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || indexDateValue(b.other.date) - indexDateValue(a.other.date))
    .map(({ other }) => other);
  const taken = new Set(scored.map((i) => i.id));
  const newest = sortIndexByDate(items).filter((i) => i.id !== item.id && !taken.has(i.id));
  return [...scored, ...newest].slice(0, 3);
}
