"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  Filter,
  Flag,
  Globe,
  Heart,
  Info,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { EmailSignup } from "@/components/soulsmoke/email-signup";
import { useFavorites } from "@/components/soulsmoke/soulsmoke-providers";
import {
  allMezcals,
  expertQuotes,
  flavorDimensions,
  type FlavorProfile,
  type Mezcal,
} from "@/lib/content/soulsmoke/mezcal-data";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/MezcalQuadrant.tsx. Same chart, views,
// filters, top-10 list, detail popup and copy. Changes:
// - wouter's useSearch -> useSearchParams, read in a tiny <Suspense> child so the page itself
//   still renders on the server (deep links ?agave= and ?bottle= work as before).
// - EmailSignup posts to the site's list (source "soulsmoke-quadrant-page").
// - Flag emoji in the market badges and "⭐ Ancestral" -> lucide icons (rule 18); icon-only
//   buttons got labels; the popup is role="dialog" and closes on Escape.
// - Fixed from live (rule 20): the chart was full width PLUS a 4-5rem left margin, so the page
//   scrolled sideways at every width; it's now full width minus that margin. On phones the
//   axis badges and the "How to Read" key are smaller so they fit.

type ViewMode = "value-experience" | "price-accessibility" | "flavor-matrix";
type FlavorAxis = keyof FlavorProfile;

export const accessibilityScore = (m: Mezcal): number => {
  // More granular scoring for better spread - unicorn is nearly impossible to find
  const scores: Record<string, number> = { easy: 95, moderate: 70, hard: 40, rare: 15, unicorn: 3 };
  // Add some jitter based on price to spread out the bands
  const jitter = ((m.price % 20) / 20) * 15;
  return Math.min(100, Math.max(2, (scores[m.availability] || 50) + jitter - 7));
};

// Buy links for top bottles
const buyLinks: Record<string, string> = {
  "mx-1": "https://www.oldtowntequila.com/real-minero/",
  "mx-2": "https://www.oldtowntequila.com/lalocura-mezcal/",
  "mx-3": "https://www.astorwines.com/search?searchtype=Contains&term=5%20sentidos",
  "us-1": "https://www.totalwine.com/spirits/mezcal/del-maguey-vida/p/97aboreal",
  "us-2": "https://www.klwines.com/search?searchText=vago%20mezcal",
  "us-3": "https://www.astorwines.com/search?searchtype=Contains&term=el%20jolgorio",
  "us-4": "https://www.totalwine.com/spirits/mezcal/mezcal-vago/p/123456",
  "us-5": "https://www.oldtowntequila.com/el-jolgorio/",
  "mx-4": "https://www.oldtowntequila.com/fane-kantsini/",
  "mx-5": "https://mezcalistas.com/where-to-buy/",
};

// Generate consistent jitter based on mezcal ID (deterministic randomness)
const getJitter = (id: string, axis: "x" | "y"): number => {
  // Create a simple hash from the ID for consistent positioning
  let hash = 0;
  const salt = axis === "x" ? 7 : 13;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i) * salt;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Return jitter between -4 and +4 (percentage points)
  return ((hash % 80) - 40) / 10;
};

const MARKET_DOT: Record<Mezcal["market"], string> = {
  us: "bg-amber-500",
  mexico: "bg-emerald-600",
  both: "bg-purple-500",
};

const MARKET_BADGE: Record<Mezcal["market"], { className: string; label: string; icon: typeof Flag }> = {
  us: { className: "inline-flex items-center gap-1 rounded bg-amber-900/30 px-2 py-1 text-xs text-amber-400", label: "US", icon: Flag },
  mexico: {
    className: "inline-flex items-center gap-1 rounded bg-emerald-900/30 px-2 py-1 text-xs text-emerald-400",
    label: "MX",
    icon: Flag,
  },
  both: {
    className: "inline-flex items-center gap-1 rounded bg-purple-900/30 px-2 py-1 text-xs text-purple-400",
    label: "Both",
    icon: Globe,
  },
};

const SELECT_CLASS = "rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white";

