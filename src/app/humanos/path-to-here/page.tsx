import type { Metadata } from "next";
import Link from "next/link";
import { EyebrowLabel } from "@/components/marketing/eyebrow-label";
import { PATH_TIMELINE, DIAGNOSTIC_HREF } from "@/lib/content/humanos-content";

// Ported from legacy client/src/pages/humanos/HumanosPathToHere.tsx. Real
// bio note and all 6 timeline entries (2010 H+ Summit through 2025 Human
// OS 2.0) ported verbatim. "Take the Diagnostic" CTA -> /humanos/philosophy
// instead of legacy's dead `/assessment` (see the DIAGNOSTIC_HREF comment
// in lib/content/humanos-content.ts).
export const metadata: Metadata = {
  title: "Path to Here — HumanOS",
  description:
    "From the 2010 H+ Summit to today — Tony Greenberg's journey through enterprise technology, psychedelic medicine, impact tokenization, and the birth of Human OS 2.0.",
  alternates: { canonical: "/humanos/path-to-here" },
};

export default function HumanosPathToHere() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-8">
        <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
          The Path to Here
        </EyebrowLabel>
        <h1 className="mb-4 font-heading text-5xl leading-tight font-bold text-neutral-900 sm:text-6xl">
          Path to Here
        </h1>
        <p className="text-xl leading-relaxed text-neutral-600">
          From the 2010 H+ Summit to today — the architect&apos;s journey through enterprise
          technology, psychedelic medicine, impact tokenization, and the birth of a new operating
          system.
        </p>
      </section>

      {/* Bio note */}
      <section className="mx-auto max-w-3xl px-6 pb-8">
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-6">
          <p className="m-0 text-base leading-relaxed text-neutral-700">
            <strong className="text-neutral-900">Tony Greenberg</strong> — author of{" "}
            <em>Boy in the Human</em>, speaker alongside Kurzweil at the 2010 H+ Summit, founder of
            RampRate and ImpactSoul. Twenty-five years building at the intersection of technology,
            consciousness, and impact.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-3xl px-6 pt-8 pb-16">
        <div className="flex flex-col gap-10 border-l-2 border-violet-200 pl-8">
          {PATH_TIMELINE.map((t) => (
            <div key={t.year} className="relative">
              <div className="absolute top-1 -left-[2.55rem] size-3 rounded-full bg-violet-600" />
              <p className="mb-1 font-mono text-sm tracking-[0.1em] text-violet-600 uppercase">{t.year}</p>
              <h3 className="mb-2 font-heading text-xl font-semibold text-neutral-900">{t.title}</h3>
              <p className="m-0 text-base leading-relaxed text-neutral-700">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-50 px-6 pt-8 pb-20 text-center">
        <Link
          href={DIAGNOSTIC_HREF}
          className="inline-block rounded-sm bg-violet-600 px-10 py-4 font-mono text-sm tracking-[0.15em] text-white uppercase hover:bg-violet-500"
        >
          Take the Diagnostic
        </Link>
      </section>
    </>
  );
}
