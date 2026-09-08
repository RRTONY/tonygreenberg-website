// Ported from legacy client/src/pages/FindYourMe.tsx ("Find My — To Find
// Your We") — the ecosystem hub assessment. Real 5 questions, 6
// dimensions (relationships/purpose/body/truth/tribe/consciousness), 6
// real archetypes (each with a real description, real blog article
// slugs, real satellite-site links, real "go deeper" assessment
// forward-references, and a real share text) all ported unchanged and
// verbatim. All 17 unique blog article slugs referenced across the 6
// archetypes were verified live (200 OK) against this migration's real
// Sanity-backed blog before porting.
//
// Two real content updates made on top of the verbatim port:
//
// 1. **The "Full Ecosystem Directory" live/coming status was corrected.**
//    Legacy marked all 26 directory items "live" — accurate on the old
//    site, but several of those routes (`/find-my`, `/the-mirror`,
//    `/assessments/dharma-finder`, `/assessments/consciousness-scale`,
//    `/assessments/grant-study`, `/flow-circuit`) don't exist yet
//    anywhere in this Next.js migration. Since this directory's entire
//    purpose is to tell a user what's actually clickable (it already has
//    a real LIVE/COMING pill and disabled-state styling built for this),
//    shipping it with false "LIVE" labels on 404s would be worse than
//    legacy's real design intent. Status is set per this app's actual
//    current build state instead. `/the-index` was repointed to
//    `/search`, the same fix already made for the identical dead link in
//    `app/series/page.tsx`.
//
// 2. **Find Your Peptide and Find Your Sexuality were added** (Body &
//    Temple and Love & Belonging respectively) — both are real,
//    fully-built assessments elsewhere in this migration that simply
//    didn't exist yet when this legacy page was written. Leaving a
//    real, live assessment out of "every Find Your ___" would be a
//    completeness gap, not fidelity. The "26 doorways" / stats-row counts
//    were updated to the real 28-item / 22-live / 6-coming numbers.
//
// The 8 "What Are You Healing From?" wound cards keep their real
// wound/subtext copy and real links unchanged; legacy's hover-to-reveal
// interaction (imperative `onMouseEnter`/`onMouseLeave` DOM manipulation)
// only worked with a mouse, so on a touch device the links were
// unreachable — the port always shows the links instead, a real
// accessibility fix, not a decoration removed.

export type Dimension = "relationships" | "purpose" | "body" | "truth" | "tribe" | "consciousness";

export const DIMENSION_LABELS: Record<Dimension, string> = {
  relationships: "Relationships",
  purpose: "Purpose",
  body: "Body & Biochemistry",
  truth: "Truth & Integrity",
  tribe: "Tribe & Community",
  consciousness: "Consciousness",
};

export const DIMENSIONS = Object.keys(DIMENSION_LABELS) as Dimension[];

export interface MeChoice {
  text: string;
  dimensions: Partial<Record<Dimension, number>>;
}

export interface MeQuestion {
  stem: string;
  subtext: string;
  choices: MeChoice[];
}

