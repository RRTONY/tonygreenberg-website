// Ported from legacy client/src/pages/ImpactDashboard.tsx, then updated
// 2026-10 to match the live site's reframing of the page as a pro forma
// "target representation": the four proposed impact pathways, portfolio
// model lenses, SoulScore's 12 dimensions, the accountability model, and
// the iRR model. Every figure is an illustrative model input, not a
// performance claim. Plain module, imported by the client-side tabbed
// explorer. Emoji icon fields replaced with `iconKey` strings, mapped to
// lucide-react components in the consumer.

export interface TokenEcosystem {
  id: string;
  name: string;
  /** Pathway subtitle, e.g. "Waterway Renewal Pathway". */
  fullName: string;
  mission: string;
  /** "Potential collaborator" line in the expanded card. */
  partnerNGO: string;
  /** "Concept anchor" line in the expanded card. */
  iconicAsset: string;
  color: string;
  iconKey: string;
  /** Model inputs only (live copy frames every figure as illustrative). */
  metrics: {
    tokenHolders: number;
    impactDeployed: string;
    projectsFunded: number;
    communityMembers: number;
    impactMultiplier: string;
  };
  /** "30-day build questions" in the expanded card. */
  milestones: string[];
  hawkinsScore: number;
  soulScore: number;
  /** REX was never launched: its cards show status chips instead of model metrics. */
  neverLaunched?: boolean;
}

export const TOKEN_ECOSYSTEMS: TokenEcosystem[] = [
  {
    id: "BEYOND",
    name: "BEYOND",
    fullName: "Waterway Renewal Pathway",
    mission: "A proposed pathway for linking waterway restoration, local stewardship, and long-term community benefit through an accountable operating model.",
    partnerNGO: "Potential conservation and community collaborators",
    iconicAsset: "Proposed waterway restoration node",
    color: "#0077B6",
    iconKey: "waves",
    metrics: { tokenHolders: 2847, impactDeployed: "$1.2M", projectsFunded: 14, communityMembers: 8420, impactMultiplier: "3.4x" },
    milestones: [
      "Define the local stewardship and evidence standard",
      "Map a transparent allocation and reporting path",
      "Test community participation without speculative token claims",
      "Publish the first data and governance questions",
    ],
    hawkinsScore: 520,
    soulScore: 72.4,
  },
  {
    id: "REX",
    name: "REX",
    fullName: "Fossils, Light & Long-View Learning",
    mission: "A proposed cultural pathway where paleontology, public learning, and a light-centered space make deep time feel less like a museum label and more like a lived question.",
    partnerNGO: "Potential museum, education, and cultural collaborators",
    iconicAsset: "REX Light Center study",
    color: "#836311",
    iconKey: "bone",
    metrics: { tokenHolders: 1923, impactDeployed: "$840K", projectsFunded: 9, communityMembers: 5210, impactMultiplier: "2.8x" },
    milestones: [
      "Define the REX Light Center brief and public-learning use",
      "Study cultural-partner and site requirements",
      "Build a transparent allocation and education model",
      "Share the design questions before making commitments",
    ],
    hawkinsScore: 480,
    soulScore: 68.1,
    neverLaunched: true,
  },
  {
    id: "SPACE",
    name: "SPACE",
    fullName: "Distributed Access Pathway",
    mission: "A proposed route for connecting digital infrastructure, local ownership, and access in places where connectivity is still treated as a luxury.",
    partnerNGO: "Potential digital-equity and community-network collaborators",
    iconicAsset: "Proposed community network node",
    color: "#6C5CE7",
    iconKey: "satellite",
    metrics: { tokenHolders: 3156, impactDeployed: "$1.6M", projectsFunded: 18, communityMembers: 11200, impactMultiplier: "4.1x" },
    milestones: [
      "Clarify the ownership and maintenance model",
      "Choose an evidence standard for access and use",
      "Map local-partner governance requirements",
      "Test the relationship between capital and lasting access",
    ],
    hawkinsScore: 510,
    soulScore: 74.8,
  },
  {
    id: "BEING",
    name: "BEING",
    fullName: "Human Dignity & Care Pathway",
    mission: "A proposed pathway for strengthening access, dignity, and community-rooted care without reducing a person’s inner life to a financial instrument.",
    partnerNGO: "Potential care, community, and cultural collaborators",
    iconicAsset: "Proposed community care network",
    color: "#CF4525",
    iconKey: "brain",
    metrics: { tokenHolders: 2234, impactDeployed: "$980K", projectsFunded: 12, communityMembers: 6840, impactMultiplier: "3.1x" },
    milestones: [
      "Establish lawful, ethical, and community-led boundaries",
      "Define where capital can help without directing care",
      "Build an evidence and safeguards framework",
      "Publish the questions before proposing outcomes",
    ],
    hawkinsScore: 560,
    soulScore: 76.2,
  },
];

