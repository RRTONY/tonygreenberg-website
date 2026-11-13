"use client";

import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const CONTACT_EMAIL = "tony@tonygreenberg.com";

// Ported from legacy client/src/pages/Blog.tsx's hero "ABIT Waitlist" email
// capture — real copy, real box/input/button treatment, restored after an
// earlier pass dropped it entirely. Legacy posted to a `trpc` subscribe
// mutation this migration hasn't built; same honest-degradation pattern
// used throughout this migration (BrewSoul's submit-form.tsx, Kava's
// assessment print action) — this composes a real `mailto:` to Tony with
// the entered address instead of a fake "you're on the list" success tied
// to nothing.
//
// Owner (2026-11-14): even one-field sign-ups use Formik + Yup.
const schema = Yup.object({
  email: Yup.string().trim().email("That email address doesn't look right.").required("Add your email."),
});

type Values = Yup.InferType<typeof schema>;

const ERROR_ID = "abit-waitlist-email-error";

export function AbitWaitlistForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (values: Values) => {
    const subject = encodeURIComponent("ABIT Waitlist");
    const body = encodeURIComponent(`Please add me to the ABIT (Asset-Backed Impact Tokens) waitlist.\n\nEmail: ${values.email.trim()}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 font-body text-sm text-brand-gold-light">
        <span className="text-base">◆</span>
        <span>Your email client should be open — send it and you&apos;re on the list.</span>
      </div>
    );
  }

  return (
    <div className="max-w-120">
      <div className="mb-2 font-mono text-[0.7rem] tracking-[0.18em] text-brand-gold-light/70 uppercase">
        ABIT Waitlist — Asset-Backed Impact Tokens
      </div>
      <Formik<Values> initialValues={{ email: "" }} validationSchema={schema} onSubmit={handleSubmit}>
        {({ errors, touched }) => {
          const invalid = Boolean(touched.email && errors.email);
          return (
            <>
              <Form noValidate className="flex overflow-hidden rounded-sm border border-brand-gold-light/35 bg-white/6 backdrop-blur-sm">
                <Field
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  aria-label="Email address"
                  aria-invalid={invalid}
                  aria-describedby={invalid ? ERROR_ID : undefined}
                  className="min-w-0 flex-1 rounded-sm bg-transparent px-4 py-2.5 font-body text-sm text-[#F5F0E0] outline-none placeholder:text-[#F5F0E0]/50 focus-visible:ring-2 focus-visible:ring-brand-gold-light/60"
                />
                <button type="submit" className="shrink-0 bg-brand-gold/85 px-5 py-2.5 font-mono text-xs font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-brand-gold">
                  Join Waitlist
                </button>
              </Form>
              <ErrorMessage
                name="email"
                render={(msg) => (
                  <p id={ERROR_ID} role="alert" className="mt-2 font-body text-sm text-red-300">
                    {msg}
                  </p>
                )}
              />
            </>
          );
        }}
      </Formik>
    </div>
  );
}