export const QUESTIONS: MeQuestion[] = [
  {
    stem: "The conversation you wish someone would finally have with you is about...",
    subtext: "Not the polite version. The real one.",
    choices: [
      { text: "Why I keep choosing people who can't meet me where I am", dimensions: { relationships: 9, truth: 5, consciousness: 3 } },
      { text: "What I'm actually supposed to be building with my life", dimensions: { purpose: 9, consciousness: 4, truth: 3 } },
      { text: "How to stop performing wellness and start actually feeling it", dimensions: { body: 9, truth: 5, consciousness: 3 } },
      { text: "Why the world keeps rewarding the wrong things — and what I'm going to do about it", dimensions: { truth: 8, tribe: 5, purpose: 4 } },
      { text: "How to find my people without losing myself in the search", dimensions: { tribe: 9, relationships: 4, consciousness: 3 } },
    ],
  },
  {
    stem: "When you're alone at 2am and the masks are off, you're thinking about...",
    subtext: "The thought you don't say out loud.",
    choices: [
      { text: "Whether anyone truly knows me — or just the version I've curated", dimensions: { relationships: 7, truth: 8, consciousness: 4 } },
      { text: "The gap between what I do every day and what I was put here to do", dimensions: { purpose: 9, consciousness: 5, truth: 3 } },
      { text: "How much time I've lost treating symptoms instead of causes", dimensions: { body: 7, truth: 6, consciousness: 5 } },
      { text: "Whether I have the courage to live by what I actually believe", dimensions: { truth: 9, consciousness: 6, purpose: 3 } },
      { text: "Where my tribe is — the people who think like this at 2am too", dimensions: { tribe: 8, relationships: 5, consciousness: 4 } },
    ],
  },
  {
    stem: "If you could master one thing in the next year, you'd choose...",
    subtext: "Not what looks good on a résumé. What changes everything.",
    choices: [
      { text: "The ability to love without armor — and be loved without performing", dimensions: { relationships: 9, consciousness: 5, body: 2 } },
      { text: "Knowing exactly what to build and having the nerve to build it", dimensions: { purpose: 9, truth: 4, tribe: 3 } },
      { text: "Understanding my own biochemistry well enough to optimize every day", dimensions: { body: 9, consciousness: 4, truth: 3 } },
      { text: "Seeing through every system — economic, social, political — to what's actually true", dimensions: { truth: 9, purpose: 4, tribe: 3 } },
      { text: "Building a circle of people who make each other exponentially better", dimensions: { tribe: 9, relationships: 5, purpose: 3 } },
    ],
  },
  {
    stem: "The pattern you keep repeating — the one you're ready to break — is...",
    subtext: "You already know what it is.",
    choices: [
      { text: "Choosing intensity over intimacy, then wondering why I'm alone", dimensions: { relationships: 9, consciousness: 5, truth: 4 } },
      { text: "Starting things that matter and abandoning them before they matter enough", dimensions: { purpose: 8, truth: 5, consciousness: 4 } },
      { text: "Knowing what my body needs and negotiating with it anyway", dimensions: { body: 8, truth: 6, consciousness: 4 } },
      { text: "Saying yes to things I don't believe in to keep the peace", dimensions: { truth: 9, relationships: 4, tribe: 3 } },
      { text: "Trying to belong by becoming someone else", dimensions: { tribe: 8, truth: 6, relationships: 4 } },
    ],
  },
  {
    stem: "The future you're building — whether you've admitted it yet or not — looks like...",
    subtext: "Say it. Out loud. To yourself.",
    choices: [
      { text: "A partnership so real it rewrites what I thought love could be", dimensions: { relationships: 9, consciousness: 5, truth: 4 } },
      { text: "Work that makes me dangerous to the status quo — in the best way", dimensions: { purpose: 9, truth: 5, tribe: 3 } },
      { text: "A body and mind so dialed in that every day feels like a gift I earned", dimensions: { body: 9, consciousness: 5, purpose: 3 } },
      { text: "A life where I never again pretend to believe something I don't", dimensions: { truth: 9, consciousness: 6, relationships: 3 } },
      { text: "A community of builders, healers, and truth-tellers who actually show up", dimensions: { tribe: 9, purpose: 5, relationships: 4 } },
    ],
  },
];

export interface MeArchetype {
  id: Dimension;
  name: string;
  tagline: string;
  description: string;
  articles: string[];
  sites: { name: string; url: string; why: string }[];
  deeperAssessments: { label: string; path: string; why: string }[];
  nextStep: { label: string; path: string };
  shareText: string;
}