/** Reads ?agave= and ?bottle= (useSearchParams needs its own Suspense boundary). */
function QuadrantDeepLink({ onParams }: { onParams: (params: URLSearchParams) => void }) {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  useEffect(() => {
    onParams(new URLSearchParams(searchString));
  }, [searchString, onParams]);
  return null;
}

export function MezcalQuadrant() {
  const [viewMode, setViewMode] = useState<ViewMode>("value-experience");
  const [selectedMezcal, setSelectedMezcal] = useState<Mezcal | null>(null);
  const [hoveredMezcal, setHoveredMezcal] = useState<Mezcal | null>(null);
  const [flavorXAxis, setFlavorXAxis] = useState<FlavorAxis>("smoke");
  const [flavorYAxis, setFlavorYAxis] = useState<FlavorAxis>("funk");
  const [marketFilter, setMarketFilter] = useState<"all" | "us" | "mexico">("all");
  const [methodFilter, setMethodFilter] = useState<"all" | "ancestral" | "artisanal" | "industrial">("all");
  const [agaveFilter, setAgaveFilter] = useState<string>("all");

  const { toggleFavorite, isFavorite, favorites } = useFavorites();

  // Handle URL parameters for deep linking
  const handleParams = useCallback((params: URLSearchParams) => {
    const agaveParam = params.get("agave");
    if (agaveParam) {
      setAgaveFilter(agaveParam);
    }

    const bottleParam = params.get("bottle");
    if (bottleParam) {
      const bottle = allMezcals.find((m) => m.id === bottleParam);
      if (bottle) {
        setSelectedMezcal(bottle);
      }
    }
  }, []);

  // Close the detail popup with Escape.
  useEffect(() => {
    if (!selectedMezcal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedMezcal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedMezcal]);

  // Get unique agave types for filter dropdown
  const agaveTypes = useMemo(() => {
    const types = new Set(allMezcals.map((m) => m.agave));
    return Array.from(types).sort();
  }, []);

  const filteredMezcals = useMemo(() => {
    let result = allMezcals;
    if (marketFilter !== "all") {
      result = result.filter((m) => m.market === marketFilter || m.market === "both");
    }
    if (methodFilter !== "all") {
      result = result.filter((m) => m.method === methodFilter);
    }
    if (agaveFilter !== "all") {
      result = result.filter((m) => m.agave === agaveFilter);
    }
    return result;
  }, [marketFilter, methodFilter, agaveFilter]);

  // Top 10 best value + experience bottles (sorted by EVI + EEI combined)
  const top10Bottles = useMemo(() => {
    return [...allMezcals]
      .filter((m) => m.eei >= 6 && m.evi >= 5) // Only quality bottles
      .sort((a, b) => b.evi + b.eei - (a.evi + a.eei))
      .slice(0, 10);
  }, []);

  const getPosition = (mezcal: Mezcal): { x: number; y: number } => {
    switch (viewMode) {
      case "value-experience": {
        // Add small jitter to prevent perfect grid alignment
        const eviJitter = getJitter(mezcal.id, "x") * 0.5;
        const eeiJitter = getJitter(mezcal.id, "y") * 0.5;
        return {
          x: Math.max(2, Math.min(98, mezcal.evi * 10 + eviJitter)),
          y: Math.max(2, Math.min(98, mezcal.eei * 10 + eeiJitter)),
        };
      }
      case "price-accessibility": {
        const priceNorm = Math.min(100, (mezcal.price / 250) * 100);
        const accessNorm = accessibilityScore(mezcal);
        return { x: priceNorm, y: accessNorm };
      }
      case "flavor-matrix": {
        // Add significant jitter to flavor matrix for natural spread
        const xJitter = getJitter(mezcal.id, "x");
        const yJitter = getJitter(mezcal.id, "y");
        // Use the actual score (1-10) and spread across 0-100 with variance
        const xBase = mezcal.flavor[flavorXAxis] * 10;
        const yBase = mezcal.flavor[flavorYAxis] * 10;
        return {
          x: Math.max(3, Math.min(97, xBase + xJitter)),
          y: Math.max(3, Math.min(97, yBase + yJitter)),
        };
      }
    }
  };

  const getAxisLabels = () => {
    switch (viewMode) {
      case "value-experience":
        return {
          x: { low: "LOWER VALUE", high: "EXTRAORDINARY VALUE" },
          y: { low: "SUBTLE", high: "MIND-BLOWING" },
        };
      case "price-accessibility":
        return {
          x: { low: "$30", high: "$250+" },
          y: { low: "RARE", high: "EASY TO FIND" },
        };
      case "flavor-matrix": {
        const xDim = flavorDimensions.find((d) => d.key === flavorXAxis);
        const yDim = flavorDimensions.find((d) => d.key === flavorYAxis);
        return {
          x: { low: xDim?.low?.toUpperCase() || "", high: xDim?.high?.toUpperCase() || "" },
          y: { low: yDim?.low?.toUpperCase() || "", high: yDim?.high?.toUpperCase() || "" },
        };
      }
    }
  };

  const getQuadrantLabels = () => {
    switch (viewMode) {
      case "value-experience":
        return {
          topLeft: "HIDDEN GEMS",
          topRight: "THE GRAIL",
          bottomLeft: "SKIP THESE",
          bottomRight: "OVERPRICED",
        };
      case "price-accessibility":
        return {
          topLeft: "EASY & CHEAP",
          topRight: "EASY & EXPENSIVE",
          bottomLeft: "RARE & CHEAP",
          bottomRight: "RARE & EXPENSIVE",
        };
      case "flavor-matrix": {
        const xDimLabel = flavorDimensions.find((d) => d.key === flavorXAxis);
        const yDimLabel = flavorDimensions.find((d) => d.key === flavorYAxis);
        return {
          topLeft: `Low ${xDimLabel?.key || ""} / High ${yDimLabel?.key || ""}`,
          topRight: `High ${xDimLabel?.key || ""} / High ${yDimLabel?.key || ""}`,
          bottomLeft: `Low ${xDimLabel?.key || ""} / Low ${yDimLabel?.key || ""}`,
          bottomRight: `High ${xDimLabel?.key || ""} / Low ${yDimLabel?.key || ""}`,
        };
      }
    }
  };

  const axisLabels = getAxisLabels();
  const quadrantLabels = getQuadrantLabels();
  const isValueView = viewMode === "value-experience";

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 text-white">
      <Suspense fallback={null}>
        <QuadrantDeepLink onParams={handleParams} />
      </Suspense>

      {/* Header */}
      <div className="border-b border-amber-900/30 bg-black py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href={ss("/")}
            className="mb-6 inline-flex items-center gap-2 text-amber-400 transition-colors hover:text-amber-300"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          <h1 className="mb-4 font-serif text-5xl text-amber-400 md:text-6xl">The Mezcal Quadrant</h1>
          <p className="mb-6 max-w-2xl text-xl text-gray-300">
            80 bottles plotted across three dimensions. Click any point to reveal the full story.
          </p>

          {/* Important Disclaimer */}
          <div className="max-w-3xl rounded-lg border border-amber-700/50 bg-amber-950/40 p-4">
            <div className="flex items-start gap-3">
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-500" />
              <div className="text-sm">
                <p className="mb-2 font-semibold text-amber-300">A Note on Rarity &amp; Pricing</p>
                <p className="leading-relaxed text-gray-300">
                  This is an insider&apos;s guide to extraordinary mezcal. Most bottles here come from{" "}
                  <span className="text-amber-400">micro-lots of 20-200 bottles</span>. Prices shown may be wholesale,
                  retail, or historical—many of these bottles are{" "}
                  <span className="text-amber-400">allocation-only</span>, requiring a personal relationship with the
                  maker. Some are simply not for sale at any price. The best mezcal isn&apos;t bought—it&apos;s earned
                  through years of showing up, learning, and building trust with the families who make it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle & Filters */}
      <div className="sticky top-16 z-30 border-b border-amber-900/20 bg-[#0a0a0a]/95 py-4 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-400">View:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { mode: "value-experience" as ViewMode, icon: TrendingUp, label: "Value vs Experience" },
                { mode: "price-accessibility" as ViewMode, icon: DollarSign, label: "Price vs Accessibility" },
                { mode: "flavor-matrix" as ViewMode, icon: Sparkles, label: "Flavor Matrix" },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  type="button"
                  key={mode}
                  aria-pressed={viewMode === mode}
                  onClick={() => setViewMode(mode)}
                  className={
                    viewMode === mode
                      ? "flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-black transition-all"
                      : "flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-gray-200 transition-all hover:bg-white/20"
                  }
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-3">
              <Filter aria-hidden="true" className="size-4 text-gray-400" />
              <select
                aria-label="Market"
                value={marketFilter}
                onChange={(e) => setMarketFilter(e.target.value as "all" | "us" | "mexico")}
                className={SELECT_CLASS}
              >
                <option value="all">All Markets</option>
                <option value="us">US Only</option>
                <option value="mexico">Mexico Only</option>
              </select>
              <select
                aria-label="Method"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value as "all" | "ancestral" | "artisanal" | "industrial")}
                className={SELECT_CLASS}
              >
                <option value="all">All Methods</option>
                <option value="ancestral">Ancestral</option>
                <option value="artisanal">Artisanal</option>
                <option value="industrial">Industrial</option>
              </select>
              <select
                aria-label="Agave"
                value={agaveFilter}
                onChange={(e) => setAgaveFilter(e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="all">All Agaves</option>
                {agaveTypes.map((agave) => (
                  <option key={agave} value={agave}>
                    {agave}
                  </option>
                ))}
              </select>
              {favorites.length > 0 && (
                <Link
                  href={ss("/my-hunt-list")}
                  className="flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-black"
                >
                  <Heart aria-hidden="true" className="size-4 fill-current" />
                  My List ({favorites.length})
                </Link>
              )}
            </div>
          </div>

          {/* Flavor axis selectors */}
          {viewMode === "flavor-matrix" && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2">
                <span className="text-sm text-gray-400">X-Axis:</span>
                <select
                  value={flavorXAxis}
                  onChange={(e) => setFlavorXAxis(e.target.value as FlavorAxis)}
                  className={SELECT_CLASS}
                >
                  {flavorDimensions.map((dim) => (
                    <option key={dim.key} value={dim.key}>
                      {dim.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Y-Axis:</span>
                <select
                  value={flavorYAxis}
                  onChange={(e) => setFlavorYAxis(e.target.value as FlavorAxis)}
                  className={SELECT_CLASS}
                >
                  {flavorDimensions.map((dim) => (
                    <option key={dim.key} value={dim.key}>
                      {dim.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Quadrant Chart */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* QUADRANT KEY - ABOVE THE CHART */}
        <div className="mb-8 rounded-xl border border-white/10 bg-[#1a1a1a] p-4 sm:p-6">
          <h3 className="mb-4 text-center text-lg font-bold text-white">How to Read This Chart</h3>
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:gap-4">
            <div className="flex items-start gap-2 rounded-lg border border-white/20 bg-white/5 p-2 sm:gap-3 sm:p-3">
              <div className="mt-1 size-4 shrink-0 rounded bg-amber-500" />
              <div className="min-w-0">
                <div className="text-sm font-bold text-amber-400">{quadrantLabels.topRight} (Top Right)</div>
                <div className="text-xs text-gray-300">
                  {viewMode === "value-experience" && "High value + amazing experience. Hunt these."}
                  {viewMode === "price-accessibility" && "Easy to find but expensive. Splurge territory."}
                  {viewMode === "flavor-matrix" && `High ${flavorXAxis} + High ${flavorYAxis}`}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-white/20 bg-white/5 p-2 sm:gap-3 sm:p-3">
              <div className="mt-1 size-4 shrink-0 rounded bg-emerald-600" />
              <div className="min-w-0">
                <div className="text-sm font-bold text-emerald-400">{quadrantLabels.topLeft} (Top Left)</div>
                <div className="text-xs text-gray-300">
                  {viewMode === "value-experience" && "Expensive but worth it. Special occasions."}
                  {viewMode === "price-accessibility" && "Easy to find and affordable. Start here."}
                  {viewMode === "flavor-matrix" && `Low ${flavorXAxis} + High ${flavorYAxis}`}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-white/20 bg-white/5 p-2 sm:gap-3 sm:p-3">
              <div className="mt-1 size-4 shrink-0 rounded bg-red-600" />
              <div className="min-w-0">
                <div className="text-sm font-bold text-red-400">{quadrantLabels.bottomLeft} (Bottom Left)</div>
                <div className="text-xs text-gray-300">
                  {viewMode === "value-experience" && "Low value, boring experience. Avoid."}
                  {viewMode === "price-accessibility" && "Rare and cheap. Hidden treasures."}
                  {viewMode === "flavor-matrix" && `Low ${flavorXAxis} + Low ${flavorYAxis}`}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-white/20 bg-white/5 p-2 sm:gap-3 sm:p-3">
              <div className="mt-1 size-4 shrink-0 rounded bg-orange-600" />
              <div className="min-w-0">
                <div className="text-sm font-bold text-orange-400">{quadrantLabels.bottomRight} (Bottom Right)</div>
                <div className="text-xs text-gray-300">
                  {viewMode === "value-experience" && "Good value, meh experience. Entry level."}
                  {viewMode === "price-accessibility" && "Rare and expensive. The ultimate hunt."}
                  {viewMode === "flavor-matrix" && `High ${flavorXAxis} + Low ${flavorYAxis}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-900/30 bg-[#111] p-6 md:p-8">
          {/* Chart area - CLEAN, NO LABELS INSIDE */}
          <div className="relative mb-16 ml-10 aspect-square max-h-125 w-[calc(100%-2.5rem)] sm:ml-16 sm:w-[calc(100%-4rem)] md:ml-20 md:w-[calc(100%-5rem)]">
            {/* Quadrant background colors */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 overflow-hidden rounded-lg">
              <div className={isValueView ? "bg-emerald-900/20" : "bg-white/5"} />
              <div className={isValueView ? "bg-amber-900/20" : "bg-white/5"} />
              <div className={isValueView ? "bg-red-900/20" : "bg-white/5"} />
              <div className={isValueView ? "bg-orange-900/20" : "bg-white/5"} />
            </div>

            {/* Grid lines */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
              <div className="absolute top-1/2 right-0 left-0 h-px bg-white/30" />
            </div>

            {/* Axis border */}
            <div className="absolute inset-0 rounded-bl-lg border-b-2 border-l-2 border-white/50" />

            {/* Data points */}
            {filteredMezcals.map((mezcal) => {
              const pos = getPosition(mezcal);
              const isActive = hoveredMezcal?.id === mezcal.id || selectedMezcal?.id === mezcal.id;
              const ancestralRing =
                mezcal.method === "ancestral" ? "ring-2 ring-white ring-offset-1 ring-offset-black" : "";
              const activeRing = isActive ? "ring-4 ring-amber-400/50 shadow-lg shadow-amber-500/30" : "shadow";

              return (
                <button
                  type="button"
                  key={mezcal.id}
                  aria-label={`${mezcal.brand} ${mezcal.name}`}
                  onClick={() => setSelectedMezcal(mezcal)}
                  onMouseEnter={() => setHoveredMezcal(mezcal)}
                  onMouseLeave={() => setHoveredMezcal(null)}
                  className={
                    isActive
                      ? "absolute z-20 -translate-x-1/2 translate-y-1/2 scale-150 transform transition-all duration-200"
                      : "absolute z-10 -translate-x-1/2 translate-y-1/2 transform transition-all duration-200 hover:scale-125"
                  }
                  // Point position from the bottle's scores (runtime values).
                  style={{
                    left: `${Math.max(5, Math.min(95, pos.x))}%`,
                    bottom: `${Math.max(5, Math.min(95, pos.y))}%`,
                  }}
                >
                  <div
                    className={`size-3 rounded-full md:size-4 ${MARKET_DOT[mezcal.market]} ${ancestralRing} ${activeRing}`}
                  />
                  {isActive && (
                    <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg border border-amber-500/50 bg-black px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-xl">
                      <span className="text-amber-400">{mezcal.brand}</span> {mezcal.name}
                      <div className="text-xs text-gray-300">{mezcal.agave}</div>
                    </div>
                  )}
                </button>
              );
            })}

            {/* X-Axis labels - LARGE AND READABLE */}
            <div className="absolute right-0 -bottom-12 left-0 flex justify-between gap-2 px-2">
              <span className="rounded bg-red-600/80 px-2 py-1 text-xs font-bold text-white sm:px-3 sm:text-sm md:text-base">
                {axisLabels.x.low}
              </span>
              <span className="rounded bg-amber-500/80 px-2 py-1 text-right text-xs font-bold text-white sm:px-3 sm:text-sm md:text-base">
                {axisLabels.x.high}
              </span>
            </div>

            {/* Y-Axis labels - LARGE AND READABLE */}
            <div className="absolute top-0 bottom-0 -left-2 flex flex-col justify-between py-2 md:-left-4">
              <span className="origin-center -translate-x-1/2 -rotate-90 rounded bg-amber-500/80 px-2 py-1 text-xs font-bold whitespace-nowrap text-white sm:text-sm md:text-base">
                {axisLabels.y.high}
              </span>
              <span className="origin-center -translate-x-1/2 -rotate-90 rounded bg-red-600/80 px-2 py-1 text-xs font-bold whitespace-nowrap text-white sm:text-sm md:text-base">
                {axisLabels.y.low}
              </span>
            </div>
          </div>

          {/* Dot Legend - BELOW CHART */}
          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-amber-500" />
              <span className="text-xs text-gray-300 md:text-sm">US</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-emerald-600" />
              <span className="text-xs text-gray-300 md:text-sm">Mexico</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-purple-500" />
              <span className="text-xs text-gray-300 md:text-sm">Both</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-gray-500 ring-2 ring-white" />
              <span className="text-xs text-gray-300 md:text-sm">Ancestral</span>
            </div>
          </div>
        </div>

        {/* TOP 10 LIST - THE GRAIL BOTTLES */}
        <div className="mt-16">
          <div className="mb-8 flex items-center gap-3">
            <Star aria-hidden="true" className="size-8 fill-amber-400 text-amber-400" />
            <h2 className="font-serif text-3xl text-amber-400">Top 10: The Grail Bottles</h2>
          </div>
          <p className="mb-8 max-w-2xl text-gray-300">
            The highest combined Value + Experience scores. These are the bottles worth hunting for — extraordinary
            experiences at prices that make sense.
          </p>

          <div className="space-y-4">
            {top10Bottles.map((mezcal, index) => {
              const market = MARKET_BADGE[mezcal.market];
              const MarketIcon = market.icon;
              const saved = isFavorite(mezcal.id);
              return (
                <div
                  key={mezcal.id}
                  className="cursor-pointer rounded-xl border border-amber-900/30 bg-[#111] p-4 transition-all hover:border-amber-500/50 sm:p-6"
                  onClick={() => setSelectedMezcal(mezcal)}
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    {/* Rank */}
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                      <span className="text-2xl font-bold text-amber-400">{index + 1}</span>
                    </div>

                    {/* Info */}
                    <div className="min-w-0 grow">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-serif text-xl">
                            <button
                              type="button"
                              className="cursor-pointer text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMezcal(mezcal);
                              }}
                            >
                              <span className="text-amber-400">{mezcal.brand}</span>{" "}
                              <span className="text-white">{mezcal.name}</span>
                            </button>
                          </h3>
                          <p className="text-gray-400">
                            {mezcal.agave} · {mezcal.region}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-400">${mezcal.price}</div>
                          <div className="text-xs text-gray-400 uppercase">{mezcal.availability}</div>
                        </div>
                      </div>

                      <p className="mb-4 text-sm text-gray-300">{mezcal.tastingNotes}</p>

                      <div className="flex flex-wrap items-center gap-4">
                        {/* Scores */}
                        <div className="flex items-center gap-2 rounded-full bg-emerald-900/30 px-3 py-1">
                          <span className="text-xs text-gray-300">Value:</span>
                          <span className="text-sm font-bold text-emerald-400">{mezcal.evi.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-amber-900/30 px-3 py-1">
                          <span className="text-xs text-gray-300">Experience:</span>
                          <span className="text-sm font-bold text-amber-400">{mezcal.eei.toFixed(1)}</span>
                        </div>

                        {/* Market badge */}
                        <span className={market.className}>
                          <MarketIcon aria-hidden="true" className="size-3" />
                          {market.label}
                        </span>

                        {/* Method badge */}
                        {mezcal.method === "ancestral" && (
                          <span className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-xs text-white">
                            <Star aria-hidden="true" className="size-3 fill-amber-400 text-amber-400" />
                            Ancestral
                          </span>
                        )}

                        {/* Buy link */}
                        {buyLinks[mezcal.id] && (
                          <a
                            href={buyLinks[mezcal.id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="ml-auto flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-amber-400"
                          >
                            <ShoppingCart aria-hidden="true" className="size-4" />
                            Buy Now
                          </a>
                        )}

                        {/* Add to list */}
                        <button
                          type="button"
                          aria-pressed={saved}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(mezcal.id);
                          }}
                          className={
                            saved
                              ? "flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400 transition-colors"
                              : "flex items-center gap-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-gray-300 transition-colors hover:text-white"
                          }
                        >
                          <Heart aria-hidden="true" className={saved ? "size-4 fill-current" : "size-4"} />
                          {saved ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View explanation */}
        <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start gap-3">
            <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-400" />
            <div>
              {viewMode === "value-experience" && (
                <>
                  <h3 className="mb-1 font-bold text-white">Value vs Experience Index</h3>
                  <p className="text-sm text-gray-300">
                    <strong className="text-amber-400">EVI (Extraordinary Value Index)</strong> measures complexity and
                    uniqueness relative to price.
                    <strong className="text-amber-400"> EEI (Extraordinary Experience Index)</strong> measures pure
                    sensory intensity. The top-right quadrant is{" "}
                    <span className="font-bold text-amber-400">&quot;The Grail&quot;</span> — bottles that deliver both.
                  </p>
                </>
              )}
              {viewMode === "price-accessibility" && (
                <>
                  <h3 className="mb-1 font-bold text-white">Price vs Accessibility</h3>
                  <p className="text-sm text-gray-300">
                    Find bottles based on your budget and willingness to hunt.{" "}
                    <strong className="text-white">Top-left</strong> shows easy-to-find affordable options.
                    <strong className="text-white"> Bottom-right</strong> shows rare bottles worth the splurge and the
                    search.
                  </p>
                </>
              )}
              {viewMode === "flavor-matrix" && (
                <>
                  <h3 className="mb-1 font-bold text-white">Flavor Profile Matrix</h3>
                  <p className="text-sm text-gray-300">
                    Plot any two flavor dimensions against each other. Each mezcal is scored 1-10 on eight dimensions:
                    <strong className="text-white"> Smoke, Sweetness, Funk, Herbal, Fruit, Spice, Mineral,</strong> and{" "}
                    <strong className="text-white">Complexity</strong>.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Expert Quote */}
        <div className="mt-8 text-center">
          <blockquote className="mx-auto max-w-2xl text-xl text-gray-400 italic">
            &quot;{expertQuotes.dougFrost[3]}&quot;
          </blockquote>
          <cite className="mt-2 block text-sm text-amber-400">— Doug Frost, MS, MW</cite>
        </div>

        {/* Mailing List Signup */}
        <div className="mt-16">
          <EmailSignup source="soulsmoke-quadrant-page" variant="default" className="mx-auto max-w-md" />
        </div>
      </div>

      {/* Selected Mezcal Detail Modal */}
      {selectedMezcal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMezcal(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quadrant-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-amber-900/50 bg-[#111]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 rounded-t-2xl border-b border-amber-900/30 bg-black p-6">
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelectedMezcal(null)}
                className="absolute top-4 right-4 rounded-full p-2 transition-colors hover:bg-white/10"
              >
                <X aria-hidden="true" className="size-5 text-gray-300" />
              </button>
              <div className="mb-1 text-sm font-medium text-amber-400">{selectedMezcal.brand}</div>
              <h2 id="quadrant-detail-title" className="pr-10 font-serif text-3xl text-white">
                {selectedMezcal.name}
              </h2>
              <p className="mt-1 text-gray-400">
                {selectedMezcal.agave} · {selectedMezcal.region}
              </p>
            </div>

            <div className="space-y-6 p-6">
              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-emerald-900/30 bg-emerald-900/20 p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-400">{selectedMezcal.evi.toFixed(1)}</div>
                  <div className="text-sm text-gray-400">Value Index (EVI)</div>
                </div>
                <div className="rounded-xl border border-amber-900/30 bg-amber-900/20 p-4 text-center">
                  <div className="text-3xl font-bold text-amber-400">{selectedMezcal.eei.toFixed(1)}</div>
                  <div className="text-sm text-gray-400">Experience Index (EEI)</div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Producer:</span>
                  <span className="ml-2 text-white">{selectedMezcal.producer}</span>
                </div>
                <div>
                  <span className="text-gray-400">Method:</span>
                  <span className="ml-2 text-white capitalize">{selectedMezcal.method}</span>
                </div>
                <div>
                  <span className="text-gray-400">ABV:</span>
                  <span className="ml-2 text-white">{selectedMezcal.abv}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Price:</span>
                  <span className="ml-2 font-bold text-amber-400">${selectedMezcal.price}</span>
                </div>
                <div>
                  <span className="text-gray-400">Availability:</span>
                  <span className="ml-2 text-white capitalize">{selectedMezcal.availability}</span>
                </div>
                <div>
                  <span className="text-gray-400">Market:</span>
                  <span className="ml-2 text-white capitalize">{selectedMezcal.market}</span>
                </div>
              </div>

              {/* Flavor Profile */}
              <div>
                <h3 className="mb-3 font-bold text-white">Flavor Profile</h3>
                <div className="space-y-2">
                  {flavorDimensions.map((dim) => {
                    const value = selectedMezcal.flavor[dim.key as FlavorAxis];
                    return (
                      <div key={dim.key} className="flex items-center gap-3">
                        <span className="w-24 text-sm text-gray-400">{dim.label}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                          {/* Bar width is the bottle's score (runtime value). */}
                          <div
                            className="h-full rounded-full bg-linear-to-r from-amber-600 to-amber-400"
                            style={{ width: `${value * 10}%` }}
                          />
                        </div>
                        <span className="w-6 text-sm font-bold text-amber-400">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tasting Notes */}
              <div>
                <h3 className="mb-2 font-bold text-white">Tasting Notes</h3>
                <p className="text-gray-300">{selectedMezcal.tastingNotes}</p>
              </div>

              {/* Story */}
              <div>
                <h3 className="mb-2 font-bold text-white">The Story</h3>
                <p className="text-gray-300">{selectedMezcal.story}</p>
              </div>

              {/* Expert Quote */}
              {selectedMezcal.expertQuote && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <blockquote className="text-gray-300 italic">{selectedMezcal.expertQuote}</blockquote>
                  {selectedMezcal.expertSource && (
                    <cite className="mt-2 block text-sm text-amber-400">— {selectedMezcal.expertSource}</cite>
                  )}
                </div>
              )}

              {/* Where to Buy */}
              {selectedMezcal.whereToBuy && selectedMezcal.whereToBuy.length > 0 && (
                <div>
                  <h3 className="mb-2 font-bold text-white">Where to Find</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMezcal.whereToBuy.map((place, i) => (
                      <span key={i} className="rounded-full bg-white/10 px-3 py-1 text-sm text-gray-200">
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  aria-pressed={isFavorite(selectedMezcal.id)}
                  onClick={() => toggleFavorite(selectedMezcal.id)}
                  className={
                    isFavorite(selectedMezcal.id)
                      ? "flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/20 py-3 font-medium text-red-400 transition-all"
                      : "flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 py-3 font-medium text-white transition-all hover:bg-white/20"
                  }
                >
                  <Heart
                    aria-hidden="true"
                    className={isFavorite(selectedMezcal.id) ? "size-5 fill-current" : "size-5"}
                  />
                  {isFavorite(selectedMezcal.id) ? "In My Hunt List" : "Add to Hunt List"}
                </button>
                {buyLinks[selectedMezcal.id] && (
                  <a
                    href={buyLinks[selectedMezcal.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-black transition-colors hover:bg-amber-400"
                  >
                    <ShoppingCart aria-hidden="true" className="size-5" />
                    Buy Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
