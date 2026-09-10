"use client";

import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Check,
  Compass,
  ExternalLink,
  Grid2X2,
  Heart,
  HeartPulse,
  ListTree,
  Sparkles,
  Utensils,
} from "lucide-react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import {
  JOURNEY_MAP,
  useJourneyProgress,
  type JourneyExperience,
} from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/MyJourney.tsx — "the personal
// control center for the Find Your ___ ecosystem," per its own file
// header. Uses this migration's real, already-built, already-broadly-used
// `useJourneyProgress`/`JOURNEY_MAP` (journey-tracker.tsx) completion
// tracking — the SAME mechanism every "Find Your X" quiz's own
// `markComplete(...)` call already writes to on finish — not the newer
// `tg_assessment_results` cookie built for `/self-portrait` (a different,
// narrower log that only ~13 assessments opt into). Legacy's real
// per-assessment result cache (`RESULT_KEYS`, one localStorage key per
// quiz, feeding `ResultCard`'s inline "your archetype" text + a
// `MiniRadar` SVG) is NOT ported: every quiz component in this migration
// already dropped that exact write during its own Phase 9 port (see e.g.
// `find-your-diet-quiz.tsx`'s and `find-your-love-language-quiz.tsx`'s own
// port notes — "not ported since there's no auth/DB sync in this
// migration yet") — the data channel `ResultCard` depended on simply
// doesn't exist here, the same honest-degradation call `/self-portrait`
// already made about its own composite radar. What's left after dropping
// that dead channel is exactly legacy's own "completed, no stored result"
// fallback copy ("Completed. Retake to see detailed results here.") —
// ported verbatim, just as the only real case that can occur here.
type Category = JourneyExperience["category"];

// Full border/bg/dot classes per category, precomposed as complete
// literal strings (not assembled from fragments at the JSX call site,
// per this repo's dynamic-class rule). Text-color hexes match
// journey-tracker.tsx's own CATEGORY_META exactly, so a category reads
// the same color everywhere in the app; that file only exports
// text-only classes, so the border/bg/dot variants this page also needs
// are defined here instead of duplicated there.
const CATEGORY_STYLES: Record<
  Category,
  {
    label: string;
    Icon: LucideIcon;
    textClass: string;
    borderClass: string;
    bgClass: string;
    dotClass: string;
  }
> = {
  know: {
    label: "Know Thyself",
    Icon: Compass,
    textClass: "text-brand-gold-light",
    borderClass: "border-brand-gold-light/30",
    bgClass: "bg-brand-gold-light/10",
    dotClass: "bg-brand-gold-light",
  },
  love: {
    label: "Love & Belonging",
    Icon: Heart,
    textClass: "text-[#C97B7B]",
    borderClass: "border-[#C97B7B]/30",
    bgClass: "bg-[#C97B7B]/10",
    dotClass: "bg-[#C97B7B]",
  },
  body: {
    label: "Body & Temple",
    Icon: HeartPulse,
    textClass: "text-[#7BC9A4]",
    borderClass: "border-[#7BC9A4]/30",
    bgClass: "bg-[#7BC9A4]/10",
    dotClass: "bg-[#7BC9A4]",
  },
  taste: {
    label: "Taste & Ritual",
    Icon: Utensils,
    textClass: "text-[#C9A87B]",
    borderClass: "border-[#C9A87B]/30",
    bgClass: "bg-[#C9A87B]/10",
    dotClass: "bg-[#C9A87B]",
  },
  mind: {
    label: "Mind & Systems",
    Icon: Brain,
    textClass: "text-[#7BA8C9]",
    borderClass: "border-[#7BA8C9]/30",
    bgClass: "bg-[#7BA8C9]/10",
    dotClass: "bg-[#7BA8C9]",
  },
};

const CATEGORY_ORDER: Category[] = ["know", "love", "body", "taste", "mind"];

const CHIP_ACTIVE =
  "rounded-md border border-brand-gold-light/15 bg-brand-gold-light/8 px-2.5 py-1 font-mono text-[0.5rem] tracking-[0.1em] text-brand-gold-light uppercase";
const CHIP_INACTIVE =
  "rounded-md border border-transparent px-2.5 py-1 font-mono text-[0.5rem] tracking-[0.1em] text-[#E8E4DC]/25 uppercase";

