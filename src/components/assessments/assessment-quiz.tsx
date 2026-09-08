"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ARCHETYPES, ASSESSMENT_QUESTIONS, AUTHORITY_ITEMS, type ArchetypeKey } from "@/lib/content/archetypes";
import { AssessmentResultActions } from "@/components/assessments/result-actions";

// Ported from legacy client/src/pages/Assessment.tsx. This predates the
// "Find Your X" naming convention and isn't part of that ecosystem
// (no ThemedBackground pastel theme, no AssessmentIntro landing screen,
// no JourneyTracker entry) — it's a distinct 3-way diagnostic: "Which of
// Tony's 3 reader paths are you?" (Builder / Crusader / Investor), 5 real
// questions, one point per matching answer, highest tally wins. Real
// questions and the real Builder/Crusader/Investor archetype copy
// (name/tagline/description) ported unchanged — reused from
// `lib/content/archetypes.ts` (already ported for `/essays`'s archetype
// filter) rather than duplicated, and `ASSESSMENT_QUESTIONS` was added to
// that same module since it comes from the identical legacy
// `data/archetypes.ts` source file. Legacy's own emoji icons are replaced
// with `lib/content/archetypes.ts`'s existing lucide-react icons (already
// the established substitution for this exact data, made when `/essays`
// was ported); its `pathUrl`/`color` fields were already dropped there and
// aren't reintroduced — there's no `/path/builder` etc. route anywhere in
// this migration.
//
// **Real bugs fixed while porting**: (1) legacy's option buttons used
// imperative `onMouseEnter`/`onMouseLeave` handlers to mutate inline
// `style` for hover state — replaced with Tailwind `hover:` classes, same
// normalization already applied to `/find-your-attachment-style`'s
// options. (2) the email-capture button rendered literal `"..."` text
// while its `trpc` mutation was pending — replaced with a real
// `Loader2` spinner per this repo's house rule. (3) `trpc.subscribe.add`
// (no tRPC backend exists in this app) replaced with a real POST to
// `/api/subscribe`, same endpoint every other assessment's `EmailGate`
// uses. **Real link audit** on the "Where do you want to start?" grid: of
// legacy's 6 destinations, `/impact-dashboard`, `/find-your-me`,
// `/living-declaration`, and the real
// `/blog/boiling-the-human-summit-harvard-kurzweil` article all exist and
// are kept as real links; `/soulscore` and `/humanos` don't exist yet in
// this migration, but both are real, live forward-references used
// repeatedly elsewhere already (site nav, `/living-declaration`,
// `/the-letter`, `/recent-creations`) — kept as the same kind of
// forward-reference, not dropped. The Human OS card's legacy
// black-background/red-text treatment is replaced with the
// `border-red-800/30 text-red-800` styling `/living-declaration` already
// established for this exact "Explore Human OS V2.0" CTA, instead of a
// new one-off raw hex pair. No `AssessmentResultActions`/journey-tracker
// entry existed in legacy (built after this page); added
// `AssessmentResultActions resultSlug="assessment"` per this migration's
// `/self-portrait` completion-log convention. `useBehavior`'s
// localStorage archetype/pageview tracking has no equivalent anywhere
// else in this Next.js app and isn't reproduced — same honest-degradation
// pattern used throughout this migration for legacy client-only state
// systems with no real consumer here.
export function AssessmentQuiz() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<ArchetypeKey, number>>({ builder: 0, crusader: 0, investor: 0 });
  const [result, setResult] = useState<ArchetypeKey | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [pending, setPending] = useState(false);
  const [subError, setSubError] = useState("");

  const handleSubscribe = useCallback(async () => {
    if (!email || subscribed || pending) return;
    setSubError("");
    setPending(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: result ? `assessment-${result}` : "assessment" }),
      });
      const data = (await res.json()) as { success: boolean; message?: string };
      if (data.success) setSubscribed(true);
      else setSubError(data.message ?? "Something went wrong. Please try again.");
    } catch {
      setSubError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }, [email, subscribed, pending, result]);

  const handleAnswer = useCallback(
    (archetype: ArchetypeKey) => {
      const nextScores = { ...scores, [archetype]: scores[archetype] + 1 };
      setScores(nextScores);

      if (step < ASSESSMENT_QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        const winner = (Object.entries(nextScores) as [ArchetypeKey, number][]).reduce((a, b) => (a[1] >= b[1] ? a : b))[0];
        setResult(winner);
      }
    },
    [step, scores],
  );

  const q = ASSESSMENT_QUESTIONS[step];
  const arch = result ? ARCHETYPES[result] : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-foreground py-2.5 text-center">
        <p className="font-mono text-[0.68rem] tracking-[0.15em] text-brand-gold-light uppercase">
          {AUTHORITY_ITEMS.join("  ·  ")}
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-16 pb-30">
        {!result ? (
          <>
            <div className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
              Question {step + 1} of {ASSESSMENT_QUESTIONS.length}
            </div>
            <div className="mb-12 h-0.75 overflow-hidden rounded-sm bg-brand-gold/10">
              <div
                className="h-full rounded-sm bg-brand-gold transition-[width] duration-400"
                style={{ width: `${((step + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
              />
            </div>

            <h2 className="mb-10 font-heading text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.3] text-foreground">
              {q.question}
            </h2>

            <div className="flex flex-col gap-4">
              {q.options.map((opt) => (
                <button
                  key={opt.text}
                  onClick={() => handleAnswer(opt.archetype)}
                  className="rounded-lg border border-border bg-card px-6 py-5 text-left text-[1.05rem] leading-relaxed text-card-foreground transition-all hover:translate-x-1 hover:border-brand-gold hover:bg-brand-gold/5"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            {arch && <arch.icon className="mx-auto mb-4 size-12 text-brand-gold" strokeWidth={1.5} />}
            <h1 className="mb-2 font-heading text-[clamp(2rem,5vw,3rem)] text-foreground">{arch!.name}</h1>
            <div className="mb-8 font-mono text-[0.8rem] tracking-[0.2em] text-brand-gold uppercase">{arch!.tagline}</div>
            <p className="mx-auto mb-10 max-w-140 text-lg leading-relaxed text-foreground/80">{arch!.description}</p>

            <div className="mb-5 font-mono text-[0.7rem] tracking-[0.2em] text-brand-gold uppercase">Where do you want to start?</div>
            <div className="mx-auto mb-10 flex max-w-120 flex-col gap-3">
              <Link
                href="/impact-dashboard"
                className="block rounded-md bg-brand-gold px-6 py-4 text-center font-mono text-[0.8rem] tracking-[0.15em] text-white uppercase"
              >
                Go to My Dashboard →
              </Link>
              <Link
                href="/soulscore"
                className="block rounded-md border border-border px-6 py-4 text-center font-mono text-[0.8rem] tracking-[0.15em] text-foreground uppercase"
              >
                Explore the SoulScore →
              </Link>
              <Link
                href="/find-your-me"
                className="block rounded-md border border-border px-6 py-4 text-center font-mono text-[0.8rem] tracking-[0.15em] text-foreground uppercase"
              >
                Find Your Me →
              </Link>
              <Link
                href="/living-declaration"
                className="block rounded-md border border-border px-6 py-4 text-center font-mono text-[0.8rem] tracking-[0.15em] text-foreground uppercase"
              >
                Read the Living Declaration →
              </Link>
              <Link
                href="/blog/boiling-the-human-summit-harvard-kurzweil"
                className="block rounded-md border border-border px-6 py-4 text-center font-mono text-[0.8rem] tracking-[0.15em] text-foreground uppercase"
              >
                Read &ldquo;Boiling the Human&rdquo; →
              </Link>
              <Link
                href="/humanos"
                className="block rounded-md border border-red-800/30 px-6 py-4 text-center font-mono text-[0.8rem] tracking-[0.15em] text-red-800 uppercase"
              >
                Explore Human OS V2.0 →
              </Link>
            </div>

            <div className="mx-auto mb-8 max-w-120 rounded-lg border border-border bg-card p-6">
              <p className="mb-4 text-[0.95rem] text-card-foreground/80">
                Get essays curated for your archetype — delivered weekly.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 bg-background"
                />
                <Button
                  onClick={handleSubscribe}
                  disabled={pending || subscribed || !email}
                  className="h-10 shrink-0 font-mono text-xs tracking-wide uppercase"
                >
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  {subscribed ? "Subscribed ✓" : "Subscribe"}
                </Button>
              </div>
              {subError && <p className="mt-2 text-left text-sm text-destructive">{subError}</p>}
            </div>

            <a
              href="https://impactsoul.is"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-wide text-brand-gold"
            >
              Explore ImpactSoul →
            </a>

            <AssessmentResultActions resultSlug="assessment" />
          </div>
        )}
      </div>
    </div>
  );
}
