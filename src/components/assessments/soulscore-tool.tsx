"use client";

import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CircleDot,
  Link2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker } from "@/components/assessments/journey-tracker";
import {
  BENCHMARKS,
  CNPV_REFERENCE_POINTS,
  DIMENSIONS,
  ENTITY_TYPES,
  FAILURES,
  GIG_LAYERS,
  GIG_STATS,
  PALETTE,
  SUPPLY_TIERS,
  calcCNPV,
  calcSoulScore,
  calcSupplyChainComposite,
  formatCurrency,
  getConsciousnessZone,
  getGrade,
  normalize,
  severityClasses,
  type BenchmarkEntity,
  type Dimension,
} from "@/lib/content/soulscore";

// Ported from legacy client/src/pages/SoulScore.tsx (1231 lines) —
// "SoulScore™ — 12-Dimension Impact Measurement Engine," by ImpactSoul.
// This is NOT a question-and-answer quiz like the other "Find Your X"
// assessments this migration has ported — it's a live interactive
// measurement engine. Pick an entity type, drag 12 weighted dimension
// sliders, and watch the score/grade, a Supply Chain Composite, and a
// Consciousness-Adjusted NPV recompute in real time across 6 tabs
// (Measure, Benchmark, Supply Chain, Failures, C-NPV, Gig Economy). Every
// real data point is ported verbatim from `lib/content/soulscore.ts`: all
// 12 dimensions, all 8 entity types, all 7 benchmark entities' real
// per-dimension scores, the real 6-tier/30-factor supply chain model, all
// 20 "why every impact system failed" entries, the real C-NPV formula, and
// the real gig-economy stats/5-layer stack/extractive-vs-regenerative
// comparison — see that file's header for the full color-architecture
// rationale (a 12-hex palette precomposed once, referenced by key, never
// fragment-assembled into a className).
//
// Real bugs found and fixed while porting:
// 1. Legacy's own `<SEO>` block on this page was for a completely
//    different assessment — title "Soul Score — Alignment Assessment",
//    description "Measure the alignment between your values and your
//    actions", path "/soul-score" — none of which describes the real
//    12-dimension impact-measurement content that actually renders here.
//    Stale/mismatched copy-paste, not reproduced; real metadata is written
//    fresh in `app/soulscore/page.tsx` describing what this page actually
//    is.
// 2. The Supply Chain tab's tier "card" was a `<div onClick>` (not a real
//    button — no keyboard access, no role) that also had to
//    `stopPropagation()` on every one of its 30 nested `<input
//    type="range">` sliders so dragging one didn't collapse the tier. That
//    div-pretending-to-be-a-button-around-nested-interactive-controls
//    pattern is the same bug class flagged elsewhere in this migration
//    (nested interactive elements). Fixed here by making the toggle a real
//    `<button>` containing only the (non-interactive) header row, with the
//    expanded sliders rendered as a sibling `<div>` — no stopPropagation
//    hack needed because the sliders are no longer descendants of the
//    button.
// 3. Every "N dimensions / N entity types / N tiers / N failure patterns"
//    count in the intro and tab copy now reads off the real array lengths
//    (`DIMENSIONS.length`, `SUPPLY_TIERS.length`, etc.) instead of legacy's
//    hardcoded numbers — they happened to already be accurate, but hard-
//    coding them is exactly the kind of stale-count bug already caught on
//    other assessments ported earlier in this migration.
// 4. Legacy hand-rolled a colored slider-fill effect via an inline
//    `background: linear-gradient(...)` recomputed on every drag. Replaced
//    with the native `accent-<hex>` Tailwind utility (already used
//    elsewhere in this codebase, e.g. `brewsoul/browse-explorer.tsx`) —
//    same colored-slider result, zero runtime style computation, and it's
//    a real Tailwind class instead of an inline style.
// No `EmailGate`: legacy's SoulScore never had one — this is a live,
// fully-open calculator, not a quiz that unlocks a written report, and
// gating it would block the actual product rather than just its results.
// `AssessmentResultActions` still logs a completion (via `resultSlug`) so
// `/self-portrait` picks it up. Not added to `JourneyTracker`'s real
// `JOURNEY_MAP` (that's the shared `journey-tracker.tsx` — out of scope for
// this change) — the tracker still renders for cross-navigation, just
// without a matching "you are here" row until that map is updated.

const ACCENT = PALETTE.gold.hex;
const CARD = "rounded-lg border border-[#E8E4DC] bg-white p-5";
const MONO_LABEL = "font-mono text-[0.6rem] tracking-[0.15em] text-[#999] uppercase";
const SECTION_TITLE = "mb-4 font-heading text-2xl font-bold text-[#0A0A10]";

