// Ported from legacy client/src/pages/ImpactDashboard.tsx. Real content,
// unchanged — the four ImpactSoul token ecosystems, portfolio impact
// categories, SoulScore's 12 dimensions, the charity index summary, and
// the iRR framework. Plain module, imported by the client-side tabbed
// explorer. Emoji icon fields replaced with `iconKey` strings, mapped to
// lucide-react components in the consumer.

export interface TokenEcosystem {
  id: string;
  name: string;
  fullName: string;
  mission: string;
  partnerNGO: string;
  iconicAsset: string;
  color: string;
  iconKey: string;
  metrics: {
    tokenHolders: number;
    impactDeployed: string;
    projectsFunded: number;
    communityMembers: number;
    impactMultiplier: string;
  };
  milestones: string[];
  hawkinsScore: number;
  soulScore: number;
}

export const TOKEN_ECOSYSTEMS: TokenEcosystem[] = [
  {
    id: "BEYOND",
    name: "BEYOND",
    fullName: "BEYOND — Ocean & Waterway Cleanup",
    mission:
      "Tokenizing ocean cleanup infrastructure. Every token funds the removal of plastic, microplastics, and industrial waste from waterways and coastlines worldwide.",
    partnerNGO: "Ocean Conservancy Alliance",
    iconicAsset: "The Great Pacific Cleanup Array",
    color: "#0077B6",
    iconKey: "waves",
    metrics: {
      tokenHolders: 2847,
      impactDeployed: "$1.2M",
      projectsFunded: 14,
      communityMembers: 8420,
      impactMultiplier: "3.4x",
    },
    milestones: [
      "First cleanup array funded — Bali coastline",
      "Partnership with Ocean Conservancy Alliance signed",
      "2,000+ token holders milestone",
      "Microplastics research grant deployed",
    ],
    hawkinsScore: 520,
    soulScore: 72.4,
  },
  {
    id: "REX",
    name: "REX",
    fullName: "REX — Paleontology Research & Conservation",
    mission:
      "Tokenizing paleontological discoveries. A dinosaur skeleton funds schools in rural India. Fossil preservation meets regenerative education.",
    partnerNGO: "Paleontological Research Foundation",
    iconicAsset: "Authenticated T-Rex Skeleton Fragment",
    color: "#8B6914",
    iconKey: "bone",
    metrics: {
      tokenHolders: 1923,
      impactDeployed: "$840K",
      projectsFunded: 9,
      communityMembers: 5210,
      impactMultiplier: "2.8x",
    },
    milestones: [
      "First authenticated fossil tokenized",
      "Rural India education grant — 3 schools funded",
      "Museum partnership for public access",
      "Conservation research fellowship launched",
    ],
    hawkinsScore: 480,
    soulScore: 68.1,
  },
  {
    id: "SPACE",
    name: "SPACE",
    fullName: "SPACE — Digital Access for Remote Communities",
    mission:
      "Tokenizing digital infrastructure. Bridging the connectivity divide for remote and underserved communities through satellite, mesh networks, and community-owned internet.",
    partnerNGO: "Digital Equity Foundation",
    iconicAsset: "Community Mesh Network Array",
    color: "#6C5CE7",
    iconKey: "satellite",
    metrics: {
      tokenHolders: 3156,
      impactDeployed: "$1.6M",
      projectsFunded: 18,
      communityMembers: 11200,
      impactMultiplier: "4.1x",
    },
    milestones: [
      "First mesh network deployed — Amazon basin",
      "10,000 community members connected",
      "Satellite uplink partnership secured",
      "Digital literacy program launched in 5 regions",
    ],
    hawkinsScore: 510,
    soulScore: 74.8,
  },
  {
    id: "BEING",
    name: "BEING",
    fullName: "BEING — Mental Health Treatment for Underserved",
    mission:
      "Tokenizing access to consciousness. Funding psychedelic-assisted therapy, traditional healing, and mental health infrastructure for communities that can't afford it.",
    partnerNGO: "Consciousness Access Initiative",
    iconicAsset: "Therapeutic Retreat Center Network",
    color: "#E17055",
    iconKey: "brain",
    metrics: {
      tokenHolders: 2234,
      impactDeployed: "$980K",
      projectsFunded: 12,
      communityMembers: 6840,
      impactMultiplier: "3.1x",
    },
    milestones: [
      "First psychedelic therapy scholarship funded",
      "Partnership with 4 treatment centers",
      "Traditional healer integration program",
      "Mental health first-responder training in 3 cities",
    ],
    hawkinsScore: 560,
    soulScore: 76.2,
  },
];

