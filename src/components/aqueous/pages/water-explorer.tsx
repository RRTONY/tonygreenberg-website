"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { FloatingShare } from "@/components/aqueous/share-button";
import { WaterCard } from "@/components/aqueous/water-card";
import { Button } from "@/components/aqueous/ui";
import { useAWIProfile } from "@/components/aqueous/aqueous-providers";
import { calculateAWI } from "@/lib/content/aqueous/awi-engine";
import { bottledWaters, type WaterSourceType } from "@/lib/content/aqueous/water-data";

// Ported from the Aqueous app's client/src/pages/WaterExplorer.tsx (2026-11-24). Same copy, filters
// and sorting. framer-motion props are tw-animate classes (noted where each was).

export type SortOption = "awi-best" | "awi-worst" | "qpr-high" | "qpr-low" | "price-low" | "price-high" | "value-high";

const sourceTypes: { value: WaterSourceType | "all"; label: string }[] = [
  { value: "all", label: "All Sources" },
  { value: "spring", label: "Natural Spring" },
  { value: "artesian", label: "Artesian" },
  { value: "purified", label: "Purified" },
  { value: "mineral", label: "Mineral" },
  { value: "alkaline", label: "Alkaline" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "awi-best", label: "AWI Score (Best First)" },
  { value: "awi-worst", label: "AWI Score (Worst First)" },
  { value: "qpr-high", label: "QPR Score (High to Low)" },
  { value: "qpr-low", label: "QPR Score (Low to High)" },
  { value: "value-high", label: "Best Value First" },
  { value: "price-low", label: "Price (Low to High)" },
  { value: "price-high", label: "Price (High to Low)" },
];

export function WaterExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<WaterSourceType | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("awi-best");
  const { profile } = useAWIProfile();
  const [showFilters, setShowFilters] = useState(false);

  const filteredWaters = useMemo(() => {
    let waters = [...bottledWaters];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      waters = waters.filter(
        (w) =>
          w.name.toLowerCase().includes(q) || w.brand.toLowerCase().includes(q) || w.sourceLocation.toLowerCase().includes(q),
      );
    }

    // Source filter
    if (sourceFilter !== "all") {
      waters = waters.filter((w) => w.type === sourceFilter);
    }

    // Sort
    switch (sortBy) {
      case "awi-best":
        waters.sort((a, b) => calculateAWI(a, profile).personalScore - calculateAWI(b, profile).personalScore);
        break;
      case "awi-worst":
        waters.sort((a, b) => calculateAWI(b, profile).personalScore - calculateAWI(a, profile).personalScore);
        break;
      case "qpr-high":
        waters.sort((a, b) => b.qpr.overall - a.qpr.overall);
        break;
      case "qpr-low":
        waters.sort((a, b) => a.qpr.overall - b.qpr.overall);
        break;
      case "price-low":
        waters.sort((a, b) => a.pricePerGallon - b.pricePerGallon);
        break;
      case "price-high":
        waters.sort((a, b) => b.pricePerGallon - a.pricePerGallon);
        break;
      case "value-high":
        waters.sort((a, b) => b.qpr.valueRatio - a.qpr.valueRatio);
        break;
    }

    return waters;
  }, [searchQuery, sourceFilter, sortBy, profile]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <section className="bg-muted/30 pt-24 pb-8">
        <div className="container">
          {/* framer: initial {opacity 0, y 20} → animate, duration 0.5 */}
          <div className="animate-in fill-mode-both duration-500 fade-in slide-in-from-bottom-5">
            <h1 className="mb-3 font-aq-display text-3xl font-bold md:text-4xl">Water Explorer</h1>
            <p className="max-w-2xl leading-relaxed text-muted-foreground">
              Browse every water in our database, scored by the QPR engine using exclusively open-source data from the EPA,
              USGS, and EWG.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-16 z-40 border-b border-border/50 bg-background/95 py-4 backdrop-blur-md">
        <div className="container">
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="text"
                aria-label="Search waters"
                placeholder="Search by name, brand, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border/50 bg-muted/50 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-ring/50 focus:outline-none"
              />
            </div>

            {/* Filter toggle (mobile) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className="gap-2 md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
            </Button>

            {/* Desktop filters */}
            <div className="hidden items-center gap-2 md:flex">
              <select
                aria-label="Filter by source"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as WaterSourceType | "all")}
                className="rounded-lg border border-border/50 bg-muted/50 px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring/50 focus:outline-none"
              >
                {sourceTypes.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              <select
                aria-label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-border/50 bg-muted/50 px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring/50 focus:outline-none"
              >
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile filters expanded. framer: initial {opacity 0, height 0} → animate (form controls
              only, so it mounts when opened). */}
          {showFilters && (
            <div className="mt-3 flex animate-in flex-col gap-2 duration-300 fade-in slide-in-from-top-2 md:hidden">
              <select
                aria-label="Filter by source (mobile)"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as WaterSourceType | "all")}
                className="rounded-lg border border-border/50 bg-muted/50 px-3 py-2.5 text-sm"
              >
                {sourceTypes.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                aria-label="Sort by (mobile)"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-border/50 bg-muted/50 px-3 py-2.5 text-sm"
              >
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="sacred-geo-bg flex-1 py-8">
        <div className="container">
          <p className="mb-6 text-sm text-muted-foreground">
            {filteredWaters.length} water{filteredWaters.length !== 1 ? "s" : ""} found
          </p>

          {filteredWaters.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredWaters.map((water, i) => (
                <WaterCard key={water.id} water={water} index={i} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No waters match your search criteria.</p>
            </div>
          )}
        </div>
      </section>

      <div className="mt-12" />
      <FloatingShare />
    </div>
  );
}