function AnimNum({
  value,
  decimals = 1,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    if (Math.abs(diff) < 0.01) {
      setDisplay(value);
      ref.current = value;
      return;
    }
    let frame: number;
    const duration = 400;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(start + diff * ease);
      if (p < 1) frame = requestAnimationFrame(tick);
      else ref.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <>
      {display.toFixed(decimals)}
      {suffix}
    </>
  );
}

const TAB_NAMES = [
  "MEASURE",
  "BENCHMARK",
  "SUPPLY CHAIN",
  "FAILURES",
  "C-NPV",
  "GIG ECONOMY",
] as const;
type TabName = (typeof TAB_NAMES)[number];

export function SoulScoreTool() {
  const [phase, setPhase] = useState<"landing" | "tool">("landing");
  const [activeTab, setActiveTab] = useState<TabName>("MEASURE");
  const [entityType, setEntityType] = useState("company");
  const [entityName, setEntityName] = useState("");
  const [scores, setScores] = useState<number[]>(() =>
    DIMENSIONS.map((d) => (d.max === 1000 ? 200 : 50)),
  );

  const [fcf, setFcf] = useState(10000000);
  const [cnpvYears, setCnpvYears] = useState(10);
  const [discountRate, setDiscountRate] = useState(10);

  const [expandedTier, setExpandedTier] = useState<number | null>(null);
  const [tierScores, setTierScores] = useState<number[][]>(() =>
    SUPPLY_TIERS.map(() => [50, 50, 50, 50, 50]),
  );

  const updateScore = useCallback((idx: number, val: number) => {
    setScores((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  }, []);

  const updateTierScore = useCallback((tierIdx: number, factorIdx: number, val: number) => {
    setTierScores((prev) => {
      const next = prev.map((t) => [...t]);
      next[tierIdx][factorIdx] = val;
      return next;
    });
  }, []);

  const soulScore = useMemo(() => calcSoulScore(scores), [scores]);
  const grade = useMemo(() => getGrade(soulScore), [soulScore]);
  const cZone = useMemo(() => getConsciousnessZone(scores[0]), [scores]);
  const scComposite = useMemo(() => calcSupplyChainComposite(scores), [scores]);
  const cnpv = useMemo(
    () => calcCNPV(fcf, scores[0], cnpvYears, discountRate),
    [fcf, scores, cnpvYears, discountRate],
  );

  const radarData = useMemo(
    () => Object.fromEntries(DIMENSIONS.map((d, i) => [d.shortLabel, normalize(scores[i], d)])),
    [scores],
  );

  const diagnosis = useMemo(() => {
    const weak: { dim: Dimension; val: number }[] = [];
    const strong: { dim: Dimension; val: number }[] = [];
    DIMENSIONS.forEach((d, i) => {
      const n = normalize(scores[i], d);
      if (n < 30) weak.push({ dim: d, val: n });
      else if (n >= 70) strong.push({ dim: d, val: n });
    });
    return { weak, strong };
  }, [scores]);

  if (phase === "landing") {
    return (
      <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
        <ThemedBackground theme="soulscore" />
        <div className="relative z-1 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
          <p className={`mb-4 ${MONO_LABEL}`}>by ImpactSoul</p>
          <h1 className="mb-4 font-heading text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05] font-bold">
            Soul<span className={PALETTE.gold.text}>Score</span>
            <span className={`align-super text-[0.5em] ${PALETTE.goldLight.text}`}>™</span>
          </h1>
          <p className="mb-10 max-w-130 text-lg leading-relaxed text-[#5A4A32]">
            The first impact measurement engine that scores <em>consciousness</em>, not just carbon.
            Twelve dimensions. Any entity. Real-time.
          </p>

          <div className="mb-10 grid w-full max-w-150 grid-cols-2 gap-4 sm:grid-cols-4">
            {(
              [
                {
                  icon: CircleDot,
                  label: `${DIMENSIONS.length} Dimensions`,
                  desc: "From consciousness to carbon",
                },
                {
                  icon: Activity,
                  label: `${ENTITY_TYPES.length} Entity Types`,
                  desc: "Individual to supply chain",
                },
                { icon: BarChart3, label: "Real-Time Score", desc: "Instant S to F grading" },
                {
                  icon: Link2,
                  label: `${SUPPLY_TIERS.length}-Tier Depth`,
                  desc: "Full supply chain mapping",
                },
              ] satisfies { icon: LucideIcon; label: string; desc: string }[]
            ).map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#D4B96A]/20 bg-white/70 p-4 text-center backdrop-blur-sm"
                >
                  <Icon aria-hidden="true" className="mx-auto mb-2 size-6 text-brand-gold" />
                  <div
                    className={`mb-1 font-mono text-[0.7rem] tracking-[0.1em] font-bold ${PALETTE.gold.text}`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[0.8rem] text-[#7A6A52]">{item.desc}</div>
                </div>
              );
            })}
          </div>

          <p className="mb-6 font-mono text-[0.7rem] tracking-[0.15em] text-[#9A8A6A]">
            Interactive · ~3 minutes · No account required
          </p>

          <button
            onClick={() => setPhase("tool")}
            className="rounded-lg bg-linear-to-br from-[#8B6914] to-[#D4B96A] px-14 py-4 font-mono text-sm font-bold tracking-[0.2em] text-[#FAFAF7] uppercase shadow-[0_4px_20px_rgba(139,105,20,0.3)] transition-transform hover:-translate-y-0.5"
          >
            Launch SoulScore <ForwardIcon aria-hidden="true" />
          </button>

          <p className="mt-6 max-w-100 text-[0.75rem] leading-relaxed text-[#9A8A6A]">
            Built from 50+ meeting transcripts, 100+ research conversations, and 25 years of Fortune
            500 impact advisory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <header className="relative overflow-hidden bg-linear-to-br from-[#3D2E14] via-[#5A4020] to-[#3D2E14] px-6 pt-12 pb-8 text-center text-[#FAFAF7]">
        <p className={`mb-2 font-mono text-[0.7rem] tracking-[0.25em] text-[#D4B96A] uppercase`}>
          by ImpactSoul
        </p>
        <h1 className="mb-2 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] font-bold">
          SoulScore<span className="text-[#D4B96A]">™</span>
        </h1>
        <p className="mx-auto max-w-150 font-mono text-[0.75rem] tracking-[0.15em] text-[#FAFAF7]/60">
          {DIMENSIONS.length} Dimensions × Any Entity × Real-Time
        </p>
      </header>

      <nav className="sticky top-0 z-40 flex overflow-x-auto border-b-2 border-[#E8E4DC] bg-white">
        {TAB_NAMES.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`shrink-0 border-b-2 px-4 py-3 font-mono text-[0.65rem] tracking-[0.12em] uppercase transition-colors ${
              activeTab === t
                ? `${PALETTE.gold.text} ${PALETTE.gold.border} font-bold`
                : "border-transparent text-[#666]"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-275 px-4 py-6 pb-16">
        {activeTab === "MEASURE" && (
          <MeasureTab
            entityType={entityType}
            setEntityType={setEntityType}
            entityName={entityName}
            setEntityName={setEntityName}
            scores={scores}
            updateScore={updateScore}
            soulScore={soulScore}
            grade={grade}
            cZone={cZone}
            scComposite={scComposite}
            cnpvPremium={cnpv.premium}
            radarData={radarData}
            diagnosis={diagnosis}
          />
        )}
        {activeTab === "BENCHMARK" && <BenchmarkTab scores={scores} entityName={entityName} />}
        {activeTab === "SUPPLY CHAIN" && (
          <SupplyChainTab
            expandedTier={expandedTier}
            setExpandedTier={setExpandedTier}
            tierScores={tierScores}
            updateTierScore={updateTierScore}
          />
        )}
        {activeTab === "FAILURES" && <FailuresTab />}
        {activeTab === "C-NPV" && (
          <CNPVTab
            fcf={fcf}
            setFcf={setFcf}
            consciousness={scores[0]}
            years={cnpvYears}
            setYears={setCnpvYears}
            discount={discountRate}
            setDiscount={setDiscountRate}
            cnpv={cnpv}
          />
        )}
        {activeTab === "GIG ECONOMY" && <GigTab />}

        <div className="mt-8 text-center">
          <AssessmentResultActions accentColor={ACCENT} resultSlug="soulscore" />
        </div>

        <div className="mt-4">
          <JourneyTracker variant="light" />
        </div>
      </main>

      <WhatsNext />

      <footer className="bg-linear-to-br from-[#3D2E14] to-[#5A4020] px-6 py-8 text-center font-mono text-[0.65rem] tracking-[0.1em] text-[#FAFAF7]/70">
        <p className="mb-2 text-[#D4B96A]">SoulScore™ by ImpactSoul</p>
        <p>
          Consciousness-Adjusted NPV · {SUPPLY_TIERS.length}-Tier Supply Chain · Impact Gig Economy
          · On-Chain Verification
        </p>
        <p className="mt-2 text-[0.6rem]">
          Architecture: 50+ meeting transcripts, 100+ research conversations, 25 years of Fortune
          500 impact advisory
        </p>
        <Link href="/find-my" className="mt-4 inline-block text-[#D4B96A]">
          <BackIcon aria-hidden="true" /> Back to Find My
        </Link>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 1: MEASURE
   ═══════════════════════════════════════════════════════════ */

function MeasureTab({
  entityType,
  setEntityType,
  entityName,
  setEntityName,
  scores,
  updateScore,
  soulScore,
  grade,
  cZone,
  scComposite,
  cnpvPremium,
  radarData,
  diagnosis,
}: {
  entityType: string;
  setEntityType: (v: string) => void;
  entityName: string;
  setEntityName: (v: string) => void;
  scores: number[];
  updateScore: (i: number, v: number) => void;
  soulScore: number;
  grade: { letter: string; colorKey: keyof typeof PALETTE };
  cZone: { zone: string; colorKey: keyof typeof PALETTE; bg: string };
  scComposite: number;
  cnpvPremium: number;
  radarData: Record<string, number>;
  diagnosis: { weak: { dim: Dimension; val: number }[]; strong: { dim: Dimension; val: number }[] };
}) {
  const gradeC = PALETTE[grade.colorKey];
  const zoneC = PALETTE[cZone.colorKey];

  return (
    <>
      {/* Entity selector */}
      <div className={`${CARD} mb-4 flex flex-wrap items-center gap-2`}>
        <div className="mb-1 basis-full">
          <span className={MONO_LABEL}>Entity Type</span>
        </div>
        {ENTITY_TYPES.map((e) => {
          const Icon = e.icon;

          return (
            <button
              key={e.id}
              onClick={() => setEntityType(e.id)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-[0.65rem] transition-colors ${
                entityType === e.id
                  ? `${PALETTE.gold.border} ${PALETTE.gold.bgSoft} ${PALETTE.gold.text}`
                  : "border-[#E8E4DC] bg-white text-[#666]"
              }`}
            >
              <Icon aria-hidden="true" className="size-3.5" />
              {e.label}
            </button>
          );
        })}
        <input
          type="text"
          placeholder="Entity name (optional)"
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
          className="mt-2 min-h-11 basis-full rounded-md border border-[#E8E4DC] bg-[#FAFAF7] px-3 py-2 text-[0.9rem] outline-none"
        />
      </div>

      {/* Score + Grade hero card */}
      <div
        className={`${CARD} mb-4 flex flex-wrap items-center justify-center gap-8 border-2 ${PALETTE.goldLight.border} bg-linear-to-br from-[#FAFAF7] to-[#F5F0E6] p-6`}
      >
        <div className="text-center">
          <div className={MONO_LABEL}>SoulScore</div>
          <div className={`font-heading text-6xl leading-none font-bold ${gradeC.text}`}>
            <AnimNum value={soulScore} />
          </div>
        </div>
        <div
          className={`flex size-20 items-center justify-center rounded-full border-3 bg-white ${gradeC.border}`}
        >
          <span className={`font-heading text-4xl font-bold ${gradeC.text}`}>{grade.letter}</span>
        </div>
      </div>

      {/* 3 summary cards */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className={`${CARD} ${zoneC.border} ${cZone.bg}`}>
          <div className={MONO_LABEL}>Consciousness Zone</div>
          <div className={`mt-1 font-heading text-2xl font-bold ${zoneC.text}`}>{cZone.zone}</div>
          <div className="mt-1 font-mono text-[0.7rem] text-[#666]">
            Hawkins: <AnimNum value={scores[0]} decimals={0} />
          </div>
        </div>
        <div className={CARD}>
          <div className={MONO_LABEL}>Supply Chain Composite</div>
          <div className={`mt-1 font-heading text-2xl font-bold ${PALETTE.green.text}`}>
            <AnimNum value={scComposite} />
          </div>
          <div className="mt-1 font-mono text-[0.65rem] text-[#999]">
            SCI×30 + LJI×20 + C×15 + RCI×15 + CPI×10 + HDI×10
          </div>
        </div>
        <div className={CARD}>
          <div className={MONO_LABEL}>C-NPV Premium</div>
          <div
            className={`mt-1 font-heading text-2xl font-bold ${cnpvPremium >= 0 ? PALETTE.gold.text : PALETTE.red.text}`}
          >
            <AnimNum value={cnpvPremium} suffix="%" />
          </div>
          <div className="mt-1 font-mono text-[0.65rem] text-[#999]">
            Consciousness-adjusted value
          </div>
        </div>
      </div>

      {/* Radar chart */}
      <div className={`${CARD} mb-4`}>
        <div className={`mb-2 ${MONO_LABEL}`}>{DIMENSIONS.length}-Axis Radar</div>
        <div className="flex justify-center">
          <AssessmentRadarChart scores={radarData} max={100} accentColor={ACCENT} />
        </div>
      </div>

      {/* Dimension sliders */}
      <div className={`${CARD} mb-4`}>
        <div className={`mb-4 ${MONO_LABEL}`}>{DIMENSIONS.length} Dimensions</div>
        {DIMENSIONS.map((d, i) => {
          const c = PALETTE[d.colorKey];
          const Icon = d.icon;
          return (
            <div key={d.id} className="mb-4">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-[#0A0A10]">
                  <Icon aria-hidden="true" className="size-3.5" /> {d.label}
                </span>
                <span className={`font-mono text-[0.75rem] font-bold ${c.text}`}>
                  <AnimNum value={scores[i]} decimals={0} />
                  <span className="font-normal text-[#999]"> / {d.max}</span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={d.max}
                step={d.max === 1000 ? 5 : 1}
                value={scores[i]}
                onChange={(e) => updateScore(i, Number(e.target.value))}
                className={`h-1.5 w-full cursor-pointer rounded-full ${c.accent}`}
              />
              <div className="mt-0.5 font-mono text-[0.55rem] text-[#aaa]">
                {d.unit} · Weight: {d.weight}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto-diagnosis */}
      <div className={CARD}>
        <div className={`mb-3 ${MONO_LABEL}`}>Auto-Diagnosis</div>
        {diagnosis.weak.length > 0 && (
          <div className="mb-3">
            <div
              className={`mb-1.5 flex items-center gap-1.5 font-mono text-[0.65rem] font-bold ${PALETTE.red.text}`}
            >
              <AlertTriangle aria-hidden="true" className="size-3.5" /> BELOW THRESHOLD
            </div>
            {diagnosis.weak.map((w) => {
              const Icon = w.dim.icon;

              return (
                <div
                  key={w.dim.id}
                  className={`mb-1 flex justify-between rounded-sm ${PALETTE.red.bgSoft} px-2 py-1.5 text-[0.8rem]`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Icon aria-hidden="true" className="size-3.5" /> {w.dim.label}
                  </span>
                  <span className={`font-mono font-bold ${PALETTE.red.text}`}>
                    {w.val.toFixed(0)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {diagnosis.strong.length > 0 && (
          <div>
            <div
              className={`mb-1.5 flex items-center gap-1.5 font-mono text-[0.65rem] font-bold ${PALETTE.green.text}`}
            >
              <Sparkles aria-hidden="true" className="size-3.5" /> STRENGTHS
            </div>
            {diagnosis.strong.map((s) => {
              const Icon = s.dim.icon;

              return (
                <div
                  key={s.dim.id}
                  className={`mb-1 flex justify-between rounded-sm ${PALETTE.green.bgSoft} px-2 py-1.5 text-[0.8rem]`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Icon aria-hidden="true" className="size-3.5" /> {s.dim.label}
                  </span>
                  <span className={`font-mono font-bold ${PALETTE.green.text}`}>
                    {s.val.toFixed(0)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {diagnosis.weak.length === 0 && diagnosis.strong.length === 0 && (
          <p className="text-[0.85rem] text-[#999]">
            Adjust the sliders above to see auto-diagnosis.
          </p>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 2: BENCHMARK
   ═══════════════════════════════════════════════════════════ */

function BenchmarkTab({ scores, entityName }: { scores: number[]; entityName: string }) {
  const allEntities = useMemo<BenchmarkEntity[]>(() => {
    const user: BenchmarkEntity = {
      name: entityName || "Your Entity",
      tag: "YOU",
      scores: [...scores],
    };
    return [user, ...BENCHMARKS];
  }, [scores, entityName]);

  return (
    <>
      <h2 className={SECTION_TITLE}>Benchmark Comparison</h2>

      <div
        className={`${CARD} mb-4 ${PALETTE.goldLight.border} bg-[#FDF8E8] text-[0.85rem] leading-relaxed text-[#5a4a1e]`}
      >
        <strong>ESG scores positively correlate with greenwashing</strong> (ScienceDirect 2025). BP
        gets ESG &apos;AA&apos; but SoulScore <strong className={PALETTE.red.text}>F-25</strong>.
        SoulScore&apos;s {DIMENSIONS.length}-axis measurement eliminates single-dimension gaming.
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse font-mono text-[0.6rem]">
          <thead>
            <tr className="border-b-2 border-[#0A0A10]">
              <th className="p-2 text-left tracking-[0.1em] text-[#999]">ENTITY</th>
              {DIMENSIONS.map((d) => (
                <th
                  key={d.id}
                  className={`p-1 text-center text-[0.55rem] tracking-[0.05em] ${PALETTE[d.colorKey].text}`}
                >
                  {d.shortLabel}
                </th>
              ))}
              <th className={`p-2 text-center tracking-[0.1em] ${PALETTE.gold.text}`}>SCORE</th>
              <th className={`p-2 text-center ${PALETTE.gold.text}`}>GRD</th>
            </tr>
          </thead>
          <tbody>
            {allEntities.map((ent, idx) => {
              const ss = calcSoulScore(ent.scores);
              const g = getGrade(ss);
              const gc = PALETTE[g.colorKey];
              const isUser = idx === 0;
              return (
                <tr
                  key={ent.name}
                  className={`border-b border-[#E8E4DC] ${isUser ? "bg-[#FDF8E8] font-bold" : idx % 2 === 0 ? "bg-[#FAFAF7]" : "bg-white"}`}
                >
                  <td
                    className={`p-2 whitespace-nowrap ${isUser ? PALETTE.gold.text : "text-[#0A0A10]"}`}
                  >
                    {ent.tag && <span className="mr-1 text-[#999]">{ent.tag}</span>}
                    {ent.name}
                  </td>
                  {ent.scores.map((s, si) => {
                    const n = normalize(s, DIMENSIONS[si]);
                    const colorClass =
                      n >= 70
                        ? PALETTE.green.text
                        : n >= 40
                          ? PALETTE.amber.text
                          : n < 25
                            ? PALETTE.red.text
                            : "text-[#666]";
                    return (
                      <td key={DIMENSIONS[si].id} className={`p-1 text-center ${colorClass}`}>
                        {s}
                      </td>
                    );
                  })}
                  <td className={`p-2 text-center font-bold ${gc.text}`}>{ss.toFixed(1)}</td>
                  <td className={`p-2 text-center font-bold ${gc.text}`}>{g.letter}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 3: SUPPLY CHAIN DEEP DIVE
   ═══════════════════════════════════════════════════════════ */

function SupplyChainTab({
  expandedTier,
  setExpandedTier,
  tierScores,
  updateTierScore,
}: {
  expandedTier: number | null;
  setExpandedTier: (v: number | null) => void;
  tierScores: number[][];
  updateTierScore: (t: number, f: number, v: number) => void;
}) {
  const totalFactors = SUPPLY_TIERS.reduce((s, t) => s + t.factors.length, 0);

  return (
    <>
      <h2 className={SECTION_TITLE}>Supply Chain Deep Dive</h2>
      <p className="mb-6 text-[0.9rem] leading-relaxed text-[#666]">
        Beyond carbon. {SUPPLY_TIERS.length} tiers, {totalFactors} sub-factors. Click any tier to
        expand and score individual factors.
      </p>

      <div className="flex flex-col">
        {SUPPLY_TIERS.map((tier, ti) => {
          const avg = tierScores[ti].reduce((a, b) => a + b, 0) / tierScores[ti].length;
          const avgColorClass =
            avg >= 70 ? PALETTE.green.text : avg >= 40 ? PALETTE.amber.text : PALETTE.red.text;
          const avgHex =
            avg >= 70 ? PALETTE.green.hex : avg >= 40 ? PALETTE.amber.hex : PALETTE.red.hex;
          const isExpanded = expandedTier === ti;
          const c = PALETTE[tier.colorKey];

          return (
            <div key={tier.name}>
              {ti > 0 && (
                <div className="flex justify-center">
                  <div className="h-5 w-[3px] bg-[#E8E4DC]" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setExpandedTier(isExpanded ? null : ti)}
                className={`w-full border-l-4 ${c.borderL} rounded-lg border border-[#E8E4DC] p-5 text-left transition-colors ${isExpanded ? "bg-[#F5F0E6]" : "bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[0.9rem] font-bold text-[#0A0A10]">{tier.name}</div>
                    <div className="mt-0.5 font-mono text-[0.6rem] text-[#999]">
                      {tier.factors.length} sub-factors · Avg: {avg.toFixed(0)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Runtime conic-gradient ring: the fill percentage is
                        continuous per-drag state, which Tailwind can't
                        express as a static class — the one legitimate
                        inline-style case per CONTRIBUTING.md, same pattern
                        already used for this codebase's other
                        conic-gradient decorations (home-hero.tsx,
                        newsletter-popup.tsx). */}
                    <div
                      className="flex size-10 items-center justify-center rounded-full"
                      style={{ background: `conic-gradient(${avgHex} ${avg}%, #E8E4DC ${avg}%)` }}
                    >
                      <div
                        className={`flex size-7.5 items-center justify-center rounded-full font-mono text-[0.6rem] font-bold ${avgColorClass} ${isExpanded ? "bg-[#F5F0E6]" : "bg-white"}`}
                      >
                        {avg.toFixed(0)}
                      </div>
                    </div>
                    <span
                      className={`text-[0.8rem] text-[#999] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    >
                      ▼
                    </span>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="rounded-b-lg border-x border-b border-[#E8E4DC] bg-[#F5F0E6] px-5 pt-4 pb-5">
                  {tier.factors.map((f, fi) => (
                    <div key={f} className="mb-3">
                      <div className="mb-1 flex justify-between">
                        <span className="text-[0.8rem] text-[#333]">{f}</span>
                        <span className={`font-mono text-[0.7rem] font-bold ${c.text}`}>
                          {tierScores[ti][fi]}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={tierScores[ti][fi]}
                        onChange={(e) => updateTierScore(ti, fi, Number(e.target.value))}
                        className={`h-1 w-full cursor-pointer rounded-full ${c.accent}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 4: WHY SYSTEMS FAIL
   ═══════════════════════════════════════════════════════════ */

function FailuresTab() {
  return (
    <>
      <h2 className={SECTION_TITLE}>Why Every Impact System Failed</h2>
      <p className="mb-6 text-[0.9rem] leading-relaxed text-[#666]">
        {FAILURES.length} failure patterns. Each one diagnosed. Each one fixed by SoulScore&apos;s
        architecture.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FAILURES.map((f) => {
          const sev = severityClasses(f.severity);
          return (
            <div
              key={f.title}
              className={`flex flex-col gap-2 rounded-lg border border-[#E8E4DC] border-t-3 ${sev.border} bg-white p-5`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex-1 text-[0.85rem] leading-snug font-bold text-[#0A0A10]">
                  {f.title}
                </span>
                <span
                  className={`rounded-sm ${sev.bgSolid} px-1.5 py-0.5 font-mono text-[0.6rem] font-bold whitespace-nowrap text-white`}
                >
                  SEV {f.severity}
                </span>
              </div>
              <div
                className={`rounded-sm ${PALETTE.green.bgSoft} px-2 py-1.5 text-[0.8rem] leading-snug ${PALETTE.green.text}`}
              >
                <span className="mr-1 font-mono text-[0.6rem] font-bold">
                  FIX <ForwardIcon aria-hidden="true" />
                </span>
                {f.fix}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 5: C-NPV CALCULATOR
   ═══════════════════════════════════════════════════════════ */

function CNPVTab({
  fcf,
  setFcf,
  consciousness,
  years,
  setYears,
  discount,
  setDiscount,
  cnpv,
}: {
  fcf: number;
  setFcf: (v: number) => void;
  consciousness: number;
  years: number;
  setYears: (v: number) => void;
  discount: number;
  setDiscount: (v: number) => void;
  cnpv: { standard: number; adjusted: number; premium: number };
}) {
  return (
    <>
      <h2 className={SECTION_TITLE}>Consciousness-Adjusted NPV</h2>
      <p className="mb-6 text-[0.9rem] leading-relaxed text-[#666]">
        What happens when consciousness enters the discount rate? The premium (or penalty) is real.
      </p>

      <div className={`${CARD} mb-4 grid gap-4 sm:grid-cols-2`}>
        <div>
          <div className={MONO_LABEL}>Annual Free Cash Flow</div>
          <input
            type="number"
            value={fcf}
            onChange={(e) => setFcf(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-[#E8E4DC] bg-[#FAFAF7] px-2 py-2 font-mono text-[0.85rem]"
          />
        </div>
        <div>
          <div className={MONO_LABEL}>Consciousness (from Measure tab)</div>
          <div className={`mt-1 font-heading text-2xl font-bold ${PALETTE.gold.text}`}>
            {consciousness}
          </div>
        </div>
        <div>
          <div className={MONO_LABEL}>Projection Years ({years})</div>
          <input
            type="range"
            min={3}
            max={20}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className={`mt-2 w-full ${PALETTE.gold.accent}`}
          />
        </div>
        <div>
          <div className={MONO_LABEL}>Discount Rate ({discount}%)</div>
          <input
            type="range"
            min={4}
            max={20}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className={`mt-2 w-full ${PALETTE.gold.accent}`}
          />
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className={CARD}>
          <div className={MONO_LABEL}>Standard NPV</div>
          <div className="mt-1 font-heading text-2xl font-bold text-[#666]">
            {formatCurrency(cnpv.standard)}
          </div>
        </div>
        <div className={`${CARD} border-2 ${PALETTE.goldLight.border} bg-[#FDF8E8]`}>
          <div className={MONO_LABEL}>Consciousness-Adjusted NPV</div>
          <div className={`mt-1 font-heading text-2xl font-bold ${PALETTE.gold.text}`}>
            {formatCurrency(cnpv.adjusted)}
          </div>
        </div>
        <div className={CARD}>
          <div className={MONO_LABEL}>Premium / Penalty</div>
          <div
            className={`mt-1 font-heading text-2xl font-bold ${cnpv.premium >= 0 ? PALETTE.green.text : PALETTE.red.text}`}
          >
            <AnimNum value={cnpv.premium} suffix="%" />
          </div>
          <div className="mt-1 font-mono text-[0.65rem] text-[#999]">
            Delta: {formatCurrency(cnpv.adjusted - cnpv.standard)}
          </div>
        </div>
      </div>

      <div className={`${CARD} mb-4`}>
        <div className={`mb-3 ${MONO_LABEL}`}>Reference Points</div>
        {CNPV_REFERENCE_POINTS.map((r, i) => (
          <div
            key={r.name}
            className={`flex items-center justify-between py-2 ${i < CNPV_REFERENCE_POINTS.length - 1 ? "border-b border-[#E8E4DC]" : ""}`}
          >
            <span className="text-[0.85rem]">{r.name}</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[0.7rem] text-[#999]">Hawkins {r.hawkins}</span>
              <span
                className={`font-mono text-[0.75rem] font-bold ${r.premium.startsWith("-") ? PALETTE.red.text : PALETTE.green.text}`}
              >
                {r.premium}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={`${CARD} bg-[#FAFAF7]`}>
        <div className={`mb-2 ${MONO_LABEL}`}>Formula</div>
        <code className="block font-mono text-[0.7rem] leading-loose text-[#0A0A10]">
          C-NPV = Σ [FCF_t × Consciousness_Multiplier / (1 + r_adjusted)^t]
          <br />
          Multiplier = 1.0 + (Consciousness - 100) / 1000
          <br />
          Discount adj = -0.4% per 50pts above 100 (capped 2%)
        </code>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 6: GIG ECONOMY
   ═══════════════════════════════════════════════════════════ */

function GigTab() {
  return (
    <>
      <h2 className={SECTION_TITLE}>The Gig Economy Problem</h2>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        {GIG_STATS.map((s, i) => (
          <div
            key={s.label}
            className={`${CARD} text-center ${i === 2 ? `${PALETTE.red.border} ${PALETTE.red.bgSoft}` : ""}`}
          >
            <div
              className={`font-heading text-2xl font-bold ${i === 2 ? PALETTE.red.text : "text-[#0A0A10]"}`}
            >
              {s.value}
            </div>
            <div className={MONO_LABEL}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={`${CARD} mb-4`}>
        <div className={`mb-4 ${MONO_LABEL}`}>{GIG_LAYERS.length}-Layer Impact Worker Stack</div>
        <div className="flex flex-col">
          {GIG_LAYERS.map((l, i) => {
            const c = PALETTE[l.colorKey];
            const Icon = l.icon;
            return (
              <div
                key={l.name}
                className={`border-l-4 ${c.borderL} ${c.bgSoft} px-4 py-3 ${i < GIG_LAYERS.length - 1 ? "border-b border-[#E8E4DC]" : ""}`}
              >
                <div className="inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-[#0A0A10]">
                  <Icon aria-hidden="true" className="size-4" /> {l.name}
                </div>
                <div className="mt-0.5 text-[0.8rem] text-[#666]">{l.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`${CARD} border-t-3 ${PALETTE.red.borderT}`}>
          <div className={`mb-2 font-mono text-[0.6rem] tracking-[0.15em] ${PALETTE.red.text}`}>
            EXTRACTIVE MODEL
          </div>
          <div className="mb-3 font-heading text-lg font-bold text-[#0A0A10]">
            Platform Gig Worker
          </div>
          <div className="flex flex-col gap-1.5 text-[0.8rem] text-[#666]">
            <div className="flex justify-between">
              <span>Hourly Rate</span>
              <span className="font-bold text-[#0A0A10]">$20/hr</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Take</span>
              <span className={`font-bold ${PALETTE.red.text}`}>-30%</span>
            </div>
            <div className="flex justify-between">
              <span>Benefits</span>
              <span className={`font-bold ${PALETTE.red.text}`}>None</span>
            </div>
            <div className="flex justify-between">
              <span>Impact Tokens</span>
              <span className={`font-bold ${PALETTE.red.text}`}>None</span>
            </div>
            <div className="flex justify-between">
              <span>Governance</span>
              <span className={`font-bold ${PALETTE.red.text}`}>None</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-[#E8E4DC] pt-1.5">
              <span className="font-bold">SoulScore</span>
              <span className={`font-mono font-bold ${PALETTE.red.text}`}>F — 12</span>
            </div>
          </div>
        </div>

        <div className={`${CARD} border-t-3 ${PALETTE.green.borderT}`}>
          <div className={`mb-2 font-mono text-[0.6rem] tracking-[0.15em] ${PALETTE.green.text}`}>
            REGENERATIVE MODEL
          </div>
          <div className="mb-3 font-heading text-lg font-bold text-[#0A0A10]">
            ImpactSoul Impact Worker
          </div>
          <div className="flex flex-col gap-1.5 text-[0.8rem] text-[#666]">
            <div className="flex justify-between">
              <span>Hourly Rate</span>
              <span className="font-bold text-[#0A0A10]">$20/hr</span>
            </div>
            <div className="flex justify-between">
              <span>Impact Tokens</span>
              <span className={`font-bold ${PALETTE.green.text}`}>+0.05 ABIT/outcome</span>
            </div>
            <div className="flex justify-between">
              <span>Benefits</span>
              <span className={`font-bold ${PALETTE.green.text}`}>Full + dividends</span>
            </div>
            <div className="flex justify-between">
              <span>Governance</span>
              <span className={`font-bold ${PALETTE.green.text}`}>DAO voting rights</span>
            </div>
            <div className="flex justify-between">
              <span>Impact Identity</span>
              <span className={`font-bold ${PALETTE.green.text}`}>Portable SoulScore</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-[#E8E4DC] pt-1.5">
              <span className="font-bold">SoulScore</span>
              <span className={`font-mono font-bold ${PALETTE.green.text}`}>B — 68</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
