"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Award, CheckCircle, DollarSign, Info, MapPin, Package, XCircle } from "lucide-react";
import { FloatingShare } from "@/components/aqueous/share-button";
import { AWIBadge, useAfterMount, AWICompareBar } from "@/components/aqueous/awi-badge";
import { useAWIProfile } from "@/components/aqueous/aqueous-providers";
import { calculateAWI, getAWIScoreColor } from "@/lib/content/aqueous/awi-engine";
import {
  getPackagingLabel,
  getScoreColor,
  getSourceTypeLabel,
  type WaterProduct,
} from "@/lib/content/aqueous/water-data";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/WaterDetail.tsx (2026-11-24). Same sections, copy and
// classes. Changes: the water comes from the route (page.tsx looks it up and calls notFound() for an
// unknown id, so the app's in-page "Water Not Found" block is the Aqueous 404 page now); the app's
// inline colors are literal classes; the app's DM Sans inline font is the font-(family-name:...) class;
// framer-motion props are CSS (noted where each was).

/** getAWIScoreColor's six colors as full literal classes (the app used style={{ color }}). */
const AWI_TEXT: Record<string, string> = {
  "#0A8754": "text-[#0A8754]",
  "#2D9D5A": "text-[#2D9D5A]",
  "#4ECDC4": "text-[#4ECDC4]",
  "#D4A574": "text-[#D4A574]",
  "#C75B39": "text-[#C75B39]",
  "#9B2335": "text-[#9B2335]",
};

/** getScoreColor's five colors as full literal classes. */
const QPR_TEXT: Record<string, string> = {
  "#0A8754": "text-[#0A8754]",
  "#4ECDC4": "text-[#4ECDC4]",
  "#B87333": "text-[#B87333]",
  "#C75B39": "text-[#C75B39]",
  "#9B2335": "text-[#9B2335]",
};

const DM_SANS = "font-(family-name:--font-aq-dm-sans)";

const PILLAR = {
  quality: { text: "text-[#0A8754]", bar: "bg-[#0A8754]" },
  purity: { text: "text-[#4ECDC4]", bar: "bg-[#4ECDC4]" },
  resonance: { text: "text-[#B87333]", bar: "bg-[#B87333]" },
};

type Pillar = keyof typeof PILLAR;

function ScoreBar({ label, score, max = 25, pillar }: { label: string; score: number; max?: number; pillar: Pillar }) {
  const pct = (score / max) * 100;
  // framer: initial {width 0} → animate {width pct%}, duration 0.8, easeOut. The bar mounts at 0 and
  // grows a frame later (useAfterMount) through a CSS width transition; the width is the one runtime inline style.
  const grown = useAfterMount();
  return (
    <div className="flex items-center gap-3">
      <span className="w-40 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          data-testid="score-bar-fill"
          className={`h-full rounded-full transition-[width] duration-800 ease-out motion-reduce:transition-none ${PILLAR[pillar].bar}`}
          style={{ width: grown ? `${pct}%` : "0%" }}
        />
      </div>
      <span className={`w-8 text-right text-xs font-semibold ${PILLAR[pillar].text}`}>
        {score}/{max}
      </span>
    </div>
  );
}

