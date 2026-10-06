"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { DAILY_PROVOCATIONS } from "@/lib/content/daily-provocations";

// /the-letter's "Daily Provocation" strip, matching live: today's line, a
// "Share this thought" button (the phone/OS share sheet, or a post on X where
// that isn't available) and a "Search past provocations" box over the
// archive in src/lib/content/daily-provocations.ts. Live's "Read the full
// essay" link isn't carried over: it points at /blog/manifesto, which isn't
// a real post.
const MAX_RESULTS = 6;

export function DailyProvocation() {
  const today = DAILY_PROVOCATIONS[0];
  const [query, setQuery] = useState("");
  const q = query.trim();
  const results =
    q.length >= 2
      ? DAILY_PROVOCATIONS.filter((p) => p.text.toLowerCase().includes(q.toLowerCase())).slice(
          0,
          MAX_RESULTS,
        )
      : [];

  if (!today) return null;

  async function share() {
    const text = `Daily Provocation: “${today.text}”`;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Tony Greenberg — Daily Provocation", text, url });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div
      id="homepage-provocation"
      className="border-y border-brand-gold-light/15 bg-brand-gold-light/5 px-6 py-5 text-center sm:px-10"
    >
      <p className="mx-auto max-w-[37.5rem] font-heading text-[1.1rem]/[1.6] text-foreground/80 italic">
        &quot;{today.text}&quot;
      </p>
      <div className="mt-3.5 flex justify-center">
        <button
          type="button"
          onClick={share}
          aria-label="Share today’s provocation"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-brand-gold/40 bg-background px-4 py-2 font-mono text-[0.72rem] tracking-[0.08em] text-[#4A1D5E] uppercase transition-colors hover:border-brand-gold dark:text-brand-gold-light"
        >
          <Share2 aria-hidden="true" className="size-3.5" />
          Share this thought
        </button>
      </div>
      <div role="search" aria-label="Search Daily Provocations" className="mx-auto mt-4 max-w-lg">
        <label htmlFor="provocation-search" className="sr-only">
          Search Daily Provocations
        </label>
        <input
          id="provocation-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search past provocations"
          autoComplete="off"
          className="h-11 w-full rounded-md border border-brand-gold/30 bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 focus:outline-none"
        />
        {q.length >= 2 && (
          <div aria-live="polite" className="mt-2 text-left">
            {results.length ? (
              <ul className="divide-y divide-brand-gold/10 rounded-md border border-brand-gold/20 bg-background">
                {results.map((p) => (
                  <li key={`${p.date}-${p.text}`} className="px-3 py-2.5">
                    <span className="block font-heading text-[0.95rem]/snug text-foreground/85 italic">
                      “{p.text}”
                    </span>
                    <small className="font-mono text-[0.68rem] tracking-[0.06em] text-muted-foreground">
                      {p.date}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-1 text-sm text-muted-foreground">No provocations match “{q}”.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
