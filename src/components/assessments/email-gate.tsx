"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

// Ported from legacy client/src/components/EmailGate.tsx — the
// email-capture screen shown between finishing an assessment and seeing
// its results. Legacy posted to `trpc.subscribe.add`; that's now the real
// `/api/subscribe` Route Handler (Kit/ConvertKit, built earlier this
// migration) — `source` uses the exact `find-your-<slug>` keys already
// defined in `lib/content/kit-source-tags.ts`'s `KIT_TAG_MAP` for each
// assessment, not legacy's own `assessment-gate:<slug>` prefix (which
// doesn't match any tag in that map). Same "don't block the unlock on API
// failure" behavior as legacy — the subscribe call is best-effort, the
// gate opens either way. **Real contrast bug found and fixed** (caught
// while porting `/find-your-therapy`, but affects every assessment that
// renders this shared component): legacy's cream text colors
// (`rgba(232,228,220,*)`, meant for a dark page) were carried over
// unchanged even though this component always renders directly on
// `ThemedBackground`'s light pastel themes — `#E8E4DC` at 60% opacity on
// a background like sake's `#F0E8DC` is two nearly-identical light colors,
// functionally invisible text. Replaced with the same dark-ink palette
// `AssessmentIntro` already uses on the same background (`#6B5B4F`
// description, `#2C1810` input text, `#8B7B6B` muted footnote).
export function EmailGate({
  assessmentSlug,
  onUnlock,
}: {
  assessmentSlug: string;
  onUnlock: () => void;
}) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setPending(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: `find-your-${assessmentSlug}` }),
      });
    } catch {
      // Don't block unlock if the API fails.
    }
    onUnlock();
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-8 py-[clamp(6rem,10vw,8rem)]">
      <div className="max-w-120 text-center">
        <Sparkles aria-hidden="true" className="mx-auto mb-6 size-10 text-brand-gold-light" />
        <h2 className="mb-4 font-heading text-[clamp(1.6rem,3vw,2rem)] leading-tight font-normal text-brand-gold-light">
          Enter your email to receive your full personalized report
        </h2>
        <p className="mb-10 text-[1.05rem] leading-loose text-[#6B5B4F]">
          Your results are ready. We&apos;ll send your full analysis to your inbox along with
          actionable next steps.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="min-h-12 flex-1 border border-brand-gold-light/40 bg-white/50 px-5 py-3.5 font-mono text-[0.88rem] text-[#2C1810] outline-none placeholder:text-[#8B7B6B]"
          />
          <button
            type="submit"
            disabled={pending}
            className="flex min-h-12 items-center justify-center gap-2 bg-linear-to-br from-brand-gold to-brand-gold-light px-6 py-3.5 font-mono text-[0.82rem] font-bold tracking-[0.1em] text-[#0A0A10] uppercase disabled:cursor-wait"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            {pending ? "Unlocking..." : "Get My Results"}
          </button>
        </form>
        <p className="mt-6 font-mono text-[0.68rem] tracking-[0.05em] text-[#8B7B6B]">
          We respect your privacy. Your results and email are never shared or sold.
        </p>
      </div>
    </div>
  );
}
