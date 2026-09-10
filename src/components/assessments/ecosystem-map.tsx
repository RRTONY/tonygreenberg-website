"use client";

import {
  JourneyTracker,
  JOURNEY_MAP,
  useJourneyProgress,
} from "@/components/assessments/journey-tracker";
import { Check, ChevronDown, ChevronUp, ExternalLink, Forward, MapPinned } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ECOSYSTEM_PHASES,
  type EcosystemJourneyEntry,
  getEcosystemDurationMinutes,
  resolveEcosystemPhase,
} from "@/lib/content/ecosystem-map";

const PHASE_STYLES = [
  {
    border: "border-amber-300/25",
    panel: "bg-amber-300/5",
    text: "text-amber-200",
    meter: "bg-amber-300",
  },
  {
    border: "border-rose-300/25",
    panel: "bg-rose-300/5",
    text: "text-rose-200",
    meter: "bg-rose-300",
  },
  {
    border: "border-emerald-300/25",
    panel: "bg-emerald-300/5",
    text: "text-emerald-200",
    meter: "bg-emerald-300",
  },
  {
    border: "border-orange-300/25",
    panel: "bg-orange-300/5",
    text: "text-orange-200",
    meter: "bg-orange-300",
  },
  { border: "border-sky-300/25", panel: "bg-sky-300/5", text: "text-sky-200", meter: "bg-sky-300" },
  {
    border: "border-violet-300/25",
    panel: "bg-violet-300/5",
    text: "text-violet-200",
    meter: "bg-violet-300",
  },
] as const;

function JourneyDestination({
  entry,
  children,
}: {
  entry: EcosystemJourneyEntry;
  children: React.ReactNode;
}) {
  if (entry.isExternal) {
    return (
      <a href={entry.url} target="_blank" rel="noopener noreferrer" className="block">
        {children}
      </a>
    );
  }

  return <Link href={entry.url}>{children}</Link>;
}

