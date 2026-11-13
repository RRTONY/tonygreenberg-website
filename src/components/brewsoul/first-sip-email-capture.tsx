"use client";

import { useId, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Check, Loader2 } from "lucide-react";

const CONTACT_EMAIL = "tony@tonygreenberg.com";

// The owner asked (2026-11-14) for small email sign-ups to use Formik + Yup too.
const schema = Yup.object({
  email: Yup.string().trim().email("That email address doesn't look right.").required("Enter your email address."),
});

type Values = Yup.InferType<typeof schema>;

// Legacy submitted straight to a tRPC subscribe mutation that (among other
// things) forwarded to Kit (ConvertKit). That real Kit forwarding now
// exists at /api/subscribe — submitting tries that first, falling back to
// a pre-filled mailto: only if it fails (no fake success state either way).
export function FirstSipEmailCapture() {
  const errorId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [viaMailto, setViaMailto] = useState(false);

  const subscribe = async ({ email: raw }: Values) => {
    if (submitted) return;
    const email = raw.trim();
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "first-sip" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
    } catch {
      const subject = encodeURIComponent("Subscribe me to BrewSoul updates");
      const body = encodeURIComponent(`Please add this address to the list: ${email}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setViaMailto(true);
    }
    setSubmitted(true);
  };

  return (
    <Formik<Values> initialValues={{ email: "" }} validationSchema={schema} onSubmit={subscribe}>
      {({ values, errors, touched, isSubmitting }) => {
        const invalid = Boolean(touched.email && errors.email);
        return (
          <>
            <Form noValidate className="flex gap-2">
              <Field
                type="email"
                name="email"
                aria-label="Email address"
                placeholder="your@email.com"
                required
                aria-invalid={invalid}
                aria-describedby={invalid ? errorId : undefined}
                className="flex-1 rounded-md border border-[#6F4E37]/20 bg-white px-3.5 py-2.5 text-[#2C1810]"
              />
              <button
                type="submit"
                disabled={submitted || isSubmitting || !values.email}
                aria-busy={isSubmitting}
                className={`inline-flex items-center gap-1.5 rounded-md px-5 py-2.5 font-mono text-xs tracking-wide text-white ${submitted ? "bg-[#2D5A27]" : "bg-[#836311]"}`}
              >
                {submitted ? (
                  <>
                    {viaMailto ? "Sent" : "Subscribed"} <Check aria-hidden="true" className="size-3.5" />
                  </>
                ) : (
                  <>
                    {/* House rule 7: a real spinner next to the label, never ellipsis text. */}
                    {isSubmitting && <Loader2 aria-hidden="true" data-testid="first-sip-spinner" className="size-3.5 animate-spin" />}
                    Subscribe
                  </>
                )}
              </button>
            </Form>
            <ErrorMessage name="email">
              {(msg) => (
                <p id={errorId} role="alert" className="mt-1.5 text-xs text-[#8B2E1F]">
                  {msg}
                </p>
              )}
            </ErrorMessage>
          </>
        );
      }}
    </Formik>
  );
}
