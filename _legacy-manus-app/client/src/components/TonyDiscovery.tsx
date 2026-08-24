/**
 * TonyDiscovery — Unified Discovery Interface (Option C)
 * Tony avatar replaces the search icon.
 * Opens a dual-mode panel: quick search on top + FauxTony conversation below.
 * 50+ rotating suggested questions spanning all domains.
 */

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, X, ArrowRight, Sparkles, MessageCircle, ChevronRight, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { BLOG_ITEMS as ENGINE_BLOG_ITEMS, scorePage, scoreBlog, extractSnippet } from "@/lib/searchEngine";
import blogData from "@/data/blogData.json";

/* ── 50+ SUGGESTED QUESTIONS spanning all domains ── */
const SUGGESTED_QUESTIONS = [
  // Enterprise Tech & AI
  "What's the biggest mistake CIOs make when negotiating cloud contracts?",
  "How does the SPY Index actually work?",
  "What should I know before signing a colocation deal?",
  "How do you evaluate AI infrastructure vendors?",
  "What's the real cost of cloud migration?",
  "How do you benchmark data center pricing?",
  // Social Impact & Tokenization
  "How does ImpactSoul's token model actually work?",
  "What's the difference between BEYOND, REX, SPACE, and BEING tokens?",
  "Can tokenization really fund ocean cleanup?",
  "How do you measure impact in a B Corp?",
  "What makes a good impact investment?",
  // Psychedelic Medicine
  "What's your investment thesis on psychedelic medicine?",
  "How is MycoMedica different from other psilocybin companies?",
  "What's the story behind your investment in Paul Stamets' MycoMedica?",
  "What's the FDA pathway for psychedelic therapeutics?",
  "Is ketamine therapy legitimate?",
  "How do you evaluate a psychedelic medicine company?",
  // Payments
  "What is 'the corridor' in payments?",
  "How does stablecoin settlement change cross-border payments?",
  "Why are you investing in payment processing?",
  // Health & Longevity
  "What peptides are actually worth taking?",
  "How do you evaluate a peptide provider?",
  "What's your Oura Ring telling you right now?",
  "What's the best water for me?",
  "How much carbon am I using daily?",
  "What's your morning health protocol?",
  "How do you use biometrics to evaluate alt-therapies?",
  // Consumer Advocacy
  "Why did you go after Homeaglow?",
  "How do you file an FTC complaint?",
  "What are the biggest dark patterns in subscription billing?",
  // Web3 & Digital Identity
  "What is self-sovereign identity?",
  "How does the anonymous healthcare wallet work?",
  "Why did you invest in Yoti?",
  "What's the future of decentralized governance?",
  // Consciousness & Philosophy
  "How do you evaluate a company's consciousness level?",
  "What's the Hawkins Scale and why does it matter?",
  "What did Ram Dass teach you about business?",
  "How do you think about the intersection of blockchain and impact?",
  // Assessments & Self-Discovery
  "What's my dharma?",
  "How do I find my purpose?",
  "What assessment should I take first?",
  "How does the Consciousness Scale work?",
  "What can the Grant Study tell me about happiness?",
  "Take me to Find My Me — where do I start?",
  "Which assessment maps my relationships?",
  "How do I measure my life satisfaction?",
  "What's the Find My ecosystem?",
  "I want to understand myself better — what should I do?",
  "How do I find my attachment style?",
  "What's my love language?",
  "Help me find the right therapy for me",
  "What's my spiritual archetype?",
  // Business & Strategy
  "How do you decide which investments to make?",
  "What's your framework for evaluating a startup?",
  "How do you negotiate a $100M deal?",
  "What's the Diamond Cut methodology?",
  // Personal
  "Why did you start RampRate?",
  "What books are on your nightstand right now?",
  "What's the best advice you've ever received?",
  "How do you think about legacy?",
  "What does 'be the glitch' mean?",
  // Coffee & BrewSoul
  "What's the best coffee in the world right now?",
  "How do you rank Starbucks vs specialty coffee?",
  "What's my BrewSoul identity?",
  "Which coffee chains are actually worth going to?",
  "What's the difference between natural and washed processing?",
  "How do I find better coffee than Starbucks?",
  "What coffee should I be drinking?",
  "Is Blue Bottle worth the price?",
  "What's the Wall of Shame in coffee?",
  "Where does my coffee dollar actually go?",
];

