// Ported from legacy client/src/data/sitePrompt.ts — Tony's own "content
// DNA" document: the unifying thesis, section-to-thesis mapping, research
// citations, LP comparables, content rules, and the 6 newsletter thesis
// threads mapping real essays to recurring arguments. Real content,
// unchanged, except the `/read/[slug]` links in the original page component
// (fixed in thesis-threads-explorer.tsx to the site's real `/blog/[slug]`
// pattern). All 69 articleSlugs across the 6 threads verified against the
// real migrated post corpus before porting — no stale slugs here (unlike
// the 3 caught on /articles).

export const CORE_THESIS = {
  statement:
    "Extractive capitalism is economically inefficient and morally bankrupt. Regenerative models built on trust, transparency, and aligned incentives produce superior returns for all stakeholders.",
  shortForm: "Extraction wastes. Regeneration compounds.",
  authorVoice:
    "First person. Direct. Earned authority from 25 years of building and advising, not academic distance. Thinks in frameworks, writes in stories.",
  toneRule:
    'Never preachy — always "here\'s what I saw, here\'s what the data says, here\'s what I built because of it."',
} as const;

export interface SectionThesis {
  slug: string;
  title: string;
  mapsTo: string;
  impactSoulConnection: string;
  dataPoints: string[];
  tone: string;
}

export const SECTION_THESIS_MAP: SectionThesis[] = [
  {
    slug: "technology",
    title: "Tech Section",
    mapsTo: "Extraction diagnosis — how opacity creates waste",
    impactSoulConnection:
      "RampRate's SPY Index proved that collapsing information asymmetry saves hundreds of millions. On-chain transparency does the same for capital markets. Same principle, bigger canvas.",
    dataPoints: ["1M+ SPY Index data points", "$10B+ transactions analyzed", "25% avg cost reduction", "99% reduction in early termination risk"],
    tone: "Sharp, numbers-forward, slightly impatient with waste",
  },
  {
    slug: "business",
    title: "Business Section",
    mapsTo: "Ethics-economics alignment — proving the ROI of doing right",
    impactSoulConnection:
      "The ABIT model eliminates the ethical-economic tug of war by structurally aligning investor returns with community impact. Not charity. Not CSR. The engine.",
    dataPoints: ["Grameen Bank repayment rates vs. traditional banking", "B Corp certification 2022", "XPRIZE $3M+ grant facilitated"],
    tone: "Philosophical but grounded. Personal stories that lead to structural insight.",
  },
  {
    slug: "tony",
    title: "Tony Section",
    mapsTo: "Founder credibility — 25 years of consistent behavior",
    impactSoulConnection:
      "An LP investing in a regenerative thesis needs to know the founder lives it. This section is the behavioral track record — 90% philanthropic distribution, diet-as-discipline, relationship calculus, ceremony as practice.",
    dataPoints: ["90% philanthropic distribution", "25 years consistent behavior", "Diet-as-discipline track record"],
    tone: "Warm, experiential, vulnerable where appropriate. The human behind the spreadsheet.",
  },
  {
    slug: "tonyg",
    title: "TonyG Page",
    mapsTo: "LP summary — credentials, track record, portfolio",
    impactSoulConnection:
      "This IS the investor-facing page. Every line should answer: why is this person credible to build the anti-extraction financial instrument?",
    dataPoints: ["Fortune 500 client list", "25 years advisory track record", "B Corp certified"],
    tone: "Confident, credential-dense, no wasted words. Let the client list and track record speak.",
  },
  {
    slug: "crusades",
    title: "The Crusades",
    mapsTo: "Extraction in action — real-world cases of opacity, fraud, and consumer betrayal",
    impactSoulConnection:
      "Every crusade article is a case study in extraction. The pattern is always the same: opacity enables exploitation. Transparency is the antidote.",
    dataPoints: ["Specific dollar amounts lost by consumers", "Complaint counts and resolution rates", "Industry-specific fraud statistics"],
    tone: "Snarky, righteous, data-backed outrage. The consumer advocate who does the math.",
  },
];

export interface ResearchCitation {
  author: string;
  year: number;
  title: string;
  publisher: string;
  relevance: string;
}

export const RESEARCH_LIBRARY: ResearchCitation[] = [
  { author: "Khalili", year: 2025, title: "Extractive Capitalism", publisher: "Profile Books", relevance: "Core framework for the extraction thesis" },
  { author: "IISD", year: 2019, title: "Impact Tokens", publisher: "International Institute for Sustainable Development", relevance: "200+ blockchain impact projects catalogued" },
  { author: "Lansley", year: 2021, title: "The Richer, The Poorer", publisher: "Bristol University Press", relevance: "Wealth concentration and inequality dynamics" },
  { author: "World Inequality Lab", year: 2025, title: "Global Wealth 1800-2025", publisher: "World Inequality Lab", relevance: "Historical wealth distribution data" },
  { author: "Robeyns", year: 2025, title: "Inequality as Central Priority", publisher: "Utrecht University", relevance: "Academic framework for inequality analysis" },
  { author: "Byrnes & Collins", year: 2017, title: "Equity Crisis: True Costs of Extraction", publisher: "Academic Press", relevance: "Quantified costs of extractive economic models" },
];