export function EcosystemMap() {
  const { completed } = useJourneyProgress();
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const phases = useMemo(
    () => ECOSYSTEM_PHASES.map((phase) => resolveEcosystemPhase(phase, JOURNEY_MAP)),
    [],
  );
  const totalExperiences = phases.flatMap((phase) => phase.experiences).length;
  const completedExperiences = phases
    .flatMap((phase) => phase.experiences)
    .filter((experience) => completed.has(experience.id)).length;
  const progress = totalExperiences
    ? Math.round((completedExperiences / totalExperiences) * 100)
    : 0;
  const nextRecommended = phases
    .flatMap((phase) => phase.experiences)
    .find((experience) => !completed.has(experience.id));
  const totalMinutes = getEcosystemDurationMinutes(phases);

  return (
    <main className="min-h-screen bg-[#0a0a10] text-[#f5f0e0]">
      <section className="mx-auto max-w-225 px-5 pt-20 pb-10 sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-175 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold-light/20 bg-brand-gold-light/6 px-3 py-1 font-mono text-[0.65rem] tracking-[0.16em] text-brand-gold-light uppercase">
            <MapPinned aria-hidden="true" className="size-3.5" />
            The ecosystem map
          </div>
          <h1 className="font-heading text-[clamp(2.4rem,6vw,4.5rem)] font-normal leading-[1.04] text-[#f5f0e0]">
            Your journey through{" "}
            <span className="text-brand-gold-light italic">self-discovery</span>
          </h1>
          <p className="mx-auto mt-6 max-w-150 text-lg leading-8 text-[#f5f0e0]/60">
            {totalExperiences} curated experiences across six phases. Each one explores a different
            facet; together, they form a more complete self-portrait.
          </p>

          <div className="mx-auto mt-8 max-w-125">
            <div className="mb-2 flex items-center justify-between font-mono text-xs text-[#f5f0e0]/55">
              <span>
                {completedExperiences} of {totalExperiences} in this path completed
              </span>
              <span className="text-brand-gold-light">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-brand-gold-light/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#8b6914] to-brand-gold-light transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {nextRecommended && (
            <div className="mt-6 font-mono text-xs tracking-[0.08em] text-[#f5f0e0]/45 uppercase">
              Recommended next
              <JourneyDestination entry={nextRecommended}>
                <span className="ml-3 inline-flex items-center gap-1 border-b border-brand-gold-light/35 pb-1 text-brand-gold-light normal-case">
                  {nextRecommended.name} · {nextRecommended.estimatedMinutes} min
                  {nextRecommended.isExternal ? (
                    <ExternalLink aria-hidden="true" className="size-3" />
                  ) : (
                    <Forward aria-hidden="true" className="size-3" />
                  )}
                </span>
              </JourneyDestination>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-225 space-y-5 px-5 pb-12 sm:px-8">
        {phases.map((phase, index) => {
          const isExpanded = expandedPhase === null || expandedPhase === index;
          const completedCount = phase.experiences.filter((experience) =>
            completed.has(experience.id),
          ).length;
          const phaseProgress = phase.experiences.length
            ? Math.round((completedCount / phase.experiences.length) * 100)
            : 0;
          const phaseStyle = PHASE_STYLES[index] ?? PHASE_STYLES[0];

          return (
            <section
              key={phase.number}
              className={`overflow-hidden rounded-2xl border ${phaseStyle.border} ${phaseStyle.panel}`}
            >
              <button
                type="button"
                onClick={() => setExpandedPhase(expandedPhase === index ? null : index)}
                aria-expanded={isExpanded}
                className="w-full rounded-none bg-[#111018] px-5 py-5 text-left text-[#f5f0e0] transition-colors hover:bg-[#1a1822] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-gold-light sm:px-7"
              >
                <span className="flex w-full items-start gap-4">
                  <span className={`font-heading text-3xl leading-none ${phaseStyle.text}`}>
                    {String(phase.number).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-3">
                      <span className="font-heading text-2xl text-[#f5f0e0]">{phase.title}</span>
                      {phaseProgress === 100 && (
                        <span
                          className={`rounded-full border px-2 py-0.5 font-mono text-[0.58rem] tracking-[0.12em] uppercase ${phaseStyle.border} ${phaseStyle.text}`}
                        >
                          Complete
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-sm text-[#f5f0e0]/50 italic">
                      {phase.subtitle}
                    </span>
                    <span className="mt-4 flex max-w-60 items-center gap-3">
                      <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
                        <span
                          className={`block h-full rounded-full ${phaseStyle.meter}`}
                          style={{ width: `${phaseProgress}%` }}
                        />
                      </span>
                      <span className="font-mono text-[0.65rem] text-[#f5f0e0]/45">
                        {completedCount}/{phase.experiences.length}
                      </span>
                    </span>
                  </span>
                  {isExpanded ? (
                    <ChevronUp
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 text-[#f5f0e0]/45"
                    />
                  ) : (
                    <ChevronDown
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 text-[#f5f0e0]/45"
                    />
                  )}
                </span>
              </button>

              {isExpanded && (
                <div className="px-5 pt-0 pb-6 sm:px-7">
                  <p className="ml-12 max-w-165 text-sm leading-7 text-[#f5f0e0]/55 sm:ml-15">
                    {phase.description}
                  </p>
                  <div className="mt-5 ml-12 grid gap-3 sm:ml-15">
                    {phase.experiences.map((experience) => {
                      const done = completed.has(experience.id);

                      return (
                        <JourneyDestination key={experience.id} entry={experience}>
                          <article className="group flex items-start gap-4 rounded-xl border border-white/7 bg-white/[0.02] p-4 transition-colors hover:border-brand-gold-light/30 hover:bg-white/[0.05]">
                            <span
                              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${done ? "border-brand-gold-light bg-brand-gold-light text-[#0a0a10]" : "border-white/20"}`}
                            >
                              {done && <Check aria-label="Completed" className="size-3" />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className={`flex items-center gap-2 text-sm font-semibold ${done ? "text-brand-gold-light line-through" : "text-[#f5f0e0]"}`}
                              >
                                {experience.name}
                                {experience.isExternal && (
                                  <ExternalLink
                                    aria-label="Opens an external site"
                                    className="size-3"
                                  />
                                )}
                              </span>
                              <span className="mt-1 block text-sm leading-6 text-[#f5f0e0]/50">
                                {experience.isExternal
                                  ? "This experience continues on a related external site."
                                  : "Open the current assessment or resource to continue this part of the journey."}
                              </span>
                            </span>
                            <span className="font-mono text-[0.65rem] text-[#f5f0e0]/40">
                              ~{experience.estimatedMinutes}m
                            </span>
                          </article>
                        </JourneyDestination>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </section>

      <section className="mx-auto max-w-225 px-5 pb-10 sm:px-8">
        <JourneyTracker variant="dark" />
      </section>

      <section className="border-y border-brand-gold-light/10 bg-white/[0.015] px-5 py-14 text-center sm:px-8">
        <p className="font-mono text-[0.65rem] tracking-[0.15em] text-[#f5f0e0]/40 uppercase">
          Primary path estimate
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-12 gap-y-5">
          {[
            { value: totalExperiences, label: "Experiences" },
            { value: ECOSYSTEM_PHASES.length, label: "Phases" },
            { value: `~${Math.max(1, Math.round((totalMinutes / 60) * 10) / 10)}`, label: "Hours" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-heading text-4xl text-brand-gold-light">{stat.value}</div>
              <div className="mt-1 font-mono text-[0.6rem] tracking-[0.12em] text-[#f5f0e0]/40 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
