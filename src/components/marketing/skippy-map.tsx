"use client";

import { readVisitorState, writeVisitorState } from "@/lib/visitor-state-client";
import {
  getSkippyStats,
  SKIPPY_STOP_IDS,
  SKIPPY_TRACKS,
  type SkippyIconKey,
} from "@/lib/content/skippy-map";
import {
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Check,
  Coffee,
  Compass,
  FlaskConical,
  Forward,
  HeartHandshake,
  Leaf,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useSyncExternalStore } from "react";

type SkippyState = { completed?: unknown };

const listeners = new Set<() => void>();
let completedStopIds = new Set<string>();
let hydrated = false;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  void readVisitorState<SkippyState>("skippy")
    .then((state) => {
      const known = new Set(SKIPPY_STOP_IDS);
      const saved = Array.isArray(state?.completed)
        ? state.completed.filter(
            (value): value is string => typeof value === "string" && known.has(value),
          )
        : [];
      completedStopIds = new Set(saved);
      emitChange();
    })
    .catch(() => undefined);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  hydrate();
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return completedStopIds;
}

const EMPTY_SET: ReadonlySet<string> = new Set();

const ICONS = {
  book: BookOpen,
  brain: Brain,
  briefcase: BriefcaseBusiness,
  coffee: Coffee,
  compass: Compass,
  flask: FlaskConical,
  heart: HeartHandshake,
  leaf: Leaf,
} satisfies Record<SkippyIconKey, typeof Compass>;

const TONES = {
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  rose: "border-rose-500/30 bg-rose-500/8 text-rose-300",
  sky: "border-sky-500/30 bg-sky-500/8 text-sky-300",
  violet: "border-violet-500/30 bg-violet-500/8 text-violet-300",
} as const;

export function SkippyMap() {
  const completed = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_SET as Set<string>);
  const stats = useMemo(() => getSkippyStats(completed), [completed]);

  const updateCompleted = useCallback((next: Set<string>) => {
    completedStopIds = next;
    emitChange();
    void writeVisitorState("skippy", { completed: Array.from(next) }).catch(() => undefined);
  }, []);

  const toggleStop = useCallback(
    (id: string) => {
      const next = new Set(completedStopIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      updateCompleted(next);
    },
    [updateCompleted],
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-[#fefce8] via-[#fef3c7] to-[#fef9ee] text-[#1a1208]">
      <section className="relative overflow-hidden bg-linear-to-br from-[#1a1208] via-[#2d1b00] to-[#1a1208] px-5 py-16 text-center sm:px-8 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,.25),transparent_65%)]" />
        <div className="relative mx-auto max-w-175">
          <div className="font-mono text-[0.65rem] tracking-[0.22em] text-amber-400 uppercase">
            Personal journey map
          </div>
          <h1 className="mt-4 font-heading text-[clamp(2.4rem,6vw,4.5rem)] text-[#fefce8]">
            Welcome, Skippy.
          </h1>
          <p className="mx-auto mt-5 max-w-140 text-base leading-8 text-[#fefce8]/65 sm:text-lg">
            A practical map of the active Tony Greenberg ecosystem. Begin with the featured path, or
            follow the subject that has your attention today.
          </p>
          <div className="mx-auto mt-8 grid max-w-125 grid-cols-3 gap-4 text-[#fefce8] sm:gap-8">
            {[
              { value: stats.completed, label: "Completed" },
              { value: stats.remaining, label: "Remaining" },
              { value: `${stats.percentage}%`, label: "Progress" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-3xl text-amber-400">{stat.value}</div>
                <div className="mt-1 font-mono text-[0.58rem] tracking-[0.12em] text-[#fefce8]/45 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-6 h-1.5 max-w-125 overflow-hidden rounded-full bg-amber-500/20">
            <div
              className="h-full rounded-full bg-linear-to-r from-amber-600 to-amber-400 transition-[width] duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-5 py-12 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.65rem] tracking-[0.18em] text-amber-800 uppercase">
              Explore in any order
            </p>
            <h2 className="mt-2 font-heading text-3xl">The current map</h2>
          </div>
          {stats.completed > 0 && (
            <button
              type="button"
              onClick={() => updateCompleted(new Set())}
              className="inline-flex items-center gap-2 rounded-full border border-amber-800/25 px-4 py-2 font-mono text-xs tracking-[0.08em] text-amber-900 transition-colors hover:bg-amber-900/8"
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
              Reset progress
            </button>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {SKIPPY_TRACKS.map((track) => {
            const Icon = ICONS[track.icon];
            const completedInTrack = track.stops.filter((stop) => completed.has(stop.id)).length;
            const tone = TONES[track.tone];

            return (
              <section
                key={track.id}
                className="overflow-hidden rounded-2xl border border-amber-900/12 bg-white/85 shadow-[0_8px_28px_rgba(120,53,15,.08)]"
              >
                <header className={`flex items-center gap-3 border-b px-5 py-4 ${tone}`}>
                  <span className="flex size-9 items-center justify-center rounded-full border border-current/30 bg-black/10">
                    <Icon aria-hidden="true" className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-xl text-[#1a1208]">{track.title}</h3>
                    <p className="mt-0.5 font-mono text-[0.62rem] tracking-[0.08em] text-[#1a1208]/55 uppercase">
                      {completedInTrack} of {track.stops.length} visited
                    </p>
                  </div>
                </header>
                <div className="p-5">
                  <p className="text-sm leading-6 text-[#1a1208]/65">{track.description}</p>
                  <ul className="mt-4 space-y-2">
                    {track.stops.map((stop) => {
                      const done = completed.has(stop.id);
                      return (
                        <li
                          key={stop.id}
                          className={`flex items-start gap-3 rounded-xl border p-3 ${done ? "border-emerald-600/25 bg-emerald-50" : "border-amber-900/10 bg-amber-50/35"}`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleStop(stop.id)}
                            aria-label={`${done ? "Mark incomplete" : "Mark complete"}: ${stop.label}`}
                            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${done ? "border-emerald-600 bg-emerald-600 text-white" : "border-amber-800/35 hover:border-amber-800"}`}
                          >
                            {done && <Check aria-hidden="true" className="size-3" />}
                          </button>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={stop.href}
                              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${done ? "text-emerald-800 line-through" : "text-[#1a1208]"}`}
                            >
                              {stop.label}
                              <Forward aria-hidden="true" className="size-3" />
                            </Link>
                            <p className="mt-1 text-xs leading-5 text-[#1a1208]/55">
                              {stop.description}
                            </p>
                            <span className="mt-1.5 inline-block rounded-full bg-amber-900/7 px-2 py-0.5 font-mono text-[0.58rem] tracking-[0.06em] text-amber-900">
                              {stop.minutes}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
