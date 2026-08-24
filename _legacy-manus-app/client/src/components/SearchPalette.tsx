// cache-bust: 2026-08-03-facilitator-index
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, X, ArrowRight, FileText, MapPin, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import blogData from "@/data/blogData.json";
import { trpc } from "@/lib/trpc";

/* ── SEARCHABLE PAGES ── */
const PAGES = [
  { title: "Blog", href: "/", description: "92 essays spanning 15 years of enterprise tech, impact, and consciousness", icon: "📰", tags: ["blog", "essays", "writing", "articles"] },
  { title: "Start Here", href: "/start-here", description: "The five essays that tell you who Tony is and what he's about", icon: "🚪", tags: ["start", "begin", "intro", "first"] },
  { title: "About", href: "/about", description: "The full story — from enterprise tech to psychedelic medicine", icon: "👤", tags: ["about", "bio", "biography", "tony"] },
  { title: "The Letter", href: "/the-letter", description: "I have something to show you — the seven doors", icon: "✉️", tags: ["letter", "home", "doors", "seven"] },
  { title: "Walk Through", href: "/walk-through", description: "Step inside each of the seven doors", icon: "🚶", tags: ["walk", "doors", "explore", "tour"] },
  { title: "The Territory", href: "/the-territory", description: "The map of everything — heroes, influences, and the landscape", icon: "🗺️", tags: ["territory", "map", "heroes", "influences"] },
  { title: "Engine Room", href: "/engine-room", description: "The portfolio — every company, every thesis, every bet", icon: "⚙️", tags: ["engine", "portfolio", "companies", "investments"] },
  { title: "Under NDA", href: "/under-nda", description: "What happens behind closed doors", icon: "🔒", tags: ["nda", "confidential", "private", "deals"] },
  { title: "The Body", href: "/the-body", description: "Health, biohacking, and the vessel that carries everything", icon: "🧬", tags: ["body", "health", "biohacking", "wellness"] },
  { title: "The Nightstand", href: "/the-nightstand", description: "Books that shaped the thinking", icon: "📚", tags: ["books", "reading", "nightstand", "library"] },
  { title: "The Web", href: "/the-web", description: "The network of relationships and collaborations", icon: "🕸️", tags: ["web", "network", "connections", "relationships"] },
  { title: "Pick Up the Phone", href: "/pick-up-the-phone", description: "The lost art of the phone call — and how to reach Tony", icon: "📞", tags: ["phone", "contact", "call", "reach"] },
  { title: "Journeys", href: "/journeys", description: "Travel, psychedelic experiences, and consciousness exploration", icon: "✈️", tags: ["journeys", "travel", "psychedelic", "consciousness"] },
  { title: "Built by Tony G", href: "/recent-creations", description: "Things Tony has built recently", icon: "🔨", tags: ["built", "creations", "portfolio", "projects", "tony g"] },
  { title: "Intel", href: "/intel", description: "Deep dives into portfolio companies and competitive landscapes", icon: "🔍", tags: ["intel", "research", "analysis", "companies"] },
  { title: "The Open Door", href: "/the-open-door", description: "Testimonials, thought leaders, and the people who've been in the room", icon: "💬", tags: ["testimonials", "quotes", "open door", "thought leaders"] },
  { title: "The Index", href: "/the-index", description: "Every page, every section, every door — the complete map", icon: "📋", tags: ["index", "sitemap", "all pages", "directory"] },
  { title: "Ecosystem", href: "/ecosystem", description: "Join the ecosystem — from Spark to Builder to Amplifier", icon: "🌱", tags: ["ecosystem", "join", "subscribe", "community"] },
  { title: "Published", href: "/published", description: "Books, articles, and published works", icon: "📖", tags: ["published", "books", "articles", "writing"] },
  { title: "The Rolodex", href: "/clients", description: "25 years of clients — Microsoft, Disney, Goldman Sachs, Nike", icon: "📇", tags: ["clients", "rolodex", "companies", "customers"] },
  { title: "Series", href: "/series", description: "Multi-part essay series on specific topics", icon: "📑", tags: ["series", "multi-part", "deep dive"] },
  { title: "FauxTony", href: "/fauxtony", description: "Ask the AI version of Tony anything — 3 free questions", icon: "🤖", tags: ["ai", "fauxtony", "chat", "ask", "question"] },
  { title: "Framework", href: "/framework", description: "How I'd Approach Your Problem — the 5-step framework", icon: "🧩", tags: ["framework", "template", "approach", "methodology"] },
  { title: "Assessments", href: "/assessments", description: "Three research-backed tools: Dharma Finder, Consciousness Scale, Grant Study", icon: "◎", tags: ["assessments", "quiz", "dharma", "consciousness", "grant study", "purpose", "test"] },
  { title: "Dharma Finder", href: "/assessments/dharma-finder", description: "25 questions to discover your purpose — based on Schmachtenberger's inquiry", icon: "◎", tags: ["dharma", "purpose", "schmachtenberger", "quiz", "assessment", "meaning", "service"] },
  { title: "Consciousness Scale", href: "/assessments/consciousness-scale", description: "Map your consciousness level on Hawkins' calibrated scale", icon: "△", tags: ["consciousness", "hawkins", "awareness", "enlightenment", "scale", "level", "spiritual"] },
  { title: "Grant Study Assessment", href: "/assessments/grant-study", description: "Measure life satisfaction across 5 factors from Harvard's 85-year study", icon: "♡", tags: ["grant study", "harvard", "happiness", "satisfaction", "relationships", "wellbeing"] },
  { title: "Find My", href: "/find-my", description: "All assessments in one place — Find What's Yours", icon: "🔮", tags: ["find my", "assessments", "hub", "discover", "quiz"] },
  { title: "Find Your Peptide", href: "/find-your-peptide", description: "The Peptide Clarity Index™ — 7-axis clinical assessment with 16 archetypes", icon: "🧬", tags: ["peptide", "bpc-157", "semaglutide", "health", "biohacking", "assessment"] },
  { title: "Find My Stem Cells", href: "https://findmystem-s3lknc4h.manus.space/", description: "Global stem-cell clinic decision engine — assessment, ranked preview, pricing by country, Wall of Shame, and BBNBC scoring", icon: "🧫", tags: ["stem cells", "stem cell", "regenerative medicine", "cell therapy", "mesenchymal", "msc", "exosomes", "clinic", "clinic ranking", "pricing", "country pricing", "assessment", "bbnbc", "wall of shame"], external: true },
  { title: "Peptide Hall of Shame", href: "/peptide-hall-of-shame", description: "20 US peptide providers audited on 6 clinical criteria — average score 95/100 (worst)", icon: "🏚️", tags: ["peptide", "hall of shame", "audit", "clinic", "questionnaire", "ranking"] },
  { title: "Where Does Your Peptide Dollar Go?", href: "/peptide-supply-chain", description: "Supply chain transparency — see where your money goes: manufacturing, marketing, or profit", icon: "💰", tags: ["peptide", "supply chain", "cost", "dollar", "transparency", "credibility"] },
  { title: "Peptide Review-Evidence Matrix", href: "/peptide-matrix", description: "Interactive scatter plot: 5-star reviews ≠ FDA-approved efficacy. See where every entity falls.", icon: "📉", tags: ["peptide", "matrix", "reviews", "evidence", "danger zone", "scatter plot", "FDA"] },
  { title: "Peptide Literacy Quiz (25 Questions)", href: "/quiz_25q", description: "Test your peptide knowledge across 5 dimensions: Science Literacy, Red Flag Detection, Provider Evaluation, Regulatory Awareness, Personal Risk.", icon: "📝", tags: ["peptide", "quiz", "25 questions", "literacy", "test", "assessment", "red flag", "FDA", "science"] },
  { title: "Find Your Sexuality", href: "/find-your-sexuality", description: "A thoughtful exploration of sexual identity across multiple dimensions", icon: "🌈", tags: ["sexuality", "identity", "lgbtq", "spectrum", "assessment", "kinsey"] },
  { title: "Find Your Me", href: "/find-your-me", description: "Clarity on identity and direction — values, strengths, and alignment", icon: "🪞", tags: ["me", "identity", "values", "strengths", "alignment", "purpose", "assessment", "find your"] },
  { title: "Find Your Coffee", href: "/find-your-coffee", description: "Your perfect cup, decoded — 15 questions across 6 dimensions", icon: "☕", tags: ["coffee", "espresso", "latte", "brew", "caffeine", "cup", "assessment", "find your"] },
  { title: "Find Your Diet", href: "/find-your-diet", description: "Food philosophy matching — discover your ideal nutritional approach", icon: "🥗", tags: ["diet", "food", "nutrition", "eating", "vegan", "keto", "paleo", "assessment", "find your"] },
  { title: "Find Your Movement", href: "/find-your-movement", description: "Exercise and fitness style matching — find what moves you", icon: "🏃", tags: ["movement", "exercise", "fitness", "workout", "gym", "yoga", "running", "assessment", "find your"] },
  { title: "Find Your Sleep", href: "/find-your-sleep", description: "Sleep optimization assessment — unlock better rest", icon: "🌙", tags: ["sleep", "rest", "insomnia", "circadian", "nap", "assessment", "find your"] },
  { title: "Find Your Therapy", href: "/find-your-therapy", description: "Match with the right therapeutic modality for your needs", icon: "🧠", tags: ["therapy", "therapist", "mental health", "counseling", "cbt", "psychotherapy", "assessment", "find your"] },
  { title: "Find Your Spirit", href: "/find-your-spirit", description: "Discover your spiritual archetype and path", icon: "✨", tags: ["spirit", "spiritual", "meditation", "mindfulness", "archetype", "assessment", "find your"] },
  { title: "Find Your Religion", href: "/find-your-religion", description: "Philosophical and spiritual alignment assessment", icon: "🕊️", tags: ["religion", "faith", "belief", "philosophy", "spiritual", "assessment", "find your"] },
  { title: "Find Your Sake", href: "/find-your-sake", description: "Japanese rice wine preference profile", icon: "🍶", tags: ["sake", "japanese", "rice wine", "nihonshu", "assessment", "find your"] },
  { title: "Find Your Kitchen", href: "/find-your-kitchen", description: "Cooking style assessment — discover your culinary identity", icon: "🍳", tags: ["kitchen", "cooking", "chef", "culinary", "food", "recipe", "assessment", "find your"] },
  { title: "Find Your Style", href: "/find-your-style", description: "Personal fashion and aesthetic identity assessment", icon: "👔", tags: ["style", "fashion", "clothing", "aesthetic", "wardrobe", "assessment", "find your"] },
  { title: "Find Your Attachment Style", href: "/find-your-attachment-style", description: "Attachment theory assessment — understand your relational patterns", icon: "🔗", tags: ["attachment", "attachment style", "anxious", "avoidant", "secure", "relationships", "assessment", "find your"] },
  { title: "Find Your Love Language", href: "/find-your-love-language", description: "Love language assessment — discover how you give and receive love", icon: "💬", tags: ["love language", "love", "relationships", "chapman", "assessment", "find your"] },
  { title: "Find Your Love", href: "https://intimacyassess-tcir3hon.manus.space", description: "Relational alignment framework — compatibility and pattern analysis", icon: "💕", tags: ["love", "intimacy", "relationships", "compatibility", "assessment", "find your"] },
  { title: "Find Your Team", href: "/flow-circuit", description: "Collaboration and leadership style assessment", icon: "🤝", tags: ["team", "collaboration", "leadership", "management", "assessment", "find your"] },
  { title: "SoulScore", href: "/soulscore", description: "Impact verification and scoring — blockchain-verified impact certificates", icon: "◉", tags: ["soulscore", "impact", "soul", "score", "verification", "blockchain", "certificate", "esg"] },
  { title: "Charity Scorecard", href: "/charity-scorecard", description: "Evaluate charities across transparency, impact, and efficiency metrics", icon: "📊", tags: ["charity", "scorecard", "nonprofit", "donation", "philanthropy", "impact", "evaluation"] },
  { title: "Life Assessment", href: "/life-assessment", description: "Comprehensive life satisfaction assessment across all dimensions", icon: "🎯", tags: ["life", "assessment", "satisfaction", "mirror", "reflection", "comprehensive"] },
  { title: "Self-Portrait", href: "/self-portrait", description: "Your composite identity map — unified radar chart across all assessments", icon: "🎨", tags: ["self portrait", "composite", "radar", "identity", "map", "all assessments"] },
  { title: "Sake Guide", href: "https://sakeguide-sqt7xzxp.manus.space/", description: "The definitive guide to sake — history, brewing, tasting, and the soul of Japanese rice wine", icon: "🍶", tags: ["sake", "japan", "japanese", "rice wine", "brewing", "tasting", "nihonshu", "drink", "alcohol", "guide"] },
  { title: "Supplier Application", href: "/supplier-intake", description: "Apply to become a verified peptide supply partner — short 3-step qualification form, no uploads required", icon: "📋", tags: ["vendor", "supplier", "application", "intake", "peptide", "supply", "partner", "apply", "stage 1"] },
  { title: "AI Ethics Manifesto", href: "/blog/the-restaurant-with-no-menu-prices-ai-ethics-manifesto", description: "Zuck: Fix This Now — $1,520 refund demand, Meta's $10B+ liability rap sheet, and a blueprint for ethical AI billing", icon: "⚖️", tags: ["ai", "ethics", "billing", "manus", "meta", "zuckerberg", "pricing", "credits", "fairness", "living-declaration", "ftc", "refund"] },
  // BrewSoul Coffee Intelligence
  { title: "BrewSoul", href: "/brewsoul", description: "Coffee intelligence platform — 103 coffees scored, 100 chains ranked, 6 identity archetypes", icon: "☕", tags: ["brewsoul", "coffee", "espresso", "beans", "roast", "brew", "caffeine", "latte", "cappuccino", "pour over"] },
  { title: "Chain Rankings", href: "/brewsoul/chains", description: "100 coffee chains ranked S through F tier — Starbucks, Blue Bottle, Intelligentsia, and more", icon: "🏪", tags: ["chain", "starbucks", "dunkin", "blue bottle", "intelligentsia", "peets", "counter culture", "ranking", "coffee chain"] },
  { title: "Coffee Prescription", href: "/brewsoul/prescription", description: "AI-powered coffee recommendations matched to your BrewSoul identity", icon: "💊", tags: ["prescription", "recommend", "coffee recommendation", "what coffee", "best coffee", "suggest"] },
  { title: "Browse Coffees", href: "/brewsoul/browse", description: "All 103 coffees with cupping scores, flavor profiles, and QPR ratings", icon: "📊", tags: ["browse", "catalog", "coffees", "cupping", "score", "rating"] },
  { title: "Wall of Shame (Coffee)", href: "/brewsoul/wall-of-shame", description: "Coffee fraud, greenwashing, and commodity deception exposed", icon: "🚩", tags: ["shame", "fraud", "greenwash", "bad coffee", "fake", "commodity"] },
  { title: "Follow The Dollar (Coffee)", href: "/brewsoul/follow-the-dollar", description: "Where your coffee dollar actually goes — supply chain economics", icon: "💵", tags: ["dollar", "supply chain", "fair trade", "farmer", "economics", "sourcing", "coffee"] },
  { title: "Coffee Varieties", href: "/brewsoul/varieties", description: "25 coffee varieties with genetics, cup profiles, and rarity", icon: "🌿", tags: ["variety", "gesha", "bourbon", "typica", "sl28", "caturra", "genetics", "coffee"] },
  { title: "Coffee Processing", href: "/brewsoul/processing", description: "Natural, washed, anaerobic, honey — processing methods explained", icon: "🧪", tags: ["processing", "natural", "washed", "anaerobic", "honey", "fermentation", "coffee"] },
  { title: "Roaster Directory", href: "/brewsoul/roasters", description: "30+ roasters with transparency scores and sourcing ethics", icon: "🔥", tags: ["roaster", "roastery", "onyx", "counter culture", "george howell", "tim wendelboe", "coffee"] },
  { title: "Coffee & Health", href: "/brewsoul/health", description: "Coffee and health research — what the science actually says", icon: "🩺", tags: ["coffee health", "caffeine health", "antioxidant", "cortisol"] },
  { title: "Mold-Free Coffee", href: "/brewsoul/mold-free", description: "Mycotoxin-free coffee guide — clean coffee that's actually clean", icon: "🦠", tags: ["mold", "mycotoxin", "clean coffee", "bulletproof", "toxin free"] },
  { title: "Farm Passports", href: "/brewsoul/farms", description: "Origin stories and farm-level transparency", icon: "🏡", tags: ["farm", "origin", "passport", "ethiopia", "colombia", "kenya", "panama", "coffee"] },
  { title: "Coffee Glossary", href: "/brewsoul/glossary", description: "Coffee terminology encyclopedia — from crema to channeling", icon: "📖", tags: ["glossary", "terms", "crema", "extraction", "channeling", "bloom", "coffee"] },
  { title: "Compare Coffees", href: "/brewsoul/compare", description: "Side-by-side coffee comparison tool", icon: "⚖️", tags: ["compare", "versus", "vs", "side by side", "coffee"] },
  // Psychedelic Readiness Index
  // Kristi Klawiter Embezzlement Case Study
  { title: "Convicted Embezzler Kristi Klawiter — $46,795 Stolen", href: "/protecting-your-business", description: "She had two theft convictions. I hired her anyway. She stole $46,795. Court records, FBI report, and the documented case file.", icon: "⚠️", tags: ["kristi klawiter", "klawiter", "kris management", "embezzlement", "embezzle", "fraud", "theft", "steal", "stolen", "con artist", "scam", "scammer", "invoice fraud", "contractor fraud", "unauthorized invoices", "criminal record", "forgery", "monmouth county", "morris county", "new jersey", "asbury", "braintrust", "background check", "protection", "owner protection", "business fraud", "wire fraud", "fbi", "santa monica police", "promissory note", "default", "restitution", "10 red flags", "spot a thief", "con", "grifter", "embezzler", "case study", "protecting your business", "$46795", "46795", "$20000", "upwork", "contractor", "remote contractor", "operations", "kris management llc"] },
  // Alex Azzi Public Warning
  { title: "I Believed Alex Azzi for $137,000", href: "/alex-azzi", description: "Public warning: 10 questions to ask Alex Azzi before he owes you too — $137K unpaid, 6-year paper trail, documented evidence", icon: "⚠️", tags: ["alex azzi", "azzi", "xrworkout", "xr workout", "cheshire grin", "cheshiregrin", "grifter", "scam", "fraud", "warning", "unpaid", "debt", "invoice", "$137000", "137000", "ramprate", "tony greenberg", "public warning", "community evidence", "10 questions", "broken promises", "paper trail", "due diligence", "vendor warning", "startup fraud", "non-payment", "contract breach", "dubai", "las vegas", "santa clara", "san francisco", "miami", "davos", "london", "venice", "doha", "black rock city"] },
  { title: "MAO-B Interaction Matrix", href: "/psychedelic-readiness-index#mao-b", description: "Monoamine oxidase inhibitor interaction guide — selegiline, rasagiline, safinamide wash-out timelines, serotonin syndrome risk, SSRI/SNRI/lithium/tramadol contraindications", icon: "⚠️", tags: ["mao", "maoi", "mao-b", "mao-a", "monoamine oxidase", "monoamine oxidase inhibitor", "selegiline", "rasagiline", "safinamide", "serotonin syndrome", "tyramine", "wash-out", "washout", "drug interaction", "ssri", "snri", "lithium", "tramadol", "parkinsons", "parkinson", "antidepressant", "contraindication", "pharmacology", "enzyme", "serotonin", "dopamine", "norepinephrine", "ayahuasca", "harmine", "harmaline", "dmt", "psychedelic safety"] },
  { title: "Psychedelic Readiness Index", href: "/psychedelic-readiness-index", description: "26-medicine pharmacopoeia and 25-question readiness assessment — find your healing path", icon: "🍄", tags: ["psychedelic", "readiness", "pri", "psilocybin", "mushrooms", "mdma", "ketamine", "ibogaine", "iboga", "iboga vs ibogaine", "tabernanthe iboga", "ibogaine hcl", "bwiti", "root bark", "flood dose", "ayahuasca", "dmt", "lsd", "mescaline", "peyote", "san pedro", "5-meo-dmt", "bufo", "cannabis", "salvia", "kambo", "rapé", "sananga", "cacao", "kanna", "amanita", "blue lotus", "sassafras", "nitrous oxide", "soma", "healing", "therapy", "psychedelic medicine", "assessment", "harm reduction", "sacred medicine", "plant medicine", "altered state", "consciousness", "microdose", "ceremony"] },
  { title: "PeptideWatch Safety Guide", href: "/peptide-watch", description: "The definitive consumer safety guide — 12 fraud patterns, 18 enforcement actions, 10-question supply chain test, vendor scorecard, role-based checklists for consumers, suppliers, distributors, prescribers, and researchers", icon: "🛡️", tags: ["peptidewatch", "peptide watch", "safety", "guide", "consumer", "fraud", "enforcement", "fda", "doj", "ftc", "itc", "warning letter", "vendor", "scorecard", "checklist", "supply chain", "test", "buyer", "supplier", "distributor", "prescriber", "researcher", "compounder", "compounding", "semaglutide", "tirzepatide", "bpc-157", "peptide sciences", "paradigm peptides", "amino asylum", "empower pharmacy", "finnrick", "coa", "counterfeit", "gray market", "research use only", "safe drugs act", "rfk", "whistleblower", "report", "medwatch", "wall of shame", "three markets", "watchdog"] },
  { title: "Iboga vs Ibogaine Deep Dive", href: "/iboga-ibogaine", description: "The Plant vs The Isolate. Full alkaloid profiles, receptor pharmacology, Bwiti tradition vs clinical protocol, outcomes data, pharma alternatives, supplement stacks", icon: "🌳", tags: ["iboga", "ibogaine", "ibogaine hcl", "tabernanthe iboga", "bwiti", "noribogaine", "ibogamine", "tabernanthine", "voacangine", "coronaridine", "root bark", "flood dose", "addiction", "opioid", "nmda", "kappa opioid", "sert", "dat", "cardiac", "qt prolongation", "methadone", "suboxone", "buprenorphine", "naltrexone", "gabon", "cameroon", "ceremony", "clinical", "entourage effect", "alkaloid", "deep dive", "psychedelic", "plant medicine", "tbi", "ptsd", "depression", "supplement", "coq10", "magnesium", "integration"] },
  { title: "Mescaline / Peyote Deep Dive", href: "/peyote-mescaline", description: "Full pharmacology, Latuda Mirror, outcomes data (n=452), pharma-to-plant alternatives, supplement stacks, medicine selector", icon: "🌵", tags: ["mescaline", "peyote", "san pedro", "huachuma", "cactus", "pharmacology", "receptor", "5-ht2a", "serotonin", "latuda", "lurasidone", "antipsychotic", "ssri", "zoloft", "lexapro", "effexor", "wellbutrin", "seroquel", "abilify", "xanax", "lithium", "lamictal", "adderall", "ritalin", "ambien", "gabapentin", "suboxone", "buspar", "hydroxyzine", "trazodone", "supplement", "lions mane", "ashwagandha", "nac", "omega 3", "magnesium", "psychedelic", "plant medicine", "pharma alternative", "deep dive", "outcomes", "depression", "anxiety", "ptsd", "addiction", "integration", "ceremony", "native american church"] },
  /* ── Individual PRI Medicine Deep-Links ── */
  { title: "Psilocybin Mushrooms", href: "/psychedelic-readiness-index?m=psilocybin", description: "Classic tryptamine — neuroplasticity, default mode network reset, 6-hour journey", icon: "🍄", tags: ["psilocybin", "mushrooms", "magic mushrooms", "shrooms", "tryptamine", "neuroplasticity", "depression", "anxiety", "ptsd", "microdose"] },
  { title: "Ayahuasca", href: "/psychedelic-readiness-index?m=ayahuasca", description: "The vine of the soul — DMT + MAO inhibitor, 4-8 hour ceremony, purge and vision", icon: "🌿", tags: ["ayahuasca", "aya", "dmt", "maoi", "vine", "ceremony", "purge", "amazon", "shipibo", "icaros"] },
  { title: "MDMA Therapy", href: "/psychedelic-readiness-index?m=mdma", description: "FDA Breakthrough Therapy — empathogen for PTSD, trauma processing, couples therapy", icon: "💎", tags: ["mdma", "ecstasy", "molly", "empathogen", "ptsd", "maps", "lykos", "trauma", "couples therapy"] },
  { title: "Ketamine", href: "/psychedelic-readiness-index?m=ketamine", description: "NMDA antagonist — rapid antidepressant, dissociative, legal in all 50 states. KAP + IFS therapy. Dr. Beverly Reader.", icon: "💉", tags: ["ketamine", "esketamine", "spravato", "nmda", "dissociative", "depression", "suicidal", "infusion", "troches", "kap", "ketamine assisted psychotherapy", "ifs", "internal family systems", "beverly reader", "dr reader", "neuroplasticity", "trauma", "complex ptsd", "integration"] },
  { title: "LSD", href: "/psychedelic-readiness-index?m=lsd", description: "Lysergic acid diethylamide — 8-12 hour serotonergic journey, microdose pioneer", icon: "🔬", tags: ["lsd", "acid", "lysergic", "hofmann", "serotonin", "microdose", "tab", "blotter"] },
  { title: "DMT / 5-MeO-DMT", href: "/psychedelic-readiness-index?m=dmt", description: "The spirit molecule — 15-minute breakthrough, Bufo alvarius toad medicine", icon: "🐸", tags: ["dmt", "5-meo-dmt", "bufo", "toad", "spirit molecule", "breakthrough", "nn-dmt", "alvarius"] },
  { title: "Iboga (Whole Plant)", href: "/psychedelic-readiness-index?m=iboga", description: "Tabernanthe iboga root bark — Bwiti sacrament, 12+ alkaloids, 24-48 hour journey", icon: "🌳", tags: ["iboga", "tabernanthe", "bwiti", "root bark", "gabon", "cameroon", "alkaloid", "noribogaine", "addiction"] },
  { title: "Ibogaine (Isolated Alkaloid)", href: "/psychedelic-readiness-index?m=ibogaine", description: "Ibogaine HCl — clinical isolate, opioid detox, NMDA + kappa opioid, cardiac monitoring required", icon: "⚗️", tags: ["ibogaine", "ibogaine hcl", "opioid", "detox", "addiction", "flood dose", "cardiac", "qt", "clinical"] },
  { title: "Peyote / Mescaline", href: "/psychedelic-readiness-index?m=mescaline", description: "Phenethylamine cactus — 8-12 hours, Native American Church sacrament", icon: "🌵", tags: ["mescaline", "peyote", "san pedro", "huachuma", "cactus", "phenethylamine", "nac"] },
  { title: "Kambo", href: "/psychedelic-readiness-index?m=kambo", description: "Giant monkey frog peptide — intense purge, immune reset, not a psychedelic", icon: "🐸", tags: ["kambo", "sapo", "frog", "peptide", "purge", "immune", "phyllomedusa"] },
  { title: "Rapeh (Hape)", href: "/psychedelic-readiness-index?m=rapeh", description: "Sacred tobacco snuff — grounding, clearing, ceremony opener", icon: "🌬️", tags: ["rapeh", "hape", "rapé", "snuff", "tobacco", "mapacho", "grounding"] },
  { title: "Sananga Eye Drops", href: "/psychedelic-readiness-index?m=sananga", description: "Amazonian eye medicine — intense burn, visual clarity, spiritual sight", icon: "👁️", tags: ["sananga", "eye drops", "tabernaemontana", "vision", "clarity"] },
  { title: "Microdosing Protocol", href: "/psychedelic-readiness-index?m=microdose", description: "Sub-perceptual dosing — Fadiman protocol, Stamets stack, neuroplasticity", icon: "🔬", tags: ["microdose", "microdosing", "fadiman", "stamets", "stack", "sub-perceptual", "protocol"] },
  { title: "Ceremonial Cannabis", href: "/psychedelic-readiness-index?m=cannabis", description: "Intentional high-dose cannabis — psychedelic threshold, ceremony context", icon: "🌿", tags: ["cannabis", "marijuana", "thc", "cbd", "ceremonial", "edible", "high dose"] },
  { title: "Ceremonial Cacao", href: "/psychedelic-readiness-index?m=cacao", description: "Heart-opening theobromine — gentle ceremony, emotional processing", icon: "🫘", tags: ["cacao", "chocolate", "theobromine", "heart", "ceremony", "gentle"] },
  { title: "Amanita muscaria", href: "/psychedelic-readiness-index?m=amanita", description: "Fly agaric mushroom — muscimol, GABA agonist, Siberian shamanic tradition", icon: "🍄", tags: ["amanita", "muscaria", "fly agaric", "muscimol", "gaba", "ibotenic", "siberian"] },
  { title: "Huachuma (San Pedro)", href: "/psychedelic-readiness-index?m=huachuma", description: "Mescaline cactus — 10-14 hour heart-centered journey, Andean tradition", icon: "🌵", tags: ["huachuma", "san pedro", "echinopsis", "trichocereus", "mescaline", "andean"] },
  { title: "Salvia divinorum", href: "/psychedelic-readiness-index?m=salvia", description: "Kappa opioid agonist — intense 5-15 minute dissociative, Mazatec tradition", icon: "🌿", tags: ["salvia", "divinorum", "salvinorin", "kappa", "mazatec", "dissociative"] },
  { title: "Yopo / Vilca", href: "/psychedelic-readiness-index?m=yopo", description: "DMT + 5-MeO-DMT snuff — Amazonian nasal insufflation, intense 30-minute journey", icon: "🌰", tags: ["yopo", "vilca", "anadenanthera", "bufotenin", "snuff", "amazonian"] },
  { title: "Lion's Mane Stack", href: "/psychedelic-readiness-index?m=lionsmane", description: "Neurotropic mushroom — NGF, BDNF, Stamets stack with psilocybin microdose", icon: "🦁", tags: ["lions mane", "lion's mane", "hericium", "ngf", "bdnf", "stamets", "neurotropic", "nootropic"] },
  { title: "Iboga Microdose (Root Bark)", href: "/psychedelic-readiness-index?m=ibogamic", description: "Sub-flood whole plant — Bwiti maintenance dose, full alkaloid profile at low dose", icon: "🌱", tags: ["iboga micro", "iboga microdose", "root bark", "sub-flood", "bwiti", "maintenance"] },
  { title: "Changa (Smokeable Aya)", href: "/psychedelic-readiness-index?m=changa", description: "DMT + MAOI herb blend — 20-45 minute smokeable ayahuasca experience", icon: "🌍", tags: ["changa", "smokeable", "dmt", "maoi", "julian palmer", "herb blend"] },
  { title: "Caapi Vine Alone", href: "/psychedelic-readiness-index?m=caapi", description: "Banisteriopsis caapi without DMT — gentle MAOI sedation, emotional opening", icon: "🌻", tags: ["caapi", "banisteriopsis", "vine", "maoi", "harmine", "harmaline", "gentle"] },
  { title: "Vedic / Soma Preparations", href: "/psychedelic-readiness-index?m=soma", description: "Ancient Rigveda sacrament — identity debated, consciousness exploration", icon: "🌙", tags: ["soma", "vedic", "rigveda", "amanita", "ephedra", "ancient", "sacrament"] },
  { title: "Mapacho (Sacred Tobacco)", href: "/psychedelic-readiness-index?m=mapacho", description: "Nicotiana rustica — 20x nicotine, Amazonian master plant for grounding and protection", icon: "💫", tags: ["mapacho", "sacred tobacco", "nicotiana rustica", "grounding", "protection", "amazonian"] },
  // PRI Kava Encyclopedia
  { title: "PRI Kava Encyclopedia", href: "/kava", description: "The definitive kava resource — 10 modules covering origins, science, interactions, assessment, products, and certification", icon: "🥥", tags: ["kava", "pri kava", "kava encyclopedia", "piper methysticum", "kavalactone", "noble kava", "ceremony", "pacific", "polynesian", "sacred plant", "anxiolytic", "gaba", "threshold", "awa", "yaqona", "sakau"] },
  { title: "Kava Island Origins", href: "/kava/origins", description: "3,000 years of kava culture across the Pacific — Vanuatu, Fiji, Tonga, Samoa, Hawaii, Pohnpei", icon: "🏝️", tags: ["kava origins", "vanuatu", "fiji", "tonga", "samoa", "hawaii", "pohnpei", "yaqona", "awa", "sakau", "noble cultivar", "tudei", "pacific islands", "polynesian", "melanesian", "micronesian", "nakamal", "kava bar"] },
  { title: "Kava Drug Interactions", href: "/kava/interactions", description: "24 substance interactions with kava — CYP450 enzyme inhibition, severity matrix, wash-out timelines", icon: "⚠️", tags: ["kava interaction", "kava drug interaction", "cyp450", "cyp1a2", "cyp2e1", "cyp3a4", "alcohol kava", "benzodiazepine kava", "ssri kava", "opioid kava", "liver", "hepatotoxicity", "contraindication", "medication", "prescription", "wash-out", "severity"] },
  { title: "Kavalactone Science", href: "/kava/science", description: "6 major kavalactones decoded — kavain, dihydrokavain, methysticin, DHM, yangonin, desmethoxyyangonin with chemotype decoder", icon: "🔬", tags: ["kavalactone", "kavain", "dihydrokavain", "methysticin", "dihydromethysticin", "yangonin", "desmethoxyyangonin", "chemotype", "cultivar", "pharmacology", "gaba", "dopamine", "serotonin", "cox-2", "sodium channel", "calcium channel", "kava science"] },
  { title: "PRI Kava Assessment", href: "/kava/assessment", description: "Five-domain kava readiness scoring — somatic, psychological, relational, cultural, integration — 0 to 100 with ceremony clearance", icon: "📋", tags: ["kava assessment", "kava readiness", "pri kava", "somatic readiness", "psychological readiness", "ceremony clearance", "kava score", "kava test", "kava quiz"] },
  { title: "Hawaii ICE Crisis & Awa Recovery", href: "/kava/hawaii", description: "Hawaii's meth crisis meets awa recovery — 410% above national average, pharmacological alignment, cultural argument for kava", icon: "🌺", tags: ["hawaii", "ice", "meth", "methamphetamine", "awa", "kava hawaii", "harm reduction", "recovery", "crystal meth", "dopamine", "gaba", "native hawaiian", "cultural recovery", "awa ceremony", "big island", "oahu", "maui"] },
  { title: "Kava Myths Debunked", href: "/kava/myths", description: "7 persistent kava myths examined against WHO data, peer-reviewed research, and 3,000 years of traditional use", icon: "🔍", tags: ["kava myth", "kava liver", "kava hepatotoxicity", "kava addiction", "kava psychedelic", "kava sedative", "kava safety", "kava ban", "europe ban", "who kava", "noble vs tudei", "kava capsule", "kava long term"] },
  { title: "Kava & Caffeine Interactions", href: "/kava/caffeine", description: "Kava inhibits CYP1A2 by 56% — caffeine metabolism, hippie speedball, yerba mate alternative, ceremony cutoff protocol", icon: "☕", tags: ["kava caffeine", "cyp1a2", "caffeine metabolism", "hippie speedball", "yerba mate", "coffee kava", "caffeine cutoff", "kava coffee", "stimulant", "energy drink", "matcha kava"] },
  { title: "Kava Product Index", href: "/kava/products", description: "Ceremonial powders, fresh frozen, RTD beverages, supplements, and kava bars — all with PRI ratings and pricing", icon: "🛒", tags: ["kava product", "buy kava", "kava powder", "kava bar", "kava supplement", "kava capsule", "kava drink", "rtd kava", "fresh frozen kava", "ceremonial kava", "kalm with kava", "bula kava house", "root of happiness", "kavafied", "noble kava", "borongoru", "borogu", "melo melo"] },
  { title: "Kava Facilitator Certification", href: "/kava/certification", description: "12-module, 80-hour certification — Kava Practitioner, Threshold Facilitator, Master Facilitator", icon: "🎓", tags: ["kava certification", "kava facilitator", "kava practitioner", "threshold facilitator", "master facilitator", "kava training", "kava course", "kava ceremony", "kava preparation", "kava botany", "kava pharmacology", "kava safety", "kava crisis response"] },
  /* ── Attention Theft Manifesto ── */
  { title: "Attention Theft Manifesto", href: "/attention-theft", description: "The crusade against spam, cold outreach, and the $997B attention theft economy — economics, weapons, and action", icon: "🔥", tags: ["attention theft", "manifesto", "spam", "crusade", "email", "cold outreach", "attention economy", "digital pollution", "inbox", "unsolicited", "noise cancel", "communication", "customer service", "trust"] },
  { title: "Attention Economics", href: "/attention-theft/economics", description: "The $997 billion annual cost of attention theft — 23 minutes per interruption, 65+ hours per person per year", icon: "📊", tags: ["attention economics", "spam cost", "productivity loss", "interruption cost", "23 minutes", "attention theft cost", "trillion dollar", "economic theft", "time theft"] },
  { title: "AI Blocker Finder", href: "/attention-theft/blocker-finder", description: "4-question quiz to find your personalized arsenal of AI-powered email defense tools", icon: "🛡️", tags: ["blocker", "ai blocker", "spam filter", "email tools", "sanebox", "superhuman", "clean email", "proton mail", "hey.com", "email defense", "inbox protection"] },
  { title: "Legal Database", href: "/attention-theft/legal", description: "Anti-spam laws worldwide — CAN-SPAM, GDPR, CASL — and the legislation we need next", icon: "⚖️", tags: ["legal", "can-spam", "gdpr", "casl", "anti-spam law", "legislation", "regulation", "ftc", "privacy", "consent", "opt-in", "attention theft law"] },
  { title: "The 10 Weapons", href: "/attention-theft/weapons", description: "Ten actionable weapons to fight attention theft — from zero engagement to the nuclear option", icon: "⚔️", tags: ["weapons", "fight spam", "email defense", "unsubscribe", "block", "report", "email alias", "time block", "public shame", "arsenal"] },
  { title: "Report A Spammer", href: "/attention-theft/report", description: "Public accountability database — name the worst offenders and build the evidence", icon: "🚨", tags: ["report", "spammer", "accountability", "shame", "forward medical", "cold outreach", "spam report", "complaint", "crusade", "customer service"] },
  { title: "The Facilitator Index — Know Who You Go With", href: "/facilitator-index", description: "Invitation-only, anonymous, philosophy-first instrument for psychedelic practitioners and guides. 108 items across twelve bands. Companion to the Psychedelic Readiness Index.", icon: "🧭", tags: ["facilitator index", "facilitator", "facilitators", "psychedelic facilitator", "guide", "psychedelic guide", "practitioner", "psychedelic practitioner", "know who you go with", "who you go with", "facilitator assessment", "facilitator instrument", "facilitator survey", "facilitator questionnaire", "facilitator vetting", "facilitator philosophy", "facilitator ethics", "facilitator training", "facilitator certification", "facilitator map", "facilitator network", "facilitator referral", "facilitator corroboration", "facilitator code", "facilitator anonymity", "facilitator privacy", "facilitator safety", "facilitator consent", "facilitator context", "facilitator temperament", "facilitator container", "facilitator integration", "facilitator confidentiality", "facilitator requirements", "facilitator vignettes", "facilitator bio", "facilitator reciprocity", "facilitator traditions", "facilitator five axis", "facilitator proximity", "facilitator policy", "facilitator structure", "facilitator frame", "facilitator regulated", "facilitator legal", "facilitator lineage", "facilitator supervision", "facilitator credential", "facilitator license", "shipibo", "vegetalismo", "icaro", "santo daime", "uniao do vegetal", "mazatec", "velada", "wixarika", "native american church", "tipi meeting", "bwiti", "ibogaine medical detox", "kambo", "rapeh", "hape", "sananga", "sonoran", "amanita", "cacao ceremony", "nakamal", "kava ceremony", "temazcal", "holotropic breathwork", "mdma protocol", "psilocybin trial", "ketamine assisted", "service center", "psycholytic", "ifs informed", "somatic holding", "microdosing protocol", "reciprocity gate", "corroboration tokens", "coded identity", "anonymous practitioner", "cedar code", "practitioner map", "five axis map", "proximity axis", "policy axis", "register axis", "frame axis", "structure axis", "traditions grid", "closed to me", "preparation arc", "integration arc", "container shape", "group size", "session length", "screening", "medical clearance", "touch consent", "post session", "morning after", "onward referral", "sliding scale", "unpaid work", "underserved population", "ethical failure", "boundary", "inner healing intelligence", "trust", "reputation", "ledger", "field standard", "referral network", "whispered names", "field research", "pilot cohort", "250 practitioners", "version 1.0", "code word", "passphrase", "token holder", "corroborated", "not verified", "three tokens", "fireside project", "psychedelic readiness index", "pri", "companion instrument", "seeker", "practitioner instrument"] },
  { title: "Spamtoast — You've Been Reported", href: "/youve-been-reported", description: "The page spammers see when you forward their email — anonymous confrontation, enforcement agencies, legal citations, and the nuclear option", icon: "💀", tags: ["spamtoast", "spam toast", "youve been reported", "spammer page", "forward email", "anonymous", "enforcement", "nuclear option", "confrontation", "reported", "spam link", "wall of shame"] },
];