// Ported from legacy JOURNEY_PHASES, with one real completeness fix:
// legacy's 6 phases only ever accounted for 26 of JOURNEY_MAP's ids.
// Soulscore and Find Your Peptide were both added to JOURNEY_MAP after
// this legacy page was written (see journey-tracker.tsx's own port note
// on the real 28-entry list) and fell through every phase — under a
// verbatim port they'd silently never appear in Timeline view below.
// Added Soulscore to Phase 1 (a self-knowledge score, same theme as its
// phase-mates) and Find Your Peptide to Phase 3 (body chemistry, same
// theme as its phase-mates) so Timeline view actually covers all 28 real
// experiences, not 26.
const JOURNEY_PHASES: { phase: number; title: string; subtitle: string; ids: string[] }[] = [
  {
    phase: 1,
    title: "The Reckoning",
    subtitle: "Who you are right now",
    ids: ["find-your-me", "find-your-mirror", "find-your-score", "soulscore"],
  },
  {
    phase: 2,
    title: "The Deepening",
    subtitle: "What drives you beneath the surface",
    ids: ["find-your-purpose", "find-your-level", "find-your-spirit"],
  },
  {
    phase: 3,
    title: "The Body Knows",
    subtitle: "What your chemistry is telling you",
    ids: [
      "find-your-chemistry",
      "find-your-water",
      "find-your-diet",
      "find-your-movement",
      "find-your-sleep",
      "find-your-peptide",
    ],
  },
  {
    phase: 4,
    title: "The Connections",
    subtitle: "How you love and who you build with",
    ids: [
      "find-your-partner",
      "find-your-tribe",
      "find-your-team",
      "find-your-attachment",
      "find-your-love-language",
    ],
  },
  {
    phase: 5,
    title: "The Rituals",
    subtitle: "What you pour, sip, and savor",
    ids: [
      "find-your-mezcal",
      "find-your-tequila",
      "find-your-sake",
      "find-your-coffee",
      "find-your-kitchen",
    ],
  },
  {
    phase: 6,
    title: "The Integration",
    subtitle: "Systems for the whole self",
    ids: [
      "find-your-blueprint",
      "find-your-capital",
      "find-your-therapy",
      "find-your-religion",
      "find-your-style",
    ],
  },
];

function ExperienceCard({
  experience,
  isCompleted,
}: {
  experience: JourneyExperience;
  isCompleted: boolean;
}) {
  const cat = CATEGORY_STYLES[experience.category];
  const CategoryIcon = cat.Icon;
  const statusCopy = isCompleted
    ? experience.isExternal
      ? "Marked as visited. Results stored on the external site."
      : "Completed. Retake to see detailed results here."
    : `${experience.questionCount ? `${experience.questionCount} questions · ` : ""}~${experience.estimatedMinutes} min`;
  const actionLabel = isCompleted
    ? experience.isExternal
      ? "Visit Again"
      : "Retake"
    : experience.isExternal
      ? "Begin"
      : "Begin";
  const actionClass = `inline-flex items-center gap-1 rounded-md border px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.1em] uppercase ${
    isCompleted ? "border-white/10 text-[#E8E4DC]/40" : `${cat.borderClass} ${cat.textClass}`
  }`;

  return (
    <div
      className={`rounded-2xl border p-6 transition-colors ${isCompleted ? `${cat.borderClass} bg-brand-gold-light/[0.04]` : "border-white/5 bg-white/[0.02]"}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={`inline-flex items-center gap-1 font-mono text-[0.55rem] tracking-[0.15em] uppercase opacity-70 ${cat.textClass}`}
          >
            <CategoryIcon aria-hidden="true" className="size-3" />
            {cat.label}
          </span>
          <h3 className="mt-1 font-heading text-[1.1rem] leading-tight font-bold text-[#E8E4DC]">
            {experience.name}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[0.5rem] tracking-[0.15em] uppercase ${
            isCompleted
              ? `${cat.borderClass} ${cat.bgClass} ${cat.textClass}`
              : "border-white/5 bg-white/5 text-[#E8E4DC]/30"
          }`}
        >
          {isCompleted ? (
            <span className="inline-flex items-center gap-1">
              <Check aria-hidden="true" className="size-3" /> Complete
            </span>
          ) : (
            "Not Started"
          )}
        </span>
      </div>

      <p className="mb-0 text-[0.85rem] leading-relaxed text-[#E8E4DC]/50">{statusCopy}</p>

      <div className="mt-4">
        {experience.isExternal ? (
          <a
            href={experience.url}
            target="_blank"
            rel="noopener noreferrer"
            className={actionClass}
          >
            {actionLabel} <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        ) : (
          <Link href={experience.url} className={actionClass}>
            {actionLabel} <ForwardIcon />
          </Link>
        )}
      </div>
    </div>
  );
}

