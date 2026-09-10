// A shared, reusable radar chart for assessment results pages — the
// "Port shared radar-chart... components used across assessments" line
// item in NEXTJS-MIGRATION-TODO.md's Phase 9. Legacy defined an ad-hoc,
// slightly buggy version inline per page (e.g. FindYourDiet.tsx's own
// `RadarChart`: plain `score * 10` polar coordinates with no fixed max,
// no rings, no spokes — so radius scaled unboundedly with score and two
// assessments with different score ranges would render wildly different
// sizes). This version fixes that: values are normalized against an
// explicit `max` so every assessment's chart renders at a consistent
// scale, with reference rings/spokes for readability (same visual
// language as `components/marketing/charity-badges.tsx`'s RadarChart,
// generalized to accept arbitrary dimension counts/labels/an accent
// color instead of that component's fixed 7-dimension charity schema).
export function AssessmentRadarChart({
  scores,
  max,
  accentColor,
}: {
  scores: Record<string, number>;
  max: number;
  accentColor: string;
}) {
  const dims = Object.keys(scores);
  const n = dims.length;
  const cx = 150;
  const cy = 150;
  const r = 110;

  const getPoint = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (Math.max(0, Math.min(value, max)) / max) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const dataPoints = dims.map((d, i) => getPoint(i, scores[d]));
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 300 340" className="mx-auto w-full max-w-80">
      {rings.map((frac) => {
        const pts = dims.map((_, i) => getPoint(i, frac * max));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return (
          <path
            key={frac}
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.15"
          />
        );
      })}
      {dims.map((_, i) => {
        const p = getPoint(i, max);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.15"
          />
        );
      })}
      <path d={dataPath} fill={`${accentColor}26`} stroke={accentColor} strokeWidth="2" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={accentColor} stroke="white" strokeWidth="2" />
      ))}
      {dims.map((d, i) => {
        const p = getPoint(i, max * 1.24);
        return (
          <text
            key={d}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-current text-[9px]"
            opacity="0.7"
          >
            {d}
          </text>
        );
      })}
    </svg>
  );
}
