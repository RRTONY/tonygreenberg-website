"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

// Ported from legacy client/src/components/JourneyTracker.tsx — a
// universal progress tracker across all 25 real "Find Your X" experiences
// in the ecosystem, shown on assessment results pages. Real experience
// list, categories, and localStorage-based completion tracking unchanged
// — including the 6 external sibling sites (Mezcal/Tequila/water/
// chemistry/partner/capital tools on their own manus.space subdomains,
// same "real external sibling product" treatment already established for
// SoulSmoke/LiquidSun in `brewsoul-config.ts`; all 6 confirmed live
// before porting). Legacy's `trpc.journey.*` DB sync (mark-complete,
// toggle, cross-device sync via `useAuth`) isn't ported — there's no
// auth/backend for it yet in this migration, same honest-degradation
// pattern used throughout (progress still tracks correctly per-browser
// via localStorage, it just doesn't sync across devices until Supabase
// auth exists).
export interface JourneyExperience {
  id: string;
  name: string;
  category: "know" | "love" | "body" | "taste" | "mind";
  url: string;
  estimatedMinutes: number;
  isExternal: boolean;
  questionCount?: number;
}

export const JOURNEY_MAP: JourneyExperience[] = [
  { id: "find-your-me", name: "Find Your Me", category: "know", url: "/find-your-me", estimatedMinutes: 3, isExternal: false, questionCount: 5 },
  { id: "find-your-purpose", name: "Find Your Purpose", category: "know", url: "/dharma-finder", estimatedMinutes: 12, isExternal: false, questionCount: 25 },
  { id: "find-your-mirror", name: "Find Your Mirror", category: "know", url: "/the-mirror", estimatedMinutes: 4, isExternal: false, questionCount: 18 },
  { id: "find-your-level", name: "Find Your Level", category: "know", url: "/consciousness-scale", estimatedMinutes: 12, isExternal: false, questionCount: 25 },
  { id: "find-your-score", name: "Find Your Score", category: "know", url: "/grant-study", estimatedMinutes: 12, isExternal: false, questionCount: 25 },
  { id: "soulscore", name: "SoulScore", category: "know", url: "/soulscore", estimatedMinutes: 10, isExternal: false },
  { id: "find-your-spirit", name: "Find Your Spirit", category: "know", url: "/find-your-spirit", estimatedMinutes: 18, isExternal: false, questionCount: 35 },
  { id: "find-your-partner", name: "Find Your Partner", category: "love", url: "https://intimacyassess-tcir3hon.manus.space", estimatedMinutes: 10, isExternal: true, questionCount: 15 },
  { id: "find-your-tribe", name: "Find Your Tribe", category: "love", url: "/community", estimatedMinutes: 5, isExternal: false },
  { id: "find-your-team", name: "Find Your Team", category: "love", url: "/flow-circuit", estimatedMinutes: 8, isExternal: false },
  { id: "find-your-attachment", name: "Find Your Attachment Style", category: "love", url: "/find-your-attachment-style", estimatedMinutes: 10, isExternal: false, questionCount: 18 },
  { id: "find-your-love-language", name: "Find Your Love Language", category: "love", url: "/find-your-love-language", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-religion", name: "Find Your Religion", category: "mind", url: "/find-your-religion", estimatedMinutes: 20, isExternal: false, questionCount: 20 },
  { id: "find-your-chemistry", name: "Find Your Chemistry", category: "body", url: "https://regenhealth-4nns6jnd.manus.space", estimatedMinutes: 8, isExternal: true },
  { id: "find-your-water", name: "Find Your Water", category: "body", url: "https://aqwaterqpr-wvzsc3ph.manus.space", estimatedMinutes: 5, isExternal: true },
  { id: "find-your-diet", name: "Find Your Diet", category: "body", url: "/find-your-diet", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-movement", name: "Find Your Movement", category: "body", url: "/find-your-movement", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-sleep", name: "Find Your Sleep", category: "body", url: "/find-your-sleep", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-mezcal", name: "Find Your Mezcal", category: "taste", url: "https://mezcalagave-ahru9fq8.manus.space", estimatedMinutes: 5, isExternal: true },
  { id: "find-your-tequila", name: "Find Your Tequila", category: "taste", url: "https://tequilaazul-fxqrr3js.manus.space", estimatedMinutes: 5, isExternal: true },
  { id: "find-your-sake", name: "Find Your Sake", category: "taste", url: "/find-your-sake", estimatedMinutes: 8, isExternal: false, questionCount: 20 },
  { id: "find-your-coffee", name: "Find Your Coffee", category: "taste", url: "/find-your-coffee", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-kitchen", name: "Find Your Kitchen", category: "taste", url: "/find-your-kitchen", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-blueprint", name: "Find Your Blueprint", category: "mind", url: "/living-declaration", estimatedMinutes: 8, isExternal: false },
  { id: "find-your-capital", name: "Find Your Capital", category: "mind", url: "https://portfoliofamilyoffice.manus.space", estimatedMinutes: 5, isExternal: true },
  { id: "find-your-therapy", name: "Find Your Therapy", category: "mind", url: "/find-your-therapy", estimatedMinutes: 12, isExternal: false, questionCount: 25 },
  { id: "find-your-style", name: "Find Your Style", category: "mind", url: "/find-your-style", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-peptide", name: "Find Your Peptide", category: "body", url: "/find-your-peptide", estimatedMinutes: 8, isExternal: false, questionCount: 10 },
];

const STORAGE_KEY = "findyour_journey_progress";

const CATEGORY_META: Record<string, { label: string; textClass: string }> = {
  know: { label: "Know Thyself", textClass: "text-brand-gold-light" },
  love: { label: "Love & Belonging", textClass: "text-[#C97B7B]" },
  body: { label: "Body & Temple", textClass: "text-[#7BC9A4]" },
  taste: { label: "Taste & Ritual", textClass: "text-[#C9A87B]" },
  mind: { label: "Mind & Systems", textClass: "text-[#7BA8C9]" },
};

const EMPTY_SET: ReadonlySet<string> = new Set();
const storeListeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedSet: Set<string> = new Set();

function readStore(): Set<string> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedSet;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedSet = new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    cachedSet = new Set();
  }
  return cachedSet;
}

function writeStore(next: Set<string>) {
  cachedRaw = JSON.stringify(Array.from(next));
  cachedSet = next;
  localStorage.setItem(STORAGE_KEY, cachedRaw);
  storeListeners.forEach((listener) => listener());
}

function subscribeStore(listener: () => void) {
  storeListeners.add(listener);
  return () => storeListeners.delete(listener);
}

// `completed` is read through `useSyncExternalStore` rather than
// `useEffect` + `setState` — the latter is exactly the "read an external
// system into React state inside an effect" pattern this repo's own
// `react-hooks/set-state-in-effect` lint rule flags (see
// `theme-toggle.tsx`'s `useMounted` for the same idiom already
// established here). `getServerSnapshot` returns a stable empty Set so
// SSR and the client's first hydration pass agree; the real localStorage
// value only appears once React knows it's safe, with no manual mount
// gating required.
export function useJourneyProgress() {
  const completed = useSyncExternalStore(subscribeStore, readStore, () => EMPTY_SET as Set<string>);

  const markComplete = useCallback((id: string) => {
    const next = new Set(readStore());
    next.add(id);
    writeStore(next);
  }, []);

  const toggleComplete = useCallback((id: string) => {
    const next = new Set(readStore());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeStore(next);
  }, []);

  const stats = useMemo(() => {
    const total = JOURNEY_MAP.length;
    const done = JOURNEY_MAP.filter((e) => completed.has(e.id)).length;
    const remaining = JOURNEY_MAP.filter((e) => !completed.has(e.id));
    const minutesRemaining = remaining.reduce((sum, e) => sum + e.estimatedMinutes, 0);
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, remaining: total - done, minutesRemaining, pct };
  }, [completed]);

  return { completed, markComplete, toggleComplete, stats };
}

