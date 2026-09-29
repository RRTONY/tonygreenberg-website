import Link from "next/link";

// Ported from legacy client/src/pages/brewsoul/NextSteps.tsx — a "what's
// next" CTA block dropped at the bottom of BrewSoul content/reference/tool
// pages to avoid dead ends. Real content/behavior, unchanged — legacy's
// hover effects were plain color/transform changes, so this is a Server
// Component using `hover:` classes instead of JS mouse handlers.
export interface NextStep {
  label: string;
  path: string;
  description: string;
}

// One column on phones (three forced columns overflowed a 375px screen),
// then up to three. Full literal class strings, per the house rule.
const GRID_COLS: Record<number, string> = {
  1: "mx-auto mt-4 grid max-w-200 grid-cols-1 gap-4",
  2: "mx-auto mt-4 grid max-w-200 grid-cols-1 gap-4 sm:grid-cols-2",
  3: "mx-auto mt-4 grid max-w-200 grid-cols-1 gap-4 sm:grid-cols-3",
};

export function NextSteps({ steps, title = "Continue Your Journey" }: { steps: NextStep[]; title?: string }) {
  return (
    <div className="mt-12 border-t border-[#6F4E37]/10 pt-10">
      <div className="mb-2 text-center font-mono text-[0.68rem] tracking-[0.2em] text-[#7F6826] uppercase">
        {title}
      </div>
      <div className={GRID_COLS[Math.min(steps.length, 3)] ?? GRID_COLS[3]}>
        {steps.map((step) => (
          <Link
            key={step.path}
            href={step.path}
            className="rounded-lg border border-[#6F4E37]/8 bg-[#6F4E37]/4 p-5 text-center transition-all hover:-translate-y-0.5 hover:border-[#C5A23C]/20 hover:bg-[#C5A23C]/8"
          >
            <div className="mb-1 text-sm font-semibold text-[#2C1810]">{step.label}</div>
            <div className="font-mono text-[0.68rem] leading-relaxed text-[#6B5B4F]">{step.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
