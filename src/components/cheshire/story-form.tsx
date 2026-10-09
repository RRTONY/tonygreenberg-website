"use client";

import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { submitStory } from "@/app/forms/actions";
import { FormError, mailtoHref } from "@/components/forms/form-error";

// "Submit Your Story" on the fraud case pages (/protecting-your-business,
// /alex-azzi). Legacy ProtectingYourBusiness.tsx's `SubmitStoryForm`, same
// fields, labels and placeholders, posting to `trpc.cheshire.submit`. The
// first port swapped it for a plain mailto button; since 2026-10-10 it saves
// to Supabase again (`submitStory` in src/app/forms/actions.ts →
// cheshire_submissions) and emails Tony. If saving fails, the error offers
// the page's old pre-filled email instead, so no story is lost.
const schema = Yup.object({
  relationship: Yup.string().trim().max(128).required("Add your relationship to the person."),
  city: Yup.string().trim().max(256),
  dateRange: Yup.string().trim().max(128),
  promisedVsDelivered: Yup.string()
    .trim()
    .min(50, "Please provide at least 50 characters describing what happened.")
    .max(10000)
    .required("Please provide at least 50 characters describing what happened."),
  receivedPayment: Yup.string().oneOf(["no", "partial", "yes"]).required(),
  amountOwed: Yup.string().trim().max(64),
  hasDocumentation: Yup.string().trim().max(256),
  contactEmail: Yup.string().trim().email("That email address doesn't look right.").max(320),
  willingToContact: Yup.boolean(),
  website: Yup.string(),
});

type Values = Yup.InferType<typeof schema>;

const INITIAL: Values = {
  relationship: "",
  city: "",
  dateRange: "",
  promisedVsDelivered: "",
  receivedPayment: "no",
  amountOwed: "",
  hasDocumentation: "",
  contactEmail: "",
  willingToContact: false,
  website: "",
};

const LABEL = "mb-1 block font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase";
const INPUT =
  "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-base text-foreground outline-none focus:border-red-800 focus-visible:ring-2 focus-visible:ring-red-800/20";
const ERROR = "mt-1 text-sm text-red-800 dark:text-[#E07A80]";