export const AGGREGATE = {
  totalTokenHolders: TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.metrics.tokenHolders, 0),
  totalImpactDeployed: "$4.62M",
  totalProjectsFunded: TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.metrics.projectsFunded, 0),
  totalCommunityMembers: TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.metrics.communityMembers, 0),
  avgSoulScore: +(
    TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.soulScore, 0) / TOKEN_ECOSYSTEMS.length
  ).toFixed(1),
  avgHawkins: Math.round(
    TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.hawkinsScore, 0) / TOKEN_ECOSYSTEMS.length,
  ),
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
  {
    name: "Enterprise Technology & AI",
    color: "#3498DB",
    companies: 1,
    avgHawkins: 400,
    avgComposite: 7.9,
    keyMetric: "$10B+ benchmarked",
    iconKey: "zap",
  },
  {
    name: "Social Impact & Tokenization",
    color: "#D4B96A",
    companies: 1,
    avgHawkins: 540,
    avgComposite: 9.1,
    keyMetric: "4 live token ecosystems",
    iconKey: "target",
  },
  {
    name: "Psychedelic Medicine",
    color: "#9B59B6",
    companies: 6,
    avgHawkins: 507,
    avgComposite: 7.4,
    keyMetric: "FDA Breakthrough Therapy",
    iconKey: "flask",
  },
  {
    name: "Impact Venture & Finance",
    color: "#27AE60",
    companies: 7,
    avgHawkins: 380,
    avgComposite: 6.8,
    keyMetric: "1.2M people impacted",
    iconKey: "gem",
  },
  {
    name: "Web3, DAOs & Governance",
    color: "#3498DB",
    companies: 4,
    avgHawkins: 350,
    avgComposite: 6.2,
    keyMetric: "Decentralized governance",
    iconKey: "link",
  },
  {
    name: "Blockchain Infrastructure",
    color: "#E67E22",
    companies: 6,
    avgHawkins: 320,
    avgComposite: 5.9,
    keyMetric: "Cross-chain protocols",
    iconKey: "building",
  },
  {
    name: "Identity & Trust",
    color: "#1ABC9C",
    companies: 2,
    avgHawkins: 410,
    avgComposite: 7.1,
    keyMetric: "55% YoY revenue growth",
    iconKey: "lock",
  },
  {
    name: "Health & Wellness Tech",
    color: "#E74C3C",
    companies: 2,
    avgHawkins: 360,
    avgComposite: 6.4,
    keyMetric: "Novel therapeutics",
    iconKey: "heart",
  },
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
  {
    label: "Consciousness",
    shortLabel: "CONSC",
    iconKey: "circle-dot",
    color: "#8B6914",
    avgScore: 518,
    weight: 12,
  },
  {
    label: "Carbon & Climate",
    shortLabel: "CARBN",
    iconKey: "globe",
    color: "#2a9d8f",
    avgScore: 62,
    weight: 10,
  },
  {
    label: "Labor Justice",
    shortLabel: "LABOR",
    iconKey: "scale",
    color: "#e63946",
    avgScore: 68,
    weight: 10,
  },
  {
    label: "Supply Chain",
    shortLabel: "SUPLC",
    iconKey: "link",
    color: "#588157",
    avgScore: 55,
    weight: 10,
  },
  {
    label: "Cultural Preservation",
    shortLabel: "CULTR",
    iconKey: "landmark",
    color: "#9b5de5",
    avgScore: 70,
    weight: 8,
  },
  {
    label: "Community Multiplier",
    shortLabel: "COMTY",
    iconKey: "users",
    color: "#3a86a8",
    avgScore: 65,
    weight: 8,
  },
  {
    label: "Financial Justice",
    shortLabel: "FINJT",
    iconKey: "gem",
    color: "#D4B96A",
    avgScore: 60,
    weight: 8,
  },
  {
    label: "Governance & Trust",
    shortLabel: "GOVNT",
    iconKey: "building",
    color: "#6c5ce7",
    avgScore: 70,
    weight: 7,
  },
  {
    label: "Resource Circularity",
    shortLabel: "RSCRC",
    iconKey: "recycle",
    color: "#00b894",
    avgScore: 58,
    weight: 7,
  },
  {
    label: "Human Dignity",
    shortLabel: "DGITY",
    iconKey: "shield-check",
    color: "#e17055",
    avgScore: 72,
    weight: 7,
  },
  {
    label: "Regenerative Innovation",
    shortLabel: "REGEN",
    iconKey: "dna",
    color: "#00b4d8",
    avgScore: 65,
    weight: 7,
  },
  {
    label: "Radical Transparency",
    shortLabel: "TRANS",
    iconKey: "eye",
    color: "#D4A017",
    avgScore: 68,
    weight: 6,
  },
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
  { label: "Dollar Efficiency", weight: 15, color: "#8B6914" },
  { label: "Evidence Quality & Rigor", weight: 15, color: "#9B59B6" },
  { label: "Cloak-vs-Clear Score", weight: 10, color: "#E67E22" },
  { label: "Beneficiary Voice & Feedback", weight: 10, color: "#E17055" },
  { label: "Adaptability & Learning", weight: 5, color: "#00b4d8" },
];

