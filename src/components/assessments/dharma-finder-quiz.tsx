"use client";

import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/DharmaFinder.tsx — a real
// 25-question open-reflection inquiry distilled from Daniel
// Schmachtenberger's Dharma Inquiry, grouped into 4 real sections
// (Capacities/Values/Propensities/The Shadow Inquiry) each with a real
// framing quote, plus 3 real interstitial quotes shown between sections.
// Unlike the other "Find Your X" assessments in this ecosystem, this one
// has no multiple-choice dimensions to score — every question is a free-
// text reflection prompt, and legacy's own `generateDharmaProfile`
// derives "archetypal roles" and "core values" via keyword-matching over
// the free text. All 25 questions, all 4 section quotes, all 3
// interstitial quotes, and the keyword-matching profile logic (including
// its exact keyword lists and the "Seeker"/"deep values" fallback
// strings) are ported unchanged and verbatim. Because there's no
// dimension set, `AssessmentIntro`'s "Dimensions" stat is filled with the
// section count (4) as the closest honest structural analog — same kind
// of best-fit-under-a-fixed-label judgment call as AssessmentIntro's own
// accentColor exception; no `AssessmentRadarChart` is used since there
// are no real per-dimension scores to plot.
//
// Real bug found and fixed: legacy's result-screen JSX had the
// `<AssessmentResultActions>` component and its trailing "Retake
// Assessment" text both rendered *inside* the "Retake Assessment"
// `<button>` element (a comment, a component, and a text node sitting
// between `<button onClick=...>` and its label, `</button>` closing much
// later) — invalid HTML (a button-containing-component that itself
// renders buttons, i.e. a button inside a button), the same bug class
// already caught and fixed on `/find-your-religion` and
// `/find-your-spirit`. Fixed here the same way: `AssessmentResultActions`
// renders as a sibling before the Retake button, not nested inside it.
//
// Real dead-link bug found and fixed: legacy's "Journey Continues" grid
// linked to `/assessments/consciousness-scale` and `/assessments/grant-study`
// — neither exists in this migration (`grant-study` isn't built yet at
// all) and the real route for the former is `/consciousness-scale`
// (ported alongside this page). Only links to routes verified live in
// this app are kept; `/assessments/grant-study` is dropped rather than
// shipped as a 404, same "coming" honesty already applied to this
// experience's own directory listing in `lib/content/find-your-me.ts`.
//
// `EmailGate` is new here — legacy showed results immediately with no
// capture step (it never had one; it just posted to the now-removed
// `trpc.assessments.submit`). Added for ecosystem consistency with every
// other "Find Your X" page built in this migration, per this app's
// established EmailGate + AssessmentResultActions pattern.
type Quote = { text: string; author: string };
type Question = { id: number; text: string; category: string };
type Section = { title: string; subtitle: string; quote: Quote; questions: Question[] };

