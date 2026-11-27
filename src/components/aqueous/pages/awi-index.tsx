"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  DollarSign,
  Droplets,
  Eye,
  Gem,
  Info,
  Leaf,
  MapPin,
  RotateCcw,
  Shield,
  Sliders,
  type LucideIcon,
} from "lucide-react";
import { FloatingShare } from "@/components/aqueous/share-button";
import { AWIBadge, AWICompareBar } from "@/components/aqueous/awi-badge";
import { useAWIProfile } from "@/components/aqueous/aqueous-providers";
import { calculateAWI, getAWIScoreColor, type UserWaterProfile } from "@/lib/content/aqueous/awi-engine";
import { bottledWaters } from "@/lib/content/aqueous/water-data";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/AWIIndex.tsx (2026-11-24). Same copy, markup and
// timings. Changes: the app's style={{ fontFamily: "'DM Sans', sans-serif" }} became
// font-(family-name:--font-aq-dm-sans) (headings default to Cormorant in aqueous.css); the app's
// inline colors are literal classes (the score colors through AWI_TEXT below); framer-motion props
// are tw-animate classes (each noted where it was).

type WeightKey = Exclude<keyof UserWaterProfile, "userZipCode" | "userCity" | "userState" | "localTapQuality">;

const weightConfig: { key: WeightKey; label: string; icon: LucideIcon; description: string }[] = [
  { key: "healthPriority", label: "Health Priority", icon: Shield, description: "How important is water purity to your health?" },
  { key: "budgetSensitivity", label: "Budget Sensitivity", icon: DollarSign, description: "How price-conscious are you?" },
  { key: "environmentalConcern", label: "Environmental Concern", icon: Leaf, description: "How much do packaging & carbon matter?" },
  { key: "contaminantAwareness", label: "Contaminant Awareness", icon: Shield, description: "How concerned about PFAS, microplastics?" },
  { key: "glassPreference", label: "Glass Preference", icon: Gem, description: "Do you prefer glass over plastic?" },
  { key: "localSourcing", label: "Local Sourcing", icon: MapPin, description: "Prefer locally sourced water?" },
  { key: "carbonFootprint", label: "Carbon Footprint", icon: Leaf, description: "How much does shipping distance matter?" },
  { key: "mineralContent", label: "Mineral Content", icon: Droplets, description: "How important is mineral richness?" },
  { key: "brandSkepticism", label: "Brand Skepticism", icon: Eye, description: "How skeptical of big brand marketing?" },
];

/** getAWIScoreColor's six colors as full literal classes (the app set them with style={{ color }}). */
const AWI_TEXT: Record<string, string> = {
  "#0A8754": "text-[#0A8754]",
  "#2D9D5A": "text-[#2D9D5A]",
  "#4ECDC4": "text-[#4ECDC4]",
  "#D4A574": "text-[#D4A574]",
  "#C75B39": "text-[#C75B39]",
  "#9B2335": "text-[#9B2335]",
};

const awiText = (score: number) => AWI_TEXT[getAWIScoreColor(score)];

const DM_SANS = "font-(family-name:--font-aq-dm-sans)";

const steps = [
  {
    num: "01",
    title: "Inverted Scale",
    desc: "Score 1 = nothing to worry about. Score 100 = serious problems. Lower is always better. The opposite of every other rating system out there.",
    // color #0A8754 at opacity 0.3
    numClass: "text-[#0A8754]/30",
  },
  {
    num: "02",
    title: "Personalized to You",
    desc: "Your survey answers become the lens. Budget-conscious? Price weighs more. Eco-warrior? Carbon footprint dominates. Your priorities shape every score.",
    numClass: "text-[#4ECDC4]/30",
  },
  {
    num: "03",
    title: "Cross-Referenced",
    desc: "We aggregate scores from EWG, Consumer Reports, health databases, and independent labs into an Industry Consensus score — then show how it compares to your personal AWI.",
    numClass: "text-[#B87333]/30",
  },
];

