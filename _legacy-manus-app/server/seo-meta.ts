/**
 * Centralized SEO metadata map for all pages on tonygreenberg.com
 * Used by the SSR layer in vite.ts to inject dynamic meta tags into every page response.
 *
 * Fields:
 *   title       — <title> and og:title and twitter:title
 *   description — <meta name="description">, og:description, twitter:description
 *   ogType      — og:type (defaults to "website")
 *   image       — og:image and twitter:image (defaults to site OG image)
 *   noIndex     — set true for admin/private pages
 */

const SITE = "https://tonygreenberg.com";
const DEFAULT_IMAGE = `${SITE}/api/img/tony-headshot_2d63de23.jpg`;
const SITE_NAME = "Tony Greenberg";

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
  ogType?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
}

// Exact path matches take priority over prefix matches
const META_MAP: Record<string, PageMeta> = {

  // ─── HOME ────────────────────────────────────────────────────────────────
  "/": {
    title: "Tony Greenberg — Only Time Buys Trust",
    description: "25 years exposing broken systems and building what replaces them. Enterprise technology, impact investing, psychedelic medicine, and the uncommon sense.",
    keywords: "Tony Greenberg, enterprise technology, AI infrastructure, psychedelic medicine, impact investing, RampRate, ImpactSoul, systems thinking, conscious capitalism, peptides, ibogaine, tokenization",
  },

  // ─── CORE NAVIGATION ─────────────────────────────────────────────────────
  "/about": {
    title: "About Tony Greenberg — Builder, Connector, Contrarian",
    description: "CEO of RampRate. Co-founder of ImpactSoul. Investor in psychedelic medicine. 25 years at the intersection of technology, capital, and consciousness.",
    keywords: "Tony Greenberg biography, RampRate CEO, ImpactSoul founder, enterprise technology advisor, psychedelic medicine investor, impact investor, Fortune 500 advisor, Microsoft Disney Goldman Sachs Nike",
  },
  "/essays": {
    title: "Essays — Tony Greenberg",
    description: "Long-form thinking on broken systems, technology procurement, consciousness, and the uncommon sense. 115+ essays.",
  },
  "/blog": {
    title: "Blog — Tony Greenberg",
    description: "Dispatches from the edge of technology, capital, and consciousness. Tony Greenberg's latest writing.",
    keywords: "Tony Greenberg blog, enterprise technology essays, psychedelic medicine writing, impact investing articles, systems thinking, conscious capitalism, AI infrastructure",
  },
  "/start-here": {
    title: "Start Here — Tony Greenberg",
    description: "New to Tony Greenberg's work? Start here. A curated path through the most important ideas, tools, and assessments.",
  },
  "/living-declaration": {
    title: "Living Declaration — Tony Greenberg",
    description: "A living document. Tony Greenberg's manifesto on systems, power, and the future of human potential.",
    ogType: "article",
  },
  "/framework": {
    title: "The Framework — Tony Greenberg",
    description: "The operating system behind 25 years of enterprise technology deals, impact investments, and systems thinking.",
  },
  "/intel": {
    title: "Intel — Tony Greenberg",
    description: "Curated intelligence on technology, capital markets, psychedelic medicine, and the systems that shape the future.",
  },
  "/invest": {
    title: "Invest — Tony Greenberg",
    description: "Tony Greenberg's investment thesis: enterprise technology, psychedelic medicine, tokenized impact assets, and the infrastructure of consciousness.",
  },
  "/clients": {
    title: "Clients — RampRate & Tony Greenberg",
    description: "Microsoft, Disney, Goldman Sachs, Nike, and hundreds more. 25 years of enterprise technology procurement and strategic advisory.",
  },
  "/community": {
    title: "Join the Community — Tony Greenberg",
    description: "Connect with builders, investors, and operators creating regenerative alternatives to extractive systems. Apply to join.",
  },
  "/engage": {
    title: "Engage — The Gate",
    description: "Builders, investors, and operators working on regenerative impact. Complete the engagement audit to begin a conversation with Tony Greenberg.",
  },
  "/subscribe": {
    title: "Subscribe — Tony Greenberg",
    description: "Dispatches on technology, capital, consciousness, and the uncommon sense. Subscribe to Tony Greenberg's newsletter.",
  },
  "/shop": {
    title: "Shop — Tony Greenberg",
    description: "Books, tools, and resources from Tony Greenberg's world.",
  },
  "/published": {
    title: "Published Work — Tony Greenberg",
    description: "Books, articles, and media appearances. Tony Greenberg's published work across technology, impact investing, and consciousness.",
  },
  "/series": {
    title: "Series — Tony Greenberg",
    description: "Multi-part explorations of the systems that shape our world. Technology, capital, consciousness, and the uncommon sense.",
  },
  "/journeys": {
    title: "Journeys — Tony Greenberg",
    description: "Curated paths through Tony Greenberg's work. Choose your entry point.",
  },
  "/the-open-door": {
    title: "The Open Door — Tony Greenberg",
    description: "An open invitation. Tony Greenberg's direct line for builders, investors, and operators.",
  },
  "/the-letter": {
    title: "The Letter — Tony Greenberg",
    description: "A personal letter from Tony Greenberg to the people building what comes next.",
  },
  "/the-territory": {
    title: "The Territory — Tony Greenberg",
    description: "A map of Tony Greenberg's domains: enterprise technology, impact investing, psychedelic medicine, coffee, kava, and consciousness.",
  },
  "/the-web": {
    title: "The Web — Tony Greenberg",
    description: "The network of relationships, investments, and ideas that constitute Tony Greenberg's world.",
  },
  "/the-nightstand": {
    title: "The Nightstand — Tony Greenberg",
    description: "What Tony Greenberg is reading, watching, and thinking about right now.",
  },
  "/the-index": {
    title: "The Index — Tony Greenberg",
    description: "A complete index of Tony Greenberg's work, tools, assessments, and ideas.",
  },
  "/the-mirror": {
    title: "The Mirror — Life Assessment",
    description: "A six-dimension life assessment tool. Reflect on where you are across health, relationships, work, finances, purpose, and growth.",
  },
  "/walk-through": {
    title: "Walk Through — Tony Greenberg",
    description: "A guided tour of Tony Greenberg's work, philosophy, and the systems he has built.",
  },
  "/under-nda": {
    title: "Under NDA — Tony Greenberg",
    description: "Confidential work and projects under non-disclosure. Request access.",
    noIndex: true,
  },
  "/pick-up-the-phone": {
    title: "Pick Up the Phone — Tony Greenberg",
    description: "Direct contact for urgent conversations. Tony Greenberg's direct line.",
  },
  "/recent-creations": {
    title: "Recent Creations — Tony Greenberg",
    description: "The latest tools, pages, and projects from Tony Greenberg's studio.",
  },
  "/my-highlights": {
    title: "My Highlights — Tony Greenberg",
    description: "Key moments, milestones, and highlights from Tony Greenberg's career and work.",
  },
  "/my-impact": {
    title: "My Impact — Tony Greenberg",
    description: "Measuring what matters. Tony Greenberg's impact across technology, capital, and consciousness.",
  },
  "/my-journey": {
    title: "My Journey — Tony Greenberg",
    description: "From enterprise technology to psychedelic medicine to tokenized impact. Tony Greenberg's 25-year journey.",
  },
  "/fauxtony": {
    title: "FauxTony — AI Impersonation Warning",
    description: "Warning: AI-generated accounts impersonating Tony Greenberg. How to identify and report them.",
  },

  // ─── ASSESSMENTS / FIND YOUR ─────────────────────────────────────────────
  "/assessment": {
    title: "Assessments — Tony Greenberg",
    description: "Five to ten minute assessments that clarify decisions about who you are and what you want. Zero fluff.",
  },
  "/assessments": {
    title: "Assessments — Tony Greenberg",
    description: "Five to ten minute assessments that clarify decisions about who you are and what you want. Zero fluff.",
  },
  "/find-my": {
    title: "Find My — Assessment Hub",
    description: "A collection of assessments to help you find your peptide, therapy, diet, movement, sleep, spirit, and more.",
  },
  "/find-your-me": {
    title: "Find Your Me — Self-Discovery Assessment",
    description: "A five-question NLP-driven assessment to help you discover your authentic self. Developed by Tony Greenberg.",
  },
  "/find-my-me": {
    title: "Find Your Me — Self-Discovery Assessment",
    description: "A five-question NLP-driven assessment to help you discover your authentic self. Developed by Tony Greenberg.",
  },
  "/discover": {
    title: "Discover Yourself — Self-Discovery Assessment",
    description: "A five-question NLP-driven assessment to help you discover your authentic self. Developed by Tony Greenberg.",
  },
  "/find-your-therapy": {
    title: "Find Your Therapy — Therapy Matching Assessment",
    description: "A 16-question assessment across four axes to match you with the right therapeutic modality. Psychedelic, somatic, cognitive, and relational.",
  },
  "/find-my-therapy": {
    title: "Find Your Therapy — Therapy Matching Assessment",
    description: "A 16-question assessment across four axes to match you with the right therapeutic modality.",
  },
  "/find-your-peptide": {
    title: "Find Your Peptide — Peptide Clarity Index™",
    description: "A 10-question, 7-axis clinical assessment to match you with the right peptide protocol. Developed by Tony Greenberg's peptide research team.",
  },
  "/find-my-peptide": {
    title: "Find Your Peptide — Peptide Clarity Index™",
    description: "A 10-question, 7-axis clinical assessment to match you with the right peptide protocol.",
  },
  "/find-your-diet": {
    title: "Find Your Diet — Nutrition Assessment",
    description: "Discover the dietary approach that aligns with your biology, lifestyle, and goals.",
  },
  "/find-my-diet": {
    title: "Find Your Diet — Nutrition Assessment",
    description: "Discover the dietary approach that aligns with your biology, lifestyle, and goals.",
  },
  "/find-your-movement": {
    title: "Find Your Movement — Exercise Assessment",
    description: "Match your movement practice to your body type, goals, and lifestyle.",
  },
  "/find-my-movement": {
    title: "Find Your Movement — Exercise Assessment",
    description: "Match your movement practice to your body type, goals, and lifestyle.",
  },
  "/find-your-sleep": {
    title: "Find Your Sleep — Sleep Optimization Assessment",
    description: "Identify the sleep protocols and interventions that will work for your chronotype and lifestyle.",
  },
  "/find-my-sleep": {
    title: "Find Your Sleep — Sleep Optimization Assessment",
    description: "Identify the sleep protocols and interventions that will work for your chronotype and lifestyle.",
  },
  "/find-your-coffee": {
    title: "Find Your Coffee — Coffee Matching Assessment",
    description: "Match your palate, ritual, and values to the right coffee. Powered by BrewSoul.",
  },
  "/find-my-coffee": {
    title: "Find Your Coffee — Coffee Matching Assessment",
    description: "Match your palate, ritual, and values to the right coffee. Powered by BrewSoul.",
  },
  "/find-your-kitchen": {
    title: "Find Your Kitchen — Kitchen Assessment",
    description: "Discover the kitchen tools, appliances, and setup that match your cooking style.",
  },
  "/find-your-style": {
    title: "Find Your Style — Personal Style Assessment",
    description: "Discover your authentic personal style through a guided assessment.",
  },
  "/find-your-attachment-style": {
    title: "Find Your Attachment Style — Relationship Assessment",
    description: "Understand your attachment patterns and how they shape your relationships.",
  },
  "/find-my-attachment-style": {
    title: "Find Your Attachment Style — Relationship Assessment",
    description: "Understand your attachment patterns and how they shape your relationships.",
  },
  "/find-my-we": {
    title: "Find Your Attachment Style — Relationship Assessment",
    description: "Understand your attachment patterns and how they shape your relationships.",
  },
  "/find-your-love-language": {
    title: "Find Your Love Language — Relationship Assessment",
    description: "Discover your primary love language and how to communicate it to the people who matter most.",
  },
  "/find-your-sexuality": {
    title: "Find Your Sexuality — Identity Assessment",
    description: "A thoughtful, non-binary assessment to help you understand and articulate your sexual identity.",
  },
  "/find-my-sexuality": {
    title: "Find Your Sexuality — Identity Assessment",
    description: "A thoughtful, non-binary assessment to help you understand and articulate your sexual identity.",
  },
  "/find-your-spirit": {
    title: "Find Your Spirit — Spiritual Assessment",
    description: "Discover your spiritual archetype and the practices that align with your path.",
  },
  "/find-my-spirit": {
    title: "Find Your Spirit — Spiritual Assessment",
    description: "Discover your spiritual archetype and the practices that align with your path.",
  },
  "/find-your-religion": {
    title: "Find Your Religion — Spiritual Alignment Assessment",
    description: "Explore the religious and spiritual traditions that resonate with your values and worldview.",
  },
  "/find-your-sake": {
    title: "Find Your Sake — Sake Matching Assessment",
    description: "Match your palate and occasion to the right sake. A guided tasting assessment.",
  },
  "/find-your-journey": {
    title: "Find Your Journey — Path Assessment",
    description: "Discover the journey that is right for you across Tony Greenberg's domains.",
  },
  "/find-my-tribe": {
    title: "Find Your Tribe — Community Assessment",
    description: "Connect with your people. A community matching assessment.",
  },
  "/dharma-finder": {
    title: "Dharma Finder — Purpose Assessment",
    description: "A 25-question assessment across four sections to discover your dharma — your unique purpose and path.",
  },
  "/assessments/dharma-finder": {
    title: "Dharma Finder — Purpose Assessment",
    description: "A 25-question assessment across four sections to discover your dharma — your unique purpose and path.",
  },
  "/consciousness-scale": {
    title: "Consciousness Scale — Self-Awareness Assessment",
    description: "Measure your level of consciousness and self-awareness across multiple dimensions.",
  },
  "/assessments/consciousness-scale": {
    title: "Consciousness Scale — Self-Awareness Assessment",
    description: "Measure your level of consciousness and self-awareness across multiple dimensions.",
  },
  "/grant-study": {
    title: "Grant Study — Harvard Happiness Assessment",
    description: "A 25-question assessment based on the Harvard Grant Study's five factors of lifelong wellbeing.",
  },
  "/assessments/grant-study": {
    title: "Grant Study — Harvard Happiness Assessment",
    description: "A 25-question assessment based on the Harvard Grant Study's five factors of lifelong wellbeing.",
  },
  "/soulscore": {
    title: "SoulScore — Impact Assessment",
    description: "Measure your impact across 12 axes and 8 entity types. The SoulScore is your impact fingerprint.",
  },
  "/life-assessment": {
    title: "The Mirror — Life Assessment",
    description: "A six-dimension life assessment. Reflect on where you are across health, relationships, work, finances, purpose, and growth.",
  },
  "/self-portrait": {
    title: "Self Portrait — Identity Assessment",
    description: "A deep identity assessment to help you see yourself clearly.",
  },
  "/flow-circuit": {
    title: "Flow Circuit — Flow State Assessment",
    description: "Identify the conditions, triggers, and blockers of your flow state.",
  },
  "/path/:archetype": {
    title: "Your Path — Tony Greenberg",
    description: "Your personalized path based on your assessment results.",
  },
  "/quiz_25q": {
    title: "Peptide Literacy Quiz — 25 Questions",
    description: "Test your peptide knowledge across 25 questions and 5 dimensions. Are you a Peptide Novice, Practitioner, or Expert?",
  },
  "/impact-dashboard": {
    title: "Impact Dashboard — Tony Greenberg",
    description: "Real-time impact metrics across Tony Greenberg's portfolio of investments, initiatives, and community.",
  },
  "/thesis-threads": {
    title: "Thesis Threads — Investment Thinking",
    description: "The threads of Tony Greenberg's investment thesis: enterprise technology, psychedelic medicine, tokenized impact, and consciousness infrastructure.",
  },

  // ─── PEPTIDES ────────────────────────────────────────────────────────────
  "/the-body": {
    title: "The Body — Peptide Intelligence Platform",
    description: "The most comprehensive peptide intelligence platform. 200+ peptides scored, ranked, and contextualized for performance, longevity, and healing.",
    keywords: "peptide intelligence, peptide protocols, BPC-157, TB-500, GHK-Cu, Semaglutide, Tirzepatide, peptide research, peptide dosing, longevity peptides, healing peptides, Tony Greenberg peptides",
  },
  "/peptide-library": {
    title: "Peptide Library — Complete Peptide Database",
    description: "A complete database of peptides with clinical scoring, mechanism of action, dosing protocols, and sourcing guidance.",
  },
  "/peptide-matrix": {
    title: "Peptide Matrix — Peptide Comparison Tool",
    description: "Compare peptides across clinical axes, mechanisms, and use cases. The most advanced peptide comparison tool available.",
  },
  "/peptide-supply-chain": {
    title: "Peptide Supply Chain — Sourcing Intelligence",
    description: "The complete guide to peptide sourcing: manufacturers, distributors, quality markers, and red flags.",
  },
  "/peptide-hall-of-shame": {
    title: "Peptide Hall of Shame — Vendor Accountability",
    description: "Documented cases of peptide vendor fraud, contamination, and mislabeling. Protecting the community.",
  },
  "/peptide-watch": {
    title: "Peptide Watch — Market Intelligence",
    description: "Real-time intelligence on the peptide market: pricing, availability, regulatory changes, and vendor news.",
  },
  "/rip-peptide-sciences": {
    title: "RIP Peptide Sciences — What Happened",
    description: "The story of Peptide Sciences' shutdown and what it means for the peptide community.",
    ogType: "article",
  },
  "/whats-legal": {
    title: "What's Legal — Peptide Regulatory Status by Country",
    description: "A comprehensive guide to the legal status of 17 key peptides across the US, Canada, and Australia. Research use, compounding, and prescription status.",
  },
  "/verify-your-coa": {
    title: "Verify Your COA — Certificate of Analysis Checker",
    description: "How to verify a peptide Certificate of Analysis. Red flags, trusted labs, and step-by-step verification guide.",
  },
  "/price-tracker": {
    title: "Peptide Price Tracker — Market Pricing Intelligence",
    description: "Track peptide prices across vendors. Historical pricing, market trends, and fair value benchmarks.",
  },
  "/test-your-peptides": {
    title: "Test Your Peptides — Independent Testing Guide",
    description: "How to independently test your peptides. Trusted labs, testing protocols, and what to look for in results.",
  },
  "/supplier-intake": {
    title: "Supplier Application — Peptide Supply Partner (Stage 1)",
    description: "Apply to become a verified peptide supply partner. A short 3-step qualification form covering company identity, offer & scale, and terms & track record. No uploads required at this stage.",
    keywords: "peptide supplier application, peptide manufacturer vetting, peptide supply chain, GMP peptide manufacturer, peptide marketplace, supplier qualification",
  },
  "/supplier-intake-long": {
    title: "Supplier Profile — Full Due Diligence (Stage 2)",
    description: "Complete your full supplier profile. A 6-step due diligence wizard covering company details, manufacturing, quality assurance, commercial terms, regulatory compliance, and document uploads.",
    keywords: "peptide supplier due diligence, peptide manufacturer profile, COA verification, GMP peptide manufacturer, peptide supply chain",
  },
  // Legacy redirect — kept for canonical reference; route now redirects to /supplier-intake
  "/vendor-intake": {
    title: "Supplier Application — Peptide Supply Partner",
    description: "Apply to become a verified peptide supply partner. Redirects to the current supplier application.",
    keywords: "peptide supplier application, peptide manufacturer vetting",
  },
  "/protecting-your-business": {
    title: "Protecting Your Business — Fraud Report",
    description: "Report and document business fraud, IP theft, and predatory practices. A tool for operators and builders.",
  },

  // ─── PSYCHEDELICS / PRI ──────────────────────────────────────────────────
  "/psychedelic-readiness-index": {
    title: "Psychedelic Readiness Index™ — Are You Ready?",
    description: "The most rigorous psychedelic readiness assessment available. Developed by Tony Greenberg's team with clinical advisors.",
    keywords: "psychedelic readiness assessment, psilocybin readiness, MDMA therapy readiness, ibogaine readiness, psychedelic safety screening, psychedelic preparation, Tony Greenberg PRI",
  },
  "/pri-calibration": {
    title: "PRI Calibration — Psychedelic Readiness Index",
    description: "Calibrate your Psychedelic Readiness Index score with clinical context and personalized guidance.",
  },
  "/pri-efficacy": {
    title: "PRI Efficacy — Research & Evidence Base",
    description: "The evidence base behind the Psychedelic Readiness Index. Clinical research, outcome data, and methodology.",
  },
  "/pri-research": {
    title: "PRI Research — Psychedelic Readiness Studies",
    description: "Research supporting the Psychedelic Readiness Index. Peer-reviewed studies, clinical trials, and outcome data.",
  },
  "/peyote-mescaline": {
    title: "Peyote & Mescaline — Deep Dive",
    description: "A comprehensive guide to peyote and mescaline: history, pharmacology, clinical applications, legal status, and cultural context.",
    ogType: "article",
  },
  "/iboga-ibogaine": {
    title: "Iboga & Ibogaine — Deep Dive",
    description: "A comprehensive guide to iboga and ibogaine: addiction interruption, neuroplasticity, safety protocols, and the future of ibogaine therapy.",
    keywords: "ibogaine therapy, iboga ceremony, ibogaine addiction treatment, ibogaine PTSD, Bwiti tradition, ibogaine safety, ibogaine clinical trials, ibogaine FDA, Tony Greenberg ibogaine",
    ogType: "article",
  },
  "/iboga-compass": {
    title: "Iboga Compass — Readiness Assessment",
    description: "A specialized readiness assessment for iboga and ibogaine therapy. Safety screening, contraindications, and preparation guidance.",
  },

  // ─── BREWSOUL ────────────────────────────────────────────────────────────
  "/brewsoul": {
    title: "BrewSoul — Coffee Curation Platform",
    description: "The most rigorous coffee curation platform. 107 coffees scored across origin, variety, process, cupping score, and tasting notes. Tony Greenberg's coffee intelligence.",
    keywords: "specialty coffee curation, best specialty coffee, coffee scoring, coffee origin guide, single origin coffee, natural processed coffee, washed coffee, Gesha coffee, Tony Greenberg coffee",
  },
  "/brewsoul/first-sip": {
    title: "First Sip — BrewSoul Welcome",
    description: "Welcome to BrewSoul. Your guide to the most rigorous coffee curation platform.",
  },
  "/brewsoul/home": {
    title: "BrewSoul Home — Coffee Intelligence",
    description: "The BrewSoul dashboard. Browse coffees, explore origins, and find your perfect cup.",
  },
  "/brewsoul/browse": {
    title: "Browse Coffees — BrewSoul",
    description: "Browse all 107 coffees in the BrewSoul catalog. Filter by origin, variety, process, and score.",
  },
  "/brewsoul/quiz": {
    title: "Coffee Quiz — BrewSoul",
    description: "Find your perfect coffee through a guided tasting quiz. Powered by BrewSoul's scoring methodology.",
  },
  "/brewsoul/wall-of-shame": {
    title: "Wall of Shame — BrewSoul",
    description: "The coffee brands that don't make the cut. Documented cases of greenwashing, mislabeling, and quality failures.",
  },
  "/brewsoul/follow-the-dollar": {
    title: "Follow the Dollar — Coffee Economics",
    description: "Where does your coffee dollar go? The economics of coffee from farm to cup.",
  },
  "/brewsoul/health": {
    title: "Coffee & Health — BrewSoul",
    description: "The science of coffee and health. Antioxidants, cognitive performance, longevity, and the research behind the claims.",
  },
  "/brewsoul/farms": {
    title: "Coffee Farms — BrewSoul",
    description: "The farms behind the best coffees in the world. Origin stories, farming practices, and direct trade relationships.",
  },
  "/brewsoul/mold-free": {
    title: "Mold-Free Coffee — BrewSoul",
    description: "The definitive guide to mold-free coffee. Testing protocols, trusted brands, and the science behind mycotoxins.",
  },
  "/brewsoul/chains": {
    title: "Coffee Chain Rankings — BrewSoul",
    description: "100 coffee chains ranked and scored. Quality, sourcing, sustainability, and value. The most rigorous coffee chain rankings available.",
  },
  "/brewsoul/varieties": {
    title: "Coffee Varieties — BrewSoul",
    description: "A guide to coffee varieties: Gesha, Bourbon, Typica, SL28, and more. Flavor profiles, origins, and rarity.",
  },
  "/brewsoul/processing": {
    title: "Coffee Processing — BrewSoul",
    description: "Natural, washed, honey, anaerobic: a complete guide to coffee processing methods and how they shape flavor.",
  },
  "/brewsoul/roasters": {
    title: "Coffee Roasters — BrewSoul",
    description: "The world's best coffee roasters. Curated by BrewSoul's scoring methodology.",
  },
  "/brewsoul/glossary": {
    title: "Coffee Glossary — BrewSoul",
    description: "A complete glossary of coffee terminology. From aeropress to wet mill, every term defined.",
  },
  "/brewsoul/pairings": {
    title: "Coffee Pairings — BrewSoul",
    description: "What to eat with your coffee. Food pairing guides for every coffee style.",
  },
  "/brewsoul/economics": {
    title: "Coffee Economics — BrewSoul",
    description: "The economics of specialty coffee. Pricing, market dynamics, and the value chain from farm to cup.",
  },
  "/brewsoul/compare": {
    title: "Compare Coffees — BrewSoul",
    description: "Side-by-side coffee comparison. Compare origins, varieties, processes, and scores.",
  },
  "/brewsoul/blend-builder": {
    title: "Blend Builder — BrewSoul",
    description: "Build your perfect coffee blend. Mix origins, varieties, and roast levels.",
  },
  "/brewsoul/drops": {
    title: "Coffee Drops — BrewSoul",
    description: "Limited releases and special drops from the world's best coffee producers.",
  },
  "/brewsoul/collection": {
    title: "My Collection — BrewSoul",
    description: "Your personal coffee collection. Track what you've tried and what you want to try.",
  },
  "/brewsoul/submit": {
    title: "Submit a Coffee — BrewSoul",
    description: "Submit a coffee for BrewSoul review. Our team will evaluate and score it.",
  },
  "/brewsoul/prescription": {
    title: "Coffee Prescription — BrewSoul",
    description: "Your personalized coffee prescription based on your taste profile and goals.",
  },
  "/brewsoul/biodynamic": {
    title: "Biodynamic Coffee — BrewSoul",
    description: "The world's best biodynamic coffees. Farming philosophy, certification, and flavor profiles.",
  },
  "/brewsoul/decaf": {
    title: "Decaf Coffee — BrewSoul",
    description: "The best decaf coffees in the world. Swiss water, CO2, and methylene chloride processes compared.",
  },
  "/brewsoul/directory": {
    title: "Coffee Directory — BrewSoul",
    description: "A complete directory of coffee producers, roasters, and importers in the BrewSoul network.",
  },
  "/brewsoul/esoteric": {
    title: "Esoteric Coffees — BrewSoul",
    description: "The rarest, most unusual, and most extraordinary coffees in the world. Civet, black ivory, and beyond.",
  },
  "/brewsoul/experiences": {
    title: "Coffee Experiences — BrewSoul",
    description: "Curated coffee experiences: cuppings, farm visits, and tasting events.",
  },

  // ─── KAVA ────────────────────────────────────────────────────────────────
  "/kava": {
    title: "Kava — The Complete Guide",
    description: "The most comprehensive kava resource: origins, science, products, safety, and culture. Tony Greenberg's kava intelligence.",
  },
  "/kava/assessment": {
    title: "Kava Assessment — Find Your Kava",
    description: "Find the right kava for your goals and tolerance. A guided assessment.",
  },
  "/kava/caffeine": {
    title: "Kava vs Caffeine — Comparison Guide",
    description: "Kava and caffeine compared: effects, safety, interactions, and use cases.",
  },
  "/kava/certification": {
    title: "Kava Certification — Quality Standards",
    description: "Understanding kava certification: Noble vs tudei, testing standards, and quality markers.",
  },
  "/kava/hawaii": {
    title: "Hawaiian Kava — Origin Guide",
    description: "Hawaiian kava: varieties, producers, and the unique terroir of Hawaiian-grown kava.",
  },
  "/kava/interactions": {
    title: "Kava Interactions — Drug & Supplement Guide",
    description: "A comprehensive guide to kava drug interactions: medications, supplements, and substances to avoid.",
  },
  "/kava/myths": {
    title: "Kava Myths — Fact vs Fiction",
    description: "Debunking the most common myths about kava: liver toxicity, addiction, and safety.",
  },
  "/kava/origins": {
    title: "Kava Origins — Where Kava Comes From",
    description: "The origins of kava: Vanuatu, Fiji, Tonga, Hawaii, and the Pacific Islands. Regional varieties and traditions.",
  },
  "/kava/products": {
    title: "Kava Products — Buying Guide",
    description: "The best kava products: instant, traditional, micronized, and extracts. A curated buying guide.",
  },
  "/kava/science": {
    title: "Kava Science — Research & Evidence",
    description: "The science of kava: kavalactones, mechanism of action, clinical research, and safety data.",
  },

  // ─── ATTENTION THEFT ─────────────────────────────────────────────────────
  "/attention-theft": {
    title: "Attention Theft — The War for Your Mind",
    description: "How individuals inside corporations weaponize your open inbox — the spam playbook, the economics behind it, and what you can do about it.",
    ogType: "article",
  },
  "/attention-theft/blocker-finder": {
    title: "Blocker Finder — Attention Theft",
    description: "Find the right attention blocker for your devices and habits.",
  },
  "/attention-theft/economics": {
    title: "The Economics of Attention Theft",
    description: "The business model behind attention theft: advertising, engagement optimization, and the attention economy.",
    ogType: "article",
  },
  "/attention-theft/legal": {
    title: "Legal Remedies — Attention Theft",
    description: "Legal options for combating attention theft: privacy laws, data rights, and regulatory frameworks.",
  },
  "/attention-theft/report": {
    title: "Report Attention Theft — File a Complaint",
    description: "Report attention theft and predatory engagement practices. Resources and filing guides.",
  },
  "/attention-theft/weapons": {
    title: "Weapons of Attention Theft — The Arsenal",
    description: "The tools and techniques used to steal your attention: infinite scroll, notifications, dark patterns, and more.",
    ogType: "article",
  },

  // ─── HUMANOS ─────────────────────────────────────────────────────────────
  "/humanos": {
    title: "Humanos — The Human Operating System",
    description: "Humanos: a framework for human potential, consciousness, and the future of what it means to be human.",
  },
  "/humanos/connect": {
    title: "Connect — Humanos",
    description: "Connect with the Humanos community of builders, thinkers, and consciousness explorers.",
  },
  "/humanos/ecosystem": {
    title: "Ecosystem — Humanos",
    description: "The Humanos ecosystem: tools, assessments, communities, and resources for human potential.",
  },
  "/humanos/path-to-here": {
    title: "Path to Here — Humanos",
    description: "How Tony Greenberg arrived at Humanos. The journey from enterprise technology to human potential.",
  },
  "/humanos/philosophy": {
    title: "Philosophy — Humanos",
    description: "The philosophical foundations of Humanos: consciousness, systems thinking, and the future of human potential.",
  },
  "/humanos/resources": {
    title: "Resources — Humanos",
    description: "Curated resources for human potential: books, tools, research, and communities.",
  },

  // ─── ECOSYSTEM / AMPLIFIER ───────────────────────────────────────────────
  "/ecosystem": {
    title: "Ecosystem — Tony Greenberg",
    description: "The full ecosystem of Tony Greenberg's work: RampRate, ImpactSoul, BrewSoul, Humanos, and the network of investments and initiatives.",
  },
  "/ecosystem-map": {
    title: "Ecosystem Map — Tony Greenberg",
    description: "A visual map of Tony Greenberg's ecosystem: companies, investments, tools, and relationships.",
  },
  "/amplifier": {
    title: "Amplifier — Tony Greenberg",
    description: "The Amplifier: Tony Greenberg's platform for amplifying the work of builders, investors, and operators creating regenerative impact.",
  },
  "/engine-room": {
    title: "Engine Room — Tony Greenberg",
    description: "Behind the scenes of Tony Greenberg's operation: tools, systems, and the infrastructure of impact.",
  },
  "/diamond-cut": {
    title: "Diamond Cut — Tony Greenberg",
    description: "The diamond cut framework: how Tony Greenberg evaluates opportunities, people, and ideas.",
  },

  // ─── CHARITY / IMPACT ────────────────────────────────────────────────────
  "/charity-scorecard": {
    title: "Charity Scorecard — Due Diligence Tool",
    description: "A rigorous charity due diligence scorecard. Evaluate nonprofits across financial health, impact measurement, governance, and transparency.",
  },

  // ─── BLOG ARTICLES ───────────────────────────────────────────────────────
  "/akbar": {
    title: "Akbar — Tony Greenberg",
    description: "An essay by Tony Greenberg.",
    ogType: "article",
  },
  "/blog/is-that-a-lot-clarisse-abelarde": {
    title: "Is That a Lot, Clarisse Abelarde? — Tony Greenberg",
    description: "An essay on scale, perception, and the numbers that shape our world. By Tony Greenberg.",
    ogType: "article",
  },
  "/blog/the-molecule-as-mirror-from-substance-to-service": {
    title: "The Molecule as Mirror: From Substance to Service — Tony Greenberg",
    description: "How psychedelic molecules are becoming a mirror for consciousness, healing, and the future of mental health. By Tony Greenberg.",
    ogType: "article",
  },
  "/cheshire-grin": {
    title: "Cheshire Grin — Tony Greenberg",
    description: "An essay by Tony Greenberg.",
    ogType: "article",
  },
  "/spirits": {
    title: "Spirits — Tony Greenberg",
    description: "Tony Greenberg on spirits: alcohol, consciousness, and the culture of drinking.",
  },

  // ─── CORE SITE PAGES (sitemap-indexed) ─────────────────────────────────────
  "/seven-doors": {
    title: "Seven Doors — Tony Greenberg's Seven Domains",
    description: "Seven domains where Tony Greenberg works, invests, and builds: enterprise technology, AI, psychedelic medicine, impact investing, tokenization, payments, and consciousness.",
  },
  "/projects": {
    title: "Projects — Tony Greenberg",
    description: "Active projects, tools, and initiatives from Tony Greenberg's studio. Enterprise technology, impact investing, psychedelic medicine, and the infrastructure of consciousness.",
  },
  "/heroes": {
    title: "Heroes — Tony Greenberg",
    description: "The people Tony Greenberg admires and learns from. Builders, scientists, artists, and contrarians who changed the game.",
  },
  "/health": {
    title: "Health — Tony Greenberg",
    description: "Tony Greenberg's approach to health: peptides, psychedelics, nutrition, movement, sleep, and the science of human optimization.",
  },
  "/library": {
    title: "Library — Tony Greenberg",
    description: "Tony Greenberg's curated library: books, papers, tools, and resources across enterprise technology, consciousness, impact investing, and human potential.",
  },
  "/connect": {
    title: "Connect — Tony Greenberg",
    description: "Get in touch with Tony Greenberg. For builders, investors, operators, and anyone working on regenerative alternatives to extractive systems.",
  },
  "/impact": {
    title: "Impact — Tony Greenberg",
    description: "Tony Greenberg's impact portfolio: ImpactSoul, psychedelic medicine investments, ocean cleanup tokens, and the regenerative economy.",
  },

  // ─── ADMIN (no-index) ────────────────────────────────────────────────────
  "/admin/assessments": {
    title: "Admin — Assessments",
    description: "Admin panel for managing assessments.",
    noIndex: true,
  },
  "/admin/clock-keeper-responses": {
    title: "Admin — Clock Keeper Responses",
    description: "Admin panel for clock keeper responses.",
    noIndex: true,
  },
  "/admin/spam-link": {
    title: "Admin — Spam Link",
    description: "Admin panel for spam link management.",
    noIndex: true,
  },
  "/admin/spam-tracking": {
    title: "Admin — Spam Tracking",
    description: "Admin panel for spam tracking.",
    noIndex: true,
  },
  "/analytics": {
    title: "Analytics — Tony Greenberg",
    description: "Site analytics dashboard.",
    noIndex: true,
  },
  "/payment-success": {
    title: "Payment Successful — Tony Greenberg",
    description: "Your payment was successful.",
    noIndex: true,
  },
  "/payment-cancel": {
    title: "Payment Cancelled — Tony Greenberg",
    description: "Your payment was cancelled.",
    noIndex: true,
  },
  "/search": {
    title: "Search — Tony Greenberg",
    description: "Search across all of Tony Greenberg's work, tools, and assessments.",
  },
  "/bio": {
    title: "Tony Greenberg — Bio, Career & Investments",
    description: "CEO of RampRate. Co-founder of ImpactSoul. Investor in psychedelic medicine. 25 years at the intersection of technology, capital, and consciousness. Full biography.",
    keywords: "Tony Greenberg bio, Tony Greenberg biography, RampRate CEO, ImpactSoul founder, enterprise technology advisor, psychedelic medicine investor, impact investor",
  },
  "/articles": {
    title: "All Articles — Tony Greenberg",
    description: "Complete archive of Tony Greenberg's published essays and articles. 115+ pieces on enterprise technology, psychedelic medicine, impact investing, systems thinking, and conscious capitalism.",
    keywords: "Tony Greenberg articles, Tony Greenberg essays, Tony Greenberg writing, enterprise technology articles, psychedelic medicine essays, impact investing writing",
  },
  "/impact-futurism": {
    title: "Impact Futurism — Tony Greenberg",
    description: "Essays on broken systems and what comes next. Health, AI, energy, psychedelic medicine, trust, and the infrastructure of the future.",
  },
  "/facilitator-index": {
    title: "Facilitator Index — Find Your Psychedelic Guide | Tony Greenberg",
    description: "108 questions across 12 dimensions to help you find the right psychedelic facilitator. Consent, philosophy, tradition scoring, vignettes, and the Reciprocity Gate.",
    keywords: "psychedelic facilitator, find a facilitator, psychedelic guide, facilitator assessment, psychedelic readiness, ceremony facilitator, Tony Greenberg",
    ogType: "website",
  },
  "/speaking": {
    title: "Speaking and Conversations | Tony Greenberg",
    description: "Keynotes, firesides, offsites, and working sessions with Tony Greenberg on trust, capital, technology, and the human operating system.",
    keywords: "Tony Greenberg speaker, keynote speaker, impact futurist, trust infrastructure, technology speaker, capital and impact",
    ogType: "website",
  },
  "/the-philosophy": {
    title: "The Diode of Perception — Tony Greenberg",
    description: "The philosophy behind the Psychedelic Readiness Index. You are the instrument. Every medicine, every ceremony begins with one question: what is the current condition of the thing being played?",
    keywords: "psychedelic readiness philosophy, diode of perception, psychedelic instrument, readiness assessment philosophy, Tony Greenberg philosophy",
    ogType: "article",
  },
  "/404": {
    title: "Page Not Found — Tony Greenberg",
    description: "The page you are looking for does not exist.",
    noIndex: true,
  },
};

