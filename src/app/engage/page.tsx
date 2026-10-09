import type { Metadata } from "next";
import { EngageAudit } from "@/components/marketing/engage-audit";
import { RelatedPages } from "@/components/marketing/related-pages";

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
      <section className="bg-linear-135 from-[#0A0A10] via-[#111118] to-[#1A1A24] px-6 pt-16 pb-12 text-center sm:px-10">
        <p className="mb-[1.2rem] font-mono text-[0.72rem]/[1.85] tracking-[0.25em] text-brand-gold-light uppercase">
          The Gate
        </p>
        <h1 className="mx-auto mb-4 max-w-[43.75rem] font-heading text-[2rem]/[1.2] font-bold text-[#F5F0E0] sm:text-[3.2rem]/[1.2]">
          Not everyone gets a meeting.
        </h1>
        <p className="mx-auto max-w-[35rem] text-[1.1rem]/[1.7] text-[#F5F0E0]/65">
          Seven out of ten inquiries don&apos;t qualify. This isn&apos;t gatekeeping — it&apos;s
          respect for your time and mine. If your initiative is real, your outcomes are clear,
          and you&apos;ve already started — we should talk.
        </p>
      </section>

      <EngageAudit />

      <RelatedPages path="/engage" tone="light" />
    </div>
  );
}
