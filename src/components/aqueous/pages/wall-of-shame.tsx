import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  DollarSign,
  Droplets,
  ExternalLink,
  Factory,
  Megaphone,
  Skull,
  TrendingDown,
  X,
} from "lucide-react";
import { FloatingShare } from "@/components/aqueous/share-button";
import { QPRBadge } from "@/components/aqueous/qpr-badge";
import { Reveal } from "@/components/aqueous/motion";
import type { QPRGrade } from "@/lib/content/aqueous/water-data";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/WallOfShame.tsx (2026-11-24). Same data, copy and
// layout. A Server Component: the page has no state, and the scroll-ins are <Reveal> (client).
// Changes:
// - framer-motion → tw-animate classes / <Reveal> (noted where each was).
// - The app's inline colors and rgba backgrounds are literal classes; the marketing-bar width stays
//   the one runtime inline style.
// - The "⚠ Plastic" / "✓ Glass/None" and "✗" symbols are lucide icons (CONTRIBUTING rule 18).
// - The app's link to Tony's essay on https://tonygreenberg.com is this site's own post now.

export type ShameItem = {
  brand: string;
  parentCompany: string;
  annualRevenue: string;
  marketingSpend: string;
  waterQPR: number;
  grade: QPRGrade;
  marketingToQuality: string;
  shameFactors: string[];
  sources: string[];
  waterId: string | null;
};

// Wall of Shame data — cross-source aggregate from public filings, EPA, EWG, Consumer Reports
export const shameData: ShameItem[] = [
  {
    brand: "Dasani (Coca-Cola)",
    parentCompany: "The Coca-Cola Company",
    annualRevenue: "$45.8B",
    marketingSpend: "$4.2B",
    waterQPR: 35,
    grade: "F",
    marketingToQuality: "Spends $4.2B/yr on marketing. Sells repackaged tap water at 3,000% markup.",
    shameFactors: [
      'Municipal tap water with minerals added back for "taste"',
      "PET plastic packaging — 5,400 microplastic particles/L detected",
      "PFAS levels above EWG health guidelines (2.1 ppt)",
      "Bromate (disinfection byproduct) detected at 3.0 ppb — 30x EWG limit",
    ],
    sources: ["FDA Bottled Water Reports", "Consumer Reports 2024", "Coca-Cola 10-K SEC Filing"],
    waterId: "dasani",
  },
  {
    brand: "Aquafina (PepsiCo)",
    parentCompany: "PepsiCo Inc.",
    annualRevenue: "$91.5B",
    marketingSpend: "$5.1B",
    waterQPR: 32,
    grade: "F",
    marketingToQuality: "PepsiCo spends $5.1B/yr on advertising. Aquafina is literally filtered tap water.",
    shameFactors: [
      "Purified municipal tap water — same source as your kitchen faucet",
      'Was forced by regulators to add "Public Water Source" to labels in 2007',
      "PET plastic packaging contributes to microplastic contamination",
      "Minimal mineral content — stripped during purification, nothing meaningful added back",
    ],
    sources: ["FDA Bottled Water Reports", "PepsiCo 10-K SEC Filing", "Consumer Reports"],
    waterId: null,
  },
  {
    brand: "FIJI Water",
    parentCompany: "The Wonderful Company (Resnick family)",
    annualRevenue: "$5B+ (Wonderful Co.)",
    marketingSpend: "$100M+ (est.)",
    waterQPR: 48,
    grade: "D",
    marketingToQuality: "Premium pricing ($10/gal) for water shipped 5,500 miles in plastic from Fiji.",
    shameFactors: [
      "PFAS detected at 3.5 ppt — near EPA limit, 3.5x EWG guideline",
      "4,800 microplastic particles/L from PET packaging",
      "Shipped 5,500+ miles from Fiji — massive carbon footprint",
      "Resnick family worth $10B+ while Fiji communities lack clean water access",
      "Pays Fiji government just $0.003 per liter extracted",
    ],
    sources: ["FDA Reports", "Consumer Reports", "The Guardian Investigation 2023", "EWG Database"],
    waterId: "fiji",
  },
  {
    brand: "Nestlé Pure Life / Poland Spring",
    parentCompany: "BlueTriton Brands (formerly Nestlé Waters)",
    annualRevenue: "$4.3B (BlueTriton)",
    marketingSpend: "$200M+ (est.)",
    waterQPR: 38,
    grade: "F",
    marketingToQuality: "Nestlé sold its water brands for $4.3B after years of controversy over water extraction.",
    shameFactors: [
      'Poland Spring sued for not actually being "spring water" — settled for $10M',
      "Extracted water from drought-stricken California on expired permits",
      "Paid $200/year to extract millions of gallons from Michigan during Flint water crisis",
      "Multiple PFAS detections across brands",
      "Plastic packaging across entire product line",
    ],
    sources: ["Bloomberg Investigation", "CT Superior Court Records", "Michigan DEQ Reports", "Consumer Reports"],
    waterId: null,
  },
  {
    brand: "Essentia",
    parentCompany: "Nestlé (acquired 2021)",
    annualRevenue: "$500M+ (est.)",
    marketingSpend: "$50M+ (est.)",
    waterQPR: 42,
    grade: "D",
    marketingToQuality: 'Markets "ionized alkaline" water at premium prices. Starts as municipal tap water.',
    shameFactors: [
      "Municipal tap water processed and ionized — not a natural source",
      "pH 9.5+ claims have no proven health benefits per FDA",
      '"Alkaline" marketing exploits health anxiety without scientific backing',
      "PET plastic packaging — 3,800 microplastic particles/L",
      "Acquired by Nestlé in 2021 — inherits their extraction controversies",
    ],
    sources: ["FDA Bottled Water Reports", "Independent Lab Testing", "Journal of Clinical Nutrition"],
    waterId: "essentia",
  },
  {
    brand: "VOSS",
    parentCompany: "VOSS Water ASA",
    annualRevenue: "$150M+ (est.)",
    marketingSpend: "$30M+ (est.)",
    waterQPR: 55,
    grade: "C",
    marketingToQuality: 'Sells "designer water" at $15/gal. The bottle costs more to produce than the water inside.',
    shameFactors: [
      "PFAS detected at 1.8 ppt — above EWG guideline",
      "Extremely low mineral content (6mg/L calcium) — essentially empty water",
      "Premium pricing driven entirely by bottle design, not water quality",
      "Norwegian source sounds exotic but water quality is mediocre",
    ],
    sources: ["FDA Reports", "Norwegian Water Quality Data", "Consumer Reports"],
    waterId: "voss",
  },
];