// Prefix-based fallbacks for dynamic routes
const PREFIX_META: Array<{ prefix: string; meta: PageMeta }> = [
  {
    prefix: "/brewsoul/coffee/",
    meta: {
      title: "Coffee Detail — BrewSoul",
      description: "Detailed scoring, tasting notes, origin, variety, and process for this coffee. Powered by BrewSoul.",
    },
  },
  {
    prefix: "/brewsoul/cities/",
    meta: {
      title: "Coffee City Guide — BrewSoul",
      description: "The best coffee in this city. Curated by BrewSoul.",
    },
  },
  {
    prefix: "/brewsoul/guest/",
    meta: {
      title: "Guest Feature — BrewSoul",
      description: "A guest feature on BrewSoul.",
    },
  },
  {
    prefix: "/charity-scorecard/",
    meta: {
      title: "Charity Scorecard — Due Diligence Report",
      description: "A detailed due diligence scorecard for this charity.",
    },
  },
  {
    prefix: "/path/",
    meta: {
      title: "Your Path — Tony Greenberg",
      description: "Your personalized path based on your assessment results.",
    },
  },
  {
    prefix: "/blog/",
    meta: {
      title: "Blog Post — Tony Greenberg",
      description: "An essay or article by Tony Greenberg.",
      ogType: "article",
    },
  },
  {
    prefix: "/shared-chat/",
    meta: {
      title: "Shared Conversation — Tony Greenberg",
      description: "A shared conversation from Tony Greenberg's AI assistant.",
      noIndex: true,
    },
  },
  {
    prefix: "/admin/",
    meta: {
      title: "Admin — Tony Greenberg",
      description: "Admin panel.",
      noIndex: true,
    },
  },
];

