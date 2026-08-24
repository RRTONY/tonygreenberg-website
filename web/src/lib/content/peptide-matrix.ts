// Shared data for /peptide-matrix. Kept in a plain module, imported
// independently by both the Server Component page and the client-side
// interactive explorer/methodology components — never re-exported from a
// "use client" file (see peptide-criteria.ts for why that breaks).

export interface MatrixEntity {
  id: string;
  name: string;
  type: "influencer" | "clinic" | "vendor" | "doctor" | "regulatory";
  reviews: number;
  evidence: number;
  gap: number;
  quadrant: string;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "HIGHEST" | "REGULATORY";
  notes: string;
  reviewSources?: string[];
  wallScore?: number;
  tier?: number;
  details?: string;
}

export const ENTITIES: MatrixEntity[] = [
  { id: "brecka", name: "Gary Brecka", type: "influencer", reviews: 4.5, evidence: 5, gap: 90, quadrant: "Q4", riskLevel: "HIGHEST", notes: "2M followers. Zero Phase 3 trials for any promoted peptide.", wallScore: 100, tier: 5, details: "Human biologist (not MD). Promotes BPC-157, GHK-Cu, and other peptides with no FDA-approved human trials. Massive social media following creates outsized influence relative to evidence base." },
  { id: "rogan", name: "Joe Rogan", type: "influencer", reviews: 4.8, evidence: 5, gap: 96, quadrant: "Q4", riskLevel: "HIGHEST", notes: "11M listeners. Personal testimonial only. 35 animal studies, 1 human study.", wallScore: 96, tier: 5, details: "Podcast host, not medical professional. Promotes BPC-157 based on personal experience. Audience scale means millions receive unvetted medical information as entertainment." },
  { id: "ways2well", name: "Ways2Well", type: "clinic", reviews: 4.2, evidence: 5, gap: 84, quadrant: "Q4", riskLevel: "HIGHEST", notes: "Patient satisfaction high. Prescribes FDA Category 2 substances.", reviewSources: ["google", "yelp", "healthgrades"], wallScore: 84, tier: 4, details: "Telehealth peptide clinic. High patient satisfaction scores mask the fact that prescribed substances lack Phase 3 clinical trials. Revenue model depends on recurring peptide prescriptions." },
  { id: "genesis", name: "GP", type: "vendor", reviews: 3.8, evidence: 0, gap: 76, quadrant: "Q4", riskLevel: "HIGHEST", notes: "Research theater. Markets directly to humans despite 'research only' labels.", reviewSources: ["trustpilot", "reddit"], wallScore: 90, tier: 5, details: "Peptide vendor selling 'for research purposes only' while marketing clearly targets human consumption. Zero clinical evidence. Contamination risk from unregulated manufacturing." },
  { id: "koniver", name: "Dr. Koniver", type: "doctor", reviews: 4.6, evidence: 5, gap: 92, quadrant: "Q4", riskLevel: "HIGHEST", notes: "'Use with every patient. Super safe.' No supporting trials.", reviewSources: ["healthgrades", "google"], wallScore: 66, tier: 4, details: "MD who claims to use peptides with every patient and calls them 'super safe' despite absence of Phase 3 RCTs. High patient satisfaction driven by attentive care model, not peptide efficacy data." },
  { id: "levinson", name: "Dr. Andrew Levinson", type: "doctor", reviews: 3.4, evidence: 35, gap: 33, quadrant: "Q4", riskLevel: "MODERATE", notes: "MD integrative. Mixed reviews. Some evidence-based, some alternative. Expensive supplements.", reviewSources: ["healthgrades", "vitals", "webmd", "yelp", "us_news"], wallScore: 55, tier: 3, details: "MD (1996, U Miami), Psychiatry. Vitality Health & Wellness, 801 4th St, Miami Beach, FL 33139. Practices functional/integrative medicine and orthomolecular psychiatry. Ketamine treatment is evidence-based (FDA-approved esketamine 2019). However, proprietary supplements have no independent trials, HBOT for autism has insufficient evidence per AAP/Cochrane, and orthomolecular psychiatry has limited mainstream acceptance. No public peptide claims found." },
  { id: "prisk", name: "Dr. Prisk", type: "doctor", reviews: 4.2, evidence: 95, gap: -53, quadrant: "Q1", riskLevel: "LOW", notes: "Good reviews AND calls out unproven claims. Evidence-based practice.", reviewSources: ["healthgrades", "google"], wallScore: 1, tier: 1, details: "Evidence-based physician who actively critiques unproven peptide claims. Reviews reflect genuine patient satisfaction with science-backed treatments. The gold standard: high satisfaction aligned with high evidence." },
  { id: "usada", name: "USADA", type: "regulatory", reviews: 0, evidence: 100, gap: 0, quadrant: "REGULATORY", riskLevel: "REGULATORY", notes: "States there is no legal basis to sell BPC-157 for human use.", details: "United States Anti-Doping Agency. Regulatory body that has explicitly stated BPC-157 has no legal basis for sale for human consumption. Represents the evidence ceiling — pure regulatory/scientific position." },
];

