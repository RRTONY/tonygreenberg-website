"use client";

import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { ArrowRight, Loader2, Sparkle } from "lucide-react";
import { askTony } from "@/app/blog/[slug]/engagement-actions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Legacy AskTonyModal.tsx: "Ask Tony directly" under every essay. The
// question is emailed straight to Tony, nothing is stored. Copy unchanged.

const schema = Yup.object({
  name: Yup.string().trim().max(128).required("Add your name."),
  email: Yup.string().trim().email("That email address doesn't look right.").max(320),
  question: Yup.string().trim().max(2000, "Keep it under 2,000 characters.").required("Write your question first."),
  website: Yup.string(),
});

const FIELD_CLASS =
  "w-full min-w-0 rounded-xs border border-foreground/15 bg-background px-3.5 py-3 text-[0.95rem] text-foreground placeholder:text-muted-foreground focus-visible:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/30 focus-visible:outline-none";

export function AskTonyDialog({ slug, title }: { slug: string; title: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="my-6 flex justify-center">
      <Dialog>
        <DialogTrigger className="inline-flex min-h-11 items-center gap-2 border border-brand-gold/40 px-6 font-mono text-xs tracking-[0.14em] text-brand-gold uppercase transition-colors hover:bg-brand-gold/6">
          <Sparkle aria-hidden="true" className="size-3" />
          Ask Tony directly
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          {sent ? (
            <DialogHeader>
              <DialogTitle className="font-fell text-2xl font-normal italic">Tony will read this.</DialogTitle>
              <DialogDescription className="leading-relaxed">
                Your question has been sent directly to him. He reads everything. He does not respond to everything. But he
                reads everything.
              </DialogDescription>
            </DialogHeader>
          ) : (
            <>
              <DialogHeader>
                <p className="font-mono text-[0.68rem] tracking-[0.15em] text-brand-gold uppercase">Ask Tony directly</p>
                <DialogTitle className="font-fell text-xl leading-snug font-normal italic">
                  {title ? `A question about "${title}"` : "What's on your mind?"}
                </DialogTitle>
                <DialogDescription>This goes directly to Tony. Not a bot. Not a form that disappears into a CRM.</DialogDescription>
              </DialogHeader>
              <Formik
                initialValues={{ name: "", email: "", question: "", website: "" }}
                validationSchema={schema}
                onSubmit={async (values) => {
                  setError(null);
                  const res = await askTony({ slug, postTitle: title, ...values });
                  if (!res.ok) return setError(res.error ?? "Something went wrong.");
                  setSent(true);
                }}
              >
                {({ isSubmitting }) => (
                  <Form noValidate className="flex flex-col gap-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="ask-name" className="sr-only">
                          Your name (required)
                        </label>
                        <Field id="ask-name" name="name" placeholder="Your name *" autoComplete="name" maxLength={128} className={FIELD_CLASS} />
                        <ErrorMessage name="name" component="p" className="mt-1 text-sm text-destructive" />
                      </div>
                      <div>
                        <label htmlFor="ask-email" className="sr-only">
                          Email (so he can reply)
                        </label>
                        <Field
                          id="ask-email"
                          name="email"
                          type="email"
                          placeholder="Email (so he can reply)"
                          autoComplete="email"
                          maxLength={320}
                          className={FIELD_CLASS}
                        />
                        <ErrorMessage name="email" component="p" className="mt-1 text-sm text-destructive" />
                      </div>
                    </div>
                    <Field name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                    <label htmlFor="ask-question" className="sr-only">
                      Your question
                    </label>
                    <Field
                      as="textarea"
                      id="ask-question"
                      name="question"
                      rows={4}
                      maxLength={2000}
                      placeholder="Ask anything. The weirder the better."
                      className={`${FIELD_CLASS} min-h-28 resize-y leading-relaxed`}
                    />
                    <ErrorMessage name="question" component="p" className="text-sm text-destructive" />
                    {error && (
                      <p role="alert" className="text-sm text-destructive">
                        {error}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xs bg-foreground px-6 font-mono text-xs tracking-[0.1em] text-background uppercase hover:opacity-85 disabled:opacity-60"
                    >
                      {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                      Send to Tony
                      {!isSubmitting && <ArrowRight aria-hidden="true" className="size-3.5" />}
                    </button>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
