"use client";

import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Loader2, Sparkle } from "lucide-react";
import { addComment } from "@/app/blog/[slug]/engagement-actions";
import { refreshPostEngagement, usePostEngagement } from "./use-post-engagement";

// Legacy BlogComments.tsx ("Discourse"): name, optional private email and a
// thought, shown under the essay straight away, newest first. Copy unchanged.

const schema = Yup.object({
  name: Yup.string().trim().max(128).required("Add your name."),
  // Optional: an untouched field sends "", which .email() accepts.
  email: Yup.string().trim().email("That email address doesn't look right.").max(320),
  content: Yup.string().trim().max(2000, "Keep it under 2,000 characters.").required("Write your thought first."),
  website: Yup.string(),
});

const FIELD_CLASS =
  "w-full min-w-0 rounded-xs border border-foreground/15 bg-background px-3.5 py-3 text-[0.95rem] text-foreground placeholder:text-muted-foreground focus-visible:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/30 focus-visible:outline-none";

export function PostComments({ slug, title }: { slug: string; title: string }) {
  const data = usePostEngagement(slug);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const comments = data?.comments ?? [];

  return (
    <section aria-labelledby="discourse-title" className="mt-8 mb-8">
      <h2
        id="discourse-title"
        className="mb-4 border-b border-brand-gold/15 pb-1.5 font-mono text-xs font-medium tracking-[0.15em] text-brand-gold uppercase"
      >
        Discourse{comments.length > 0 && ` · ${comments.length}`}
      </h2>

      {sent ? (
        <p role="status" className="mb-6 flex items-center gap-2 font-fell text-base text-essay-sepia italic">
          <Sparkle aria-hidden="true" className="size-3.5 text-brand-gold" />
          Your thought has been received. Thank you for adding to the conversation.
        </p>
      ) : (
        <Formik
          initialValues={{ name: "", email: "", content: "", website: "" }}
          validationSchema={schema}
          onSubmit={async (values) => {
            setError(null);
            const res = await addComment({ slug, postTitle: title, ...values });
            if (!res.ok) return setError(res.error ?? "Something went wrong.");
            setSent(true);
            refreshPostEngagement(slug);
          }}
        >
          {({ isSubmitting }) => (
            <Form noValidate className="mb-8">
              <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="comment-name" className="sr-only">
                    Your name (required)
                  </label>
                  <Field id="comment-name" name="name" placeholder="Your name *" autoComplete="name" maxLength={128} className={FIELD_CLASS} />
                  <ErrorMessage name="name" component="p" className="mt-1 text-sm text-destructive" />
                </div>
                <div>
                  <label htmlFor="comment-email" className="sr-only">
                    Email (optional, not published)
                  </label>
                  <Field
                    id="comment-email"
                    name="email"
                    type="email"
                    placeholder="Email (optional, not published)"
                    autoComplete="email"
                    maxLength={320}
                    className={FIELD_CLASS}
                  />
                  <ErrorMessage name="email" component="p" className="mt-1 text-sm text-destructive" />
                </div>
              </div>
              {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
              <Field name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <label htmlFor="comment-content" className="sr-only">
                Your thought
              </label>
              <Field
                as="textarea"
                id="comment-content"
                name="content"
                rows={4}
                maxLength={2000}
                placeholder="What does this stir in you? Add to the conversation…"
                className={`${FIELD_CLASS} min-h-28 resize-y leading-relaxed`}
              />
              <ErrorMessage name="content" component="p" className="mt-1 text-sm text-destructive" />
              {error && (
                <p role="alert" className="mt-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xs bg-foreground px-6 font-mono text-xs tracking-[0.1em] text-background uppercase transition-opacity hover:opacity-85 disabled:opacity-60"
              >
                {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                Leave your thought
              </button>
            </Form>
          )}
        </Formik>
      )}

      {comments.length > 0 ? (
        <ol className="flex flex-col gap-4">
          {comments.map((c) => (
            <li key={c.id} className="rounded-xs border border-brand-gold/12 bg-brand-gold/3 px-5 py-4">
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-heading text-[0.95rem] font-semibold text-foreground">{c.name}</span>
                <time dateTime={c.createdAt} className="font-mono text-[0.7rem] text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </time>
              </div>
              <p className="font-essay text-[0.95rem] leading-relaxed whitespace-pre-line text-essay-ink">{c.content}</p>
            </li>
          ))}
        </ol>
      ) : (
        data && <p className="text-center text-sm text-muted-foreground italic">Be the first to add to this conversation.</p>
      )}
    </section>
  );
}
