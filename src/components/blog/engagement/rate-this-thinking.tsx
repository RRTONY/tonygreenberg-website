"use client";

import { useState } from "react";
import { Circle, CircleDot, Disc } from "lucide-react";
import { rate, type Rating } from "@/app/blog/[slug]/engagement-actions";
import { refreshPostEngagement, usePostEngagement } from "./use-post-engagement";

// Legacy ConversionMechanics.tsx RateThisThinking. Copy unchanged; the ◉ ◎ ○
// marks are lucide icons (CONTRIBUTING rule 18).
const OPTIONS: { value: Rating; label: string; icon: typeof Circle; reply: string }[] = [
  { value: "completely", label: "Completely", icon: Disc, reply: "That's the point. The best ideas don't inform — they transform." },
  { value: "partially", label: "Shifted something", icon: CircleDot, reply: "Good. A crack in the lens is how new light gets in." },
  { value: "not-yet", label: "Not yet", icon: Circle, reply: "Fair. Some seeds take longer. Come back to this one." },
];

export function RateThisThinking({ slug, topic }: { slug: string; topic: string }) {
  const data = usePostEngagement(slug);
  const [picked, setPicked] = useState<Rating | null>(null);
  const chosen = picked ?? data?.myRating ?? null;

  async function choose(value: Rating) {
    setPicked(value);
    // Silent like legacy: the reply shows whether or not the save landed.
    await rate({ slug, rating: value }).catch(() => {});
    refreshPostEngagement(slug);
  }

  return (
    <section aria-labelledby="rate-title" className="my-8 border-l-[3px] border-brand-gold bg-brand-gold/6 px-5 py-6 sm:px-6">
      <p id="rate-title" className="mb-2 font-mono text-[0.72rem] tracking-[0.15em] text-brand-gold uppercase">
        Rate this thinking
      </p>
      <p className="mb-4 font-heading text-lg text-foreground">Did this change how you see {topic}?</p>
      {chosen ? (
        <p role="status" className="font-fell text-base text-essay-sepia italic">
          {OPTIONS.find((o) => o.value === chosen)?.reply}
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => choose(value)}
              className="inline-flex min-h-11 items-center gap-1.5 border border-brand-gold/30 px-4 font-mono text-xs tracking-wide text-brand-gold transition-colors hover:bg-brand-gold/8"
            >
              <Icon aria-hidden="true" className="size-3" />
              {label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
