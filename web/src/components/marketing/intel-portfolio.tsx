"use client";

import { Check, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type IRRData = {
  keyImpactIndicator: string;
  futureImpact: string;
  impactMultiplier: number;
  impactEfficiency: string;
  timeHorizon: string;
  estimatedIRR: string;
};

export type Competitor = { name: string; description: string; type: "competitor" | "partner" | "adjacent" };

export type PortCo = {
  name: string;
  category: string;
  description: string;
  investmentThesis: string;
  hawkinsScore: number;
  compassScores: number[];
  compositeScore: number;
  irr: IRRData;
  gates: [boolean, boolean, boolean];
  competitors: Competitor[];
  status: "Active" | "Stealth" | "Exited";
  role: string;
};

export const COMPASS_DIMENSIONS = [
  "Trust Velocity",
  "Consciousness Expansion",
  "Regenerative Economics",
  "Sovereignty & Agency",
  "Intersection Potential",
  "Narrative Power",
  "Durability",
];

function hawkinsLabel(score: number): { label: string; color: string } {
  if (score >= 700) return { label: "Enlightenment", color: "#D4B96A" };
  if (score >= 600) return { label: "Peace", color: "#6B8E23" };
  if (score >= 540) return { label: "Joy", color: "#2E8B57" };
  if (score >= 500) return { label: "Love", color: "#C06070" };
  if (score >= 400) return { label: "Reason", color: "#4682B4" };
  if (score >= 350) return { label: "Acceptance", color: "#5F9EA0" };
  if (score >= 310) return { label: "Willingness", color: "#6A5ACD" };
  if (score >= 250) return { label: "Neutrality", color: "#708090" };
  if (score >= 200) return { label: "Courage", color: "#B8860B" };
  return { label: "Below Integrity", color: "#8B0000" };
}

function HawkinsBadge({ score }: { score: number }) {
  const { label, color } = hawkinsLabel(score);
  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className="flex size-7 items-center justify-center rounded-full font-mono text-xs font-bold text-white"
        style={{ background: color }}
      >
        {score}
      </div>
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function GatesCheck({ gates }: { gates: [boolean, boolean, boolean] }) {
  const labels = ["Phone Call Test", "Dinner Table Test", "Tombstone Test"];
  return (
    <div className="flex flex-wrap gap-4">
      {labels.map((label, i) => (
        <div
          key={label}
          className={`flex items-center gap-1.5 font-mono text-xs ${gates[i] ? "text-[#2E8B57]" : "text-[#8B0000]"}`}
        >
          {gates[i] ? <Check className="size-3.5" /> : <X className="size-3.5" />}
          {label}
        </div>
      ))}
    </div>
  );
}

function CompassRadar({ scores }: { scores: number[] }) {
  const max = 10;
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      {COMPASS_DIMENSIONS.map((dim, i) => (
        <div key={dim} className="flex items-center gap-2">
          <div className="w-28 shrink-0 font-mono text-xs text-muted-foreground">{dim}</div>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(scores[i] / max) * 100}%`,
                background: scores[i] >= 9 ? "#D4B96A" : scores[i] >= 7 ? "#8B6914" : "#A0A0A0",
              }}
            />
          </div>
          <span className="w-5 font-mono text-xs text-foreground">{scores[i]}</span>
        </div>
      ))}
    </div>
  );
}

const competitorStyle: Record<Competitor["type"], string> = {
  partner: "bg-[#2E8B57]/10 text-[#2E8B57]",
  adjacent: "bg-[#4682B4]/10 text-[#4682B4]",
  competitor: "bg-[#8B0000]/10 text-[#8B0000]",
};

export function IntelPortfolio({ portfolio }: { portfolio: PortCo[] }) {
  return (
    <Accordion type="single" collapsible>
      {portfolio.map((co) => (
        <AccordionItem key={co.name} value={co.name} className="py-4">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h3 className="font-heading text-2xl font-bold text-foreground">{co.name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-xs uppercase ${
                    co.status === "Active"
                      ? "bg-[#2E8B57]/10 text-[#2E8B57]"
                      : co.status === "Stealth"
                        ? "bg-brand-gold/10 text-brand-gold"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {co.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-brand-gold">{co.category}</span>
                {co.role && (
                  <span className="rounded-full border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground">
                    {co.role}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <HawkinsBadge score={co.hawkinsScore} />
              <div className="text-center">
                <div className="font-heading text-2xl font-bold text-brand-gold">
                  {co.compositeScore.toFixed(1)}
                </div>
                <div className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  Compass
                </div>
              </div>
            </div>
          </div>

          <p className="mb-2 text-foreground/80">{co.description}</p>

          <AccordionTrigger className="py-1 font-mono text-xs tracking-wide text-brand-gold uppercase hover:no-underline">
            Full Analysis
          </AccordionTrigger>

          {/* forceMount: keeps investment thesis + competitor names in the
              server-rendered HTML even collapsed — see /journeys for why. */}
          <AccordionContent forceMount className="border-l-2 border-brand-gold/15 pl-4">
            <div className="mb-5">
              <p className="mb-1 font-mono text-xs tracking-wide text-brand-gold uppercase">
                Why This Matters
              </p>
              <p className="text-foreground/80 italic">&ldquo;{co.investmentThesis}&rdquo;</p>
            </div>

            <div className="mb-5">
              <p className="mb-1 font-mono text-xs tracking-wide text-brand-gold uppercase">
                The Three Gates
              </p>
              <GatesCheck gates={co.gates} />
            </div>

            <div className="mb-5">
              <p className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
                Impact Compass Scores
              </p>
              <CompassRadar scores={co.compassScores} />
            </div>

            <div className="mb-5">
              <p className="mb-2 font-mono text-xs tracking-wide text-[#4682B4] uppercase">
                Impact Rate of Return (iRR) — Howard W. Buffett Framework
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <span className="font-mono text-xs text-muted-foreground">
                    Key Impact Indicator:
                  </span>
                  <div className="text-foreground">{co.irr.keyImpactIndicator}</div>
                </div>
                <div>
                  <span className="font-mono text-xs text-muted-foreground">Future Impact:</span>
                  <div className="text-foreground">{co.irr.futureImpact}</div>
                </div>
                <div>
                  <span className="font-mono text-xs text-muted-foreground">
                    Impact Multiplier:
                  </span>
                  <div className="text-foreground">{co.irr.impactMultiplier}x</div>
                </div>
                <div>
                  <span className="font-mono text-xs text-muted-foreground">
                    Impact Efficiency:
                  </span>
                  <div className="text-foreground">{co.irr.impactEfficiency}</div>
                </div>
                <div>
                  <span className="font-mono text-xs text-muted-foreground">Time Horizon:</span>
                  <div className="text-foreground">{co.irr.timeHorizon}</div>
                </div>
                <div>
                  <span className="font-mono text-xs text-muted-foreground">Estimated iRR:</span>
                  <div className="font-bold text-brand-gold">{co.irr.estimatedIRR}</div>
                </div>
              </div>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                * All iRR figures are estimated based on available data. Companies are invited to
                submit verified metrics.
              </p>
            </div>

            <div>
              <p className="mb-1 font-mono text-xs tracking-wide text-brand-gold uppercase">
                Competitive Landscape
              </p>
              {co.competitors.map((comp) => (
                <div key={comp.name} className="mb-1 flex flex-wrap items-baseline gap-2">
                  <span
                    className={`rounded-sm px-1.5 py-0.5 font-mono text-xs tracking-wide uppercase ${competitorStyle[comp.type]}`}
                  >
                    {comp.type}
                  </span>
                  <span className="font-semibold text-foreground">{comp.name}</span>
                  <span className="text-muted-foreground">— {comp.description}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