export function WaterDetail({ water }: { water: WaterProduct }) {
  const q = water.qpr;
  const { profile } = useAWIProfile();
  const awi = useMemo(() => calculateAWI(water, profile), [water, profile]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="bg-muted/30 pt-20 pb-8">
        <div className="container">
          <Link
            href={aq("/explore")}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Explorer
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Image */}
            <div className="lg:col-span-1">
              <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={water.imageUrl}
                  alt={water.name}
                  fill
                  priority
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex flex-wrap items-start gap-4">
                <div className="flex-1">
                  <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{water.brand}</span>
                  <h1 className="mt-1 font-aq-display text-3xl font-bold md:text-4xl">{water.name}</h1>
                </div>
                <div className="flex items-center gap-4">
                  <AWIBadge awi={awi} size="lg" showConsensus />
                </div>
              </div>

              <p className="mb-6 leading-relaxed text-muted-foreground">{water.sourceDescription}</p>

              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="glass-card rounded-lg p-3">
                  <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> <span className="text-xs">Source</span>
                  </div>
                  <p className="text-sm font-medium">{getSourceTypeLabel(water.type)}</p>
                  <p className="text-xs text-muted-foreground">{water.sourceLocation}</p>
                </div>
                <div className="glass-card rounded-lg p-3">
                  <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" aria-hidden="true" /> <span className="text-xs">Price</span>
                  </div>
                  <p className="text-sm font-medium">${water.pricePerGallon.toFixed(2)}/gal</p>
                  <p className="text-xs text-muted-foreground">{water.availability.priceRange}</p>
                </div>
                <div className="glass-card rounded-lg p-3">
                  <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                    <Package className="h-3.5 w-3.5" aria-hidden="true" /> <span className="text-xs">Packaging</span>
                  </div>
                  <p className="text-sm font-medium">{getPackagingLabel(water.packaging)}</p>
                </div>
                <div className="glass-card rounded-lg p-3">
                  <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                    <Award className="h-3.5 w-3.5" aria-hidden="true" /> <span className="text-xs">Value Ratio</span>
                  </div>
                  <p className={`text-sm font-medium ${QPR_TEXT[getScoreColor(q.overall)]}`}>{q.valueRatio.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">QPR per dollar</p>
                </div>
              </div>

              {/* Certifications */}
              {water.certifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {water.certifications.map((cert) => (
                    <span key={cert} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {cert}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AWI Personalized Breakdown */}
      <section className="py-8">
        <div className="container">
          <div className="glass-card rounded-xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <h3 className="font-aq-display text-lg font-bold">Your Personalized AWI Breakdown</h3>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">1 = Perfect</span>
            </div>
            <AWICompareBar personalScore={awi.personalScore} industryConsensus={awi.industryConsensus} />
            <div className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6">
              {[
                { label: "Purity", value: awi.personalBreakdown.purityDelta },
                { label: "Value", value: awi.personalBreakdown.valueDelta },
                { label: "Availability", value: awi.personalBreakdown.availabilityDelta },
                { label: "Sustainability", value: awi.personalBreakdown.sustainabilityDelta },
                { label: "Minerals", value: awi.personalBreakdown.mineralDelta },
                { label: "Trust", value: awi.personalBreakdown.trustDelta },
              ].map((dim) => (
                <div key={dim.label} className="rounded-lg bg-muted/40 p-3 text-center">
                  {/* truncate: "Sustainability" overflowed its cell at 375px in the app. */}
                  <span className={`mb-1 block truncate text-xs text-muted-foreground ${DM_SANS}`}>{dim.label}</span>
                  <span className={`font-data text-lg font-bold ${AWI_TEXT[getAWIScoreColor(dim.value)]}`}>{dim.value}</span>
                </div>
              ))}
            </div>
            {awi.personalInsight && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/10 bg-primary/5 p-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <p className={`text-sm leading-relaxed text-muted-foreground ${DM_SANS}`}>{awi.personalInsight}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QPR Breakdown */}
      <section className="py-12">
        <div className="container">
          <h2 className="mb-8 font-aq-display text-2xl font-bold">QPR Score Breakdown</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Quality */}
            <div className="glass-card rounded-xl p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-aq-display text-lg font-bold text-[#0A8754]">Quality</h3>
                <span className="text-2xl font-bold text-[#0A8754]">{q.quality}</span>
              </div>
              <div className="space-y-3">
                <ScoreBar label="Source Integrity" score={q.qualityBreakdown.sourceIntegrity} pillar="quality" />
                <ScoreBar label="Mineral Profile" score={q.qualityBreakdown.mineralProfile} pillar="quality" />
                <ScoreBar label="pH Balance" score={q.qualityBreakdown.pH} pillar="quality" />
                <ScoreBar label="Taste Profile" score={q.qualityBreakdown.taste} pillar="quality" />
              </div>
            </div>

            {/* Purity */}
            <div className="glass-card rounded-xl p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-aq-display text-lg font-bold text-[#4ECDC4]">Purity</h3>
                <span className="text-2xl font-bold text-[#4ECDC4]">{q.purity}</span>
              </div>
              <div className="space-y-3">
                <ScoreBar label="PFAS Levels" score={q.purityBreakdown.pfas} pillar="purity" />
                <ScoreBar label="Microplastics" score={q.purityBreakdown.microplastics} pillar="purity" />
                <ScoreBar label="Heavy Metals" score={q.purityBreakdown.heavyMetals} pillar="purity" />
                <ScoreBar label="Other Contaminants" score={q.purityBreakdown.otherContaminants} pillar="purity" />
              </div>
            </div>

            {/* Resonance */}
            <div className="glass-card rounded-xl p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-aq-display text-lg font-bold text-[#B87333]">Resonance</h3>
                <span className="text-2xl font-bold text-[#B87333]">{q.resonance}</span>
              </div>
              <div className="space-y-3">
                <ScoreBar label="Environmental Impact" score={q.resonanceBreakdown.environmentalImpact} pillar="resonance" />
                <ScoreBar label="Ethical Sourcing" score={q.resonanceBreakdown.ethicalSourcing} pillar="resonance" />
                <ScoreBar label="Packaging Sustainability" score={q.resonanceBreakdown.packagingSustainability} pillar="resonance" />
                <ScoreBar label="Corporate Transparency" score={q.resonanceBreakdown.corporateTransparency} pillar="resonance" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contaminants */}
      <section className="bg-muted/30 py-12">
        <div className="container">
          <h2 className="mb-8 font-aq-display text-2xl font-bold">Contaminant Analysis</h2>

          <div className="glass-card overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="p-4 text-left font-semibold text-muted-foreground">Contaminant</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Level Found</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">EPA Limit</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">EWG Guideline</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Status</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Health Effects</th>
                  </tr>
                </thead>
                <tbody>
                  {water.contaminants.map((c, i) => (
                    <tr key={i} className="border-b border-border/30 last:border-0">
                      <td className="p-4 font-medium">{c.name}</td>
                      <td className="p-4">
                        {c.level} {c.unit}
                      </td>
                      <td className="p-4 text-muted-foreground">{c.epaLimit > 0 ? `${c.epaLimit} ${c.unit}` : "No limit set"}</td>
                      <td className="p-4 text-muted-foreground">{c.ewgLimit > 0 ? `${c.ewgLimit} ${c.unit}` : "No guideline"}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            c.status === "safe"
                              ? "bg-green-100 text-green-700"
                              : c.status === "caution"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {c.status === "safe" ? (
                            <CheckCircle className="h-3 w-3" aria-hidden="true" />
                          ) : c.status === "caution" ? (
                            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <XCircle className="h-3 w-3" aria-hidden="true" />
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
        </div>
      </section>

      {/* Minerals */}
      {water.minerals.length > 0 && (
        <section className="py-12">
          <div className="container">
            <h2 className="mb-8 font-aq-display text-2xl font-bold">Mineral Profile</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {water.minerals.map((m, i) => (
                <div key={i} className="glass-card rounded-xl p-5">
                  <h4 className="mb-1 font-semibold">{m.name}</h4>
                  <p className="mb-1 font-aq-display text-2xl font-bold text-[#0A8754]">
                    {m.level} <span className="text-sm font-normal text-muted-foreground">{m.unit}</span>
                  </p>
                  <p className="mb-2 text-xs text-muted-foreground">Beneficial range: {m.beneficialRange}</p>
                  <p className="text-xs text-muted-foreground">{m.healthBenefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Availability */}
      <section className="bg-muted/30 py-12">
        <div className="container">
          <h2 className="mb-8 font-aq-display text-2xl font-bold">Availability &amp; Pricing</h2>
          <div className="glass-card rounded-xl p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">National Availability</p>
                <p className="font-semibold capitalize">{water.availability.nationalAvailability.replace("-", " ")}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Price Range</p>
                <p className="font-semibold">{water.availability.priceRange}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Where to Find</p>
                <p className="font-semibold">{water.availability.whereToFind.join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="mt-6 rounded-lg border border-border/50 bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Data Sources:</strong> {water.dataSources.join(" · ")} · Year tested: {water.yearTested}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12" />
      <FloatingShare />
    </div>
  );
}
