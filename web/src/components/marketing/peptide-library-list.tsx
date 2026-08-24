"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Zap,
  Wrench,
  BatteryCharging,
  Dna,
  Brain,
  Shield,
  Heart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type SafetyTier = "green" | "yellow" | "red";
export type Category =
  | "metabolic"
  | "mitochondrial"
  | "cognitive"
  | "immune"
  | "recovery"
  | "cosmetic"
  | "sexual"
  | "longevity";

export type PeptideProfile = {
  name: string;
  category: Category;
  safetyTier: SafetyTier;
  evidence: number;
  regulatoryStatus: string;
  priceRange: string;
  stackPartners: string[];
  ouraTracking: string;
  tgTake: string;
  mechanism: string;
  keyStudy?: string;
};

const CATEGORIES: { id: Category; label: string; icon: LucideIcon }[] = [
  { id: "metabolic", label: "Metabolic / GLP-1", icon: Zap },
  { id: "recovery", label: "Recovery / Repair", icon: Wrench },
  { id: "mitochondrial", label: "Mitochondrial / Longevity", icon: BatteryCharging },
  { id: "longevity", label: "GH & Longevity", icon: Dna },
  { id: "cognitive", label: "Cognitive", icon: Brain },
  { id: "immune", label: "Immune / Gut", icon: Shield },
  { id: "sexual", label: "Sexual Health", icon: Heart },
  { id: "cosmetic", label: "Cosmetic / Skin", icon: Sparkles },
];

const SAFETY_COLORS: Record<SafetyTier, { bg: string; text: string; label: string }> = {
  green: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Green — Established Safety" },
  yellow: { bg: "bg-amber-100", text: "text-amber-800", label: "Yellow — Limited Human Data" },
  red: { bg: "bg-red-100", text: "text-red-800", label: "Red — Insufficient Data" },
};

export function PeptideLibraryList({ peptides }: { peptides: PeptideProfile[] }) {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return peptides;
    return peptides.filter((p) => p.category === selectedCategory);
  }, [peptides, selectedCategory]);

  return (
    <>
      <section className="sticky top-14 z-10 border-b border-border bg-background/95 px-6 py-6 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded px-3 py-1.5 text-xs font-medium ${
              selectedCategory === "all" ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
            }`}
          >
            All ({peptides.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = peptides.filter((p) => p.category === cat.id).length;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium ${
                  selectedCategory === cat.id ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl space-y-4">
          {filtered.map((peptide) => {
            const isExpanded = expanded === peptide.name;
            const safety = SAFETY_COLORS[peptide.safetyTier];
            return (
              <div key={peptide.name} className="overflow-hidden rounded-lg border border-border bg-card">
                <button
                  className="flex w-full flex-wrap items-center gap-4 p-5 text-left"
                  onClick={() => setExpanded(isExpanded ? null : peptide.name)}
                >
                  <div className="min-w-50 flex-1">
                    <h3 className="text-lg font-bold text-foreground">{peptide.name}</h3>
                    <p className="text-xs text-muted-foreground">{peptide.mechanism.slice(0, 80)}...</p>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${safety.bg} ${safety.text}`}>
                    {peptide.safetyTier}
                  </span>
                  <div className="min-w-15 text-center">
                    <div className="text-lg font-bold text-foreground">{peptide.evidence}/10</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Evidence</div>
                  </div>
                  <div className="min-w-35 text-sm text-foreground/80">
                    {peptide.priceRange.split(" / ")[0]}
                  </div>
                  <ChevronDown
                    className={`size-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-border bg-secondary/50 p-5">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                            Mechanism
                          </p>
                          <p className="text-sm leading-relaxed text-foreground/80">{peptide.mechanism}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                            Safety Tier
                          </p>
                          <p className={`text-sm font-medium ${safety.text}`}>{safety.label}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                            Regulatory Status
                          </p>
                          <p className="text-sm text-foreground/80">{peptide.regulatoryStatus}</p>
                          <Link href="/whats-legal" className="text-xs text-[#C84B2A] underline">
                            Full regulatory details →
                          </Link>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                            Price Range
                          </p>
                          <p className="text-sm text-foreground/80">{peptide.priceRange}</p>
                          <Link href="/price-tracker" className="text-xs text-[#C84B2A] underline">
                            Compare all prices →
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                            Stack Partners
                          </p>
                          <ul className="space-y-1 text-sm text-foreground/80">
                            {peptide.stackPartners.map((s) => (
                              <li key={s}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                            Oura Ring Tracking
                          </p>
                          <p className="text-sm text-foreground/80">{peptide.ouraTracking}</p>
                        </div>
                        {peptide.keyStudy && (
                          <div>
                            <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                              Key Study
                            </p>
                            <p className="text-sm text-muted-foreground italic">{peptide.keyStudy}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-5 rounded-r border-l-4 border-[#C84B2A] bg-card p-4">
                      <p className="text-sm text-foreground/80 italic">&quot;{peptide.tgTake}&quot;</p>
                      <p className="mt-1 text-xs text-muted-foreground">— TG</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