const gradeScale = [
  { range: "1", grade: "1 (PERFECT)", text: "text-[#0A8754]", dot: "bg-[#0A8754]", desc: "Nothing to worry about — ideal match for you" },
  { range: "2–10", grade: "PURE", text: "text-[#0A8754]", dot: "bg-[#0A8754]", desc: "Exceptional — near-perfect for your priorities" },
  { range: "11–25", grade: "CLEAN", text: "text-[#2D9D5A]", dot: "bg-[#2D9D5A]", desc: "Very good — minor trade-offs only" },
  { range: "26–45", grade: "FAIR", text: "text-[#4ECDC4]", dot: "bg-[#4ECDC4]", desc: "Decent — some compromises for your values" },
  { range: "46–65", grade: "MURKY", text: "text-[#D4A574]", dot: "bg-[#D4A574]", desc: "Concerning — significant mismatches" },
  { range: "66–85", grade: "TAINTED", text: "text-[#C75B39]", dot: "bg-[#C75B39]", desc: "Poor — conflicts with your priorities" },
  { range: "86–100", grade: "TOXIC", text: "text-[#9B2335]", dot: "bg-[#9B2335]", desc: "Worst — avoid based on your profile" },
];

const dimensions: { icon: LucideIcon; title: string; desc: string; iconClass: string }[] = [
  { icon: Shield, title: "Purity Delta", desc: "Contaminant levels vs your health sensitivity. PFAS, microplastics, heavy metals, chlorine byproducts — weighted by how much you care.", iconClass: "text-[#0A8754]" },
  { icon: DollarSign, title: "Value Delta", desc: "Price per gallon vs quality delivered. Budget-sensitive users see expensive waters penalized more. The conscious satisfier metric.", iconClass: "text-[#B87333]" },
  { icon: MapPin, title: "Availability Delta", desc: "How easy is it to get near you? Nationwide distribution vs online-only. Local sourcing preference increases penalty for distant imports.", iconClass: "text-[#4ECDC4]" },
  { icon: Leaf, title: "Sustainability Delta", desc: "Packaging material, carbon footprint of shipping, corporate environmental practices. Glass preference amplifies plastic penalties.", iconClass: "text-[#2D9D5A]" },
  { icon: Gem, title: "Mineral Delta", desc: "Mineral richness (calcium, magnesium, silica) vs your preference. Some want mineral-rich, others want pure H2O.", iconClass: "text-[#6B7280]" },
  { icon: Eye, title: "Trust Delta", desc: "Corporate transparency, third-party testing, source disclosure. Brand skeptics see opaque companies penalized heavily.", iconClass: "text-[#C75B39]" },
];

