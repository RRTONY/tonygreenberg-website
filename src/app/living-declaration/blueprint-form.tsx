"use client";

import { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { submitBlueprint, type BlueprintKey } from "@/app/forms/actions";
import { FormError, mailtoHref } from "@/components/forms/form-error";

const CONTACT_EMAIL = "tony@impactsoul.is";

const QUESTIONS: { key: BlueprintKey; label: string; placeholder: string }[] = [
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
// QUESTIONS, same labels and placeholders). Since 2026-10-10 it saves to
// Supabase (`submitBlueprint` in src/app/forms/actions.ts →
// manifesto_responses) and emails Tony, like legacy's `trpc.manifesto.submit`.
// Every field is optional, but at least one question needs an answer. If
// saving fails, the error offers a pre-filled email to Tony instead.
const schema = Yup.object({
  biggestChallenge: Yup.string().max(5000),
  whatToMeasure: Yup.string().max(5000),
  referenceSites: Yup.string().max(5000),
  newIndices: Yup.string().max(5000),
  howToParticipate: Yup.string().max(5000),
  abundantLife: Yup.string().max(5000),
  name: Yup.string().trim().max(256),
  email: Yup.string().trim().email("That email address doesn't look right.").max(320),
  website: Yup.string(),
}).test("one-answer", function (v) {
  return QUESTIONS.some((q) => !!v[q.key]?.trim()) || this.createError({ path: "biggestChallenge", message: "Answer at least one question first." });
});

type Values = Yup.InferType<typeof schema>;

const INITIAL: Values = {
  biggestChallenge: "",
  whatToMeasure: "",
  referenceSites: "",
  newIndices: "",
  howToParticipate: "",
  abundantLife: "",
  name: "",
  email: "",
  website: "",
};

export function BlueprintForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState("");

  if (submitted) {
    return (
      <div className="rounded-md border border-brand-gold/30 bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 size-8 text-brand-gold" />
        <p className="mb-2 font-heading text-xl font-bold text-foreground">Received. Thank you.</p>
        <p className="text-foreground/70">
          Your voice is now part of the architecture. Every response shapes what gets built next.
        </p>
      </div>
    );
  }

  return (
    <Formik<Values>
      initialValues={INITIAL}
      validationSchema={schema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={async (v) => {
        setError(null);
        const answers = Object.fromEntries(QUESTIONS.map((q) => [q.key, v[q.key] ?? ""])) as Record<BlueprintKey, string>;
        const labels = Object.fromEntries(QUESTIONS.map((q) => [q.key, q.label])) as Record<BlueprintKey, string>;
        const res = await submitBlueprint({ answers, labels, name: v.name, email: v.email, website: v.website }).catch(() => ({
          ok: false,
          error: "This couldn't be saved just now.",
        }));
        if (res.ok) return setSubmitted(true);
        setError(res.error ?? "Something went wrong.");
        setFallback(
          mailtoHref(CONTACT_EMAIL, "My Blueprint for the Living Declaration", [
            ...QUESTIONS.filter((q) => answers[q.key].trim()).map((q) => `${q.label}\n${answers[q.key].trim()}\n`),
            v.name?.trim() && `From: ${v.name.trim()}`,
            v.email?.trim() && `Reply to: ${v.email.trim()}`,
          ]),
        );
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form noValidate>
          {QUESTIONS.map((q) => (
            <div key={q.key} className="mb-8">
              <label
                htmlFor={`blueprint-${q.key}`}
                className="mb-2 block font-heading text-lg leading-snug font-semibold text-foreground"
              >
                {q.label}
              </label>
              <Field
                as="textarea"
                id={`blueprint-${q.key}`}
                name={q.key}
                rows={4}
                maxLength={5000}
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
              <Field type="text" name="name" autoComplete="name" maxLength={256} placeholder="Your name" aria-label="Your name" className={FIELD_CLASS} />
              <div>
                <Field type="email" name="email" autoComplete="email" maxLength={320} placeholder="Your email" aria-label="Your email" className={FIELD_CLASS} />
                {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
              </div>
            </div>
            <Field name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          </div>

          {errors.biggestChallenge && (
            <p role="alert" className="mb-4 text-sm text-foreground">
              {errors.biggestChallenge}
            </p>
          )}
          {error && <FormError error={error} mailto={fallback} className="mb-4 text-sm text-foreground" />}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xs bg-[#0A0A10] px-8 py-3.5 font-mono text-xs tracking-[0.15em] text-[#F5F0E0] uppercase disabled:opacity-70 dark:bg-brand-gold-light dark:text-[#0A0A10]"
          >
            {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
            Submit My Blueprint {!isSubmitting && <ArrowRight aria-hidden="true" className="size-3.5" />}
          </button>
          <p className="mt-3 text-sm text-muted-foreground">
            Your responses are read personally. They shape what gets built. Nothing is sold or shared.
          </p>
        </Form>
      )}
    </Formik>
  );
}
