"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Compass, ExternalLink, Eye, Globe, Heart, Sparkles, Users, Zap, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/aqueous/motion";
import { FloatingShare, ShareButton } from "@/components/aqueous/share-button";
import { Button } from "@/components/aqueous/ui";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/Landscape.tsx (2026-11-24). Same copy, data,
// markup and classes. framer-motion replaced per the comments below.
// Fix from live: the quadrant's dots only worked with a mouse. Each dot is now also a keyboard
// button (tab to it, Enter/Space selects it, focus shows its name like hover does).

interface CoCreator {
  id: string;
  name: string;
  url: string;
  category: string;
  mission: string;
  contribution: string;
  quadrantX: number;
  quadrantY: number;
  tier: "pioneer" | "builder" | "emerging" | "legacy";
}

export const coCreators: CoCreator[] = [
  { id: "ewg", name: "EWG Tap Water Database", url: "https://ewg.org/tapwater", category: "Water Quality", mission: "Making tap water data accessible to every American household", contribution: "Pioneered the inverted scale for health ratings. Open database of 50,000+ water utilities.", quadrantX: 85, quadrantY: 75, tier: "pioneer" },
  { id: "cr", name: "Consumer Reports", url: "https://consumerreports.org", category: "Product Testing", mission: "90 years of independent product testing with zero advertising", contribution: "Gold standard for unbiased testing. 63 labs, 130+ researchers. Proved that independent testing changes markets.", quadrantX: 90, quadrantY: 60, tier: "legacy" },
  { id: "oasis", name: "Oasis Health App", url: "https://oasishealth.app", category: "Health Rating", mission: "Helping consumers understand what they put in their bodies", contribution: "Brought water quality scoring to mobile. Made health ratings accessible and visual.", quadrantX: 55, quadrantY: 55, tier: "builder" },
  { id: "yuka", name: "Yuka", url: "https://yuka.io", category: "Food & Cosmetics", mission: "50M+ users scanning products for health impact", contribution: "Proved that millions of people will scan products if you make it simple. Color-coded scoring adopted globally.", quadrantX: 70, quadrantY: 65, tier: "pioneer" },
  { id: "thinkdirty", name: "Think Dirty", url: "https://thinkdirtyapp.com", category: "Clean Beauty", mission: "Exposing hidden toxins in personal care products", contribution: "The Dirty Meter made invisible chemicals visible. 2M+ users demanding transparency.", quadrantX: 65, quadrantY: 60, tier: "builder" },
  { id: "rtings", name: "RTINGS", url: "https://rtings.com", category: "Electronics", mission: "Obsessive measurement methodology for consumer electronics", contribution: "Proved that radical transparency in testing methodology builds trust. Fully open scoring.", quadrantX: 95, quadrantY: 45, tier: "pioneer" },
  { id: "ifixit", name: "iFixit", url: "https://ifixit.com", category: "Repairability", mission: "Right-to-repair advocacy through repairability scores", contribution: "Changed legislation worldwide. Proved that scoring can drive systemic change.", quadrantX: 80, quadrantY: 80, tier: "pioneer" },
  { id: "goodonyou", name: "Good On You", url: "https://goodonyou.eco", category: "Ethical Fashion", mission: "Rating fashion brands on labor, environment, and animal welfare", contribution: "Made ethical consumption actionable in fashion. Multi-dimensional scoring.", quadrantX: 75, quadrantY: 70, tier: "builder" },
  { id: "bcorp", name: "B Corp Directory", url: "https://bcorporation.net", category: "Business Ethics", mission: "8,000+ companies verified for triple bottom line impact", contribution: "Created the standard for businesses that balance profit with purpose.", quadrantX: 70, quadrantY: 85, tier: "pioneer" },
  { id: "openfoodfacts", name: "Open Food Facts", url: "https://openfoodfacts.org", category: "Food Database", mission: "Open-source food database with 3M+ products", contribution: "Proved that community-driven, open-source product data can scale globally.", quadrantX: 90, quadrantY: 70, tier: "pioneer" },
  { id: "tapscore", name: "Tap Score", url: "https://mytapscore.com", category: "Water Testing", mission: "Certified lab testing made accessible to every household", contribution: "Brought laboratory-grade water testing direct to consumers with clear, actionable reports.", quadrantX: 88, quadrantY: 72, tier: "pioneer" },
  { id: "findaspring", name: "Find A Spring", url: "https://findaspring.org", category: "Spring Directory", mission: "Community-driven directory of natural springs worldwide", contribution: "Preserving sacred water sources through community knowledge sharing.", quadrantX: 60, quadrantY: 82, tier: "builder" },
];

