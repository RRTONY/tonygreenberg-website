"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  CircleDashed,
  Loader2,
} from "lucide-react";

// Ported from legacy client/src/pages/Engage.tsx ("The Gate"). The
// qualification quiz — questions, scoring heuristic, and outcome gating —
// is genuinely client-side logic already (legacy scored answers with a
// pure regex/word-count function, no server round-trip needed to decide
// the outcome), so it ports as real, functional assessment logic per this
// repo's CMS-boundary rule (quiz/scoring code lives in .ts, not Sanity).
// The one thing NOT ported: the tRPC `engage.submit` mutation that logged
// each submission for Tony's own records — that's a lead-tracking/CRM
// write, out of this migration's "no backend features" scope. Dropping it
// doesn't change the visitor's experience at all: the gate still scores
// correctly and still reveals the real Calendly link to qualified visitors.

const QUALIFIED_THRESHOLD = 65;
const NOT_READY_THRESHOLD = 35;

const QUESTIONS = [
  {
    id: "impactInitiative",
    number: "01",
    label: "The Initiative",
    question: "What is the specific impact initiative you're building?",
    subtext:
      "Not 'making a difference.' Not 'exploring options.' What is the concrete thing you are creating, launching, or scaling? Be specific — sector, mechanism, target population.",
    placeholder: "Describe the specific initiative, its mechanism, and who it serves...",
  },
  {
    id: "impactOutcomes",
    number: "02",
    label: "The Outcomes",
    question: "What are the intended impact outcomes — and how will you measure them?",
    subtext:
      "If you can't articulate what success looks like in measurable terms, you're not ready for this conversation. What changes? For whom? By when? How do you know?",
    placeholder: "Define success metrics, timeline, and who benefits...",
  },
  {
    id: "whyTony",
    number: "03",
    label: "The Fit",
    question: "Why Tony Greenberg, RampRate, or ImpactSoul — specifically?",
    subtext:
      "You've read the essays. You've seen the ecosystem. What specifically about this body of work makes you believe this is the right partnership? Generic flattery doesn't count.",
    placeholder:
      "Reference specific work, frameworks, or capabilities that align with your needs...",
  },
  {
    id: "priorAction",
    number: "04",
    label: "The Proof",
    question: "What have you already done — with your own hands and resources?",
    subtext:
      "Ideas are free. Execution costs everything. What have you built, tested, failed at, or shipped before asking for someone else's time? Dreamers need not apply.",
    placeholder: "Describe concrete actions taken, resources deployed, lessons learned...",
  },
  {
    id: "resourcesCommitted",
    number: "05",
    label: "The Commitment",
    question: "What resources are committed — budget, team, timeline?",
    subtext:
      "Engagement is bespoke — structured around your situation, not a menu. What budget is allocated? Who's on the team? What's the timeline? Serious inquiries only.",
    placeholder: "Budget range, team composition, and timeline for execution...",
  },
] as const;

function scoreAnswer(answer: string): number {
  const trimmed = answer.trim();
  if (trimmed.length === 0) return 0;

  const wordCount = trimmed.split(/\s+/).length;
  const hasSpecifics = /\d|%|\$|timeline|budget|team|measure|metric|quarter|month|year/i.test(
    trimmed,
  );
  const hasConcreteAction =
    /built|launched|tested|shipped|deployed|created|established|funded|raised|hired/i.test(trimmed);
  const isGeneric =
    /make a difference|explore|interested in|passionate about|love your work|big fan/i.test(
      trimmed,
    );

  let score = 0;
  if (wordCount >= 80) score += 8;
  else if (wordCount >= 50) score += 6;
  else if (wordCount >= 30) score += 4;
  else if (wordCount >= 15) score += 2;
  else score += 1;

  if (hasSpecifics) score += 4;
  if (hasConcreteAction) score += 2;
  if (isGeneric) score -= 3;

  const sentenceCount = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 5).length;
  if (sentenceCount >= 4) score += 4;
  else if (sentenceCount >= 2) score += 2;

  return Math.max(0, Math.min(20, score));
}

function calculateOutcome(totalScore: number): "qualified" | "not-ready" | "wrong-fit" {
  if (totalScore >= QUALIFIED_THRESHOLD) return "qualified";
  if (totalScore >= NOT_READY_THRESHOLD) return "not-ready";
  return "wrong-fit";
}

