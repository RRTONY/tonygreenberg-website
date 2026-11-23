"use client";

import { Heart, Locate, MapPin, Search } from "lucide-react";
import { Button } from "@/components/aqueous/ui";
import { tapWaterDatabase } from "@/lib/content/aqueous/water-data";
import type { StepProps } from "../tap-water";
import { tapWaterData } from "../data/tap-water.data";

// The search view's header controls: search box, "use my location", browse-all and survey links.
export function SearchBar({ tap }: StepProps) {
  const { query, showAll, locating, locationError } = tap.state;

  return (
    <>
      {/* Search + Geolocation */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            aria-label={tapWaterData.searchPlaceholder}
            placeholder={tapWaterData.searchPlaceholder}
            value={query}
            onChange={(e) => tap.setQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-4 pr-4 pl-12 text-base shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-ring/50 focus:outline-none"
          />
        </div>
        {/* Fix from live: the icon-only button had only a title; aria-label names it for screen readers. */}
        <Button
          onClick={tap.geolocate}
          disabled={locating}
          variant="outline"
          className="h-auto rounded-xl border-border px-4 py-4 transition-all hover:border-primary/30 hover:bg-primary/5"
          title={tapWaterData.useLocation}
          aria-label={tapWaterData.useLocation}
        >
          {locating ? (
            // framer animate {rotate 360} repeat Infinity, duration 1 → animate-spin (1s linear loop)
            <Locate aria-hidden="true" className="size-5 animate-spin" />
          ) : (
            <MapPin aria-hidden="true" className="size-5" />
          )}
        </Button>
      </div>

      {locationError && <p className="mt-2 text-xs text-red-500">{locationError}</p>}

      <div className="mt-3 flex items-center gap-4">
        {query.length === 0 && !showAll && (
          <button onClick={() => tap.updateState({ showAll: true })} className="text-sm text-primary hover:underline">
            Browse all {tapWaterDatabase.length} cities
          </button>
        )}
        <button
          onClick={tap.startSurvey}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          <Heart aria-hidden="true" className="size-3.5" /> {tapWaterData.takeSurvey}
        </button>
      </div>
    </>
  );
}
