import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react";
import { EyebrowLabel } from "@/components/marketing/eyebrow-label";
import { DIAGNOSTIC_HREF } from "@/lib/content/humanos-content";

// Ported from legacy client/src/pages/humanos/HumanosHome.tsx. Real hero
// copy ("HUMAN OS V2.0" / "The machine is perfect. BE THE GLITCH." /
// "Reclaim agency in the age of algorithmic control."), the full
// Maximizer-vs-Satisficer section copy, the "What You'll Discover" list,
// and the 4 "Explore the System" cards are all ported verbatim.
//
// Two things dropped, both deliberate:
// 1. The hero's `/api/img/humanos-hero-hand_73f45c74.jpg` background photo
//    — Manus-hosted, never referenced per CONTRIBUTING.md rule 12.
//    Replaced with a CSS gradient (`bg-linear-to-br` + a radial glow),
//    same "no substitute image fabricated" call made on /living-declaration.
// 2. The "Diagnostics Completed" counter (hardcoded start of 264,
//    incrementing by a random amount every 25–60s) and its "Someone just
//    discovered they're a Maximizer" toast — both entirely fabricated
//    client-side `Math.random()` activity with no real data behind them.
//    This migration has already made the call elsewhere to not port
//    backend-less fake interactivity (the manifesto's questionnaire became
//    a real email link instead of a dead-end form); a fake live-activity
//    counter is the same category of problem, so it's dropped rather than
//    shipped as real social proof it isn't.
export const metadata: Metadata = {
  title: "Human OS V2.0 — The Machine Is Perfect. Be The Glitch.",
  description:
    "Reclaim agency in the age of algorithmic control. Are you a Maximizer or a Satisficer? A framework for upgrading how you think, decide, and act.",
  alternates: { canonical: "/humanos" },
};

const SATISFICER_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/satisficer-vs-maximizer-8cWbpDMM6EHc2L6u3bi6xT.webp";

const DISCOVERIES = [
  "Your operating system type — Maximizer, Satisficer, or somewhere in between",
  "The algorithmic loops keeping you stuck in optimization mode",
  "A personalized protocol for reclaiming your cognitive bandwidth",
  "Practical tools for shifting from endless seeking to intentional choosing",
];

const EXPLORE_CARDS = [
  {
    title: "The Philosophy",
    desc: "Boiling the Human, the Maximizer Trap, and the Conscious Satisficer framework.",
    href: "/humanos/philosophy",
  },
  {
    title: "The Ecosystem",
    desc: "Mentors, advisors, partners, and the companies that shaped this thinking.",
    href: "/humanos/ecosystem",
  },
  {
    title: "Resources",
    desc: "Transformation playbooks, daily practices, and the essential reading list.",
    href: "/humanos/resources",
  },
  {
    title: "Path to Here",
    desc: "From the 2010 H+ Summit to today — the architect's journey.",
    href: "/humanos/path-to-here",
  },
];

