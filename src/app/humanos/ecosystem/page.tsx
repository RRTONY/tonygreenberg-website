import type { Metadata } from "next";
import { EyebrowLabel } from "@/components/marketing/eyebrow-label";
import { PersonCard } from "@/components/humanos/person-card";
import { MENTOR, ADVISORS, PARTNERS, CLIENTS } from "@/lib/content/humanos-content";

// Ported from legacy client/src/pages/humanos/HumanosEcosystem.tsx. Real
// roster verbatim: the mentor (David Orban), all 8 ImpactSoul advisors,
// all 3 partners, and all 29 client names. Every person photo was a
// Manus-hosted `/api/img/` path (CONTRIBUTING.md rule 12) — dropped for
// the shared `PersonCard` initials-avatar treatment (component read once,
// used for all 12 people here plus the mentor on /humanos/philosophy).
export const metadata: Metadata = {
  title: "HumanOS Ecosystem",
  description:
    "The mentors, advisors, partners, and clients who form the HumanOS ecosystem — a council of architects rewriting the operating system of humanity.",
  alternates: { canonical: "/humanos/ecosystem" },
};

export default function HumanosEcosystem() {
  return (
    <>
      {/* HEADER */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-8">
        <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
          The Ecosystem
        </EyebrowLabel>
        <h1 className="mb-4 font-heading text-5xl leading-tight font-bold text-neutral-900 sm:text-6xl">
          The Ecosystem
        </h1>
        <p className="max-w-2xl text-xl leading-relaxed text-neutral-600">
          A council of architects, visionaries, and glitches united by a single purpose: to
          rewrite the operating system of humanity.
        </p>
      </section>

      {/* INSPIRATIONAL MENTOR */}
      <section className="mx-auto max-w-4xl px-6 pt-8 pb-16">
        <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
          Inspirational Mentor
        </EyebrowLabel>
        <p className="mb-6 text-base leading-relaxed text-neutral-600">
          A singular visionary guiding the evolution of human consciousness in the age of
          exponential technology.
        </p>
        <PersonCard person={MENTOR} />
      </section>

      {/* IMPACTSOUL ADVISORS */}
      <section className="border-y border-neutral-200 bg-neutral-100 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
            ImpactSoul Advisors
          </EyebrowLabel>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-neutral-600">
            Strategic architects and visionaries who bring decades of expertise across technology,
            finance, impact, and regeneration.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {ADVISORS.map((a) => (
              <PersonCard key={a.name} person={a} />
            ))}
          </div>
        </div>
      </section>

      {/* THE PARTNERS */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
          The Partners
        </EyebrowLabel>
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-neutral-600">
          Strategic allies and operational powerhouses driving the execution of the vision.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {PARTNERS.map((p) => (
            <PersonCard key={p.name} person={p} accent="emerald" />
          ))}
        </div>
      </section>

      {/* THE CLIENTS */}
      <section className="border-t border-neutral-200 bg-neutral-100 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
            The Clients
          </EyebrowLabel>
          <p className="mb-8 text-base leading-relaxed text-neutral-600">
            Built on the foundation of 20+ years of sourcing and impact advisory for the world&apos;s
            most innovative companies.
          </p>
          <div className="flex flex-wrap gap-2">
            {CLIENTS.map((c) => (
              <span
                key={c}
                className="rounded-md border border-neutral-200 bg-white px-3.5 py-2 font-mono text-xs tracking-[0.1em] text-neutral-700"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