export const consumerGuides = [
  { name: "Consumer Reports", cat: "Universal", founded: "1936", scale: "0-100", users: "6M+", url: "https://consumerreports.org" },
  { name: "Wirecutter (NYT)", cat: "Universal", founded: "2011", scale: "Best Pick", users: "30M+/mo", url: "https://nytimes.com/wirecutter" },
  { name: "Good Housekeeping", cat: "Home & Family", founded: "1885", scale: "GH Seal", users: "25M+", url: "https://goodhousekeeping.com" },
  { name: "EWG Healthy Living", cat: "Health", founded: "1993", scale: "1-10 (1=best)", users: "10M+", url: "https://ewg.org" },
  { name: "Yuka", cat: "Food & Beauty", founded: "2017", scale: "0-100 color", users: "50M+", url: "https://yuka.io" },
  { name: "Think Dirty", cat: "Clean Beauty", founded: "2013", scale: "0-10 dirty", users: "2M+", url: "https://thinkdirtyapp.com" },
  { name: "RTINGS", cat: "Electronics", founded: "2016", scale: "0-10", users: "15M+/mo", url: "https://rtings.com" },
  { name: "iFixit", cat: "Repairability", founded: "2003", scale: "0-10", users: "100M+", url: "https://ifixit.com" },
  { name: "CNET", cat: "Tech", founded: "1994", scale: "0-10", users: "200M+/mo", url: "https://cnet.com" },
  { name: "Good On You", cat: "Fashion Ethics", founded: "2015", scale: "1-5", users: "4M+", url: "https://goodonyou.eco" },
  { name: "B Corp Directory", cat: "Business Ethics", founded: "2006", scale: "80+ certified", users: "8K+ corps", url: "https://bcorporation.net" },
  { name: "Open Food Facts", cat: "Food Database", founded: "2012", scale: "Nutri-Score", users: "3M+ products", url: "https://openfoodfacts.org" },
  { name: "Fooducate", cat: "Nutrition", founded: "2011", scale: "A-F", users: "15M+", url: "https://fooducate.com" },
  { name: "Cornucopia Institute", cat: "Organic", founded: "2004", scale: "Scorecard", users: "Industry", url: "https://cornucopia.org" },
  { name: "CamelCamelCamel", cat: "Price Tracking", founded: "2008", scale: "Price History", users: "10M+", url: "https://camelcamelcamel.com" },
  { name: "Slickdeals", cat: "Deals", founded: "1999", scale: "Community Vote", users: "12M+/mo", url: "https://slickdeals.net" },
  { name: "Ethical Consumer", cat: "Ethics", founded: "1989", scale: "0-20", users: "500K+", url: "https://ethicalconsumer.org" },
  { name: "DoneGood", cat: "Ethical Shopping", founded: "2016", scale: "Curated", users: "200K+", url: "https://donegood.co" },
  { name: "INCI Decoder", cat: "Cosmetic Science", founded: "2017", scale: "Ingredient", users: "5M+", url: "https://incidecoder.com" },
  { name: "Honey (PayPal)", cat: "Savings", founded: "2012", scale: "Auto-coupon", users: "17M+", url: "https://joinhoney.com" },
  { name: "Google Shopping", cat: "Price Compare", founded: "2002", scale: "Aggregated", users: "Billions", url: "https://shopping.google.com" },
  { name: "Tom's Guide", cat: "Tech", founded: "2007", scale: "1-5 stars", users: "30M+/mo", url: "https://tomsguide.com" },
  { name: "Digital Trends", cat: "Tech", founded: "2006", scale: "1-10", users: "10M+/mo", url: "https://digitaltrends.com" },
  { name: "Tap Score", cat: "Water Testing", founded: "2015", scale: "Lab Report", users: "500K+", url: "https://mytapscore.com" },
  { name: "Water Filter Guru", cat: "Filter Reviews", founded: "2018", scale: "Expert Pick", users: "2M+/mo", url: "https://waterfilterguru.com" },
];