export const ARCHETYPES: MeArchetype[] = [
  {
    id: "relationships",
    name: "The Magnetic Partner",
    tagline: "You're not looking for love. You're looking for truth in human form.",
    description: "Your deepest work is relational. You've built walls so sophisticated you forgot they were walls — and now you're ready to dismantle them. The articles below aren't advice. They're mirrors. The sites aren't tools. They're practice fields for the kind of connection that changes your molecular structure.",
    articles: [
      "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
      "the-decay-of-modern-day-communication-and-how-it-is-affecting-your-relationships",
      "the-ties-that-bind-interpersonal-relationships-and-the-art-of-meaningful-connection",
      "the-arithmetic-of-relationships-why-most-people-get-the-math-wrong",
      "the-science-of-being-alone-why-solitude-is-a-superpower",
      "the-molecule-as-mirror-what-psychedelics-reveal-about-consciousness",
    ],
    sites: [
      { name: "Find Your Partner", url: "https://intimacyassess-tcir3hon.manus.space", why: "15 questions. 5 domains. The invisible architecture of your intimacy, mapped." },
      { name: "Find Your Team", url: "/flow-circuit", why: "The neurochemistry of connection — who you build with, measured not guessed." },
      { name: "Find Your Water", url: "https://aqwaterqpr-wvzsc3ph.manus.space", why: "The element that teaches you to flow, not force." },
    ],
    deeperAssessments: [
      { label: "Find Your Score", path: "/assessments/grant-study", why: "85 years of Harvard data says relationships predict everything. Let's see yours." },
      { label: "Find Your Mirror", path: "/the-mirror", why: "6 dimensions. 18 questions. A radar chart that doesn't care about your feelings." },
    ],
    nextStep: { label: "Find Your Partner", path: "https://intimacyassess-tcir3hon.manus.space" },
    shareText: "Turns out I'm a Magnetic Partner — my deepest work is relational truth. 5 questions, zero BS. What are you?",
  },
  {
    id: "purpose",
    name: "The Systems Architect",
    tagline: "You don't just see the broken system. You see what replaces it.",
    description: "Your mind works in infrastructure. While others debate symptoms, you're already sketching the replacement. The articles below will sharpen your pattern recognition. The sites will show you systems already being built. Your tribe is smaller than you think — and more powerful than you know.",
    articles: [
      "the-built-world-is-a-mirror-of-the-people-who-built-it",
      "the-trust-economy-why-the-next-trillion-dollar-companies-will-be-built-on-radical-transparency",
      "the-great-ai-swindle-how-big-tech-is-selling-you-a-future-it-cant-deliver",
      "the-gdp-delusion-why-the-worlds-favorite-metric-is-its-most-dangerous-lie",
      "the-great-rewiring-how-to-build-systems-that-dont-extract",
      "the-art-of-the-long-game-why-patience-is-the-most-undervalued-asset-in-business",
    ],
    sites: [
      { name: "Find Your Blueprint", url: "/living-declaration", why: "The operating system for what comes after extraction." },
      { name: "Find Your Capital", url: "https://portfoliofamilyoffice.manus.space", why: "How aligned money actually moves." },
    ],
    deeperAssessments: [
      { label: "Find Your Purpose", path: "/assessments/dharma-finder", why: "25 questions stolen from Schmachtenberger. Not what you should do — what you can't stop doing." },
      { label: "Find Your Mirror", path: "/the-mirror", why: "6 dimensions. 18 questions. Systems thinkers love data about themselves." },
    ],
    nextStep: { label: "Find Your Blueprint", path: "/living-declaration" },
    shareText: "Apparently I'm a Systems Architect — I see what replaces the broken. 5 questions told me what I already knew. Your turn:",
  },
  {
    id: "body",
    name: "The Temple Keeper",
    tagline: "Your body isn't a machine to optimize. It's a temple to understand.",
    description: "You've tried the hacks. The protocols. The 47-step morning routines. Now you're ready for something deeper — understanding your own biochemistry not as a problem to solve but as a language to learn. The articles below decode that language. The sites give you the lab.",
    articles: [
      "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet",
      "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants",
      "the-eco-vegan-dilemma-when-your-diet-meets-your-carbon-footprint",
      "the-science-of-being-alone-why-solitude-is-a-superpower",
      "the-molecule-as-mirror-what-psychedelics-reveal-about-consciousness",
      "the-longevity-paradox-why-living-longer-means-nothing-if-you-dont-live-deeper",
    ],
    sites: [
      { name: "Find Your Chemistry", url: "https://regenhealth-4nns6jnd.manus.space", why: "Your biochemistry decoded — not as a problem, as a language." },
      { name: "Find Your Water", url: "https://aqwaterqpr-wvzsc3ph.manus.space", why: "Water as medicine, not commodity." },
      { name: "Find Your Mezcal", url: "https://mezcalagave-ahru9fq8.manus.space", why: "The sacred in the everyday ritual." },
    ],
    deeperAssessments: [
      { label: "Find Your Level", path: "/assessments/consciousness-scale", why: "Hawkins calibrated 17 levels from Shame to Enlightenment. Your body already knows which one." },
      { label: "Find Your Mirror", path: "/the-mirror", why: "6 dimensions including the body you've been negotiating with. Time to listen." },
    ],
    nextStep: { label: "Find Your Chemistry", path: "https://regenhealth-4nns6jnd.manus.space" },
    shareText: "So I'm a Temple Keeper — my body's been talking and I finally listened. 5 questions, no hacks. What does your mirror say?",
  },
  {
    id: "truth",
    name: "The Truth Speaker",
    tagline: "You stopped pretending a long time ago. Now you're ready to build from what's real.",
    description: "You have an allergy to bullshit that most people mistake for cynicism. It's not. It's precision. You see through systems, relationships, and narratives to the structural truth underneath — and you're done being polite about it. The articles below are written by someone with the same allergy.",
    articles: [
      "the-great-ai-swindle-how-big-tech-is-selling-you-a-future-it-cant-deliver",
      "the-trust-economy-why-the-next-trillion-dollar-companies-will-be-built-on-radical-transparency",
      "the-gdp-delusion-why-the-worlds-favorite-metric-is-its-most-dangerous-lie",
      "homeaglow-the-anatomy-of-a-consumer-fraud",
      "the-built-world-is-a-mirror-of-the-people-who-built-it",
      "the-great-rewiring-how-to-build-systems-that-dont-extract",
    ],
    sites: [
      { name: "Find Your Evidence", url: "/homeaglow-the-anatomy-of-a-consumer-fraud", why: "What happens when someone actually follows the receipts." },
      { name: "Find Your Blueprint", url: "/living-declaration", why: "Truth as operating system." },
      { name: "Find Your Team", url: "/flow-circuit", why: "The neuroscience of team dynamics." },
    ],
    deeperAssessments: [
      { label: "Find Your Purpose", path: "/assessments/dharma-finder", why: "Truth without purpose is just complaining. 25 questions to find what yours is for." },
      { label: "Find Your Level", path: "/assessments/consciousness-scale", why: "Hawkins says truth-telling starts at 200. Where do you actually calibrate?" },
    ],
    nextStep: { label: "Find Your Living Declaration", path: "/living-declaration" },
    shareText: "Confirmed: I'm a Truth Speaker — allergic to bullshit with clinical precision. 5 questions stripped the paint off. Dare you:",
  },
  {
    id: "tribe",
    name: "The Tribe Weaver",
    tagline: "You don't just want to find your people. You want to build the place where people find each other.",
    description: "Connection isn't a nice-to-have for you — it's infrastructure. You understand that the most powerful technology on earth is a room full of aligned humans. The articles below map the territory. The community is where you start building.",
    articles: [
      "the-decay-of-modern-day-communication-and-how-it-is-affecting-your-relationships",
      "the-ties-that-bind-interpersonal-relationships-and-the-art-of-meaningful-connection",
      "the-trust-economy-why-the-next-trillion-dollar-companies-will-be-built-on-radical-transparency",
      "the-great-rewiring-how-to-build-systems-that-dont-extract",
      "the-art-of-the-long-game-why-patience-is-the-most-undervalued-asset-in-business",
      "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
    ],
    sites: [
      { name: "Find Your Partner", url: "https://intimacyassess-tcir3hon.manus.space", why: "Understand how you connect before you connect." },
      { name: "Find Your Capital", url: "https://portfoliofamilyoffice.manus.space", why: "Aligned capital builds aligned communities." },
    ],
    deeperAssessments: [
      { label: "Find Your Score", path: "/assessments/grant-study", why: "You build tribes. But how deep are the ones you're already in? Harvard wants to know." },
      { label: "Find Your Mirror", path: "/the-mirror", why: "Before you weave others together, see the full picture of where you stand." },
    ],
    nextStep: { label: "Find Your Tribe", path: "/community" },
    shareText: "I'm a Tribe Weaver — I build the rooms where the right people find each other. 5 questions. What are you building?",
  },
  {
    id: "consciousness",
    name: "The Consciousness Explorer",
    tagline: "You've been to the edge. Now you want the map.",
    description: "Whether through meditation, medicine, crisis, or quiet revelation — you've glimpsed something beyond the default settings. Now you want to understand it. Not as woo. As architecture. The articles below treat consciousness as engineering, not escapism. The sites are your lab.",
    articles: [
      "the-molecule-as-mirror-what-psychedelics-reveal-about-consciousness",
      "the-science-of-being-alone-why-solitude-is-a-superpower",
      "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
      "the-longevity-paradox-why-living-longer-means-nothing-if-you-dont-live-deeper",
      "the-built-world-is-a-mirror-of-the-people-who-built-it",
      "the-great-rewiring-how-to-build-systems-that-dont-extract",
    ],
    sites: [
      { name: "Find Your Team", url: "/flow-circuit", why: "Consciousness as measurable team dynamics." },
      { name: "Find Your Water", url: "https://aqwaterqpr-wvzsc3ph.manus.space", why: "The element that teaches presence." },
      { name: "Find Your Chemistry", url: "https://regenhealth-4nns6jnd.manus.space", why: "Optimize the vessel for the signal." },
    ],
    deeperAssessments: [
      { label: "Find Your Level", path: "/assessments/consciousness-scale", why: "17 levels. Shame to Enlightenment. You've glimpsed the edge — now get coordinates." },
      { label: "Find Your Mirror", path: "/the-mirror", why: "Consciousness without self-knowledge is just tripping. 6 dimensions of ground truth." },
    ],
    nextStep: { label: "Find Your Mirror", path: "/the-mirror" },
    shareText: "I'm a Consciousness Explorer — awareness as architecture, not escapism. 5 questions cracked the code. Ready to look?",
  },
];