export const QUADRANTS = [
  { id: "Q1", label: "Aligned", subtitle: "High Reviews + High Evidence", color: "#2E8B57", risk: "LOW", description: "Market acceptance aligned with science. These practitioners have both satisfied patients AND evidence-based treatments." },
  { id: "Q2", label: "Good Science, Poor Marketing", subtitle: "Low Reviews + High Evidence", color: "#4A90D9", risk: "LOW", description: "Evidence-based despite bad reviews. Good science, poor bedside manner or marketing." },
  { id: "Q3", label: "Obvious Scams", subtitle: "Low Reviews + Low Evidence", color: "#888888", risk: "HIGH", description: "The market has identified poor quality. Low satisfaction AND low evidence." },
  { id: "Q4", label: "Danger Zone", subtitle: "High Reviews + Low Evidence", color: "#C0392B", risk: "HIGHEST", description: "Satisfaction ≠ safety/efficacy. People love it but science doesn't support it. This is where the most harm occurs." },
] as const;

export const DANGER_MECHANISMS = [
  { title: "Placebo Effect", stat: "30–40%", description: "People feel better and leave 5-star reviews. The actual mechanism is placebo, not the peptide. Reviews capture satisfaction, not efficacy.", iconKey: "brain" },
  { title: "Confirmation Bias", stat: "$500+", description: "You paid $500 — it must work. Cognitive dissonance reduction makes you find 'evidence' it worked and ignore lack of improvement.", iconKey: "refresh" },
  { title: "Natural Healing", stat: "6–12 weeks", description: "Most injuries heal naturally in 6–12 weeks. Peptide taken during healing gets the credit. Classic post hoc ergo propter hoc fallacy.", iconKey: "clock" },
  { title: "Selection Bias", stat: "Survivors only", description: "People who got better leave reviews. People who got worse don't return or review. Survivorship bias dominates every review platform.", iconKey: "chart" },
  { title: "Financial Incentive", stat: "5★ = discount", description: "Sellers encourage positive reviews with discounts. Negative reviews get disputed and removed. The review ecosystem is structurally compromised.", iconKey: "dollar" },
] as const;

export const EVIDENCE_CRITERIA = [
  { label: "Phase 3 RCT Completed", points: "+40", positive: true },
  { label: "Phase 2 RCT Completed", points: "+25", positive: true },
  { label: "Phase 1 Safety Completed", points: "+15", positive: true },
  { label: "Animal Studies Only", points: "+5", positive: null },
  { label: "FDA Approval", points: "+20", positive: true },
  { label: "FDA Category 2 (Safety Concerns)", points: "−20", positive: false },
  { label: "WADA Banned", points: "−10", positive: false },
  { label: "Contamination Reports", points: "−15", positive: false },
] as const;

export const REVIEW_SOURCES = [
  "Yelp Business Reviews",
  "Google My Business",
  "Healthgrades Patient Ratings",
  "Vitals.com Physician Reviews",
  "WebMD Doctor Ratings",
  "US News Doctor Finder",
  "Reddit (r/peptides, r/Biohacking, r/Nootropics)",
  "Trustpilot (for vendors)",
  "BBB Ratings",
  "FDA Warning Letters",
  "WADA Prohibited Substance Lists",
  "PubMed Clinical Trials Database",
];

export const CROSS_LINKS = [
  { href: "/find-your-peptide", title: "Peptide Clarity Index™", desc: "10 questions, 7 clinical axes, 16 archetypes. The only assessment that screens for contraindications.", iconKey: "dna" },
  { href: "/peptide-hall-of-shame", title: "Hall of Shame", desc: "20 US providers audited on 6 clinical criteria. Average score: 95/100 (worst).", iconKey: "alert" },
  { href: "/peptide-supply-chain", title: "Where Does Your $ Go?", desc: "Supply chain mapped for 12 providers. Manufacturing vs. marketing vs. profit.", iconKey: "dollar" },
  { href: "/quiz_25q", title: "25-Question Literacy Quiz", desc: "Test your peptide knowledge across 5 dimensions. Most score below 60%.", iconKey: "file" },
  { href: "/peptide-watch", title: "PeptideWatch Safety Guide", desc: "12 fraud patterns, 10-question supply chain test, vendor scorecard, role-based checklists.", iconKey: "shield" },
  { href: "/blog/the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine", title: "The Investigation", desc: "22-minute deep dive: $65M fraud industry vs. life-changing medicine.", iconKey: "newspaper" },
] as const;