export const IRR_HIGHLIGHTS = [
  { entity: "RampRate", irr: "9.2x", metric: "$1 advisory → $47 client savings", color: "#3498DB" },
  {
    entity: "ImpactSoul",
    irr: "8.7x",
    metric: "$1 invested → $3.20 regenerative impact",
    color: "#D4B96A",
  },
  {
    entity: "MycoMedica",
    irr: "7.8x",
    metric: "$1 invested → $8.40 healthcare savings",
    color: "#9B59B6",
  },
  {
    entity: "Atai/Beckley",
    irr: "6.5x",
    metric: "$1 invested → $12 mental health burden reduced",
    color: "#E74C3C",
  },
  {
    entity: "Capria.VC",
    irr: "7.2x",
    metric: "1.2M people impacted across India",
    color: "#27AE60",
  },
];

export const CONSCIOUSNESS_ZONES = [
  {
    zone: "SHAME",
    range: "20-100",
    color: "#e63946",
    desc: "Force-based. Extractive. Destructive.",
  },
  {
    zone: "FORCE",
    range: "100-200",
    color: "#e17055",
    desc: "Survival mode. Fear-driven decisions.",
  },
  {
    zone: "POWER",
    range: "200-500",
    color: "#2a9d8f",
    desc: "Integrity threshold. Courage to truth.",
  },
  {
    zone: "LOVE",
    range: "500+",
    color: "#8B6914",
    desc: "Love-driven. Regenerative. Enlightened.",
  },
];

export const BENCHMARK_COMPARISON = [
  { name: "Patagonia", hawkins: 430, score: 82.4, grade: "A", color: "#588157" },
  {
    name: "ImpactSoul (Avg)",
    hawkins: AGGREGATE.avgHawkins,
    score: AGGREGATE.avgSoulScore,
    grade: "B+",
    color: "#D4B96A",
  },
  { name: "B Corp Average", hawkins: 225, score: 58.6, grade: "B-", color: "#3a86a8" },
  { name: "Fortune 500 Avg", hawkins: 110, score: 31.2, grade: "D", color: "#e17055" },
  { name: "BP (ESG 'AA')", hawkins: 75, score: 25.1, grade: "F", color: "#e63946" },
];