const tierDot: Record<CoCreator["tier"], string> = {
  pioneer: "fill-primary/80",
  builder: "fill-emerald-500/70",
  legacy: "fill-amber-500/70",
  emerging: "fill-muted-foreground/50",
};

const tierBadge: Record<CoCreator["tier"], string> = {
  pioneer: "bg-primary/10 text-primary",
  builder: "bg-emerald-500/10 text-emerald-600",
  legacy: "bg-amber-500/10 text-amber-600",
  emerging: "bg-amber-500/10 text-amber-600",
};

const additions: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Compass, title: "Personalized to YOU", desc: "Not a universal score. YOUR score — weighted by your budget, location, health concerns, and values." },
  { icon: Zap, title: "Inverted Scale (1 = Perfect)", desc: "While everyone else races to 100, we race to 1. Less is more. Simplification is the path." },
  { icon: Globe, title: "Cross-Source Aggregate", desc: "We don't replace other scores — we aggregate them into a single Industry Consensus alongside our own." },
  { icon: Heart, title: "Soul-Driven, Not Ad-Driven", desc: "Zero advertising. All profits flow to indigenous water stewards and regenerative futures." },
  { icon: Eye, title: "Radical Transparency", desc: "Every data source cited. Every weight explained. Every methodology open. Nothing hidden." },
  { icon: Sparkles, title: "The Gem Spark Journey", desc: "Not just a rating engine — a path from conscious consumption to your greatest self." },
];

// was motion.div initial={{ opacity: 0, y: 20 }} animate/whileInView={{ opacity: 1, y: 0 }} (default duration)
const fadeUpEnter = "animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both";

