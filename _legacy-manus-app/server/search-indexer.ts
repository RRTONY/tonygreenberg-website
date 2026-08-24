/**
 * Search Indexer — crawls all content sources and populates the search_index table.
 * Called from a tRPC admin procedure or a CLI script.
 *
 * Content sources:
 * 1. Blog posts (blogData.json) — 114 posts with full content
 * 2. Static pages (hardcoded catalog of all routes with descriptions)
 * 3. Data files (BrewSoul coffees, chains, encyclopedia, charities, cities, etc.)
 */

import { eq, sql } from "drizzle-orm";
import { searchIndex, InsertSearchIndexEntry } from "../drizzle/schema";
import { getDb } from "./db";

/* ── Helpers ── */

/** Strip HTML tags and markdown formatting from text */
function stripMarkup(text: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, " ")        // HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, " ") // markdown images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown links → keep text
    .replace(/#{1,6}\s*/g, "")        // headings
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1") // bold/italic
    .replace(/`{1,3}[^`]*`{1,3}/g, " ") // code blocks
    .replace(/[-*_]{3,}/g, " ")       // horizontal rules
    .replace(/>\s*/g, "")             // blockquotes
    .replace(/\n{2,}/g, "\n")         // multiple newlines
    .replace(/\s{2,}/g, " ")          // multiple spaces
    .trim();
}

/** Truncate text to a max length for excerpts */
function truncate(text: string, maxLen: number): string {
  if (!text || text.length <= maxLen) return text || "";
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

/* ── Content Source: Blog Posts ── */

async function indexBlogPosts(): Promise<InsertSearchIndexEntry[]> {
  // Dynamic import to avoid bundling issues
  const blogData = (await import("../client/src/data/blogData.json", { assert: { type: "json" } })).default as any[];

  return blogData
    .filter((post: any) => !post.unpublished)
    .map((post: any) => {
      const content = stripMarkup(post.content || post.updatedContent || "");
      const keywords = (post.keywords || []).join(", ");
      const tags = [...(post.keywords || []), ...(post.tags || []), post.category, post.formatTag].filter(Boolean).join(", ");

      return {
        contentKey: `blog:${post.slug}`,
        title: post.title || "Untitled",
        path: `/blog/${post.slug}`,
        excerpt: truncate(post.excerpt || post.summary || content, 300),
        body: content,
        category: "blog",
        subcategory: post.category || null,
        tags,
        imageUrl: post.heroImage || null,
        boost: post.featured ? 3 : post.editorsPick ? 2 : 1,
        contentUpdatedAt: new Date(),
        indexedAt: new Date(),
      };
    });
}

/* ── Content Source: Static Pages ── */

interface PageEntry {
  path: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string;
  boost?: number;
}

const STATIC_PAGES: PageEntry[] = [
  // ── Core Pages ──
  { path: "/", title: "Home — Tony Greenberg", description: "I expose broken systems. Then I build what replaces them. $10B+ transactions. Microsoft, Disney, Goldman Sachs. 25 years.", category: "page", tags: "tony greenberg, home, ramprate, impactsoul, systems, trust", boost: 5 },
  { path: "/about", title: "About Tony Greenberg", description: "Investor, systems thinker, builder of impact platforms. 25 years in enterprise technology, psychedelic medicine, tokenized impact, and payments infrastructure.", category: "page", tags: "about, bio, tony greenberg, ramprate, impactsoul, career, investor", boost: 4 },
  { path: "/essays", title: "Essays", description: "114 essays on trust, capital, consciousness, systems thinking, and the extractive economy. Written over 25 years.", category: "page", tags: "essays, blog, writing, articles, opinion", boost: 3 },
  { path: "/series", title: "Series", description: "Multi-part essay series exploring connected themes across trust, technology, consciousness, and impact.", category: "page", tags: "series, multi-part, connected essays", boost: 2 },
  { path: "/subscribe", title: "Subscribe", description: "Subscribe to Tony Greenberg's weekly counter-narrative newsletter.", category: "page", tags: "subscribe, newsletter, email, signup", boost: 2 },
  { path: "/community", title: "Community", description: "Join the community of builders, investors, and operators creating regenerative alternatives to extractive systems.", category: "page", tags: "community, join, network, builders, investors", boost: 2 },
  { path: "/engage", title: "Engage", description: "Work with Tony Greenberg — engagement audit, qualification process, and collaboration opportunities.", category: "page", tags: "engage, contact, work together, consulting, collaboration", boost: 2 },
  { path: "/invest", title: "Invest", description: "Investment opportunities in psychedelic medicine, tokenized impact, and consciousness infrastructure.", category: "page", tags: "invest, investment, portfolio, psychedelic, tokenized", boost: 2 },
  { path: "/shop", title: "Shop", description: "Digital products, frameworks, and tools from Tony Greenberg.", category: "page", tags: "shop, products, buy, store", boost: 1 },
  { path: "/discover", title: "Discover", description: "Explore the full ecosystem — essays, assessments, tools, and resources.", category: "page", tags: "discover, explore, sitemap, navigation", boost: 2 },
  { path: "/the-mirror", title: "The Mirror", description: "An interactive self-reflection tool that reveals patterns in how you think, decide, and lead.", category: "page", tags: "mirror, self-reflection, assessment, patterns, leadership", boost: 2 },
  { path: "/find-your-journey", title: "Find Your Journey", description: "Personalized pathway through 20+ assessments covering purpose, consciousness, relationships, health, and lifestyle.", category: "page", tags: "journey, assessments, personalized, pathway, quiz", boost: 2 },
  { path: "/manifesto", title: "Manifesto", description: "The Living Declaration — a manifesto for building regenerative systems and conscious capitalism.", category: "page", tags: "manifesto, declaration, regenerative, conscious capitalism, impact", boost: 3 },
  { path: "/living-declaration", title: "Living Declaration", description: "The evolving manifesto for conscious capitalism and regenerative systems.", category: "page", tags: "living declaration, manifesto, conscious capitalism", boost: 3 },
  { path: "/ecosystem-map", title: "Ecosystem Map", description: "Visual map of Tony Greenberg's ecosystem — companies, investments, partnerships, and impact initiatives.", category: "page", tags: "ecosystem, map, companies, investments, partnerships", boost: 2 },
  { path: "/impact-dashboard", title: "Impact Dashboard", description: "Real-time impact metrics across the portfolio — diagnostics completed, assessments taken, community growth.", category: "page", tags: "impact, dashboard, metrics, analytics, portfolio", boost: 2 },
  { path: "/thesis-threads", title: "Thesis Threads", description: "Connected themes across essays — follow the threads that link trust, capital, consciousness, and systems.", category: "page", tags: "thesis, threads, themes, connections, trust, capital", boost: 2 },

  // ── Human OS ──
  { path: "/humanos", title: "Human OS 2.0", description: "Are you a Maximizer or a Satisficer? Human OS 2.0 is the counter-protocol — a system for the Conscious Satisficer.", category: "humanos", tags: "human os, maximizer, satisficer, consciousness, protocol, operating system", boost: 3 },
  { path: "/humanos/philosophy", title: "Human OS Philosophy", description: "The philosophical framework behind Human OS 2.0 — consciousness scale, satisficing, and the counter-protocol.", category: "humanos", tags: "philosophy, consciousness, satisficing, framework, human os", boost: 2 },
  { path: "/humanos/ecosystem", title: "Human OS Ecosystem", description: "The people, organizations, and advisors building the Human OS 2.0 movement.", category: "humanos", tags: "ecosystem, advisors, team, human os, movement", boost: 2 },
  { path: "/humanos/resources", title: "Human OS Resources", description: "Books, tools, and resources for the Conscious Satisficer journey.", category: "humanos", tags: "resources, books, tools, human os, satisficer", boost: 2 },
  { path: "/humanos/connect", title: "Human OS Connect", description: "Connect with the Human OS 2.0 community and movement.", category: "humanos", tags: "connect, community, human os, join", boost: 2 },
  { path: "/humanos/path-to-here", title: "Path to Here", description: "The journey that led to Human OS 2.0 — from enterprise technology to consciousness infrastructure.", category: "humanos", tags: "path, journey, story, origin, human os", boost: 2 },

  // ── Assessments ──
  { path: "/assessments", title: "Assessments", description: "Three research-backed tools: Dharma Finder, Consciousness Scale, and Grant Study. Five to ten minutes. Immediate insights.", category: "assessment", tags: "assessments, quiz, dharma, consciousness, grant study, purpose, test", boost: 3 },
  { path: "/assessment", title: "Take an Assessment", description: "Choose from 20+ assessments covering purpose, consciousness, relationships, health, lifestyle, and more.", category: "assessment", tags: "assessment, quiz, test, take, start", boost: 3 },
  { path: "/find-your-me", title: "Find Your Me", description: "A guided self-discovery assessment that reveals your core patterns and purpose.", category: "assessment", subcategory: "self-discovery", tags: "find your me, self-discovery, purpose, patterns, assessment", boost: 2 },
  { path: "/find-your-therapy", title: "Find Your Therapy", description: "Assessment to match you with the right therapeutic modality based on your needs and preferences.", category: "assessment", subcategory: "health", tags: "therapy, mental health, assessment, modality, counseling, psychotherapy", boost: 2 },
  { path: "/find-your-sake", title: "Find Your Sake", description: "Discover your ideal sake style based on flavor preferences and dining habits.", category: "assessment", subcategory: "lifestyle", tags: "sake, japanese, alcohol, flavor, pairing, assessment", boost: 1 },
  { path: "/find-your-spirit", title: "Find Your Spirit", description: "Assessment to discover which spirit (whiskey, gin, rum, tequila, etc.) matches your personality.", category: "assessment", subcategory: "lifestyle", tags: "spirit, whiskey, gin, rum, tequila, cocktail, assessment", boost: 1 },
  { path: "/find-your-religion", title: "Find Your Religion", description: "Explore which spiritual or philosophical tradition resonates with your worldview and values.", category: "assessment", subcategory: "self-discovery", tags: "religion, spirituality, philosophy, faith, tradition, assessment", boost: 2 },
  { path: "/find-your-diet", title: "Find Your Diet", description: "Assessment to find the eating approach that fits your body, goals, and lifestyle.", category: "assessment", subcategory: "health", tags: "diet, nutrition, eating, health, food, assessment", boost: 2 },
  { path: "/find-your-movement", title: "Find Your Movement", description: "Discover your ideal exercise and movement practice based on body type and preferences.", category: "assessment", subcategory: "health", tags: "movement, exercise, fitness, yoga, workout, assessment", boost: 2 },
  { path: "/find-your-sleep", title: "Find Your Sleep", description: "Assessment to optimize your sleep based on chronotype and lifestyle patterns.", category: "assessment", subcategory: "health", tags: "sleep, chronotype, insomnia, rest, circadian, assessment", boost: 2 },
  { path: "/find-your-coffee", title: "Find Your Coffee", description: "Discover your perfect coffee based on flavor preferences, brewing method, and caffeine sensitivity.", category: "assessment", subcategory: "lifestyle", tags: "coffee, brewing, espresso, caffeine, flavor, assessment", boost: 2 },
  { path: "/find-your-kitchen", title: "Find Your Kitchen", description: "Assessment to discover your cooking style and ideal kitchen setup.", category: "assessment", subcategory: "lifestyle", tags: "kitchen, cooking, culinary, food, chef, assessment", boost: 1 },
  { path: "/find-your-style", title: "Find Your Style", description: "Discover your personal style archetype and wardrobe philosophy.", category: "assessment", subcategory: "lifestyle", tags: "style, fashion, wardrobe, clothing, personal style, assessment", boost: 1 },
  { path: "/find-your-attachment-style", title: "Find Your Attachment Style", description: "Assessment based on attachment theory to understand your relationship patterns.", category: "assessment", subcategory: "relationships", tags: "attachment, relationships, secure, anxious, avoidant, assessment", boost: 2 },
  { path: "/find-your-love-language", title: "Find Your Love Language", description: "Discover how you give and receive love based on the five love languages framework.", category: "assessment", subcategory: "relationships", tags: "love language, relationships, affection, quality time, gifts, assessment", boost: 2 },
  { path: "/find-your-peptide", title: "Find Your Peptide", description: "Assessment to identify which peptides may support your health goals.", category: "assessment", subcategory: "health", tags: "peptide, health, bpc-157, semaglutide, tirzepatide, assessment", boost: 2 },
  { path: "/find-your-sexuality", title: "Find Your Sexuality", description: "A thoughtful assessment exploring sexual identity, orientation, and expression.", category: "assessment", subcategory: "self-discovery", tags: "sexuality, identity, orientation, expression, assessment", boost: 1 },
  { path: "/self-portrait", title: "Self Portrait", description: "AI-generated self-portrait based on your assessment results and personality profile.", category: "assessment", subcategory: "self-discovery", tags: "self portrait, ai, personality, visual, assessment", boost: 2 },
  { path: "/soulscore", title: "SoulScore", description: "Comprehensive life assessment across purpose, relationships, health, career, and consciousness.", category: "assessment", subcategory: "self-discovery", tags: "soulscore, life assessment, comprehensive, purpose, consciousness", boost: 2 },
  { path: "/psychedelic-readiness-index", title: "Psychedelic Readiness Index", description: "Research-backed assessment measuring your readiness for psychedelic-assisted therapy across 8 dimensions.", category: "assessment", subcategory: "health", tags: "psychedelic, readiness, therapy, psilocybin, mdma, assessment, PRI", boost: 3 },
  { path: "/pri-calibration", title: "PRI Calibration", description: "Deep calibration tool for the Psychedelic Readiness Index — forced-rank your dimensions.", category: "assessment", subcategory: "health", tags: "PRI, calibration, psychedelic, readiness, forced rank", boost: 2 },

  // ── Attention Theft / SpamToast ──
  { path: "/attention-theft", title: "The Attention Theft Manifesto", description: "The extractive economy ends here. A manifesto against unsolicited email, cold outreach, and the theft of human attention.", category: "page", subcategory: "attention-theft", tags: "attention theft, spam, manifesto, email, cold outreach, extractive", boost: 3 },
  { path: "/attention-theft/weapons", title: "The 10 Weapons", description: "Ten actionable weapons to fight attention theft — from zero engagement to the nuclear option.", category: "page", subcategory: "attention-theft", tags: "weapons, fight spam, email defense, unsubscribe, block, report", boost: 2 },
  { path: "/attention-theft/report", title: "Report A Spammer", description: "Public accountability database — name the worst offenders and build the evidence.", category: "page", subcategory: "attention-theft", tags: "report, spammer, accountability, wall of shame, complaint", boost: 2 },
  { path: "/attention-theft/legal", title: "Legal Database", description: "Anti-spam laws worldwide — CAN-SPAM, GDPR, CASL — and the legislation we need next.", category: "page", subcategory: "attention-theft", tags: "legal, can-spam, gdpr, casl, anti-spam law, regulation", boost: 2 },
  { path: "/attention-theft/blocker-finder", title: "AI Blocker Finder", description: "4-question quiz to find your personalized arsenal of AI-powered email defense tools.", category: "page", subcategory: "attention-theft", tags: "blocker, ai, spam filter, email tools, sanebox, superhuman", boost: 2 },
  { path: "/youve-been-reported", title: "SpamToast — You've Been Reported", description: "The page spammers see when you forward their email — anonymous confrontation, enforcement agencies, legal citations.", category: "page", subcategory: "attention-theft", tags: "spamtoast, reported, spammer, confrontation, enforcement", boost: 2 },
  { path: "/spamtoast", title: "SpamToast", description: "Forward spam → get a personalized confrontation URL → send it back. The nuclear option for attention theft.", category: "page", subcategory: "attention-theft", tags: "spamtoast, forward, spam, nuclear option, confrontation", boost: 2 },

  // ── BrewSoul ──
  { path: "/brewsoul", title: "BrewSoul", description: "The definitive coffee intelligence platform — origins, science, economics, and the pursuit of the perfect cup.", category: "brewsoul", tags: "brewsoul, coffee, guide, intelligence, brewing", boost: 3 },
  { path: "/brewsoul/home", title: "BrewSoul Home", description: "Your coffee journey starts here — explore origins, brewing methods, health science, and the economics of coffee.", category: "brewsoul", tags: "brewsoul, coffee, home, start, explore", boost: 2 },
  { path: "/brewsoul/browse", title: "Browse Coffees", description: "Browse and filter the complete BrewSoul coffee database — by origin, roast, flavor, and score.", category: "brewsoul", tags: "browse, coffees, database, filter, origin, roast, flavor", boost: 2 },
  { path: "/brewsoul/health", title: "Coffee & Health", description: "Coffee and health research — what the science actually says about caffeine, antioxidants, cortisol, and longevity.", category: "brewsoul", tags: "coffee health, caffeine, antioxidant, cortisol, longevity, science", boost: 2 },
  { path: "/brewsoul/farms", title: "Coffee Farms", description: "The farms behind the beans — direct trade, sustainability, and the people who grow your coffee.", category: "brewsoul", tags: "farms, direct trade, sustainability, growers, origin", boost: 2 },
  { path: "/brewsoul/mold-free", title: "Mold-Free Coffee", description: "The truth about mycotoxins in coffee — which brands test, which don't, and what the science says.", category: "brewsoul", tags: "mold free, mycotoxin, clean coffee, testing, safety", boost: 2 },
  { path: "/brewsoul/varieties", title: "Coffee Varieties", description: "Arabica, Robusta, Liberica, and beyond — the genetic diversity of coffee and what it means for flavor.", category: "brewsoul", tags: "varieties, arabica, robusta, liberica, genetics, flavor", boost: 2 },
  { path: "/brewsoul/processing", title: "Coffee Processing", description: "Washed, natural, honey, anaerobic — how processing methods transform coffee flavor.", category: "brewsoul", tags: "processing, washed, natural, honey, anaerobic, fermentation", boost: 2 },
  { path: "/brewsoul/roasters", title: "Coffee Roasters", description: "The best specialty coffee roasters — profiles, philosophy, and what makes each one unique.", category: "brewsoul", tags: "roasters, specialty, third wave, profiles, best roasters", boost: 2 },
  { path: "/brewsoul/glossary", title: "Coffee Glossary", description: "Complete coffee terminology — from acidity to zest, every term you need to speak coffee fluently.", category: "brewsoul", tags: "glossary, terminology, definitions, coffee terms, vocabulary", boost: 1 },
  { path: "/brewsoul/pairings", title: "Coffee Pairings", description: "Food and coffee pairing guide — which coffees complement which foods, desserts, and occasions.", category: "brewsoul", tags: "pairings, food, dessert, matching, flavor pairing", boost: 1 },
  { path: "/brewsoul/economics", title: "Coffee Economics", description: "The economics of coffee — from farm gate prices to retail markup, who profits and who doesn't.", category: "brewsoul", tags: "economics, price, fair trade, farm gate, markup, profit", boost: 2 },
  { path: "/brewsoul/compare", title: "Compare Coffees", description: "Side-by-side coffee comparison tool — compare origins, flavors, scores, and brewing recommendations.", category: "brewsoul", tags: "compare, side by side, versus, comparison, coffees", boost: 1 },
  { path: "/brewsoul/blend-builder", title: "Blend Builder", description: "Build your own custom coffee blend — select origins, ratios, and flavor profiles.", category: "brewsoul", tags: "blend, builder, custom, mix, create, recipe", boost: 2 },
  { path: "/brewsoul/drops", title: "BrewSoul Drops", description: "Limited edition coffee drops — rare lots, micro-batches, and seasonal selections.", category: "brewsoul", tags: "drops, limited edition, rare, micro batch, seasonal", boost: 1 },
  { path: "/brewsoul/collection", title: "My Collection", description: "Your personal coffee collection — track what you've tried, rate, and build your flavor profile.", category: "brewsoul", tags: "collection, my coffees, track, rate, personal", boost: 1 },
  { path: "/brewsoul/prescription", title: "Coffee Prescription", description: "AI-powered coffee recommendation based on your taste preferences and health goals.", category: "brewsoul", tags: "prescription, recommendation, ai, personalized, taste", boost: 2 },
  { path: "/brewsoul/chains", title: "Chain Scorecard", description: "Honest ratings of major coffee chains — Starbucks, Dunkin', Peet's, Blue Bottle, and more.", category: "brewsoul", tags: "chains, starbucks, dunkin, peets, blue bottle, ratings, scorecard", boost: 2 },
  { path: "/brewsoul/biodynamic", title: "Biodynamic Coffee", description: "Biodynamic and regenerative coffee farming — beyond organic, into cosmic agriculture.", category: "brewsoul", tags: "biodynamic, regenerative, organic, farming, cosmic agriculture", boost: 1 },
  { path: "/brewsoul/decaf", title: "Decaf Coffee", description: "The truth about decaf — Swiss Water Process, CO2 extraction, and which decafs actually taste good.", category: "brewsoul", tags: "decaf, decaffeinated, swiss water, co2, caffeine free", boost: 1 },
  { path: "/brewsoul/cities", title: "Coffee Cities", description: "The world's best coffee cities — where to drink, what to order, and the local coffee culture.", category: "brewsoul", tags: "cities, travel, coffee culture, best cities, where to drink", boost: 2 },
  { path: "/brewsoul/experiences", title: "Coffee Experiences", description: "Cupping sessions, farm visits, barista workshops — immersive coffee experiences around the world.", category: "brewsoul", tags: "experiences, cupping, farm visit, workshop, immersive", boost: 1 },
  { path: "/brewsoul/wall-of-shame", title: "BrewSoul Wall of Shame", description: "The worst offenders in coffee — greenwashing, exploitation, and misleading marketing exposed.", category: "brewsoul", tags: "wall of shame, greenwashing, exploitation, worst, exposed", boost: 2 },
  { path: "/brewsoul/follow-the-dollar", title: "Follow the Dollar", description: "Where your coffee dollar actually goes — from farm to cup, the complete financial breakdown.", category: "brewsoul", tags: "follow the dollar, money, breakdown, farm to cup, economics", boost: 2 },
  { path: "/brewsoul/quiz", title: "BrewSoul Quiz", description: "Find your coffee personality — a quick assessment to discover your ideal brew style.", category: "brewsoul", subcategory: "assessment", tags: "quiz, coffee personality, assessment, brew style", boost: 2 },
  { path: "/brewsoul/first-sip", title: "First Sip", description: "New to specialty coffee? Start here — a beginner's guide to tasting, brewing, and appreciating great coffee.", category: "brewsoul", tags: "first sip, beginner, guide, start, tasting, brewing", boost: 2 },
  { path: "/brewsoul/directory", title: "BrewSoul Directory", description: "Complete index of all BrewSoul pages — research, tools, rankings, science, reference library.", category: "brewsoul", tags: "directory, index, all pages, sitemap, complete list", boost: 1 },

  // ── Kava ──
  { path: "/kava", title: "Kava", description: "The complete kava guide — origins, science, preparation, varieties, and the truth about safety.", category: "kava", tags: "kava, guide, complete, science, safety, preparation", boost: 3 },
  { path: "/kava/origins", title: "Kava Origins", description: "3,000 years of kava history — from Pacific Island ceremony to modern wellness culture.", category: "kava", tags: "kava origins, history, pacific island, ceremony, tradition", boost: 2 },
  { path: "/kava/interactions", title: "Kava Interactions", description: "Drug interactions with kava — what's safe, what's not, and what the research actually shows.", category: "kava", tags: "kava interactions, drugs, safety, contraindications, research", boost: 2 },
  { path: "/kava/myths", title: "Kava Myths Debunked", description: "7 persistent kava myths examined against WHO data, peer-reviewed research, and 3,000 years of traditional use.", category: "kava", tags: "kava myths, debunked, liver, hepatotoxicity, safety, WHO", boost: 2 },
  { path: "/kava/bars", title: "Kava Bars", description: "The best kava bars in the US — reviews, locations, and what to order at each one.", category: "kava", tags: "kava bars, locations, reviews, where to drink, best bars", boost: 2 },
  { path: "/kava/prep", title: "Kava Preparation", description: "How to prepare kava — traditional straining, instant, concentrate, and the perfect shell.", category: "kava", tags: "kava preparation, how to make, straining, instant, recipe", boost: 2 },
  { path: "/kava/science", title: "Kava Science", description: "The pharmacology of kava — kavalactones, GABA receptors, anxiolytic effects, and clinical trials.", category: "kava", tags: "kava science, kavalactones, GABA, pharmacology, clinical trials", boost: 2 },
  { path: "/kava/varieties", title: "Kava Varieties", description: "Noble vs. tudei kava — the varieties, chemotypes, and how to identify quality kava.", category: "kava", tags: "kava varieties, noble, tudei, chemotype, quality, identification", boost: 2 },

  // ── Peptides ──
  { path: "/peptide-watch", title: "PeptideWatch Safety Guide", description: "The definitive consumer safety guide — 12 fraud patterns, 18 enforcement actions, 10-question supply chain test, vendor scorecard.", category: "peptide", tags: "peptide watch, safety, fraud, enforcement, fda, vendor, scorecard, semaglutide, tirzepatide, bpc-157", boost: 3 },
  { path: "/rip-peptide-sciences", title: "RIP Peptide Sciences", description: "The rise and fall of Peptide Sciences — what happened, why it matters, and what it means for the industry.", category: "peptide", tags: "peptide sciences, rip, shutdown, industry, research peptides", boost: 2 },
  { path: "/whats-legal", title: "What's Legal", description: "Peptide legality guide — what's legal, what's not, and the gray areas in between.", category: "peptide", tags: "legal, peptide law, regulation, gray market, research use only", boost: 2 },
  { path: "/verify-your-coa", title: "Verify Your COA", description: "How to verify a Certificate of Analysis — spot fakes, check lab credentials, and protect yourself.", category: "peptide", tags: "coa, certificate of analysis, verify, fake, lab, testing", boost: 2 },
  { path: "/price-tracker", title: "Peptide Price Tracker", description: "Real-time peptide price comparison across vendors — semaglutide, tirzepatide, BPC-157, and more.", category: "peptide", tags: "price tracker, comparison, semaglutide, tirzepatide, bpc-157, cost", boost: 2 },
  { path: "/test-your-peptides", title: "Test Your Peptides", description: "How to independently test your peptides — HPLC, mass spec, and third-party lab options.", category: "peptide", tags: "test, hplc, mass spec, lab testing, purity, verification", boost: 2 },
  { path: "/peptide-library", title: "Peptide Library", description: "Comprehensive peptide reference library — mechanisms, dosing, research status, and safety profiles.", category: "peptide", tags: "peptide library, reference, mechanisms, dosing, research, safety", boost: 2 },
  { path: "/peyote-mescaline", title: "Peyote & Mescaline Deep Dive", description: "Comprehensive guide to peyote and mescaline — history, pharmacology, legal status, and therapeutic potential.", category: "peptide", subcategory: "psychedelic", tags: "peyote, mescaline, psychedelic, history, pharmacology, therapeutic", boost: 2 },

  // ── Charity ──
  { path: "/charity-scorecard", title: "Grand Impact Accountability Index", description: "103 charities scored across 7 dimensions from 8 evaluators. The Cloak-vs-Clear metric reveals who's transparent.", category: "page", subcategory: "charity", tags: "charity, scorecard, accountability, impact, transparency, nonprofit, donation", boost: 3 },

  // ── Other ──
  { path: "/alex-azzi", title: "The Cheshire Grin", description: "Community evidence database — anonymous submissions documenting patterns of behavior.", category: "page", tags: "cheshire grin, evidence, anonymous, submissions, accountability", boost: 2 },
  { path: "/amplifier", title: "The Amplifier", description: "Tools and frameworks for amplifying your message, building authority, and creating leverage.", category: "page", tags: "amplifier, tools, frameworks, authority, leverage, message", boost: 1 },
  { path: "/akbar", title: "Akbar", description: "The Akbar framework — a decision-making tool for navigating complex situations.", category: "page", tags: "akbar, framework, decision making, navigation, tool", boost: 1 },
  { path: "/diamond-cut", title: "Diamond Cut", description: "The Diamond Cut framework — precision tools for evaluating opportunities and cutting through noise.", category: "page", tags: "diamond cut, framework, evaluation, precision, opportunities", boost: 1 },
  { path: "/spirits", title: "Spirits Guide", description: "The complete spirits guide — whiskey, gin, rum, tequila, mezcal, and craft distilling.", category: "page", subcategory: "lifestyle", tags: "spirits, whiskey, gin, rum, tequila, mezcal, guide", boost: 1 },
];

function indexStaticPages(): InsertSearchIndexEntry[] {
  return STATIC_PAGES.map((page) => ({
    contentKey: `page:${page.path}`,
    title: page.title,
    path: page.path,
    excerpt: page.description,
    body: page.description, // Static pages have minimal body — description IS the content
    category: page.category,
    subcategory: page.subcategory || null,
    tags: page.tags,
    imageUrl: null,
    boost: page.boost || 1,
    contentUpdatedAt: new Date(),
    indexedAt: new Date(),
  }));
}

/* ── Content Source: Iboga Deep-Dive Pages ── */

/**
 * Index the full text content of /iboga-ibogaine and /iboga-compass.
 * These are React-rendered pages with no JSON data file, so we manually
 * capture all key content here for full-text search coverage.
 */
function indexIbogaContent(): InsertSearchIndexEntry[] {
  const IBOGA_DEEPDIVE_BODY = [
    // Page identity
    "Iboga vs Ibogaine The Plant vs The Isolate",
    "Twelve companion alkaloids in sacred synergy or one purified molecule under cardiac monitoring.",
    "The Bwiti have known for centuries what Western medicine is only now beginning to measure.",
    "Iboga 24 to 72 hours Ibogaine 18 to 36 hours cardiac screening mandatory",

    // Alkaloid profiles
    "Alkaloid Profiles The Entourage Effect Tabernanthe iboga root bark contains at least twelve identified indole alkaloids approximately 6 percent of the dried bark by weight.",
    "Ibogaine is the most abundant 50 to 80 percent of total alkaloid content but the companion alkaloids ibogamine tabernanthine voacangine coronaridine ibogaline and noribogaine each contribute distinct pharmacological actions.",
    "Like cannabis THC CBD terpenes and ayahuasca DMT harmalines iboga full alkaloid profile may produce synergistic effects that isolated ibogaine cannot replicate.",
    "Coronaridine shows independent anti-addictive properties at NIDA. Tabernanthine provides the stimulant phase. Voacangine contributes anti-inflammatory action.",
    "Noribogaine 12-OH-ibogamine primary metabolite of ibogaine mu-opioid agonist SERT inhibitor half-life 24 to 48 hours sustained afterglow.",

    // Receptor pharmacology
    "Receptor Pharmacology Multi-Target Mechanism NMDA glutamate non-competitive antagonist addiction interruption neuroplasticity neuroprotection.",
    "Kappa opioid KOR agonist anti-addictive effects dysphoria modulation. Mu-opioid MOR weak agonist opioid withdrawal attenuation.",
    "SERT serotonin transporter inhibitor antidepressant mood elevation. DAT dopamine transporter inhibitor reward circuit reset motivation.",
    "5-HT2A partial agonist psychedelic visionary experience. Nicotinic antagonist smoking cessation potential. GDNF BDNF upregulation long-term neuroplasticity dopamine neuron repair.",
    "Noribogaine The Hidden Duration ibogaine half-life 4 to 7 hours metabolite noribogaine persists 24 to 48 hours stronger mu-opioid and SERT binding.",
    "Cardiac monitoring must continue for at least 72 hours post-treatment.",

    // Head-to-head comparison
    "Head-to-head comparison iboga whole plant versus ibogaine HCl isolate.",
    "Iboga duration 24 to 72 hours ibogaine 18 to 36 hours. Iboga cardiac risk moderate ibogaine high.",
    "Iboga legal status Schedule I US ibogaine legal status Schedule I US. Both require medical supervision.",
    "Iboga traditional Bwiti ceremony ibogaine clinical protocol. Iboga entourage effect ibogaine single molecule.",

    // Clinical outcomes
    "Clinical Outcomes Addiction Interruption opioid detox 60 to 80 percent success rate single treatment.",
    "PTSD treatment 88 percent reduction in PTSD symptoms Stanford Nature Medicine 2023 study Navy SEALs special operations veterans.",
    "TBI traumatic brain injury treatment Mission Within 80 percent no longer meeting PTSD diagnostic criteria.",
    "19071 patient safety study ibogaine cardiac monitoring protocols.",
    "Ambio Life Sciences Stanford MISTIC study 30 Navy SEALs Nature Medicine paper world first Nagoya-compliant ibogaine clinic.",

    // Personal narrative - Tony's experience
    "I sat iboga at The Mission Within. I witnessed it. Personal experience not research.",
    "Six-week clinical program built for special operations veterans and their families.",
    "Virtual preparation five-day in-person medicine retreat ibogaine ceremony overnight individual 5-MeO-DMT sessions therapist-led integration.",
    "1200 plus veterans and family members treated since 2017. 80 percent no longer meeting PTSD diagnostic criteria.",

    // Dr. Martin Polanco
    "Dr Martin Polanco founder The Mission Within Mexican-licensed physician 26 years clinical experience ibogaine medicine.",
    "Most experienced ibogaine physician in North America. Treated more than 5000 patients.",
    "Founded first medically supervised ibogaine clinic in North America near Tijuana 2001.",
    "Martin Polanco MD founder Mission Within ibogaine veterans PTSD treatment Baja California Mexico.",

    // Updated research 2024-2026
    "Updated Research Data 2024 to 2026. Stanford Nature Medicine 2023 ibogaine plus lithium 30 special operations veterans.",
    "88 percent reduction PTSD symptoms 87 percent reduction depression 81 percent reduction anxiety.",
    "MAPS Phase 3 MDMA-AT PTSD FDA review 2024. NYU Psilocybin AUD trial 2024 83 percent abstinence.",
    "Ambio Life Sciences 19071 patient safety study cardiac monitoring protocols zero fatalities.",
    "White House Executive Order April 2026 psychedelic medicine veterans. Texas SB 2308 ibogaine research program.",
    "VA military ibogaine treatment does not affect VA eligibility or benefit status.",

    // Hard stops and contraindications
    "Hard Stops Contraindications Cardiac Non-Negotiable Long QT Syndrome QTc above 450ms on any EKG.",
    "In a 14-patient Dutch clinical study 50 percent reached QTc above 500ms during treatment.",
    "Every known ibogaine fatality has involved either an undetected cardiac condition or inadequate monitoring.",
    "Diagnosed heart disease arrhythmia Brugada syndrome history of cardiac events.",
    "Family history sudden cardiac death under 50 known inherited Long QT.",
    "Any clinic that will take you without a 12-lead EKG reviewed by a physician is telling you something important about their standards.",
    "Severe liver disease liver enzymes above 2.5 times normal ibogaine metabolized via CYP450-2D6.",
    "Uncontrolled seizure disorder. Pregnancy or breastfeeding. Active psychosis acute bipolar mania schizophrenia schizoaffective disorder.",
    "Ibogaine is an oneirogen a waking dream lasting 8 to 20 hours.",

    // Medications problem
    "The Medications Problem MAO inhibitors MAOIs serious serotonin syndrome risk weeks of washout.",
    "QT-prolonging medications certain antipsychotics antibiotics anti-nausea drugs.",
    "SSRIs 2 to 6 weeks washout fluoxetine requires 5 to 6 weeks.",
    "Methadone 4 to 6 weeks supervised transition. Buprenorphine Suboxone supervised taper.",
    "Benzodiazepines abrupt stop triggers seizures. Daily alcohol same seizure risk.",
    "Full medication disclosure to your treatment team is non-negotiable. Undisclosed drug interactions are how people die.",

    // Facilities
    "The Mission Within Baja California Mexico veterans only founded Dr Martin Polanco missionwithin.org.",
    "SEAL Future Foundation SOC-F Heroic Hearts Project The Hope Project partners Mission Within.",
    "Ambio Life Sciences Tijuana Playas de Tijuana Baja California Mexico ambio.life from 7350 USD.",
    "Netflix In Waves and War November 2025 filmed at Ambio. GITA-aligned. Nagoya-compliant.",
    "Jonathan Dickinson co-founder Ambio received Missoko Bwiti initiation in Gabon.",
    "Beond Ibogaine Cancun Quintana Roo Mexico 9 MDs 23 RNs on-site Stanford-aligned cardiac protocols beondibogaine.com.",
    "Beond Service veteran program launched January 2025. Plants 3 iboga trees in Gabon per treatment through Blessings of the Forest.",
    "MindScape Retreat Cozumel Quintana Roo Mexico 900 plus patients zero cardiac events mindscaperetreat.com.",
    "MindScape publishes full contraindications list cardiac screening protocol QTc thresholds publicly. 90-day structured aftercare included.",
    "Clear Sky Recovery Cancun Mexico 7 to 10 day programs opioid alcohol addiction clearskyrecovery.com.",
    "Experience Ibogaine Baja California Mexico cocaine meth program experienceibogaine.com.",
    "Iboga Quest Baja California Mexico ibogaquest.com.",
    "Tabula Rasa Retreat Portugal Europe ibogaine treatment tabularasaretreat.com.",
    "Bwiti House Gabon Africa traditional ceremony bwitihouse.com.",
    "The Iboga Institute South Africa theibogainstitute.org.",
    "New Roots Ibogaine Mexico newrootsibogaine.com.",
    "Transcend Ibogaine Mexico transcendibogaine.com.",
    "Root Healing Mexico roothealing.com.",
    "Iboga Wellness Mexico ibogawellness.com.",
    "Awakening Soul Mexico awakeningsoul.com.",
    "Removed facilities Ibogaine by David Dardashti unsafe conditions absent medical oversight removed from list.",
    "Crossroads Treatment Center permanently closed 2025 removed from list.",

    // Extractive capitalism
    "The Extractive Capitalism Problem Nagoya Protocol Convention on Biological Diversity 2010.",
    "Tabernanthe iboga is endemic to Gabon Cameroon Equatorial Guinea. Bwiti people have used it for centuries.",
    "Pharmaceutical companies filing patents on ibogaine derivatives without benefit-sharing agreements with Gabonese communities.",
    "Ambio Life Sciences world first Nagoya-compliant ibogaine clinic. Beond plants iboga trees in Gabon.",

    // US legal status
    "US Legal Status 2026 ibogaine Schedule I DEA federal law.",
    "Mexico legal ibogaine treatment. Costa Rica legal. Portugal legal.",
    "State Department travel advisory Level 2 Cancun Quintana Roo Mexico.",
    "April 2026 White House Executive Order psychedelic medicine veterans ibogaine research.",
    "Texas SB 2308 ibogaine research program passed 2025.",
    "Oregon Measure 109 psilocybin therapy licensed facilitators 2023.",

    // Sources
    "Sources References Stanford Nature Medicine 2023 Mash et al 2018 opioid cocaine detoxification outcomes Frontiers in Pharmacology.",
    "Global Ibogaine Therapy Alliance GITA guidelines Americans for Ibogaine.",
    "New York Times December 2024 veterans psychedelics brain injury PTSD ibogaine.",
    "UCSF ibogaine research. NIH ibogaine clinical trials. FDA Breakthrough Therapy designation.",
    "Erowid ibogaine safety. Drug Policy Alliance ibogaine. DoubleBlind magazine ibogaine.",

    // Phrase combinations for multi-word search
    "Ibogaine opioid withdrawal treatment heroin fentanyl oxycodone morphine detox.",
    "Ibogaine opioid withdrawal attenuation mu-opioid receptor weak agonist.",
    "Ibogaine alcohol withdrawal treatment addiction interruption.",
    "Ibogaine PTSD treatment veterans special operations Navy SEALs.",
    "Ibogaine TBI traumatic brain injury treatment Mission Within.",
    "Ibogaine depression treatment antidepressant SERT serotonin.",
    "Ibogaine anxiety treatment 81 percent reduction Stanford study.",
    "Ibogaine cardiac safety QTc monitoring protocol.",
    "Ibogaine facility Mexico treatment center clinic.",
    "Ibogaine cost price range 5000 to 20000 USD.",
    "Ibogaine legal Mexico Costa Rica Portugal Europe.",
    "Ibogaine Schedule I DEA federal law United States.",
    "Ibogaine veterans White House Executive Order 2026.",
    "Ibogaine research clinical trial FDA breakthrough therapy.",
    "Ibogaine safety fatality cardiac monitoring protocol.",
    "Ibogaine preparation washout SSRI methadone buprenorphine.",
    "Ibogaine integration aftercare support community.",
    "Ibogaine Bwiti ceremony traditional Gabon Africa.",
    "Ibogaine noribogaine metabolite half-life 24 to 48 hours.",
    "Ibogaine neuroplasticity GDNF BDNF dopamine repair.",
    "Ibogaine addiction interruption opioid cocaine methamphetamine alcohol.",
    "Ibogaine smoking cessation nicotinic antagonist.",
    "Ibogaine psychedelic visionary experience oneirogen waking dream.",
    "Ibogaine 5-MeO-DMT combination therapy Mission Within.",
    "Ibogaine lithium Stanford MISTIC study Nature Medicine.",
    "Ibogaine Ambio Life Sciences Nagoya-compliant clinic.",
    "Ibogaine Beond Cancun Mexico veterans program.",
    "Ibogaine MindScape Cozumel Mexico zero cardiac events.",
    "Ibogaine Clear Sky Recovery Cancun opioid alcohol.",
    "Ibogaine Tabula Rasa Portugal Europe treatment.",
    "Ibogaine Bwiti House Gabon Africa traditional ceremony.",
    "Ibogaine Dr Martin Polanco physician 5000 patients.",
    "Ibogaine Tony Greenberg personal experience sat with medicine.",

    // Supplement stacks
    "Supplement stacks before ibogaine magnesium glycinate CoQ10 ubiquinol omega-3 EPA DHA NAC N-acetyl cysteine.",
    "Electrolytes potassium magnesium sodium. Melatonin sleep support. Vitamin D3 K2.",

    // Compass assessment
    "Iboga Compass Assessment 28 questions 10 sections 14 substance and behavior categories full medical screening.",
    "Substance dependency opioids alcohol stimulants PTSD trauma treatment-resistant depression.",
    "Neurodegenerative condition TBI Parkinson spiritual exploration Bwiti initiation cognitive optimization.",
    "Budget range under 5000 5000 to 10000 10000 to 20000 over 20000.",
    "Geography North America Mexico Central America South America Europe Africa.",
    "Cardiac screening EKG required medical clearance physician review.",
    "Integration support aftercare peer support community veteran program.",
  ].join(" ");

  const IBOGA_COMPASS_BODY = [
    "Iboga Compass Assessment 28 questions across 10 sections.",
    "Section 1 What You Are Seeking substance dependency opioids alcohol stimulants PTSD trauma treatment-resistant depression.",
    "Neurodegenerative condition TBI Parkinson spiritual exploration Bwiti initiation cognitive optimization personal growth process addiction.",
    "How urgent is your timeline within 30 days 1 to 3 months 3 to 6 months no rush.",
    "Section 2 Substance and Behavior opioids heroin fentanyl oxy morphine opioid replacement Suboxone methadone.",
    "Alcohol cocaine crack methamphetamine cannabis nicotine prescription stimulants Adderall Ritalin benzodiazepines Xanax Klonopin Valium ketamine MDMA ecstasy polydrug.",
    "Section 3 Medical Screening cardiac history EKG QTc Long QT Syndrome arrhythmia Brugada.",
    "Liver enzymes CYP450-2D6 seizure disorder pregnancy psychiatric history psychosis bipolar schizophrenia.",
    "Section 4 Path and Values traditional Bwiti ceremony clinical protocol hybrid approach.",
    "Section 5 Budget and Time under 5000 5000 to 10000 10000 to 20000 over 20000.",
    "Section 6 Geography North America Mexico Central America South America Europe Africa.",
    "Section 7 Experience and Identity previous psychedelic experience military veteran first responder civilian.",
    "Section 8 Comfort level with ceremony duration 18 to 36 hours 24 to 72 hours.",
    "Section 9 Integration and Family aftercare support peer community family involvement.",
    "Section 10 Protocol and Motivation readiness commitment follow-through integration plan.",
    "Results facility matching scoring algorithm dimension weights hard filters priority rank multipliers.",
    "Mission Within Ambio Beond MindScape Clear Sky Experience Ibogaine Iboga Quest Tabula Rasa Bwiti House.",
    "Lead capture name email situation consent Tony Greenberg personal review every submission.",
    "I have sat with this medicine I know these facilities.",
  ].join(" ");

  return [
    {
      contentKey: "page:/iboga-ibogaine",
      title: "Iboga & Ibogaine — The Full Deep Dive",
      path: "/iboga-ibogaine",
      excerpt: "The plant vs the isolate. Twelve companion alkaloids in sacred synergy — or one purified molecule under cardiac monitoring. Alkaloid profiles, receptor pharmacology, clinical outcomes, facility directory with Dr. Martín Polanco and The Mission Within, contraindications, and the extractive capitalism problem.",
      body: IBOGA_DEEPDIVE_BODY,
      category: "psychedelic",
      subcategory: "iboga",
      tags: "iboga, ibogaine, noribogaine, bwiti, tabernanthe iboga, martin polanco, mission within, ambio, beond, stanford, nature medicine, PTSD, veterans, opioid, addiction, cardiac, QTc, Long QT, NMDA, kappa opioid, serotonin, dopamine, neuroplasticity, GDNF, BDNF, 5-MeO-DMT, psychedelic, Mexico, Gabon, Nagoya, extractive capitalism, Schedule I, ibogaine treatment, ibogaine safety, ibogaine facilities, ibogaine research, ibogaine clinical trial",
      imageUrl: null,
      boost: 5,
      contentUpdatedAt: new Date(),
      indexedAt: new Date(),
    },
    {
      contentKey: "page:/iboga-compass",
      title: "Iboga Compass — Readiness & Facility Matching Assessment",
      path: "/iboga-compass",
      excerpt: "28-question assessment across 10 sections. Evaluates your readiness for ibogaine-assisted therapy, screens for cardiac and medical contraindications, and matches you to the right facility based on your goals, budget, geography, and substance history. Tony Greenberg reviews every submission personally.",
      body: IBOGA_COMPASS_BODY,
      category: "assessment",
      subcategory: "psychedelic",
      tags: "iboga compass, ibogaine assessment, readiness, facility matching, cardiac screening, substance dependency, opioid, PTSD, veterans, Mission Within, Ambio, Beond, MindScape, ibogaine therapy, psychedelic readiness, Tony Greenberg",
      imageUrl: null,
      boost: 4,
      contentUpdatedAt: new Date(),
      indexedAt: new Date(),
    },
  ];
}

/* ── Content Source: BrewSoul Coffees ── */

async function indexBrewSoulCoffees(): Promise<InsertSearchIndexEntry[]> {
  try {
    const mod = await import("../client/src/data/brewsoul-coffees-expanded.ts");
    const coffees = mod.COFFEES_EXPANDED || [];
    return coffees.map((c: any) => {
      const tastingNotes = Array.isArray(c.tastingNotes) ? c.tastingNotes.join(", ") : (c.tastingNotes || "");
      const bodyParts = [
        c.connoisseurNote,
        tastingNotes,
        c.producer,
        c.originRegion,
        c.originFarm,
        c.variety,
        c.processingMethod,
        c.roastLevel,
      ].filter(Boolean);
      return {
        contentKey: `brewsoul-coffee:${c.id}`,
        title: c.name || "Unknown Coffee",
        path: `/brewsoul/coffee/${c.id}`,
        excerpt: truncate(c.connoisseurNote || tastingNotes || "", 300),
        body: bodyParts.join(" "),
        category: "brewsoul",
        subcategory: "coffee",
        tags: [c.originCountry, c.producer, c.variety, c.processingMethod, c.roastLevel, ...(c.tastingNotes || [])].filter(Boolean).join(", "),
        imageUrl: null,
        boost: 1,
        contentUpdatedAt: new Date(),
        indexedAt: new Date(),
      };
    });
  } catch {
    console.warn("[Search Indexer] Could not import brewsoul-coffees-expanded");
    return [];
  }
}

/* ── Content Source: BrewSoul Chains ── */

async function indexBrewSoulChains(): Promise<InsertSearchIndexEntry[]> {
  try {
    const mod = await import("../client/src/data/brewsoul-chains.ts");
    const chains = mod.CHAIN_RANKINGS || [];
    return chains.map((c: any) => ({
      contentKey: `brewsoul-chain:${c.slug || c.name}`,
      title: c.name || "Unknown Chain",
      path: `/brewsoul/chains#${c.slug || ""}`,
      excerpt: truncate(c.verdict || c.description || "", 300),
      body: [c.description, c.verdict, c.history, c.pros, c.cons].filter(Boolean).join(" "),
      category: "brewsoul",
      subcategory: "chain",
      tags: [c.name, "coffee chain", "review", "scorecard"].filter(Boolean).join(", "),
      imageUrl: c.logo || null,
      boost: 1,
      contentUpdatedAt: new Date(),
      indexedAt: new Date(),
    }));
  } catch {
    console.warn("[Search Indexer] Could not import brewsoul-chains");
    return [];
  }
}

