"use client";

import { AlertTriangle, ArrowLeft, CheckCircle, ExternalLink, Filter, Heart, XCircle, Zap } from "lucide-react";
import { QPRBadge } from "@/components/aqueous/qpr-badge";
import { Button } from "@/components/aqueous/ui";
import type { StepProps } from "../tap-water";
import { cityPillars, tapWaterData, urgencyCopy, urgencyFor } from "../data/tap-water.data";
import { StepSearch } from "./step-search";

const statusClass = {
  safe: "bg-green-100 text-green-700",
  caution: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
} as const;

// Step 2: one city's report (the app's CityDetail).
export function StepCityDetail({ tap }: StepProps) {
  const city = tap.state.selectedCity;
  // The app fell back to the results list when no city was selected.
  if (!city) return <StepSearch tap={tap} />;

  const q = city.qpr;
  const activeViolations = city.violations.filter((v) => !v.resolved);
  const urgencyLevel = urgencyFor(q.overall);
  const urgency = urgencyLevel === "low" ? null : urgencyCopy[urgencyLevel];

  return (
    // framer initial {opacity 0, y 16} → animate
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      <button
        onClick={tap.back}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Back to results
      </button>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start gap-6">
        <div className="flex-1">
          <h2 className="font-aq-display text-3xl font-bold">
            {city.city}, {city.state}
          </h2>
          <p className="mt-1 text-muted-foreground">{city.utilityName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Population served: {city.population.toLocaleString()} · Last tested: {city.lastTested} · ZIP:{" "}
            {city.zipCode}
          </p>
        </div>
        <QPRBadge score={q.overall} grade={q.grade} size="lg" />
      </div>

      {/* Urgency Banner */}
      {urgency && (
        <div className={`mb-8 flex items-start gap-3 rounded-xl p-4 ${urgency.box}`}>
          <Zap aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${urgency.icon}`} />
          <div>
            <p className={`text-sm font-semibold ${urgency.title}`}>{urgency.heading}</p>
            <p className="mt-1 text-xs opacity-80">{urgency.body}</p>
          </div>
        </div>
      )}

      {/* Active Violations Warning */}
      {activeViolations.length > 0 && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-800">Active Violations</p>
            {activeViolations.map((v, i) => (
              <p key={i} className="mt-1 text-xs text-red-700">
                {v.contaminant} — {v.type} ({v.date})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* QPR Scores */}
      <div className="mb-10 grid grid-cols-3 gap-4">
        {cityPillars.map((p) => (
          <div key={p.label} className="glass-card rounded-xl p-4 text-center">
            <p className="mb-1 text-xs text-muted-foreground">{p.label}</p>
            <p className={`font-aq-display text-3xl font-bold ${p.color}`}>{q[p.key]}</p>
          </div>
        ))}
      </div>

      {/* Contaminants */}
      <h3 className="font-aq-display mb-4 text-xl font-bold">Contaminants Found</h3>
      <div className="glass-card mb-10 overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="p-4 text-left font-semibold text-muted-foreground">Contaminant</th>
                <th className="p-4 text-left font-semibold text-muted-foreground">Level</th>
                <th className="p-4 text-left font-semibold text-muted-foreground">EPA Limit</th>
                <th className="p-4 text-left font-semibold text-muted-foreground">EWG Guideline</th>
                <th className="p-4 text-left font-semibold text-muted-foreground">Status</th>
                <th className="p-4 text-left font-semibold text-muted-foreground">Health Effects</th>
              </tr>
            </thead>
            <tbody>
              {city.contaminants.map((c, i) => (
                <tr key={i} className="border-b border-border/30 last:border-0">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4 font-mono text-xs">
                    {c.level} {c.unit}
                  </td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">
                    {c.epaLimit > 0 ? `${c.epaLimit} ${c.unit}` : "No limit"}
                  </td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">
                    {c.ewgLimit > 0 ? `${c.ewgLimit} ${c.unit}` : "No guideline"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[c.status]}`}
                    >
                      {c.status === "safe" ? (
                        <CheckCircle aria-hidden="true" className="size-3" />
                      ) : c.status === "caution" ? (
                        <AlertTriangle aria-hidden="true" className="size-3" />
                      ) : (
                        <XCircle aria-hidden="true" className="size-3" />
                      )}
                      {c.status}
                    </span>
                  </td>
                  <td className="max-w-50 p-4 text-xs text-muted-foreground">{c.healthEffects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Recommendations */}
      {city.filterRecommendations.length > 0 && (
        <>
          <h3 className="font-aq-display mb-4 text-xl font-bold">
            <Filter aria-hidden="true" className="mr-2 inline size-5 text-[#4ECDC4]" />
            Recommended Filters
          </h3>
          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {city.filterRecommendations.map((f, i) => (
              <div key={i} className="glass-card rounded-xl p-5">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{f.type}</h4>
                    <p className="text-xs text-muted-foreground">
                      {f.brand} · {f.priceRange}
                    </p>
                  </div>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{f.effectiveness}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.removes.map((r) => (
                    <span key={r} className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                      Removes {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Take the Survey CTA */}
      <div className="glass-card mb-8 rounded-xl p-6 text-center">
        <h3 className="font-aq-display mb-2 text-lg font-bold">Get Your Personalized Water Profile</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Take our 10-question survey to get a customized QPR recommendation based on your health priorities,
          budget, lifestyle, and environmental values.
        </p>
        <Button onClick={tap.startSurvey} className="bg-[#0B3D3E] text-white hover:bg-[#0B3D3E]/90">
          <Heart aria-hidden="true" className="mr-2 size-4" /> {tapWaterData.takeSurvey}
        </Button>
      </div>

      {/* CCR Link */}
      <div className="rounded-lg border border-border/50 bg-muted/50 p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Official Report:</strong>{" "}
          <a
            href={city.ccrLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            View Consumer Confidence Report <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        </p>
      </div>
    </div>
  );
}
