"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Droplets, Heart, Leaf, Zap } from "lucide-react";
import { Button } from "@/components/aqueous/ui";
import { aq } from "@/lib/content/aqueous/nav";
import type { StepProps } from "../tap-water";
import { costRows, profileDescriptions, type ProfileType, type SurveyAnswers } from "../data/tap-water.data";

/** The app's personalised scoring, unchanged (each score 0-100). */
export function scoreSurvey(survey: SurveyAnswers, cityScore: number | null) {
  const healthScore = Math.round(
    ((survey.healthPriority + survey.contaminantAwareness + survey.filterWillingness) / 3) * 10,
  );
  const ecoScore = Math.round(((survey.environmentalConcern + survey.glassPreference + survey.carbonFootprint) / 3) * 10);
  const valueScore = Math.round((11 - survey.budgetRange) * 10); // Inverted: lower budget = higher value sensitivity
  const consciousScore = Math.round(((survey.lifestyleAlignment + survey.environmentalConcern) / 2) * 10);

  const needsRO = cityScore !== null ? cityScore < 60 || survey.healthPriority >= 7 : survey.healthPriority >= 7;
  const needsGlass = survey.glassPreference >= 6 || survey.environmentalConcern >= 7;
  const budgetConstrained = survey.budgetRange <= 4;

  const profileType: ProfileType =
    consciousScore >= 70 && ecoScore >= 70
      ? "The Conscious Satisfier"
      : healthScore >= 70 && ecoScore >= 70
        ? "The Regenerative Guardian"
        : healthScore >= 70
          ? "The Health Optimizer"
          : ecoScore >= 70
            ? "The Eco Warrior"
            : valueScore >= 70
              ? "The Smart Economist"
              : "The Awakening Explorer";

  return { healthScore, ecoScore, valueScore, consciousScore, needsRO, needsGlass, budgetConstrained, profileType };
}

const linkClass = "mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline";