export interface LPComparable {
  name: string;
  model: string;
  entryPoint: string;
  limitation: string;
}

export const LP_COMPARABLES: LPComparable[] = [
  { name: "Republic", model: "Mirror tokens for retail access", entryPoint: "~$65/share", limitation: "No asset backing or impact alignment" },
  { name: "Calvert Impact Capital", model: "Community investment notes", entryPoint: "$20 minimum", limitation: "No DAO governance or on-chain transparency" },
  { name: "Patagonia", model: '"Earth is only shareholder" structure', entryPoint: "Not investable by public", limitation: "Single-company, no portfolio diversification" },
  { name: "ABITs (ImpactSoul)", model: "Asset backing + impact alignment + DAO governance", entryPoint: "Tokenized access", limitation: "No single comparable offers all three" },
];

export const CONTENT_RULES = {
  thesisConnection: "Every article must contain at least one sentence connecting its topic to the extractive-vs-regenerative thesis. Can be subtle — doesn't need to mention ImpactSoul by name.",
  format: "No bullet points in body copy. Prose paragraphs only.",
  opening: "One sharp declarative opening sentence per piece.",
  citations: "Include at least one external data point or research citation.",
  comparisons: "When discussing any investment or business model, include a price-to-value comparison with at least one alternative/comparable.",
  closing: "End pieces with a forward-looking line that implies momentum, not a conclusion that closes the loop.",
} as const;

export const NEVER_USE = ["synergy", "leverage (as verb)", "disrupt (as adjective)", "passionate about", "at the end of the day", "I AM"];

export interface ThesisThread {
  id: string;
  title: string;
  tagline: string;
  description: string;
  articleSlugs: string[];
}