/* ── BLOG POST ITEMS with full-text search index ── */
const BLOG_ITEMS = (blogData as any[]).filter((post) => !post.unpublished).map((post, idx) => {
  // Build a comprehensive search corpus from ALL available fields
  const allKeywords = (post.keywords || []).map((k: string) => k.toLowerCase());
  const allTags = (post.tags || []).map((t: string) => t.toLowerCase());
  const content = (post.content || "").toLowerCase();
  const excerpt = (post.excerpt || "").toLowerCase();
  const subtitle = (post.subtitle || "").toLowerCase();
  const lesson = (post.lesson || "").toLowerCase();

  // Build full searchable text blob (title + subtitle + excerpt + keywords + tags + category + content + lesson)
  const searchCorpus = [
    post.title?.toLowerCase() || "",
    subtitle,
    excerpt,
    allKeywords.join(" "),
    allTags.join(" "),
    (post.category || "").toLowerCase(),
    (post.formatTag || "").toLowerCase(),
    content,
    lesson,
  ].join(" ");

  return {
    title: post.title,
    href: `/blog/${post.slug}`,
    description: post.summary?.slice(0, 120) || post.excerpt?.slice(0, 120) || "",
    category: post.category,
    recencyIndex: idx,
    tags: [...allKeywords, ...allTags, post.category?.toLowerCase(), post.formatTag?.toLowerCase()].filter(Boolean),
    searchCorpus, // full text for deep search
    content, // raw content for snippet extraction
    pinned: !!post.pinned, // pinned posts get search boost
  };
});

