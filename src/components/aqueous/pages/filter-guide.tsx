import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle,
  DollarSign,
  ExternalLink,
  Heart,
  Leaf,
  Shield,
  Star,
} from "lucide-react";
import { Reveal } from "@/components/aqueous/motion";
import { FloatingShare } from "@/components/aqueous/share-button";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/FilterGuide.tsx (2026-11-24): best-value RO filters,
// glass bottles and Amazon links. Same copy, data and classes; framer-motion replaced with CSS
// (each replaced prop is noted), Navigation/Footer/SEOHead come from the /aqueous layout and page
// metadata. A Server Component: only Reveal and FloatingShare run in the browser.

// RO Filter recommendations — sourced from Amazon reviews, Consumer Reports, WQA certifications
export const roFilters = [
  {
    rank: 1,
    name: "APEC Water Systems ROES-50",
    tagline: "Best Overall Value — The People's Champion",
    price: "$189.95",
    rating: 4.7,
    reviews: "12,800+",
    gallonCost: "$0.06/gal",
    stages: 5,
    removes: [
      "PFAS (99%)",
      "Lead (99%)",
      "Chlorine (99%)",
      "Fluoride (97%)",
      "Arsenic (99%)",
      "Microplastics (99.9%)",
      "Bacteria",
      "Viruses",
    ],
    certifications: ["WQA Gold Seal", "NSF/ANSI 58"],
    pros: [
      "Made in USA",
      "Super easy DIY install (30 min)",
      "Filters last 12 months",
      "Best price-to-performance ratio on Amazon",
      "Free tech support for life",
    ],
    cons: ["Wastes 3 gallons per 1 gallon produced (standard for RO)", "Tank takes up under-sink space"],
    amazonUrl: "https://www.amazon.com/dp/B00I0ZGOZM",
    whyWeLoveIt:
      "At $0.06/gallon, this system produces water that scores higher than any bottled water we've tested — including $15/gallon VOSS. It removes 99% of PFAS, lead, and microplastics. The math is simple: it pays for itself in 6 weeks vs. buying bottled water.",
    featured: true,
  },
  {
    rank: 2,
    name: "iSpring RCC7AK",
    tagline: "Best for Mineral Remineralization",
    price: "$209.99",
    rating: 4.6,
    reviews: "9,200+",
    gallonCost: "$0.07/gal",
    stages: 6,
    removes: [
      "PFAS (99%)",
      "Lead (99%)",
      "Chlorine (99%)",
      "Fluoride (96%)",
      "Arsenic (98%)",
      "Microplastics (99.9%)",
    ],
    certifications: ["NSF/ANSI 58", "WQA Certified"],
    pros: [
      "6th stage adds back healthy minerals (calcium, magnesium)",
      "Alkaline pH output",
      "Great taste",
      "Solid build quality",
    ],
    cons: ["Slightly more expensive than APEC", "Mineral filter needs replacement every 12 months"],
    amazonUrl: "https://www.amazon.com/dp/B003XELTTG",
    whyWeLoveIt:
      "The 6th alkaline remineralization stage adds back calcium and magnesium that RO strips out. You get the purity of reverse osmosis with the mineral profile of a natural spring. Best of both worlds.",
    featured: false,
  },
  {
    rank: 3,
    name: "Waterdrop G3P800",
    tagline: "Best Tankless / Space-Saving",
    price: "$399.99",
    rating: 4.5,
    reviews: "5,600+",
    gallonCost: "$0.09/gal",
    stages: 3,
    removes: ["PFAS (99%)", "Lead (99.3%)", "Chlorine (99%)", "TDS (94%)", "Microplastics (99.9%)"],
    certifications: ["NSF/ANSI 58", "NSF 372"],
    pros: [
      "Tankless design — saves 70% under-sink space",
      "800 GPD output — fills a glass in 8 seconds",
      "Smart faucet with TDS monitor",
      "Low waste ratio (3:1)",
    ],
    cons: ["Higher upfront cost", "Requires electricity", "Filter replacements are pricier"],
    amazonUrl: "https://www.amazon.com/dp/B0BYJMPFMN",
    whyWeLoveIt:
      "If you have a small kitchen or hate the look of a tank under your sink, this is the one. Tankless, fast, and the smart faucet shows you real-time water quality. Premium, but worth it for the right setup.",
    featured: false,
  },
  {
    rank: 4,
    name: "Express Water RO5DX",
    tagline: "Best Budget Option Under $150",
    price: "$139.99",
    rating: 4.4,
    reviews: "7,100+",
    gallonCost: "$0.05/gal",
    stages: 5,
    removes: ["Lead (99%)", "Chlorine (99%)", "Fluoride (95%)", "Bacteria", "Heavy Metals"],
    certifications: ["NSF Certified Components"],
    pros: [
      "Lowest price for a quality 5-stage RO",
      "Color-coded filters for easy replacement",
      "Quick-connect fittings",
      "Includes all installation hardware",
    ],
    cons: ["PFAS removal not independently verified", "Plastic housing (vs. metal on APEC)", "Slower flow rate"],
    amazonUrl: "https://www.amazon.com/dp/B00M0FKE7G",
    whyWeLoveIt:
      "If budget is the primary concern, this gets you 90% of the way there at the lowest cost. At $0.05/gallon, it's the cheapest clean water you can get — period.",
    featured: false,
  },
];