/* ── SEARCHABLE PAGES (same as SearchPalette) ── */
const PAGES = [
  { title: "Blog", href: "/", description: "92 essays spanning 15 years", icon: "📰", tags: ["blog", "essays", "writing"] },
  { title: "Start Here", href: "/start-here", description: "The five essays that tell you who Tony is", icon: "🚪", tags: ["start", "begin", "intro"] },
  { title: "About", href: "/about", description: "The full story", icon: "👤", tags: ["about", "bio", "tony"] },
  { title: "The Seven Doors", href: "/walk-through", description: "Step inside each of the seven doors", icon: "🚶", tags: ["walk", "doors", "seven"] },
  { title: "The Territory", href: "/the-territory", description: "Core ideas and how they connect", icon: "🗺️", tags: ["territory", "map", "ideas"] },
  { title: "Engine Room", href: "/engine-room", description: "Every company, every thesis, every bet", icon: "⚙️", tags: ["engine", "portfolio", "companies", "investments"] },
  { title: "The Body", href: "/the-body", description: "Health protocols and performance", icon: "🧬", tags: ["body", "health", "biohacking", "peptides"] },
  { title: "The Nightstand", href: "/the-nightstand", description: "Books that shaped the thinking", icon: "📚", tags: ["books", "reading", "nightstand"] },
  { title: "The Web", href: "/the-web", description: "Connected thinking across projects", icon: "🕸️", tags: ["web", "network", "connections"] },
  { title: "Journeys", href: "/journeys", description: "Guided transformation paths", icon: "✈️", tags: ["journeys", "travel", "psychedelic"] },
  { title: "Built by Tony G", href: "/recent-creations", description: "Newest releases and builds", icon: "🔨", tags: ["built", "creations", "portfolio"] },
  { title: "Intel", href: "/intel", description: "Research and strategic notes", icon: "🔍", tags: ["intel", "research", "analysis"] },
  { title: "The Index", href: "/the-index", description: "Everything organized in one place", icon: "📋", tags: ["index", "sitemap", "directory"] },
  { title: "Find My", href: "/find-my", description: "All assessments — Find What's Yours", icon: "🔮", tags: ["find my", "assessments", "quiz"] },
  { title: "The Amplifier", href: "/amplifier", description: "Collaborate or expand this work", icon: "📡", tags: ["amplifier", "advisory", "collaborate"] },
  { title: "The Diamond Cut", href: "/diamond-cut", description: "Premium strategy and sharpening", icon: "💎", tags: ["diamond", "strategy", "premium"] },
  { title: "SoulScore™", href: "/soulscore", description: "12-dimension impact measurement with blockchain verification", icon: "🔮", tags: ["soulscore", "impact", "measurement", "blockchain", "verification", "consciousness", "esg", "wall of shame"] },
  { title: "Invest", href: "/invest", description: "Investor access and updates", icon: "📈", tags: ["invest", "abit", "portfolio"] },
  { title: "Shop", href: "/shop", description: "Products and tools", icon: "🛒", tags: ["shop", "products", "buy"] },
  { title: "Subscribe", href: "/subscribe", description: "Newsletter and membership", icon: "📬", tags: ["subscribe", "newsletter", "membership"] },
  { title: "FauxTony (Full Page)", href: "/fauxtony", description: "The full AI chat experience", icon: "🤖", tags: ["ai", "fauxtony", "chat"] },
  { title: "Find Your Me", href: "/find-your-me", description: "Clarity on identity and direction", icon: "🪞", tags: ["me", "identity", "values", "strengths", "find your"] },
  { title: "Find Your Coffee", href: "/find-your-coffee", description: "Your perfect cup, decoded — 15 questions", icon: "☕", tags: ["coffee", "espresso", "latte", "brew", "caffeine", "find your"] },
  { title: "Find Your Diet", href: "/find-your-diet", description: "Food philosophy matching", icon: "🥗", tags: ["diet", "food", "nutrition", "eating", "find your"] },
  { title: "Find Your Movement", href: "/find-your-movement", description: "Exercise and fitness style", icon: "🏃", tags: ["movement", "exercise", "fitness", "workout", "find your"] },
  { title: "Find Your Sleep", href: "/find-your-sleep", description: "Sleep optimization assessment", icon: "🌙", tags: ["sleep", "rest", "insomnia", "circadian", "find your"] },
  { title: "Find Your Therapy", href: "/find-your-therapy", description: "Match the right therapeutic modality", icon: "🧠", tags: ["therapy", "therapist", "mental health", "find your", "cbt", "cognitive behavioral", "dbt", "dialectical", "emdr", "psychodynamic", "somatic", "ifs", "internal family systems", "psychoanalysis", "gestalt", "humanistic", "existential", "jungian", "act", "acceptance commitment", "counseling", "psychotherapy", "trauma", "anxiety", "depression", "ptsd", "attachment", "healing"] },
  { title: "Find Your Spirit", href: "/find-your-spirit", description: "Discover your spiritual archetype", icon: "✨", tags: ["spirit", "spiritual", "meditation", "find your", "archetype", "consciousness", "awakening", "enlightenment", "mysticism", "contemplation", "prayer", "mindfulness", "yoga", "buddhism", "hinduism", "taoism", "sufism", "kabbalah", "shamanism", "animism", "nonduality", "advaita", "zen", "vipassana", "transcendence"] },
  { title: "Find Your Religion", href: "/find-your-religion", description: "Philosophical and spiritual alignment", icon: "🕊️", tags: ["religion", "faith", "belief", "find your", "christianity", "islam", "judaism", "buddhism", "hinduism", "sikhism", "taoism", "jainism", "bahai", "zoroastrianism", "paganism", "wicca", "atheism", "agnosticism", "spiritual but not religious", "philosophy", "ethics", "morality", "meaning", "purpose", "afterlife", "soul", "god", "divine"] },
  { title: "Find Your Sake", href: "/find-your-sake", description: "Japanese rice wine profile", icon: "🍶", tags: ["sake", "japanese", "rice wine", "find your", "nihonshu", "junmai", "daiginjo", "ginjo", "honjozo", "nigori", "nama", "sparkling sake", "koji", "polishing ratio", "umami", "izakaya", "pairing", "temperature", "warm sake", "cold sake"] },
  { title: "Find Your Kitchen", href: "/find-your-kitchen", description: "Cooking style assessment", icon: "🍳", tags: ["kitchen", "cooking", "chef", "culinary", "find your", "recipe", "cuisine", "french", "italian", "japanese", "mexican", "thai", "indian", "fermentation", "baking", "grilling", "sous vide", "farm to table", "molecular", "comfort food", "plant based", "carnivore"] },
  { title: "Find Your Style", href: "/find-your-style", description: "Personal fashion and aesthetic", icon: "👔", tags: ["style", "fashion", "clothing", "find your"] },
  { title: "Find Your Attachment Style", href: "/find-your-attachment-style", description: "Understand your relational patterns", icon: "🔗", tags: ["attachment", "anxious", "avoidant", "secure", "find your", "disorganized", "fearful avoidant", "dismissive avoidant", "anxious preoccupied", "attachment theory", "john bowlby", "mary ainsworth", "relationship", "partner", "dating", "intimacy", "trust", "abandonment", "codependency", "boundaries", "nervous system", "polyvagal", "regulation"] },
  { title: "Find Your Love Language", href: "/find-your-love-language", description: "How you give and receive love", icon: "💬", tags: ["love language", "love", "relationships", "find your", "gary chapman", "words of affirmation", "acts of service", "receiving gifts", "quality time", "physical touch", "communication", "partner", "marriage", "dating", "intimacy", "expression", "appreciation"] },
  { title: "Find Your Peptide", href: "/find-your-peptide", description: "7-axis clinical assessment with 16 archetypes", icon: "🧬", tags: ["peptide", "bpc-157", "bpc 157", "semaglutide", "tirzepatide", "tb-500", "thymosin", "health", "find your", "glp-1", "weight loss", "healing", "recovery", "gut health", "joint", "tendon", "inflammation", "longevity", "biohacking", "injection", "subcutaneous", "archetype", "clinical", "assessment"] },
  { title: "Find My Stem Cells", href: "https://findmystem-s3lknc4h.manus.space/", description: "Global stem-cell clinic decision engine — assessment, ranked preview, pricing by country, Wall of Shame, and BBNBC scoring", icon: "🧫", tags: ["stem cells", "stem cell", "regenerative medicine", "cell therapy", "mesenchymal", "msc", "exosomes", "clinic", "clinic ranking", "pricing", "country pricing", "assessment", "bbnbc", "wall of shame"], external: true },
  { title: "Find Your Sexuality", href: "/find-your-sexuality", description: "6-dimension orientation mapping", icon: "🌈", tags: ["sexuality", "identity", "lgbtq", "find your", "orientation", "kinsey", "spectrum", "bisexual", "pansexual", "asexual", "demisexual", "queer", "heterosexual", "homosexual", "fluid", "nonbinary", "gender", "attraction", "romantic", "sexual", "dimension", "mapping"] },
  { title: "Find Your Love", href: "https://intimacyassess-tcir3hon.manus.space", description: "Relational alignment framework", icon: "💕", tags: ["love", "intimacy", "relationships", "find your"], external: true },
  { title: "Charity Scorecard", href: "/charity-scorecard", description: "Evaluate charities on transparency and impact", icon: "📊", tags: ["charity", "scorecard", "nonprofit", "philanthropy", "donation", "giving", "impact", "transparency", "efficiency", "overhead", "501c3", "tax deduction", "charitable", "foundation", "ngo", "social good", "givewell", "charity navigator", "guidestar", "evaluation"] },
  { title: "Life Assessment", href: "/life-assessment", description: "Comprehensive life satisfaction across all dimensions", icon: "🎯", tags: ["life", "assessment", "satisfaction", "mirror", "wellbeing", "happiness", "fulfillment", "balance", "career", "relationships", "health", "finances", "spirituality", "purpose", "meaning", "self-reflection", "growth", "dimensions", "wheel of life"] },
  { title: "Self-Portrait", href: "/self-portrait", description: "Composite identity map across all assessments", icon: "🎨", tags: ["self portrait", "composite", "radar", "identity", "personality", "profile", "map", "who am i", "self knowledge", "self awareness", "integration", "holistic", "all assessments", "aggregate", "dashboard", "visualization"] },
  { title: "Aqueous", href: "https://aqwaterqpr-wvzsc3ph.manus.space", description: "Personalized water intelligence", icon: "💧", tags: ["water", "aqueous", "awi"], external: true },
  { title: "SoulSmoke", href: "https://mezcalagave-ahru9fq8.manus.space", description: "The alchemy of agave", icon: "🥃", tags: ["mezcal", "soulsmoke", "agave"], external: true },
  { title: "LiquidSun", href: "https://tequilaazul-fxqrr3js.manus.space", description: "Tequila, illuminated", icon: "☀️", tags: ["tequila", "liquidsun"], external: true },
  { title: "Human OS", href: "/humanos", description: "Your decision-making operating system", icon: "🧠", tags: ["human os", "diagnostic", "quiz", "living-declaration", "blueprint"], external: false },
  { title: "Flow Circuit", href: "/flow-circuit", description: "Team performance, decoded", icon: "⚡", tags: ["flow", "team", "circuit"], external: false },
  // BrewSoul Coffee Intelligence
  // Kristi Klawiter Embezzlement Case Study
  { title: "Convicted Embezzler Kristi Klawiter — $46,795 Stolen", href: "/protecting-your-business", description: "She had two theft convictions. I hired her anyway. She stole $46,795. Court records, FBI report, and the documented case file.", icon: "⚠️", tags: ["kristi klawiter", "klawiter", "embezzlement", "fraud", "theft", "stolen", "con artist", "scam", "invoice fraud", "contractor fraud", "criminal record", "background check", "protection", "business fraud", "kris management", "embezzler", "case study"] },
  // VerifiedTribe Community Protection Report
  { title: "VerifiedTribe Report: Alex Azzi — Case File #1", href: "/alex-azzi", description: "Community protection report built on the SunlightProtocol — $137K documented, verified evidence, calculable path to redemption", icon: "⚠️", tags: ["alex azzi", "azzi", "alexander azzi", "xrworkout", "xr workout", "cheshire grin", "cheshiregrin", "grifter", "scam", "scammer", "fraud", "fraudster", "con artist", "con man", "warning", "unpaid", "debt", "invoice", "$137000", "137000", "137k", "ramprate", "ramp rate", "tony greenberg", "public warning", "community evidence", "10 questions", "broken promises", "paper trail", "due diligence", "vendor warning", "startup fraud", "non-payment", "contract breach", "dubai", "las vegas", "santa clara", "san francisco", "miami", "davos", "london", "venice", "doha", "black rock city", "verified tribe", "verifiedtribe", "sunlight protocol", "sunlightprotocol", "community protection", "retribution ledger", "retribution", "reparation", "restitution", "byron katie", "four questions", "the work", "ethical reporting", "consumer protection", "whistleblower", "report", "accountability", "healing", "redemption", "path to removal", "community service", "public acknowledgment", "time theft", "ecosystem damage", "financial restitution", "gossip", "anti-gossip", "verified truth", "humane technology", "social dilemma", "aza raskin", "tristan harris"] },
  { title: "BrewSoul", href: "/brewsoul", description: "Coffee intelligence platform — 103 coffees scored, 100 chains ranked, 6 identity archetypes", icon: "☕", tags: ["brewsoul", "coffee", "espresso", "beans", "roast", "brew", "caffeine", "latte", "cappuccino", "pour over"] },
  { title: "BrewSoul Directory", href: "/brewsoul/directory", description: "Complete index of all BrewSoul pages — research, tools, rankings, science, reference library", icon: "📋", tags: ["brewsoul", "directory", "index", "all pages", "table of contents", "sitemap", "everything", "complete", "list"] },
  { title: "Chain Rankings", href: "/brewsoul/chains", description: "100 coffee chains ranked S through F tier — Starbucks, Blue Bottle, Intelligentsia, and more", icon: "🏪", tags: ["brewsoul", "chain", "starbucks", "dunkin", "blue bottle", "intelligentsia", "peets", "counter culture", "ranking", "coffee chain"] },
  { title: "Coffee Prescription", href: "/brewsoul/prescription", description: "AI-powered personalized daily protocol — genetics, timing, health goals, flavor, budget with specific brand picks", icon: "💊", tags: ["brewsoul", "prescription", "recommend", "coffee recommendation", "what coffee", "best coffee", "suggest", "CYP1A2", "genetics", "cortisol", "timing", "protocol", "personalized", "daily", "how much coffee", "when to drink", "slow metabolizer", "fast metabolizer", "budget"] },
  { title: "Browse Coffees", href: "/brewsoul/browse", description: "All 103 coffees with cupping scores, flavor profiles, and QPR ratings", icon: "📊", tags: ["brewsoul", "browse", "catalog", "coffees", "cupping", "score", "rating"] },
  { title: "Wall of Shame", href: "/brewsoul/wall-of-shame", description: "Coffee fraud, greenwashing, and commodity deception exposed", icon: "🚩", tags: ["brewsoul", "shame", "fraud", "greenwash", "bad coffee", "fake", "commodity"] },
  { title: "Follow The Dollar", href: "/brewsoul/follow-the-dollar", description: "Where your coffee dollar actually goes — supply chain economics", icon: "💵", tags: ["brewsoul", "dollar", "supply chain", "fair trade", "farmer", "economics", "sourcing"] },
  { title: "Coffee Varieties", href: "/brewsoul/varieties", description: "25 coffee varieties with genetics, cup profiles, and rarity", icon: "🌿", tags: ["brewsoul", "variety", "gesha", "bourbon", "typica", "sl28", "caturra", "genetics"] },
  { title: "Coffee Processing", href: "/brewsoul/processing", description: "Natural, washed, anaerobic, honey — processing methods explained", icon: "🧪", tags: ["brewsoul", "processing", "natural", "washed", "anaerobic", "honey", "fermentation"] },
  { title: "Roaster Directory", href: "/brewsoul/roasters", description: "30+ roasters with transparency scores and sourcing ethics", icon: "🔥", tags: ["brewsoul", "roaster", "roastery", "onyx", "counter culture", "george howell", "tim wendelboe"] },
  { title: "Coffee & Health", href: "/brewsoul/health", description: "Comprehensive peer-reviewed research — longevity data, caffeine metabolism, cortisol timing, mycotoxins, CGA science, CYP1A2 genetics, optimal schedule, compound analysis", icon: "🩺", tags: ["brewsoul", "coffee health", "caffeine health", "antioxidant", "cortisol", "CYP1A2", "caffeine metabolism", "sleep", "anxiety", "pregnancy", "mycotoxin", "ochratoxin", "aflatoxin", "acrylamide", "chlorogenic acid", "CGA", "polyphenol", "melanoidin", "trigonelline", "longevity", "mortality", "diabetes", "liver", "parkinson", "alzheimer", "depression", "cancer", "chronobiology", "timing", "roast level", "light roast", "dark roast", "mold", "science", "research", "peer reviewed"] },
  { title: "Mold-Free Coffee", href: "/brewsoul/mold-free", description: "Mycotoxin-free coffee guide — clean coffee that's actually clean", icon: "🦠", tags: ["brewsoul", "mold", "mycotoxin", "clean coffee", "bulletproof", "toxin free"] },
  { title: "Farm Passports", href: "/brewsoul/farms", description: "Origin stories and farm-level transparency", icon: "🏡", tags: ["brewsoul", "farm", "origin", "passport", "ethiopia", "colombia", "kenya", "panama"] },
  { title: "Coffee Pairings", href: "/brewsoul/pairings", description: "Coffee and food pairing guide", icon: "🍰", tags: ["brewsoul", "pairing", "food", "chocolate", "pastry", "breakfast"] },
  { title: "Coffee Glossary", href: "/brewsoul/glossary", description: "Coffee terminology encyclopedia — from crema to channeling", icon: "📖", tags: ["brewsoul", "glossary", "terms", "crema", "extraction", "channeling", "bloom"] },
  { title: "Coffee Economics", href: "/brewsoul/economics", description: "Coffee industry economics dashboard", icon: "📈", tags: ["brewsoul", "economics", "price", "market", "commodity", "c-price"] },
  { title: "Compare Coffees", href: "/brewsoul/compare", description: "Side-by-side coffee comparison tool", icon: "⚖️", tags: ["brewsoul", "compare", "versus", "vs", "side by side"] },
  { title: "Blend Builder", href: "/brewsoul/blend-builder", description: "Build your own custom coffee blend", icon: "🧪", tags: ["brewsoul", "blend", "builder", "custom", "mix"] },
  { title: "Biodynamic Coffee", href: "/brewsoul/biodynamic", description: "Complete census of all 3 Demeter-certified biodynamic coffee farms and 6 roasters worldwide — zero pesticides, carbon sequestration, mold-tested", icon: "🌱", tags: ["brewsoul", "biodynamic", "demeter", "organic", "regenerative", "pesticide free", "holistic roasters", "cafe altura", "purity coffee", "la chacra", "camocim", "18 conejo", "carbon sequestration", "biodynamic coffee", "rudolf steiner"] },
  { title: "Decaf Guide", href: "/brewsoul/decaf", description: "The complete decaf guide — 13 clean brands, 3 processes (Swiss Water, CO₂, MC), Wall of Shame brands, health science, price rankings", icon: "🫖", tags: ["brewsoul", "decaf", "decaffeinated", "swiss water", "methylene chloride", "MC process", "CO2 process", "kicking horse", "purity coffee", "cafe altura", "allegro", "clean decaf", "chemical free", "decaf health", "sleep coffee", "low caffeine", "half caf"] },
  { title: "Coffee Experiences", href: "/brewsoul/experiences", description: "Coffee experiences and tastings around the world", icon: "✈️", tags: ["brewsoul", "experience", "tasting", "cupping", "travel", "coffee tour"] },
  { title: "City Coffee Rankings", href: "/brewsoul/cities", description: "Best coffee cities ranked worldwide", icon: "🏙️", tags: ["brewsoul", "city", "cities", "best coffee city", "portland", "melbourne", "seattle", "tokyo"] },
  { title: "Guest: Shanita Nicholas", href: "/brewsoul/guest/shanita-nicholas", description: "Shanita Nicholas breaks the coffee industry's comfortable lies — Fair Trade failures, roasting mythology, C Market, origin roasting, Quantum Seeds, regenerative economics", icon: "🎤", tags: ["brewsoul", "guest series", "shanita nicholas", "fair trade", "quantum seeds", "sip sonder", "origin roasting", "regenerative", "C market", "supply chain", "farmer", "exploitation", "blockchain coffee", "pre-harvest financing"] },
  { title: "Limited Drops", href: "/brewsoul/drops", description: "Limited edition and seasonal coffee drops", icon: "💧", tags: ["brewsoul", "drops", "limited", "seasonal", "rare", "auction"] },
    // Psychedelic Readiness Index
  { title: "MAO-B Interaction Matrix", href: "/psychedelic-readiness-index#mao-b", description: "Monoamine oxidase inhibitor interaction guide — selegiline, rasagiline, safinamide wash-out timelines, serotonin syndrome risk, SSRI/SNRI/lithium/tramadol contraindications", icon: "⚠️", tags: ["mao", "maoi", "mao-b", "mao-a", "monoamine oxidase", "monoamine oxidase inhibitor", "selegiline", "rasagiline", "safinamide", "serotonin syndrome", "tyramine", "wash-out", "washout", "drug interaction", "ssri", "snri", "lithium", "tramadol", "parkinsons", "parkinson", "antidepressant", "contraindication", "pharmacology", "enzyme", "serotonin", "dopamine", "norepinephrine", "ayahuasca", "harmine", "harmaline", "dmt", "psychedelic safety"] },
  { title: "Psychedelic Readiness Index", href: "/psychedelic-readiness-index", description: "26-medicine pharmacopoeia and 25-question readiness assessment — find your healing path", icon: "🍄", tags: ["psychedelic", "readiness", "pri", "psilocybin", "mushrooms", "magic mushrooms", "mdma", "molly", "ecstasy", "ketamine", "special k", "ibogaine", "ibogaine hcl", "iboga", "iboga vs ibogaine", "tabernanthe iboga", "bwiti", "root bark", "flood dose", "noribogaine", "ayahuasca", "aya", "dmt", "dimethyltryptamine", "lsd", "acid", "lysergic", "mescaline", "peyote", "san pedro", "huachuma", "wachuma", "5-meo-dmt", "bufo", "bufo alvarius", "toad", "cannabis", "marijuana", "thc", "cbd", "salvia", "salvia divinorum", "kambo", "rapé", "sananga", "cacao", "kanna", "sceletium", "amanita", "amanita muscaria", "blue lotus", "nymphaea caerulea", "sassafras", "mda", "nitrous oxide", "soma", "healing", "therapy", "psychedelic medicine", "assessment", "harm reduction", "sacred medicine", "plant medicine", "altered state", "consciousness", "microdose", "microdosing", "ceremony", "shaman", "curandero", "integration", "set and setting", "trip", "trip sitter", "mao", "maoi", "monoamine oxidase", "monoamine oxidase inhibitor", "harmine", "harmaline", "serotonin", "5-ht2a", "receptor", "tryptamine", "phenethylamine", "ergoline", "entheogen", "entheogens", "paul stamets", "terence mckenna", "alexander shulgin", "rick doblin", "maps", "multidisciplinary association", "fda breakthrough", "clinical trial", "decriminalization", "legalization", "mycomedica", "ataibeckley", "beckley", "wake network", "radicle science", "tripp", "neuroplasticity", "default mode network", "dmn", "ego dissolution", "mystical experience", "johns hopkins", "imperial college", "roland griffiths", "robin carhart-harris", "depression", "anxiety", "ptsd", "addiction", "alcoholism", "opioid", "end of life", "spiritual emergency"] },
  { title: "PeptideWatch Safety Guide", href: "/peptide-watch", description: "12 fraud patterns, 18 enforcement actions, vendor scorecard, role-based checklists", icon: "🛡️", tags: ["peptidewatch", "peptide watch", "safety", "fraud", "enforcement", "fda", "doj", "vendor", "scorecard", "checklist", "supply chain", "semaglutide", "ozempic", "wegovy", "tirzepatide", "mounjaro", "bpc-157", "bpc 157", "tb-500", "thymosin beta", "peptide sciences", "finnrick", "counterfeit", "gray market", "black market", "whistleblower", "watchdog", "compounding pharmacy", "503a", "503b", "glp-1", "weight loss", "obesity", "injection", "subcutaneous", "reconstitution", "bacteriostatic water", "purity", "testing", "certificate of analysis", "coa", "hplc", "mass spectrometry", "contamination", "sterility", "endotoxin"] },
  { title: "Iboga vs Ibogaine Deep Dive", href: "/iboga-ibogaine", description: "The Plant vs The Isolate. Full alkaloid profiles, receptor pharmacology, Bwiti tradition vs clinical protocol, outcomes data, pharma alternatives, supplement stacks", icon: "🌳", tags: ["iboga", "ibogaine", "ibogaine hcl", "tabernanthe iboga", "bwiti", "noribogaine", "ibogamine", "tabernanthine", "voacangine", "coronaridine", "ibogaline", "root bark", "flood dose", "sub-flood", "microdose iboga", "addiction", "opioid", "opioid addiction", "heroin", "fentanyl", "methadone", "suboxone", "buprenorphine", "naltrexone", "vivitrol", "nmda", "nmda antagonist", "kappa opioid", "mu opioid", "sigma-2", "sert", "dat", "serotonin transporter", "dopamine transporter", "nicotinic", "5-ht2a", "gdnf", "bdnf", "neuroplasticity", "cardiac", "qt prolongation", "ekg", "electrolyte", "gabon", "cameroon", "ceremony", "clinical", "entourage effect", "alkaloid", "deep dive", "psychedelic", "plant medicine", "tbi", "traumatic brain injury", "ptsd", "depression", "supplement", "coq10", "ubiquinol", "magnesium glycinate", "magnesium l-threonate", "lions mane", "omega 3", "nac", "phosphatidylserine", "integration", "mash", "noller", "glick", "stanford", "maps", "half life", "pharmacokinetics", "death rebirth", "ancestor communion", "initiation", "schedule 1", "controlled substance", "anti-addictive", "withdrawal", "craving", "reward circuit", "dopamine neuron repair"] },
  { title: "Mescaline / Peyote Deep Dive", href: "/peyote-mescaline", description: "Full pharmacology, Latuda Mirror, outcomes data (n=452), pharma-to-plant alternatives, supplement stacks, medicine selector", icon: "🌵", tags: ["mescaline", "peyote", "san pedro", "huachuma", "wachuma", "cactus", "lophophora", "trichocereus", "echinopsis pachanoi", "pharmacology", "receptor", "5-ht2a", "serotonin", "dopamine", "norepinephrine", "mao", "maoi", "monoamine oxidase", "monoamine oxidase inhibitor", "phenethylamine", "latuda", "lurasidone", "antipsychotic", "atypical antipsychotic", "ssri", "snri", "zoloft", "sertraline", "lexapro", "escitalopram", "effexor", "venlafaxine", "wellbutrin", "bupropion", "seroquel", "quetiapine", "abilify", "aripiprazole", "xanax", "alprazolam", "benzodiazepine", "lithium", "lamictal", "lamotrigine", "adderall", "amphetamine", "ritalin", "methylphenidate", "ambien", "zolpidem", "gabapentin", "suboxone", "buprenorphine", "buspar", "buspirone", "hydroxyzine", "trazodone", "supplement", "lions mane", "hericium erinaceus", "ashwagandha", "withania somnifera", "nac", "n-acetyl cysteine", "omega 3", "fish oil", "epa", "dha", "magnesium", "l-theanine", "rhodiola", "bacopa", "psychedelic", "plant medicine", "entheogen", "pharma alternative", "pharma to plant", "deep dive", "outcomes", "outcomes data", "n=452", "depression", "major depressive disorder", "anxiety", "generalized anxiety", "ptsd", "post traumatic stress", "trauma", "addiction", "substance use disorder", "integration", "ceremony", "native american church", "peyote way", "religious freedom", "schedule 1", "controlled substance", "alexander shulgin", "pihkal", "tihkal", "aldous huxley", "doors of perception", "half life", "bioavailability", "dose response", "threshold dose", "microdose", "full dose", "heroic dose", "contraindication", "serotonin syndrome", "drug interaction", "cytochrome p450", "cyp2d6", "blood brain barrier", "neuroplasticity", "neurogenesis", "bdnf"] },
  /* ── Individual PRI Medicine Deep-Links ── */
  { title: "Psilocybin Mushrooms", href: "/psychedelic-readiness-index?m=psilocybin", description: "Classic tryptamine — neuroplasticity, default mode network reset, 6-hour journey", icon: "🍄", tags: ["psilocybin", "mushrooms", "magic mushrooms", "shrooms", "tryptamine", "neuroplasticity", "depression", "anxiety", "ptsd", "microdose"] },
  { title: "Ayahuasca", href: "/psychedelic-readiness-index?m=ayahuasca", description: "The vine of the soul — DMT + MAO inhibitor, 4-8 hour ceremony", icon: "🌿", tags: ["ayahuasca", "aya", "dmt", "maoi", "vine", "ceremony", "purge", "amazon", "shipibo"] },
  { title: "MDMA Therapy", href: "/psychedelic-readiness-index?m=mdma", description: "FDA Breakthrough Therapy — empathogen for PTSD, trauma processing", icon: "💎", tags: ["mdma", "ecstasy", "molly", "empathogen", "ptsd", "maps", "lykos", "trauma"] },
  { title: "Ketamine", href: "/psychedelic-readiness-index?m=ketamine", description: "NMDA antagonist — rapid antidepressant, dissociative, legal in all 50 states. KAP + IFS therapy. Dr. Beverly Reader.", icon: "💉", tags: ["ketamine", "esketamine", "spravato", "nmda", "dissociative", "depression", "infusion", "kap", "ketamine assisted psychotherapy", "ifs", "internal family systems", "beverly reader", "dr reader", "neuroplasticity", "trauma", "complex ptsd", "integration"] },
  { title: "LSD", href: "/psychedelic-readiness-index?m=lsd", description: "Lysergic acid diethylamide — 8-12 hour serotonergic journey", icon: "🔬", tags: ["lsd", "acid", "lysergic", "hofmann", "serotonin", "microdose"] },
  { title: "DMT / 5-MeO-DMT", href: "/psychedelic-readiness-index?m=dmt", description: "The spirit molecule — 15-minute breakthrough, Bufo alvarius toad", icon: "🐸", tags: ["dmt", "5-meo-dmt", "bufo", "toad", "spirit molecule", "breakthrough"] },
  { title: "Iboga (Whole Plant)", href: "/psychedelic-readiness-index?m=iboga", description: "Tabernanthe iboga root bark — Bwiti sacrament, 12+ alkaloids", icon: "🌳", tags: ["iboga", "tabernanthe", "bwiti", "root bark", "gabon", "alkaloid", "noribogaine"] },
  { title: "Ibogaine (Isolated Alkaloid)", href: "/psychedelic-readiness-index?m=ibogaine", description: "Ibogaine HCl — clinical isolate, opioid detox, cardiac monitoring required", icon: "⚗️", tags: ["ibogaine", "ibogaine hcl", "opioid", "detox", "flood dose", "cardiac", "qt"] },
  { title: "Peyote / Mescaline", href: "/psychedelic-readiness-index?m=mescaline", description: "Phenethylamine cactus — 8-12 hours, Native American Church sacrament", icon: "🌵", tags: ["mescaline", "peyote", "san pedro", "huachuma", "cactus", "phenethylamine"] },
  { title: "Kambo", href: "/psychedelic-readiness-index?m=kambo", description: "Giant monkey frog peptide — intense purge, immune reset", icon: "🐸", tags: ["kambo", "sapo", "frog", "peptide", "purge", "immune"] },
  { title: "Rapeh (Hape)", href: "/psychedelic-readiness-index?m=rapeh", description: "Sacred tobacco snuff — grounding, clearing, ceremony opener", icon: "🌬️", tags: ["rapeh", "hape", "rapé", "snuff", "tobacco", "mapacho"] },
  { title: "Sananga Eye Drops", href: "/psychedelic-readiness-index?m=sananga", description: "Amazonian eye medicine — intense burn, visual clarity", icon: "👁️", tags: ["sananga", "eye drops", "tabernaemontana", "vision"] },
  { title: "Microdosing Protocol", href: "/psychedelic-readiness-index?m=microdose", description: "Sub-perceptual dosing — Fadiman protocol, Stamets stack", icon: "🔬", tags: ["microdose", "microdosing", "fadiman", "stamets", "stack", "protocol"] },
  { title: "Ceremonial Cannabis", href: "/psychedelic-readiness-index?m=cannabis", description: "Intentional high-dose cannabis — psychedelic threshold", icon: "🌿", tags: ["cannabis", "marijuana", "thc", "cbd", "ceremonial"] },
  { title: "Ceremonial Cacao", href: "/psychedelic-readiness-index?m=cacao", description: "Heart-opening theobromine — gentle ceremony, emotional processing", icon: "🫘", tags: ["cacao", "chocolate", "theobromine", "heart", "ceremony"] },
  { title: "Amanita muscaria", href: "/psychedelic-readiness-index?m=amanita", description: "Fly agaric mushroom — muscimol, GABA agonist, Siberian tradition", icon: "🍄", tags: ["amanita", "muscaria", "fly agaric", "muscimol", "gaba"] },
  { title: "Huachuma (San Pedro)", href: "/psychedelic-readiness-index?m=huachuma", description: "Mescaline cactus — 10-14 hour heart-centered journey", icon: "🌵", tags: ["huachuma", "san pedro", "echinopsis", "trichocereus", "mescaline"] },
  { title: "Salvia divinorum", href: "/psychedelic-readiness-index?m=salvia", description: "Kappa opioid agonist — intense 5-15 minute dissociative", icon: "🌿", tags: ["salvia", "divinorum", "salvinorin", "kappa", "mazatec"] },
  { title: "Yopo / Vilca", href: "/psychedelic-readiness-index?m=yopo", description: "DMT + 5-MeO-DMT snuff — Amazonian nasal insufflation", icon: "🌰", tags: ["yopo", "vilca", "anadenanthera", "bufotenin", "snuff"] },
  { title: "Lion's Mane Stack", href: "/psychedelic-readiness-index?m=lionsmane", description: "Neurotropic mushroom — NGF, BDNF, Stamets stack", icon: "🦁", tags: ["lions mane", "lion's mane", "hericium", "ngf", "bdnf", "stamets"] },
  { title: "Iboga Microdose", href: "/psychedelic-readiness-index?m=ibogamic", description: "Sub-flood whole plant — Bwiti maintenance dose", icon: "🌱", tags: ["iboga micro", "iboga microdose", "root bark", "sub-flood", "bwiti"] },
  { title: "Changa (Smokeable Aya)", href: "/psychedelic-readiness-index?m=changa", description: "DMT + MAOI herb blend — 20-45 minute experience", icon: "🌍", tags: ["changa", "smokeable", "dmt", "maoi", "julian palmer"] },
  { title: "Caapi Vine Alone", href: "/psychedelic-readiness-index?m=caapi", description: "Banisteriopsis caapi without DMT — gentle MAOI sedation", icon: "🌻", tags: ["caapi", "banisteriopsis", "vine", "maoi", "harmine"] },
  { title: "Vedic / Soma", href: "/psychedelic-readiness-index?m=soma", description: "Ancient Rigveda sacrament — identity debated", icon: "🌙", tags: ["soma", "vedic", "rigveda", "amanita", "ephedra"] },
  { title: "Mapacho (Sacred Tobacco)", href: "/psychedelic-readiness-index?m=mapacho", description: "Nicotiana rustica — 20x nicotine, Amazonian master plant", icon: "💫", tags: ["mapacho", "sacred tobacco", "nicotiana rustica", "grounding"] },
  // PRI Kava Encyclopedia
  { title: "PRI Kava Encyclopedia", href: "/kava", description: "The definitive kava resource — origins, science, interactions, assessment, products, certification", icon: "🥥", tags: ["kava", "pri kava", "piper methysticum", "kavalactone", "noble kava", "awa", "yaqona", "sakau", "pacific", "ceremony"] },
  { title: "Kava Island Origins", href: "/kava/origins", description: "3,000 years of kava across the Pacific — Vanuatu, Fiji, Tonga, Samoa, Hawaii, Pohnpei", icon: "🏝️", tags: ["kava origins", "vanuatu", "fiji", "tonga", "samoa", "hawaii", "pohnpei", "pacific", "polynesian"] },
  { title: "Kava Drug Interactions", href: "/kava/interactions", description: "24 substance interactions — CYP450 inhibition, severity matrix, wash-out timelines", icon: "⚠️", tags: ["kava interaction", "cyp450", "cyp1a2", "alcohol kava", "benzodiazepine", "ssri", "liver", "hepatotoxicity"] },
  { title: "Kavalactone Science", href: "/kava/science", description: "6 kavalactones decoded — kavain, DHK, methysticin, DHM, yangonin, DMY with chemotype decoder", icon: "🔬", tags: ["kavalactone", "kavain", "dihydrokavain", "methysticin", "yangonin", "chemotype", "cultivar", "gaba"] },
  { title: "PRI Kava Assessment", href: "/kava/assessment", description: "Five-domain kava readiness scoring — 0 to 100 with ceremony clearance", icon: "📋", tags: ["kava assessment", "kava readiness", "pri kava", "ceremony clearance", "kava score"] },
  { title: "Hawaii ICE Crisis & Awa", href: "/kava/hawaii", description: "Hawaii's meth crisis meets awa recovery — pharmacological alignment, cultural argument", icon: "🌺", tags: ["hawaii", "ice", "meth", "awa", "harm reduction", "native hawaiian", "cultural recovery"] },
  { title: "Kava Myths Debunked", href: "/kava/myths", description: "7 myths examined against WHO data and 3,000 years of traditional use", icon: "🔍", tags: ["kava myth", "kava liver", "kava safety", "kava ban", "noble vs tudei"] },
  { title: "Kava & Caffeine", href: "/kava/caffeine", description: "CYP1A2 inhibition, hippie speedball, ceremony cutoff protocol", icon: "☕", tags: ["kava caffeine", "cyp1a2", "hippie speedball", "coffee kava", "stimulant"] },
  { title: "Kava Product Index", href: "/kava/products", description: "Ceremonial powders, fresh frozen, RTD, supplements, kava bars with PRI ratings", icon: "🛒", tags: ["kava product", "buy kava", "kava powder", "kava bar", "kava supplement"] },
  { title: "Kava Facilitator Certification", href: "/kava/certification", description: "12-module, 80-hour certification — three tiers from Practitioner to Master", icon: "🎓", tags: ["kava certification", "kava facilitator", "kava training", "kava course"] },
  // Psychedelic Facilitator Index
  { title: "The Facilitator Index — Know Who You Go With", href: "/facilitator-index", description: "Invitation-only, anonymous, philosophy-first instrument for psychedelic practitioners and guides. 108 items across twelve bands. Companion to the Psychedelic Readiness Index.", icon: "🧭", tags: ["facilitator index", "facilitator", "psychedelic facilitator", "guide", "psychedelic guide", "practitioner", "psychedelic practitioner", "know who you go with", "facilitator assessment", "facilitator philosophy", "facilitator ethics", "facilitator training", "facilitator certification", "facilitator map", "facilitator network", "facilitator vetting", "psychedelic", "pri companion", "twelve bands", "108 items", "practitioner instrument", "archetype", "threshold keeper", "integrative guide", "container", "supervision", "lineage", "consent", "safety", "integration", "reciprocity"] },
  /* ── Attention Theft Manifesto ── */
  { title: "Attention Theft Manifesto", href: "/attention-theft", description: "The crusade against the $997B attention theft economy", icon: "🔥", tags: ["attention theft", "manifesto", "spam", "crusade", "email", "noise cancel"] },
  { title: "Attention Economics", href: "/attention-theft/economics", description: "$997B annual cost — 23 minutes per interruption", icon: "📊", tags: ["attention economics", "spam cost", "productivity", "time theft"] },
  { title: "AI Blocker Finder", href: "/attention-theft/blocker-finder", description: "Find your personalized email defense tools", icon: "🛡️", tags: ["blocker", "spam filter", "email tools", "sanebox"] },
  { title: "Legal Database", href: "/attention-theft/legal", description: "CAN-SPAM, GDPR, CASL and the laws we need", icon: "⚖️", tags: ["legal", "can-spam", "gdpr", "anti-spam law"] },
  { title: "The 10 Weapons", href: "/attention-theft/weapons", description: "Ten weapons to fight attention theft", icon: "⚔️", tags: ["weapons", "fight spam", "email defense", "arsenal"] },
  { title: "Report A Spammer", href: "/attention-theft/report", description: "Public accountability — name the worst offenders", icon: "🚨", tags: ["report", "spammer", "accountability", "forward medical"] },
  { title: "Spamtoast — You've Been Reported", href: "/youve-been-reported", description: "The page spammers see when you forward their email", icon: "💀", tags: ["spamtoast", "spam toast", "youve been reported", "forward email", "anonymous", "enforcement"] },
];