type SearchItem = {
  title: string;
  href: string;
  description: string;
  icon?: string;
  category?: string;
  tags?: string[];
  snippet?: string;
};

type BlogSearchItem = SearchItem & {
  recencyIndex?: number;
  searchCorpus?: string;
  content?: string;
  pinned?: boolean;
};

/* ── Extract a snippet around the matched term ── */
function extractSnippet(content: string, query: string, maxLen = 120): string | undefined {
  if (!content) return undefined;
  const q = query.toLowerCase();
  const idx = content.indexOf(q);
  if (idx === -1) return undefined;

  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + q.length + 80);
  let snippet = content.slice(start, end).replace(/\n+/g, " ").trim();

  if (start > 0) snippet = "…" + snippet;
  if (end < content.length) snippet = snippet + "…";
  return snippet;
}

/* ── Scoring ── */
function scoreMatch(query: string, item: SearchItem): number {
  const q = query.toLowerCase();
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();
  const tags = (item.tags || []).join(" ").toLowerCase();

  let score = 0;
  if (title === q) score += 100;
  else if (title.startsWith(q)) score += 80;
  else if (title.includes(q)) score += 60;
  if (tags.includes(q)) score += 40;
  if (desc.includes(q)) score += 20;
  // Fuzzy title match
  let qi = 0;
  const t = title;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  if (qi === q.length && score === 0) score += 10;

  return score;
}