export function StoryForm({
  sourcePage,
  fallbackEmail,
  fallbackSubject,
}: {
  sourcePage: "protecting-your-business" | "alex-azzi";
  fallbackEmail: string;
  fallbackSubject: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState("");

  if (submitted) {
    return (
      <div role="status" className="mx-auto mt-4 max-w-lg rounded-md border border-green-700/25 bg-green-700/5 p-6">
        <CheckCircle2 aria-hidden="true" className="mx-auto mb-2 size-7 text-green-700 dark:text-green-500" />
        <p className="mb-1 font-heading text-lg font-bold text-foreground">Your story has been received.</p>
        <p className="text-foreground/70">
          Every submission is reviewed personally. If you provided contact information, you may hear from us. Thank you for
          breaking the silence.
        </p>
      </div>
    );
  }

  return (
    <Formik<Values>
      initialValues={INITIAL}
      validationSchema={schema}
      onSubmit={async (v) => {
        setError(null);
        const res = await submitStory({ sourcePage, ...v }).catch(() => ({ ok: false, error: "This couldn't be saved just now." }));
        if (res.ok) return setSubmitted(true);
        setError(res.error ?? "Something went wrong.");
        setFallback(
          mailtoHref(fallbackEmail, fallbackSubject, [
            `Relationship: ${v.relationship}`,
            v.city && `City / State: ${v.city}`,
            v.dateRange && `Date range: ${v.dateRange}`,
            "",
            "What happened:",
            v.promisedVsDelivered,
            "",
            `Paid what was owed: ${v.receivedPayment}`,
            v.amountOwed && `Amount owed: ${v.amountOwed}`,
            v.hasDocumentation && `Documentation: ${v.hasDocumentation}`,
            v.contactEmail && `Contact: ${v.contactEmail}`,
          ]),
        );
      }}
    >
      {({ isSubmitting }) => (
        <Form noValidate className="mx-auto mt-6 grid max-w-2xl gap-4 text-left">
          <div>
            <label htmlFor={`${sourcePage}-relationship`} className={LABEL}>
              Your relationship to the person *
            </label>
            <Field id={`${sourcePage}-relationship`} name="relationship" maxLength={128} placeholder="e.g., Employer, Client, Business Partner" className={INPUT} />
            <ErrorMessage name="relationship" component="p" className={ERROR} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${sourcePage}-city`} className={LABEL}>
                City / State
              </label>
              <Field id={`${sourcePage}-city`} name="city" maxLength={256} placeholder="e.g., Santa Monica, CA" className={INPUT} />
            </div>
            <div>
              <label htmlFor={`${sourcePage}-dates`} className={LABEL}>
                Date Range
              </label>
              <Field id={`${sourcePage}-dates`} name="dateRange" maxLength={128} placeholder="e.g., Jan 2024 – Jun 2024" className={INPUT} />
            </div>
          </div>

          <div>
            <label htmlFor={`${sourcePage}-story`} className={LABEL}>
              What happened? What was promised vs. what was delivered? *
            </label>
            <Field
              as="textarea"
              id={`${sourcePage}-story`}
              name="promisedVsDelivered"
              rows={5}
              maxLength={10000}
              placeholder="Describe the situation in detail. What were you promised? What actually happened? Include amounts, dates, and any documentation you have. (Minimum 50 characters)"
              className={`${INPUT} resize-y`}
            />
            <ErrorMessage name="promisedVsDelivered" component="p" className={ERROR} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${sourcePage}-paid`} className={LABEL}>
                Were you paid what was owed? *
              </label>
              <Field as="select" id={`${sourcePage}-paid`} name="receivedPayment" className={INPUT}>
                <option value="no">No</option>
                <option value="partial">Partially</option>
                <option value="yes">Yes</option>
              </Field>
            </div>
            <div>
              <label htmlFor={`${sourcePage}-owed`} className={LABEL}>
                Amount Owed
              </label>
              <Field id={`${sourcePage}-owed`} name="amountOwed" maxLength={64} placeholder="e.g., $15,000" className={INPUT} />
            </div>
          </div>

          <div>
            <label htmlFor={`${sourcePage}-docs`} className={LABEL}>
              Do you have documentation? (invoices, emails, contracts)
            </label>
            <Field id={`${sourcePage}-docs`} name="hasDocumentation" maxLength={256} placeholder="e.g., Yes — emails, signed contract, bank records" className={INPUT} />
          </div>

          <div>
            <label htmlFor={`${sourcePage}-email`} className={LABEL}>
              Contact email (optional — for follow-up only)
            </label>
            <Field id={`${sourcePage}-email`} type="email" name="contactEmail" autoComplete="email" maxLength={320} placeholder="your@email.com" className={INPUT} />
            <ErrorMessage name="contactEmail" component="p" className={ERROR} />
          </div>

          <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-foreground/80">
            <Field type="checkbox" name="willingToContact" className="size-4 accent-red-800" />
            I am willing to be contacted about this submission
          </label>
          <Field name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          {error && <FormError error={error} mailto={fallback} className="text-sm text-foreground" />}

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-red-800 px-6 py-2.5 font-mono text-xs font-semibold tracking-wide text-white uppercase disabled:opacity-70"
            >
              {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
              Share Your Story
              {!isSubmitting && <ArrowRight aria-hidden="true" className="size-3.5" />}
            </button>
          </div>
          <p className="text-center font-mono text-[0.68rem] leading-relaxed text-muted-foreground">
            All submissions are confidential. Anonymous submissions are accepted. Your story will not be published without your
            explicit written consent. We are not attorneys and this is not legal advice.
          </p>
        </Form>
      )}
    </Formik>
  );
}