// The Brand Matrix data — showing inverse correlation
export const brandMatrixData = [
  { brand: "Home RO Filter", marketingSpend: 0, qpr: 89, pricePerGal: 0.08, plastic: false },
  { brand: "Mountain Valley", marketingSpend: 5, qpr: 94, pricePerGal: 8.5, plastic: false },
  { brand: "Waiakea", marketingSpend: 15, qpr: 72, pricePerGal: 12.0, plastic: true },
  { brand: "Saratoga", marketingSpend: 10, qpr: 58, pricePerGal: 14.0, plastic: false },
  { brand: "VOSS", marketingSpend: 30, qpr: 55, pricePerGal: 15.0, plastic: false },
  { brand: "FIJI", marketingSpend: 100, qpr: 48, pricePerGal: 10.0, plastic: true },
  { brand: "Essentia", marketingSpend: 50, qpr: 42, pricePerGal: 6.0, plastic: true },
  { brand: "Nestlé/Poland Spring", marketingSpend: 200, qpr: 38, pricePerGal: 2.0, plastic: true },
  { brand: "Dasani", marketingSpend: 4200, qpr: 35, pricePerGal: 2.5, plastic: true },
  { brand: "Aquafina", marketingSpend: 5100, qpr: 32, pricePerGal: 2.0, plastic: true },
];

type Article = { title: string; source: string; date: string; url: string; summary: string; internal?: boolean };