function scoreBlogMatch(query: string, item: BlogSearchItem): number {
  let score = scoreMatch(query, item);
  const q = query.toLowerCase();

  // Deep content search — check the full corpus
  if (item.searchCorpus && item.searchCorpus.includes(q)) {
    // Content match gets 30 points (less than title/tag but enough to surface)
    if (score === 0) score += 30;
    else score += 15; // bonus if already matched on title/tags
  }

  // Multi-word: check if ALL words appear in corpus
  const words = q.split(/\s+/).filter(w => w.length > 1);
  if (words.length > 1 && item.searchCorpus) {
    const allFound = words.every(w => item.searchCorpus!.includes(w));
    if (allFound) score += 25;
  }

  // Pinned boost — pinned posts always surface first when relevant
  if (item.pinned && score > 0) {
    score += 50;
  }

  // Recency boost
  if (typeof item.recencyIndex === "number") {
    score += Math.max(0, 15 - Math.floor(item.recencyIndex / 6));
  }

  return score;
}

export function SearchTrigger({ isDark }: { isDark: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        style={{
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
          border: `1.5px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
          cursor: "pointer",
          color: isDark ? "#ccc" : "#555",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 20px",
          borderRadius: 10,
          transition: "all 0.2s ease",
          minWidth: 180,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#D4B96A";
          e.currentTarget.style.background = isDark ? "rgba(123, 63, 160,0.1)" : "rgba(74, 29, 107,0.07)";
          e.currentTarget.style.borderColor = isDark ? "rgba(123, 63, 160,0.2)" : "rgba(74, 29, 107,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = isDark ? "#aaa" : "#777";
          e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
          e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
        }}
      >
        <Search size={22} strokeWidth={2.2} />
        <span
          className="hidden sm:inline"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.85rem",
            letterSpacing: "0.06em",
            color: isDark ? "#aaa" : "#777",
          }}
        >
          Search
        </span>
        <span
          className="hidden sm:inline"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
            color: isDark ? "#666" : "#aaa",
            border: `1px solid ${isDark ? "#444" : "#ccc"}`,
            borderRadius: 5,
            padding: "2px 8px",
            marginLeft: 6,
          }}
        >
          ⌘K
        </span>
      </button>

      <AnimatePresence>
        {open && <SearchPalette onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function SearchPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Debounce query for server-side search (300ms)
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery("");
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Server-side search (fires after debounce)
  const serverSearch = trpc.search.query.useQuery(
    { q: debouncedQuery, limit: 20 },
    { enabled: debouncedQuery.length >= 2, staleTime: 60000, retry: false }
  );

  // Instant client-side results (immediate feedback while typing)
  const clientResults = useMemo(() => {
    if (!query.trim()) {
      return {
        pages: PAGES.slice(0, 6),
        posts: BLOG_ITEMS.slice(0, 4).map(p => ({ ...p, snippet: undefined as string | undefined })),
      };
    }

    const q = query.trim();
    const matchedPages = PAGES
      .map((p) => ({ ...p, score: scoreMatch(q, p) }))
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const matchedPosts = BLOG_ITEMS
      .map((p) => ({
        ...p,
        score: scoreBlogMatch(q, p),
        snippet: extractSnippet(p.content || "", q.toLowerCase()),
      }))
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return { pages: matchedPages, posts: matchedPosts };
  }, [query]);

  // Merge server results with client results (server results supplement client results)
  const results = useMemo(() => {
    if (!query.trim()) return clientResults;

    // If server results are available, merge them in
    if (serverSearch.data && serverSearch.data.results.length > 0) {
      const serverResults = serverSearch.data.results;

      // Collect existing paths from client results to avoid duplicates
      const existingPaths = new Set([
        ...clientResults.pages.map(p => p.href),
        ...clientResults.posts.map(p => p.href),
      ]);

      // Split server results into pages and posts
      const serverPages: typeof clientResults.pages = [];
      const serverPosts: typeof clientResults.posts = [];

      for (const sr of serverResults) {
        if (existingPaths.has(sr.path)) continue;
        existingPaths.add(sr.path);

        const item = {
          title: sr.title,
          href: sr.path,
          description: sr.excerpt || "",
          category: sr.subcategory || sr.category,
          tags: sr.tags ? sr.tags.split(", ") : [],
          score: sr.score,
          snippet: sr.snippet || undefined,
        };

        if (sr.category === "blog") {
          serverPosts.push(item as any);
        } else {
          serverPages.push(item as any);
        }
      }

      // Merge: client results first (they're instant/ranked), then server supplements
      return {
        pages: [...clientResults.pages, ...serverPages].slice(0, 8),
        posts: [...clientResults.posts, ...serverPosts].slice(0, 15),
      };
    }

    return clientResults;
  }, [query, clientResults, serverSearch.data]);

  const allResults = useMemo(
    () => [...results.pages, ...results.posts],
    [results]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const goTo = useCallback(
    (href: string) => {
      onClose();
      if (href.startsWith('http')) {
        window.open(href, '_blank', 'noopener');
      } else {
        navigate(href);
      }
    },
    [onClose, navigate]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, allResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && allResults[selectedIndex]) {
      e.preventDefault();
      goTo(allResults[selectedIndex].href);
    } else if (e.key === "Escape") {
      onClose();
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
      className="fixed inset-0 z-[9998]"
      style={{ background: "rgba(10,10,16,0.6)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "min(20%, 120px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(92vw, 640px)",
          background: "#FAFAF7",
          borderRadius: 16,
          boxShadow: "0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(74, 29, 107,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            borderBottom: "1px solid rgba(74, 29, 107,0.12)",
          }}
        >
          <Search size={18} style={{ color: "#8B6914", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search everything — pages, essays, content..."
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
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#999",
                padding: 4,
                display: "flex",
              }}
            >
              <X size={16} />
            </button>
          )}
          <kbd
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              color: "#999",
              border: "1px solid #ddd",
              borderRadius: 4,
              padding: "2px 6px",
              flexShrink: 0,
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          style={{
            maxHeight: "min(60vh, 480px)",
            overflowY: "auto",
            padding: "8px 0",
          }}
        >
          {allResults.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "1rem",
                  color: "#999",
                }}
              >
                No results for "{query}"
              </p>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  color: "#bbb",
                  marginTop: 8,
                }}
              >
                Try a different search term or ask FauxTony
              </p>
              <button
                onClick={() => goTo("/fauxtony")}
                style={{
                  marginTop: 16,
                  background: "#0A0A10",
                  color: "#D4B96A",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  cursor: "pointer",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <Sparkles size={14} style={{ display: "inline", marginRight: 6, verticalAlign: -2 }} />
                Ask FauxTony
              </button>
            </div>
          ) : (
            <>
              {/* Pages section */}
              {results.pages.length > 0 && (
                <>
                  <div
                    style={{
                      padding: "8px 20px 4px",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#999",
                    }}
                  >
                    {query ? "Pages" : "Featured"}
                  </div>
                  {results.pages.map((page) => {
                    itemIndex++;
                    const idx = itemIndex;
                    return (
                      <button
                        key={page.href}
                        data-index={idx}
                        onClick={() => goTo(page.href)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          width: "100%",
                          padding: "10px 20px",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          background: selectedIndex === idx ? "rgba(74, 29, 107,0.08)" : "transparent",
                          transition: "background 0.1s ease",
                        }}
                      >
                        <span style={{ fontSize: "1.1rem", flexShrink: 0, width: 28, textAlign: "center" }}>
                          {"icon" in page ? (page as any).icon : "📄"}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "0.95rem",
                              fontWeight: 600,
                              color: "#1a1a1a",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {page.title}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "0.8rem",
                              color: "#888",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {page.description}
                          </div>
                        </div>
                        {selectedIndex === idx && (
                          <ArrowRight size={14} style={{ color: "#8B6914", flexShrink: 0 }} />
                        )}
                      </button>
                    );
                  })}
                </>
              )}

              {/* Blog posts section */}
              {results.posts.length > 0 && (
                <>
                  <div
                    style={{
                      padding: "12px 20px 4px",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#999",
                      borderTop: results.pages.length > 0 ? "1px solid rgba(74, 29, 107,0.08)" : "none",
                    }}
                  >
                    Essays
                  </div>
                  {results.posts.map((post) => {
                    itemIndex++;
                    const idx = itemIndex;
                    return (
                      <button
                        key={post.href}
                        data-index={idx}
                        onClick={() => goTo(post.href)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          width: "100%",
                          padding: "10px 20px",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          background: selectedIndex === idx ? "rgba(74, 29, 107,0.08)" : "transparent",
                          transition: "background 0.1s ease",
                        }}
                      >
                        <FileText size={16} style={{ color: "#8B6914", flexShrink: 0, width: 28 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "0.95rem",
                              fontWeight: 600,
                              color: "#1a1a1a",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {post.title}
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            {post.category && (
                              <span
                                style={{
                                  fontFamily: "'DM Mono', monospace",
                                  fontSize: "0.65rem",
                                  letterSpacing: "0.06em",
                                  textTransform: "uppercase",
                                  color: "#8B6914",
                                  background: "rgba(74, 29, 107,0.08)",
                                  padding: "1px 6px",
                                  borderRadius: 3,
                                  flexShrink: 0,
                                }}
                              >
                                {post.category}
                              </span>
                            )}
                            <span
                              style={{
                                fontFamily: "'Source Sans 3', sans-serif",
                                fontSize: "0.78rem",
                                color: "#999",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {post.description}
                            </span>
                          </div>
                          {/* Content snippet when matched on body text */}
                          {(post as any).snippet && (
                            <div
                              style={{
                                fontFamily: "'Source Sans 3', sans-serif",
                                fontSize: "0.72rem",
                                color: "#777",
                                fontStyle: "italic",
                                marginTop: 2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              "{(post as any).snippet}"
                            </div>
                          )}
                        </div>
                        {selectedIndex === idx && (
                          <ArrowRight size={14} style={{ color: "#8B6914", flexShrink: 0 }} />
                        )}
                      </button>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            borderTop: "1px solid rgba(74, 29, 107,0.1)",
            background: "rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#bbb" }}>
              <kbd style={{ border: "1px solid #ddd", borderRadius: 3, padding: "0 4px", marginRight: 2 }}>↑↓</kbd> navigate
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#bbb" }}>
              <kbd style={{ border: "1px solid #ddd", borderRadius: 3, padding: "0 4px", marginRight: 2 }}>↵</kbd> open
            </span>
          </div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              color: "#ccc",
            }}
          >
            {allResults.length} result{allResults.length !== 1 ? "s" : ""}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