export const THESIS_THREADS: ThesisThread[] = [
  {
    id: "opacity-tax",
    title: "The Opacity Tax",
    tagline: "What you can't see is costing you everything.",
    description:
      "How hidden fees, buried terms, and information asymmetry extract wealth from consumers and businesses alike. From AI pricing to toll roads to gym contracts — the pattern is always the same.",
    articleSlugs: [
      "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
      "california-toll-roads-legalized-scam",
      "the-1000-hour-hold",
      "hiding-fees-tips-in-the-transparent-age",
      "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud",
      "dmn8-the-most-beautiful-crooked-gym-in-the-world",
      "bread-stuck-with-no-customer-service",
      "luz-lounge-where-loyalty-goes-to-die-groupon",
      "thing-price-gouging-price-fixing",
      "myth-rfp-everything-half-price",
    ],
  },
  {
    id: "trust-economics",
    title: "Trust Economics",
    tagline: "Trust isn't soft. It's the hardest currency there is.",
    description:
      "The measurable ROI of trust, transparency, and relationship capital. From the Grameen Bank to B Corp certification to 25 years of vendor negotiation — the data says the same thing.",
    articleSlugs: [
      "the-tug-of-war-ethical-vs-economic-decisions",
      "only-time-buys-trust",
      "the-arithmetic-of-relationships",
      "the-ties-that-bind-interpersonal-relationships",
      "mastering-bd-the-art-of-the-no-that-opens-the-real-door",
      "mastering-human-and-business-development",
      "why-good-service-is-all-about-trust",
      "customer-service-key-to-business-success",
      "the-buyers-sellers-honesty-dance-2",
      "the-buyers-and-sellers-honesty-dance-1",
    ],
  },
  {
    id: "regenerative-proof",
    title: "The Regenerative Proof",
    tagline: "Not charity. Not CSR. The engine.",
    description:
      "Evidence that regenerative models outperform extractive ones. From impact tokens to conscious capital to the triple bottom line — the returns are real and the data is in.",
    articleSlugs: [
      "conscious-capital-partnership-ecosystem",
      "powering-purpose-driven-innovation",
      "gratitude-in-action",
      "energy-as-impact",
      "from-supply-chain-to-the-blockchain-heal",
      "triple-bottom-line-of-soul-gregory-markel",
      "eco-vegan-realities-seriesethical-economic",
      "return-on-investment-going-green-going-green-2",
      "the-way-of-dao",
    ],
  },
  {
    id: "founder-track-record",
    title: "The Track Record",
    tagline: "25 years of consistent behavior. The human behind the spreadsheet.",
    description:
      "The lived experience that backs the thesis. Psychedelic medicine, biometric optimization, relationship calculus, ceremony as practice. An LP needs to know the founder lives it.",
    articleSlugs: [
      "the-molecule-as-mirror-from-substance-to-service",
      "molecule-as-mirror-1-three-rooms-one-longing",
      "molecule-as-mirror-2-the-old-maps",
      "molecule-as-mirror-3-the-new-cartographers",
      "molecule-as-mirror-4-power-and-relief",
      "molecule-as-mirror-5-escape-and-meaning",
      "molecule-as-mirror-6-the-pause-protocol",
      "molecule-as-mirror-7-the-pathway-to-dharma",
      "molecule-as-mirror-8-resources-and-costs",
      "molecule-as-mirror-9-a-ceremony-story",
      "molecule-as-mirror-10-what-the-pioneers-know",
      "molecule-as-mirror-11-the-doorway",
      "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
      "elixir-of-life-device-and-journey",
      "forever-chemicals-in-my-blood-pfas-and-microplastics",
      "india-my-virtual-soul-home",
      "human-operating-system",
    ],
  },
  {
    id: "market-intelligence",
    title: "Market Intelligence",
    tagline: "When everyone's doing AI and data centers, you need someone who's been in the room.",
    description:
      "Enterprise technology, CIO accountability, vendor negotiation, and the $10B+ of transactions that proved information asymmetry is the most expensive line item in any budget.",
    articleSlugs: [
      "the-cios-guide-to-smarter-vendor-negotiation",
      "cios-maximize-roi-or-find-new-role-joe-weinman",
      "it-challenges-buyers-are-ok-are-you-sure-part-1",
      "so-now-that-we-admit-we-have-a-problem-part-2",
      "fast-growth-companies-likely-to-fall-part-3",
      "when-valuations-dont-mean-valuable",
      "profiling-the-public-cloud-buyer",
      "key-cloud-migration-decisions",
      "wheres-my-flying-car-and-an-efficient-it-market",
      "it-services-good-shoe-10-years-later-ramprate",
      "building-services-market-transhuman-era",
      "founders-institute-tony-outsourci",
      "davos-2022-world-economic-forum-here-we-come",
    ],
  },
  {
    id: "culture-decay",
    title: "The Decay Index",
    tagline: "Communication is dying. Here's the autopsy.",
    description:
      "How professional communication, customer service, and cultural standards have eroded — and what it costs. From phone calls to apologies to the death of clear speech.",
    articleSlugs: [
      "the-clock-keeper-chronicles-part-1",
      "the-decay-of-modern-day-communication",
      "the-decay-of-professional-phone-calls",
      "6-act-of-speech-speaking-as-a-tool",
      "clear-communication",
      "apologize",
      "marc-andreessen-rebuttal-2020",
      "more-ignorance-or-indignance-in-the-wake-of-covid-19",
      "covid-deniers-need-to-take-a-breath",
      "truth-bias-mutually-exclusive",
    ],
  },
];

export const THESIS_CONNECTORS: Record<string, string> = {
  "the-restaurant-with-no-menu-prices-ai-ethics-manifesto":
    "When the price disappears from the menu, the extraction has already begun — and AI is the most expensive restaurant most companies have ever walked into without reading the bill.",
  "california-toll-roads-legalized-scam":
    "Toll roads are extraction distilled to its purest form: a public resource privatized, then priced in the dark.",
  "the-1000-hour-hold":
    "Every hour on hold is a tax on your time that the company never has to account for — the most invisible extraction of all.",
  "conscious-capital-partnership-ecosystem":
    "Conscious capital isn't a philosophy. It's an accounting method that counts what extraction ignores.",
  "the-tug-of-war-ethical-vs-economic-decisions":
    "The tug of war between ethical and economic decisions only exists in extractive models. In regenerative ones, they pull the same rope.",
  "the-molecule-as-mirror-from-substance-to-service":
    "Psychedelic medicine is the opposite of extraction — it gives you back what was always yours, and charges nothing for the insight.",
  "hiding-fees-tips-in-the-transparent-age":
    "Hidden fees are the last refuge of businesses that can't compete on value. Transparency isn't a threat to good companies — it's a threat to bad ones.",
  "from-supply-chain-to-the-blockchain-heal": "The supply chain is where extraction hides. The blockchain is where it gets caught.",
  "the-way-of-dao": "DAOs aren't just governance structures — they're the organizational immune system against extraction.",
  "the-arithmetic-of-relationships":
    "Relationships compound. Extraction depletes. The arithmetic is simple, but most people are solving the wrong equation.",
  "human-operating-system": "The human operating system runs on trust. Every extractive interaction is a bug, not a feature.",
};
