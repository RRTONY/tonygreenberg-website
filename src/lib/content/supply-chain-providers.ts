// Shared supply-chain audit data for /peptide-supply-chain, used by both the
// page (Server Component) and supply-chain-rankings.tsx (Client Component).
// Kept in a plain module rather than exported from the client file — see
// peptide-criteria.ts for why a data constant re-exported from a "use client"
// module doesn't cross back into a Server Component correctly.

export interface CostBreakdown {
  manufacturing: number;
  marketing: number;
  compliance: number;
  physician: number;
  rnd: number;
  shipping: number;
  profit: number;
}

export interface Provider {
  name: string;
  url: string;
  monthlyPrice: number;
  breakdown: CostBreakdown;
  credibilityScore: number; // 1-100, 100 = most credible
  model: string;
  transparency: "high" | "medium" | "low" | "opaque";
  flags: string[];
  notes: string;
}

export const PROVIDERS: Provider[] = [
  { name: "Admire Medical", url: "https://www.admiremedical.com", monthlyPrice: 350, breakdown: { manufacturing: 18, marketing: 15, compliance: 12, physician: 20, rnd: 5, shipping: 5, profit: 25 }, credibilityScore: 72, model: "Physician-supervised telehealth", transparency: "medium", flags: ["Requires consultation", "Compounding pharmacy sourced"], notes: "Higher physician allocation suggests real clinical oversight. Marketing spend moderate. Profit margin within industry norms." },
  { name: "Defy Medical", url: "https://www.defymedical.com", monthlyPrice: 300, breakdown: { manufacturing: 20, marketing: 12, compliance: 10, physician: 18, rnd: 3, shipping: 7, profit: 30 }, credibilityScore: 65, model: "Telehealth + compounding pharmacy", transparency: "medium", flags: ["Compounding pharmacy", "Lab work required"], notes: "Decent manufacturing allocation. Low R&D suggests they're dispensing known protocols rather than innovating. Profit margin on the higher side." },
  { name: "10X Health System", url: "https://10xhealthsystem.com", monthlyPrice: 500, breakdown: { manufacturing: 8, marketing: 40, compliance: 5, physician: 8, rnd: 2, shipping: 5, profit: 32 }, credibilityScore: 22, model: "Celebrity-endorsed DTC", transparency: "opaque", flags: ["Heavy influencer marketing", "Grant Cardone branded", "Minimal clinical oversight"], notes: "40 cents of every dollar goes to marketing. Only 8 cents to manufacturing. The celebrity premium is real — you're paying for the brand, not the peptide." },
  { name: "Renew Youth", url: "https://www.renewyouth.com", monthlyPrice: 400, breakdown: { manufacturing: 12, marketing: 30, compliance: 8, physician: 12, rnd: 3, shipping: 5, profit: 30 }, credibilityScore: 35, model: "Franchise telehealth", transparency: "low", flags: ["Franchise model", "Aggressive upselling", "Lead gen focused"], notes: "High marketing spend typical of franchise models. Each franchise pays for its own lead generation. You're funding their customer acquisition." },
  { name: "Maximus", url: "https://www.maximustribe.com", monthlyPrice: 200, breakdown: { manufacturing: 15, marketing: 35, compliance: 5, physician: 5, rnd: 5, shipping: 10, profit: 25 }, credibilityScore: 30, model: "DTC subscription", transparency: "low", flags: ["Subscription model", "Minimal physician contact", "Social media heavy"], notes: "Low price point but 35% goes to marketing. Physician allocation of 5% suggests minimal clinical oversight. The subscription model prioritizes retention over outcomes." },
  { name: "Fountain Life", url: "https://www.fountainlife.com", monthlyPrice: 800, breakdown: { manufacturing: 10, marketing: 20, compliance: 15, physician: 15, rnd: 8, shipping: 2, profit: 30 }, credibilityScore: 55, model: "Concierge medicine", transparency: "medium", flags: ["Premium pricing", "Peter Diamandis affiliated", "Diagnostic-heavy"], notes: "Higher R&D and compliance spend than most. But at $800/month, the 30% profit margin is $240. The premium is partly brand, partly genuine diagnostics." },
  { name: "AgelessRx", url: "https://www.agelessrx.com", monthlyPrice: 250, breakdown: { manufacturing: 22, marketing: 18, compliance: 10, physician: 15, rnd: 8, shipping: 7, profit: 20 }, credibilityScore: 68, model: "Telehealth + research", transparency: "medium", flags: ["Runs clinical trials", "Published research", "Compounding pharmacy"], notes: "Highest manufacturing allocation in the group. Active clinical trial program justifies R&D spend. Lower profit margin suggests mission-driven model." },
  { name: "Peptide Sciences", url: "https://www.peptidesciences.com", monthlyPrice: 80, breakdown: { manufacturing: 35, marketing: 15, compliance: 2, physician: 0, rnd: 8, shipping: 15, profit: 25 }, credibilityScore: 15, model: "Research chemical vendor", transparency: "low", flags: ["No physician oversight", '"Research use only"', "No medical guidance"], notes: "Highest manufacturing percentage because there's zero physician cost. But 0% physician oversight means you're self-medicating with research chemicals. The low price is the danger signal." },
  { name: "Evolve", url: "https://www.evolvehrt.com", monthlyPrice: 350, breakdown: { manufacturing: 10, marketing: 35, compliance: 5, physician: 10, rnd: 2, shipping: 8, profit: 30 }, credibilityScore: 25, model: "HRT clinic with peptide add-ons", transparency: "opaque", flags: ["Peptides as upsell", "Primary focus is HRT", "Limited peptide expertise"], notes: "Peptides are a revenue add-on to their core HRT business. High marketing, low manufacturing, minimal R&D. You're subsidizing their HRT marketing funnel." },
  { name: "Elite Living & Health", url: "https://www.elitelivingandhealth.com", monthlyPrice: 375, breakdown: { manufacturing: 12, marketing: 28, compliance: 8, physician: 15, rnd: 2, shipping: 5, profit: 30 }, credibilityScore: 38, model: "Boutique wellness clinic", transparency: "low", flags: ["Lifestyle branding", "Limited published protocols", "Premium positioning"], notes: "The 'elite' branding adds a premium without corresponding clinical value. Marketing-heavy model. Physician allocation is decent but R&D is nearly zero." },
  { name: "HRTGuru", url: "https://www.hrtguru.com", monthlyPrice: 280, breakdown: { manufacturing: 15, marketing: 25, compliance: 5, physician: 12, rnd: 3, shipping: 10, profit: 30 }, credibilityScore: 32, model: "Online HRT + peptides", transparency: "low", flags: ["Guru branding", "SEO-driven acquisition", "Limited clinical depth"], notes: "The 'guru' positioning is a marketing play. 25% to marketing, minimal compliance. Profit margin at 30% with limited clinical infrastructure." },
  { name: "Vitality Centers NW", url: "https://vitalitycentersnw.com", monthlyPrice: 320, breakdown: { manufacturing: 14, marketing: 22, compliance: 8, physician: 18, rnd: 3, shipping: 5, profit: 30 }, credibilityScore: 45, model: "Regional clinic network", transparency: "medium", flags: ["In-person option", "Regional presence", "Standard protocols"], notes: "Better than average physician allocation. Regional model means lower marketing costs than national brands. Standard but not innovative." },
];

export const COST_CATEGORIES: {
  key: keyof CostBreakdown;
  label: string;
  color: string;
  description: string;
}[] = [
  { key: "manufacturing", label: "Manufacturing", color: "#2E8B57", description: "Raw peptide synthesis, compounding, quality testing, packaging" },
  { key: "physician", label: "Physician Oversight", color: "#4682B4", description: "Doctor consultations, protocol design, monitoring, lab review" },
  { key: "compliance", label: "Compliance & Safety", color: "#6A5ACD", description: "FDA compliance, pharmacy licensing, adverse event reporting, insurance" },
  { key: "rnd", label: "R&D", color: "#C97B7B", description: "Clinical trials, protocol development, outcome tracking, published research" },
  { key: "marketing", label: "Marketing & Sales", color: "#CD853F", description: "Advertising, influencer deals, SEO, lead generation, sales team" },
  { key: "shipping", label: "Shipping & Handling", color: "#999999", description: "Cold chain logistics, packaging, delivery, returns" },
  { key: "profit", label: "Profit Margin", color: "#B22222", description: "What the company keeps after all costs" },
];
