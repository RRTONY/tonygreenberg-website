"use client";

import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  HeartPulse,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MEDICINES, type Medicine } from "@/lib/content/pri-data";
import {
  getMedicineComplexityLevel,
  getMedicineSequenceGroups,
  MEDICINE_COMPLEXITY_DESCRIPTIONS,
  MEDICINE_COMPLEXITY_ORDER,
  type MedicineComplexityLevel,
} from "@/lib/content/medicine-sequencing";

const COMPLEXITY_CLASS: Record<
  MedicineComplexityLevel,
  { badge: string; panel: string; border: string; text: string; meter: string }
> = {
  Entry: {
    badge: "bg-emerald-700 text-white",
    panel: "bg-emerald-50/80 dark:bg-emerald-950/25",
    border: "border-emerald-300 dark:border-emerald-800",
    text: "text-emerald-950 dark:text-emerald-100",
    meter: "bg-emerald-600",
  },
  Beginner: {
    badge: "bg-sky-700 text-white",
    panel: "bg-sky-50/80 dark:bg-sky-950/25",
    border: "border-sky-300 dark:border-sky-800",
    text: "text-sky-950 dark:text-sky-100",
    meter: "bg-sky-600",
  },
  Intermediate: {
    badge: "bg-amber-700 text-white",
    panel: "bg-amber-50/80 dark:bg-amber-950/25",
    border: "border-amber-300 dark:border-amber-800",
    text: "text-amber-950 dark:text-amber-100",
    meter: "bg-amber-600",
  },
  Advanced: {
    badge: "bg-orange-700 text-white",
    panel: "bg-orange-50/80 dark:bg-orange-950/25",
    border: "border-orange-300 dark:border-orange-800",
    text: "text-orange-950 dark:text-orange-100",
    meter: "bg-orange-600",
  },
  "Clinical Only": {
    badge: "bg-violet-700 text-white",
    panel: "bg-violet-50/80 dark:bg-violet-950/25",
    border: "border-violet-300 dark:border-violet-800",
    text: "text-violet-950 dark:text-violet-100",
    meter: "bg-violet-600",
  },
  "Hard Stop": {
    badge: "bg-red-700 text-white",
    panel: "bg-red-50/80 dark:bg-red-950/25",
    border: "border-red-300 dark:border-red-800",
    text: "text-red-950 dark:text-red-100",
    meter: "bg-red-600",
  },
};

const MEDICINE_ICON: Record<string, LucideIcon> = {
  cannabis: Leaf,
  cacao: HeartPulse,
  ketamine: FlaskConical,
  microdose: FlaskConical,
};

function MedicineIcon({ medicine }: { medicine: Medicine }) {
  const Icon = MEDICINE_ICON[medicine.id] ?? BookOpen;

  return <Icon aria-hidden="true" className="size-5 text-pri-purple" />;
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="text-[0.68rem] font-bold tracking-[0.14em] text-pri-purple uppercase">
        {title}
      </h3>
      <p className="text-sm leading-6 text-pri-brown dark:text-pri-cream/70">{children}</p>
    </section>
  );
}

