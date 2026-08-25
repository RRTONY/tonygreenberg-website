import { Eye, EyeOff } from "lucide-react";
import type { CloakStatus, Grade, ScoreBreakdown } from "@/lib/content/charity-data";
import { SCORE_DIMENSIONS } from "@/lib/content/charity-data";

// Shared presentational pieces for /charity-scorecard and
// /charity-scorecard/[slug] — plain components with no state, so they're
// safe to render from either the Server Component profile page or the
// client-side rankings explorer without a "use client" directive.

const GRADE_CLASSES: Record<Grade, string> = {
  "A+": "bg-emerald-100 text-emerald-800 border-emerald-300",
  A: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "A-": "bg-green-50 text-green-700 border-green-200",
  "B+": "bg-blue-50 text-blue-700 border-blue-200",
  B: "bg-blue-50 text-blue-600 border-blue-200",
  "B-": "bg-sky-50 text-sky-700 border-sky-200",
  "C+": "bg-amber-50 text-amber-700 border-amber-200",
  C: "bg-amber-50 text-amber-600 border-amber-200",
  "C-": "bg-orange-50 text-orange-700 border-orange-200",
  D: "bg-red-50 text-red-600 border-red-200",
  F: "bg-red-100 text-red-800 border-red-300",
};

export function GradeBadge({ grade, size = "sm" }: { grade: Grade; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "px-4 py-2 text-2xl font-bold" : "px-2 py-0.5 text-xs font-bold";
  return (
    <span className={`inline-flex items-center rounded border font-mono ${GRADE_CLASSES[grade]} ${sizeClass}`}>
      {grade}
    </span>
  );
}

const CLOAK_CONFIG: Record<CloakStatus, { icon: typeof Eye; label: string; cls: string; desc: string }> = {
  clear: { icon: Eye, label: "Clear", cls: "text-emerald-600", desc: "Full transparency. Open data. Nothing hidden." },
  "mostly-clear": { icon: Eye, label: "Mostly Clear", cls: "text-blue-600", desc: "Good disclosure with minor gaps." },
  hazy: { icon: EyeOff, label: "Hazy", cls: "text-amber-600", desc: "Significant information gaps." },
  opaque: { icon: EyeOff, label: "Opaque", cls: "text-red-600", desc: "Material information withheld." },
};

const CLOAK_PANEL_CLASSES: Record<CloakStatus, string> = {
  clear: "text-emerald-600 bg-emerald-50 border-emerald-200",
  "mostly-clear": "text-blue-600 bg-blue-50 border-blue-200",
  hazy: "text-amber-600 bg-amber-50 border-amber-200",
  opaque: "text-red-600 bg-red-50 border-red-200",
};

export function CloakBadge({ status }: { status: CloakStatus }) {
  const { icon: Icon, label, cls } = CLOAK_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${cls}`}>
      <Icon className="size-3" /> {label}
    </span>
  );
}

export function CloakPanel({ status }: { status: CloakStatus }) {
  const { icon: Icon, label, desc } = CLOAK_CONFIG[status];
  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 ${CLOAK_PANEL_CLASSES[status]}`}>
      <Icon className="size-5" />
      <div>
        <span className="text-sm font-semibold">{label}</span>
        <p className="text-xs opacity-80">{desc}</p>
      </div>
    </div>
  );
}

export function ScoreBar({ score, label, weight }: { score: number; label: string; weight: number }) {
  const color = score >= 90 ? "bg-emerald-500" : score >= 80 ? "bg-blue-500" : score >= 70 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">
          {weight}% weight · <span className="font-mono font-bold">{score}</span>/100
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function RadarChart({ scores }: { scores: ScoreBreakdown }) {
  const dims = SCORE_DIMENSIONS;
  const cx = 150;
  const cy = 150;
  const r = 120;
  const n = dims.length;

  const getPoint = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const rings = [20, 40, 60, 80, 100];
  const dataPoints = dims.map((d, i) => getPoint(i, scores[d.key]));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 300 300" className="mx-auto w-full max-w-80">
      {rings.map((val) => {
        const pts = dims.map((_, i) => getPoint(i, val));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={val} d={path} fill="none" stroke="oklch(0.85 0.06 80)" strokeWidth="0.5" opacity="0.5" />;
      })}
      {dims.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="oklch(0.85 0.06 80)" strokeWidth="0.5" opacity="0.5" />;
      })}
      <path d={dataPath} fill="oklch(0.55 0.12 80 / 0.15)" stroke="oklch(0.55 0.12 80)" strokeWidth="2" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="oklch(0.55 0.12 80)" stroke="white" strokeWidth="2" />
      ))}
      {dims.map((d, i) => {
        const p = getPoint(i, 115);
        const anchor = p.x < cx - 10 ? "end" : p.x > cx + 10 ? "start" : "middle";
        return (
          <text
            key={d.key}
            x={p.x}
            y={p.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-current text-[9px] text-muted-foreground"
            fontFamily="'DM Mono', monospace"
          >
            {d.label.split(" ").slice(0, 2).join(" ")}
          </text>
        );
      })}
    </svg>
  );
}

export function evaluatorBadges(charity: {
  givewell: "top" | "standout" | "reviewed" | null;
  cnStars: number | null;
  charityWatch: string | null;
  candidSeal: string | null;
}) {
  const badges: { label: string; value: string; cls: string }[] = [];
  if (charity.givewell) {
    badges.push({
      label: "GiveWell",
      value: charity.givewell === "top" ? "Top" : "Standout",
      cls: charity.givewell === "top" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800",
    });
  }
  if (charity.cnStars) {
    badges.push({
      label: "CN",
      value: `${charity.cnStars}★`,
      cls: charity.cnStars >= 4 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800",
    });
  }
  if (charity.charityWatch) {
    badges.push({
      label: "CW",
      value: charity.charityWatch,
      cls: charity.charityWatch.startsWith("A") ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800",
    });
  }
  if (charity.candidSeal) {
    badges.push({
      label: "Candid",
      value: charity.candidSeal.charAt(0).toUpperCase() + charity.candidSeal.slice(1),
      cls: charity.candidSeal === "platinum" ? "bg-purple-100 text-purple-800" : "bg-amber-100 text-amber-800",
    });
  }
  return badges;
}

export function EvaluatorBadges({
  charity,
}: {
  charity: {
    givewell: "top" | "standout" | "reviewed" | null;
    cnStars: number | null;
    charityWatch: string | null;
    candidSeal: string | null;
  };
}) {
  const badges = evaluatorBadges(charity);
  if (badges.length === 0) return <span className="text-xs text-muted-foreground italic">Not rated</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b) => (
        <span key={b.label} className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium ${b.cls}`}>
          {b.label}: {b.value}
        </span>
      ))}
    </div>
  );
}
