import { HexProgress } from "@/components/aqueous/awi-badge";
import { hexPoints } from "@/lib/content/aqueous/hex";
import { getGradeColor, type QPRGrade } from "@/lib/content/aqueous/water-data";

// Ported from the Aqueous app's client/src/components/QPRBadge.tsx (2026-11-24).
// QPR Score Badge: hexagonal sacred geometry motif, animated fill like water rising in a vessel.
// The motion.polygon draw is HexProgress (awi-badge.tsx), a CSS transition at the app's timing.

interface QPRBadgeProps {
  score: number;
  grade: QPRGrade;
  size?: "sm" | "md" | "lg";
  showGrade?: boolean;
  animated?: boolean;
}

const dimensions = {
  sm: { outer: 56, inner: 48, fontSize: 14, gradeSize: 9, strokeWidth: 2 },
  md: { outer: 80, inner: 70, fontSize: 22, gradeSize: 11, strokeWidth: 2.5 },
  lg: { outer: 120, inner: 106, fontSize: 34, gradeSize: 14, strokeWidth: 3 },
};

export function QPRBadge({ score, grade, size = "md", showGrade = true, animated = true }: QPRBadgeProps) {
  const gradeColor = getGradeColor(grade);

  const d = dimensions[size];
  const center = d.outer / 2;
  const radius = d.inner / 2;
  const points = hexPoints(center, radius);

  // Progress ring (hexagonal)
  const circumference = 6 * radius * Math.sin(Math.PI / 6) * 2;
  const progress = (score / 100) * circumference;

  return (
    <div className="pulse-glow relative inline-flex items-center justify-center rounded-full">
      <svg width={d.outer} height={d.outer} viewBox={`0 0 ${d.outer} ${d.outer}`} role="img" aria-label={`QPR score ${score}, grade ${grade}`}>
        {/* Background hexagon */}
        <polygon points={points} fill="none" stroke="currentColor" strokeWidth={d.strokeWidth} className="text-border" />
        {/* Progress hexagon */}
        <HexProgress
          points={points}
          stroke={gradeColor}
          strokeWidth={d.strokeWidth}
          circumference={circumference}
          progress={progress}
          animated={animated}
        />
        {/* Score text */}
        <text
          x={center}
          y={showGrade ? center - 2 : center + 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={d.fontSize}
          fontWeight="700"
          fill={gradeColor}
        >
          {score}
        </text>
        {/* Grade text */}
        {showGrade && (
          <text
            x={center}
            y={center + d.fontSize * 0.65}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={d.gradeSize}
            fontWeight="600"
            fill={gradeColor}
            opacity={0.8}
          >
            {grade}
          </text>
        )}
      </svg>
    </div>
  );
}