/* ── Content Source: Charity Data ── */

async function indexCharities(): Promise<InsertSearchIndexEntry[]> {
  try {
    const mod = await import("../client/src/data/charityData.ts");
    const charities = mod.CHARITIES || [];
    return charities.map((c: any) => ({
      contentKey: `charity:${c.slug || c.name}`,
      title: c.name || "Unknown Charity",
      path: `/charity-scorecard/${c.slug || ""}`,
      excerpt: truncate(c.mission || c.description || "", 300),
      body: [c.mission, c.description, c.category, c.verdict].filter(Boolean).join(" "),
      category: "page",
      subcategory: "charity",
      tags: [c.name, c.category, "charity", "nonprofit", "scorecard"].filter(Boolean).join(", "),
      imageUrl: null,
      boost: 1,
      contentUpdatedAt: new Date(),
      indexedAt: new Date(),
    }));
  } catch {
    console.warn("[Search Indexer] Could not import charityData");
    return [];
  }
}

/* ── Content Source: BrewSoul Cities ── */

async function indexCities(): Promise<InsertSearchIndexEntry[]> {
  try {
    const mod = await import("../client/src/data/cityData.ts");
    const cities = mod.CITIES || [];
    return cities.map((c: any) => ({
      contentKey: `brewsoul-city:${c.slug || c.name}`,
      title: `${c.name || "Unknown City"} — Coffee Guide`,
      path: `/brewsoul/cities/${c.slug || ""}`,
      excerpt: truncate(c.description || c.intro || "", 300),
      body: [c.description, c.intro, c.highlights, c.history].filter(Boolean).join(" "),
      category: "brewsoul",
      subcategory: "city",
      tags: [c.name, c.country, "coffee city", "travel", "guide"].filter(Boolean).join(", "),
      imageUrl: null,
      boost: 1,
      contentUpdatedAt: new Date(),
      indexedAt: new Date(),
    }));
  } catch {
    console.warn("[Search Indexer] Could not import cityData");
    return [];
  }
}

