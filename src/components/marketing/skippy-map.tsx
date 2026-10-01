"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Check,
  CircleCheck,
  Clock,
  Coffee,
  FlaskConical,
  Gem,
  Globe,
  Leaf,
  PartyPopper,
  Search,
  Sprout,
  Star,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SKIPPY_STORAGE_KEY,
  TENTACLES,
  TOTAL_STOPS,
  type SkippyStop,
  type Tentacle,
  type TentacleIcon,
  type TentacleTheme,
} from "@/lib/content/skippy-map";

// Ported from legacy client/src/pages/SkippyMap.tsx. Progress persists in
// localStorage under the same key legacy used, read through
// useSyncExternalStore so the server render (nothing checked) and the first
// client render agree — legacy's load-in-useEffect caused a flash. Legacy's
// inline `S` style object is rebuilt as Tailwind classes, one full literal
// string per tentacle theme.

const ICONS: Record<TentacleIcon, LucideIcon> = {
  star: Star,
  brain: Brain,
  sprout: Sprout,
  user: User,
  gem: Gem,
  flask: FlaskConical,
  coffee: Coffee,
  leaf: Leaf,
  globe: Globe,
  search: Search,
};

const THEMES: Record<TentacleTheme, { header: string; text: string; box: string; doneRing: string }> = {
  amber: { header: "bg-linear-135 from-[#B45309] via-[#D97706] to-[#F59E0B]", text: "text-[#B45309]", box: "border-[#B45309] bg-[#B45309]", doneRing: "ring-[#B45309]/30" },
  indigo: { header: "bg-linear-135 from-[#4F46E5] to-[#7C3AED]", text: "text-[#4F46E5]", box: "border-[#4F46E5] bg-[#4F46E5]", doneRing: "ring-[#4F46E5]/30" },
  emerald: { header: "bg-linear-135 from-[#059669] to-[#10B981]", text: "text-[#059669]", box: "border-[#059669] bg-[#059669]", doneRing: "ring-[#059669]/30" },
  pink: { header: "bg-linear-135 from-[#DB2777] to-[#EC4899]", text: "text-[#DB2777]", box: "border-[#DB2777] bg-[#DB2777]", doneRing: "ring-[#DB2777]/30" },
  sky: { header: "bg-linear-135 from-[#0EA5E9] to-[#38BDF8]", text: "text-[#0369A1]", box: "border-[#0369A1] bg-[#0369A1]", doneRing: "ring-[#0369A1]/30" },
  orange: { header: "bg-linear-135 from-[#D97706] to-[#F59E0B]", text: "text-[#92400E]", box: "border-[#92400E] bg-[#92400E]", doneRing: "ring-[#92400E]/30" },
  brown: { header: "bg-linear-135 from-[#78350F] to-[#92400E]", text: "text-[#78350F]", box: "border-[#78350F] bg-[#78350F]", doneRing: "ring-[#78350F]/30" },
  forest: { header: "bg-linear-135 from-[#065F46] to-[#059669]", text: "text-[#065F46]", box: "border-[#065F46] bg-[#065F46]", doneRing: "ring-[#065F46]/30" },
  violet: { header: "bg-linear-135 from-[#6D28D9] to-[#8B5CF6]", text: "text-[#6D28D9]", box: "border-[#6D28D9] bg-[#6D28D9]", doneRing: "ring-[#6D28D9]/30" },
  red: { header: "bg-linear-135 from-[#DC2626] to-[#EF4444]", text: "text-[#DC2626]", box: "border-[#DC2626] bg-[#DC2626]", doneRing: "ring-[#DC2626]/30" },
};