export function JourneyTracker({
  variant = "dark",
  currentAssessmentId,
  compact = false,
}: {
  variant?: "dark" | "light";
  currentAssessmentId?: string;
  compact?: boolean;
}) {
  const { completed, toggleComplete, stats } = useJourneyProgress();
  const [expanded, setExpanded] = useState(false);
  const isDark = variant === "dark";

  const grouped = useMemo(() => {
    const groups: Record<string, JourneyExperience[]> = {};
    for (const exp of JOURNEY_MAP) {
      (groups[exp.category] ??= []).push(exp);
    }
    return groups;
  }, []);

  const shellClass = isDark
    ? "border border-brand-gold-light/15 bg-[#0A0A10]/70 backdrop-blur-xl"
    : "border border-brand-gold-light/30 bg-background/95 backdrop-blur-xl";
  const textPrimaryClass = isDark ? "text-brand-gold-light" : "text-brand-gold";
  const textSecondaryClass = isDark ? "text-[#E8E4DC]/50" : "text-[#666]";
  const textMutedClass = isDark ? "text-[#E8E4DC]/30" : "text-[#999]";
  const trackClass = isDark ? "bg-brand-gold-light/8" : "bg-brand-gold/8";

  if (compact) {
    return (
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full cursor-pointer rounded-xl px-5 py-4 text-left ${shellClass}`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className={`font-mono text-[0.6rem] tracking-[0.2em] uppercase ${textPrimaryClass}`}>
            Your Journey
          </span>
          <span className={`font-mono text-[0.7rem] ${textSecondaryClass}`}>
            {stats.done}/{stats.total} · {stats.pct}%
          </span>
        </div>
        <div className={`h-1 overflow-hidden rounded-full ${trackClass}`}>
          <div
            className="h-full rounded-full bg-linear-to-r from-brand-gold-light/30 to-brand-gold-light transition-[width] duration-500"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
        {stats.remaining > 0 ? (
          <p className={`mt-1.5 mb-0 text-xs ${textMutedClass}`}>
            {stats.remaining} experiences left · ~{stats.minutesRemaining} min remaining
          </p>
        ) : (
          <p className={`mt-1.5 mb-0 text-xs ${textPrimaryClass}`}>Journey complete. You found yourself.</p>
        )}
      </button>
    );
  }

  return (
    <div className={`mb-8 rounded-2xl p-8 ${shellClass}`}>
      <div className="mb-6 text-center">
        <h3 className={`mb-2 font-mono text-[0.65rem] tracking-[0.25em] uppercase ${textMutedClass}`}>
          Your Self-Discovery Journey
        </h3>
        <p className={`font-heading text-xl leading-tight ${textPrimaryClass}`}>
          {stats.pct === 100
            ? "You found yourself. Now find your we."
            : stats.pct >= 50
              ? "More than halfway. The mirrors are getting clearer."
              : stats.pct > 0
                ? "The journey has begun. Keep going."
                : "25 experiences. One complete picture of you."}
        </p>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className={`font-mono text-xs ${textSecondaryClass}`}>
            {stats.done} of {stats.total} completed
          </span>
          <span className={`font-mono text-lg font-bold ${textPrimaryClass}`}>{stats.pct}%</span>
        </div>
        <div className={`h-2 overflow-hidden rounded-full ${trackClass}`}>
          <div
            className="h-full rounded-full bg-linear-to-r from-brand-gold-light/30 to-brand-gold-light transition-[width] duration-700"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
        {stats.remaining > 0 && (
          <p className={`mt-2 mb-0 text-[0.82rem] ${textMutedClass}`}>
            ~{stats.minutesRemaining} minutes to complete your full self-portrait
          </p>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className={`block w-full py-2 text-center font-mono text-xs tracking-[0.1em] ${textPrimaryClass}`}
      >
        {expanded ? "▲ Hide Details" : "▼ View Full Journey Map"}
      </button>

      {expanded && (
        <div className="mt-4">
          {(["know", "love", "body", "taste", "mind"] as const).map((cat) => {
            const items = grouped[cat];
            if (!items || items.length === 0) return null;
            const meta = CATEGORY_META[cat];
            const catDone = items.filter((i) => completed.has(i.id)).length;

            return (
              <div key={cat} className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className={`font-mono text-[0.6rem] tracking-[0.15em] uppercase ${meta.textClass}`}>
                    {meta.label}
                  </span>
                  <span className={`font-mono text-[0.6rem] ${textMutedClass}`}>
                    {catDone}/{items.length}
                  </span>
                </div>
                <div className="grid gap-1.5">
                  {items.map((exp) => {
                    const isDone = completed.has(exp.id);
                    const isCurrent = exp.id === currentAssessmentId;
                    return (
                      <div
                        key={exp.id}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                          isCurrent
                            ? isDark
                              ? "border-brand-gold-light/20 bg-brand-gold-light/8"
                              : "border-brand-gold/15 bg-brand-gold/6"
                            : "border-transparent"
                        }`}
                      >
                        <button
                          onClick={() => toggleComplete(exp.id)}
                          className={`flex size-5 shrink-0 items-center justify-center rounded border-2 ${
                            isDone
                              ? "border-brand-gold-light bg-brand-gold-light"
                              : isDark
                                ? "border-brand-gold-light/20"
                                : "border-brand-gold/20"
                          }`}
                        >
                          {isDone && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2.5 6L5 8.5L9.5 3.5"
                                stroke={isDark ? "#0A0A10" : "#fff"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <a
                            href={exp.url}
                            target={exp.isExternal ? "_blank" : undefined}
                            rel={exp.isExternal ? "noopener noreferrer" : undefined}
                            className={`text-sm ${isDone ? `line-through ${textMutedClass}` : isCurrent ? textPrimaryClass : isDark ? "text-[#E8E4DC]/70" : "text-[#333]"}`}
                          >
                            {exp.name}
                          </a>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                          {exp.questionCount && (
                            <span
                              className={`rounded-sm border px-1.5 py-0.5 font-mono text-[0.5rem] ${textMutedClass} ${isDark ? "border-brand-gold-light/10" : "border-brand-gold/10"}`}
                            >
                              {exp.questionCount}Q
                            </span>
                          )}
                          <span className={`font-mono text-[0.5rem] ${textMutedClass}`}>~{exp.estimatedMinutes}m</span>
                          {exp.isExternal && <span className={`font-mono text-[0.45rem] ${textMutedClass}`}>↗</span>}
                          {isCurrent && (
                            <span
                              className={`rounded-sm px-1.5 py-0.5 font-mono text-[0.45rem] tracking-[0.1em] uppercase ${textPrimaryClass} ${isDark ? "bg-brand-gold-light/10" : "bg-brand-gold/8"}`}
                            >
                              Here
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
