"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { commit } from "@/app/blog/[slug]/engagement-actions";
import { refreshPostEngagement, usePostEngagement } from "./use-post-engagement";

// Legacy EngagementFeatures.tsx MicroCommitmentBox, shown after "The thread
// continues". A single field, so no Formik (CONTRIBUTING rule 6). Copy unchanged.
export function MicroCommitment({ slug }: { slug: string }) {
  const data = usePostEngagement(slug);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || saving) return;
    setSaving(true);
    setError(null);
    const res = await commit({ slug, commitment: value });
    setSaving(false);
    if (!res.ok) return setError(res.error ?? "Something went wrong.");
    setDone(true);
    refreshPostEngagement(slug);
  }

  if (done) {
    return (
      <div className="mx-auto my-8 max-w-275 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 px-7 py-6">
        <p role="status" className="text-base text-brand-gold">
          Commitment recorded. Come back and tell us how it went.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="commitment-title" className="mx-auto my-8 max-w-275 rounded-2xl border border-border bg-card px-5 py-7 sm:px-7">
      <p className="mb-2 font-mono text-[0.68rem] tracking-[0.12em] text-brand-gold uppercase">Micro-Commitment</p>
      <h2 id="commitment-title" className="mb-4 font-heading text-lg text-foreground sm:text-xl">
        What&apos;s one thing you&apos;ll do differently after reading this?
      </h2>
      <form onSubmit={submit} className="flex gap-2.5">
        <label htmlFor="commitment" className="sr-only">
          I will...
        </label>
        <input
          id="commitment"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="I will..."
          maxLength={500}
          className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-background px-4 text-[0.95rem] text-foreground placeholder:text-muted-foreground focus-visible:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/30 focus-visible:outline-none"
        />
        <button
          type="submit"
          disabled={!value.trim() || saving}
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brand-gold px-5 font-mono text-xs tracking-[0.1em] text-white uppercase transition-opacity hover:opacity-90 disabled:bg-muted-foreground disabled:opacity-70"
        >
          {saving && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          Commit
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {data && data.commitments.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-2 font-mono text-[0.68rem] tracking-[0.08em] text-muted-foreground uppercase">Others committed to:</p>
          <ul className="space-y-1">
            {data.commitments.map((c, i) => (
              <li key={i} className="text-sm text-foreground/80 italic">
                &ldquo;{c}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