// Step 4: the visitor's Water Profile (the app's SurveyResults).
export function StepSurveyResults({ tap }: StepProps) {
  const { survey, selectedCity: city } = tap.state;
  const s = scoreSurvey(survey, city ? city.qpr.overall : null);

  const scores = [
    { label: "Health Focus", score: s.healthScore, color: "text-[#0A8754]" },
    { label: "Eco Alignment", score: s.ecoScore, color: "text-[#4ECDC4]" },
    { label: "Value Sensitivity", score: s.valueScore, color: "text-[#B87333]" },
    { label: "Conscious Living", score: s.consciousScore, color: "text-[#0B3D3E]" },
  ];

  return (
    // framer initial {opacity 0, y 16} → animate
    <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      <button
        onClick={tap.back}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Back to search
      </button>

      <h2 className="font-aq-display mb-2 text-3xl font-bold">Your Water Profile</h2>

      {/* Profile Type */}
      <div className="glass-card mb-8 rounded-xl border-l-4 border-l-[#0B3D3E] p-6 text-center">
        <p className="mb-1 text-xs text-muted-foreground">Your archetype</p>
        <h3 className="font-aq-display text-2xl font-bold text-[#0B3D3E]">{s.profileType}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{profileDescriptions[s.profileType]}</p>
      </div>

      {/* Scores Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {scores.map((sc) => (
          <div key={sc.label} className="glass-card rounded-xl p-4 text-center">
            <p className="mb-1 text-xs text-muted-foreground">{sc.label}</p>
            <p className={`font-aq-display text-2xl font-bold ${sc.color}`}>{sc.score}</p>
          </div>
        ))}
      </div>

      {/* City-Specific Recommendation */}
      {city && (
        <div
          className={
            city.qpr.overall < 40
              ? "mb-8 rounded-xl border border-red-200 bg-red-50 p-5"
              : city.qpr.overall < 60
                ? "mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5"
                : "mb-8 rounded-xl border border-green-200 bg-green-50 p-5"
          }
        >
          <h4 className="mb-2 text-sm font-semibold">
            For {city.city}, {city.state} (QPR: {city.qpr.overall})
          </h4>
          <p className="text-sm">
            {city.qpr.overall < 40
              ? `Your water supply scores critically low. A reverse osmosis filter is not optional — it is essential. ${city.contaminants.filter((c) => c.status === "danger").length} contaminants exceed health guidelines.`
              : city.qpr.overall < 60
                ? `Your water supply has significant concerns. An RO filter would meaningfully improve your daily water quality and long-term health outcomes.`
                : `Your water supply is relatively good, but even "good" municipal water benefits from basic filtration. A pitcher filter is a smart minimum investment.`}
          </p>
        </div>
      )}

      {/* Personalized Recommendations */}
      <h3 className="font-aq-display mb-4 text-xl font-bold">Your Personalized Recommendations</h3>

      <div className="mb-8 space-y-4">
        {s.needsRO && (
          <div className="glass-card flex items-start gap-4 rounded-xl p-5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Zap aria-hidden="true" className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">Install a Reverse Osmosis System</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {s.budgetConstrained
                  ? "Best value: iSpring RCC7AK (~$200) removes 99% of contaminants including PFAS, lead, and chromium-6."
                  : "Premium pick: APEC ROES-PH75 (~$350) with alkaline remineralization for optimal health."}
              </p>
              <Link href={aq("/filter-guide")} className={linkClass}>
                View our Filter Guide <ArrowRight aria-hidden="true" className="size-3" />
              </Link>
            </div>
          </div>
        )}

        {s.needsGlass && (
          <div className="glass-card flex items-start gap-4 rounded-xl p-5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
              <Droplets aria-hidden="true" className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">Switch to Glass-Bottled Water</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Eliminate microplastic exposure entirely. Top picks: Mountain Valley Spring (glass, A+ QPR) or VOSS
                (glass option available). Store filtered water in glass containers at home.
              </p>
              <Link href={aq("/explore")} className={linkClass}>
                Explore glass-bottled waters <ArrowRight aria-hidden="true" className="size-3" />
              </Link>
            </div>
          </div>
        )}

        <div className="glass-card flex items-start gap-4 rounded-xl p-5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
            <Leaf aria-hidden="true" className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">Reduce, Do Not Replace</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              The most sustainable water is the water you already have — filtered properly. One RO system eliminates
              thousands of plastic bottles per year. This is the Great Simplification in action: spend less, consume
              less, live better.
            </p>
            <Link href={aq("/manifesto")} className={linkClass}>
              Read our Manifesto <ArrowRight aria-hidden="true" className="size-3" />
            </Link>
          </div>
        </div>

        {s.consciousScore >= 50 && (
          <div className="glass-card flex items-start gap-4 rounded-xl p-5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0B3D3E20] text-[#0B3D3E]">
              <Heart aria-hidden="true" className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">Join the Conscious Satisfier Movement</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                You are already on the path. Every dollar saved on overpriced branded water is a dollar that can fund
                regenerative projects, community water access, and a world that does not need to grow its GDP to grow
                its wellbeing.
              </p>
              <Link href={aq("/manifesto")} className={linkClass}>
                Learn about conscious satisfaction <ArrowRight aria-hidden="true" className="size-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Cost Comparison */}
      <h3 className="font-aq-display mb-4 text-xl font-bold">Monthly Cost Comparison</h3>
      {/* Fix from live: the 4-column table had no scroll wrapper and pushed the page sideways at 375px. */}
      <div className="glass-card mb-8 overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="p-4 text-left font-semibold text-muted-foreground">Option</th>
                <th className="p-4 text-left font-semibold text-muted-foreground">Monthly Cost</th>
                <th className="p-4 text-left font-semibold text-muted-foreground">Annual Cost</th>
                <th className="p-4 text-left font-semibold text-muted-foreground">Plastic Bottles Saved</th>
              </tr>
            </thead>
            <tbody>
              {costRows.map((row, i) => (
                <tr
                  key={row.option}
                  className={
                    row.best
                      ? "border-b border-border/30 bg-green-50/50"
                      : i === costRows.length - 1
                        ? ""
                        : "border-b border-border/30"
                  }
                >
                  <td className={row.best ? "flex items-center gap-1 p-4 font-medium" : "p-4 font-medium"}>
                    {row.option}
                    {row.best && (
                      <span className="ml-1 rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">Best Value</span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-xs">{row.monthly}</td>
                  <td className="p-4 font-mono text-xs">{row.annual}</td>
                  <td className={row.bad ? "p-4 text-xs text-red-600" : "p-4 text-xs text-green-600"}>{row.saved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fix from live: the two buttons now wrap with a gap instead of overflowing on a phone. */}
      <div className="flex flex-wrap justify-center gap-3 text-center">
        <Button onClick={tap.back} variant="outline">
          <ArrowLeft aria-hidden="true" className="size-4" /> Back to Search
        </Button>
        <Button asChild className="bg-[#0B3D3E] text-white hover:bg-[#0B3D3E]/90">
          <Link href={aq("/filter-guide")}>
            View Filter Recommendations <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
