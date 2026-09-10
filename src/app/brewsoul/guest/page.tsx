import type { Metadata } from "next";
import Link from "next/link";

// Ported from legacy client/src/pages/brewsoul/GuestSeriesIndex.tsx —
// "The People Reshaping Coffee." Real single guest entry (Shanita
// Nicholas) with real headline/teaser/tags, unchanged, plus the real
// "more guests coming soon" note. Legacy's guest photo was the same dead
// Manus proxy confirmed 404 throughout this migration — dropped for a
// plain initial avatar rather than a broken headshot. Zero client-side
// state (only CSS-able hover) — ships as a Server Component.
export const metadata: Metadata = {
  title: "Guest Series — BrewSoul",
  description: "Expert voices in specialty coffee: farmers, roasters, scientists, and educators.",
  alternates: { canonical: "/brewsoul/guest" },
};

const GUESTS = [
  {
    name: "Shanita Nicholas",
    slug: "/brewsoul/guest/shanita-nicholas",
    headline: "Breaks the Coffee Industry's Comfortable Lies",
    teaser:
      "Fair Trade theater, roasting mythology, the C Market trap, and why origin-roasting is the only structural fix. A 10-question interrogation with one of coffee's most important truth-tellers.",
    tags: ["Fair Trade", "Supply Chain", "Origin Roasting", "Regenerative Economics"],
  },
];

export default function BrewSoulGuestPage() {
  return (
    <div>
      <section className="border-b-3 border-[#8b4c2a] bg-linear-to-br from-[#3B2F1E] to-[#2E4A3A] px-6 py-[clamp(48px,8vw,80px)] pb-12 text-center">
        <div className="mb-4 font-mono text-[11px] tracking-[0.2em] text-[#8B6914]">
          Tony G Guest Series
        </div>
        <h1 className="mx-auto mb-4 max-w-175 font-heading text-[clamp(28px,5vw,44px)] leading-[1.2] font-bold text-[#FAF8F2] italic">
          The People Reshaping Coffee
        </h1>
        <p className="mx-auto max-w-140 text-[clamp(14px,2vw,18px)] text-[#f5efe0]/80">
          Long-form interviews with the scientists, farmers, lawyers, and builders who refuse to let
          the industry stay comfortable.
        </p>
      </section>

      <section className="mx-auto max-w-200 px-6 py-12">
        {GUESTS.map((g) => (
          <Link
            key={g.slug}
            href={g.slug}
            className="mb-8 flex overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          >
            <div className="flex w-30 shrink-0 items-center justify-center bg-[#3B2F1E] font-heading text-4xl text-[#D4AF37] sm:w-45">
              {g.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 p-6 sm:p-8">
              <div className="mb-2 font-mono text-[10px] tracking-[0.15em] text-[#A0522D]">
                Guest Interview
              </div>
              <h2 className="mb-1 font-heading text-[clamp(18px,3vw,26px)] leading-[1.25] font-bold text-[#3B2F1E]">
                {g.name}
              </h2>
              <p className="mb-3 font-heading text-[clamp(14px,2vw,18px)] text-[#8B6914] italic">
                {g.headline}
              </p>
              <p className="mb-3 text-sm leading-relaxed text-[#5C4A32]">{g.teaser}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm bg-[#f5f1e8] px-2 py-1 font-mono text-[10px] tracking-wide text-[#5C4A32]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}

        <div className="mt-4 rounded-xl border-2 border-dashed border-[#8B6914]/20 px-6 py-10 text-center">
          <div className="mb-2 font-heading text-xl text-[#5C4A32] italic">
            More guests coming soon
          </div>
          <p className="text-sm text-[#5C4A32]/60">
            Farmers, roasters, scientists, and builders who are changing how coffee works.
          </p>
        </div>
      </section>
    </div>
  );
}
