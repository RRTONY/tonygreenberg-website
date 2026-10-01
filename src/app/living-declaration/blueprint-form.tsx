"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const CONTACT_EMAIL = "tony@impactsoul.is";

const QUESTIONS = [
  {
    key: "biggestChallenge",
    label: "What's the biggest obstacle between you and your best self right now?",
    placeholder: "Be honest. This isn't a job interview. It's a mirror.",
  },
  {
    key: "whatToMeasure",
    label: "What do you wish someone was measuring — about you, about the world, about what matters?",
    placeholder: "The metrics that don't exist yet but should...",
  },
  {
    key: "referenceSites",
    label: "What sites, communities, or platforms inspire you? Share links or names.",
    placeholder: "The places online that make you think, feel, or act differently...",
  },
  {
    key: "newIndices",
    label: "If you could create a new index — a new way of scoring or ranking something that matters — what would it be?",
    placeholder: "A Happiness Index? A Regenerative Impact Score? A Trust Velocity Metric? Dream big.",
  },
  {
    key: "howToParticipate",
    label: "How would you like to be part of this? What role do you see yourself playing?",
    placeholder: "Builder, connector, tester, writer, investor, community organizer, quiet supporter...",
  },
  {
    key: "abundantLife",
    label: "Describe your most abundant life in one paragraph. No constraints. No budget. Just truth.",
    placeholder: "What does it look like when everything is working — health, love, purpose, impact?",
  },
];

const FIELD_CLASS =
  "w-full rounded-sm border border-border bg-background px-4 py-3 text-base leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors focus:border-brand-gold-light";

// The live page's six-question "blueprint" form (legacy Manifesto.tsx's
// QUESTIONS, same labels and placeholders). Legacy posted to
// `trpc.manifesto.submit`, which has no backend in this migration, so
// submitting opens a pre-filled email to Tony instead (same honest pattern
// as `pri/correction-form.tsx` and `facilitator/quick-intake.tsx`). Fields
// are uncontrolled and read from FormData on submit, so there's no
// per-field state; every field is optional, so no validation library.
export function BlueprintForm() {
  const [submitted, setSubmitted] = useState(false);
  const [empty, setEmpty] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const answered = QUESTIONS.filter((q) => get(q.key));
    if (answered.length === 0) {
      setEmpty(true);
      return;
    }
    const body = [
      ...answered.map((q) => `${q.label}\n${get(q.key)}\n`),
      get("name") ? `From: ${get("name")}` : "",
      get("email") ? `Reply to: ${get("email")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("My Blueprint for the Living Declaration")}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-md border border-brand-gold/30 bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 size-8 text-brand-gold" />
        <p className="mb-2 font-heading text-xl font-bold text-foreground">Your email is ready to send.</p>
        <p className="text-foreground/70">
          Your answers should now be open in your email app, addressed to Tony. Send it, and your
          voice becomes part of the architecture.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {QUESTIONS.map((q) => (
        <div key={q.key} className="mb-8">
          <label
            htmlFor={`blueprint-${q.key}`}
            className="mb-2 block font-heading text-lg leading-snug font-semibold text-foreground"
          >
            {q.label}
          </label>
          <textarea
            id={`blueprint-${q.key}`}
            name={q.key}
            rows={4}
            placeholder={q.placeholder}
            className={`${FIELD_CLASS} resize-y`}
          />
        </div>
      ))}

      <div role="group" aria-labelledby="blueprint-follow-up" className="mb-8 border-t border-border pt-6">
        <p id="blueprint-follow-up" className="mb-4 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
          Optional — So We Can Follow Up
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <input type="text" name="name" autoComplete="name" placeholder="Your name" aria-label="Your name" className={FIELD_CLASS} />
          <input type="email" name="email" autoComplete="email" placeholder="Your email" aria-label="Your email" className={FIELD_CLASS} />
        </div>
      </div>

      {empty && (
        <p role="alert" className="mb-4 text-sm text-foreground">
          Answer at least one question first.
        </p>
      )}
      <button
        type="submit"
        className="inline-block min-h-11 rounded-md bg-brand-gold px-8 py-3 font-mono text-sm tracking-wide text-white uppercase"
      >
        Submit My Blueprint →
      </button>
      <p className="mt-3 text-sm text-muted-foreground">
        Your responses are read personally. They shape what gets built. Nothing is sold or shared.
      </p>
    </form>
  );
}