export function MedicineSequencing() {
  const [selectedLevel, setSelectedLevel] = useState<MedicineComplexityLevel | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const groups = useMemo(() => getMedicineSequenceGroups(), []);
  const visibleGroups = selectedLevel
    ? groups.filter((group) => group.level === selectedLevel)
    : groups;
  const selectedCount = selectedLevel
    ? MEDICINES.filter((medicine) => getMedicineComplexityLevel(medicine) === selectedLevel).length
    : MEDICINES.length;

  return (
    <main className="min-h-screen bg-linear-to-br from-[#fafaf7] via-[#fff7ed] to-[#f0fdf4] text-pri-ink dark:from-pri-ink dark:via-[#161015] dark:to-[#0d1714] dark:text-pri-cream">
      <section className="mx-auto max-w-225 px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <p className="mb-4 font-mono text-xs tracking-[0.16em] text-amber-700 uppercase dark:text-amber-300">
          The Spectrum · Know Before You Go
        </p>
        <h1 className="max-w-175 font-heading text-[clamp(2.2rem,6vw,4.1rem)] leading-[1.05] text-pri-ink dark:text-pri-cream">
          The Medicine Sequencing Ladder
        </h1>
        <p className="mt-5 max-w-175 text-lg leading-8 text-pri-brown dark:text-pri-cream/70">
          The PRI&apos;s source data, organized as a spectrum of preparation. This is not a
          recommendation or medical advice; it is an educational map for understanding the context,
          safeguards, and complexity recorded in the reference material.
        </p>
        <div className="mt-8 max-w-200 rounded-2xl border border-amber-700/25 border-l-4 border-l-amber-700 bg-white/70 p-5 shadow-sm backdrop-blur dark:bg-pri-cream/5">
          <p className="whitespace-pre-line text-sm leading-7 text-pri-brown dark:text-pri-cream/70">
            The spectrum exists to make preparation visible. No page can determine whether a
            substance is appropriate for an individual. Health history, medications, legal status,
            trained clinical input, and qualified facilitation matter at every rung.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-225 px-5 pb-6 sm:px-8">
        <div className="flex flex-wrap gap-2" aria-label="Filter medicine sequence by complexity">
          <Button
            variant={selectedLevel === null ? "default" : "outline"}
            onClick={() => setSelectedLevel(null)}
            className="rounded-full border-amber-700 px-4 text-xs"
          >
            All ({MEDICINES.length})
          </Button>
          {MEDICINE_COMPLEXITY_ORDER.map((level) => {
            const count = MEDICINES.filter(
              (medicine) => getMedicineComplexityLevel(medicine) === level,
            ).length;
            if (count === 0) return null;

            return (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                className="rounded-full px-4 text-xs"
              >
                {level} ({count})
              </Button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-pri-tan dark:text-pri-cream/50">
          Showing {selectedCount} of {MEDICINES.length} documented entries.
        </p>
      </section>

      <section className="mx-auto max-w-225 space-y-10 px-5 pt-6 pb-20 sm:px-8">
        {visibleGroups.map((group) => {
          const classes = COMPLEXITY_CLASS[group.level];

          return (
            <section key={group.level} aria-labelledby={`level-${group.level}`}>
              <header className={`rounded-2xl border p-5 ${classes.panel} ${classes.border}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-xs font-bold tracking-[0.08em] uppercase ${classes.badge}`}
                  >
                    {group.level}
                  </span>
                  <h2
                    id={`level-${group.level}`}
                    className={`font-heading text-2xl ${classes.text}`}
                  >
                    {group.medicines.length} documented entries
                  </h2>
                </div>
                <p className={`mt-3 max-w-180 text-sm leading-6 ${classes.text}`}>
                  {MEDICINE_COMPLEXITY_DESCRIPTIONS[group.level]}
                </p>
              </header>

              <div className="mt-4 space-y-3">
                {group.medicines.map((medicine) => {
                  const expanded = expandedId === medicine.id;

                  return (
                    <article
                      key={medicine.id}
                      className="overflow-hidden rounded-2xl border border-pri-ink/10 bg-white/85 shadow-sm dark:border-pri-cream/10 dark:bg-pri-cream/5"
                    >
                      <Button
                        variant="ghost"
                        className="h-auto w-full justify-start rounded-none px-5 py-4 text-left hover:bg-pri-purple/5"
                        onClick={() => setExpandedId(expanded ? null : medicine.id)}
                        aria-expanded={expanded}
                      >
                        <span className="flex min-w-0 flex-1 items-center gap-4">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pri-purple/10">
                            <MedicineIcon medicine={medicine} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-heading text-lg text-pri-ink dark:text-pri-cream">
                              {medicine.name}
                            </span>
                            <span className="mt-0.5 block truncate text-sm text-pri-tan dark:text-pri-cream/50 italic">
                              {medicine.latin}
                            </span>
                          </span>
                          <span className="hidden w-20 shrink-0 sm:block">
                            <span className="mb-1 block text-right font-mono text-[0.62rem] text-pri-tan dark:text-pri-cream/50 uppercase">
                              Intensity
                            </span>
                            <span className="block h-1.5 overflow-hidden rounded-full bg-pri-ink/10 dark:bg-pri-cream/10">
                              <span
                                className={`block h-full rounded-full ${classes.meter}`}
                                style={{ width: `${Math.round(medicine.intensity * 100)}%` }}
                              />
                            </span>
                          </span>
                          {expanded ? (
                            <ChevronUp
                              aria-hidden="true"
                              className="size-5 shrink-0 text-pri-purple"
                            />
                          ) : (
                            <ChevronDown
                              aria-hidden="true"
                              className="size-5 shrink-0 text-pri-purple"
                            />
                          )}
                        </span>
                      </Button>

                      {expanded && (
                        <div className="border-t border-pri-ink/10 px-5 py-5 dark:border-pri-cream/10">
                          {medicine.complexityJustification && (
                            <div className="mb-5 rounded-xl border border-amber-700/20 bg-amber-50 p-4 dark:bg-amber-950/20">
                              <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.1em] text-amber-800 uppercase dark:text-amber-200">
                                <AlertTriangle aria-hidden="true" className="size-4" />
                                Why this rung
                              </div>
                              <p className="text-sm leading-6 text-amber-950 dark:text-amber-100/80">
                                {medicine.complexityJustification}
                              </p>
                            </div>
                          )}
                          <div className="grid gap-5 md:grid-cols-2">
                            <DetailBlock title="Overview">{medicine.overview}</DetailBlock>
                            <DetailBlock title="Therapeutic applications">
                              {medicine.therapeutic}
                            </DetailBlock>
                            <DetailBlock title="Readiness requirements">
                              {medicine.readiness}
                            </DetailBlock>
                            <DetailBlock title="Tradition">{medicine.tradition}</DetailBlock>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </section>

      <section className="border-t border-pri-ink/10 bg-white/40 px-5 py-16 text-center dark:border-pri-cream/10 dark:bg-pri-cream/3 sm:px-8">
        <h2 className="font-heading text-3xl text-pri-ink dark:text-pri-cream">
          Begin with readiness, not urgency.
        </h2>
        <p className="mx-auto mt-3 max-w-150 text-sm leading-7 text-pri-brown dark:text-pri-cream/65">
          The Psychedelic Readiness Index is an educational assessment that surfaces safety and
          preparation considerations. It cannot replace a clinician, emergency services, or local
          legal guidance.
        </p>
        <Button asChild className="mt-7 h-11 px-6">
          <Link href="/psychedelic-readiness-index">Explore the readiness index</Link>
        </Button>
      </section>
    </main>
  );
}
