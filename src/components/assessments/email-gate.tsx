"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

// Ported from legacy client/src/components/EmailGate.tsx — the
// email-capture screen shown between finishing an assessment and seeing
// its results. Legacy posted to `trpc.subscribe.add`; that's now the real
// `/api/subscribe` Route Handler (Kit/ConvertKit, built earlier this
// migration) — `source` uses the exact `find-your-<slug>` keys already
// defined in `lib/content/kit-source-tags.ts`'s `KIT_TAG_MAP` for each
// assessment, not legacy's own `assessment-gate:<slug>` prefix (which
// doesn't match any tag in that map). Same "don't block the unlock on API
// failure" behavior as legacy — the subscribe call is best-effort, the
// gate opens either way.
export function EmailGate({ assessmentSlug, onUnlock }: { assessmentSlug: string; onUnlock: () => void }) {
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
        <div className="mb-6 text-4xl">🔮</div>
        <h2 className="mb-4 font-heading text-[clamp(1.6rem,3vw,2rem)] leading-tight font-normal text-brand-gold-light">
          Enter your email to receive your full personalized report
        </h2>
        <p className="mb-10 text-[1.05rem] leading-loose text-[#E8E4DC]/60">
          Your results are ready. We&apos;ll send your full analysis to your inbox along with actionable next steps.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="min-h-12 flex-1 border border-brand-gold-light/30 bg-white/5 px-5 py-3.5 font-mono text-[0.88rem] text-[#E8E4DC] outline-none"
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
        <p className="mt-6 font-mono text-[0.68rem] tracking-[0.05em] text-[#E8E4DC]/30">
          We respect your privacy. Your results and email are never shared or sold.
        </p>
      </div>
    </div>
  );
}