export const ALL_ARTICLE_SLUGS = Array.from(new Set(ARCHETYPES.flatMap((a) => a.articles)));

export const WOUND_TO_CATEGORY: Record<string, string> = {
  "I keep choosing the wrong people": "Love & Belonging",
  "I don't know what I'm building anymore": "Know Thyself",
  "My body stopped listening to me": "Body & Temple",
  "I see what's broken and nobody cares": "Mind & Systems",
  "I can't find my people": "Love & Belonging",
  "I've glimpsed something bigger and can't unsee it": "Mind & Systems",
  "I'm performing wellness instead of feeling it": "Body & Temple",
  "I have the resources but not the impact": "Mind & Systems",
};

export interface WoundCard {
  wound: string;
  subtext: string;
  icon: string;
  color: string;
  links: { label: string; path: string; type: "assessment" | "tool" | "community" | "reading" }[];
}

export const WOUND_CARDS: WoundCard[] = [
  {
    wound: "I keep choosing the wrong people",
    subtext: "Relationships that drain instead of sustain",
    icon: "♡",
    color: "#C97B7B",
    links: [
      { label: "Find Your Partner", path: "https://intimacyassess-tcir3hon.manus.space", type: "assessment" },
      { label: "Find Your Score", path: "/assessments/grant-study", type: "assessment" },
      { label: "Find Your Mirror", path: "/the-mirror", type: "assessment" },
    ],
  },
  {
    wound: "I don't know what I'm building anymore",
    subtext: "Purpose that went missing somewhere around 35",
    icon: "✶",
    color: "#8B6914",
    links: [
      { label: "Find Your Purpose", path: "/assessments/dharma-finder", type: "assessment" },
      { label: "Find Your Blueprint", path: "/living-declaration", type: "tool" },
      { label: "Find Your Index", path: "/search", type: "reading" },
    ],
  },
  {
    wound: "My body stopped listening to me",
    subtext: "Health as negotiation instead of partnership",
    icon: "○",
    color: "#7BC9A4",
    links: [
      { label: "Find Your Chemistry", path: "https://regenhealth-4nns6jnd.manus.space", type: "tool" },
      { label: "Find Your Water", path: "https://aqwaterqpr-wvzsc3ph.manus.space", type: "tool" },
      { label: "Find Your Team", path: "/flow-circuit", type: "tool" },
    ],
  },
  {
    wound: "I see what's broken and nobody cares",
    subtext: "Truth-telling in a world that rewards silence",
    icon: "⚡",
    color: "#E8C97B",
    links: [
      { label: "Find Your Purpose", path: "/assessments/dharma-finder", type: "assessment" },
      { label: "Find Your Level", path: "/assessments/consciousness-scale", type: "assessment" },
      { label: "Find Your Evidence", path: "/homeaglow-the-anatomy-of-a-consumer-fraud", type: "reading" },
    ],
  },
  {
    wound: "I can't find my people",
    subtext: "Surrounded by humans, starving for tribe",
    icon: "◦",
    color: "#9B8EC9",
    links: [
      { label: "Find Your Score", path: "/assessments/grant-study", type: "assessment" },
      { label: "Find Your Tribe", path: "/community", type: "community" },
      { label: "Find Your Partner", path: "https://intimacyassess-tcir3hon.manus.space", type: "assessment" },
    ],
  },
  {
    wound: "I've glimpsed something bigger and can't unsee it",
    subtext: "Consciousness expanding faster than your life can hold",
    icon: "☉",
    color: "#7BA8C9",
    links: [
      { label: "Find Your Level", path: "/assessments/consciousness-scale", type: "assessment" },
      { label: "Find Your Mirror", path: "/the-mirror", type: "assessment" },
      { label: "Find Your Team", path: "/flow-circuit", type: "tool" },
    ],
  },
  {
    wound: "I'm performing wellness instead of feeling it",
    subtext: "The green juice is a lie and you know it",
    icon: "❀",
    color: "#A4C97B",
    links: [
      { label: "Find Your Chemistry", path: "https://regenhealth-4nns6jnd.manus.space", type: "tool" },
      { label: "Find Your Mezcal", path: "https://mezcalagave-ahru9fq8.manus.space", type: "tool" },
      { label: "Find Your Mirror", path: "/the-mirror", type: "assessment" },
    ],
  },
  {
    wound: "I have the resources but not the impact",
    subtext: "Capital without consciousness is just noise",
    icon: "⌂",
    color: "#C9A87B",
    links: [
      { label: "Find Your Capital", path: "https://portfoliofamilyoffice.manus.space", type: "tool" },
      { label: "Find Your Blueprint", path: "/living-declaration", type: "tool" },
      { label: "Find Your Purpose", path: "/assessments/dharma-finder", type: "assessment" },
    ],
  },
];