const SECTIONS: Section[] = [
  {
    title: "Capacities",
    subtitle: "Removing limitations to see what emerges",
    quote: {
      text: "Dharma roughly means: the path of right action; the path of greatest integrity; the path of choices that don't create suffering and optimally help heal it.",
      author: "Daniel Schmachtenberger",
    },
    questions: [
      {
        id: 1,
        text: "If your financial needs were already met for the rest of your life, what would you spend your days doing?",
        category: "capacities",
      },
      {
        id: 2,
        text: "If you had the resources of the world's wealthiest people, what cause or creation would you pour them into?",
        category: "capacities",
      },
      {
        id: 3,
        text: "If you could go back to school with no constraints, what would you study — and why?",
        category: "capacities",
      },
      {
        id: 4,
        text: "If you could instantly download any skill, which three would you choose?",
        category: "capacities",
      },
      {
        id: 5,
        text: "If fear and self-doubt vanished overnight, what would you do differently tomorrow morning?",
        category: "capacities",
      },
      {
        id: 6,
        text: "If your main character deficits were resolved — the patterns you know hold you back — what would become possible?",
        category: "capacities",
      },
      {
        id: 7,
        text: "If you had the perfect team supporting you, what would you build?",
        category: "capacities",
      },
      {
        id: 8,
        text: "If your life started over with a clean slate — no previous commitments, no baggage — what path would you walk?",
        category: "capacities",
      },
    ],
  },
  {
    title: "Values",
    subtitle: "What you care about, love, find meaningful",
    quote: {
      text: "The meaning of life is to find your gift. The purpose of life is to give it away.",
      author: "Pablo Picasso",
    },
    questions: [
      {
        id: 9,
        text: "Who are you most inspired by? What about them calls to something deep in you?",
        category: "values",
      },
      {
        id: 10,
        text: "What issues in the world upset you the most — the ones that make you want to act, not just scroll past?",
        category: "values",
      },
      {
        id: 11,
        text: "What do you see as most deeply wrong with or off in the world right now?",
        category: "values",
      },
      {
        id: 12,
        text: "What do you find the most beauty in? What moves you to tears or silence?",
        category: "values",
      },
      {
        id: 13,
        text: "Looking back from the end of your life, who would you be most proud to have been?",
        category: "values",
      },
      {
        id: 14,
        text: "What would you work on if you could succeed but no one would ever know you did it?",
        category: "values",
      },
      {
        id: 15,
        text: "What would you sacrifice personal benefit for? What matters more than comfort?",
        category: "values",
      },
      {
        id: 16,
        text: "What is sacred to you? Not what you've been told is sacred — what you actually hold as inviolable?",
        category: "values",
      },
      {
        id: 17,
        text: "If all your personal desires were already met, what would you then care about?",
        category: "values",
      },
    ],
  },
  {
    title: "Propensities",
    subtitle: "Your native gifts and intrinsic motivations",
    quote: {
      text: "Don't ask what the world needs. Ask what makes you come alive, and go do it. Because what the world needs is people who have come alive.",
      author: "Howard Thurman",
    },
    questions: [
      {
        id: 18,
        text: "What are you naturally good at — the things that seem to come easy while others struggle?",
        category: "propensities",
      },
      {
        id: 19,
        text: "What types of activities leave you feeling replenished rather than drained?",
        category: "propensities",
      },
      {
        id: 20,
        text: "What are you willing to do even when it taxes you — the hard work that doesn't feel like punishment?",
        category: "propensities",
      },
      {
        id: 21,
        text: "What do you enjoy doing for its own sake, independent of results or recognition?",
        category: "propensities",
      },
      {
        id: 22,
        text: "What is your attention repeatedly called to? What can you not stop noticing?",
        category: "propensities",
      },
      {
        id: 23,
        text: "Where have you felt the most pride or satisfaction related to something you actually did?",
        category: "propensities",
      },
      {
        id: 24,
        text: "When have you felt most fully alive — not just happy, but alive?",
        category: "propensities",
      },
    ],
  },
  {
    title: "The Shadow Inquiry",
    subtitle: "What is not dharma — the honest reckoning",
    quote: {
      text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
      author: "Carl Jung",
    },
    questions: [
      {
        id: 25,
        text: "Where are you deceiving yourself? Where are you not living in alignment with your own values — and what would change if you stopped?",
        category: "shadow",
      },
    ],
  },
];

const ALL_QUESTIONS = SECTIONS.flatMap((s) => s.questions);
const TOTAL = ALL_QUESTIONS.length;