/* ── Content Source: BrewSoul Encyclopedia ── */

async function indexEncyclopedia(): Promise<InsertSearchIndexEntry[]> {
  try {
    const mod = await import("../client/src/data/brewsoul-encyclopedia.ts");
    const entries = mod.VARIETIES || [];
    return entries.map((e: any) => ({
      contentKey: `brewsoul-encyclopedia:${e.slug || e.term || e.title}`,
      title: e.term || e.title || "Unknown Term",
      path: `/brewsoul/glossary#${e.slug || ""}`,
      excerpt: truncate(e.definition || e.description || "", 300),
      body: [e.definition, e.description, e.details, e.relatedTerms].filter(Boolean).join(" "),
      category: "brewsoul",
      subcategory: "encyclopedia",
      tags: [e.term, e.category, "coffee", "encyclopedia", "glossary"].filter(Boolean).join(", "),
      imageUrl: null,
      boost: 1,
      contentUpdatedAt: new Date(),
      indexedAt: new Date(),
    }));
  } catch {
    console.warn("[Search Indexer] Could not import brewsoul-encyclopedia");
    return [];
  }
}

/* ── Main Indexer ── */

export async function rebuildSearchIndex(): Promise<{ indexed: number; errors: string[] }> {
  const db = await getDb();
  if (!db) return { indexed: 0, errors: ["Database not available"] };

  const errors: string[] = [];
  let allEntries: InsertSearchIndexEntry[] = [];

  // Collect from all sources
  try {
    const blogEntries = await indexBlogPosts();
    allEntries.push(...blogEntries);
    console.log(`[Search Indexer] Blog posts: ${blogEntries.length}`);
  } catch (e: any) {
    errors.push(`Blog posts: ${e.message}`);
  }

  try {
    const pageEntries = indexStaticPages();
    allEntries.push(...pageEntries);
    console.log(`[Search Indexer] Static pages: ${pageEntries.length}`);
  } catch (e: any) {
    errors.push(`Static pages: ${e.message}`);
  }

  try {
    const ibogaEntries = indexIbogaContent();
    allEntries.push(...ibogaEntries);
    console.log(`[Search Indexer] Iboga content: ${ibogaEntries.length}`);
  } catch (e: any) {
    errors.push(`Iboga content: ${e.message}`);
  }

  try {
    const coffeeEntries = await indexBrewSoulCoffees();
    allEntries.push(...coffeeEntries);
    console.log(`[Search Indexer] BrewSoul coffees: ${coffeeEntries.length}`);
  } catch (e: any) {
    errors.push(`BrewSoul coffees: ${e.message}`);
  }

  try {
    const chainEntries = await indexBrewSoulChains();
    allEntries.push(...chainEntries);
    console.log(`[Search Indexer] BrewSoul chains: ${chainEntries.length}`);
  } catch (e: any) {
    errors.push(`BrewSoul chains: ${e.message}`);
  }

  try {
    const charityEntries = await indexCharities();
    allEntries.push(...charityEntries);
    console.log(`[Search Indexer] Charities: ${charityEntries.length}`);
  } catch (e: any) {
    errors.push(`Charities: ${e.message}`);
  }

  try {
    const cityEntries = await indexCities();
    allEntries.push(...cityEntries);
    console.log(`[Search Indexer] Cities: ${cityEntries.length}`);
  } catch (e: any) {
    errors.push(`Cities: ${e.message}`);
  }

  try {
    const encyclopediaEntries = await indexEncyclopedia();
    allEntries.push(...encyclopediaEntries);
    console.log(`[Search Indexer] Encyclopedia: ${encyclopediaEntries.length}`);
  } catch (e: any) {
    errors.push(`Encyclopedia: ${e.message}`);
  }

  // Validate and clean entries
  allEntries = allEntries.filter((entry, idx) => {
    if (!entry.contentKey || !entry.title || !entry.path || !entry.category) {
      console.warn(`[Search Indexer] Skipping invalid entry at index ${idx}:`, JSON.stringify({ contentKey: entry.contentKey, title: entry.title }));
      return false;
    }
    return true;
  });

  // Deduplicate by contentKey
  const seen = new Set<string>();
  allEntries = allEntries.filter((entry) => {
    if (seen.has(entry.contentKey)) {
      console.warn(`[Search Indexer] Duplicate contentKey: ${entry.contentKey}`);
      return false;
    }
    seen.add(entry.contentKey);
    return true;
  });

  // Wipe and repopulate
  console.log(`[Search Indexer] Total entries to index: ${allEntries.length}`);

  try {
    await db.delete(searchIndex);

    // Insert in batches of 20 to avoid query size limits
    const BATCH_SIZE = 20;
    for (let i = 0; i < allEntries.length; i += BATCH_SIZE) {
      const batch = allEntries.slice(i, i + BATCH_SIZE);
      try {
        await db.insert(searchIndex).values(batch);
      } catch (batchErr: any) {
        console.error(`[Search Indexer] Batch ${i}-${i + batch.length} failed: ${batchErr.message}`);
        // Try inserting one by one to find the problematic entry
        for (const entry of batch) {
          try {
            await db.insert(searchIndex).values([entry]);
          } catch (singleErr: any) {
            console.error(`[Search Indexer] Failed entry: ${entry.contentKey} — ${singleErr.message}`);
          }
        }
      }
    }

    console.log(`[Search Indexer] Successfully indexed ${allEntries.length} entries`);
  } catch (e: any) {
    errors.push(`Insert failed: ${e.message}`);
    console.error("[Search Indexer] Insert error:", e);
  }

  return { indexed: allEntries.length, errors };
}