export default function HumanosHome() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-linear-to-br from-neutral-950 via-violet-950 to-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.25),transparent_55%)]" />
        <div className="relative z-10 max-w-2xl px-6 pb-16">
          <p className="mb-5 inline-flex items-center gap-2 rounded-md bg-black/40 px-4 py-2 font-mono text-sm tracking-[0.2em] text-white/80 uppercase">
            <span className="inline-block size-2.5 rounded-full bg-emerald-400" />
            System Status: Awakening
          </p>

          <h1 className="mb-5 font-heading text-6xl leading-[0.95] font-bold text-white sm:text-7xl lg:text-8xl">
            Human
            <br />
            <span className="text-violet-400">OS V2.0</span>
          </h1>

          <p className="mb-2 text-2xl leading-snug font-medium text-white/95 sm:text-3xl">
            The machine is perfect.{" "}
            <span className="font-bold text-violet-400">BE THE GLITCH.</span>
          </p>

          <p className="text-lg text-white/80 sm:text-xl">
            Reclaim agency in the age of algorithmic control.
          </p>
        </div>
      </section>

      {/* MAXIMIZER VS SATISFICER */}
      <section className="bg-neutral-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
            The Core Question
          </EyebrowLabel>
          <h2 className="mb-6 font-heading text-4xl leading-tight font-bold text-neutral-900 sm:text-5xl">
            Are you a <span className="text-violet-600">Maximizer</span> or a{" "}
            <span className="text-violet-600">Satisficer</span>?
          </h2>

          <p className="mb-6 text-lg leading-relaxed text-neutral-700">
            We are being optimized to death. Every app, every feed, every notification is designed
            to make you believe that the next click, the next purchase, the next upgrade will
            finally make you complete. It won&apos;t. It can&apos;t. That&apos;s the trap.
          </p>
          <p className="mb-8 text-lg leading-relaxed text-neutral-700">
            <strong>Human OS 2.0</strong> is the counter-protocol. A system for the{" "}
            <strong className="text-violet-600">Conscious Satisficer</strong> — someone who has
            learned to define their own criteria for &ldquo;enough&rdquo; and stop when they get
            there. Not settling. <em>Choosing.</em>
          </p>

          <div className="my-8 overflow-hidden rounded-lg border border-neutral-200 shadow-sm">
            <Image
              src={SATISFICER_IMG}
              alt="Maximizer vs Satisficer — the two operating systems"
              width={1200}
              height={675}
              className="w-full"
            />
          </div>

          <div className="rounded-lg border border-violet-200 bg-violet-50 p-10">
            <EyebrowLabel className="mb-5 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
              What You&apos;ll Discover
            </EyebrowLabel>
            {DISCOVERIES.map((item) => (
              <div key={item} className="mb-3 flex items-start gap-3 last:mb-0">
                <span className="mt-0.5 shrink-0 font-mono text-sm text-violet-600">&rarr;</span>
                <p className="text-base leading-relaxed text-neutral-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE DIAGNOSTIC CTA */}
      <section className="bg-violet-50 px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Take the <span className="text-violet-600 italic">Diagnostic</span>
          </h2>
          <p className="mb-2 text-lg text-neutral-600 italic">
            &ldquo;Are you playing the game, or is the game playing you?&rdquo;
          </p>
          <p className="mb-8 text-base text-neutral-600">
            8 questions &bull; 3 minutes &bull; Discover your path to conscious agency
          </p>

          <div className="rounded-xl border border-neutral-200 bg-white p-10 shadow-sm">
            <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-violet-100">
              <Users size={28} className="text-violet-600" />
            </div>
            <h3 className="mb-4 font-heading text-2xl font-bold text-neutral-900">
              The Diagnostic
            </h3>
            <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-neutral-600">
              Are you a Maximizer or a Satisficer? Explore the framework to discover your
              decision-making pattern — and learn how to escape the optimization trap.
            </p>
            <Link
              href={DIAGNOSTIC_HREF}
              className="inline-block rounded-sm bg-violet-600 px-10 py-4 font-mono text-sm tracking-[0.15em] text-white uppercase hover:bg-violet-500"
            >
              Begin Diagnostic
            </Link>
          </div>
        </div>
      </section>

      {/* EXPLORE THE SYSTEM */}
      <section className="bg-neutral-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <EyebrowLabel className="mb-8 text-center font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
            Explore the System
          </EyebrowLabel>
          <div className="grid gap-6 sm:grid-cols-2">
            {EXPLORE_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="block rounded-lg border border-neutral-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 font-heading text-xl font-semibold text-neutral-900">
                  {card.title}
                </h3>
                <p className="text-base leading-relaxed text-neutral-600">{card.desc}</p>
                <span className="mt-5 inline-block font-mono text-xs tracking-[0.1em] text-violet-600 uppercase">
                  Explore &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
