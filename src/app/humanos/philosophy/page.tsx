import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { EyebrowLabel } from "@/components/marketing/eyebrow-label";
import { PersonCard } from "@/components/humanos/person-card";
import { MENTOR } from "@/lib/content/humanos-content";

// Ported from legacy client/src/pages/humanos/HumanosPhilosophy.tsx. Real
// copy verbatim: "Boiling the Human", the David Orban pull-quote, "The
// Maximizer Trap" (4 real symptom chips), "The Conscious Satisficer" (4
// real unlocks + the Consciousness Scale image), and "The Shift"'s
// FROM -> TO table. David Orban's `/api/img/` headshot is dropped for the
// shared `PersonCard` initials-avatar treatment (see
// components/humanos/person-card.tsx) instead of an inline layout —
// consolidated into that shared component since Ecosystem needs the same
// treatment for 12 more people.
export const metadata: Metadata = {
  title: "HumanOS Philosophy",
  description:
    "The philosophical foundations of HumanOS: consciousness, agency, and human potential — Boiling the Human, the Maximizer Trap, and the Conscious Satisficer framework.",
  alternates: { canonical: "/humanos/philosophy" },
};

const CONSCIOUSNESS_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/consciousness-scale-HjPE8waC75o6fHtrhXiBKu.webp";

const MAXIMIZER_SYMPTOMS = ["Analysis Paralysis", "Chronic Dissatisfaction", "Decision Fatigue", "The \"Grass is Greener\" Syndrome"];
const SATISFICER_UNLOCKS = ["Radical Agency", "Deep Focus", "Joy in the Present", "Sustainable Growth"];
const SHIFT_ROWS = [
  { from: "External Validation", to: "Internal Resonance" },
  { from: "Endless Consumption", to: "Intentional Creation" },
  { from: "Fear of Missing Out", to: "Joy of Missing Out" },
];

export default function HumanosPhilosophy() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-12">
        <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
          The Philosophy
        </EyebrowLabel>
        <h1 className="mb-6 font-heading text-5xl leading-tight font-bold text-neutral-900 sm:text-6xl">
          The Philosophy
        </h1>
        <blockquote className="m-0 border-l-4 border-violet-600 pl-6 text-xl leading-relaxed text-neutral-600 italic">
          &ldquo;In a world designed to maximize everything, the revolutionary act is to choose
          enough.&rdquo;
        </blockquote>
      </section>

      {/* BOILING THE HUMAN */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
          Boiling the Human
        </EyebrowLabel>
        <p className="mb-6 text-lg leading-relaxed text-neutral-700">
          We are like frogs in a pot of water that is slowly heating up. The changes in our
          environment — the speed of information, the demand for attention, the erosion of privacy
          — have happened so gradually that we haven&apos;t noticed we are boiling alive.
        </p>
        <p className="mb-12 text-lg leading-relaxed text-neutral-700">
          This presentation, delivered at the H+ Summit, was the first warning shot. It outlines
          exactly how technology is outpacing our biological evolution and what we must do to
          survive it.
        </p>

        <PersonCard person={MENTOR} />
      </section>

      {/* THE MAXIMIZER TRAP */}
      <section className="border-y border-violet-100 bg-violet-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
            The Maximizer Trap
          </EyebrowLabel>
          <h2 className="mb-6 font-heading text-3xl leading-tight font-bold text-neutral-900 sm:text-4xl">
            The Maximizer Trap
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-neutral-700">
            The Maximizer is driven by the relentless pursuit of &ldquo;the best.&rdquo; Every
            decision is an optimization problem. Every outcome must be perfect.
          </p>
          <p className="mb-6 text-base text-neutral-600">This operating system leads to:</p>
          <div className="mb-6 grid grid-cols-2 gap-4">
            {MAXIMIZER_SYMPTOMS.map((item) => (
              <div
                key={item}
                className="rounded-md border border-violet-200 bg-white p-4 text-base font-medium text-neutral-900"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="text-base text-neutral-600">
            The Maximizer is a slave to the algorithm, constantly seeking an external validation of
            perfection that does not exist.
          </p>
        </div>
      </section>

      {/* THE CONSCIOUS SATISFICER */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-emerald-600 uppercase">
          The Conscious Satisficer
        </EyebrowLabel>
        <h2 className="mb-6 font-heading text-3xl leading-tight font-bold text-neutral-900 sm:text-4xl">
          The Conscious Satisficer
        </h2>
        <p className="mb-4 text-lg leading-relaxed text-neutral-700">
          The Satisficer is not about &ldquo;settling.&rdquo; It is about strategic selection. It is
          the ability to define your own criteria for success and stop when they are met.
        </p>
        <p className="mb-6 text-base text-neutral-600">This operating system unlocks:</p>
        <div className="mb-6 grid grid-cols-2 gap-4">
          {SATISFICER_UNLOCKS.map((item) => (
            <div
              key={item}
              className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-base font-medium text-neutral-900"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mb-10 text-base text-neutral-600">
          The Conscious Satisficer reclaims their cognitive bandwidth for what truly matters:
          creation, connection, and impact.
        </p>

        <div className="overflow-hidden rounded-lg border border-neutral-200 shadow-sm">
          <Image
            src={CONSCIOUSNESS_IMG}
            alt="Corporate Consciousness Scale"
            width={1200}
            height={800}
            className="w-full"
          />
        </div>
      </section>

      {/* THE SHIFT */}
      <section className="border-t border-neutral-200 bg-neutral-100 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
            The Shift
          </EyebrowLabel>
          <h2 className="mb-6 font-heading text-3xl leading-tight font-bold text-neutral-900 sm:text-4xl">
            The Shift
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-neutral-700">
            Human OS 2.0 is not just a mindset. It is a protocol for living. It requires a hard
            reset of your values, your habits, and your definitions of success.
          </p>

          <div className="flex flex-col gap-4">
            {SHIFT_ROWS.map((row) => (
              <div
                key={row.from}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div>
                  <p className="mb-1 font-mono text-[0.6rem] tracking-[0.1em] text-red-500/70 uppercase">From</p>
                  <p className="m-0 text-base text-neutral-600">{row.from}</p>
                </div>
                <span className="text-lg font-bold text-violet-600">&rarr;</span>
                <div>
                  <p className="mb-1 font-mono text-[0.6rem] tracking-[0.1em] text-emerald-600/70 uppercase">To</p>
                  <p className="m-0 text-base font-semibold text-neutral-900">{row.to}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="bg-neutral-50 px-6 py-16 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/living-declaration"
            className="inline-block rounded-sm bg-violet-600 px-10 py-4 font-mono text-sm tracking-[0.15em] text-white uppercase hover:bg-violet-500"
          >
            Read the Living Declaration
          </Link>
          <Link
            href="/humanos/path-to-here"
            className="inline-block rounded-sm border border-violet-300 px-10 py-4 font-mono text-sm tracking-[0.15em] text-violet-600 uppercase hover:bg-violet-50"
          >
            How I Got Here
          </Link>
        </div>
      </section>
    </>
  );
}
