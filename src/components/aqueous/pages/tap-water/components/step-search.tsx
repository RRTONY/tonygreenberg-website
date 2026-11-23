"use client";

import { AlertTriangle, ChevronRight, Droplets } from "lucide-react";
import { QPRBadge } from "@/components/aqueous/qpr-badge";
import { getScoreColor, tapWaterDatabase } from "@/lib/content/aqueous/water-data";
import type { StepProps } from "../tap-water";
import { popularCities, scoreBarClass } from "../data/tap-water.data";

// Step 1: the search results (or the "no cities found" suggestions). Nothing shows until the
// visitor types or chooses "Browse all", as in the app.
export function StepSearch({ tap }: StepProps) {
  const { results, matchedViaZip } = tap;
  const { query } = tap.state;

  if (results.length > 0) {
    return (
      // framer initial {opacity 0} → animate {opacity 1}
      <div key="results" className="animate-in fade-in duration-500 fill-mode-both">
        <p className="mb-6 text-sm text-muted-foreground">
          {results.length} cit{results.length !== 1 ? "ies" : "y"} found
          {matchedViaZip && <span className="ml-2 text-primary">— matched via ZIP code</span>}
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {results.map((city, i) => {
            const activeViolations = city.violations.filter((v) => !v.resolved).length;
            return (
              // framer initial {opacity 0, y 16} → animate, transition delay i * 0.06
              <button
                key={city.id}
                onClick={() => tap.selectCity(city)}
                style={{ animationDelay: `${i * 0.06}s` }}
                className="glass-card group rounded-xl p-5 text-left transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <QPRBadge score={city.qpr.overall} grade={city.qpr.grade} size="sm" animated={false} />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold transition-colors group-hover:text-primary">
                      {city.city}, {city.state}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{city.utilityName}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {city.contaminants.length} contaminants tracked
                      </span>
                      {activeViolations > 0 && (
                        <span className="flex items-center gap-1 text-xs text-red-600">
                          <AlertTriangle aria-hidden="true" className="size-3" />
                          {activeViolations} active violation{activeViolations > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    {/* Urgency indicator (width is the score, the one runtime style) */}
                    <div className="mt-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${scoreBarClass[getScoreColor(city.qpr.overall)]}`}
                          style={{ width: `${city.qpr.overall}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (query.length > 0) {
    return (
      <div key="empty" className="py-16 text-center animate-in fade-in duration-500 fill-mode-both">
        <Droplets aria-hidden="true" className="mx-auto mb-4 size-12 text-muted-foreground/30" />
        <p className="mb-2 text-muted-foreground">No cities found matching &quot;{query}&quot;</p>
        <p className="mb-4 text-sm text-muted-foreground">
          We currently cover {tapWaterDatabase.length} major US cities. Try a nearby metro area or ZIP code.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {popularCities.map((city) => (
            <button
              key={city}
              onClick={() => tap.updateState({ query: city })}
              className="rounded-full bg-muted px-3 py-1.5 text-xs transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