export function AWIIndex() {
  const { profile, updateWeight, hasCompletedSurvey, resetProfile } = useAWIProfile();
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showWeights, setShowWeights] = useState(false);
  const [selectedWater, setSelectedWater] = useState<string | null>(null);

  // Calculate AWI for all waters
  const rankedWaters = useMemo(() => {
    const withAWI = bottledWaters.map((w) => ({ water: w, awi: calculateAWI(w, profile) }));
    withAWI.sort((a, b) =>
      sortDir === "asc" ? a.awi.personalScore - b.awi.personalScore : b.awi.personalScore - a.awi.personalScore,
    );
    return withAWI;
  }, [profile, sortDir]);

  const selectedData = selectedWater ? rankedWaters.find((r) => r.water.id === selectedWater) : null;

  const toggleRow = (id: string) => setSelectedWater(selectedWater === id ? null : id);
  // Fix from live: the app's rows were click-only <div>s. They now take Enter/Space as well.
  const rowKeyDown = (id: string) => (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleRow(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="sacred-geo-bg grain-overlay pt-24 pb-16">
        <div className="relative z-10 container">
          {/* framer: initial {opacity 0, y 20} → animate, duration 0.6 */}
          <div className="mx-auto max-w-3xl animate-in fill-mode-both text-center duration-600 fade-in slide-in-from-bottom-5">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2">
              <Droplets className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-primary">The Aqueous Water Index</span>
            </div>

            <h1 className="mb-6 text-4xl leading-tight font-bold text-foreground md:text-6xl">
              Your Water. <span className="text-gradient-water">Your Score.</span>
            </h1>

            <p className={`mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-muted-foreground ${DM_SANS}`}>
              The AWI is the world&apos;s first <strong>personalized</strong> water rating. Unlike every other system
              where 100 is best, our scale is inverted: <strong className="font-data text-[#0A8754]">1 is perfection</strong>.
              Because in the Great Simplification, less is more.
            </p>

            <p className={`mx-auto max-w-xl text-sm text-muted-foreground/70 ${DM_SANS}`}>
              Your score is calculated against YOUR priorities — budget, location, health concerns, sustainability values,
              and what contaminants worry you most. Two people see different scores for the same water.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">How the AWI Works</h2>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              // framer: initial {opacity 0, y 20} → animate, duration 0.5, delay i * 0.15
              <div
                key={step.num}
                className="glass-card animate-in fill-mode-both rounded-xl p-6 duration-500 fade-in slide-in-from-bottom-5"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <span className={`font-data text-3xl font-bold ${step.numClass}`}>{step.num}</span>
                <h3 className={`mt-2 mb-3 text-lg font-semibold ${DM_SANS}`}>{step.title}</h3>
                <p className={`text-sm leading-relaxed text-muted-foreground ${DM_SANS}`}>{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Score Scale Visual */}
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="glass-card rounded-xl p-6">
              <h3 className={`mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase ${DM_SANS}`}>
                AWI Grade Scale
              </h3>
              <div className="space-y-2">
                {gradeScale.map((row) => (
                  <div key={row.range} className="flex items-center gap-4 border-b border-border/30 py-2 last:border-0">
                    <span className={`w-16 text-right font-data text-sm font-bold ${row.text}`}>{row.range}</span>
                    <div className={`h-3 w-3 shrink-0 rounded-full ${row.dot}`} />
                    <span className={`w-28 text-sm font-semibold ${row.text} ${DM_SANS}`}>{row.grade}</span>
                    <span className={`text-sm text-muted-foreground ${DM_SANS}`}>{row.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Dimensions */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">Six Dimensions of Your Score</h2>
          <p className={`mx-auto mb-12 max-w-2xl text-center text-muted-foreground ${DM_SANS}`}>
            Every AWI score is a weighted composite of six dimensions, each personalized to your survey answers.
          </p>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((dim, i) => (
              // framer: initial {opacity 0, y 16} → animate, duration 0.4, delay i * 0.1
              <div
                key={dim.title}
                className="glass-card animate-in fill-mode-both rounded-xl p-5 duration-400 fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <dim.icon className={`mb-3 h-6 w-6 ${dim.iconClass}`} aria-hidden="true" />
                <h3 className={`mb-2 text-base font-semibold ${DM_SANS}`}>{dim.title}</h3>
                <p className={`text-sm leading-relaxed text-muted-foreground ${DM_SANS}`}>{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Weight Tuner + Rankings */}
      <section className="sacred-geo-bg bg-muted/30 py-16">
        <div className="relative z-10 container">
          {/* Fix from live: the app kept the title and both buttons on one row, which squeezed the title
              to a sliver at 375px. They stack on phones now. */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Your Personalized Rankings</h2>
              <p className={`mt-1 text-muted-foreground ${DM_SANS}`}>
                {hasCompletedSurvey
                  ? "Scores reflect your Water Profile survey. Adjust weights below."
                  : "Using default balanced profile. Take the survey on the Tap Water page for personalized scores."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowWeights(!showWeights)}
                aria-expanded={showWeights}
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <Sliders className="h-4 w-4" aria-hidden="true" />
                {showWeights ? "Hide Weights" : "Tune Weights"}
              </button>
              <button
                type="button"
                onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
              >
                {sortDir === "asc" ? (
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                )}
                {sortDir === "asc" ? "Best First" : "Worst First"}
              </button>
            </div>
          </div>

          {/* Weight Tuner Panel. framer: initial {opacity 0, height 0} → animate (sliders only, no
              crawlable copy, so it mounts when opened). */}
          {showWeights && (
            <div className="glass-card mb-8 animate-in rounded-xl p-6 duration-300 fade-in slide-in-from-top-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${DM_SANS}`}>Adjust Your Priorities</h3>
                <button
                  type="button"
                  onClick={resetProfile}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  Reset to Default
                </button>
              </div>
              <p className={`mb-6 text-sm text-muted-foreground ${DM_SANS}`}>
                Drag sliders to change how much each dimension matters to you. Rankings update in real-time.
              </p>
              <div className="grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                {weightConfig.map(({ key, label, icon: Icon, description }) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                        <label htmlFor={`awi-weight-${key}`} className={`text-sm font-medium ${DM_SANS}`}>
                          {label}
                        </label>
                      </div>
                      <span className="font-data text-sm font-bold text-primary">{profile[key]}</span>
                    </div>
                    <input
                      id={`awi-weight-${key}`}
                      type="range"
                      min={1}
                      max={10}
                      value={profile[key]}
                      onChange={(e) => updateWeight(key, parseInt(e.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
                    />
                    <p className="text-xs text-muted-foreground/60">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rankings Table */}
          <div className="glass-card overflow-hidden rounded-xl">
            {/* Header — desktop */}
            <div
              className={`hidden grid-cols-12 gap-4 border-b border-border/40 bg-muted/50 px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:grid ${DM_SANS}`}
            >
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">Water</div>
              <div className="col-span-2 text-center">AWI Score</div>
              <div className="col-span-2 text-center">Industry</div>
              <div className="col-span-2 text-center">Price/Gal</div>
              <div className="col-span-2 text-center">Action</div>
            </div>
            {/* Header — mobile */}
            <div
              className={`grid grid-cols-12 gap-2 border-b border-border/40 bg-muted/50 px-4 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:hidden ${DM_SANS}`}
            >
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">Water</div>
              <div className="col-span-3 text-center">AWI</div>
              <div className="col-span-3 text-center">Price</div>
            </div>

            {/* Rows */}
            {rankedWaters.map(({ water, awi }, i) => {
              const selected = selectedWater === water.id;
              const rankClass = i === 0 ? "text-[#0A8754]" : i < 3 ? "text-[#2D9D5A]" : "text-muted-foreground";
              return (
                // framer: initial {opacity 0, x -10} → animate, duration 0.3, delay i * 0.04
                <div
                  key={water.id}
                  className="animate-in fill-mode-both duration-300 fade-in slide-in-from-left-2.5"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {/* Desktop row */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={selected}
                    aria-label={`${water.name}: show dimension breakdown`}
                    className={`hidden cursor-pointer grid-cols-12 items-center gap-4 border-b border-border/20 px-6 py-4 transition-colors hover:bg-muted/30 md:grid ${
                      selected ? "bg-primary/5" : ""
                    }`}
                    onClick={() => toggleRow(water.id)}
                    onKeyDown={rowKeyDown(water.id)}
                  >
                    <div className="col-span-1 text-center">
                      <span className={`font-data text-lg font-bold ${rankClass}`}>{i + 1}</span>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image src={water.imageUrl} alt={water.name} width={40} height={40} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className={`line-clamp-1 text-sm leading-tight font-semibold text-foreground ${DM_SANS}`}>{water.name}</p>
                          <p className="text-xs text-muted-foreground">{water.brand}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-data text-xl font-bold ${awiText(awi.personalScore)}`}>{awi.personalScore}</span>
                        <span className={`text-xs font-semibold tracking-wider uppercase opacity-70 ${awiText(awi.personalScore)}`}>
                          {awi.grade}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-data text-base font-bold opacity-70 ${awiText(awi.industryConsensus)}`}>
                          {awi.industryConsensus}
                        </span>
                        {awi.crossRefSources > 0 && <span className="text-xs text-muted-foreground/50">{awi.crossRefSources} src</span>}
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="font-data text-sm text-muted-foreground">${water.pricePerGallon.toFixed(2)}</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <Link
                        href={aq(`/water/${water.id}`)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        Details <ChevronRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={selected}
                    aria-label={`${water.name}: show dimension breakdown`}
                    className={`grid cursor-pointer grid-cols-12 items-center gap-2 border-b border-border/20 px-4 py-3 transition-colors hover:bg-muted/30 md:hidden ${
                      selected ? "bg-primary/5" : ""
                    }`}
                    onClick={() => toggleRow(water.id)}
                    onKeyDown={rowKeyDown(water.id)}
                  >
                    <div className="col-span-1 text-center">
                      <span className={`font-data text-sm font-bold ${rankClass}`}>{i + 1}</span>
                    </div>
                    <div className="col-span-5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image src={water.imageUrl} alt={water.name} width={32} height={32} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className={`truncate text-xs leading-tight font-semibold text-foreground ${DM_SANS}`}>{water.name}</p>
                          <p className="truncate text-[10px] text-muted-foreground">{water.brand}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 text-center">
                      <span className={`font-data text-base font-bold ${awiText(awi.personalScore)}`}>{awi.personalScore}</span>
                      <span className={`block text-[10px] font-semibold uppercase opacity-70 ${awiText(awi.personalScore)}`}>{awi.grade}</span>
                    </div>
                    <div className="col-span-3 text-center">
                      <span className="font-data text-xs text-muted-foreground">${water.pricePerGallon.toFixed(2)}</span>
                      {/* The app's typed "›" is a ChevronRight icon (CONTRIBUTING rule 18). */}
                      <Link
                        href={aq(`/water/${water.id}`)}
                        className="mt-0.5 flex items-center justify-center gap-0.5 text-[10px] font-medium text-primary"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        Details <ChevronRight className="size-2.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded Detail for Selected Water. framer: initial {opacity 0, y -10} → animate */}
          {selectedData && (
            <div className="glass-card mt-4 animate-in fill-mode-both rounded-xl p-6 duration-500 fade-in slide-in-from-top-2.5">
              {/* Fix from live: badge and breakdown sat side by side at every width, crushing the
                  breakdown grid at 375px. They stack below md now. */}
              <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                {/* AWI Badge */}
                <AWIBadge awi={selectedData.awi} size="lg" showConsensus showInsight />

                {/* Breakdown */}
                <div className="w-full flex-1 space-y-4">
                  <h3 className={`text-lg font-semibold ${DM_SANS}`}>{selectedData.water.name} — Dimension Breakdown</h3>

                  <AWICompareBar
                    personalScore={selectedData.awi.personalScore}
                    industryConsensus={selectedData.awi.industryConsensus}
                  />

                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {[
                      { label: "Purity", value: selectedData.awi.personalBreakdown.purityDelta },
                      { label: "Value", value: selectedData.awi.personalBreakdown.valueDelta },
                      { label: "Availability", value: selectedData.awi.personalBreakdown.availabilityDelta },
                      { label: "Sustainability", value: selectedData.awi.personalBreakdown.sustainabilityDelta },
                      { label: "Minerals", value: selectedData.awi.personalBreakdown.mineralDelta },
                      { label: "Trust", value: selectedData.awi.personalBreakdown.trustDelta },
                    ].map((dim) => (
                      <div key={dim.label} className="rounded-lg bg-muted/40 p-3 text-center">
                        <span className={`mb-1 block truncate text-xs text-muted-foreground ${DM_SANS}`}>{dim.label}</span>
                        <span className={`font-data text-lg font-bold ${awiText(dim.value)}`}>{dim.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/10 bg-primary/5 p-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <p className={`text-sm leading-relaxed text-muted-foreground ${DM_SANS}`}>{selectedData.awi.personalInsight}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Inverted */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Why 1 is Perfect</h2>

            <div className="glass-card space-y-6 rounded-xl p-8">
              <p className={`leading-relaxed text-muted-foreground ${DM_SANS}`}>
                Every other water rating system uses a 0-100 scale where 100 is best. Most apps cluster scores between
                70-95, making it nearly impossible to distinguish meaningful differences. We reject this.
              </p>

              <blockquote className="border-l-4 border-primary/40 py-2 pl-6">
                <p className="leading-relaxed text-foreground italic">
                  &ldquo;In the Great Simplification, the goal is not accumulation but reduction — reducing complexity,
                  reducing waste, reducing the distance between what we need and what we consume. A perfect score of 1
                  embodies this: nothing to add, nothing to worry about, nothing wasted.&rdquo;
                </p>
                <cite className={`mt-2 block text-sm text-muted-foreground ${DM_SANS}`}>
                  — Inspired by Nate Hagens, The Great Simplification
                </cite>
              </blockquote>

              <p className={`leading-relaxed text-muted-foreground ${DM_SANS}`}>
                A score of <strong className="font-data text-[#0A8754]">1</strong> means: this water is exactly what you
                need, at a price you can afford, available where you live, packaged the way you prefer, from a source you
                trust. It is YOUR perfect water.
              </p>

              <p className={`leading-relaxed text-muted-foreground ${DM_SANS}`}>
                A score of <strong className="font-data text-[#9B2335]">100</strong> means: this water fails you on every
                dimension you care about. It is the furthest thing from what a conscious satisfier would choose.
              </p>

              {/* flex-wrap: the two buttons didn't fit side by side at 375px in the app. */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={aq("/manifesto")}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Read the Manifesto <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={aq("/tap-water")}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                >
                  Take the Survey <Sliders className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FloatingShare />
    </div>
  );
}