const INTERSTITIAL_QUOTES: Quote[] = [
  { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung" },
  {
    text: "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.",
    author: "Pierre Teilhard de Chardin",
  },
  {
    text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
    author: "Rumi",
  },
];

interface DharmaProfile {
  archetypes: string[];
  coreValues: string[];
  completionDepth: number;
  totalAnswered: number;
}

function generateDharmaProfile(answers: Record<number, string>): DharmaProfile {
  const filled = Object.values(answers).filter((a) => a.trim().length > 0);
  const themes: string[] = [];
  const patterns: string[] = [];

  const capacityAnswers = [1, 2, 3, 4, 5, 6, 7, 8]
    .map((id) => answers[id] || "")
    .join(" ")
    .toLowerCase();
  if (
    capacityAnswers.includes("creat") ||
    capacityAnswers.includes("build") ||
    capacityAnswers.includes("design") ||
    capacityAnswers.includes("art")
  )
    themes.push("Creator / Builder");
  if (
    capacityAnswers.includes("teach") ||
    capacityAnswers.includes("mentor") ||
    capacityAnswers.includes("guide") ||
    capacityAnswers.includes("help")
  )
    themes.push("Guide / Teacher");
  if (
    capacityAnswers.includes("heal") ||
    capacityAnswers.includes("therap") ||
    capacityAnswers.includes("care") ||
    capacityAnswers.includes("support")
  )
    themes.push("Healer / Caretaker");
  if (
    capacityAnswers.includes("lead") ||
    capacityAnswers.includes("organiz") ||
    capacityAnswers.includes("manag") ||
    capacityAnswers.includes("direct")
  )
    themes.push("Leader / Organizer");
  if (
    capacityAnswers.includes("research") ||
    capacityAnswers.includes("discover") ||
    capacityAnswers.includes("learn") ||
    capacityAnswers.includes("study")
  )
    themes.push("Explorer / Researcher");
  if (
    capacityAnswers.includes("connect") ||
    capacityAnswers.includes("communit") ||
    capacityAnswers.includes("people") ||
    capacityAnswers.includes("together")
  )
    themes.push("Connector / Community Builder");

  const valueAnswers = [9, 10, 11, 12, 13, 14, 15, 16, 17]
    .map((id) => answers[id] || "")
    .join(" ")
    .toLowerCase();
  if (
    valueAnswers.includes("justice") ||
    valueAnswers.includes("equal") ||
    valueAnswers.includes("fair")
  )
    patterns.push("Justice & Equity");
  if (
    valueAnswers.includes("nature") ||
    valueAnswers.includes("environment") ||
    valueAnswers.includes("earth") ||
    valueAnswers.includes("planet")
  )
    patterns.push("Ecological Stewardship");
  if (
    valueAnswers.includes("truth") ||
    valueAnswers.includes("honest") ||
    valueAnswers.includes("authentic")
  )
    patterns.push("Truth & Authenticity");
  if (
    valueAnswers.includes("love") ||
    valueAnswers.includes("compassion") ||
    valueAnswers.includes("kind")
  )
    patterns.push("Love & Compassion");
  if (
    valueAnswers.includes("freedom") ||
    valueAnswers.includes("libert") ||
    valueAnswers.includes("autonomy")
  )
    patterns.push("Freedom & Sovereignty");
  if (
    valueAnswers.includes("beauty") ||
    valueAnswers.includes("art") ||
    valueAnswers.includes("music") ||
    valueAnswers.includes("creat")
  )
    patterns.push("Beauty & Creative Expression");
  if (
    valueAnswers.includes("conscious") ||
    valueAnswers.includes("spirit") ||
    valueAnswers.includes("sacred") ||
    valueAnswers.includes("soul")
  )
    patterns.push("Consciousness & Spiritual Growth");

  if (themes.length === 0) themes.push("Seeker — your path is still crystallizing");
  if (patterns.length === 0)
    patterns.push("Your values run deep — they may resist easy categorization");

  return {
    archetypes: themes.slice(0, 3),
    coreValues: patterns.slice(0, 4),
    completionDepth: Math.round((filled.length / TOTAL) * 100),
    totalAnswered: filled.length,
  };
}

const ACCENT = "#8B6914";

type Phase = "landing" | "quiz" | "interstitial" | "results";

export function DharmaFinderQuiz() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [interstitialIdx, setInterstitialIdx] = useState(0);
  const [pendingQuestion, setPendingQuestion] = useState(0);
  const { markComplete } = useJourneyProgress();

  const currentQ = ALL_QUESTIONS[currentQuestion];

  const currentSectionIdx = useMemo(() => {
    let count = 0;
    for (let i = 0; i < SECTIONS.length; i++) {
      count += SECTIONS[i].questions.length;
      if (currentQuestion < count) return i;
    }
    return SECTIONS.length - 1;
  }, [currentQuestion]);

  const sectionStartIdx = useMemo(() => {
    let count = 0;
    for (let i = 0; i < currentSectionIdx; i++) count += SECTIONS[i].questions.length;
    return count;
  }, [currentSectionIdx]);

  const isFirstInSection = currentQuestion === sectionStartIdx;

  const handleAnswer = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
    },
    [currentQ],
  );

  const goNext = useCallback(() => {
    if (currentQuestion < TOTAL - 1) {
      const nextQ = currentQuestion + 1;
      let count = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        count += SECTIONS[i].questions.length;
        if (nextQ === count && i < SECTIONS.length - 1) {
          setInterstitialIdx(i);
          setPendingQuestion(nextQ);
          setPhase("interstitial");
          return;
        }
      }
      setCurrentQuestion(nextQ);
    } else {
      setPhase("results");
      markComplete("find-your-purpose");
    }
  }, [currentQuestion, markComplete]);

  const goPrev = useCallback(() => {
    if (currentQuestion > 0) setCurrentQuestion((q) => q - 1);
  }, [currentQuestion]);

  // A real timer-driven transition (the interstitial auto-advances after
  // 4s, same as legacy) — a genuine side effect, not the render-time
  // state-derivation anti-pattern CONTRIBUTING.md warns against.
  useEffect(() => {
    if (phase !== "interstitial") return;
    const timer = setTimeout(() => {
      setCurrentQuestion(pendingQuestion);
      setPhase("quiz");
    }, 4000);
    return () => clearTimeout(timer);
  }, [phase, pendingQuestion]);

  const profile = useMemo(() => generateDharmaProfile(answers), [answers]);

  if (phase === "landing") {
    return (
      <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
        <ThemedBackground theme="journey" />
        <AssessmentIntro
          title="Dharma Finder"
          subtitle="Not what you should do. What you can't stop doing."
          description="25 questions distilled from Daniel Schmachtenberger's Dharma Inquiry — an honest reckoning with your capacities, your values, your native gifts, and the shadow that keeps you from all three. No multiple choice. No wrong answers. Just the truth you already know, if you're willing to write it down."
          stats={{ questions: TOTAL, dimensions: SECTIONS.length, minutes: 12 }}
          whatYouGet={[
            "Your archetypal roles — the work you're actually built for",
            "The core values quietly driving your choices, named plainly",
            "A depth-of-inquiry score based on how far you let yourself go",
            "An invitation into the full 200-300 question original",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("quiz")}
        />
      </div>
    );
  }

  if (phase === "interstitial") {
    const q = INTERSTITIAL_QUOTES[interstitialIdx % INTERSTITIAL_QUOTES.length];
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A10] px-8 text-center">
        <div className="max-w-160">
          <p className="mb-6 font-heading text-[clamp(1.3rem,2.5vw,1.8rem)] leading-[1.6] text-[#F5F0E0] italic">
            &ldquo;{q.text}&rdquo;
          </p>
          <p className="font-mono text-[0.75rem] tracking-[0.2em] text-brand-gold-light uppercase">
            — {q.author}
          </p>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    const progress = ((currentQuestion + 1) / TOTAL) * 100;
    const section = SECTIONS[currentSectionIdx];

    return (
      <div className="relative z-1 flex min-h-screen flex-col font-sans text-[#2C1810]">
        <ThemedBackground theme="journey" />
        <div className="fixed inset-x-0 top-0 z-50">
          <div className="h-[3px] bg-brand-gold/10">
            <div
              className="h-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between px-6 py-3 font-mono text-[0.65rem] tracking-[0.1em] text-[#4A3A2A]">
            <button onClick={() => setPhase("landing")}>
              <BackIcon aria-hidden="true" /> EXIT
            </button>
            <span>
              Question {currentQuestion + 1} of {TOTAL}
            </span>
          </div>
        </div>

        <div className="relative z-1 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 pt-24 pb-12">
          {isFirstInSection && (
            <div className="mb-8">
              <p className="mb-2 font-mono text-[0.7rem] tracking-[0.25em] text-brand-gold uppercase">
                Part {currentSectionIdx + 1} of {SECTIONS.length} · {section.title}
              </p>
              <h2 className="mb-2 font-heading text-[clamp(1.4rem,2.5vw,1.8rem)] font-normal">
                {section.subtitle}
              </h2>
              <blockquote className="mt-4 border-l-2 border-brand-gold-light pl-4 text-[0.95rem] text-[#5A4A3A] italic">
                &ldquo;{section.quote.text}&rdquo;
                <br />
                <span className="font-mono text-[0.75rem] text-brand-gold not-italic">
                  — {section.quote.author}
                </span>
              </blockquote>
              <div className="mt-6 h-px bg-brand-gold/15" />
            </div>
          )}

          <p className="mb-4 font-mono text-[0.7rem] tracking-[0.2em] text-[#8B7B6B] uppercase">
            Question {currentQuestion + 1} of {TOTAL}
          </p>
          <h3 className="mb-6 font-heading text-[clamp(1.3rem,2.5vw,1.7rem)] leading-[1.4] font-normal">
            {currentQ.text}
          </h3>

          <textarea
            value={answers[currentQ.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Take your time. There are no wrong answers — only honest ones..."
            rows={6}
            className="w-full resize-y rounded-sm border border-black/10 bg-white/50 p-5 text-[1.02rem] leading-relaxed text-[#2C1810] outline-none placeholder:text-[#9B8B7B] focus:border-brand-gold"
          />

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentQuestion === 0}
              className="font-mono text-[0.75rem] tracking-[0.15em] text-[#4A3A2A] uppercase disabled:cursor-default disabled:text-[#B8A898]"
            >
              <BackIcon aria-hidden="true" /> Previous
            </button>
            <button
              onClick={goNext}
              className="rounded-sm bg-brand-gold px-6 py-2.5 font-mono text-[0.75rem] tracking-[0.15em] text-[#F5F0E0] uppercase"
            >
              {currentQuestion === TOTAL - 1 ? (
                <>
                  See My Dharma Profile <ForwardIcon aria-hidden="true" />
                </>
              ) : (
                <>
                  Next <ForwardIcon aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          <p className="mt-6 text-center font-mono text-[0.7rem] text-[#9B8B7B]">
            You can skip questions and come back — or leave them blank. The inquiry honors your
            pace.
          </p>
        </div>

        <div className="border-t border-brand-gold/10 px-6 py-8 text-center">
          <p className="font-mono text-[0.7rem] tracking-[0.1em] text-[#8B7B6B]">
            Based on{" "}
            <a
              href="https://civilizationemerging.com/dharma-inquiry-original-version/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold"
            >
              Daniel Schmachtenberger&apos;s Dharma Inquiry
            </a>{" "}
            · Curated by Tony Greenberg
          </p>
          <p className="mt-2 font-mono text-[0.65rem] text-[#B8A898]">
            Full 3-hour version (200+ questions) available at civilizationemerging.com
          </p>
        </div>
      </div>
    );
  }

  if (!emailGated) {
    return (
      <div className="relative z-1 flex min-h-screen items-center justify-center text-[#2C1810]">
        <ThemedBackground theme="journey" />
        <EmailGate assessmentSlug="dharma-finder" onUnlock={() => setEmailGated(true)} />
      </div>
    );
  }

  const { archetypes, coreValues, completionDepth, totalAnswered } = profile;

  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="journey" />

      <div className="border-b border-brand-gold/10 p-6 text-center">
        <Link
          href="/find-your-me"
          className="font-mono text-[0.65rem] tracking-[0.1em] text-[#4A3A2A]"
        >
          <BackIcon aria-hidden="true" /> Back to Find My
        </Link>
      </div>

      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <div className="mb-4 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">
          Your Dharma Profile
        </div>
        <h1 className="mb-4 font-heading text-[clamp(2rem,4vw,3rem)] font-normal">
          The Threads of Your Purpose
        </h1>
        <p className="mx-auto max-w-150 text-[1.1rem] text-[#5A4A3A]">
          Based on your {totalAnswered} response{totalAnswered === 1 ? "" : "s"}, here&apos;s what
          the inquiry reveals about the shape of your dharma.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-8">
        <h2 className="mb-6 font-heading text-2xl font-normal">Your Archetypal Roles</h2>
        <div className="mb-10 flex flex-wrap gap-3">
          {archetypes.map((a) => (
            <span
              key={a}
              className="rounded-sm bg-linear-to-br from-brand-gold to-brand-gold-light px-5 py-2 font-mono text-[0.85rem] tracking-[0.05em] text-[#F5F0E0]"
            >
              {a}
            </span>
          ))}
        </div>

        <h2 className="mb-6 font-heading text-2xl font-normal">Core Values Detected</h2>
        <div className="mb-10 flex flex-col gap-3">
          {coreValues.map((v) => (
            <div
              key={v}
              className="border border-black/10 bg-white/50 px-5 py-3 text-[1.05rem] text-[#333]"
            >
              <span className="mr-2 font-semibold text-brand-gold">◆</span>
              {v}
            </div>
          ))}
        </div>

        <h2 className="mb-4 font-heading text-2xl font-normal">Depth of Inquiry</h2>
        <div className="mb-1.5 h-2 rounded-sm bg-black/8">
          <div
            className="h-full rounded-sm bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-1000"
            style={{ width: `${completionDepth}%` }}
          />
        </div>
        <p className="font-mono text-[0.8rem] text-[#8B7B6B]">
          {completionDepth}% of questions explored
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <div className="rounded-sm bg-[#0A0A10] p-8 text-[#F5F0E0]">
          <p className="mb-4 font-mono text-[0.7rem] tracking-[0.2em] text-brand-gold-light uppercase">
            Tony&apos;s Note
          </p>
          <p className="text-[1.05rem] leading-[1.8]">
            This 25-question version is a doorway. Daniel Schmachtenberger&apos;s full Dharma
            Inquiry contains 200-300 questions and takes roughly three hours of deep, honest
            reflection. Having shared it with over 100 people across two decades, it remains the
            most transformative self-inquiry exercise encountered in a lifetime of searching. The
            full version lives at{" "}
            <a
              href="https://civilizationemerging.com/dharma-inquiry-original-version/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold-light underline"
            >
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
        <div className="mb-2 text-center font-mono text-[0.65rem] tracking-[0.25em] text-brand-gold uppercase">
          The Journey Continues
        </div>
        <p className="mb-6 text-center text-[0.95rem] text-[#666]">
          You&apos;ve found your dharma. Now explore the dimensions that shape it.
        </p>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {[
            {
              name: "Find Your Therapy",
              hook: "Matched to your wiring, not a waitlist.",
              href: "/find-your-therapy",
            },
            {
              name: "Find Your Spirit",
              hook: "Map your beliefs across 10 dimensions.",
              href: "/find-your-spirit",
            },
            {
              name: "Find Your Level",
              hook: "Where you sit on the consciousness scale.",
              href: "/consciousness-scale",
            },
            {
              name: "Find Your Me",
              hook: "The gateway to the whole ecosystem.",
              href: "/find-your-me",
            },
          ].map((next) => (
            <Link
              key={next.name}
              href={next.href}
              className="block rounded-lg border border-black/6 bg-white/40 p-5 transition-colors hover:border-brand-gold/40"
            >
              <div className="mb-2 font-mono text-[0.7rem] font-semibold text-brand-gold">
                {next.name}
              </div>
              <div className="text-[0.82rem] leading-relaxed text-[#888]">{next.hook}</div>
            </Link>
          ))}
        </div>
      </section>

      <WhatsNext />

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-16 text-center">
        <AssessmentResultActions accentColor={ACCENT} resultSlug="dharma-finder" />
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              setPhase("landing");
              setEmailGated(false);
              setCurrentQuestion(0);
              setAnswers({});
            }}
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
        <p className="mb-2 font-heading text-sm text-[#555] italic">
          The privilege of a lifetime is to become who you truly are.
        </p>
        <p className="font-mono text-[0.6rem] tracking-[0.1em] text-[#444]">
          Part of the Find My Ecosystem by Tony Greenberg
        </p>
      </footer>
    </div>
  );
}
