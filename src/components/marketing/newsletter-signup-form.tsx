"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { readVisitorState, writeVisitorState } from "@/lib/visitor-state-client";

type NewsletterState = {
  subscribed?: boolean;
};

type NewsletterSignupFormProps = {
  source?: string;
};

export function NewsletterSignupForm({ source = "subscribe" }: NewsletterSignupFormProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    void readVisitorState<NewsletterState>("newsletter")
      .then((state) => {
        if (!cancelled && state?.subscribed) setSubscribed(true);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || subscribed) return;

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const result = (await response.json()) as { message?: string; success?: boolean };

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Newsletter service error");
      }

      setSubscribed(true);
      void writeVisitorState("newsletter", { popupShown: true, subscribed: true }).catch(
        () => undefined,
      );
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not complete your subscription. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (subscribed) {
    return (
      <div
        role="status"
        className="rounded-lg border border-brand-gold/30 bg-brand-gold/8 p-6 text-center"
      >
        <CheckCircle2 aria-hidden="true" className="mx-auto mb-3 size-7 text-brand-gold" />
        <p className="font-heading text-xl text-foreground">You&apos;re on the list.</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          New essays will arrive directly when there is something worth sending.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-5 sm:p-6">
      <label
        htmlFor="throughline-email"
        className="font-mono text-xs tracking-[0.16em] text-brand-gold uppercase"
      >
        Email address
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Input
          id="throughline-email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          required
          className="h-11 flex-1 bg-background"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 font-mono text-xs tracking-wide uppercase"
        >
          {isSubmitting && <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />}
          Join the Conversation
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Free essays, sent without an algorithm. You may unsubscribe at any time.
      </p>
    </form>
  );
}
