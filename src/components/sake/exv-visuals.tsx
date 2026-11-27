"use client";

import { exvDimensions, getEXVTier, type EXVDimension, type EXVScore } from "@/lib/content/sake/exv-data";

// The EXV "soul print" radar charts and tier badge from the Sake app's Namazake.tsx (SoulPrint,
// TierBadge) and EXVSystem.tsx (LargeRadar), shared by /sake/namazake and /sake/exv. Same geometry,
// strokes and labels. Changed:
// - The app's TierBadge also rendered a whole <GlobalFooter /> (share row + copyright) inside every
//   badge, so each bottle card carried its own footer; that's gone (rule 20).
// - Fonts are classes (font-mono / font-sk-jp); the dimension and tier colors come from exv-data at
//   runtime, so they stay SVG attributes / the one allowed inline color.
// - LargeRadar's hover points can also be reached by keyboard (focus shows the dimension).

function pointFor(index: number, value: number, center: number, radius: number) {
  const angle = ((Math.PI * 2) / exvDimensions.length) * index - Math.PI / 2;
  const r = (value / 10) * radius;
  return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
}

function pathFor(points: { x: number; y: number }[]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
}

const RINGS = [2, 4, 6, 8, 10];

/** The app's mini radar (Namazake bottle cards). */
export function SoulPrint({ scores, size = 180, label }: { scores: EXVScore; size?: number; label?: string }) {
  const center = size / 2;
  const radius = size * 0.38;
  const dataPoints = exvDimensions.map((dim, i) => pointFor(i, scores[dim.key as keyof EXVScore], center, radius));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg soul-print" role="img" aria-label={label ?? "EXV soul print"}>
      {RINGS.map((ring) => (
        <path
          key={ring}
          d={pathFor(exvDimensions.map((_, i) => pointFor(i, ring, center, radius)))}
          fill="none"
          stroke="oklch(0.78 0.12 85 / 0.08)"
          strokeWidth="0.5"
        />
      ))}
      {exvDimensions.map((_, i) => {
        const end = pointFor(i, 10, center, radius);
        return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="oklch(0.78 0.12 85 / 0.12)" strokeWidth="0.5" />;
      })}
      <path d={pathFor(dataPoints)} fill="oklch(0.78 0.12 85 / 0.12)" stroke="oklch(0.78 0.12 85)" strokeWidth="1.5" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="oklch(0.78 0.12 85)" />
      ))}
      {exvDimensions.map((dim, i) => {
        const lp = pointFor(i, 12.5, center, radius);
        return (
          <text
            key={dim.key}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="oklch(0.65 0.01 85)"
            fontSize="8"
            letterSpacing="0.05em"
            className="font-mono"
          >
            {dim.kanji}
          </text>
        );
      })}
    </svg>
  );
}

/** The app's tier badge: kanji, score and tier name in the tier's color. */
export function TierBadge({ score }: { score: number }) {
  const tier = getEXVTier(score);
  return (
    <div className="flex items-center gap-2">
      <span className="font-sk-jp text-2xl font-bold" style={{ color: tier.color }}>
        {tier.kanji}
      </span>
      <div>
        <span className="text-xs font-mono tracking-wider" style={{ color: tier.color }}>
          {score}
        </span>
        <span className="text-[10px] text-[oklch(0.5_0.01_85)] ml-1 tracking-wider uppercase">{tier.name}</span>
      </div>
    </div>
  );
}

/** The app's large interactive radar (EXV page). */
export function LargeRadar({
  scores,
  size = 360,
  interactive = false,
  onHover,
}: {
  scores: EXVScore;
  size?: number;
  interactive?: boolean;
  onHover?: (dim: EXVDimension | null) => void;
}) {
  const center = size / 2;
  const radius = size * 0.36;
  const dataPoints = exvDimensions.map((dim, i) => pointFor(i, scores[dim.key as keyof EXVScore], center, radius));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="drop-shadow-xl max-w-full h-auto exv-chart"
      role="img"
      aria-label="EXV soul print: seven dimensions"
    >
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.78 0.12 85)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="oklch(0.78 0.12 85)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={center} cy={center} r={radius * 1.2} fill="url(#radarGlow)" />
      {RINGS.map((ring) => (
        <path
          key={ring}
          d={pathFor(exvDimensions.map((_, i) => pointFor(i, ring, center, radius)))}
          fill="none"
          stroke="oklch(0.78 0.12 85 / 0.06)"
          strokeWidth="0.5"
        />
      ))}
      {exvDimensions.map((_, i) => {
        const end = pointFor(i, 10, center, radius);
        return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="oklch(0.78 0.12 85 / 0.1)" strokeWidth="0.5" />;
      })}
      <path d={pathFor(dataPoints)} fill="oklch(0.78 0.12 85 / 0.1)" stroke="oklch(0.78 0.12 85)" strokeWidth="2" />
      {dataPoints.map((p, i) => {
        const dim = exvDimensions[i];
        return (
          <g key={dim.key}>
            {interactive && (
              <circle
                cx={p.x}
                cy={p.y}
                r="18"
                fill="transparent"
                className="cursor-pointer outline-none"
                tabIndex={0}
                aria-label={dim.name}
                onMouseEnter={() => onHover?.(dim)}
                onMouseLeave={() => onHover?.(null)}
                onFocus={() => onHover?.(dim)}
                onBlur={() => onHover?.(null)}
              />
            )}
            <circle cx={p.x} cy={p.y} r="4" fill={dim.color} stroke="oklch(0.06 0.02 270)" strokeWidth="2" pointerEvents="none" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fill={dim.color} fontSize="10" fontWeight="bold" className="font-mono" pointerEvents="none">
              {scores[dim.key as keyof EXVScore]}
            </text>
          </g>
        );
      })}
      {exvDimensions.map((dim, i) => {
        const lp = pointFor(i, 12.8, center, radius);
        return (
          <g key={dim.key}>
            <text x={lp.x} y={lp.y - 6} textAnchor="middle" dominantBaseline="middle" fill={dim.color} fontSize="18" fontWeight="bold" className="font-sk-jp">
              {dim.kanji}
            </text>
            <text
              x={lp.x}
              y={lp.y + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="oklch(0.55 0.01 85)"
              fontSize="7"
              letterSpacing="0.1em"
              className="font-mono"
            >
              {dim.name.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
