"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ExternalLink, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";
import { JourneyTracker, JOURNEY_MAP, useJourneyProgress } from "@/components/assessments/journey-tracker";
import { ECOSYSTEM_PHASES, type EcosystemExperience } from "@/lib/content/ecosystem-map";

// Ported from legacy client/src/pages/EcosystemMap.tsx. Progress comes from
// the shared `useJourneyProgress` store (same one /my-journey and each
// assessment's JourneyTracker use). Every phase starts expanded; collapsing
// one hides it with a class rather than unmounting, so all 18 experience
// descriptions stay in the server-rendered HTML. Legacy's inline per-phase
// hex colors are precomposed below as full literal class strings.

const PHASE_STYLES = [
  { border: "border-amber-300/25", panel: "bg-amber-300/5", text: "text-amber-200", meter: "bg-amber-300", doneBg: "bg-amber-300/8" },
  { border: "border-rose-300/25", panel: "bg-rose-300/5", text: "text-rose-200", meter: "bg-rose-300", doneBg: "bg-rose-300/8" },
  { border: "border-emerald-300/25", panel: "bg-emerald-300/5", text: "text-emerald-200", meter: "bg-emerald-300", doneBg: "bg-emerald-300/8" },
  { border: "border-orange-300/25", panel: "bg-orange-300/5", text: "text-orange-200", meter: "bg-orange-300", doneBg: "bg-orange-300/8" },
  { border: "border-sky-300/25", panel: "bg-sky-300/5", text: "text-sky-200", meter: "bg-sky-300", doneBg: "bg-sky-300/8" },
  { border: "border-violet-300/25", panel: "bg-violet-300/5", text: "text-violet-200", meter: "bg-violet-300", doneBg: "bg-violet-300/8" },
] as const;

const JOURNEY_BY_ID = new Map(JOURNEY_MAP.map((e) => [e.id, e]));
const ALL_EXPERIENCES = ECOSYSTEM_PHASES.flatMap((p) => p.experiences);

