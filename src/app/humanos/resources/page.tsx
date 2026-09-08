import type { Metadata } from "next";
import Link from "next/link";
import { EyebrowLabel } from "@/components/marketing/eyebrow-label";
import { PLAYBOOKS, DAILY_PRACTICES, READING_LIST, DIAGNOSTIC_HREF } from "@/lib/content/humanos-content";

// Ported from legacy client/src/pages/humanos/HumanosResources.tsx. Real
// content verbatim: all 4 transformation playbooks, all 3 daily-practice
// protocols (12 real items total), and all 8 reading-list entries.
// Playbook links: "The Attention Audit" -> /attention-theft (real, already
// live in this app); "The Satisficer Protocol" and the page's "Take the
// Diagnostic" CTA -> /humanos/philosophy, not legacy's dead `/assessment`
// (see the DIAGNOSTIC_HREF comment in lib/content/humanos-content.ts for
// why); "The Digital Sabbath" has no link in legacy either, kept that way;
// "The Consciousness Scale" -> /assessments/consciousness-scale, a real
// legacy route not yet built in this app but already an accepted
// forward-reference pattern elsewhere in this migration (see
// /living-declaration and engage-audit.tsx, both already linking to the
// not-yet-built /assessments hub).
export const metadata: Metadata = {
  title: "HumanOS Resources",
  description:
    "Transformation playbooks, daily practices, and the essential reading list that inform the HumanOS framework.",
  alternates: { canonical: "/humanos/resources" },
};

export default function HumanosResources() {
  return (
    <>
      {/* HEADER */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-8">
        <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
          The Resources
        </EyebrowLabel>
        <h1 className="mb-4 font-heading text-5xl leading-tight font-bold text-neutral-900 sm:text-6xl">
          Resources
        </h1>
        <p className="text-xl leading-relaxed text-neutral-600">
          Practical tools, daily protocols, and essential reading for upgrading your operating
          system.
        </p>
      </section>

      {/* TRANSFORMATION PLAYBOOKS */}
      <section className="mx-auto max-w-3xl px-6 pt-8 pb-16">
        <EyebrowLabel className="mb-4 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
          Transformation Playbooks
        </EyebrowLabel>
        <div className="flex flex-col gap-5">
          {PLAYBOOKS.map((pb) => (
            <div
              key={pb.num}
              className="flex items-start gap-5 rounded-lg border border-neutral-200 bg-white p-7 shadow-sm"
            >
              <span className="shrink-0 font-mono text-2xl leading-none font-bold text-violet-600">
                {pb.num}
              </span>
              <div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-neutral-900">{pb.title}</h3>
                <p className="mb-3 text-base leading-relaxed text-neutral-600">{pb.desc}</p>
                {pb.link && (
                  <Link
                    href={pb.link}
                    className="font-mono text-[0.65rem] tracking-[0.1em] text-violet-600 uppercase"
                  >
                    Explore &rarr;
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DAILY PRACTICES */}
      <section className="border-y border-emerald-100 bg-emerald-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-emerald-600 uppercase">
            Daily Practices
          </EyebrowLabel>
          <p className="mb-8 text-base leading-relaxed text-neutral-700">
            Small, consistent actions that compound into fundamental shifts. These are not
            suggestions — they are the operating system.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {DAILY_PRACTICES.map((dp) => (
              <div
                key={dp.title}
                className="rounded-lg border border-emerald-200 bg-white p-6 shadow-sm"
              >
                <h3 className="mb-4 font-heading text-base font-semibold text-neutral-900">{dp.title}</h3>
                <ul className="m-0 list-none p-0">
                  {dp.items.map((item) => (
                    <li key={item} className="relative mb-2 pl-4 text-sm leading-relaxed text-neutral-700">
                      <span className="absolute left-0 text-emerald-600">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESSENTIAL READING */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
          Essential Reading
        </EyebrowLabel>
        <p className="mb-8 text-base leading-relaxed text-neutral-600">
          The books that shaped this thinking. Not a comprehensive list — a curated one. Each
          title earned its place.
        </p>
        <div className="flex flex-col gap-4">
          {READING_LIST.map((book) => (
            <div key={book.title} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
              <h4 className="mb-1 font-heading text-lg font-semibold text-neutral-900">{book.title}</h4>
              <p className="mb-2 font-mono text-[0.6rem] tracking-[0.1em] text-violet-600 uppercase">
                {book.author}
              </p>
              <p className="m-0 text-base leading-relaxed text-neutral-600">{book.why}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="bg-neutral-50 px-6 pt-12 pb-20 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={DIAGNOSTIC_HREF}
            className="inline-block rounded-sm bg-violet-600 px-10 py-4 font-mono text-sm tracking-[0.15em] text-white uppercase hover:bg-violet-500"
          >
            Take the Diagnostic
          </Link>
          <Link
            href="/humanos/philosophy"
            className="inline-block rounded-sm border border-violet-300 px-10 py-4 font-mono text-sm tracking-[0.15em] text-violet-600 uppercase hover:bg-violet-50"
          >
            The Philosophy
          </Link>
        </div>
      </section>
    </>
  );
}
