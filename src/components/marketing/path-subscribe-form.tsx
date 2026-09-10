"use client";

import { useCallback, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ArchetypeKey } from "@/lib/content/archetypes";

// Ported from legacy client/src/pages/PathPage.tsx's inline email-capture
// box. Legacy posted to `trpc.subscribe.add` (no tRPC backend exists in
// this app); replaced with the real POST to `/api/subscribe` that
// `/assessment`'s own subscribe box (components/assessments/
// assessment-quiz.tsx) already established for this exact
// Builder/Crusader/Investor archetype flow — same `pending`/`subscribed`/
// `subError` state shape and the same real `Loader2` spinner house rule
// (legacy rendered literal "..." text while its mutation was pending).
// `source` uses `path-<archetype>` (legacy's own source string), distinct
// from `/assessment`'s `assessment-<archetype>` tags already in
// `lib/content/kit-source-tags.ts` — that map has no `path-*` entries yet,
// so this currently resolves to a generated `Source: path-builder` etc.
// tag rather than a named one (see NEEDS in the migration report).
export function PathSubscribeForm({ archetypeKey }: { archetypeKey: ArchetypeKey }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [pending, setPending] = useState(false);
  const [subError, setSubError] = useState("");

  const handleSubscribe = useCallback(async () => {
    if (!email || subscribed || pending) return;
    setSubError("");
    setPending(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: `path-${archetypeKey}` }),
      });
      const data = (await res.json()) as { success: boolean; message?: string };
      if (data.success) setSubscribed(true);
      else setSubError(data.message ?? "Something went wrong. Please try again.");
    } catch {
      setSubError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }, [email, subscribed, pending, archetypeKey]);

  return (
    <div className="rounded-lg border border-border bg-card p-6 text-center">
      <p className="mb-4 text-[0.95rem] text-card-foreground/80">
        Get essays curated for your archetype — delivered weekly.
      </p>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 bg-background"
        />
        <Button
          onClick={handleSubscribe}
          disabled={pending || subscribed || !email}
          className="h-10 shrink-0 font-mono text-xs tracking-wide uppercase"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {subscribed ? (
            <span className="inline-flex items-center gap-1">
              <Check aria-hidden="true" className="size-3.5" /> Subscribed
            </span>
          ) : (
            "Subscribe"
          )}
        </Button>
      </div>
      {subError && <p className="mt-2 text-left text-sm text-destructive">{subError}</p>}
    </div>
  );
}