// ── localStorage-backed progress store ──
const listeners = new Set<() => void>();
const EMPTY = "[]";
function readRaw(): string {
  try {
    return localStorage.getItem(SKIPPY_STORAGE_KEY) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}
function writeIds(ids: string[] | null) {
  try {
    if (ids) localStorage.setItem(SKIPPY_STORAGE_KEY, JSON.stringify(ids));
    else localStorage.removeItem(SKIPPY_STORAGE_KEY);
  } catch {}
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
function parse(raw: string): Set<string> {
  try {
    const arr: unknown = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function StopRow({
  stop,
  theme,
  checked,
  onToggle,
  step,
}: {
  stop: SkippyStop;
  theme: TentacleTheme;
  checked: boolean;
  onToggle: () => void;
  step?: number;
}) {
  const t = THEMES[theme];
  return (
    <div
      className={cn(
        "mb-2 flex gap-3 rounded-lg px-3 py-3 transition-colors",
        checked ? "bg-[#10B981]/8" : stop.featured ? "bg-[#D97706]/6" : "hover:bg-black/3",
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={`Mark ${stop.label} as ${checked ? "not visited" : "visited"}`}
        onClick={onToggle}
        className={cn(
          "mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
          checked ? cn(t.box, "text-white") : "border-black/25 bg-white",
        )}
      >
        {checked && <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1">
        {step !== undefined && (
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#B45309]/10 px-1.5 py-0.5 text-[11px] font-bold text-[#B45309]">Step {step}</span>
            {stop.isStart && <span className="rounded bg-[#D1FAE5] px-1.5 py-0.5 text-[10px] font-bold text-[#059669]">START</span>}
          </div>
        )}
        <div
          className={cn(
            "font-semibold text-[#1A1208]",
            step !== undefined ? "text-base" : "text-sm",
            checked && "text-[#1A1208]/50 line-through",
          )}
        >
          {stop.label}
        </div>
        <p className="mt-0.5 text-[13px] leading-relaxed text-[#44403C]">{stop.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] text-[#78716C]">
            <Clock aria-hidden="true" className="size-3" /> {stop.time}
          </span>
          {stop.href ? (
            <Link
              href={stop.href}
              className={cn("inline-flex items-center gap-1 text-xs font-bold underline underline-offset-2", t.text)}
            >
              Go <ArrowRight aria-hidden="true" className="size-3" />
            </Link>
          ) : (
            <span className="rounded-full bg-black/5 px-2 py-0.5 font-mono text-[10px] tracking-wide text-[#78716C] uppercase">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TentacleHeader({ tentacle, children }: { tentacle: Tentacle; children: React.ReactNode }) {
  const Icon = ICONS[tentacle.icon];
  return (
    <div className={cn("flex items-center gap-3 px-5 py-4 text-white", THEMES[tentacle.theme].header)}>
      <Icon aria-hidden="true" className="size-7 shrink-0" />
      {children}
    </div>
  );
}

export function SkippyMap() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => EMPTY);
  const checked = parse(raw);

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeIds([...next]);
  };
  const reset = () => writeIds(null);

  const completedCount = TENTACLES.reduce((n, t) => n + t.stops.filter((s) => checked.has(s.id)).length, 0);
  const pct = Math.round((completedCount / TOTAL_STOPS) * 100);
  const allDone = completedCount === TOTAL_STOPS;
  const featured = TENTACLES.find((t) => t.id === "featured")!;
  const rest = TENTACLES.filter((t) => t.id !== "featured");

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FFFBF2] to-[#FFF7E6] text-[#1A1208]">
      <div className="relative overflow-hidden bg-linear-to-br from-[#1A1208] via-[#2D1B08] to-[#44200A] px-6 pt-16 pb-12 text-center text-white sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 h-80 w-150 -translate-x-1/2 rounded-full bg-[#F59E0B]/15 blur-3xl"
        />
        <p className="relative mb-4 font-mono text-[11px] tracking-[0.25em] text-[#F59E0B] uppercase">
          Only Time Buys Trust · Personal Journey Map
        </p>
        <h1 className="relative mb-4 font-heading text-4xl font-bold sm:text-6xl">Welcome, Skippy.</h1>
        <p className="relative mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/75">
          You&apos;re pioneer #1 of 160. This is your treasure chest — every instrument, essay, and rabbit hole on
          this site, mapped and waiting. No pressure, no sequence. Check things off as you go, or don&apos;t. Time is
          on your side.
        </p>

        <div className="relative mx-auto mb-6 grid max-w-xl grid-cols-4 gap-3">
          {[
            [completedCount, "Completed"],
            [TOTAL_STOPS - completedCount, "Remaining"],
            [`${pct}%`, "Through"],
            [160, "Pioneers"],
          ].map(([num, label]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
              <div className="font-heading text-2xl font-bold text-[#F59E0B]">{num}</div>
              <div className="mt-1 font-mono text-[10px] tracking-wider text-white/50 uppercase">{label}</div>
            </div>
          ))}
        </div>

        <div
          className="relative mx-auto h-2 max-w-xl overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Journey progress"
        >
          {/* Width is runtime state — the one legitimate `style` exception. */}
          <div
            className="h-full rounded-full bg-linear-to-r from-[#F59E0B] to-[#10B981] transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {allDone && (
          <div className="mb-8 rounded-2xl border border-[#10B981]/30 bg-[#ECFDF5] p-6 text-center">
            <PartyPopper aria-hidden="true" className="mx-auto mb-2 size-8 text-[#059669]" />
            <div className="text-lg font-bold text-[#065F46]">You&apos;ve been through everything.</div>
            <p className="mt-1.5 text-sm leading-relaxed text-[#047857]">
              That&apos;s rare. Most people never make it this far. You now know more about this ecosystem than almost
              anyone alive.
            </p>
            <button type="button" onClick={reset} className="mt-4 text-xs text-[#065F46] underline underline-offset-2">
              Reset progress
            </button>
          </div>
        )}

        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#B45309]/20 bg-linear-to-br from-[#FEF3C7] to-[#FDE68A]/50 p-6">
            <div className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[#92400E] uppercase">
              PATH A · IF YOU&apos;RE READY NOW
            </div>
            <div className="mb-2.5 text-xl leading-tight font-bold">Start with the Psychedelic Path</div>
            <p className="mb-4 text-[13px] leading-relaxed text-[#44200A]">
              Go straight to the PRI and the Facilitator Index. If it resonates, move through the Three Friends Gate
              and the post-intervention assessment. This is the deepest water. If you like what you find, the rest of
              the site will make even more sense.
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-[#B45309]/10 px-3.5 py-2.5 text-xs leading-relaxed text-[#78350F]">
              <Leaf aria-hidden="true" className="size-4 shrink-0" /> PRI → Facilitator Index → Three Friends Gate →
              Post-Intervention
            </div>
          </div>
          <div className="rounded-2xl border border-[#059669]/20 bg-linear-to-br from-[#ECFDF5] to-[#D1FAE5]/50 p-6">
            <div className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[#065F46] uppercase">
              PATH B · YOUR TREASURE CHEST
            </div>
            <div className="mb-2.5 text-xl leading-tight font-bold">Roam as You Feel It</div>
            <p className="mb-4 text-[13px] leading-relaxed text-[#14532D]">
              Scroll down. Pick whatever calls to you — coffee, consciousness, capital, the body, the mind. This is
              Ramp&apos;s treasure chest. There&apos;s no wrong door. Check things off as you go. Come back when you
              have 10 minutes or 10 hours.
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-[#059669]/10 px-3.5 py-2.5 text-xs leading-relaxed text-[#166534]">
              <Globe aria-hidden="true" className="size-4 shrink-0" /> {TOTAL_STOPS} stops across {TENTACLES.length}{" "}
              tentacles — in any order
            </div>
          </div>
        </div>

        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-[#92400E] uppercase">
          <Leaf aria-hidden="true" className="size-4" /> Path A — The Psychedelic &amp; Facilitator Track
        </h2>
        <div className="mb-12 overflow-hidden rounded-2xl border border-[#B45309]/25 bg-white shadow-sm">
          <TentacleHeader tentacle={featured}>
            <div>
              <div className="text-base font-bold">{featured.title}</div>
              <div className="mt-0.5 text-[13px] text-white/75">The path Tony built for you. Do these first.</div>
            </div>
          </TentacleHeader>
          <div className="px-4 py-4 sm:px-5">
            {featured.stops.map((stop, i) => (
              <StopRow
                key={stop.id}
                stop={stop}
                theme={featured.theme}
                checked={checked.has(stop.id)}
                onToggle={() => toggle(stop.id)}
                step={i + 1}
              />
            ))}
          </div>
        </div>

        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-[#065F46] uppercase">
          <Globe aria-hidden="true" className="size-4" /> Path B — Ramp&apos;s Treasure Chest · Explore as You Feel It
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {rest.map((tentacle) => {
            const visited = tentacle.stops.filter((s) => checked.has(s.id)).length;
            const done = visited === tentacle.stops.length;
            return (
              <div
                key={tentacle.id}
                className={cn(
                  "overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm",
                  done && cn("ring-2", THEMES[tentacle.theme].doneRing),
                )}
              >
                <TentacleHeader tentacle={tentacle}>
                  <div className="flex-1">
                    <div className="text-[15px] font-bold">{tentacle.title}</div>
                    <div className="mt-0.5 text-[11px] text-white/65">
                      {visited} / {tentacle.stops.length} visited
                    </div>
                  </div>
                  {done && <CircleCheck aria-label="All visited" className="size-5 shrink-0" />}
                </TentacleHeader>
                <div className="px-3 py-3 sm:px-4">
                  {tentacle.stops.map((stop) => (
                    <StopRow
                      key={stop.id}
                      stop={stop}
                      theme={tentacle.theme}
                      checked={checked.has(stop.id)}
                      onToggle={() => toggle(stop.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 border-t border-[#D97706]/15 pt-8 text-center">
          <p className="text-[13px] leading-relaxed text-[#1A1208]/45">
            Your progress is saved automatically in this browser.
            <br />
            <strong className="text-[#B45309]">Skippy</strong> — you&apos;re pioneer #1 of 160.
            <br />© 2026 Tony Greenberg · Only Time Buys Trust · onlytimebuystrust.com
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 text-xs text-[#1A1208]/50 underline underline-offset-2 hover:text-[#B45309]"
          >
            Reset all progress
          </button>
        </div>
      </div>
    </div>
  );
}