// Plastic contamination articles — all from credible open sources
export const plasticArticles: Article[] = [
  {
    title: "Bottled Water Contains 240,000 Nanoplastic Particles Per Liter",
    source: "Columbia University / PNAS",
    date: "January 2024",
    url: "https://www.pnas.org/doi/10.1073/pnas.2300582121",
    summary:
      "Researchers found an average of 240,000 nanoplastic fragments per liter of bottled water — 10-100x more than previously estimated. Nanoplastics can penetrate cell membranes and enter the bloodstream.",
  },
  {
    title: "Microplastics Found in Human Blood for the First Time",
    source: "Environment International (Vrije Universiteit Amsterdam)",
    date: "March 2022",
    url: "https://doi.org/10.1016/j.envint.2022.107199",
    summary:
      "PET plastic (the type used in water bottles) was the most common polymer found in human blood samples. 77% of participants had detectable microplastics.",
  },
  {
    title: "Microplastics in Carotid Artery Plaque Linked to 4.5x Higher Risk of Heart Attack",
    source: "New England Journal of Medicine",
    date: "March 2024",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2309822",
    summary:
      "Landmark study: patients with microplastics in their carotid artery plaque had a 4.5x higher risk of heart attack, stroke, or death over 34 months.",
  },
  {
    title: "Microplastics Found in 100% of Human Testicles Tested",
    source: "Toxicological Sciences (University of New Mexico)",
    date: "May 2024",
    url: "https://doi.org/10.1093/toxsci/kfae060",
    summary:
      "Microplastic concentrations in human testicles were 3x higher than in dogs. PET and polyethylene were the most common polymers detected.",
  },
  {
    title: "WHO: Microplastics in Drinking Water — Current Knowledge and Research Needs",
    source: "World Health Organization",
    date: "2022 Update",
    url: "https://www.who.int/publications/i/item/9789240054608",
    summary:
      "WHO acknowledges microplastics are ubiquitous in drinking water but calls for more research on health effects. Recommends reducing plastic pollution at source.",
  },
  {
    title: "Plastic Bottles Leach More Chemicals When Exposed to Heat and Sunlight",
    source: "Environmental Science & Technology",
    date: "2023",
    url: "https://pubs.acs.org/doi/10.1021/acs.est.2c09917",
    summary:
      "PET bottles stored in warm conditions (car trunks, warehouses) leach significantly more antimony, BPA, and phthalates into the water.",
  },
  {
    title: 'PFAS "Forever Chemicals" Found in Major Bottled Water Brands',
    source: "Consumer Reports",
    date: "2024",
    url: "https://www.consumerreports.org/water-quality/pfas-in-bottled-water/",
    summary:
      'Testing of 47 bottled water brands found PFAS in multiple products, including some marketed as "pure" or "premium." Several exceeded EWG health guidelines.',
  },
  {
    title: "The Hidden Cost of Bottled Water: $22 Billion in Annual PFAS Healthcare Costs",
    source: "Environmental Science & Technology Letters",
    date: "2024",
    url: "https://pubs.acs.org/journal/estlcu",
    summary:
      "PFAS contamination costs the US healthcare system an estimated $22 billion annually. Bottled water in plastic is a significant exposure pathway.",
  },
  {
    title: "Nanoplastics Can Cross the Blood-Brain Barrier in Mice",
    source: "Science of The Total Environment",
    date: "2023",
    url: "https://doi.org/10.1016/j.scitotenv.2023.162600",
    summary:
      "Nanoplastic particles from PET bottles can cross the blood-brain barrier and accumulate in brain tissue, raising concerns about neurotoxicity.",
  },
  {
    title: "Bottled Water Industry Generates 600 Billion Plastic Bottles Per Year",
    source: "The Guardian / Euromonitor",
    date: "2024",
    url: "https://www.theguardian.com/environment/plastic",
    summary:
      "The global bottled water industry produces 600 billion plastic bottles annually. Less than 30% are recycled. The rest end up in landfills, oceans, and our bodies.",
  },
  {
    title: "Microplastics Detected in Human Placenta",
    source: "Environment International",
    date: "2021",
    url: "https://doi.org/10.1016/j.envint.2020.106274",
    summary:
      "Microplastics were found in human placental tissue for the first time, raising concerns about prenatal exposure and developmental effects.",
  },
  {
    title: "Forever Chemicals in My Blood: What I Learned Testing for PFAS and Microplastics",
    source: "Tony Greenberg / tonygreenberg.com",
    date: "December 2025",
    // Was https://tonygreenberg.com/forever-chemicals-in-my-blood-what-i-learned-testing-for-pfas-and-microplastics/,
    // i.e. this site: the same essay lives at /blog/forever-chemicals-in-my-blood-pfas-and-microplastics.
    url: "/blog/forever-chemicals-in-my-blood-pfas-and-microplastics",
    internal: true,
    summary:
      "Personal account of PFAS blood testing revealing 17 microplastic particles. 98% of Americans have measurable PFAS. Recommends RO filtration and glass containers.",
  },
];

/** "$5.1B", "$200M", "$0" (the app's inline formatter). */
export function formatMarketing(spend: number) {
  if (spend <= 0) return "$0";
  return `$${spend >= 1000 ? (spend / 1000).toFixed(1) + "B" : spend + "M"}`;
}

