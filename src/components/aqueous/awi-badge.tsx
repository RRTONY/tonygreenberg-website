"use client";

import { useEffect, useState } from "react";
import { getAWIGrade, getAWIGradeColor, getAWIScoreColor, type AWIScore } from "@/lib/content/aqueous/awi-engine";
import { cn } from "@/lib/utils";
import { hexPoints } from "@/lib/content/aqueous/hex";

export { hexPoints };

// Ported from the Aqueous app's client/src/components/AWIBadge.tsx (2026-11-24).
// AWI Score Badge: inverted scale hexagonal badge. 1 = PERFECTION (green glow), 100 = WORST.
// Shows personal score + industry consensus side by side.
// framer-motion is gone (CONTRIBUTING rule 5): the ring's strokeDashoffset draw and the compare
// bar's scaleY grow are CSS transitions switched on one frame after mount (useAfterMount).
// Colors that depend on the score are runtime values, so they stay as SVG attributes / inline style.

/** True one frame after mount (when `enabled`), so a CSS transition runs from the initial value. */
export function useAfterMount(enabled = true) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setOn(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [enabled]);
  return on;
}

/**
 * The hexagon progress ring shared with QPRBadge. Was a motion.polygon with
 * initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - progress }}
 * transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}.
 */
export function HexProgress({
  points,
  stroke,
  strokeWidth,
  circumference,
  progress,
  animated,
}: {
  points: string;
  stroke: string;
  strokeWidth: number;
  circumference: number;
  progress: number;
  animated: boolean;
}) {
  const drawn = useAfterMount(animated);
  const offset = animated && !drawn ? circumference : circumference - progress;
  return (
    <polygon
      points={points}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={circumference}
      strokeDashoffset={offset}
      strokeLinecap="round"
      data-drawn={animated ? String(drawn) : "static"}
      className="transition-[stroke-dashoffset] delay-300 duration-1500 ease-out motion-reduce:transition-none"
    />
  );
}

interface AWIBadgeProps {
  awi: AWIScore;
  size?: "sm" | "md" | "lg" | "xl";
  showConsensus?: boolean;
  showInsight?: boolean;
  animated?: boolean;
}

// The app's label fontSize (7/8/10/12px) as literal classes.
const dimensions = {
  sm: { outer: 60, inner: 52, fontSize: 18, gradeSize: 8, labelClass: "text-[7px]", strokeWidth: 2 },
  md: { outer: 88, inner: 76, fontSize: 28, gradeSize: 10, labelClass: "text-[8px]", strokeWidth: 2.5 },
  lg: { outer: 130, inner: 114, fontSize: 42, gradeSize: 13, labelClass: "text-[10px]", strokeWidth: 3 },
  xl: { outer: 170, inner: 150, fontSize: 56, gradeSize: 16, labelClass: "text-[12px]", strokeWidth: 3.5 },
};


// The app's boxShadow `${glowIntensity} ${glowColor}` (lower score = more glow), as literal classes.
function glowClass(score: number) {
  if (score <= 10) return "shadow-[0_0_24px_6px_rgba(10,135,84,0.3)]";
  if (score <= 25) return "shadow-[0_0_16px_4px_rgba(45,157,90,0.2)]";
  return "shadow-[0_0_8px_2px_transparent]";
}

