"use client";

import { useId, useState } from "react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { ArrowRight, Loader2, Mail, Shield, Zap } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/liquidsun/motion";
import { useLanguage } from "@/components/liquidsun/liquidsun-providers";
import { emailCaptureSchema, type EmailCaptureValues } from "@/lib/content/liquidsun/forms";

// Ported from the LiquidSun app's client/src/components/EmailCapture.tsx (2026-11-21). The app saved
// to its own database (trpc.email.subscribe); this posts to the site's /api/subscribe (Kit), tagged
// "LiquidSun: Homepage" (source "liquidsun-homepage", kit-source-tags.ts). Formik + Yup (owner,
// 2026-11-21): the app's "Enter a valid email address" toast is now the field's own message, in
// EN or ES. While sending, the button shows a spinner (house rule 7) instead of "Joining...".

export function EmailCapture() {
  const [submitted, setSubmitted] = useState(false);
  const { language } = useLanguage();
  const errorId = useId();

  async function handleSubmit(values: EmailCaptureValues, { setSubmitting }: FormikHelpers<EmailCaptureValues>) {
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email.trim(), source: "liquidsun-homepage" }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (res.ok && data.success) {
        setSubmitted(true);
        toast.success("Welcome to the resistance. Check your inbox.");
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative z-10 px-4 py-32">
      <div className="container mx-auto max-w-4xl">
        <Reveal
          enter="animate-in fade-in slide-in-from-bottom-[50px] duration-800 fill-mode-both"
          className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-linear-to-br from-amber-950/40 to-black/60 p-10 text-center backdrop-blur-xl md:p-16"
        >
          <div className="absolute top-0 left-1/2 h-32 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[80px]" />

          <div className="relative z-10">
            <div className="mb-6 flex justify-center">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                <Mail aria-hidden="true" className="size-7 text-amber-400" />
              </div>
            </div>

            <h3 className="mb-4 font-serif text-3xl leading-tight text-amber-50 md:text-5xl">
              Join the{" "}
              <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent italic">Resistance</span>
            </h3>

            <p className="mx-auto mb-10 max-w-2xl font-serif text-lg font-light text-slate-400">
              Weekly drops: new additive-free discoveries, distillery deep-dives, and price alerts. No spam. No brand deals. Just the
              truth about tequila.
            </p>

            {submitted ? (
              <div className="mx-auto max-w-md animate-in rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 duration-300 fade-in zoom-in-90">
                <Zap aria-hidden="true" className="mx-auto mb-3 size-8 text-emerald-400" />
                <p className="font-serif text-lg text-emerald-300">You&apos;re in.</p>
                <p className="mt-1 text-sm text-slate-500">First dispatch arrives this week.</p>
              </div>
            ) : (
              <Formik<EmailCaptureValues>
                initialValues={{ email: "" }}
                validationSchema={emailCaptureSchema(language)}
                validateOnBlur={false}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => {
                  const invalid = Boolean(touched.email && errors.email);
                  return (
                    <Form noValidate className="mx-auto max-w-lg">
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <label htmlFor="liquidsun-email" className="sr-only">
                          Email address
                        </label>
                        <Field
                          id="liquidsun-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="your@email.com"
                          aria-invalid={invalid}
                          aria-describedby={invalid ? errorId : undefined}
                          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-5 py-3.5 font-mono text-sm text-white transition-all placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          aria-busy={isSubmitting}
                          className="group flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-8 py-3.5 font-mono text-sm font-bold tracking-widest text-black uppercase transition-all duration-300 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
                        >
                          {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                          Subscribe
                          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                      <ErrorMessage name="email">
                        {(message) => (
                          <p id={errorId} role="alert" className="mt-3 text-left font-mono text-xs text-red-400">
                            {message}
                          </p>
                        )}
                      </ErrorMessage>
                    </Form>
                  );
                }}
              </Formik>
            )}

            <div className="mt-6 flex items-center justify-center gap-4 font-mono text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <Shield aria-hidden="true" className="size-3" />
                <span>No spam, ever</span>
              </div>
              <span>•</span>
              <span>Unsubscribe anytime</span>
              <span>•</span>
              <span>Free forever</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