const DEFAULT_META: PageMeta = {
  title: "Tony Greenberg — Only Time Buys Trust",
  description: "25 years exposing broken systems and building what replaces them. Enterprise technology, impact investing, psychedelic medicine, and the uncommon sense.",
};

export function getPageMeta(path: string): PageMeta & { canonical: string } {
  // Normalize path: strip trailing slash (except root), then strip root slash too
  // so canonical for "/" = "https://tonygreenberg.com" (no trailing slash)
  const normalPath = path.length > 1 ? path.replace(/\/$/, "") : path;
  // Build canonical: root path "/" → SITE only (no slash), others → SITE + path
  const canonicalUrl = normalPath === "/" ? SITE : `${SITE}${normalPath}`;

  // Exact match
  if (META_MAP[normalPath]) {
    return {
      ...META_MAP[normalPath],
      image: META_MAP[normalPath].image ?? DEFAULT_IMAGE,
      canonical: canonicalUrl,
    };
  }

  // Prefix match
  for (const { prefix, meta } of PREFIX_META) {
    if (normalPath.startsWith(prefix)) {
      return {
        ...meta,
        image: meta.image ?? DEFAULT_IMAGE,
        canonical: canonicalUrl,
      };
    }
  }

  // Default fallback
  return {
    ...DEFAULT_META,
    image: DEFAULT_IMAGE,
    canonical: canonicalUrl,
  };
}