function PhaseTimeline({ completed }: { completed: Set<string> }) {
  return (
    <div className="relative pl-8">
      <div className="absolute top-2 bottom-2 left-2 w-px bg-linear-to-b from-brand-gold-light to-brand-gold-light/10" />
      <div className="flex flex-col gap-8">
        {JOURNEY_PHASES.map((phase) => {
          const experiences = phase.ids
            .map((id) => JOURNEY_MAP.find((e) => e.id === id))
            .filter((e): e is JourneyExperience => Boolean(e));
          const done = experiences.filter((e) => completed.has(e.id)).length;
          const total = experiences.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isComplete = pct === 100;
          const isActive = pct > 0 && pct < 100;

          return (
            <div key={phase.phase} className="relative">
              <div
                className={`absolute top-0.5 -left-8 flex size-[18px] items-center justify-center rounded-full border-2 font-mono text-[0.5rem] font-bold ${
                  isComplete
                    ? "border-brand-gold-light bg-brand-gold-light text-[#0A0A10]"
                    : isActive
                      ? "border-brand-gold-light bg-brand-gold-light/30 text-brand-gold-light"
                      : "border-brand-gold-light/15 bg-brand-gold-light/8 text-brand-gold-light"
                }`}
              >
                {isComplete ? <Check aria-hidden="true" className="size-3" /> : phase.phase}
              </div>

              <div className="mb-1 flex items-baseline gap-2">
                <span className="font-mono text-[0.55rem] tracking-[0.15em] text-brand-gold-light/40 uppercase">
                  Phase {phase.phase}
                </span>
                <span
                  className={`font-mono text-[0.55rem] ${isComplete ? "text-brand-gold-light" : "text-[#E8E4DC]/30"}`}
                >
                  {done}/{total}
                </span>
              </div>
              <h4
                className={`mb-0.5 font-heading text-base font-bold ${
                  isComplete
                    ? "text-brand-gold-light"
                    : isActive
                      ? "text-[#E8E4DC]"
                      : "text-[#E8E4DC]/40"
                }`}
              >
                {phase.title}
              </h4>
              <p className="mb-2 text-[0.8rem] text-[#E8E4DC]/35 italic">{phase.subtitle}</p>

              <div className="h-[3px] max-w-50 overflow-hidden rounded-full bg-brand-gold-light/8">
                <div
                  className="h-full rounded-full bg-linear-to-r from-brand-gold-light/40 to-brand-gold-light transition-[width] duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MyJourneyDashboard() {
  const { completed, stats } = useJourneyProgress();
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [filterCategory, setFilterCategory] = useState<"all" | Category>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "done" | "todo">("all");

  const filteredExperiences = useMemo(() => {
    return JOURNEY_MAP.filter((e) => {
      if (filterCategory !== "all" && e.category !== filterCategory) return false;
      if (filterStatus === "done" && !completed.has(e.id)) return false;
      if (filterStatus === "todo" && completed.has(e.id)) return false;
      return true;
    });
  }, [filterCategory, filterStatus, completed]);

  // Real bug fixed vs. legacy: legacy's "No experiences match your
  // filters" empty state rendered unconditionally below both view modes,
  // even though `filteredExperiences` is only ever used by Grid view —
  // Timeline always renders every phase regardless of the category/status
  // filters. Switching to Timeline while filtered down to zero grid
  // results left a misleading "no matches" message sitting under a fully
  // populated, unfiltered timeline. Gated on `viewMode === "grid"` here.
  const nextRecommended = useMemo(() => {
    for (const phase of JOURNEY_PHASES) {
      for (const id of phase.ids) {
        if (!completed.has(id)) {
          const found = JOURNEY_MAP.find((e) => e.id === id);
          if (found) return found;
        }
      }
    }
    return null;
  }, [completed]);

  const timeInvested = useMemo(
    () =>
      JOURNEY_MAP.filter((e) => completed.has(e.id)).reduce(
        (sum, e) => sum + e.estimatedMinutes,
        0,
      ),
    [completed],
  );

  const ringCircumference = 2 * Math.PI * 52;
  const ringOffset = ringCircumference * (1 - stats.pct / 100);

  const statTiles = [
    { label: "Completed", value: `${stats.done}`, sub: `of ${stats.total}` },
    { label: "Remaining", value: `${stats.remaining}`, sub: `~${stats.minutesRemaining} min` },
    { label: "Time Invested", value: `${timeInvested}`, sub: "minutes" },
    { label: "Categories", value: `${CATEGORY_ORDER.length}`, sub: "dimensions" },
  ];

  return (
    <div className="relative z-1 min-h-screen">
      <ThemedBackground theme="journey" />

      <div className="relative z-1 min-h-screen bg-[#0A0A10] pb-16 text-[#E8E4DC]">
        <header className="mx-auto max-w-300 px-6 pt-[clamp(6rem,10vw,8rem)] pb-6">
          <Link
            href="/find-your-me"
            className="mb-6 inline-flex items-center gap-1 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold-light/50 uppercase"
          >
            <BackIcon aria-hidden="true" /> Back to Find Your Me
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="mb-2 font-heading text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-bold text-[#E8E4DC]">
                My Journey
              </h1>
              <p className="max-w-130 text-base leading-relaxed text-[#E8E4DC]/50">
                Every question answered is a mirror held up. Every result, a compass point. This is
                your map of self-discovery — incomplete, evolving, honest.
              </p>
            </div>

            <div className="text-center">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="rgba(212,185,106,0.08)"
                  strokeWidth="6"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#D4B96A"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 60 60)"
                  className="transition-[stroke-dashoffset] duration-1000 ease-out"
                />
                <text
                  x="60"
                  y="58"
                  textAnchor="middle"
                  fill="#D4B96A"
                  className="font-heading text-[1.8rem] font-bold"
                >
                  {stats.pct}%
                </text>
                <text
                  x="60"
                  y="76"
                  textAnchor="middle"
                  fill="rgba(232,228,220,0.4)"
                  className="font-mono text-[0.5rem] tracking-[0.1em] uppercase"
                >
                  Complete
                </text>
              </svg>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-300 px-6">
          <div className="mb-8 grid grid-cols-2 gap-4 border-y border-brand-gold-light/10 py-6 sm:grid-cols-4">
            {statTiles.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl leading-none font-bold text-brand-gold-light">
                  {stat.value}
                </div>
                <div className="mt-1 font-mono text-[0.55rem] tracking-[0.15em] text-[#E8E4DC]/40 uppercase">
                  {stat.label}
                </div>
                <div className="text-[0.75rem] text-[#E8E4DC]/25">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {nextRecommended && (
          <div className="mx-auto mb-8 max-w-300 px-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-gold-light/15 bg-linear-to-br from-brand-gold-light/8 to-brand-gold/4 px-8 py-6">
              <div>
                <span className="font-mono text-[0.55rem] tracking-[0.2em] text-brand-gold-light/50 uppercase">
                  Recommended Next
                </span>
                <h3 className="mt-1 mb-0.5 font-heading text-xl font-bold text-[#E8E4DC]">
                  {nextRecommended.name}
                </h3>
                <p className="mb-0 text-[0.85rem] text-[#E8E4DC]/40">
                  {nextRecommended.questionCount
                    ? `${nextRecommended.questionCount} questions · `
                    : ""}
                  ~{nextRecommended.estimatedMinutes} min ·{" "}
                  {CATEGORY_STYLES[nextRecommended.category].label}
                </p>
              </div>
              {nextRecommended.isExternal ? (
                <a
                  href={nextRecommended.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-linear-to-br from-brand-gold to-brand-gold-light px-6 py-2.5 font-mono text-[0.65rem] font-bold tracking-[0.1em] text-[#0A0A10] uppercase"
                >
                  Begin <ExternalLink aria-hidden="true" className="size-3" />
                </a>
              ) : (
                <Link
                  href={nextRecommended.url}
                  className="rounded-lg bg-linear-to-br from-brand-gold to-brand-gold-light px-6 py-2.5 font-mono text-[0.65rem] font-bold tracking-[0.1em] text-[#0A0A10] uppercase"
                >
                  Begin <ForwardIcon aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="mx-auto mb-4 flex max-w-300 flex-wrap items-center justify-between gap-3 px-6">
          <div className="flex gap-2">
            {(["grid", "timeline"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded-md border px-3.5 py-1.5 font-mono text-[0.6rem] tracking-[0.1em] uppercase ${
                  viewMode === mode
                    ? "border-brand-gold-light/20 bg-brand-gold-light/10 text-brand-gold-light"
                    : "border-white/5 text-[#E8E4DC]/30"
                }`}
              >
                {mode === "grid" ? (
                  <span className="inline-flex items-center gap-1">
                    <Grid2X2 aria-hidden="true" className="size-3" /> Grid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <ListTree aria-hidden="true" className="size-3" /> Timeline
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterCategory("all")}
              className={filterCategory === "all" ? CHIP_ACTIVE : CHIP_INACTIVE}
            >
              All
            </button>
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={filterCategory === cat ? CHIP_ACTIVE : CHIP_INACTIVE}
              >
                {CATEGORY_STYLES[cat].label}
              </button>
            ))}
            <span className="mx-1 h-4 w-px bg-brand-gold-light/10" />
            {(["all", "done", "todo"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={filterStatus === s ? CHIP_ACTIVE : CHIP_INACTIVE}
              >
                {s === "all" ? "All" : s === "done" ? "Done" : "To Do"}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-300 px-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredExperiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} isCompleted={completed.has(exp.id)} />
              ))}
            </div>
          ) : (
            <PhaseTimeline completed={completed} />
          )}

          {viewMode === "grid" && filteredExperiences.length === 0 && (
            <p className="py-16 text-center font-heading text-lg text-[#E8E4DC]/30 italic">
              No experiences match your filters.
            </p>
          )}
        </div>

        {stats.pct === 100 && (
          <div className="mx-auto mt-12 max-w-170 px-6 text-center">
            <div className="rounded-[20px] border border-brand-gold-light/20 bg-linear-to-br from-brand-gold-light/10 to-brand-gold/5 px-8 py-12">
              <Sparkles aria-hidden="true" className="mx-auto mb-4 size-10 text-brand-gold-light" />
              <h2 className="mb-3 font-heading text-2xl font-bold text-brand-gold-light">
                You Found Yourself
              </h2>
              <p className="mx-auto mb-6 max-w-130 text-base leading-relaxed text-[#E8E4DC]/60">
                Every dimension explored. Every mirror faced. Every question answered honestly. The
                map is complete — but the territory keeps unfolding. Come back anytime. The answers
                evolve as you do.
              </p>
              <Link
                href="/find-your-me"
                className="inline-block rounded-lg border border-brand-gold-light/30 px-6 py-2.5 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold-light uppercase"
              >
                Return to Find Your Me <ForwardIcon aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        <footer className="mx-auto mt-12 max-w-300 border-t border-brand-gold-light/8 px-6 pt-8 text-center">
          <p className="mb-4 font-heading text-[0.9rem] text-[#E8E4DC]/30 italic">
            &ldquo;The unexamined life is not worth living — but the over-examined life needs a
            dashboard.&rdquo;
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/find-your-me"
              className="font-mono text-[0.6rem] tracking-[0.1em] text-brand-gold-light/40 uppercase"
            >
              Find Your Me
            </Link>
            {/* Real fix: legacy linked here to "/ecosystem-map", a page
                that doesn't exist in this migration yet (it's a distinct,
                still-unbuilt legacy page — EcosystemMap.tsx — not a
                synonym for this one; already a known dead link elsewhere,
                see site-nav-data.ts's own "Ecosystem Map" nav item and the
                two quiz "Journey Continues" cross-links). Repointed to the
                real, live `/self-portrait` — the closest actual "see what
                you've completed" page — rather than shipping a new 404. */}
            <Link
              href="/self-portrait"
              className="font-mono text-[0.6rem] tracking-[0.1em] text-brand-gold-light/40 uppercase"
            >
              Self-Portrait
            </Link>
            <Link
              href="/"
              className="font-mono text-[0.6rem] tracking-[0.1em] text-brand-gold-light/40 uppercase"
            >
              Home
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