// Glass bottle recommendations
export const glassBottles = [
  {
    name: "Lifefactory 22oz Glass Bottle",
    price: "$24.99",
    features: [
      "Silicone sleeve for grip & protection",
      "BPA-free flip cap",
      "Dishwasher safe",
      "Made with pharmaceutical-grade glass",
    ],
    amazonUrl: "https://www.amazon.com/dp/B00BFMB9FQ",
  },
  {
    name: "Ello Syndicate 20oz Glass Bottle",
    price: "$14.99",
    features: ["One-touch flip lid", "Silicone boot", "Wide mouth for ice cubes", "Affordable entry point"],
    amazonUrl: "https://www.amazon.com/dp/B07PXLBFHV",
  },
  {
    name: "JUWEL 32oz Glass Water Bottle",
    price: "$19.99",
    features: ["Large capacity", "Bamboo lid", "Neoprene sleeve", "Time markers for hydration tracking"],
    amazonUrl: "https://www.amazon.com/dp/B0BFMVFJ8Z",
  },
];

// Cost comparison data
export const costComparison = [
  { option: "Dasani (Coca-Cola)", costPerYear: 912, qpr: 35, microplastics: "5,400/L", pfas: "2.1 ppt" },
  { option: "FIJI Water", costPerYear: 3650, qpr: 48, microplastics: "4,800/L", pfas: "3.5 ppt" },
  { option: "VOSS Artesian", costPerYear: 5475, qpr: 55, microplastics: "Low (glass)", pfas: "1.8 ppt" },
  { option: "APEC RO System (Year 1)", costPerYear: 233, qpr: 89, microplastics: "0", pfas: "<0.1 ppt" },
  { option: "APEC RO System (Year 2+)", costPerYear: 43, qpr: 89, microplastics: "0", pfas: "<0.1 ppt" },
];

function qprClass(qpr: number) {
  return qpr >= 80
    ? "inline-flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-600"
    : qpr >= 50
      ? "inline-flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-bold text-amber-600"
      : "inline-flex size-8 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-500";
}

// framer initial {opacity 0, y 20} → whileInView, viewport once, default duration
const FADE_UP = "animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both";

