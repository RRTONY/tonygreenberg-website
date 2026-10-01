import type { Metadata } from "next";
import { EngageAudit } from "@/components/marketing/engage-audit";

// Ported from legacy client/src/pages/Engage.tsx ("The Gate"). See
// engage-audit.tsx for what was and wasn't carried over.
export const metadata: Metadata = {
  title: "The Gate — Engagement Audit",
  description:
    "Seven out of ten inquiries don't qualify. Before you book a meeting with Tony Greenberg, prove you're ready.",
  alternates: { canonical: "/engage" },
};

export default function EngagePage() {
  return (
    <div>
      <div className="bg-linear-to-br from-background to-secondary px-6 py-16 text-center sm:px-10 dark:from-[#0A0A10] dark:via-[#111118] dark:to-[#1a1a24]">
        <p className="mb-[1.2rem] font-mono text-xs/[1.8] tracking-[0.25em] text-brand-gold uppercase">
          The Gate
        </p>
        <h1 className="mx-auto mb-4 max-w-2xl font-heading text-[2rem]/[1.2] font-bold text-foreground sm:text-[3.2rem]/[1.2]">
          Not everyone gets a meeting.
        </h1>
        <p className="mx-auto max-w-lg text-lg text-foreground/70">
          Seven out of ten inquiries don&apos;t qualify. This isn&apos;t gatekeeping — it&apos;s
          respect for your time and mine. If your initiative is real, your outcomes are clear,
          and you&apos;ve already started — we should talk.
        </p>
      </div>

      <EngageAudit />
    </div>
  );
}
