import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Database, Droplets, ExternalLink, Scale, Shield, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/aqueous/motion";
import { QPRBadge } from "@/components/aqueous/qpr-badge";
import { FloatingShare } from "@/components/aqueous/share-button";
import { Button } from "@/components/aqueous/ui";
import { aqueousImages } from "@/lib/content/aqueous/images";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/QPRMethodology.tsx (2026-11-24): how the QPR scoring
// engine works. Same copy and classes; the hero's Manus lab photo (deleted on Manus) is
// aqueousImages.waterTestingLab; framer-motion replaced with CSS (each replaced prop is noted);
// Navigation/Footer/SEOHead come from the /aqueous layout and page metadata. Per-pillar colors that
// the app set inline are full literal classes below.

type Pillar = {
  icon: LucideIcon;
  title: string;
  weight: string;
  /** The app's border-top 3px, icon tile tint (color + "15" alpha) and title color, as classes. */
  border: string;
  tile: string;
  text: string;
  description: string;
  subcategories: { name: string; weight: string; description: string }[];
};

export const pillars: Pillar[] = [
  {
    icon: Droplets,
    title: "Quality",
    weight: "33.3%",
    border: "border-t-[3px] border-t-[#0A8754]",
    tile: "bg-[#0A875415] text-[#0A8754]",
    text: "text-[#0A8754]",
    description:
      "Measures the inherent life-giving properties of the water — where it comes from and what it carries.",
    subcategories: [
      {
        name: "Source Integrity",
        weight: "25%",
        description: "Protected aquifer vs. municipal tap. Geological age. Contamination risk of source area.",
      },
      {
        name: "Mineral Profile",
        weight: "25%",
        description: "Beneficial mineral content (Ca, Mg, K, Si). Natural vs. added minerals. Bioavailability.",
      },
      { name: "pH Balance", weight: "25%", description: "Natural pH level. Stability over time. Alkalinity claims vs. reality." },
      {
        name: "Taste Profile",
        weight: "25%",
        description: "Sensory quality. Absence of chemical taste. Mouthfeel and minerality.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Purity",
    weight: "33.3%",
    border: "border-t-[3px] border-t-[#4ECDC4]",
    tile: "bg-[#4ECDC415] text-[#4ECDC4]",
    text: "text-[#4ECDC4]",
    description:
      "Measures what should NOT be in your water — the contaminants, forever chemicals, and invisible threats.",
    subcategories: [
      {
        name: "PFAS Levels",
        weight: "25%",
        description:
          "Per- and polyfluoroalkyl substances. Scored against both EPA limits (4 ppt) and stricter EWG guidelines (1 ppt).",
      },
      {
        name: "Microplastics",
        weight: "25%",
        description:
          "Particle count per liter. Heavily penalizes PET plastic packaging. Glass and home filtration score highest.",
      },
      {
        name: "Heavy Metals",
        weight: "25%",
        description: "Lead, arsenic, chromium-6, mercury. Scored against EWG health guidelines, not just EPA legal limits.",
      },
      {
        name: "Other Contaminants",
        weight: "25%",
        description: "Disinfection byproducts (THMs, HAAs), pesticides (atrazine), radioactive elements (radium).",
      },
    ],
  },
  {
    icon: Scale,
    title: "Resonance",
    weight: "33.3%",
    border: "border-t-[3px] border-t-[#B87333]",
    tile: "bg-[#B8733315] text-[#B87333]",
    text: "text-[#B87333]",
    description:
      "Measures alignment with a sustainable, ethical, and transparent world — the water's impact beyond your body.",
    subcategories: [
      {
        name: "Environmental Impact",
        weight: "25%",
        description: "Carbon footprint of production and transport. Water source sustainability. Ecosystem impact.",
      },
      {
        name: "Ethical Sourcing",
        weight: "25%",
        description: "Community impact at source. Labor practices. Indigenous rights. Water rights conflicts.",
      },
      {
        name: "Packaging Sustainability",
        weight: "25%",
        description: "Glass > aluminum > carton > BPA-free plastic > PET. Recyclability and actual recycling rates.",
      },
      {
        name: "Corporate Transparency",
        weight: "25%",
        description:
          "Publicly available test results. Third-party verification. Responsiveness to inquiries. B Corp status.",
      },
    ],
  },
];

export const gradingScale = [
  { grade: "A+", range: "95-100", meaning: "Exceptional — among the finest waters available", color: "text-[#0A8754]" },
  { grade: "A", range: "88-94", meaning: "Excellent — high quality across all dimensions", color: "text-[#2D9D5A]" },
  { grade: "B+", range: "80-87", meaning: "Very Good — strong with minor areas for improvement", color: "text-[#4ECDC4]" },
  { grade: "B", range: "72-79", meaning: "Good — solid choice with some trade-offs", color: "text-[#6BB8B0]" },
  { grade: "C+", range: "64-71", meaning: "Acceptable — notable concerns in one or more pillars", color: "text-[#D4A574]" },
  { grade: "C", range: "55-63", meaning: "Below Average — significant issues identified", color: "text-[#B87333]" },
  { grade: "D", range: "40-54", meaning: "Poor — serious concerns across multiple dimensions", color: "text-[#C75B39]" },
  { grade: "F", range: "0-39", meaning: "Failing — not recommended for regular consumption", color: "text-[#9B2335]" },
];

export const dataSources = [
  {
    name: "EPA SDWIS",
    url: "https://www.epa.gov/DWdata",
    description:
      "Safe Drinking Water Information System — federal database of all public water system violations and monitoring data.",
  },
  {
    name: "EWG Tap Water Database",
    url: "https://www.ewg.org/tapwater/",
    description: "Environmental Working Group's database with health-based guidelines stricter than EPA legal limits.",
  },
  {
    name: "USGS Water Data APIs",
    url: "https://api.waterdata.usgs.gov/docs/",
    description: "Real-time and historical water quality monitoring data from thousands of stations nationwide.",
  },
  {
    name: "Water Quality Portal",
    url: "https://www.waterqualitydata.us/",
    description: "Joint EPA/USGS/USDA portal aggregating water quality data from 400+ organizations.",
  },
  {
    name: "FDA Bottled Water Reports",
    url: "https://www.fda.gov/food/resources-you-food/bottled-water",
    description: "Federal standards and inspection reports for bottled water products.",
  },
  {
    name: "Consumer Confidence Reports",
    url: "https://www.epa.gov/ccr",
    description: "Annual water quality reports that every public water system must publish.",
  },
];

export function QPRMethodology() {
  const lab = aqueousImages.waterTestingLab;
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={lab.src} alt={lab.alt} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 container pt-28 pb-20">
          {/* framer initial {opacity 0, y 30} → animate, duration 0.7 */}
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-[30px] duration-700 fill-mode-both">
            <h1 className="font-aq-display mb-5 text-4xl leading-tight font-bold text-white md:text-5xl">
              The QPR Engine
            </h1>
            <p className="text-lg leading-relaxed text-white/75">
              Quality. Purity. Resonance. A three-pillar scoring framework built entirely on open-source data, designed
              to reveal what branding conceals and delineate meaningful differences between waters.
            </p>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 left-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 60L60 52C120 44 240 28 360 22C480 16 600 20 720 28C840 36 960 48 1080 50C1200 52 1320 44 1380 40L1440 36V60H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          {/* framer initial {opacity 0, y 20} → whileInView, viewport once */}
          <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both" className="mb-12 text-center">
            <h2 className="font-aq-display mb-4 text-3xl font-bold">How Scoring Works</h2>
            <p className="mx-auto max-w-2xl leading-relaxed text-muted-foreground">
              Unlike competitors that bunch scores between 70-95 (making differentiation impossible), the QPR engine
              uses a full 0-100 range with equal weighting across three pillars. A $2 purified water and a $15 imported
              spring water are measured by the same uncompromising standard.
            </p>
          </Reveal>

          {/* Score example */}
          <div className="mb-16 flex justify-center">
            <div className="glass-card flex flex-col items-center gap-4 rounded-2xl p-8">
              <QPRBadge score={94} grade="A+" size="lg" />
              <div className="text-center">
                <p className="text-sm font-semibold">Example: Mountain Valley Spring</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Quality 97 + Purity 93 + Resonance 91 = Overall 94
                </p>
                <p className="text-xs text-muted-foreground">Value Ratio: 11.1 QPR per dollar</p>
              </div>
            </div>
          </div>

          {/* Formula */}
          <div className="glass-card mb-16 rounded-xl p-6 text-center">
            <p className="mb-2 text-sm text-muted-foreground">Composite Formula</p>
            <p className="font-mono text-xl font-semibold text-foreground">
              QPR = (Quality × 0.333) + (Purity × 0.333) + (Resonance × 0.333)
            </p>
            <p className="mt-3 text-sm text-muted-foreground">Value Ratio = QPR Score ÷ Price Per Gallon</p>
          </div>
        </div>
      </section>

      {/* Three Pillars Detail */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <h2 className="font-aq-display mb-12 text-center text-3xl font-bold">The Three Pillars</h2>

          <div className="space-y-12">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                // framer initial {opacity 0, y 24} → whileInView, duration 0.5
                <Reveal
                  key={pillar.title}
                  enter="animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both"
                  className="glass-card overflow-hidden rounded-xl"
                >
                  <div className={`p-6 md:p-8 ${pillar.border}`}>
                    <div className="mb-4 flex items-center gap-4">
                      <div className={`flex size-12 items-center justify-center rounded-xl ${pillar.tile}`}>
                        <Icon aria-hidden="true" className="size-7" />
                      </div>
                      <div>
                        <h3 className={`font-aq-display text-2xl font-bold ${pillar.text}`}>{pillar.title}</h3>
                        <p className="text-xs text-muted-foreground">Weight: {pillar.weight} of total score</p>
                      </div>
                    </div>
                    <p className="mb-6 leading-relaxed text-muted-foreground">{pillar.description}</p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {pillar.subcategories.map((sub) => (
                        <div key={sub.name} className="rounded-lg border border-border/30 bg-muted/50 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-sm font-semibold">{sub.name}</h4>
                            <span className="text-xs text-muted-foreground">{sub.weight}</span>
                          </div>
                          <p className="text-xs leading-relaxed text-muted-foreground">{sub.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grading Scale */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-aq-display mb-8 text-center text-3xl font-bold">Grading Scale</h2>
          <div className="mx-auto max-w-2xl">
            {/* Fix from live: a scroll wrapper so the 3-column table can't push the page sideways at 375px. */}
            <div className="glass-card overflow-x-auto rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="p-4 text-left font-semibold text-muted-foreground">Grade</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Score Range</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {gradingScale.map((row) => (
                    <tr key={row.grade} className="border-b border-border/30 last:border-0">
                      <td className="p-4">
                        <span className={`text-base font-bold ${row.color}`}>{row.grade}</span>
                      </td>
                      <td className="p-4 font-medium">{row.range}</td>
                      <td className="p-4 text-muted-foreground">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="mb-8 flex items-center gap-3">
            <Database aria-hidden="true" className="size-6 text-primary" />
            <h2 className="font-aq-display text-3xl font-bold">Open Data Sources</h2>
          </div>
          <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">
            Every score in Aqueous is derived from publicly available, open-source databases. No proprietary data is
            used. No paywalls. No hidden methodologies. Full transparency.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dataSources.map((ds) => (
              <a
                key={ds.name}
                href={ds.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold transition-colors group-hover:text-primary">{ds.name}</h4>
                  <ExternalLink
                    aria-hidden="true"
                    className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary"
                  />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{ds.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="font-aq-display mb-4 text-3xl font-bold">See the QPR Engine in Action</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Explore our database of rated waters and discover the truth behind every bottle and every tap.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href={aq("/explore")}>
                Explore Waters <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href={aq("/tap-water")}>Check Your Tap Water</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-12" />
      <FloatingShare />
    </div>
  );
}
