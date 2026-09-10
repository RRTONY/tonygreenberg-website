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

export function NextSteps({
  steps,
  title = "Continue Your Journey",
}: {
  steps: NextStep[];
  title?: string;
}) {
  return (
    <div className="mt-12 border-t border-[#6F4E37]/10 pt-10">
      <div className="mb-2 text-center font-mono text-[0.68rem] tracking-[0.2em] text-[#C5A23C] uppercase">
        {title}
      </div>
      <div
        className="mx-auto mt-4 grid max-w-[800px] gap-4"
        style={{ gridTemplateColumns: `repeat(${Math.min(steps.length, 3)}, 1fr)` }}
      >
        {steps.map((step) => (
          <Link
            key={step.path}
            href={step.path}
            className="rounded-lg border border-[#6F4E37]/8 bg-[#6F4E37]/4 p-5 text-center transition-all hover:-translate-y-0.5 hover:border-[#C5A23C]/20 hover:bg-[#C5A23C]/8"
          >
            <div className="mb-1 text-sm font-semibold text-[#2C1810]">{step.label}</div>
            <div className="font-mono text-[0.68rem] leading-relaxed text-[#6B5B4F]">
              {step.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