export interface DirectoryItem {
  name: string;
  hook: string;
  status: "live" | "coming";
  url: string;
}

export interface DirectorySection {
  category: string;
  subtitle: string;
  color: string;
  items: DirectoryItem[];
}

export const DIRECTORY: DirectorySection[] = [
  {
    category: "Know Thyself",
    subtitle: "The mirrors that don't lie",
    color: "#8B6914",
    items: [
      { name: "Find My", hook: "5 questions. Zero right answers. One reckoning.", status: "coming", url: "/find-my" },
      { name: "Find Your Purpose", hook: "What you can't stop doing — even when nobody's paying.", status: "coming", url: "/assessments/dharma-finder" },
      { name: "Find Your Mirror", hook: "6 dimensions. 18 questions. A radar chart that doesn't care about your feelings.", status: "coming", url: "/the-mirror" },
      { name: "Find Your Level", hook: "Where you sit on the consciousness scale — and what's keeping you there.", status: "coming", url: "/assessments/consciousness-scale" },
      { name: "Find Your Score", hook: "85 years of Harvard data says relationships predict everything.", status: "coming", url: "/assessments/grant-study" },
      { name: "Find Your Spirit", hook: "35 questions across 10 dimensions. Map your beliefs and discover which of 6 spiritual traditions align with your authentic identity.", status: "live", url: "/find-your-spirit" },
    ],
  },
  {
    category: "Love & Belonging",
    subtitle: "The people work",
    color: "#C97B7B",
    items: [
      { name: "Find Your Partner", hook: "15 questions across 5 domains. The invisible architecture of your intimacy, mapped.", status: "live", url: "https://intimacyassess-tcir3hon.manus.space" },
      { name: "Find Your Tribe", hook: "The people who think like you do at 2am.", status: "live", url: "/community" },
      { name: "Find Your Team", hook: "The neurochemistry of connection — who you build with, measured not guessed.", status: "coming", url: "/flow-circuit" },
      { name: "Find Your Attachment Style", hook: "Why you cling, why you run, and what to do about it.", status: "live", url: "/find-your-attachment-style" },
      { name: "Find Your Love Language", hook: "Not the book. The actual operating system underneath.", status: "live", url: "/find-your-love-language" },
      { name: "Find Your Sexuality", hook: "12 archetypes. The intersection of desire, identity, and honesty.", status: "live", url: "/find-your-sexuality" },
    ],
  },
  {
    category: "Body & Temple",
    subtitle: "The vessel that carries everything else",
    color: "#7BC9A4",
    items: [
      { name: "Find Your Chemistry", hook: "Your body is a lab. Time to read the results.", status: "live", url: "https://regenhealth-4nns6jnd.manus.space" },
      { name: "Find Your Water", hook: "The element that teaches you to flow, not force.", status: "live", url: "https://aqwaterqpr-wvzsc3ph.manus.space" },
      { name: "Find Your Diet", hook: "Not a meal plan. A metabolic philosophy matched to your biology.", status: "live", url: "/find-your-diet" },
      { name: "Find Your Movement", hook: "The exercise your nervous system is actually asking for.", status: "live", url: "/find-your-movement" },
      { name: "Find Your Sleep", hook: "The architecture of rest you've been negotiating with instead of honoring.", status: "live", url: "/find-your-sleep" },
      { name: "Find Your Peptide", hook: "16 profiles across 7 axes. Real research, not a supplement funnel.", status: "live", url: "/find-your-peptide" },
    ],
  },
  {
    category: "Taste & Ritual",
    subtitle: "What touches your mouth should touch your mind and heart",
    color: "#C9A87B",
    items: [
      { name: "Find Your Mezcal", hook: "The agave that matches your soul — not your Instagram.", status: "live", url: "https://mezcalagave-ahru9fq8.manus.space" },
      { name: "Find Your Tequila", hook: "Highland or lowland. Blanco or añejo. A love letter in liquid form.", status: "live", url: "https://tequilaazul-fxqrr3js.manus.space" },
      { name: "Find Your Sake", hook: "Rice, water, koji, time. The most honest drink on earth.", status: "live", url: "/find-your-sake" },
      { name: "Find Your Coffee", hook: "Single origin isn't a flex. It's a relationship.", status: "live", url: "/find-your-coffee" },
      { name: "Find Your Kitchen", hook: "The restaurant that feeds who you actually are, not who you're performing.", status: "live", url: "/find-your-kitchen" },
    ],
  },
  {
    category: "Mind & Systems",
    subtitle: "For the ones who see the architecture underneath",
    color: "#7BA8C9",
    items: [
      { name: "Find Your Blueprint", hook: "The operating system for what comes after extraction.", status: "live", url: "/living-declaration" },
      { name: "Find Your Capital", hook: "How aligned money actually moves.", status: "live", url: "https://portfoliofamilyoffice.manus.space" },
      { name: "Find Your Therapy", hook: "CBT, IFS, somatic, psychedelic-assisted — matched to your wiring, not a waitlist.", status: "live", url: "/find-your-therapy" },
      { name: "Find Your Religion", hook: "Not which one is right. Which one is yours — or none at all. 20 questions mapping your worldview across 8 dimensions to 8 spiritual archetypes.", status: "live", url: "/find-your-religion" },
      { name: "Find Your Style", hook: "Clothing as identity architecture. What you wear is what you're saying without speaking.", status: "live", url: "/find-your-style" },
    ],
  },
];

export const DIRECTORY_TOTAL = DIRECTORY.reduce((sum, s) => sum + s.items.length, 0);
export const DIRECTORY_LIVE = DIRECTORY.reduce((sum, s) => sum + s.items.filter((i) => i.status === "live").length, 0);
export const DIRECTORY_COMING = DIRECTORY_TOTAL - DIRECTORY_LIVE;