export function AWIBadge({ awi, size = "md", showConsensus = false, showInsight = false, animated = true }: AWIBadgeProps) {
  const score = awi.personalScore;
  const grade = awi.grade;
  const gradeColor = getAWIGradeColor(grade);
  const scoreColor = getAWIScoreColor(score);

  const d = dimensions[size];
  const center = d.outer / 2;
  const radius = d.inner / 2;
  const points = hexPoints(center, radius);

  // Progress ring, inverted: score 1 = full ring, score 100 = empty ring.
  const circumference = 6 * radius * Math.sin(Math.PI / 6) * 2;
  const progressPercent = (101 - score) / 100; // 1→100%, 100→1%
  const progress = progressPercent * circumference;

  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      {/* Main Badge */}
      <div className={cn("relative inline-flex items-center justify-center rounded-full", glowClass(score))}>
        <svg width={d.outer} height={d.outer} viewBox={`0 0 ${d.outer} ${d.outer}`} role="img" aria-label={`AWI score ${score}, ${grade}`}>
          {/* Background hexagon */}
          <polygon points={points} fill="none" stroke="currentColor" strokeWidth={d.strokeWidth} className="text-border" />
          {/* Progress hexagon: fills based on how close to 1 */}
          <HexProgress
            points={points}
            stroke={scoreColor}
            strokeWidth={d.strokeWidth}
            circumference={circumference}
            progress={progress}
            animated={animated}
          />
          {/* Score number */}
          <text
            x={center}
            y={center - (size === "sm" ? 1 : 4)}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={d.fontSize}
            fontWeight="800"
            fill={gradeColor}
            className="font-data"
          >
            {score}
          </text>
          {/* Grade label */}
          <text
            x={center}
            y={center + d.fontSize * 0.55}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={d.gradeSize}
            fontWeight="600"
            fill={gradeColor}
            opacity={0.85}
            className="tracking-[0.08em]"
          >
            {grade}
          </text>
        </svg>
      </div>

      {/* AWI Label */}
      <span className={cn("tracking-widest text-muted-foreground uppercase", d.labelClass)}>AWI Score</span>

      {/* Industry Consensus (optional) */}
      {showConsensus && (
        <div className="mt-1 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/60 px-2.5 py-1">
            <span className="text-xs text-muted-foreground">Industry:</span>
            <span className="font-data text-xs font-bold" style={{ color: getAWIScoreColor(awi.industryConsensus) }}>
              {awi.industryConsensus}
            </span>
            {awi.crossRefSources > 0 && <span className="text-xs text-muted-foreground/60">({awi.crossRefSources} sources)</span>}
          </div>
        </div>
      )}

      {/* Personal Insight (optional) */}
      {showInsight && awi.personalInsight && (
        <p className="mt-1 max-w-[240px] text-center text-xs leading-relaxed text-muted-foreground">{awi.personalInsight}</p>
      )}
    </div>
  );
}

// ── Compact inline AWI score (for cards and lists) ──────────

interface AWIInlineProps {
  score: number;
  showLabel?: boolean;
  className?: string;
}

export function AWIInline({ score, showLabel = true, className = "" }: AWIInlineProps) {
  const color = getAWIScoreColor(score);
  const grade = getAWIGrade(score);

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="font-data text-sm font-bold" style={{ color }}>
        {score}
      </span>
      <span className="text-xs font-semibold tracking-wider uppercase opacity-80" style={{ color }}>
        {grade}
      </span>
      {showLabel && <span className="text-xs text-muted-foreground/50">AWI</span>}
    </div>
  );
}

// ── Score comparison bar (personal vs industry) ─────────────

interface AWICompareBarProps {
  personalScore: number;
  industryConsensus: number;
}

export function AWICompareBar({ personalScore, industryConsensus }: AWICompareBarProps) {
  // Markers were motion.divs: initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}, 0.5s, delays 0.5s / 0.7s.
  const grown = useAfterMount();
  const personalColor = getAWIScoreColor(personalScore);
  const industryColor = getAWIScoreColor(industryConsensus);
  return (
    <div className="w-full space-y-2">
      {/* Scale reference */}
      <div className="flex justify-between px-0.5 text-xs text-muted-foreground/60">
        <span>1 (Perfect)</span>
        <span>100 (Worst)</span>
      </div>
      {/* Bar */}
      <div className="relative h-3 overflow-hidden rounded-full bg-muted/60">
        {/* Gradient background */}
        <div className="absolute inset-0 rounded-full bg-[linear-gradient(to_right,#0A8754,#2D9D5A,#4ECDC4,#D4A574,#C75B39,#9B2335)] opacity-15" />
        {/* Personal score marker */}
        <div
          data-testid="awi-personal-marker"
          className={cn(
            "absolute top-0 bottom-0 w-1 rounded-full transition-transform delay-500 duration-500 motion-reduce:transition-none",
            grown ? "scale-y-100" : "scale-y-0",
          )}
          style={{
            left: `${((personalScore - 1) / 99) * 100}%`,
            backgroundColor: personalColor,
            boxShadow: `0 0 8px ${personalColor}`,
          }}
        />
        {/* Industry consensus marker */}
        <div
          data-testid="awi-industry-marker"
          className={cn(
            "absolute top-0 bottom-0 w-1 rounded-full border border-white/50 opacity-60 transition-transform delay-700 duration-500 motion-reduce:transition-none",
            grown ? "scale-y-100" : "scale-y-0",
          )}
          style={{ left: `${((industryConsensus - 1) / 99) * 100}%`, backgroundColor: industryColor }}
        />
      </div>
      {/* Labels */}
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full" style={{ backgroundColor: personalColor }} />
          <span className="text-muted-foreground">Your Score: </span>
          <span className="font-data font-bold" style={{ color: personalColor }}>
            {personalScore}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full opacity-60" style={{ backgroundColor: industryColor }} />
          <span className="text-muted-foreground">Industry: </span>
          <span className="font-data font-bold opacity-70" style={{ color: industryColor }}>
            {industryConsensus}
          </span>
        </div>
      </div>
    </div>
  );
}