/** The app's qprColor thresholds as full literal classes (it used `${qprColor}20` background + color). */
function qprChipClass(qpr: number) {
  if (qpr >= 80) return "bg-[#0A8754]/12.5 text-[#0A8754]";
  if (qpr >= 60) return "bg-[#4ECDC4]/12.5 text-[#4ECDC4]";
  if (qpr >= 45) return "bg-[#B87333]/12.5 text-[#B87333]";
  return "bg-[#9B2335]/12.5 text-[#9B2335]";
}

const articleCardClass =
  "group block h-full rounded-2xl border border-border/50 p-5 transition-all hover:border-primary/30 hover:shadow-lg";

function ArticleCardBody({ article }: { article: Article }) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{article.date}</span>
        <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-base leading-snug font-bold transition-colors group-hover:text-primary">{article.title}</h3>
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{article.summary}</p>
      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{article.source}</span>
    </>
  );
}

export function WallOfShame() {
  // Sort shame data by QPR (worst first)
  const sorted = [...shameData].sort((a, b) => a.waterQPR - b.waterQPR);
  // Sort matrix data by marketing spend descending
  const matrixSorted = [...brandMatrixData].sort((a, b) => b.marketingSpend - a.marketingSpend);
  const maxMarketing = Math.max(...brandMatrixData.map((d) => d.marketingSpend));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — Dark, provocative. The app's linear-gradient(135deg, #1a0a0a, #0B3D4E, #1a0a0a). */}
      <section className="relative overflow-hidden bg-linear-135/srgb from-[#1a0a0a] via-[#0B3D4E] to-[#1a0a0a] pt-24 pb-20">
        <div className="sacred-geo-bg absolute inset-0 opacity-10" />
        <div className="grain-overlay absolute inset-0" />
        <div className="relative z-10 container">
          {/* framer: initial {opacity 0, y 30} → animate, duration 0.8 */}
          <div className="max-w-4xl animate-in fill-mode-both duration-800 fade-in slide-in-from-bottom-[30px]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                <Skull className="h-6 w-6 text-red-400" aria-hidden="true" />
              </div>
              <span className="font-mono text-sm tracking-widest text-red-400/80 uppercase">Exposing the Truth</span>
            </div>
            <h1 className="mb-6 font-aq-display text-5xl font-bold tracking-tight text-[#F5F0E8] md:text-7xl">
              The Wall of Shame
            </h1>
            <p className="mb-4 text-xl leading-relaxed text-[#D4C5A9] md:text-2xl">
              The bigger the brand, the bigger the marketing budget, the worse the water.
            </p>
            <p className="text-lg leading-relaxed text-[#D4C5A9]/70">
              Madoff&apos;s Law states: <em>&ldquo;Anywhere profit can be made, it will be made.&rdquo;</em> These
              corporations spend billions convincing you their repackaged tap water is premium. The data tells a different
              story.
            </p>
          </div>
        </div>
      </section>

      {/* The QPR vs. Brand Matrix */}
      <section className="bg-card py-20">
        <div className="container">
          {/* framer: whileInView {opacity 0, y 20} → {1, 0}, once */}
          <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both" className="mx-auto mb-12 max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <TrendingDown className="h-6 w-6 text-red-500" aria-hidden="true" />
              <h2 className="font-aq-display text-3xl font-bold md:text-4xl">The Inverse Correlation</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              More marketing spend = worse water quality. The data is unambiguous. Here&apos;s every major brand plotted
              against their QPR score.
            </p>
          </Reveal>

          {/* Visual Matrix */}
          <div className="mx-auto max-w-5xl">
            {/* Fix from live: six columns in a 12-column grid can't fit at 375px ("RECOMMENDED" and the
                packaging chips spilled out of their cells). Below md the table scrolls sideways inside
                its own box instead. */}
            <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
              <div className="grid min-w-160 gap-3 md:min-w-0">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  <div className="col-span-3">Brand</div>
                  <div className="col-span-2 text-right">Marketing $</div>
                  <div className="col-span-1 text-center">QPR</div>
                  <div className="col-span-2 text-center">$/Gallon</div>
                  <div className="col-span-2 text-center">Packaging</div>
                  <div className="col-span-2 text-center">Verdict</div>
                </div>

                {matrixSorted.map((item, i) => {
                  const barWidth = maxMarketing > 0 ? (item.marketingSpend / maxMarketing) * 100 : 0;
                  return (
                    // framer: whileInView {opacity 0, x -20} → {1, 0}, once, delay i * 0.08
                    <Reveal
                      key={item.brand}
                      enter="animate-in fade-in slide-in-from-left-5 duration-500 fill-mode-both"
                      delay={i * 0.08}
                      className={`relative grid grid-cols-12 items-center gap-2 rounded-xl border border-border/50 px-4 py-4 transition-colors hover:border-border ${
                        item.qpr < 45 ? "bg-[#9B2335]/4" : "bg-transparent"
                      }`}
                    >
                      {/* Marketing spend bar background */}
                      <div
                        data-testid="marketing-bar"
                        className="absolute top-0 bottom-0 left-0 rounded-xl bg-[#9B2335] opacity-5"
                        style={{ width: `${barWidth}%` }}
                      />
                      <div className="relative z-10 col-span-3 text-sm font-semibold">{item.brand}</div>
                      <div className="relative z-10 col-span-2 text-right font-mono text-sm">{formatMarketing(item.marketingSpend)}</div>
                      <div className="relative z-10 col-span-1 text-center">
                        <span
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${qprChipClass(item.qpr)}`}
                        >
                          {item.qpr}
                        </span>
                      </div>
                      <div className="relative z-10 col-span-2 text-center font-mono text-sm">${item.pricePerGal.toFixed(2)}</div>
                      <div className="relative z-10 col-span-2 text-center">
                        {item.plastic ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500">
                            <AlertTriangle className="size-3" aria-hidden="true" /> Plastic
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600">
                            <Check className="size-3" aria-hidden="true" /> Glass/None
                          </span>
                        )}
                      </div>
                      <div className="relative z-10 col-span-2 text-center">
                        {item.qpr >= 80 ? (
                          <span className="text-xs font-semibold text-emerald-600">RECOMMENDED</span>
                        ) : item.qpr >= 55 ? (
                          <span className="text-xs font-semibold text-amber-600">MEDIOCRE</span>
                        ) : (
                          <span className="text-xs font-semibold text-red-500">SHAMEFUL</span>
                        )}
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            {/* Insight callout. framer: whileInView {opacity 0, y 20} → {1, 0}, once */}
            <Reveal
              enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
              className="mt-8 rounded-2xl border-2 border-red-500/20 bg-[#9B2335]/5 p-6"
            >
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-1 h-8 w-8 shrink-0 text-red-500" aria-hidden="true" />
                <div>
                  <h3 className="mb-2 text-lg font-bold">The Pattern Is Clear</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    Companies spending <strong>billions on marketing</strong> are selling you repackaged municipal tap water
                    in plastic bottles that leach microplastics into every sip. Meanwhile, a $200 reverse osmosis filter at
                    home produces water that scores <strong>89 QPR</strong> at <strong>$0.08/gallon</strong> — that&apos;s
                    2,500% better value than Dasani and infinitely better for your body and the planet.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Individual Shame Cards */}
      <section className="py-20">
        <div className="container">
          <div className="mb-4 flex items-center gap-3">
            <Factory className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <h2 className="font-aq-display text-3xl font-bold md:text-4xl">The Offenders</h2>
          </div>
          <p className="mb-12 max-w-3xl text-lg text-muted-foreground">
            Each of these corporations prioritizes profit extraction over your health. Here&apos;s the evidence, sourced
            from public filings, FDA reports, and independent lab testing.
          </p>

          <div className="grid gap-6">
            {sorted.map((item, i) => (
              // framer: whileInView {opacity 0, y 20} → {1, 0}, once, delay i * 0.1
              <Reveal
                key={item.brand}
                enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                delay={i * 0.1}
                className="rounded-2xl border border-border/50 bg-[#9B2335]/2 p-6 transition-colors hover:border-red-500/30 md:p-8"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  {/* Left — Score & Brand */}
                  <div className="flex shrink-0 items-center gap-4 md:w-64">
                    <QPRBadge score={item.waterQPR} grade={item.grade} size="md" />
                    <div>
                      <h3 className="text-xl font-bold">{item.brand}</h3>
                      <p className="text-sm text-muted-foreground">{item.parentCompany}</p>
                    </div>
                  </div>

                  {/* Right — Details */}
                  <div className="flex-1">
                    {/* Financial stats */}
                    <div className="mb-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <span>
                          Revenue: <strong>{item.annualRevenue}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-sm">
                        <Megaphone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <span>
                          Marketing: <strong>{item.marketingSpend}</strong>
                        </span>
                      </div>
                    </div>

                    <p className="mb-4 text-sm font-medium text-[#B87333]">{item.marketingToQuality}</p>

                    {/* Shame factors */}
                    <div className="mb-4 space-y-2">
                      {item.shameFactors.map((factor, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <X className="mt-0.5 size-4 shrink-0 text-red-500" aria-hidden="true" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>

                    {/* Sources */}
                    <div className="flex flex-wrap gap-2">
                      {item.sources.map((source, j) => (
                        <span key={j} className="rounded-full bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                          {source}
                        </span>
                      ))}
                    </div>

                    {/* Link to detail */}
                    {item.waterId && (
                      <Link
                        href={aq(`/water/${item.waterId}`)}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        View Full QPR Breakdown <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Plastic Truth — Articles Section */}
      <section className="bg-card py-20">
        <div className="container">
          {/* framer: whileInView {opacity 0, y 20} → {1, 0}, once */}
          <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both" className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-500" aria-hidden="true" />
              <h2 className="font-aq-display text-3xl font-bold md:text-4xl">The Plastic Truth</h2>
            </div>
            <p className="max-w-3xl text-lg text-muted-foreground">
              A dozen peer-reviewed studies and investigative reports that expose what plastic water bottles are doing to
              your body. Every article is from a credible, open source.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {plasticArticles.map((article, i) => (
              // framer: motion.a whileInView {opacity 0, y 20} → {1, 0}, once, delay i * 0.05. The Reveal
              // wraps the link (it renders a div), and the link fills it.
              <Reveal key={i} enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both" delay={i * 0.05}>
                {article.internal ? (
                  <Link href={article.url} className={articleCardClass}>
                    <ArticleCardBody article={article} />
                  </Link>
                ) : (
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className={articleCardClass}>
                    <ArticleCardBody article={article} />
                  </a>
                )}
              </Reveal>
            ))}
          </div>

          {/* Glass promotion callout. framer: whileInView {opacity 0, y 20} → {1, 0}, once */}
          <Reveal
            enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
            className="mt-12 rounded-2xl border-2 border-emerald-500/20 bg-[#0A8754]/5 p-8"
          >
            <div className="flex flex-col items-start gap-6 md:flex-row">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Droplets className="h-8 w-8 text-emerald-600" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-3 font-aq-display text-2xl font-bold">Choose Glass. Choose Life.</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  Glass bottles leach <strong>zero microplastics</strong> into your water. They&apos;re infinitely
                  recyclable, don&apos;t absorb flavors, and don&apos;t degrade with heat or sunlight. Every sip from glass
                  is a sip free from the 240,000 nanoplastic particles found in the average plastic bottle. If you must buy
                  bottled water, choose glass — Mountain Valley Spring, Saratoga, or Gerolsteiner all offer glass options.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  But the best option?{" "}
                  <strong>Filter your own water at home with a reverse osmosis system and store it in glass.</strong>{" "}
                  You&apos;ll get cleaner water than any bottled brand at a fraction of the cost — and zero plastic waste.
                </p>
                <Link
                  href={aq("/filter-guide")}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  See Our RO Filter Guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA — What You Can Do */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-aq-display text-3xl font-bold md:text-4xl">What You Can Do Right Now</h2>
            <div className="grid gap-6 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-border/50 p-5">
                <div className="mb-2 font-aq-display text-3xl font-bold text-primary">01</div>
                <h3 className="mb-2 font-semibold">Stop Buying Plastic</h3>
                <p className="text-sm text-muted-foreground">
                  Switch to glass bottles or home filtration. Every plastic bottle you don&apos;t buy is 240,000 fewer
                  nanoplastics in your body.
                </p>
              </div>
              <div className="rounded-2xl border border-border/50 p-5">
                <div className="mb-2 font-aq-display text-3xl font-bold text-primary">02</div>
                <h3 className="mb-2 font-semibold">Install an RO Filter</h3>
                <p className="text-sm text-muted-foreground">
                  A $200 reverse osmosis system removes 99% of contaminants. It pays for itself in 2 months vs. bottled
                  water.
                </p>
              </div>
              <div className="rounded-2xl border border-border/50 p-5">
                <div className="mb-2 font-aq-display text-3xl font-bold text-primary">03</div>
                <h3 className="mb-2 font-semibold">Share the Truth</h3>
                <p className="text-sm text-muted-foreground">
                  Send this page to someone who still buys Dasani. Knowledge is the first step toward conscious
                  consumption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FloatingShare />
    </div>
  );
}