export function FilterGuide() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0A3A2A_0%,#0B3D4E_50%,#0A3A2A_100%)] pt-24 pb-20">
        <div className="sacred-geo-bg absolute inset-0 opacity-10" />
        <div className="relative z-10 container">
          {/* framer initial {opacity 0, y 30} → animate, duration 0.8 */}
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-[30px] duration-800 fill-mode-both">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/20">
                <Shield aria-hidden="true" className="size-6 text-emerald-400" />
              </div>
              <span className="font-mono text-sm tracking-widest text-emerald-400/80 uppercase">Take Control</span>
            </div>
            <h1 className="font-aq-display mb-6 text-5xl font-bold tracking-tight text-[#F5F0E8] md:text-7xl">
              The Filter Guide
            </h1>
            <p className="mb-4 text-xl leading-relaxed text-[#D4C5A9] md:text-2xl">
              Stop paying corporations for repackaged tap water in plastic. Start filtering your own — for pennies per
              gallon.
            </p>
            <p className="text-lg leading-relaxed text-[#D4C5A9] opacity-70">
              A $200 reverse osmosis system produces water that scores <strong className="text-[#4ECDC4]">89 QPR</strong>{" "}
              — higher than any bottled water brand. Here are the best-value options on Amazon, tested and ranked.
            </p>
          </div>
        </div>
      </section>

      {/* Cost Comparison Table */}
      <section className="bg-card py-16">
        <div className="container">
          <Reveal enter={FADE_UP} className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <DollarSign aria-hidden="true" className="size-6 text-primary" />
              <h2 className="font-aq-display text-3xl font-bold">The Math Doesn&apos;t Lie</h2>
            </div>
            <p className="text-muted-foreground">
              Annual cost for 1 gallon/day of water. The numbers speak for themselves.
            </p>
          </Reveal>

          {/* The app revealed each row (motion.tr, x -10, delay i * 0.08); Reveal can't render a <tr>, so
              the table reveals as one block with the same slide from the left. */}
          <Reveal
            enter="animate-in fade-in slide-in-from-left-2.5 duration-500 fill-mode-both"
            className="max-w-4xl overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    Option
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    Cost/Year
                  </th>
                  <th className="px-4 py-3 text-center font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    QPR
                  </th>
                  <th className="px-4 py-3 text-center font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    Microplastics
                  </th>
                  <th className="px-4 py-3 text-center font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    PFAS
                  </th>
                </tr>
              </thead>
              <tbody>
                {costComparison.map((row) => {
                  const isRO = row.option.includes("APEC");
                  return (
                    <tr
                      key={row.option}
                      className={isRO ? "border-b border-border/50 bg-emerald-500/5" : "border-b border-border/50"}
                    >
                      <td className="px-4 py-3 font-medium">
                        {/* The app's "★" marker → lucide Star (no symbols as UI icons, CONTRIBUTING rule 18) */}
                        {isRO && (
                          <Star
                            aria-hidden="true"
                            className="mr-1 inline size-3.5 fill-emerald-600 align-[-2px] text-emerald-600"
                          />
                        )}
                        {row.option}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        <span
                          className={
                            isRO ? "font-bold text-emerald-600" : row.costPerYear > 1000 ? "font-bold text-red-500" : ""
                          }
                        >
                          ${row.costPerYear.toLocaleString("en-US")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={qprClass(row.qpr)}>{row.qpr}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-xs">
                        <span className={row.microplastics === "0" ? "font-bold text-emerald-600" : "text-red-500"}>
                          {row.microplastics}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-xs">
                        <span className={row.pfas.includes("<") ? "font-bold text-emerald-600" : "text-red-500"}>
                          {row.pfas}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* RO Filter Recommendations */}
      <section className="py-20">
        <div className="container">
          <Reveal enter={FADE_UP} className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <Award aria-hidden="true" className="size-6 text-primary" />
              <h2 className="font-aq-display text-3xl font-bold md:text-4xl">Top RO Systems — Ranked by Value</h2>
            </div>
            <p className="max-w-3xl text-lg text-muted-foreground">
              We analyzed price, performance, certifications, user reviews, and long-term cost of ownership. These are
              the best reverse osmosis systems on Amazon right now.
            </p>
          </Reveal>

          <div className="grid gap-8">
            {roFilters.map((filter, i) => (
              // framer initial {opacity 0, y 20} → whileInView, delay i * 0.1
              <Reveal
                key={filter.name}
                enter={FADE_UP}
                delay={i * 0.1}
                className={
                  filter.featured
                    ? "relative rounded-2xl border border-emerald-500/40 bg-[rgba(10,135,84,0.03)] p-6 shadow-lg md:p-8"
                    : "relative rounded-2xl border border-border/50 p-6 md:p-8"
                }
              >
                {filter.featured && (
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                    <Star aria-hidden="true" className="size-3 fill-white" /> AQUEOUS TOP PICK
                  </div>
                )}

                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* Left — Rank & Name */}
                  <div className="shrink-0 lg:w-72">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="font-aq-display text-4xl font-bold text-primary">#{filter.rank}</span>
                      <div>
                        <h3 className="text-xl font-bold">{filter.name}</h3>
                        <p className="text-sm text-muted-foreground">{filter.tagline}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-muted/50 p-3">
                        <div className="mb-1 text-xs text-muted-foreground">Price</div>
                        <div className="text-lg font-bold">{filter.price}</div>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-3">
                        <div className="mb-1 text-xs text-muted-foreground">Per Gallon</div>
                        <div className="text-lg font-bold text-emerald-600">{filter.gallonCost}</div>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-3">
                        <div className="mb-1 text-xs text-muted-foreground">Rating</div>
                        <div className="flex items-center gap-1">
                          <Star aria-hidden="true" className="size-4 fill-amber-500 text-amber-500" />
                          <span className="font-bold">{filter.rating}</span>
                          <span className="text-xs text-muted-foreground">({filter.reviews})</span>
                        </div>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-3">
                        <div className="mb-1 text-xs text-muted-foreground">Stages</div>
                        <div className="text-lg font-bold">{filter.stages}-Stage</div>
                      </div>
                    </div>
                  </div>

                  {/* Right — Details */}
                  <div className="flex-1">
                    <p className="mb-4 leading-relaxed text-muted-foreground italic">&quot;{filter.whyWeLoveIt}&quot;</p>

                    {/* Removes */}
                    <div className="mb-4">
                      <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                        <Shield aria-hidden="true" className="size-4 text-emerald-600" /> Removes
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {filter.removes.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="mb-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-emerald-600">Pros</h4>
                        {filter.pros.map((pro) => (
                          <div key={pro} className="mb-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                            <CheckCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                            <span>{pro}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-amber-600">Cons</h4>
                        {filter.cons.map((con) => (
                          <div key={con} className="mb-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                            <span aria-hidden="true" className="mt-0.5 shrink-0 text-amber-500">
                              –
                            </span>
                            <span>{con}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications & CTA */}
                    <div className="flex flex-wrap items-center gap-3">
                      {filter.certifications.map((cert) => (
                        <span key={cert} className="rounded-full bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                          {cert}
                        </span>
                      ))}
                      <a
                        href={filter.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        View on Amazon <ExternalLink aria-hidden="true" className="size-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Disclosure: Links may contain affiliate referral codes. All recommendations are based on independent testing
            data and user reviews. We only recommend products we would use ourselves.
          </p>
        </div>
      </section>

      {/* Glass Bottles Section */}
      <section className="bg-card py-16">
        <div className="container">
          <Reveal enter={FADE_UP} className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <Heart aria-hidden="true" className="size-6 text-primary" />
              <h2 className="font-aq-display text-3xl font-bold">Complete the Setup: Glass Bottles</h2>
            </div>
            <p className="max-w-2xl text-muted-foreground">
              You&apos;ve got clean water from your RO system. Now store and carry it in glass — zero microplastics,
              zero leaching, infinite recyclability.
            </p>
          </Reveal>

          <div className="grid max-w-4xl gap-6 sm:grid-cols-3">
            {glassBottles.map((bottle, i) => (
              <Reveal
                key={bottle.name}
                enter={FADE_UP}
                delay={i * 0.1}
                className="rounded-2xl border border-border/50 p-5"
              >
                <h3 className="mb-1 font-bold">{bottle.name}</h3>
                <p className="mb-3 text-lg font-bold text-primary">{bottle.price}</p>
                <div className="mb-4 space-y-1.5">
                  {bottle.features.map((f) => (
                    <div key={f} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                      <CheckCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={bottle.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  View on Amazon <ExternalLink aria-hidden="true" className="size-3.5" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Connection */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Leaf aria-hidden="true" className="mx-auto mb-4 size-10 text-primary" />
            <h2 className="font-aq-display mb-6 text-3xl font-bold md:text-4xl">This Is Conscious Consumption</h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              Filtering your own water isn&apos;t just about saving money or avoiding microplastics. It&apos;s a
              declaration of independence from the extractive consumption machine. Every dollar you <em>don&apos;t</em>{" "}
              give to Coca-Cola or PepsiCo is a dollar that can fund something that actually matters — your health,
              your community, your planet.
            </p>
            <p className="mb-8 leading-relaxed text-muted-foreground">
              As Nate Hagens reminds us in <em>The Great Simplification</em>: the path to a sustainable future
              isn&apos;t about consuming more &quot;green&quot; products — it&apos;s about consuming{" "}
              <strong>less, better, and with intention</strong>. A home RO filter is one of the simplest, most
              impactful steps you can take.
            </p>
            <Link
              href={aq("/manifesto")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Read Our Manifesto <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <FloatingShare />
    </div>
  );
}
