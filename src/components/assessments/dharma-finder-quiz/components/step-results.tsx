"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker } from "@/components/assessments/journey-tracker";
import { ACCENT } from "../data/dharma-finder.data";
import type { StepProps } from "../dharma-finder-quiz";

// Step 4: the dharma profile. Unchanged from the earlier port.
export function StepResults({ quiz }: StepProps) {
  const { archetypes, coreValues, completionDepth, totalAnswered } = quiz.profile;

  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="journey" />

      <div className="border-b border-brand-gold/10 p-6 text-center">
        <Link href="/find-your-me" className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.1em] text-[#4A3A2A]">
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to Find My
        </Link>
      </div>

      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <div className="mb-4 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">Your Dharma Profile</div>
        <h1 className="mb-4 font-heading text-[clamp(2rem,4vw,3rem)] font-normal">The Threads of Your Purpose</h1>
        <p className="mx-auto max-w-150 text-[1.1rem] text-[#5A4A3A]">
          Based on your {totalAnswered} response{totalAnswered === 1 ? "" : "s"}, here&apos;s what the inquiry reveals about the shape of your dharma.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-8">
        <h2 className="mb-6 font-heading text-2xl font-normal">Your Archetypal Roles</h2>
        <div className="mb-10 flex flex-wrap gap-3">
          {archetypes.map((a) => (
            <span key={a} className="rounded-sm bg-linear-to-br from-brand-gold to-brand-gold-light px-5 py-2 font-mono text-[0.85rem] tracking-[0.05em] text-[#F5F0E0]">
              {a}
            </span>
          ))}
        </div>

        <h2 className="mb-6 font-heading text-2xl font-normal">Core Values Detected</h2>
        <div className="mb-10 flex flex-col gap-3">
          {coreValues.map((v) => (
            <div key={v} className="border border-black/10 bg-white/50 px-5 py-3 text-[1.05rem] text-[#333]">
              <span className="mr-2 font-semibold text-brand-gold">◆</span>
              {v}
            </div>
          ))}
        </div>

        <h2 className="mb-4 font-heading text-2xl font-normal">Depth of Inquiry</h2>
        <div className="mb-1.5 h-2 rounded-sm bg-black/8">
          <div className="h-full rounded-sm bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-1000" style={{ width: `${completionDepth}%` }} />
        </div>
        <p className="font-mono text-[0.8rem] text-[#736455]">{completionDepth}% of questions explored</p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <div className="rounded-sm bg-[#0A0A10] p-8 text-[#F5F0E0]">
          <p className="mb-4 font-mono text-[0.7rem] tracking-[0.2em] text-brand-gold-light uppercase">Tony&apos;s Note</p>
          <p className="text-[1.05rem] leading-[1.8]">
            This 25-question version is a doorway. Daniel Schmachtenberger&apos;s full Dharma Inquiry contains 200-300 questions and takes roughly
            three hours of deep, honest reflection. Having shared it with over 100 people across two decades, it remains the most transformative
            self-inquiry exercise encountered in a lifetime of searching. The full version lives at{" "}
            <a href="https://civilizationemerging.com/dharma-inquiry-original-version/" target="_blank" rel="noopener noreferrer" className="text-brand-gold-light underline">
              civilizationemerging.com
            </a>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <JourneyTracker variant="light" currentAssessmentId="find-your-purpose" />
      </section>

      <section className="mx-auto max-w-3xl border-t border-brand-gold/10 px-6 py-8">
        <div className="mb-2 text-center font-mono text-[0.65rem] tracking-[0.25em] text-brand-gold uppercase">The Journey Continues</div>
        <p className="mb-6 text-center text-[0.95rem] text-[#666]">You&apos;ve found your dharma. Now explore the dimensions that shape it.</p>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {[
            { name: "Find Your Therapy", hook: "Matched to your wiring, not a waitlist.", href: "/find-your-therapy" },
            { name: "Find Your Spirit", hook: "Map your beliefs across 10 dimensions.", href: "/find-your-spirit" },
            { name: "Find Your Level", hook: "Where you sit on the consciousness scale.", href: "/consciousness-scale" },
            { name: "Find Your Me", hook: "The gateway to the whole ecosystem.", href: "/find-your-me" },
          ].map((next) => (
            <Link key={next.name} href={next.href} className="block rounded-lg border border-black/6 bg-white/40 p-5 transition-colors hover:border-brand-gold/40">
              <div className="mb-2 font-mono text-[0.7rem] font-semibold text-brand-gold">{next.name}</div>
              <div className="text-[0.82rem] leading-relaxed text-[#888]">{next.hook}</div>
            </Link>
          ))}
        </div>
      </section>

      <WhatsNext />

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-16 text-center">
        <AssessmentResultActions
          accentColor={ACCENT}
          resultSlug="dharma-finder"
          resultSummary={`Roles: ${archetypes.join(", ")}; Values: ${coreValues.join(", ")}`}
        />
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={quiz.retake}
            className="rounded-sm border border-brand-gold/40 px-8 py-3 font-mono text-[0.75rem] tracking-[0.15em] text-brand-gold uppercase"
          >
            Retake Assessment
          </button>
          <Link
            href="/blog/love-as-dharma-a-science-based-playbook-for-magnetic-partnership"
            className="rounded-sm border border-black/20 px-8 py-3 font-mono text-[0.75rem] tracking-[0.15em] text-[#333] uppercase"
          >
            Read: Love as Dharma
          </Link>
        </div>
      </section>

      <footer className="border-t border-brand-gold/8 px-6 py-8 text-center">
        <p className="mb-2 font-heading text-sm text-[#555] italic">The privilege of a lifetime is to become who you truly are.</p>
        <p className="font-mono text-[0.6rem] tracking-[0.1em] text-[#444]">Part of the Find My Ecosystem by Tony Greenberg</p>
      </footer>
    </div>
  );
}