/** REX's expanded card: the record dinosaur auction results live links to. */
export const REX_AUCTIONS = [
  { year: "1997", source: "Science", name: "Sue · T. rex", price: "$8.36M", href: "https://www.science.org/content/article/stan-t-rex-sells-record-32-million-auction" },
  { year: "2020", source: "Science", name: "Stan · T. rex", price: "$31.8M", href: "https://www.science.org/content/article/stan-t-rex-sells-record-32-million-auction" },
  { year: "2024", source: "Sotheby’s", name: "Apex · Stegosaurus", price: "$44.6M", href: "https://www.sothebys.com/en/videos/historic-bidding-battle-for-stegosaurus-fossil-sets-new-auction-record-at-44-6-million" },
  { year: "2026", source: "Sotheby’s", name: "Gus · T. rex", price: "$50M", href: "https://www.sothebys.com/en/articles/editorial-apex-sue-and-the-ceratosaur-sothebys-most-thrilling-and-complete-dinosaurs-at-auction" },
];

export const AGGREGATE = {
  totalTokenHolders: TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.metrics.tokenHolders, 0),
  totalImpactDeployed: "$4.62M",
  totalProjectsFunded: TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.metrics.projectsFunded, 0),
  totalCommunityMembers: TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.metrics.communityMembers, 0),
  avgSoulScore: +(TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.soulScore, 0) / TOKEN_ECOSYSTEMS.length).toFixed(1),
  avgHawkins: Math.round(TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.hawkinsScore, 0) / TOKEN_ECOSYSTEMS.length),
  portfolioCompanies: 35,
};

export interface PortfolioCategory {
  name: string;
  color: string;
  companies: number;
  avgHawkins: number;
  avgComposite: number;
  keyMetric: string;
  iconKey: string;
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  { name: "Enterprise Procurement & AI", color: "#3498DB", companies: 1, avgHawkins: 400, avgComposite: 7.9, keyMetric: "Sample operating-business lens", iconKey: "zap" },
  { name: "Regenerative Capital Design", color: "#D4B96A", companies: 1, avgHawkins: 540, avgComposite: 9.1, keyMetric: "Four proposed allocation pathways", iconKey: "target" },
  { name: "Care, Access & Dignity", color: "#9B59B6", companies: 6, avgHawkins: 507, avgComposite: 7.4, keyMetric: "Sample safeguards and access lens", iconKey: "hand-heart" },
  { name: "Impact Venture & Finance", color: "#27AE60", companies: 7, avgHawkins: 380, avgComposite: 6.8, keyMetric: "Illustrative beneficiary lens", iconKey: "gem" },
  { name: "Governance & Ownership", color: "#3498DB", companies: 4, avgHawkins: 350, avgComposite: 6.2, keyMetric: "Proposed community-governance tests", iconKey: "link" },
  { name: "Distributed Infrastructure", color: "#E67E22", companies: 6, avgHawkins: 320, avgComposite: 5.9, keyMetric: "Potential shared-infrastructure lens", iconKey: "building" },
  { name: "Identity & Trust", color: "#1ABC9C", companies: 2, avgHawkins: 410, avgComposite: 7.1, keyMetric: "Sample trust and disclosure lens", iconKey: "lock" },
  { name: "Health & Wellbeing", color: "#E74C3C", companies: 2, avgHawkins: 360, avgComposite: 6.4, keyMetric: "Illustrative human-outcomes lens", iconKey: "heart" },
];

export interface DimensionSummary {
  label: string;
  shortLabel: string;
  iconKey: string;
  color: string;
  avgScore: number;
  weight: number;
}