export function buildMetaTags(path: string): string {
  const meta = getPageMeta(path);
  const title = meta.title;
  const description = meta.description.trim().length >= 70
    ? meta.description.trim()
    : `${meta.description.trim()} Explore Tony Greenberg's work on systems, trust, capital, and what comes next.`;
  const keywords = meta.keywords ?? "Tony Greenberg, enterprise technology, AI infrastructure, psychedelic medicine, impact investing, peptides, RampRate, ImpactSoul, systems thinking, conscious capitalism";
  const ogType = meta.ogType ?? "website";
  const image = meta.image ?? DEFAULT_IMAGE;
  const canonical = meta.canonical;
  const noIndex = meta.noIndex ? `\n  <meta name="robots" content="noindex, nofollow" />` : `\n  <meta name="robots" content="index, follow" />`;
  const pageSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonical,
    primaryImageOfPage: image,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE },
    author: { "@type": "Person", name: "Tony Greenberg", url: `${SITE}/about` },
  });

  return `<title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="keywords" content="${keywords}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ThinkTony" />
  <meta name="twitter:creator" content="@ThinkTony" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:image:alt" content="${title}" />
  <link rel="canonical" href="${canonical}" />${noIndex}
  <script type="application/ld+json">${pageSchema}</script>`;
}
