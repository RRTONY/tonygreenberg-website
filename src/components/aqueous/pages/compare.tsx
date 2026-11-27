"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Plus } from "lucide-react";
import { FloatingShare } from "@/components/aqueous/share-button";
import { QPRBadge } from "@/components/aqueous/qpr-badge";
import { AWIBadge, useAfterMount } from "@/components/aqueous/awi-badge";
import { useAWIProfile } from "@/components/aqueous/aqueous-providers";
import { calculateAWI, getAWIGradeColor } from "@/lib/content/aqueous/awi-engine";
import { bottledWaters, getScoreColor, getSourceTypeLabel, type WaterProduct } from "@/lib/content/aqueous/water-data";

// Ported from the Aqueous app's client/src/pages/Compare.tsx (2026-11-24). Same copy, defaults
// (waters 1 and 3) and layout. Changes: the app's inline colors are literal classes (Water A green
// #0A8754, Water B copper #B87333, via SIDE below); the stray <SEOHead> the app rendered inside every
// CompareBar is gone (page.tsx sets the metadata once); framer-motion props are CSS (noted where each was).

/** The app's `colors` array, as full literal classes per side. */
const SIDE = [
  { text: "text-[#0A8754]", bar: "bg-[#0A8754]" },
  { text: "text-[#B87333]", bar: "bg-[#B87333]" },
] as const;

/** getScoreColor's five colors as full literal classes. */
const QPR_TEXT: Record<string, string> = {
  "#0A8754": "text-[#0A8754]",
  "#4ECDC4": "text-[#4ECDC4]",
  "#B87333": "text-[#B87333]",
  "#C75B39": "text-[#C75B39]",
  "#9B2335": "text-[#9B2335]",
};

/** getAWIGradeColor's six colors as full literal classes. */
const GRADE_TEXT: Record<string, string> = {
  "#0A8754": "text-[#0A8754]",
  "#2D9D5A": "text-[#2D9D5A]",
  "#4ECDC4": "text-[#4ECDC4]",
  "#D4A574": "text-[#D4A574]",
  "#C75B39": "text-[#C75B39]",
  "#9B2335": "text-[#9B2335]",
};