export const DIMENSION_SUMMARY: DimensionSummary[] = [
  { label: "Consciousness", shortLabel: "CONSC", iconKey: "circle-dot", color: "#836311", avgScore: 518, weight: 12 },
  { label: "Carbon & Climate", shortLabel: "CARBN", iconKey: "globe", color: "#2a9d8f", avgScore: 62, weight: 10 },
  { label: "Labor Justice", shortLabel: "LABOR", iconKey: "scale", color: "#e63946", avgScore: 68, weight: 10 },
  { label: "Supply Chain", shortLabel: "SUPLC", iconKey: "link", color: "#588157", avgScore: 55, weight: 10 },
  { label: "Cultural Preservation", shortLabel: "CULTR", iconKey: "landmark", color: "#9b5de5", avgScore: 70, weight: 8 },
  { label: "Community Multiplier", shortLabel: "COMTY", iconKey: "users", color: "#3a86a8", avgScore: 65, weight: 8 },
  { label: "Financial Justice", shortLabel: "FINJT", iconKey: "gem", color: "#D4B96A", avgScore: 60, weight: 8 },
  { label: "Governance & Trust", shortLabel: "GOVNT", iconKey: "building", color: "#6c5ce7", avgScore: 70, weight: 7 },
  { label: "Resource Circularity", shortLabel: "RSCRC", iconKey: "recycle", color: "#00b894", avgScore: 58, weight: 7 },
  { label: "Human Dignity", shortLabel: "DGITY", iconKey: "shield-check", color: "#e17055", avgScore: 72, weight: 7 },
  { label: "Regenerative Innovation", shortLabel: "REGEN", iconKey: "dna", color: "#00b4d8", avgScore: 65, weight: 7 },
  { label: "Radical Transparency", shortLabel: "TRANS", iconKey: "eye", color: "#D4A017", avgScore: 68, weight: 6 },
];

export const CHARITY_SUMMARY = {
  totalCharities: 100,
  avgScore: 74.2,
  evaluatorsUnified: 8,
  dimensions: 7,
  sectors: 20,
  clearTransparency: 42,
  hazyTransparency: 31,
  opaqueTransparency: 27,
};

export const CHARITY_SCORE_DIMENSIONS = [
  { label: "Verified Impact Outcomes", weight: 25, color: "#27AE60" },
  { label: "Transparency & Disclosure", weight: 20, color: "#3498DB" },
  { label: "Dollar Efficiency", weight: 15, color: "#836311" },
  { label: "Evidence Quality & Rigor", weight: 15, color: "#9B59B6" },
  { label: "Cloak-vs-Clear Score", weight: 10, color: "#E67E22" },
  { label: "Beneficiary Voice & Feedback", weight: 10, color: "#E17055" },
  { label: "Adaptability & Learning", weight: 5, color: "#00b4d8" },
];

export const IRR_HIGHLIGHTS = [
  { entity: "Operating-business scenario", irr: "9.2x", metric: "Sample value-to-impact multiple", color: "#3498DB" },
  { entity: "Regenerative allocation scenario", irr: "8.7x", metric: "Sample capital-to-outcome multiple", color: "#D4B96A" },
  { entity: "Care-access scenario", irr: "7.8x", metric: "Sample safeguards-and-access multiple", color: "#9B59B6" },
  { entity: "Community-benefit scenario", irr: "6.5x", metric: "Sample community-outcomes multiple", color: "#E74C3C" },
  { entity: "Distributed-philanthropy scenario", irr: "7.2x", metric: "Sample beneficiary-reach multiple", color: "#27AE60" },
];

export const CONSCIOUSNESS_ZONES = [
  { zone: "SHAME", range: "20-100", color: "#e63946", desc: "Force-based. Extractive. Destructive." },
  { zone: "FORCE", range: "100-200", color: "#e17055", desc: "Survival mode. Fear-driven decisions." },
  { zone: "POWER", range: "200-500", color: "#2a9d8f", desc: "Integrity threshold. Courage to truth." },
  { zone: "LOVE", range: "500+", color: "#836311", desc: "Love-driven. Regenerative. Enlightened." },
];

export const BENCHMARK_COMPARISON = [
  { name: "Reference profile A", hawkins: 430, score: 82.4, grade: "A", color: "#588157" },
  { name: "ImpactSoul model", hawkins: AGGREGATE.avgHawkins, score: AGGREGATE.avgSoulScore, grade: "B+", color: "#D4B96A" },
  { name: "Reference profile B", hawkins: 225, score: 58.6, grade: "B-", color: "#3a86a8" },
  { name: "Reference profile C", hawkins: 110, score: 31.2, grade: "D", color: "#e17055" },
  { name: "Reference profile D", hawkins: 75, score: 25.1, grade: "F", color: "#e63946" },
];