/* ── Search Query ── */

export async function searchContent(
  query: string,
  options: { category?: string; limit?: number; offset?: number } = {}
): Promise<{
  results: Array<{
    id: number;
    title: string;
    path: string;
    excerpt: string | null;
    snippet: string | null;
    category: string;
    subcategory: string | null;
    tags: string | null;
    imageUrl: string | null;
    score: number;
  }>;
  total: number;
}> {
  const db = await getDb();
  if (!db) return { results: [], total: 0 };

  const { category, limit = 20, offset = 0 } = options;
  const q = query.toLowerCase().trim();
  if (!q) return { results: [], total: 0 };

  const words = q.split(/\s+/).filter((w) => w.length > 1);
  const like = `%${q}%`;

  try {
    // Build the WHERE clause using drizzle sql template
    let whereConditions = sql`(
      LOWER(title) LIKE ${like}
      OR LOWER(body) LIKE ${like}
      OR LOWER(tags) LIKE ${like}
      OR LOWER(excerpt) LIKE ${like}
    )`;

    // For multi-word queries, also require each word to appear somewhere
    if (words.length > 1) {
      for (const word of words) {
        const wordLike = `%${word}%`;
        whereConditions = sql`${whereConditions} AND (
          LOWER(title) LIKE ${wordLike}
          OR LOWER(body) LIKE ${wordLike}
          OR LOWER(tags) LIKE ${wordLike}
          OR LOWER(excerpt) LIKE ${wordLike}
        )`;
      }
    }

    if (category) {
      whereConditions = sql`${whereConditions} AND category = ${category}`;
    }

    // Count total matches
    const countRows = await db.execute(
      sql`SELECT COUNT(*) as total FROM search_index WHERE ${whereConditions}`
    );
    let total = 0;
    if (Array.isArray(countRows) && countRows.length > 0) {
      // Handle both [rows, fields] and rows-only formats
      const rows = Array.isArray(countRows[0]) ? countRows[0] : countRows;
      if (rows.length > 0) {
        total = Number((rows[0] as any).total) || 0;
      }
    }

    // Search with scoring
    const searchRows = await db.execute(
      sql`SELECT id, title, path, excerpt, body, category, subcategory, tags, image_url as imageUrl, boost,
        (
          (CASE WHEN LOWER(title) = ${q} THEN 200 WHEN LOWER(title) LIKE ${q + '%'} THEN 100 WHEN LOWER(title) LIKE ${like} THEN 60 ELSE 0 END) +
          (CASE WHEN LOWER(tags) LIKE ${like} THEN 50 ELSE 0 END) +
          (CASE WHEN LOWER(excerpt) LIKE ${like} THEN 30 ELSE 0 END) +
          (CASE WHEN LOWER(body) LIKE ${like} THEN 10 ELSE 0 END) +
          (boost * 10)
        ) as score
      FROM search_index
      WHERE ${whereConditions}
      ORDER BY score DESC, boost DESC
      LIMIT ${limit} OFFSET ${offset}`
    );

    // Normalize rows (handle [rows, fields] format)
    let resultRows: any[] = [];
    if (Array.isArray(searchRows)) {
      resultRows = Array.isArray(searchRows[0]) ? searchRows[0] : searchRows;
    }

    // Extract snippets from body text
    const results = resultRows.map((row: any) => {
      let snippet: string | null = null;
      if (row.body) {
        const bodyLower = row.body.toLowerCase();
        const idx = bodyLower.indexOf(q);
        if (idx !== -1) {
          const start = Math.max(0, idx - 60);
          const end = Math.min(row.body.length, idx + q.length + 100);
          snippet = (start > 0 ? "\u2026" : "") + row.body.slice(start, end).replace(/\n+/g, " ").trim() + (end < row.body.length ? "\u2026" : "");
        } else if (words.length > 0) {
          for (const word of words) {
            const wIdx = bodyLower.indexOf(word);
            if (wIdx !== -1) {
              const start = Math.max(0, wIdx - 60);
              const end = Math.min(row.body.length, wIdx + word.length + 100);
              snippet = (start > 0 ? "\u2026" : "") + row.body.slice(start, end).replace(/\n+/g, " ").trim() + (end < row.body.length ? "\u2026" : "");
              break;
            }
          }
        }
      }

      return {
        id: row.id,
        title: row.title,
        path: row.path,
        excerpt: row.excerpt,
        snippet,
        category: row.category,
        subcategory: row.subcategory,
        tags: row.tags,
        imageUrl: row.imageUrl,
        score: Number(row.score) || 0,
      };
    });

    return { results, total: total || results.length };
  } catch (e: any) {
    console.error("[Search] Query error:", e.message);
    return { results: [], total: 0 };
  }
}

/* ── Log Search Query ── */

export async function logSearchQuery(data: {
  query: string;
  resultCount: number;
  clickedPath?: string;
  sessionId?: string;
  userId?: number;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const { searchQueries } = await import("../drizzle/schema");
    await db.insert(searchQueries).values({
      query: data.query,
      resultCount: data.resultCount,
      clickedPath: data.clickedPath || null,
      sessionId: data.sessionId || null,
      userId: data.userId || null,
    });
  } catch (e) {
    console.warn("[Search] Failed to log query:", e);
  }
}