function CompareBar({ label, values }: { label: string; values: number[] }) {
  const max = Math.max(...values, 25);
  // framer: initial {width 0} → animate {width v/max %}, duration 0.6, delay i * 0.1. The bars mount at
  // 0 and grow a frame later (useAfterMount) through a CSS width transition (and glide to the new width when a
  // water is swapped, as framer did). Width and the stagger are the runtime inline styles.
  const grown = useAfterMount();
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs text-muted-foreground">{label}</p>
      <div className="flex gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                data-testid="compare-bar-fill"
                className={`h-full rounded-full transition-[width] duration-600 motion-reduce:transition-none ${SIDE[i].bar}`}
                style={{ width: grown ? `${(v / max) * 100}%` : "0%", transitionDelay: `${i * 0.1}s` }}
              />
            </div>
            <p className={`mt-0.5 font-data text-xs font-semibold ${SIDE[i].text}`}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WaterSelector({
  label,
  selected,
  onSelect,
  exclude,
}: {
  label: string;
  selected: WaterProduct | null;
  onSelect: (w: WaterProduct) => void;
  exclude: string[];
}) {
  const [open, setOpen] = useState(false);
  const available = bottledWaters.filter((w) => !exclude.includes(w.id));

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={selected ? `${label}: ${selected.name}. Change water` : `${label}: select a water`}
        className="glass-card flex w-full items-center gap-3 rounded-xl p-4 text-left transition-all hover:shadow-md"
      >
        {selected ? (
          <>
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
              <Image src={selected.imageUrl} alt={selected.name} width={48} height={48} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{selected.name}</p>
              <p className="text-xs text-muted-foreground">{selected.brand}</p>
            </div>
            <QPRBadge score={selected.qpr.overall} grade={selected.qpr.grade} size="sm" animated={false} />
          </>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 py-4 text-muted-foreground">
            <Plus className="h-5 w-5" aria-hidden="true" />
            <span className="text-sm font-medium">Select a water</span>
          </div>
        )}
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* framer: initial {opacity 0, y -8} → animate */}
      {open && (
        <div className="glass-card absolute top-full right-0 left-0 z-50 mt-2 max-h-64 animate-in overflow-y-auto rounded-xl shadow-xl duration-500 fade-in slide-in-from-top-2">
          {available.map((w) => (
            <button
              type="button"
              key={w.id}
              onClick={() => {
                onSelect(w);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50"
            >
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md">
                <Image src={w.imageUrl} alt={w.name} width={32} height={32} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{w.name}</p>
                <p className="text-xs text-muted-foreground">{w.brand}</p>
              </div>
              <span className={`text-xs font-bold ${QPR_TEXT[getScoreColor(w.qpr.overall)]}`}>{w.qpr.overall}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Compare() {
  const [waterA, setWaterA] = useState<WaterProduct | null>(bottledWaters[0]);
  const [waterB, setWaterB] = useState<WaterProduct | null>(bottledWaters[2]);
  const { profile } = useAWIProfile();

  const excludeA = waterB ? [waterB.id] : [];
  const excludeB = waterA ? [waterA.id] : [];

  return (
    <div className="flex min-h-screen flex-col">
      <section className="bg-muted/30 pt-24 pb-8">
        <div className="container">
          {/* framer: initial {opacity 0, y 20} → animate (default duration) */}
          <div className="animate-in fill-mode-both duration-500 fade-in slide-in-from-bottom-5">
            <h1 className="mb-3 font-aq-display text-3xl font-bold md:text-4xl">Compare Waters</h1>
            <p className="max-w-2xl text-muted-foreground">
              Side-by-side QPR comparison. See exactly where each water excels and where it falls short — across Quality,
              Purity, and Resonance.
            </p>
          </div>
        </div>
      </section>

      <section className="flex-1 py-8">
        <div className="container">
          {/* Selectors */}
          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              {/* The app's text-muted-foreground was overridden by its inline color, so only the color stays. */}
              <p className={`mb-2 text-xs font-semibold tracking-wider uppercase ${SIDE[0].text}`}>Water A</p>
              <WaterSelector label="Water A" selected={waterA} onSelect={setWaterA} exclude={excludeA} />
            </div>
            <div>
              <p className={`mb-2 text-xs font-semibold tracking-wider uppercase ${SIDE[1].text}`}>Water B</p>
              <WaterSelector label="Water B" selected={waterB} onSelect={setWaterB} exclude={excludeB} />
            </div>
          </div>

          {waterA && waterB && (
            // framer: initial {opacity 0} → animate, delay 0.2
            <div className="animate-in fill-mode-both delay-200 duration-500 fade-in">
              {/* AWI Personalized Scores */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                {[waterA, waterB].map((w) => {
                  const awi = calculateAWI(w, profile);
                  return (
                    // p-4 below sm: the app's p-6 left the 130px badge wider than its column at 375px.
                    <div key={w.id} className="glass-card rounded-xl p-4 text-center sm:p-6">
                      <AWIBadge awi={awi} size="lg" showConsensus />
                      <p className="mt-3 text-sm font-semibold">{w.name}</p>
                      <p className={`mt-1 text-xs font-medium ${GRADE_TEXT[getAWIGradeColor(awi.grade)]}`}>{awi.grade}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Industry: {awi.industryConsensus} · QPR: {w.qpr.overall}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${w.pricePerGallon.toFixed(2)}/gal · Value: {w.qpr.valueRatio.toFixed(1)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* QPR Scores */}
              <div className="mb-10 grid grid-cols-2 gap-4">
                {[waterA, waterB].map((w) => (
                  <div key={w.id} className="glass-card rounded-xl p-4 text-center">
                    <QPRBadge score={w.qpr.overall} grade={w.qpr.grade} size="sm" />
                    <p className="mt-2 text-xs text-muted-foreground">QPR Engine Score</p>
                  </div>
                ))}
              </div>

              {/* Pillar Comparison */}
              <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Quality */}
                <div className="glass-card rounded-xl p-5">
                  <h3 className="mb-4 font-aq-display text-lg font-bold text-[#0A8754]">Quality</h3>
                  <div className="mb-4 flex justify-between">
                    <span className={`font-data text-2xl font-bold ${SIDE[0].text}`}>{waterA.qpr.quality}</span>
                    <span className={`font-data text-2xl font-bold ${SIDE[1].text}`}>{waterB.qpr.quality}</span>
                  </div>
                  <CompareBar label="Source Integrity" values={[waterA.qpr.qualityBreakdown.sourceIntegrity, waterB.qpr.qualityBreakdown.sourceIntegrity]} />
                  <CompareBar label="Mineral Profile" values={[waterA.qpr.qualityBreakdown.mineralProfile, waterB.qpr.qualityBreakdown.mineralProfile]} />
                  <CompareBar label="pH Balance" values={[waterA.qpr.qualityBreakdown.pH, waterB.qpr.qualityBreakdown.pH]} />
                  <CompareBar label="Taste Profile" values={[waterA.qpr.qualityBreakdown.taste, waterB.qpr.qualityBreakdown.taste]} />
                </div>

                {/* Purity */}
                <div className="glass-card rounded-xl p-5">
                  <h3 className="mb-4 font-aq-display text-lg font-bold text-[#4ECDC4]">Purity</h3>
                  <div className="mb-4 flex justify-between">
                    <span className={`font-data text-2xl font-bold ${SIDE[0].text}`}>{waterA.qpr.purity}</span>
                    <span className={`font-data text-2xl font-bold ${SIDE[1].text}`}>{waterB.qpr.purity}</span>
                  </div>
                  <CompareBar label="PFAS Levels" values={[waterA.qpr.purityBreakdown.pfas, waterB.qpr.purityBreakdown.pfas]} />
                  <CompareBar label="Microplastics" values={[waterA.qpr.purityBreakdown.microplastics, waterB.qpr.purityBreakdown.microplastics]} />
                  <CompareBar label="Heavy Metals" values={[waterA.qpr.purityBreakdown.heavyMetals, waterB.qpr.purityBreakdown.heavyMetals]} />
                  <CompareBar label="Other Contaminants" values={[waterA.qpr.purityBreakdown.otherContaminants, waterB.qpr.purityBreakdown.otherContaminants]} />
                </div>

                {/* Resonance */}
                <div className="glass-card rounded-xl p-5">
                  <h3 className="mb-4 font-aq-display text-lg font-bold text-[#B87333]">Resonance</h3>
                  <div className="mb-4 flex justify-between">
                    <span className={`font-data text-2xl font-bold ${SIDE[0].text}`}>{waterA.qpr.resonance}</span>
                    <span className={`font-data text-2xl font-bold ${SIDE[1].text}`}>{waterB.qpr.resonance}</span>
                  </div>
                  <CompareBar label="Environmental Impact" values={[waterA.qpr.resonanceBreakdown.environmentalImpact, waterB.qpr.resonanceBreakdown.environmentalImpact]} />
                  <CompareBar label="Ethical Sourcing" values={[waterA.qpr.resonanceBreakdown.ethicalSourcing, waterB.qpr.resonanceBreakdown.ethicalSourcing]} />
                  <CompareBar label="Packaging" values={[waterA.qpr.resonanceBreakdown.packagingSustainability, waterB.qpr.resonanceBreakdown.packagingSustainability]} />
                  <CompareBar label="Transparency" values={[waterA.qpr.resonanceBreakdown.corporateTransparency, waterB.qpr.resonanceBreakdown.corporateTransparency]} />
                </div>
              </div>

              {/* Quick Stats Table */}
              <div className="glass-card overflow-hidden rounded-xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="p-4 text-left font-semibold text-muted-foreground">Metric</th>
                      <th className={`p-4 text-left font-semibold ${SIDE[0].text}`}>{waterA.name}</th>
                      <th className={`p-4 text-left font-semibold ${SIDE[1].text}`}>{waterB.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Source Type", a: getSourceTypeLabel(waterA.type), b: getSourceTypeLabel(waterB.type) },
                      { label: "Price/Gallon", a: `$${waterA.pricePerGallon.toFixed(2)}`, b: `$${waterB.pricePerGallon.toFixed(2)}` },
                      { label: "Value Ratio", a: waterA.qpr.valueRatio.toFixed(1), b: waterB.qpr.valueRatio.toFixed(1) },
                      { label: "Contaminants Tracked", a: `${waterA.contaminants.length}`, b: `${waterB.contaminants.length}` },
                      {
                        label: "Certifications",
                        a: waterA.certifications.join(", ") || "None",
                        b: waterB.certifications.join(", ") || "None",
                      },
                      {
                        label: "Availability",
                        a: waterA.availability.nationalAvailability.replace("-", " "),
                        b: waterB.availability.nationalAvailability.replace("-", " "),
                      },
                    ].map((row) => (
                      <tr key={row.label} className="border-b border-border/30 last:border-0">
                        <td className="p-4 text-muted-foreground">{row.label}</td>
                        <td className="p-4 font-medium">{row.a}</td>
                        <td className="p-4 font-medium">{row.b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mt-12" />
      <FloatingShare />
    </div>
  );
}