// Use the shared search engine's blog index (includes TF-IDF density scoring, originalContent, updatedContent, lesson)
const BLOG_ITEMS = ENGINE_BLOG_ITEMS;

// Scoring functions are now imported from the shared searchEngine module
// scorePage, scoreBlog, extractSnippet — all use TF-IDF density ranking

/* ── Session ID for FauxTony ── */
function getDiscoverySessionId(): string {
  const KEY = "discoverySessionId";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = `disc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}

/* ── Rotating placeholder ── */
function useRotatingPlaceholder(questions: string[], intervalMs = 3500): string {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * questions.length));
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % questions.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [questions, intervalMs]);
  return questions[index];
}

/* ═══════════════════════════════════════════════════
   TONY AVATAR TRIGGER — replaces the search icon
   ═══════════════════════════════════════════════════ */
export function TonyAvatarTrigger({ isDark }: { isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState<string | undefined>();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setInitialQuestion(undefined);
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);

    // Listen for exit-intent open-fauxtony events
    const handleExitIntent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.question) {
        setInitialQuestion(detail.question);
      }
      setOpen(true);
    };
    window.addEventListener("open-fauxtony", handleExitIntent);

    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("open-fauxtony", handleExitIntent);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ask Tony — Search & Chat"
        style={{
          background: isDark ? "rgba(123, 63, 160,0.12)" : "rgba(74, 29, 107,0.06)",
          border: `1.5px solid ${isDark ? "rgba(123, 63, 160,0.25)" : "rgba(74, 29, 107,0.15)"}`,
          cursor: "pointer",
          color: isDark ? "#D4B96A" : "#8B6914",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 18px",
          borderRadius: 12,
          transition: "all 0.25s ease",
          minWidth: 170,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isDark ? "rgba(123, 63, 160,0.18)" : "rgba(74, 29, 107,0.1)";
          e.currentTarget.style.borderColor = isDark ? "rgba(123, 63, 160,0.4)" : "rgba(74, 29, 107,0.25)";
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isDark ? "rgba(123, 63, 160,0.12)" : "rgba(74, 29, 107,0.06)";
          e.currentTarget.style.borderColor = isDark ? "rgba(123, 63, 160,0.25)" : "rgba(74, 29, 107,0.15)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {/* Tony "T" monogram avatar */}
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8B6914, #D4B96A)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#0A0A10",
            flexShrink: 0,
          }}
        >
          T
        </span>
        <span
          className="hidden sm:inline"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.8rem",
            letterSpacing: "0.06em",
          }}
        >
          Ask Tony
        </span>
        <span
          className="hidden sm:inline"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            color: isDark ? "#666" : "#aaa",
            border: `1px solid ${isDark ? "#444" : "#ccc"}`,
            borderRadius: 5,
            padding: "1px 6px",
            marginLeft: 2,
          }}
        >
          ⌘K
        </span>
      </button>

      <AnimatePresence>
        {open && <DiscoveryPanel onClose={() => { setOpen(false); setInitialQuestion(undefined); }} initialQuestion={initialQuestion} />}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   HIGHLIGHT UTILITY — bold matching terms in text
   ═══════════════════════════════════════════════════ */
function highlightTerms(text: string, query: string): string {
  if (!query.trim() || !text) return text;
  const words = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .sort((a, b) => b.length - a.length); // longest first to avoid double-wrapping
  if (words.length === 0) return text;
  // Escape special regex chars
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.replace(
    pattern,
    '<mark style="background:rgba(212,185,106,0.35);color:#5a3e00;border-radius:2px;padding:0 1px;font-weight:700">$1</mark>'
  );
}

/* ═══════════════════════════════════════════════════
   DISCOVERY PANEL — dual mode: search + FauxTony
   ═══════════════════════════════════════════════════ */

type Mode = "search" | "chat" | "ai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function DiscoveryPanel({ onClose, initialQuestion }: { onClose: () => void; initialQuestion?: string }) {
  const [mode, setMode] = useState<Mode>(initialQuestion ? "chat" : "search");
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState(initialQuestion || "");
  const [sessionId] = useState(() => getDiscoverySessionId());
  const rotatingQuestion = useRotatingPlaceholder(SUGGESTED_QUESTIONS);

  // Shuffled suggestion chips (pick 6 random ones)
  const [suggestionChips] = useState(() => {
    const shuffled = [...SUGGESTED_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  });

  // ── Category filter ──
  type FilterTab = "all" | "pages" | "assessments" | "coffee" | "psychedelics";
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  // Reset filter when query changes
  useEffect(() => { setActiveFilter("all"); }, [query]);

  // ── Recent searches (persisted in localStorage) ──
  const RECENT_KEY = "tony_recent_searches";
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      return stored ? JSON.parse(stored).slice(0, 6) : [];
    } catch { return []; }
  });

  const addRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, 6);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try { localStorage.removeItem(RECENT_KEY); } catch {}
  };

  // Popular topics — curated for Tony's content
  const POPULAR_TOPICS = [
    { label: "Psychedelic Medicine", query: "psychedelic" },
    { label: "AI & Enterprise", query: "AI enterprise" },
    { label: "ImpactSoul Tokens", query: "ImpactSoul token" },
    { label: "Peptides & Longevity", query: "peptide" },
    { label: "Consumer Advocacy", query: "crusade" },
    { label: "Consciousness Scale", query: "consciousness" },
    { label: "RampRate & Sourcing", query: "RampRate" },
    { label: "Find My Purpose", query: "dharma" },
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (mode === "search") inputRef.current?.focus();
    else chatInputRef.current?.focus();
  }, [mode]);

  // Debounce query for server-side search (300ms)
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    if (!query.trim()) { setDebouncedQuery(""); return; }
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Server-side full-text search (fires after debounce)
  const serverSearch = trpc.search.query.useQuery(
    { q: debouncedQuery, limit: 25 },
    { enabled: debouncedQuery.length >= 2, staleTime: 60000, retry: false }
  );

  // ── AI Search state ──
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<{ answer: string; sources: Array<{ title: string; path: string }> } | null>(null);
  const aiSearch = trpc.search.aiSearch.useMutation({
    onSuccess: (data) => setAiAnswer(data),
  });

  const handleAiSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || aiSearch.isPending) return;
    setAiQuestion(trimmed);
    setAiAnswer(null);
    setMode("ai");
    addRecentSearch(trimmed);
    aiSearch.mutate({ question: trimmed });
  };

  // Instant client-side results (immediate feedback while typing)
  const clientResults = useMemo(() => {
    if (!query.trim()) {
      return { pages: PAGES.slice(0, 5), posts: BLOG_ITEMS.slice(0, 3) };
    }
    const q = query.trim();
    const matchedPages = PAGES
      .map((p) => ({ ...p, score: scorePage(q, p) }))
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);
    const matchedPosts = BLOG_ITEMS
      .map((p) => ({ ...p, score: scoreBlog(q, p), snippet: extractSnippet(p.content, q) }))
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    return { pages: matchedPages, posts: matchedPosts };
  }, [query]);

  // Merge server results with client results for comprehensive coverage
  const results = useMemo(() => {
    if (!query.trim()) return clientResults;

    if (serverSearch.data && serverSearch.data.results.length > 0) {
      const serverResults = serverSearch.data.results;
      const existingPaths = new Set([
        ...clientResults.pages.map((p: any) => p.href),
        ...clientResults.posts.map((p: any) => p.href),
      ]);

      const serverPages: any[] = [];
      const serverPosts: any[] = [];

      for (const sr of serverResults) {
        if (existingPaths.has(sr.path)) continue;
        existingPaths.add(sr.path);
        const item = {
          title: sr.title,
          href: sr.path,
          description: sr.excerpt || sr.snippet || "",
          category: sr.subcategory || sr.category,
          tags: sr.tags ? sr.tags.split(", ") : [],
          score: sr.score,
        };
        if (sr.category === "blog") {
          serverPosts.push(item);
        } else {
          serverPages.push(item);
        }
      }

      return {
        pages: [...clientResults.pages, ...serverPages],
        posts: [...clientResults.posts, ...serverPosts].slice(0, 15),
      };
    }

    return clientResults;
  }, [query, clientResults, serverSearch.data]);

  const allResults = useMemo(() => [...results.pages, ...results.posts], [results]);

  // ── Apply category filter to results ──
  const filteredResults = useMemo(() => {
    if (activeFilter === "all") return results;
    const filterPages = (pages: any[]) => {
      switch (activeFilter) {
        case "assessments":
          return pages.filter((p: any) =>
            p.href?.includes("/find-") ||
            p.href?.includes("/life-assessment") ||
            p.href?.includes("/self-portrait") ||
            p.href?.includes("/soulscore") ||
            p.href?.includes("/flow-circuit") ||
            p.href?.includes("/humanos") ||
            (p.tags || []).some((t: string) => ["assessment", "quiz", "find my", "find your"].some((k) => t.includes(k)))
          );
        case "coffee":
          return pages.filter((p: any) =>
            p.href?.includes("/brewsoul") ||
            (p.tags || []).some((t: string) => ["coffee", "brewsoul", "espresso", "brew"].some((k) => t.includes(k)))
          );
        case "psychedelics":
          return pages.filter((p: any) =>
            p.href?.includes("/psychedelic") ||
            p.href?.includes("/kava") ||
            p.href?.includes("/iboga") ||
            p.href?.includes("/peyote") ||
            p.href?.includes("/facilitator-index") ||
            p.href?.includes("/the-philosophy") ||
            (p.tags || []).some((t: string) => ["psychedelic", "psilocybin", "mdma", "ketamine", "kava", "iboga"].some((k) => t.includes(k)))
          );
        case "pages":
          return pages.filter((p: any) =>
            !p.href?.includes("/find-") &&
            !p.href?.includes("/brewsoul") &&
            !p.href?.includes("/psychedelic") &&
            !p.href?.includes("/kava") &&
            !p.href?.includes("/iboga") &&
            !p.href?.includes("/peyote")
          );
        default: return pages;
      }
    };
    const filterPosts = (posts: any[]) => {
      switch (activeFilter) {
        case "pages": return []; // pages only
        case "assessments": return []; // assessments are pages
        case "coffee":
          return posts.filter((p: any) =>
            (p.category || "").toLowerCase().includes("coffee") ||
            (p.tags || []).some((t: string) => ["coffee", "brewsoul", "espresso"].some((k) => t.includes(k)))
          );
        case "psychedelics":
          return posts.filter((p: any) =>
            (p.category || "").toLowerCase().includes("psychedelic") ||
            (p.tags || []).some((t: string) => ["psychedelic", "psilocybin", "mdma", "ketamine", "kava", "iboga", "medicine"].some((k) => t.includes(k)))
          );
        default:
          return posts;
      }
    };
    return {
      pages: filterPages(results.pages),
      posts: filterPosts(results.posts),
    };
  }, [results, activeFilter]);

  const filteredAllResults = useMemo(
    () => [...filteredResults.pages, ...filteredResults.posts],
    [filteredResults]
  );

  useEffect(() => { setSelectedIndex(0); }, [query]);

  const goTo = useCallback((href: string, external?: boolean) => {
    onClose();
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      navigate(href);
    }
  }, [onClose, navigate]);

  // FauxTony mutation
  const askMutation = trpc.fauxTony.ask.useMutation({
    onSuccess: (data) => {
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    },
    onError: () => {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "FauxTony hit a snag. Try again — persistence is underrated." },
      ]);
    },
  });

  const handleAsk = (question: string) => {
    if (!question.trim() || askMutation.isPending) return;
    const q = question.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: q }]);
    askMutation.mutate({
      question: q,
      sessionId,
      conversationHistory: chatMessages.slice(-6),
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredAllResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredAllResults[selectedIndex]) {
        if (query.trim()) addRecentSearch(query);
        goTo(filteredAllResults[selectedIndex].href, (filteredAllResults[selectedIndex] as any).external);
      } else if (query.trim()) {
        // No search results — switch to chat mode with the query
        addRecentSearch(query);
        setMode("chat");
        handleAsk(query);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Tab") {
      e.preventDefault();
      setMode(mode === "search" ? "chat" : "search");
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk(chatInput);
    } else if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Tab" && !chatInput.trim()) {
      e.preventDefault();
      setMode("search");
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  let itemIndex = -1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center sm:items-center"
      style={{
        background: "rgba(10,10,16,0.65)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "0",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 4 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="tony-discovery-panel"
        style={{
          position: "relative",
          background: "#FAFAF7",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* ── Mode tabs ── */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgba(74, 29, 107,0.1)",
            background: "rgba(245,240,230,0.5)",
          }}
        >
          <button
            onClick={() => setMode("search")}
            style={{
              flex: 1,
              padding: "14px 16px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: mode === "search" ? "#8B6914" : "#999",
              background: mode === "search" ? "rgba(74, 29, 107,0.06)" : "transparent",
              borderBottom: mode === "search" ? "2px solid #8B6914" : "2px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Search size={15} /> Search
          </button>
          <button
            onClick={() => setMode("ai")}
            style={{
              flex: 1,
              padding: "14px 16px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: mode === "ai" ? "#8B6914" : "#999",
              background: mode === "ai" ? "rgba(74, 29, 107,0.06)" : "transparent",
              borderBottom: mode === "ai" ? "2px solid #8B6914" : "2px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Brain size={15} /> Ask AI
          </button>
          <button
            onClick={() => setMode("chat")}
            style={{
              flex: 1,
              padding: "14px 16px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: mode === "chat" ? "#8B6914" : "#999",
              background: mode === "chat" ? "rgba(74, 29, 107,0.06)" : "transparent",
              borderBottom: mode === "chat" ? "2px solid #8B6914" : "2px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8B6914, #D4B96A)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "#0A0A10",
              }}
            >
              T
            </span>
            Ask FauxTony
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "14px 16px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: "#999",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── SEARCH MODE ── */}
        {mode === "search" && (
          <>
            {/* Search input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 20px",
                borderBottom: "1px solid rgba(74, 29, 107,0.08)",
              }}
            >
              <Search size={18} style={{ color: "#8B6914", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search pages, essays, projects..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "1.1rem",
                  color: "#1a1a1a",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4, display: "flex" }}
                >
                  <X size={16} />
                </button>
              )}
              {query.trim() && (
                <button
                  onClick={() => handleAiSearch(query)}
                  title="Ask AI about this"
                  style={{
                    background: "linear-gradient(135deg, #8B6914, #D4B96A)",
                    border: "none",
                    borderRadius: 8,
                    padding: "5px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    flexShrink: 0,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase" as const,
                    color: "#0A0A10",
                    fontWeight: 700,
                  }}
                >
                  <Brain size={13} /> Ask AI
                </button>
              )}
              <kbd
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  color: "#999",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  padding: "2px 6px",
                  flexShrink: 0,
                }}
              >
                TAB → Chat
              </kbd>
            </div>

            {/* ── Category filter tabs (shown when there is a query) ── */}
            {query.trim() && (
              <div style={{
                display: "flex",
                gap: 4,
                padding: "8px 16px",
                borderBottom: "1px solid rgba(74, 29, 107,0.08)",
                overflowX: "auto",
                flexShrink: 0,
              }}>
                {(["all", "pages", "assessments", "coffee", "psychedelics"] as const).map((tab) => {
                  const labels: Record<string, string> = {
                    all: "All",
                    pages: "Pages",
                    assessments: "Assessments",
                    coffee: "Coffee",
                    psychedelics: "Psychedelics",
                  };
                  const isActive = activeFilter === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 20,
                        border: isActive ? "1.5px solid #8B6914" : "1.5px solid rgba(74, 29, 107,0.15)",
                        background: isActive ? "rgba(139,105,20,0.1)" : "transparent",
                        cursor: "pointer",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                        color: isActive ? "#8B6914" : "#999",
                        whiteSpace: "nowrap" as const,
                        transition: "all 0.15s ease",
                        fontWeight: isActive ? 700 : 400,
                      }}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Results */}
            <div
              ref={listRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "8px 0",
              }}
            >
              {filteredAllResults.length === 0 && query.trim() ? (
                <div style={{ padding: "28px 20px", textAlign: "center" }}>
                  {/* Icon */}
                  <div style={{ fontSize: "2.2rem", marginBottom: 10 }}>🔍</div>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.05rem",
                    color: "#333",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}>
                    Nothing surfaced for &ldquo;{query}&rdquo;
                  </p>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.85rem",
                    color: "#999",
                    marginBottom: 20,
                  }}>
                    {activeFilter !== "all"
                      ? `Try switching to "All" or explore a different category.`
                      : "Try a different angle — or let FauxTony find it for you."}
                  </p>

                  {/* Alternative topic suggestions */}
                  {activeFilter === "all" && (
                    <div style={{ marginBottom: 20 }}>
                      <p style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#bbb",
                        marginBottom: 10,
                      }}>Maybe you meant —</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                        {POPULAR_TOPICS.slice(0, 6).map((topic) => (
                          <button
                            key={topic.label}
                            onClick={() => setQuery(topic.query)}
                            style={{
                              background: "rgba(139,105,20,0.06)",
                              border: "1px solid rgba(139,105,20,0.2)",
                              borderRadius: 20,
                              padding: "5px 14px",
                              cursor: "pointer",
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "0.8rem",
                              color: "#8B6914",
                            }}
                          >
                            {topic.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() => { setMode("chat"); handleAsk(query); setQuery(""); }}
                      style={{
                        background: "#0A0A10",
                        color: "#D4B96A",
                        border: "none",
                        borderRadius: 10,
                        padding: "11px 26px",
                        cursor: "pointer",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.78rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Sparkles size={14} /> Ask FauxTony Instead
                    </button>
                    <a
                      href="mailto:Tony@joyandwoe.com"
                      onClick={onClose}
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.72rem",
                        letterSpacing: "0.06em",
                        color: "#8B6914",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      ✉️ Contact Tony directly
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  {/* ── Recent Searches (shown only when no query) ── */}
                  {!query.trim() && recentSearches.length > 0 && (
                    <div style={{ padding: "8px 0 4px" }}>
                      <div style={{
                        padding: "4px 20px 6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}>
                        <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.68rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#999",
                        }}>Recent</span>
                        <button
                          onClick={clearRecentSearches}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.6rem",
                            color: "#bbb",
                            letterSpacing: "0.06em",
                            padding: "2px 4px",
                          }}
                        >CLEAR</button>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 20px 8px" }}>
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            style={{
                              background: "rgba(139,105,20,0.06)",
                              border: "1px solid rgba(139,105,20,0.15)",
                              borderRadius: 20,
                              padding: "4px 12px",
                              cursor: "pointer",
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "0.8rem",
                              color: "#8B6914",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <Search size={11} />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Popular Topics (shown only when no query) ── */}
                  {!query.trim() && (
                    <div style={{ padding: "4px 0 8px" }}>
                      <div style={{
                        padding: "4px 20px 8px",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#999",
                      }}>Popular Topics</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 20px 4px" }}>
                        {POPULAR_TOPICS.map((topic) => (
                          <button
                            key={topic.label}
                            onClick={() => setQuery(topic.query)}
                            style={{
                              background: "#0A0A10",
                              border: "none",
                              borderRadius: 20,
                              padding: "5px 14px",
                              cursor: "pointer",
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "0.78rem",
                              color: "#D4B96A",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {topic.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredResults.pages.length > 0 && (
                    <>
                      <div style={{
                        padding: "8px 20px 4px",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#999",
                      }}>
                        {query ? `Pages & Projects (${filteredResults.pages.length})` : "Quick Access"}
                      </div>
                      {filteredResults.pages.map((page) => {
                        itemIndex++;
                        const idx = itemIndex;
                        const highlightedTitle = query.trim()
                          ? highlightTerms(page.title, query)
                          : page.title;
                        const highlightedDesc = query.trim()
                          ? highlightTerms(page.description, query)
                          : page.description;
                        return (
                          <button
                            key={page.href}
                            data-index={idx}
                            onClick={() => goTo(page.href, (page as any).external)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              width: "100%",
                              padding: "10px 20px",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              background: selectedIndex === idx ? "rgba(74, 29, 107,0.08)" : "transparent",
                              transition: "background 0.1s ease",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontFamily: "'Source Sans 3', sans-serif",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                color: "#1a1a1a",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              dangerouslySetInnerHTML={{ __html: highlightedTitle + ((page as any).external ? ' <span style="font-size:0.7rem;color:#8B6914;margin-left:6px">↗</span>' : "") }}
                              />
                              <div style={{
                                fontFamily: "'Source Sans 3', sans-serif",
                                fontSize: "0.82rem",
                                color: "#888",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              dangerouslySetInnerHTML={{ __html: highlightedDesc }}
                              />
                            </div>
                            <span style={{ fontSize: "1.2rem", flexShrink: 0, width: 32, textAlign: "center" }}>
                              {(page as any).icon || "📄"}
                            </span>
                            <ArrowRight size={14} style={{ color: "#ccc", flexShrink: 0 }} />
                          </button>
                        );
                      })}
                    </>
                  )}

                  {filteredResults.posts.length > 0 && (
                    <>
                      <div style={{
                        padding: "12px 20px 4px",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#999",
                      }}>
                        {query ? `Essays (${filteredResults.posts.length})` : "Recent Essays"}
                      </div>
                      {filteredResults.posts.map((post) => {
                        itemIndex++;
                        const idx = itemIndex;
                        const snippet = (post as any).snippet;
                        const highlightedTitle = query.trim()
                          ? highlightTerms(post.title, query)
                          : post.title;
                        const highlightedSnippet = query.trim() && snippet
                          ? highlightTerms(snippet, query)
                          : snippet;
                        return (
                          <button
                            key={post.href}
                            data-index={idx}
                            onClick={() => goTo(post.href)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 12,
                              width: "100%",
                              padding: "10px 20px",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              background: selectedIndex === idx ? "rgba(74, 29, 107,0.08)" : "transparent",
                              transition: "background 0.1s ease",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontFamily: "'Source Sans 3', sans-serif",
                                fontSize: "0.92rem",
                                fontWeight: 600,
                                color: "#1a1a1a",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                              />
                              {highlightedSnippet ? (
                                <div
                                  style={{
                                    fontFamily: "'Source Sans 3', sans-serif",
                                    fontSize: "0.8rem",
                                    color: "#777",
                                    lineHeight: 1.4,
                                    marginTop: 2,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical" as const,
                                    overflow: "hidden",
                                  }}
                                  dangerouslySetInnerHTML={{ __html: highlightedSnippet }}
                                />
                              ) : post.category ? (
                                <span style={{
                                  fontFamily: "'DM Mono', monospace",
                                  fontSize: "0.68rem",
                                  color: "#8B6914",
                                  letterSpacing: "0.06em",
                                }}>
                                  {post.category}
                                </span>
                              ) : null}
                            </div>
                            <span style={{ fontSize: "0.9rem", flexShrink: 0, width: 28, textAlign: "center", color: "#8B6914", paddingTop: 2 }}>
                              ❆
                            </span>
                            <ArrowRight size={14} style={{ color: "#ccc", flexShrink: 0, marginTop: 4 }} />
                          </button>
                        );
                      })}
                    </>
                  )}
                </>
              )}

              {/* "See all results" link to full search page */}
              {query.trim() && filteredAllResults.length > 0 && (
                <div style={{ padding: "12px 20px", textAlign: "center", borderTop: "1px solid rgba(74, 29, 107,0.08)", marginTop: 8 }}>
                  <button
                    onClick={() => { onClose(); navigate(`/search?q=${encodeURIComponent(query)}`); }}
                    style={{
                      background: "#0A0A10",
                      color: "#D4B96A",
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 24px",
                      cursor: "pointer",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Search size={13} /> See All Results
                  </button>
                  <br />
                  <button
                    onClick={() => { setMode("chat"); setChatInput(query); setQuery(""); }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      letterSpacing: "0.06em",
                      color: "#8B6914",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 4,
                    }}
                  >
                    <Sparkles size={13} /> Or ask FauxTony <ChevronRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── AI SEARCH MODE ── */}
        {mode === "ai" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* AI search input */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 20px",
              borderBottom: "1px solid rgba(74, 29, 107,0.08)",
            }}>
              <Brain size={18} style={{ color: "#8B6914", flexShrink: 0 }} />
              <input
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAiSearch(aiQuestion);
                  } else if (e.key === "Escape") {
                    onClose();
                  }
                }}
                placeholder="Ask anything about Tony's work..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "1.1rem",
                  color: "#1a1a1a",
                }}
              />
              <button
                onClick={() => handleAiSearch(aiQuestion)}
                disabled={!aiQuestion.trim() || aiSearch.isPending}
                style={{
                  background: aiQuestion.trim() && !aiSearch.isPending ? "linear-gradient(135deg, #8B6914, #D4B96A)" : "#eee",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 16px",
                  cursor: aiQuestion.trim() && !aiSearch.isPending ? "pointer" : "default",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: aiQuestion.trim() && !aiSearch.isPending ? "#0A0A10" : "#aaa",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                {aiSearch.isPending ? (
                  <><span style={{ display: "inline-block", animation: "spin 1s linear infinite", fontSize: "0.9rem" }}>⟳</span> Thinking</>
                ) : (
                  <><Brain size={13} /> Ask</>  
                )}
              </button>
            </div>

            {/* AI answer area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {aiSearch.isPending && !aiAnswer && (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8B6914, #D4B96A)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    animation: "ai-pulse 1.5s ease-in-out infinite",
                  }}>
                    <Brain size={20} style={{ color: "#0A0A10" }} />
                  </div>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.9rem",
                    color: "#888",
                  }}>Searching Tony's knowledge base...</p>
                </div>
              )}

              {aiSearch.isError && (
                <div style={{
                  padding: "20px",
                  background: "rgba(139,105,20,0.06)",
                  borderRadius: 12,
                  border: "1px solid rgba(139,105,20,0.15)",
                  textAlign: "center",
                }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#c0392b" }}>
                    Something went wrong. Try again or <button onClick={() => setMode("chat")} style={{ background: "none", border: "none", cursor: "pointer", color: "#8B6914", fontWeight: 600, padding: 0 }}>ask FauxTony</button>.
                  </p>
                </div>
              )}

              {aiAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Question echo */}
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color: "#8B6914",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
                    <Brain size={13} /> {aiQuestion}
                  </div>

                  {/* Answer */}
                  <div style={{
                    background: "rgba(245,240,230,0.7)",
                    border: "1px solid rgba(139,105,20,0.15)",
                    borderRadius: 12,
                    padding: "16px 18px",
                    marginBottom: 16,
                  }}>
                    <div className="ai-answer-body">
                      <Streamdown>{aiAnswer.answer}</Streamdown>
                    </div>
                  </div>

                  {/* Source links */}
                  {aiAnswer.sources.length > 0 && (
                    <div>
                      <div style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        color: "#bbb",
                        marginBottom: 8,
                      }}>Relevant Pages</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {aiAnswer.sources.map((src) => (
                          <button
                            key={src.path}
                            onClick={() => { onClose(); navigate(src.path); }}
                            style={{
                              background: "#0A0A10",
                              border: "none",
                              borderRadius: 20,
                              padding: "5px 14px",
                              cursor: "pointer",
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "0.8rem",
                              color: "#D4B96A",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            {src.title} <ArrowRight size={11} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ask FauxTony for more */}
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(74, 29, 107,0.08)", display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => { setAiQuestion(""); setAiAnswer(null); }}
                      style={{
                        background: "none",
                        border: "1.5px solid rgba(139,105,20,0.3)",
                        borderRadius: 8,
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase" as const,
                        color: "#8B6914",
                      }}
                    >
                      Ask Another
                    </button>
                    <button
                      onClick={() => { setMode("chat"); setChatInput(aiQuestion); }}
                      style={{
                        background: "#0A0A10",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase" as const,
                        color: "#D4B96A",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Sparkles size={13} /> Go Deeper with FauxTony
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Pre-search state — suggested questions */}
              {!aiSearch.isPending && !aiAnswer && !aiSearch.isError && (
                <div>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.1rem",
                    color: "#333",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}>Ask anything about Tony's work</p>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.85rem",
                    color: "#888",
                    marginBottom: 20,
                  }}>Natural language questions — answered using Tony's full site content and essays.</p>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: "#bbb",
                    marginBottom: 10,
                  }}>Try asking —</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      "What does Tony think about psychedelic medicine?",
                      "Where can I find Tony's essays on enterprise technology?",
                      "What is the Psychedelic Readiness Index?",
                      "How does Tony evaluate peptide suppliers?",
                      "What is ImpactSoul and how does tokenization work?",
                      "Where can I take a self-discovery assessment?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => { setAiQuestion(q); handleAiSearch(q); }}
                        style={{
                          background: "rgba(245,240,230,0.7)",
                          border: "1px solid rgba(139,105,20,0.12)",
                          borderRadius: 10,
                          padding: "10px 14px",
                          cursor: "pointer",
                          textAlign: "left" as const,
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.85rem",
                          color: "#333",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          transition: "background 0.15s ease",
                        }}
                      >
                        <Brain size={13} style={{ color: "#8B6914", flexShrink: 0 }} />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CHAT MODE ── */}
        {mode === "chat" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Chat messages area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 20px",
              }}
            >
              {chatMessages.length === 0 ? (
                <div>
                  {/* Welcome */}
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #8B6914, #D4B96A)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        color: "#0A0A10",
                        margin: "0 auto 12px",
                      }}
                    >
                      T
                    </div>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "#1a1a1a",
                      marginBottom: 6,
                    }}>
                      Ask FauxTony anything
                    </p>
                    <p style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.88rem",
                      color: "#888",
                      maxWidth: 420,
                      margin: "0 auto",
                      lineHeight: 1.5,
                    }}>
                      Enterprise tech, psychedelic medicine, water quality, investments, health protocols, tokenization, or life advice.
                    </p>
                  </div>

                  {/* Suggestion chips */}
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    justifyContent: "center",
                  }}>
                    {suggestionChips.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleAsk(q)}
                        style={{
                          background: "white",
                          border: "1px solid #e8e4dc",
                          borderRadius: 20,
                          padding: "8px 14px",
                          cursor: "pointer",
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.82rem",
                          color: "#444",
                          transition: "all 0.15s ease",
                          maxWidth: "100%",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#8B6914";
                          e.currentTarget.style.background = "#fefdfb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e8e4dc";
                          e.currentTarget.style.background = "white";
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          maxWidth: msg.role === "user" ? "80%" : "92%",
                          padding: msg.role === "user" ? "10px 16px" : "14px 18px",
                          borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                          background: msg.role === "user" ? "#0A0A10" : "white",
                          color: msg.role === "user" ? "#FAFAF7" : "#1a1a1a",
                          border: msg.role === "user" ? "none" : "1px solid #e8e4dc",
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.95rem",
                          lineHeight: 1.7,
                        }}
                      >
                        {msg.role === "assistant" ? (
                          <div>
                            <p style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.65rem",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#8B6914",
                              marginBottom: 8,
                            }}>
                              FauxTony
                            </p>
                            <Streamdown>{msg.content}</Streamdown>
                          </div>
                        ) : msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Loading */}
                  {askMutation.isPending && (
                    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 14 }}>
                      <div style={{
                        padding: "14px 18px",
                        borderRadius: "14px 14px 14px 4px",
                        background: "white",
                        border: "1px solid #e8e4dc",
                      }}>
                        <p style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#8B6914",
                          marginBottom: 6,
                        }}>
                          FauxTony
                        </p>
                        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                          {[0, 1, 2].map((d) => (
                            <div
                              key={d}
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: "#8B6914",
                                opacity: 0.4,
                                animation: `discPulse 1.4s ease-in-out ${d * 0.2}s infinite`,
                              }}
                            />
                          ))}
                          <style>{`
                            @keyframes discPulse {
                              0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
                              40% { opacity: 1; transform: scale(1.1); }
                            }
                          `}</style>
                          <span style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontSize: "0.85rem",
                            color: "#888",
                            marginLeft: 6,
                          }}>
                            Thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Chat input */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid rgba(74, 29, 107,0.1)",
                background: "rgba(245,240,230,0.3)",
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
              }}
            >
              <textarea
                ref={chatInputRef}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKeyDown}
                placeholder={rotatingQuestion}
                rows={1}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  resize: "none",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  color: "#1a1a1a",
                  background: "transparent",
                  minHeight: 24,
                  maxHeight: 100,
                }}
              />
              <button
                onClick={() => handleAsk(chatInput)}
                disabled={!chatInput.trim() || askMutation.isPending}
                style={{
                  background: chatInput.trim() ? "#0A0A10" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  cursor: chatInput.trim() ? "pointer" : "default",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {askMutation.isPending ? "..." : "Ask"}
              </button>
            </div>

            {/* Disclaimer */}
            <p style={{
              textAlign: "center",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.62rem",
              color: "#bbb",
              padding: "6px 16px 10px",
              letterSpacing: "0.04em",
            }}>
              FauxTony is an AI approximation. For the real thing, subscribe and reach out.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default DiscoveryPanel;