function Destination({ exp, className, children }: { exp: EcosystemExperience; className?: string; children: React.ReactNode }) {
  const entry = JOURNEY_BY_ID.get(exp.id);
  if (!entry) return <div className={className}>{children}</div>;
  if (entry.isExternal || entry.url.startsWith("http")) {
    return (
      <a href={entry.url} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={entry.url} className={className}>
      {children}
    </Link>
  );
}

function isExternal(exp: EcosystemExperience) {
  const entry = JOURNEY_BY_ID.get(exp.id);
  return !!entry && (entry.isExternal || entry.url.startsWith("http"));
}

export function EcosystemMap() {
  const { completed } = useJourneyProgress();
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  const total = ALL_EXPERIENCES.length;
  const done = ALL_EXPERIENCES.filter((e) => completed.has(e.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const nextRecommended = ALL_EXPERIENCES.find((e) => !completed.has(e.id));

  const toggle = (n: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  return (
    <div className="min-h-screen bg-[#0A0A10] text-[#F5F0E0]">
      <nav className="mx-auto flex max-w-300 items-center justify-between px-5 pt-6 font-mono text-xs tracking-widest uppercase sm:px-8">
        <Link href="/find-your-me" className="text-brand-gold-light">
          Find Your Me
        </Link>
        <div className="flex gap-6 text-[#F5F0E0]/50">
          <Link href="/find-your-me" className="hover:text-brand-gold-light">
            Back to Portal
          </Link>
          <Link href="/" className="hover:text-brand-gold-light">
            TonyG Home
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-225 px-5 pt-16 pb-10 text-center sm:px-8 sm:pt-24">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold-light/20 bg-brand-gold-light/6 px-3 py-1 font-mono text-[0.65rem] tracking-[0.16em] text-brand-gold-light uppercase">
          <MapPinned aria-hidden="true" className="size-3.5" />
          The Ecosystem Map
        </div>
        <h1 className="font-heading text-4xl leading-[1.05] sm:text-6xl">
          Your Journey Through
          <br />
          <span className="text-brand-gold-light italic">Self-Discovery</span>
        </h1>
        <p className="mx-auto mt-6 max-w-150 text-lg leading-8 text-[#F5F0E0]/60">
          {total} experiences across 6 phases. Each one reveals a different facet. Together, they build a comprehensive
          map of who you actually are.
        </p>

        <div className="mx-auto mt-8 max-w-125">
          <div className="mb-2 flex items-center justify-between font-mono text-xs text-[#F5F0E0]/55">
            <span>
              {done} of {total} completed
            </span>
            <span className="text-brand-gold-light">{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-brand-gold-light/10">
            {/* Width is runtime state — the one legitimate `style` exception. */}
            <div
              className="h-full rounded-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {nextRecommended && (
          <div className="mt-6 font-mono text-xs tracking-[0.08em] text-[#F5F0E0]/45 uppercase">
            Recommended Next:
            <Destination
              exp={nextRecommended}
              className="ml-3 inline-flex items-center gap-1 border-b border-brand-gold-light/35 pb-1 text-brand-gold-light normal-case"
            >
              {nextRecommended.name} ({nextRecommended.time})
              <ArrowRight aria-hidden="true" className="size-3" />
            </Destination>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-225 space-y-5 px-5 pb-12 sm:px-8">
        {ECOSYSTEM_PHASES.map((phase, index) => {
          const s = PHASE_STYLES[index] ?? PHASE_STYLES[0];
          const open = !collapsed.has(phase.number);
          const phaseDone = phase.experiences.filter((e) => completed.has(e.id)).length;
          const phasePct = Math.round((phaseDone / phase.experiences.length) * 100);
          const panelId = `phase-${phase.number}`;
          return (
            <section key={phase.number} className={cn("overflow-hidden rounded-2xl border", s.border, s.panel)}>
              <button
                type="button"
                onClick={() => toggle(phase.number)}
                aria-expanded={open}
                aria-controls={panelId}
                className="w-full bg-[#111018] px-5 py-5 text-left transition-colors hover:bg-[#1A1822] sm:px-7"
              >
                <span className="flex w-full items-start gap-4">
                  <span className={cn("font-heading text-3xl leading-none", s.text)}>
                    {String(phase.number).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-3">
                      <span className="font-heading text-2xl">{phase.title}</span>
                      {phasePct === 100 && (
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 font-mono text-[0.58rem] tracking-[0.12em] uppercase",
                            s.border,
                            s.text,
                          )}
                        >
                          Complete
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-sm text-[#F5F0E0]/50 italic">{phase.subtitle}</span>
                    <span className="mt-4 flex max-w-60 items-center gap-3">
                      <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
                        <span className={cn("block h-full rounded-full", s.meter)} style={{ width: `${phasePct}%` }} />
                      </span>
                      <span className="font-mono text-[0.65rem] text-[#F5F0E0]/45">
                        {phaseDone}/{phase.experiences.length}
                      </span>
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn("mt-1 size-5 shrink-0 text-[#F5F0E0]/45 transition-transform", open && "rotate-180")}
                  />
                </span>
              </button>

              <div id={panelId} className={cn("px-5 pb-6 sm:px-7", !open && "hidden")}>
                <p className="mt-2 max-w-165 text-sm leading-7 text-[#F5F0E0]/55 sm:ml-15">{phase.description}</p>
                <div className="mt-5 grid gap-3 sm:ml-15">
                  {phase.experiences.map((exp) => {
                    const isDone = completed.has(exp.id);
                    const external = isExternal(exp);
                    return (
                      <Destination
                        key={exp.id}
                        exp={exp}
                        className={cn(
                          "group flex items-start gap-4 rounded-xl border border-white/7 p-4 transition-colors hover:border-brand-gold-light/30",
                          isDone ? s.doneBg : "bg-white/2 hover:bg-white/5",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                            isDone ? "border-brand-gold-light bg-brand-gold-light text-[#0A0A10]" : "border-white/20",
                          )}
                        >
                          {isDone && <Check aria-label="Completed" className="size-3" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "flex items-center gap-2 text-sm font-semibold",
                              isDone ? "text-brand-gold-light line-through" : "text-[#F5F0E0]",
                            )}
                          >
                            {exp.name}
                            {external && <ExternalLink aria-label="Opens an external site" className="size-3" />}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-[#F5F0E0]/50">{exp.description}</span>
                        </span>
                        <span className="shrink-0 font-mono text-[0.65rem] text-[#F5F0E0]/40">{exp.time}</span>
                      </Destination>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </section>

      <section className="mx-auto max-w-225 px-5 pb-10 sm:px-8">
        <JourneyTracker variant="dark" />
      </section>

      <section className="border-y border-brand-gold-light/10 bg-white/2 px-5 py-14 text-center sm:px-8">
        <p className="font-mono text-[0.65rem] tracking-[0.15em] text-[#F5F0E0]/40 uppercase">Total Journey Estimate</p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-12 gap-y-5">
          {[
            { num: String(total), label: "Experiences" },
            { num: "6", label: "Phases" },
            { num: "~2.5", label: "Hours Total" },
            { num: "5", label: "Categories" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-heading text-4xl text-brand-gold-light">{stat.num}</div>
              <div className="mt-1 font-mono text-[0.6rem] tracking-[0.12em] text-[#F5F0E0]/40 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 text-center sm:px-8">
        <h2 className="font-heading text-3xl">Ready to begin?</h2>
        <p className="mt-3 text-[#F5F0E0]/55">Start anywhere. The journey meets you where you are.</p>
        <div className="mt-6">
          {nextRecommended ? (
            <Destination
              exp={nextRecommended}
              className="inline-flex items-center gap-2 rounded-md bg-brand-gold-light px-6 py-3 font-mono text-xs tracking-wider text-[#0A0A10] uppercase hover:opacity-90"
            >
              Continue: {nextRecommended.name} <ArrowRight aria-hidden="true" className="size-3.5" />
            </Destination>
          ) : (
            <span className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-brand-gold-light uppercase">
              Journey Complete <Check aria-hidden="true" className="size-3.5" />
            </span>
          )}
        </div>
        <Link
          href="/find-your-me"
          className="mt-5 block font-mono text-xs tracking-wider text-[#F5F0E0]/40 uppercase hover:text-brand-gold-light"
        >
          Back to Portal
        </Link>
        <p className="mt-14 font-heading text-lg text-[#F5F0E0]/60 italic">The resistance is the roadmap.</p>
        <p className="mt-2 font-mono text-[0.6rem] tracking-[0.12em] text-[#F5F0E0]/30 uppercase">
          Part of the Find Your Me Ecosystem by Tony Greenberg
        </p>
      </section>
    </div>
  );
}
