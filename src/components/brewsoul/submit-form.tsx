"use client";

import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { submitBrewSoul } from "@/app/forms/actions";
import { FormError, mailtoHref } from "@/components/forms/form-error";

const CONTACT_EMAIL = "tony@tonygreenberg.com";

type SubmissionType = "submit" | "appeal";

// Ported from legacy client/src/pages/brewsoul/BrewSoulTools.tsx's
// `BrewSoulSubmit`. Legacy's own comment admitted "In production this would
// POST to a tRPC endpoint": it only wrote to `localStorage` and showed
// "Received." anyway, so nobody ever saw a submission. The first port used a
// pre-filled email instead; since 2026-10-10 it saves to Supabase
// (`submitBrewSoul` in src/app/forms/actions.ts → brewsoul_submissions) and
// emails Tony, so "Received." is now true. If saving fails, the error offers
// the pre-filled email instead.
const schema = Yup.object({
  type: Yup.string().oneOf(["submit", "appeal"]).required(),
  name: Yup.string().trim().max(256).required("Add the coffee's name."),
  roaster: Yup.string().trim().max(256),
  url: Yup.string().trim().max(512).matches(/^https?:\/\/\S+$/i, { message: "Use a web address starting with http.", excludeEmptyString: true }),
  notes: Yup.string().trim().max(5000),
  website: Yup.string(),
});

type Values = Yup.InferType<typeof schema>;

const INPUT = "rounded-lg border border-[#6F4E37]/15 px-4 py-3 text-sm";
const ERROR = "-mt-2 text-[0.8rem] text-[#8E1E25]";

export function SubmitForm() {
  const [sent, setSent] = useState<SubmissionType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState("");

  if (sent) {
    return (
      <div role="status" className="rounded-xl border border-[#6F4E37]/8 bg-white p-12 text-center">
        <div className="mb-2 font-heading text-[1.3rem] text-[#2C1810]">Received.</div>
        <p className="text-[0.9rem] text-[#6B5B4F]">
          We&apos;ll review your {sent === "submit" ? "submission" : "appeal"} and update accordingly.
        </p>
      </div>
    );
  }

  return (
    <Formik<Values>
      initialValues={{ type: "submit", name: "", roaster: "", url: "", notes: "", website: "" }}
      validationSchema={schema}
      onSubmit={async (v) => {
        setError(null);
        const kind = v.type as SubmissionType;
        const res = await submitBrewSoul({ kind, coffeeName: v.name, roaster: v.roaster, url: v.url, notes: v.notes, website: v.website }).catch(() => ({
          ok: false,
          error: "This couldn't be saved just now.",
        }));
        if (res.ok) return setSent(kind);
        setError(res.error ?? "Something went wrong.");
        setFallback(
          mailtoHref(CONTACT_EMAIL, kind === "submit" ? `BrewSoul coffee submission: ${v.name}` : `BrewSoul score appeal: ${v.name}`, [
            `Coffee: ${v.name}`,
            `Roaster: ${v.roaster}`,
            `Link: ${v.url}`,
            "",
            `${kind === "submit" ? "Why it should be added" : "What we got wrong"}:`,
            v.notes,
          ]),
        );
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form noValidate className="flex flex-col gap-4">
          <div className="flex gap-3">
            {(["submit", "appeal"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={values.type === t}
                onClick={() => setFieldValue("type", t)}
                className={`rounded-lg px-5 py-2 font-mono text-[0.78rem] ${
                  values.type === t ? "border-2 border-[#C5A23C] bg-[#C5A23C]/8 text-[#836311]" : "border border-[#6F4E37]/15 bg-white text-[#6B5B4F]"
                }`}
              >
                {t === "submit" ? "Submit a Coffee" : "Appeal a Score"}
              </button>
            ))}
          </div>
          <Field type="text" name="name" placeholder="Coffee name" aria-label="Coffee name" maxLength={256} required className={INPUT} />
          <ErrorMessage name="name" component="p" className={ERROR} />
          <Field type="text" name="roaster" placeholder="Roaster" aria-label="Roaster" maxLength={256} className={INPUT} />
          <Field type="url" name="url" placeholder="Link (optional)" aria-label="Link (optional)" maxLength={512} className={INPUT} />
          <ErrorMessage name="url" component="p" className={ERROR} />
          <Field
            as="textarea"
            name="notes"
            placeholder={values.type === "submit" ? "Why should we add this coffee?" : "What did we get wrong and why?"}
            aria-label={values.type === "submit" ? "Why should we add this coffee?" : "What did we get wrong and why?"}
            rows={4}
            maxLength={5000}
            className={`resize-y ${INPUT}`}
          />
          <Field name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          {error && <FormError error={error} mailto={fallback} className="text-sm text-[#2C1810]" />}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-br from-[#6F4E37] to-[#A68B3C] px-8 py-3.5 font-mono text-[0.85rem] tracking-[0.15em] text-white uppercase disabled:opacity-70"
          >
            {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
            {values.type === "submit" ? "Submit for Review" : "File Appeal"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