export function EngageAudit() {
  const [step, setStep] = useState<"intro" | "audit" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [outcome, setOutcome] = useState<"qualified" | "not-ready" | "wrong-fit" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentAnswer = answers[QUESTIONS[currentQ].id] ?? "";
  const allAnswered = QUESTIONS.every((q) => (answers[q.id] ?? "").trim().length > 0);

  const handleSubmit = useCallback(() => {
    setSubmitting(true);
    const totalScore = QUESTIONS.reduce((sum, q) => sum + scoreAnswer(answers[q.id] ?? ""), 0);
    setOutcome(calculateOutcome(totalScore));
    setStep("result");
    setSubmitting(false);
  }, [answers]);

  return (
    <>
      {step === "intro" && (
        <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
          <p className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
            Before You Book
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">
            The Engagement Audit
          </h2>
          <p className="mb-6 leading-relaxed text-foreground/80">
            Five questions. No right answers — but there are wrong ones. Vague aspirations, generic
            flattery, and &quot;exploring options&quot; won&apos;t get you through. What will:
            specificity, evidence of action, and clarity about what you&apos;re building and why it
            matters.
          </p>

          <div className="mb-6 border-l-4 border-brand-gold bg-brand-gold/5 px-6 py-5">
            <div className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
              The Process
            </div>
            <p className="text-sm leading-relaxed text-foreground/70">
              <strong>Pass the audit</strong> → Calendly link unlocks → Book a strategy session
              (engagement terms discussed directly) → Send preparation doc to tony@impactsoul.is
              48hrs before → Session recorded via Fireflies → <strong>30-day review gate</strong> →
              Demonstrate action → Stage 2 unlocks.
            </p>
          </div>

          <div className="mb-8 rounded-md bg-secondary p-6">
            <div className="mb-4 font-mono text-xs tracking-wide text-brand-gold uppercase">
              Your Information
            </div>
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-sm border border-brand-gold/20 bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-sm border border-brand-gold/20 bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (!name.trim() || !email.trim()) {
                toast.error("Name and email are required.");
                return;
              }
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                toast.error("Please enter a valid email address.");
                return;
              }
              setStep("audit");
            }}
            className="mx-auto block rounded-sm border border-brand-gold/30 bg-background px-10 py-3 font-mono text-xs tracking-wide text-foreground uppercase transition-colors hover:border-brand-gold"
          >
            Begin the Audit
            <ArrowRight aria-hidden="true" className="ml-1 inline size-3.5" />
          </button>
        </div>
      )}

      {step === "audit" && (
        <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
          <div className="mb-8 flex gap-1.5">
            {QUESTIONS.map((q, i) => (
              <div
                key={q.id}
                className={`h-0.75 flex-1 rounded-full ${i <= currentQ ? "bg-brand-gold" : "bg-border"}`}
              />
            ))}
          </div>

          <div className="mb-1.5 font-mono text-xs tracking-[0.2em] text-brand-gold">
            {QUESTIONS[currentQ].number} — {QUESTIONS[currentQ].label.toUpperCase()}
          </div>
          <h2 className="mb-3 font-heading text-2xl leading-tight font-bold text-foreground">
            {QUESTIONS[currentQ].question}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground italic">
            {QUESTIONS[currentQ].subtext}
          </p>

          <textarea
            value={currentAnswer}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [QUESTIONS[currentQ].id]: e.target.value }))
            }
            placeholder={QUESTIONS[currentQ].placeholder}
            rows={6}
            className="mb-1.5 w-full resize-y rounded-sm border border-border bg-secondary p-4 text-sm leading-relaxed outline-none focus:border-brand-gold"
          />
          <div className="mb-6 text-right font-mono text-xs text-muted-foreground">
            {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)}
              disabled={currentQ === 0}
              className="font-mono text-xs tracking-wide text-brand-gold uppercase disabled:text-muted-foreground/40"
            >
              <ArrowLeft aria-hidden="true" className="mr-1 inline size-3.5" />
              Previous
            </button>

            {currentQ < QUESTIONS.length - 1 ? (
              <button
                onClick={() => {
                  if (!currentAnswer.trim()) {
                    toast.error("Please answer this question before continuing.");
                    return;
                  }
                  setCurrentQ(currentQ + 1);
                }}
                className="rounded-sm border border-brand-gold/30 bg-background px-8 py-2.5 font-mono text-xs tracking-wide text-foreground uppercase"
              >
                Next
                <ArrowRight aria-hidden="true" className="ml-1 inline size-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
                className="flex items-center gap-2 rounded-sm bg-brand-gold px-8 py-2.5 font-mono text-xs tracking-wide text-white uppercase disabled:bg-muted disabled:text-muted-foreground"
              >
                {submitting && <Loader2 className="size-3.5 animate-spin" />}
                Submit Audit
              </button>
            )}
          </div>
        </div>
      )}

      {step === "result" && outcome === "qualified" && (
        <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-brand-gold/10 text-2xl text-brand-gold">
            <Check aria-hidden="true" className="size-8" />
          </div>
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">
            You&apos;ve passed The Gate.
          </h2>
          <p className="mb-8 leading-relaxed text-foreground/80">
            Your initiative is specific, your outcomes are measurable, and you&apos;ve already
            started. That puts you in the top 30%. Here&apos;s what happens next.
          </p>

          <hr className="mb-6 border-border" />

          <div className="text-left">
            <div className="mb-4 font-mono text-xs tracking-wide text-brand-gold uppercase">
              Your Next Steps
            </div>
            <div className="mb-8 grid gap-4">
              <div className="flex gap-4">
                <span className="shrink-0 font-mono text-sm font-bold text-brand-gold">01</span>
                <div>
                  <strong className="text-foreground">Book the session</strong>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Strategy session. Engagement terms are bespoke — discussed directly, not listed.
                    Recorded via Fireflies.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="shrink-0 font-mono text-sm font-bold text-brand-gold">02</span>
                <div>
                  <strong className="text-foreground">Send your preparation document</strong>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Email to{" "}
                    <a href="mailto:tony@impactsoul.is" className="text-brand-gold">
                      tony@impactsoul.is
                    </a>{" "}
                    — due 48 hours before session.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="shrink-0 font-mono text-sm font-bold text-brand-gold">03</span>
                <div>
                  <strong className="text-foreground">30-day review</strong>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Demonstrate action. Show what you&apos;ve done. Stage 2 unlocks only after proof
                    of execution.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://calendly.com/tonyg/10-minute-1-1"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 block rounded-sm bg-brand-gold px-10 py-3.5 text-center font-mono text-sm tracking-wide text-white uppercase"
            >
              Book Your Session
              <ArrowRight aria-hidden="true" className="ml-1 inline size-3.5" />
            </a>
            <div className="mb-6 text-center font-mono text-xs text-muted-foreground">
              All sessions scheduled via Calendly · Recorded via Fireflies
            </div>

            <div className="rounded-md border border-brand-gold/20 bg-brand-gold/5 px-6 py-5 text-center">
              <div className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
                The 2× Guarantee
              </div>
              <p className="text-sm leading-relaxed text-foreground/70">
                Do the work we specify. Document it. If after 30 days you can demonstrate full
                execution with zero results, we refund your fee — <strong>times two</strong>.
                That&apos;s how confident we are in what happens when the right people take the
                right action.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === "result" && outcome === "not-ready" && (
        <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-secondary text-2xl text-muted-foreground">
            <CircleDashed aria-hidden="true" className="size-8" />
          </div>
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">
            Not yet. But close.
          </h2>
          <p className="mb-6 leading-relaxed text-foreground/80">
            Your initiative has potential, but the specifics aren&apos;t clear enough yet.
            That&apos;s not a rejection — it&apos;s a redirect. Here&apos;s what to sharpen before
            you come back.
          </p>

          <div className="mb-8 border-l-4 border-brand-gold bg-brand-gold/5 px-6 py-5 text-left">
            <div className="mb-3 font-mono text-xs tracking-wide text-brand-gold uppercase">
              Before You Return
            </div>
            <ul className="m-0 grid list-none gap-2.5 p-0">
              <li className="pl-4 text-sm text-foreground/70">
                <ChevronRight
                  aria-hidden="true"
                  className="-ml-4 mr-1 inline size-3.5 text-brand-gold"
                />
                Define your impact outcomes in measurable terms — numbers, timelines, beneficiaries
              </li>
              <li className="pl-4 text-sm text-foreground/70">
                <ChevronRight
                  aria-hidden="true"
                  className="-ml-4 mr-1 inline size-3.5 text-brand-gold"
                />
                Take one concrete action — build a prototype, run a pilot, commit a budget
              </li>
              <li className="pl-4 text-sm text-foreground/70">
                <ChevronRight
                  aria-hidden="true"
                  className="-ml-4 mr-1 inline size-3.5 text-brand-gold"
                />
                Read the essays that align with your initiative — then reference them specifically
              </li>
            </ul>
          </div>

          <Link
            href="/"
            className="border-b border-brand-gold/30 font-mono text-xs tracking-wide text-brand-gold uppercase"
          >
            Read the Essays
            <ArrowRight aria-hidden="true" className="ml-1 inline size-3.5" />
          </Link>
        </div>
      )}

      {step === "result" && outcome === "wrong-fit" && (
        <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-secondary text-2xl text-muted-foreground">
            <Circle aria-hidden="true" className="size-8" />
          </div>
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">
            This isn&apos;t the right door.
          </h2>
          <p className="mb-4 leading-relaxed text-foreground/80">
            Based on your responses, this doesn&apos;t look like the right fit — and that&apos;s
            okay. Not every partnership should happen. The best ones are mutual, specific, and
            urgent. If yours becomes that, come back.
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            In the meantime, the essays are free. The assessments are free. The frameworks are free.
            Take what&apos;s useful.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-sm bg-foreground px-7 py-2.5 font-mono text-xs tracking-wide text-background uppercase"
            >
              Read the Essays
            </Link>
            <Link
              href="/assessments"
              className="rounded-sm border border-border px-7 py-2.5 font-mono text-xs tracking-wide text-foreground uppercase"
            >
              Find Your Fit
            </Link>
          </div>
        </div>
      )}

      {step === "result" && outcome !== "qualified" && (
        <div className="mx-auto max-w-2xl border-t border-border px-6 py-6 text-center sm:px-10">
          <p className="mb-1.5 text-sm text-muted-foreground italic">
            Think we got it wrong? Have something that would change our mind?
          </p>
          <a
            href="mailto:tony@impactsoul.is?subject=Re: Engagement Audit — I'd like to make my case"
            className="border-b border-brand-gold/30 font-mono text-xs tracking-wide text-brand-gold"
          >
            Entice Me
            <ArrowRight aria-hidden="true" className="ml-1 inline size-3.5" />
          </a>
        </div>
      )}
    </>
  );
}