export function Landscape() {
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [showAllGuides, setShowAllGuides] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  const displayedGuides = showAllGuides ? consumerGuides : consumerGuides.slice(0, 12);
  const selected = coCreators.find((c) => c.id === selectedCreator);

  const toggle = (id: string) => setSelectedCreator(selectedCreator === id ? null : id);
  const onDotKey = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="sacred-geo-bg absolute inset-0 opacity-3" />
        <div className="relative container">
          <div className={`mx-auto max-w-3xl text-center ${fadeUpEnter}`}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Users aria-hidden="true" className="size-4" />
              Co-Creators of the New Tomorrow
            </div>
            <h1 className="mb-6 font-aq-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              The Collective <span className="text-primary">Consciousness Map</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              These aren&apos;t competitors. They&apos;re fellow travelers — each one a co-creator of the collective
              consciousness moving humanity toward better products, better services, and better value. Together, we
              support the underlying possibility of greatness, transformation, and abundance for all.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Quadrant */}
      <section className="py-16">
        <div className="container">
          <Reveal enter={fadeUpEnter} className="mx-auto max-w-4xl">
            <h2 className="mb-2 text-center font-aq-display text-2xl font-bold">The Dharma Quadrant</h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Mapping the ecosystem by data transparency and purpose depth
            </p>

            {/* SVG Quadrant */}
            <div className="glass-card relative mx-auto aspect-square max-w-2xl rounded-2xl border border-border/40 p-4 sm:p-6">
              <svg viewBox="0 0 400 400" className="size-full" role="group" aria-label="The Dharma Quadrant">
                {/* Grid lines */}
                <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />

                {/* Quadrant labels */}
                <text x="110" y="100" textAnchor="middle" className="fill-muted-foreground/30 text-[9px]">Purpose-Led</text>
                <text x="110" y="112" textAnchor="middle" className="fill-muted-foreground/30 text-[9px]">Emerging Data</text>
                <text x="300" y="100" textAnchor="middle" className="fill-muted-foreground/30 text-[9px]">Visionary</text>
                <text x="300" y="112" textAnchor="middle" className="fill-muted-foreground/30 text-[9px]">Pioneers</text>
                <text x="110" y="300" textAnchor="middle" className="fill-muted-foreground/30 text-[9px]">Traditional</text>
                <text x="110" y="312" textAnchor="middle" className="fill-muted-foreground/30 text-[9px]">Reviewers</text>
                <text x="300" y="300" textAnchor="middle" className="fill-muted-foreground/30 text-[9px]">Data-Rich</text>
                <text x="300" y="312" textAnchor="middle" className="fill-muted-foreground/30 text-[9px]">Builders</text>

                {/* Axis labels */}
                <text x="200" y="398" textAnchor="middle" className="fill-muted-foreground/50 text-[8px] font-medium tracking-widest">
                  DATA TRANSPARENCY →
                </text>
                <text
                  x="8"
                  y="200"
                  textAnchor="middle"
                  className="fill-muted-foreground/50 text-[8px] font-medium tracking-widest"
                  transform="rotate(-90, 8, 200)"
                >
                  PURPOSE DEPTH →
                </text>

                {/* Co-creator dots */}
                {coCreators.map((cc) => {
                  const cx = 20 + (cc.quadrantX / 100) * 360;
                  const cy = 380 - (cc.quadrantY / 100) * 360;
                  const isHovered = hoveredDot === cc.id;
                  const isSelected = selectedCreator === cc.id;
                  return (
                    <g key={cc.id}>
                      {/* Glow ring */}
                      {(isHovered || isSelected) && <circle cx={cx} cy={cy} r={16} className="fill-primary/10" />}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered || isSelected ? 9 : 6}
                        className={`cursor-pointer transition-all duration-200 outline-none ${tierDot[cc.tier]}`}
                        stroke={isSelected ? "currentColor" : "none"}
                        strokeWidth={isSelected ? 1.5 : 0}
                        strokeOpacity={0.3}
                        role="button"
                        tabIndex={0}
                        aria-label={cc.name}
                        aria-pressed={isSelected}
                        onMouseEnter={() => setHoveredDot(cc.id)}
                        onMouseLeave={() => setHoveredDot(null)}
                        onFocus={() => setHoveredDot(cc.id)}
                        onBlur={() => setHoveredDot(null)}
                        onClick={() => toggle(cc.id)}
                        onKeyDown={(e) => onDotKey(e, cc.id)}
                      />
                      {(isHovered || isSelected) && (
                        <>
                          <rect x={cx - 50} y={cy - 26} width={100} height={16} rx={4} className="fill-background/90" />
                          <text
                            x={cx}
                            y={cy - 14}
                            textAnchor="middle"
                            className="pointer-events-none fill-foreground text-[8px] font-medium"
                          >
                            {cc.name}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}

                {/* Aqueous — top right, larger, with pulse (SVG <animate>, as in the app) */}
                <circle cx={360} cy={28} r={20} className="fill-primary/10">
                  <animate attributeName="r" values="18;22;18" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={360} cy={28} r={13} className="fill-primary" />
                <text x={360} y={32} textAnchor="middle" className="pointer-events-none fill-primary-foreground text-[8px] font-bold">
                  AQ
                </text>
                <text x={338} y={52} textAnchor="middle" className="fill-primary text-[10px] font-bold">
                  Aqueous
                </text>
              </svg>

              {/* Legend */}
              <div className="absolute bottom-2 left-4 flex flex-wrap gap-3 text-[10px] sm:bottom-4 sm:left-6">
                {[
                  { label: "Pioneer", color: "bg-primary/80" },
                  { label: "Builder", color: "bg-emerald-500/70" },
                  { label: "Legacy", color: "bg-amber-500/70" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={`size-2.5 rounded-full ${l.color}`} />
                    <span className="text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Creator Detail. Was AnimatePresence + motion.div y 10 → 0 (its quick exit fade is dropped). */}
            {selected && (
              <div
                key={selected.id}
                className="glass-card mt-6 animate-in rounded-2xl border border-border/40 p-6 duration-500 fade-in slide-in-from-bottom-2.5"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-aq-display text-lg font-bold">{selected.name}</h4>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] ${tierBadge[selected.tier]}`}>{selected.tier}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selected.category}</p>
                  </div>
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Visit <ExternalLink aria-hidden="true" className="size-3" />
                  </a>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">
                  <strong className="text-foreground">Mission:</strong> {selected.mission}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Contribution to the collective:</strong> {selected.contribution}
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* What Makes Aqueous Different */}
      <section className="bg-primary/3 py-16">
        <div className="container">
          <Reveal enter={fadeUpEnter} className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 font-aq-display text-3xl font-bold">What Aqueous Adds to the Collective</h2>
            <p className="text-muted-foreground">
              Every co-creator above has moved the needle. Aqueous stands on their shoulders and adds what none of them
              offer alone.
            </p>
          </Reveal>

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {additions.map((item, i) => {
              const Icon = item.icon;
              return (
                // was motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                <Reveal
                  key={item.title}
                  enter="animate-in fade-in slide-in-from-bottom-2.5 duration-500 fill-mode-both"
                  delay={i * 0.05}
                  className="glass-card rounded-xl border border-border/40 p-5"
                >
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <h4 className="mb-1 text-sm font-bold">{item.title}</h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top 25 Consumer Guides */}
      <section className="py-16">
        <div className="container">
          <Reveal enter={fadeUpEnter} className="mx-auto max-w-5xl">
            <h2 className="mb-2 text-center font-aq-display text-3xl font-bold">
              The Top 25 Consumer Intelligence Platforms
            </h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              The ecosystem of co-creators helping humanity make better choices
            </p>

            <div className="overflow-x-auto rounded-xl border border-border/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">#</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">Platform</th>
                    <th className="hidden px-3 py-3 text-left text-xs font-medium text-muted-foreground sm:table-cell">Category</th>
                    <th className="hidden px-3 py-3 text-left text-xs font-medium text-muted-foreground md:table-cell">Founded</th>
                    <th className="hidden px-3 py-3 text-left text-xs font-medium text-muted-foreground md:table-cell">Scale</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">Reach</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedGuides.map((g, i) => (
                    <tr key={g.name} className="border-b border-border/10 transition-colors hover:bg-muted/10">
                      <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2.5">
                        <a
                          href={g.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium transition-colors hover:text-primary"
                        >
                          {g.name}
                        </a>
                      </td>
                      <td className="hidden px-3 py-2.5 text-xs text-muted-foreground sm:table-cell">{g.cat}</td>
                      <td className="hidden px-3 py-2.5 font-mono text-xs text-muted-foreground md:table-cell">{g.founded}</td>
                      <td className="hidden px-3 py-2.5 text-xs text-muted-foreground md:table-cell">{g.scale}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{g.users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!showAllGuides && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" onClick={() => setShowAllGuides(true)}>
                  Show All 25 <ChevronDown aria-hidden="true" className="ml-1 size-3" />
                </Button>
              </div>
            )}

            <p className="mx-auto mt-6 max-w-xl text-center text-xs text-muted-foreground">
              Aqueous is the <strong className="text-foreground">only platform</strong> that combines quality + price +
              availability + sustainability + personalization across all consumer products — starting with the most
              fundamental one: water.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/3 py-16">
        <div className="container text-center">
          <h3 className="mb-4 font-aq-display text-2xl font-bold">Join the Collective</h3>
          <p className="mx-auto mb-6 max-w-lg text-muted-foreground">
            Every share, every score, every conversation about what&apos;s in your water — it all feeds the collective
            consciousness moving humanity toward the New Tomorrow.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild>
              <Link href={aq("/gem-spark")}>
                Begin the Journey <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={aq("/integrity")}>Open Integrity Protocol</Link>
            </Button>
          </div>
          <div className="mt-6">
            <ShareButton variant="inline" className="justify-center" />
          </div>
        </div>
      </section>

      <FloatingShare />
    </div>
  );
}
