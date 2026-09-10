"use client";

// Ported from legacy client/src/components/AssessmentIntro.tsx — the
// shared landing/onboarding screen used by every "Find Your X"
// assessment (title, subtitle, description, stats row, "what you'll
// discover" list, begin CTA, privacy note). Real content/structure
// unchanged. `accentColor` is a genuinely per-assessment runtime value
// (~16 different hex accents across the assessment pages that reuse this
// one component) — Tailwind can't statically scan a value passed through
// a prop, so it stays inline per this repo's documented exception for
// values that can't be a static class; every other style is a static
// Tailwind class. The hero-image glitch/scanline treatment wasn't ported
// — none of the assessments built so far pass a `heroImage`, and it's the
// same decorative-flourish call made elsewhere in this migration; a plain
// image is rendered if one is ever passed.
interface AssessmentIntroProps {
  title: string;
  subtitle: string;
  description: string;
  stats: { questions: number; dimensions: number; minutes: number };
  whatYouGet: string[];
  accentColor: string;
  onBegin: () => void;
  heroImage?: string;
}

export function AssessmentIntro({
  title,
  subtitle,
  description,
  stats,
  whatYouGet,
  accentColor,
  onBegin,
  heroImage,
}: AssessmentIntroProps) {
  return (
    <div className="relative z-1 flex min-h-screen items-center justify-center px-6 pt-[clamp(5rem,8vw,8rem)] pb-16">
      <div className="max-w-160 text-center">
        {heroImage && (
          // eslint-disable-next-line @next/next/no-img-element -- decorative background art with a dynamic runtime accentColor overlay; not a next/image content case
          <img
            src={heroImage}
            alt=""
            className="mb-10 block h-auto w-full rounded-2xl brightness-[0.85] contrast-[1.1]"
          />
        )}

        <div
          className="mb-4 font-mono text-[11px] tracking-[0.3em] uppercase opacity-85"
          style={{ color: accentColor }}
        >
          A Tony Greenberg Assessment
        </div>

        <h1 className="mb-4 font-heading text-[clamp(2.5rem,7vw,4rem)] leading-[1.1] font-normal text-[#2C1810]">
          {title}
        </h1>

        <p className="mb-8 text-[clamp(1.05rem,2.5vw,1.25rem)] leading-relaxed text-[#5C4A3A] italic">
          {subtitle}
        </p>

        <p className="mx-auto mb-10 max-w-130 text-base leading-relaxed text-[#6B5B4F]">
          {description}
        </p>

        <div className="mb-8 flex justify-center gap-[clamp(1.5rem,4vw,3rem)]">
          {[
            { num: stats.questions, label: "Questions" },
            { num: stats.dimensions, label: "Dimensions" },
            { num: `~${stats.minutes}`, label: "Minutes" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl leading-none" style={{ color: accentColor }}>
                {stat.num}
              </div>
              <div className="mt-1 font-mono text-[11px] tracking-[0.15em] text-[#8B7B6B] uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div
          className="mb-10 rounded-xl border bg-white/35 p-6 text-left backdrop-blur-sm"
          style={{ borderColor: `${accentColor}33` }}
        >
          <div
            className="mb-3 font-mono text-[11px] tracking-[0.2em] uppercase"
            style={{ color: accentColor }}
          >
            What You&apos;ll Discover
          </div>
          <ul className="flex list-none flex-col gap-2 p-0">
            {whatYouGet.map((item) => (
              <li key={item} className="relative pl-5 text-[0.95rem] text-[#4A3A2E]">
                <span className="absolute left-0 font-semibold" style={{ color: accentColor }}>
                  ◆
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onBegin}
          className="rounded-[4px] border-none px-14 py-4 font-mono text-sm tracking-[0.2em] text-background uppercase transition-transform hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
            boxShadow: `0 4px 20px ${accentColor}44`,
          }}
        >
          Begin Assessment
        </button>

        <p className="mt-6 font-mono text-[10px] tracking-[0.1em] text-[#9B8B7B]">
          Results stored locally. No data shared. Ever.
        </p>
      </div>
    </div>
  );
}
