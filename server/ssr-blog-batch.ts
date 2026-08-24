/**
 * Batch SSR for Top Blog Posts
 * Dynamically renders any blog post from blogData.json as full semantic HTML
 * for search engine bots and AI crawlers.
 *
 * Instead of creating individual SSR files per article, this module handles
 * any slug in the INDEXED_SLUGS list.
 */
import fs from "fs";
import path from "path";
import { marked } from "marked";
import { BLOOD_DNA_REVISED_CONTENT } from "../client/src/data/bloodDnaContent";

const BASE_URL = "https://tonygreenberg.com";
const DEFAULT_SOCIAL_IMAGE = `${BASE_URL}/api/img/tony-headshot_2d63de23.jpg`;

function normalizeMediaUrls(html: string): string {
  return html
    .replace(/https?:\/\/(?:private-us-east-1|files)\.manuscdn\.com[^"'\s<)]*/gi, DEFAULT_SOCIAL_IMAGE)
    .replace(/(?:https?:\/\/tonygreenberg\.com)?\/manus-storage\/([^"'\s<)]+)/gi, `${BASE_URL}/api/img/$1`)
    .replace(/\$\{BASE_URL\}\/og-default\.jpg/gi, DEFAULT_SOCIAL_IMAGE);
}

/**
 * ALL blog posts are SSR-rendered for crawlers.
 * Slugs handled by dedicated SSR files (clarisse, molecule-mirror) are also
 * included here as fallback — the dedicated routes take priority in Express.
 * This list is loaded dynamically from blogData.json at startup.
 */
let _indexedSlugsCache: Set<string> | null = null;

function getIndexedSlugs(): Set<string> {
  if (_indexedSlugsCache) return _indexedSlugsCache;
  const posts = loadBlogData();
  _indexedSlugsCache = new Set(posts.map(p => p.slug).filter(Boolean));
  return _indexedSlugsCache;
}

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  heroImage?: string;
  originalContent?: string;
  updatedContent?: string;
  content?: string;
  keywords?: string[];
  reads?: number;
}

let blogDataCache: BlogPost[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute in dev, effectively permanent in prod

function loadBlogData(): BlogPost[] {
  const now = Date.now();
  if (blogDataCache && now - cacheTime < CACHE_TTL) return blogDataCache;
  try {
    const blogDataPath = path.resolve(import.meta.dirname, "../client/src/data/blogData.json");
    blogDataCache = JSON.parse(fs.readFileSync(blogDataPath, "utf-8"));
    cacheTime = now;
    return blogDataCache!;
  } catch (e) {
    console.error("[SSR-Batch] Failed to load blogData.json:", e);
    return [];
  }
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  } catch {}
  return "2026-01-01";
}

/**
 * Topic-based related posts lookup.
 * Each slug maps to 3 related slugs in the same thematic cluster.
 * Used to inject internal links into every blog post SSR output.
 */
const RELATED_POSTS: Record<string, string[]> = {
  // Psychedelic Medicine cluster
  "iboga-ibogaine-the-full-paradox": ["the-molecule-as-mirror-from-substance-to-service", "psychedelics-could-become-extractive-capitalism", "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine"],
  "the-molecule-as-mirror-from-substance-to-service": ["iboga-ibogaine-the-full-paradox", "molecule-as-mirror-1-three-rooms-one-longing", "psychedelics-could-become-extractive-capitalism"],
  "molecule-as-mirror-1-three-rooms-one-longing": ["the-molecule-as-mirror-from-substance-to-service", "molecule-as-mirror-2-the-old-maps", "iboga-ibogaine-the-full-paradox"],
  "molecule-as-mirror-2-the-old-maps": ["molecule-as-mirror-1-three-rooms-one-longing", "molecule-as-mirror-3-the-new-cartographers", "the-molecule-as-mirror-from-substance-to-service"],
  "molecule-as-mirror-3-the-new-cartographers": ["molecule-as-mirror-2-the-old-maps", "molecule-as-mirror-4-power-and-relief", "iboga-ibogaine-the-full-paradox"],
  "molecule-as-mirror-4-power-and-relief": ["molecule-as-mirror-3-the-new-cartographers", "molecule-as-mirror-5-escape-and-meaning", "the-molecule-as-mirror-from-substance-to-service"],
  "molecule-as-mirror-5-escape-and-meaning": ["molecule-as-mirror-4-power-and-relief", "molecule-as-mirror-6-the-pause-protocol", "iboga-ibogaine-the-full-paradox"],
  "molecule-as-mirror-6-the-pause-protocol": ["molecule-as-mirror-5-escape-and-meaning", "molecule-as-mirror-7-the-pathway-to-dharma", "the-molecule-as-mirror-from-substance-to-service"],
  "molecule-as-mirror-7-the-pathway-to-dharma": ["molecule-as-mirror-6-the-pause-protocol", "molecule-as-mirror-8-resources-and-costs", "iboga-ibogaine-the-full-paradox"],
  "molecule-as-mirror-8-resources-and-costs": ["molecule-as-mirror-7-the-pathway-to-dharma", "molecule-as-mirror-9-a-ceremony-story", "the-molecule-as-mirror-from-substance-to-service"],
  "molecule-as-mirror-9-a-ceremony-story": ["molecule-as-mirror-8-resources-and-costs", "molecule-as-mirror-10-what-the-pioneers-know", "iboga-ibogaine-the-full-paradox"],
  "molecule-as-mirror-10-what-the-pioneers-know": ["molecule-as-mirror-9-a-ceremony-story", "molecule-as-mirror-11-the-doorway", "the-molecule-as-mirror-from-substance-to-service"],
  "molecule-as-mirror-11-the-doorway": ["molecule-as-mirror-10-what-the-pioneers-know", "iboga-ibogaine-the-full-paradox", "psychedelics-could-become-extractive-capitalism"],
  "psychedelics-could-become-extractive-capitalism": ["iboga-ibogaine-the-full-paradox", "the-molecule-as-mirror-from-substance-to-service", "frqncy-the-bus-that-restores-the-world"],
  "frqncy-the-bus-that-restores-the-world": ["iboga-ibogaine-the-full-paradox", "psychedelics-could-become-extractive-capitalism", "the-molecule-as-mirror-from-substance-to-service"],
  // Health & Chemicals cluster
  "forever-chemicals-in-my-blood-pfas-and-microplastics": ["the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine", "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet", "forward-health-is-a-sideway-step-at-best"],
  "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine": ["forever-chemicals-in-my-blood-pfas-and-microplastics", "iboga-ibogaine-the-full-paradox", "forward-health-is-a-sideway-step-at-best"],
  "forward-health-is-a-sideway-step-at-best": ["forever-chemicals-in-my-blood-pfas-and-microplastics", "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine", "elixir-of-life-device-and-journey"],
  "elixir-of-life-device-and-journey": ["forward-health-is-a-sideway-step-at-best", "forever-chemicals-in-my-blood-pfas-and-microplastics", "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine"],
  // Enterprise Tech & AI cluster
  "you-are-the-moat": ["the-restaurant-with-no-menu-prices-ai-ethics-manifesto", "the-1000-hour-hold", "the-cios-guide-to-smarter-vendor-negotiation"],
  "the-restaurant-with-no-menu-prices-ai-ethics-manifesto": ["you-are-the-moat", "the-1000-hour-hold", "the-cios-guide-to-smarter-vendor-negotiation"],
  "the-1000-hour-hold": ["you-are-the-moat", "the-restaurant-with-no-menu-prices-ai-ethics-manifesto", "california-toll-roads-legalized-scam"],
  "california-toll-roads-legalized-scam": ["the-1000-hour-hold", "the-restaurant-with-no-menu-prices-ai-ethics-manifesto", "you-are-the-moat"],
  "the-cios-guide-to-smarter-vendor-negotiation": ["you-are-the-moat", "the-restaurant-with-no-menu-prices-ai-ethics-manifesto", "myth-rfp-everything-half-price"],
  "myth-rfp-everything-half-price": ["the-cios-guide-to-smarter-vendor-negotiation", "you-are-the-moat", "the-buyers-and-sellers-honesty-dance-1"],
  "the-buyers-and-sellers-honesty-dance-1": ["myth-rfp-everything-half-price", "the-buyers-sellers-honesty-dance-2", "the-cios-guide-to-smarter-vendor-negotiation"],
  "the-buyers-sellers-honesty-dance-2": ["the-buyers-and-sellers-honesty-dance-1", "myth-rfp-everything-half-price", "you-are-the-moat"],
  "productivity-apps-that-rocked-my-world-in-2024": ["productivity-apps-that-rock-my-world-in-2026", "you-are-the-moat", "the-restaurant-with-no-menu-prices-ai-ethics-manifesto"],
  "productivity-apps-that-rock-my-world-in-2026": ["productivity-apps-that-rocked-my-world-in-2024", "you-are-the-moat", "the-restaurant-with-no-menu-prices-ai-ethics-manifesto"],
  "from-supply-chain-to-the-blockchain-heal": ["enterprise-blockchain-can-big-business-co-opt", "you-are-the-moat", "conscious-capital-partnership-ecosystem"],
  "enterprise-blockchain-can-big-business-co-opt": ["from-supply-chain-to-the-blockchain-heal", "you-are-the-moat", "conscious-capital-partnership-ecosystem"],
  // Impact & ImpactSoul cluster
  "conscious-capital-partnership-ecosystem": ["powering-purpose-driven-innovation", "energy-as-impact", "gratitude-in-action"],
  "powering-purpose-driven-innovation": ["conscious-capital-partnership-ecosystem", "energy-as-impact", "gratitude-in-action"],
  "energy-as-impact": ["powering-purpose-driven-innovation", "conscious-capital-partnership-ecosystem", "gratitude-in-action"],
  "gratitude-in-action": ["energy-as-impact", "powering-purpose-driven-innovation", "conscious-capital-partnership-ecosystem"],
  // Food & Restaurant cluster
  "akbar-cuisine-restoration-economics": ["restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants", "origen-restaurant", "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet"],
  "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants": ["akbar-cuisine-restoration-economics", "how-to-alienate-a-loyal-vegan", "origen-restaurant"],
  "how-to-alienate-a-loyal-vegan": ["restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants", "akbar-cuisine-restoration-economics", "eco-vegan-realities-seriesethical-economic"],
  "eco-vegan-realities-seriesethical-economic": ["how-to-alienate-a-loyal-vegan", "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants", "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet"],
  "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet": ["akbar-cuisine-restoration-economics", "eco-vegan-realities-seriesethical-economic", "forever-chemicals-in-my-blood-pfas-and-microplastics"],
  "origen-restaurant": ["akbar-cuisine-restoration-economics", "an-ode-to-kusaki-where-plants-become-culinary-masterpieces", "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants"],
  "an-ode-to-kusaki-where-plants-become-culinary-masterpieces": ["origen-restaurant", "akbar-cuisine-restoration-economics", "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants"],
  "the-bottle-that-quietly-ends-an-entire-civilization": ["forever-chemicals-in-my-blood-pfas-and-microplastics", "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet", "find-my-ev-paul-scott-wont-let-you-buy-a-gas-car"],
  // EV / Environment cluster
  "find-my-ev-paul-scott-wont-let-you-buy-a-gas-car": ["the-bottle-that-quietly-ends-an-entire-civilization", "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet", "my-other-car-is-a-bentley-not-car-to-leaf-alone"],
  "my-other-car-is-a-bentley-not-car-to-leaf-alone": ["find-my-ev-paul-scott-wont-let-you-buy-a-gas-car", "the-bottle-that-quietly-ends-an-entire-civilization", "return-on-investment-going-green-going-green-2"],
  "return-on-investment-going-green-going-green-2": ["my-other-car-is-a-bentley-not-car-to-leaf-alone", "find-my-ev-paul-scott-wont-let-you-buy-a-gas-car", "the-bottle-that-quietly-ends-an-entire-civilization"],
  // Relationships & Communication cluster
  "love-as-dharma-a-science-based-playbook-for-magnetic-partnership": ["the-arithmetic-of-relationships", "the-ties-that-bind-interpersonal-relationships", "human-operating-system"],
  "the-arithmetic-of-relationships": ["love-as-dharma-a-science-based-playbook-for-magnetic-partnership", "the-ties-that-bind-interpersonal-relationships", "human-operating-system"],
  "the-ties-that-bind-interpersonal-relationships": ["the-arithmetic-of-relationships", "love-as-dharma-a-science-based-playbook-for-magnetic-partnership", "the-decay-of-modern-day-communication"],
  "human-operating-system": ["the-arithmetic-of-relationships", "love-as-dharma-a-science-based-playbook-for-magnetic-partnership", "the-ties-that-bind-interpersonal-relationships"],
  "the-decay-of-modern-day-communication": ["the-ties-that-bind-interpersonal-relationships", "the-decay-of-professional-phone-calls", "clear-communication"],
  "the-decay-of-professional-phone-calls": ["the-decay-of-modern-day-communication", "clear-communication", "the-ties-that-bind-interpersonal-relationships"],
  "clear-communication": ["the-decay-of-professional-phone-calls", "the-decay-of-modern-day-communication", "why-good-service-is-all-about-trust"],
  // Trust & Service cluster
  "why-good-service-is-all-about-trust": ["customer-service-key-to-business-success", "the-1000-hour-hold", "clear-communication"],
  "customer-service-key-to-business-success": ["why-good-service-is-all-about-trust", "the-1000-hour-hold", "bread-stuck-with-no-customer-service"],
  "bread-stuck-with-no-customer-service": ["customer-service-key-to-business-success", "why-good-service-is-all-about-trust", "the-1000-hour-hold"],
  // Futurism / Kurzweil cluster
  "boiling-the-human-summit-harvard-kurzweil": ["building-services-market-transhuman-era", "greenberg-kurzweil-scientist-foundation-of-trust", "wheres-my-flying-car-and-an-efficient-it-market"],
  "greenberg-kurzweil-scientist-foundation-of-trust": ["boiling-the-human-summit-harvard-kurzweil", "building-services-market-transhuman-era", "human-operating-system"],
  "building-services-market-transhuman-era": ["boiling-the-human-summit-harvard-kurzweil", "greenberg-kurzweil-scientist-foundation-of-trust", "wheres-my-flying-car-and-an-efficient-it-market"],
  "wheres-my-flying-car-and-an-efficient-it-market": ["boiling-the-human-summit-harvard-kurzweil", "building-services-market-transhuman-era", "a-cynic-predicts-it-and-media-in-2011"],
  // Misc
  "the-clock-keeper-chronicles-part-1": ["you-are-the-moat", "the-1000-hour-hold", "the-restaurant-with-no-menu-prices-ai-ethics-manifesto"],
  "is-that-a-lot-clarisse-abelarde": ["akbar-cuisine-restoration-economics", "you-are-the-moat", "the-restaurant-with-no-menu-prices-ai-ethics-manifesto"],
  "innovative-thinking-with-tony-greenberg-scale-up-show": ["you-are-the-moat", "the-restaurant-with-no-menu-prices-ai-ethics-manifesto", "conscious-capital-partnership-ecosystem"],
  "india-my-virtual-soul-home": ["love-as-dharma-a-science-based-playbook-for-magnetic-partnership", "human-operating-system", "the-ties-that-bind-interpersonal-relationships"],
  "summit-series-weekend-community": ["conscious-capital-partnership-ecosystem", "powering-purpose-driven-innovation", "energy-as-impact"],
  "davos-2022-world-economic-forum-here-we-come": ["conscious-capital-partnership-ecosystem", "powering-purpose-driven-innovation", "you-are-the-moat"],
  "covid-deniers-need-to-take-a-breath": ["forward-health-is-a-sideway-step-at-best", "forever-chemicals-in-my-blood-pfas-and-microplastics", "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine"],
  "would-you-hire-someone-who-led-a-rebellion": ["you-are-the-moat", "the-cios-guide-to-smarter-vendor-negotiation", "myth-rfp-everything-half-price"],
  "when-valuations-dont-mean-valuable": ["you-are-the-moat", "the-cios-guide-to-smarter-vendor-negotiation", "conscious-capital-partnership-ecosystem"],
  "high-hells-demise-of-powerful-femininity": ["love-as-dharma-a-science-based-playbook-for-magnetic-partnership", "the-arithmetic-of-relationships", "human-operating-system"],
  "apologize": ["clear-communication", "the-decay-of-modern-day-communication", "why-good-service-is-all-about-trust"],
  "grateful-smuggest-sentiment-or-selfish-act": ["gratitude-in-action", "the-arithmetic-of-relationships", "love-as-dharma-a-science-based-playbook-for-magnetic-partnership"],
  "10-magic-questions-for-projects-success-kick-ass": ["you-are-the-moat", "the-cios-guide-to-smarter-vendor-negotiation", "myth-rfp-everything-half-price"],
  "truth-bias-mutually-exclusive": ["clear-communication", "why-good-service-is-all-about-trust", "the-decay-of-modern-day-communication"],
  "trust-tongue-bottle-wine": ["surfing-wwc-worldwide-wine-club", "points-pointless-only-wine-expert-matters", "why-good-service-is-all-about-trust"],
  "surfing-wwc-worldwide-wine-club": ["trust-tongue-bottle-wine", "points-pointless-only-wine-expert-matters", "origen-restaurant"],
  "points-pointless-only-wine-expert-matters": ["trust-tongue-bottle-wine", "surfing-wwc-worldwide-wine-club", "origen-restaurant"],
  "drbronners-to-pressurecookers-simplify-your-life": ["forward-health-is-a-sideway-step-at-best", "elixir-of-life-device-and-journey", "forever-chemicals-in-my-blood-pfas-and-microplastics"],
  "luz-lounge-where-loyalty-goes-to-die-groupon": ["customer-service-key-to-business-success", "why-good-service-is-all-about-trust", "the-1000-hour-hold"],
  "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud": ["dmn8-the-most-beautiful-crooked-gym-in-the-world", "customer-service-key-to-business-success", "the-1000-hour-hold"],
  "dmn8-the-most-beautiful-crooked-gym-in-the-world": ["trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud", "customer-service-key-to-business-success", "the-1000-hour-hold"],
  "founders-institute-tony-outsourci": ["the-cios-guide-to-smarter-vendor-negotiation", "myth-rfp-everything-half-price", "you-are-the-moat"],
  "founders-institute-anti-millennial-funding-guide": ["when-valuations-dont-mean-valuable", "you-are-the-moat", "conscious-capital-partnership-ecosystem"],
  "fast-growth-companies-likely-to-fall-part-3": ["so-now-that-we-admit-we-have-a-problem-part-2", "it-challenges-buyers-are-ok-are-you-sure-part-1", "when-valuations-dont-mean-valuable"],
  "so-now-that-we-admit-we-have-a-problem-part-2": ["fast-growth-companies-likely-to-fall-part-3", "it-challenges-buyers-are-ok-are-you-sure-part-1", "the-cios-guide-to-smarter-vendor-negotiation"],
  "it-challenges-buyers-are-ok-are-you-sure-part-1": ["so-now-that-we-admit-we-have-a-problem-part-2", "fast-growth-companies-likely-to-fall-part-3", "the-cios-guide-to-smarter-vendor-negotiation"],
  "profiling-the-public-cloud-buyer": ["key-cloud-migration-decisions", "the-cios-guide-to-smarter-vendor-negotiation", "you-are-the-moat"],
  "key-cloud-migration-decisions": ["profiling-the-public-cloud-buyer", "the-cios-guide-to-smarter-vendor-negotiation", "you-are-the-moat"],
  "a-cynic-predicts-it-and-media-in-2011": ["the-2011-cynic-measures-his-predictions", "wheres-my-flying-car-and-an-efficient-it-market", "detroits-rut-stagnation-signs-services-markets"],
  "the-2011-cynic-measures-his-predictions": ["a-cynic-predicts-it-and-media-in-2011", "wheres-my-flying-car-and-an-efficient-it-market", "detroits-rut-stagnation-signs-services-markets"],
  "detroits-rut-stagnation-signs-services-markets": ["a-cynic-predicts-it-and-media-in-2011", "the-2011-cynic-measures-his-predictions", "save-entrepreneurs-big-business-buying-startup-2"],
  "save-entrepreneurs-big-business-buying-startup-2": ["detroits-rut-stagnation-signs-services-markets", "when-valuations-dont-mean-valuable", "you-are-the-moat"],
  "triple-bottom-line-of-soul-gregory-markel": ["conscious-capital-partnership-ecosystem", "powering-purpose-driven-innovation", "energy-as-impact"],
  "google-verizon-walled-garden-plan": ["amazon-trumps-all-other-suitors-quest-hulu", "jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again", "break-buggy-whip-now-tipping-for-streaming-video"],
  "amazon-trumps-all-other-suitors-quest-hulu": ["google-verizon-walled-garden-plan", "jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again", "break-buggy-whip-now-tipping-for-streaming-video"],
  "jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again": ["amazon-trumps-all-other-suitors-quest-hulu", "google-verizon-walled-garden-plan", "break-buggy-whip-now-tipping-for-streaming-video"],
  "break-buggy-whip-now-tipping-for-streaming-video": ["amazon-trumps-all-other-suitors-quest-hulu", "jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again", "google-verizon-walled-garden-plan"],
  "it-services-good-shoe-10-years-later-ramprate": ["the-cios-guide-to-smarter-vendor-negotiation", "myth-rfp-everything-half-price", "you-are-the-moat"],
  "cios-maximize-roi-or-find-new-role-joe-weinman": ["the-cios-guide-to-smarter-vendor-negotiation", "myth-rfp-everything-half-price", "you-are-the-moat"],
  "transforming-tony-2-books-mountain-life-strife": ["india-my-virtual-soul-home", "love-as-dharma-a-science-based-playbook-for-magnetic-partnership", "human-operating-system"],
  "clout-v-klout-differences-and-never-be-the-same": ["you-are-the-moat", "the-restaurant-with-no-menu-prices-ai-ethics-manifesto", "clear-communication"],
  "it-war-ethical-vs-economic-decisions": ["the-cios-guide-to-smarter-vendor-negotiation", "myth-rfp-everything-half-price", "eco-vegan-realities-seriesethical-economic"],
};

/**
 * Get 3 related posts for a given slug.
 * Falls back to the 3 most-read posts if no specific mapping exists.
 */
function getRelatedPosts(slug: string, allPosts: BlogPost[]): BlogPost[] {
  const relatedSlugs = RELATED_POSTS[slug] || [
    "iboga-ibogaine-the-full-paradox",
    "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine",
    "you-are-the-moat",
  ];
  return relatedSlugs
    .map(s => allPosts.find(p => p.slug === s))
    .filter((p): p is BlogPost => !!p && p.slug !== slug)
    .slice(0, 3);
}

/**
 * Check if a slug is in our indexed list (all posts with content)
 */
export function isIndexedBlogSlug(slug: string): boolean {
  return getIndexedSlugs().has(slug);
}

/**
 * Render a blog post as full SSR HTML for bots.
 * Returns null if the slug is not found or has no content.
 */
export function renderBlogPostHTML(slug: string): string | null {
  const posts = loadBlogData();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;

  const rawContent = slug === "your-blood-lies-without-your-dna"
    ? BLOOD_DNA_REVISED_CONTENT
    : post.originalContent || post.updatedContent || post.content || "";
  if (!rawContent) return null;
  // The page template provides the semantic H1. Strip only a duplicated leading
  // Markdown H1 from source content so crawlers receive one document title.
  const normalizedContent = rawContent.replace(/^\s*#\s+[^\n]+\n+/, "");
  const disclosureContent = slug === "your-blood-lies-without-your-dna"
    ? normalizedContent
      .replace(
        "I get a referral credit. Full transparency.",
        "I get a referral credit.* Full transparency."
      )
      .concat("\n\n---\n\n**Disclosure:** All proceeds I receive from this referral code are donated to my foundation.")
    : normalizedContent;
  const htmlContent = (marked.parse(disclosureContent, { async: false }) as string)
    .replace(/<h1\b[^>]*>/gi, "<h2>")
    .replace(/<\/h1>/gi, "</h2>");
  const canonical = `${BASE_URL}/blog/${slug}`;
  const metaDescription = (post.summary || "").trim().length >= 70
    ? post.summary.trim()
    : `${post.title}. An essay by Tony Greenberg on ${post.category || "systems, trust, and what comes next"}.`;
  // Normalize image URL to absolute — social crawlers require absolute URLs
  const rawImage = post.heroImage || post.image || "";
  const unusableImage = !rawImage || /placeholder|og-default|tony-headshot|manuscdn\.com/i.test(rawImage);
  const ogImage = unusableImage
    ? `${BASE_URL}/api/img/tony-headshot_2d63de23.jpg`
    : rawImage.startsWith("http")
    ? rawImage
    : rawImage.startsWith("/")
    ? `${BASE_URL}${rawImage}`
    : `${BASE_URL}/${rawImage}`;
  const isoDate = parseDate(post.date);
  const keywords = post.keywords || [];

  // Related posts for internal linking
  const relatedPosts = getRelatedPosts(slug, posts);

  // Slug-specific JSON-LD enhancements (about/mentions entities)
  const slugSpecificJsonLd: Record<string, object> = {
    "when-healing-becomes-extraction": {
      about: [
        { "@type": "Person", name: "Dr. Samuel Lee" },
        { "@type": "Person", name: "Tina Sodhi" },
        { "@type": "Person", name: "Rick Doblin" },
        { "@type": "Organization", name: "ImpactSoul", url: "https://impactsoul.is" },
        { "@type": "Organization", name: "MAPS", url: "https://maps.org" },
      ],
      mentions: [
        { "@type": "Person", name: "Alexander Shulgin" },
        { "@type": "Organization", name: "AtaiBeckley" },
        { "@type": "Organization", name: "Eli Lilly" },
        { "@type": "Organization", name: "Radicle Science" },
        { "@type": "Organization", name: "MycoMedica" },
      ],
    },
  };

  const jsonLd = [
    // Article schema
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: metaDescription,
      image: ogImage,
      author: {
        "@type": "Person",
        name: "Tony Greenberg",
        url: `${BASE_URL}/about`,
        sameAs: [
          "https://www.linkedin.com/in/tonygreenberg",
          "https://x.com/ThinkTony",
        ],
      },
      publisher: {
        "@type": "Organization",
        name: "Tony Greenberg",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/api/img/tony-headshot_2d63de23.jpg`,
        },
      },
      datePublished: `${isoDate}T00:00:00Z`,
      dateModified: `${isoDate}T00:00:00Z`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
      articleSection: post.category,
      keywords: keywords,
      ...(slugSpecificJsonLd[slug] || {}),
    },
    // BreadcrumbList schema
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: canonical },
      ],
    },
  ];

  const relatedPostsHTML = relatedPosts.length > 0 ? `
    <section class="related-posts">
      <h3>Related Reading</h3>
      <ul>
        ${relatedPosts.map(rp => `<li><a href="${BASE_URL}/blog/${rp.slug}">${escapeAttr(rp.title)}</a></li>`).join("\n        ")}
      </ul>
    </section>` : "";

  // Slug-specific Key Takeaways blocks — injected after the first <p> in the article body
  const KEY_TAKEAWAYS: Record<string, string> = {
    "when-healing-becomes-extraction": `
<div class="key-takeaways" style="background:#f5f0e8;border-left:4px solid #D4622A;padding:20px 24px;margin:32px 0;border-radius:4px;">
  <h2 style="font-size:1rem;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Key Takeaways</h2>
  <ul style="margin:0;padding-left:20px;line-height:1.8;">
    <li>Dr. Samuel Lee was charged with felony manslaughter on July 16, 2026 in the death of Tina Sodhi, who died February 10, 2025 during a &#8220;Heart Protocol&#8221; ceremony in Miami Beach.</li>
    <li>Lee simultaneously administered MDMA, ketamine, and DMT &#8212; three pharmacologically incompatible compounds &#8212; in a heated sauna environment.</li>
    <li>The same day, Eli Lilly announced a $2.8 billion acquisition of AtaiBeckley, the psychedelic biotech formed from Beckley Psytech and atai Life Sciences.</li>
    <li>The author is an early investor in Beckley Psytech and a 20-year acquaintance of Rick Doblin of MAPS.</li>
    <li>Five minimum safety standards are proposed for the field.</li>
    <li>The ImpactSoul <a href="https://tonygreenberg.com/psychedelic-readiness-index">Psychedelic Readiness Index</a> is offered as a structural framework.</li>
  </ul>
</div>`,
  };

  // Inject Key Takeaways after the first closing </p> tag in the article body
  function injectKeyTakeaways(html: string, slug: string): string {
    const block = KEY_TAKEAWAYS[slug];
    if (!block) return html;
    const insertAfter = html.indexOf("</p>");
    if (insertAfter < 0) return html + block;
    return html.slice(0, insertAfter + 4) + block + html.slice(insertAfter + 4);
  }

  // Slugs that get the ImpactSoul Score CTA (highest-engagement health/consciousness pages)
  const IMPACTSOUL_SCORE_SLUGS = new Set([
    "forever-chemicals-in-my-blood-pfas-and-microplastics",
    "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine",
    "iboga-ibogaine-the-full-paradox",
    "when-healing-becomes-extraction",
    "forward-health-is-a-sideway-step-at-best",
    "elixir-of-life-device-and-journey",
  ]);

  const impactSoulCTA = IMPACTSOUL_SCORE_SLUGS.has(slug) ? `
    <section class="impactsoul-cta">
      <h3>Get Your ImpactSoul Score</h3>
      <p>This article connects to a deeper question: what is your relationship to impact, health, and regenerative change? The ImpactSoul Score measures exactly that — across 7 dimensions of purpose-aligned living.</p>
      <p><a href="https://impactsoul.is" rel="noopener"><strong>Take the ImpactSoul Score at impactsoul.is →</strong></a></p>
      <p style="font-size:0.85rem;margin-top:0.5rem;">ImpactSoul is a Certified B Corp founded by Tony Greenberg. Four live token ecosystems: BEYOND (ocean cleanup), REX (paleontology), SPACE (digital access), BEING (mental health).</p>
    </section>` : `
    <section class="impactsoul-cta">
      <h3>About ImpactSoul</h3>
      <p>Tony Greenberg is the founder of <a href="https://impactsoul.is" rel="noopener">ImpactSoul</a> — a Certified B Corp tokenizing high-value cultural and real estate assets to fund regenerative impact. Four live token ecosystems: BEYOND (ocean cleanup), REX (paleontology), SPACE (digital access), BEING (mental health).</p>
      <p><a href="https://impactsoul.is" rel="noopener"><strong>Explore ImpactSoul →</strong></a></p>
    </section>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeAttr(post.title.length + 20 <= 70 ? post.title + ' — Tony Greenberg' : post.title.length + 9 <= 70 ? post.title + ' | TonyG' : post.title)}</title>
  <meta name="description" content="${escapeAttr(metaDescription)}" />
  ${keywords.length > 0 ? `<meta name="keywords" content="${escapeAttr(keywords.join(", "))}" />` : ""}
  <meta name="author" content="Tony Greenberg" />
  <meta name="robots" content="index, follow, archive, imageindex" />
  <meta name="googlebot" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeAttr(post.title)}" />
  <meta property="og:description" content="${escapeAttr(metaDescription)}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeAttr(post.title)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="Tony Greenberg" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:published_time" content="${isoDate}T00:00:00Z" />
  <meta property="article:modified_time" content="${new Date().toISOString().split('T')[0]}T00:00:00Z" />
  <meta property="article:author" content="https://tonygreenberg.com/about" />
  <meta property="article:section" content="${escapeAttr(post.category)}" />
  ${keywords.slice(0, 5).map((k) => `<meta property="article:tag" content="${escapeAttr(k)}" />`).join("\n  ")}
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ThinkTony" />
  <meta name="twitter:creator" content="@ThinkTony" />
  <meta name="twitter:title" content="${escapeAttr(post.title)}" />
  <meta name="twitter:description" content="${escapeAttr(metaDescription)}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta name="twitter:image:alt" content="${escapeAttr(post.title)}" />
  <!-- JSON-LD Structured Data -->
  ${jsonLd.map(ld => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`).join("\n  ")}
  <style>
    body { font-family: 'Source Sans 3', 'Source Sans Pro', -apple-system, sans-serif; max-width: 720px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.7; color: #1a1a1a; background: #FAFAF7; }
    h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2.2rem; line-height: 1.2; margin-bottom: 0.5rem; }
    h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; margin-top: 2.5rem; }
    h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; margin-top: 2rem; }
    img { max-width: 100%; height: auto; border-radius: 4px; margin: 1.5rem 0; }
    a { color: #8B6914; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
    blockquote { border-left: 3px solid #D4B96A; padding-left: 1rem; margin-left: 0; font-style: italic; color: #444; }
    hr { border: none; border-top: 1px solid #e0e0e0; margin: 2.5rem 0; }
    .article-footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #e0e0e0; font-size: 0.9rem; color: #666; }
    .related-posts { background: #f5f5f0; border-radius: 8px; padding: 1.5rem; margin: 2.5rem 0; }
    .related-posts h3 { margin-top: 0; font-size: 1.1rem; color: #4a4a5a; }
    .related-posts ul { margin: 0; padding-left: 1.2rem; }
    .related-posts li { margin-bottom: 0.5rem; }
    .impactsoul-cta { background: #1a1a2e; color: #f0ece0; border-radius: 8px; padding: 1.5rem 2rem; margin: 2.5rem 0; }
    .impactsoul-cta h3 { margin-top: 0; color: #D4B96A; }
    .impactsoul-cta a { color: #D4B96A; }
    ul, ol { padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
    code { background: #f0f0f0; padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.9em; }
    table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; }
    th, td { border: 1px solid #ddd; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #f5f5f0; }
  </style>
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="LQaaihFDlOKA7Ss4kjGxfoxV4lESbtBfDANA92BMM9k" />
  <meta name="google-site-verification" content="2hxApw8im70U8QDy4paYiyez268CR69g97hfCWoDMGs" />
</head>
<body>
  <article>
    <header>
      <h1>${escapeAttr(post.title)}</h1>
      <p class="meta">By <a href="${BASE_URL}/about">Tony Greenberg</a> · ${post.date} · ${post.category} · <a href="${canonical}">Read on tonygreenberg.com</a></p>
      ${ogImage ? `<img src="${ogImage}" alt="${escapeAttr(post.title)}" sizes="(max-width: 768px) 100vw, 1200px" loading="lazy" />` : ""}
    </header>
    <section id="article-body">
      ${injectKeyTakeaways(htmlContent, slug)}
    </section>
    ${relatedPostsHTML}
    ${impactSoulCTA}
    <footer class="article-footer">
      <p><strong>Tony Greenberg</strong> is Founder &amp; CEO of <a href="https://ramprate.com">RampRate</a> and Founder of <a href="https://impactsoul.is">ImpactSoul</a>. Twenty-five years building, benchmarking, and negotiating enterprise technology infrastructure.</p>
      <p><a href="${canonical}">View the full interactive version →</a></p>
    </footer>
  </article>
</body>
</html>`;
  return normalizeMediaUrls(html);
}
