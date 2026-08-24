import type { Metadata } from "next";
import Link from "next/link";

// Ported from legacy client/src/pages/UnderNDA.tsx ("The Folio" — The
// Corridor / payments). Real content kept as-is.

export const metadata: Metadata = {
  title: "Under NDA",
  description:
    "The deals, partnerships, and projects Tony Greenberg can't talk about yet. What's behind the curtain and why it matters.",
  alternates: { canonical: "/under-nda" },
};

const WHAT_WERE_BUILDING = [
  "Traditional card processing optimization across multiple verticals",
  "Stablecoin settlement infrastructure for enterprise-scale transactions",
  "Cross-border remittance corridors with regulatory compliance built in",
  "Gaming payment solutions with fraud prevention and chargeback management",
  "Healthcare payment processing with HIPAA-compliant data handling",
];

export default function UnderNdaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
        Door 04 — Deep Dive
      </p>
      <h1 className="mb-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">
        The Corridor
      </h1>
      <p className="mb-4 text-foreground/80">
        Four payment processing companies through what we call &quot;the corridor&quot; — a
        payments infrastructure play at the intersection of traditional card processing,
        stablecoin settlement, and cross-border remittance.
      </p>
      <p className="mb-8 text-foreground/80">
        The corridor handles transactions across gaming, healthcare, and enterprise commerce.
        Details under NDA. The opportunity is measured in billions. We hold the relationships on
        both sides of the bridge between traditional rails and blockchain settlement.
      </p>

      <blockquote className="mb-10 text-center font-heading text-xl italic text-foreground">
        The future of payments isn&apos;t crypto OR traditional rails. It&apos;s the bridge
        between them. We&apos;re not betting on one side — we&apos;re building the infrastructure
        that makes both sides work together.
      </blockquote>

      <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
        What We&apos;re Building
      </h2>
      <ul className="mb-8 divide-y divide-border">
        {WHAT_WERE_BUILDING.map((item) => (
          <li key={item} className="flex gap-3 py-3 text-foreground/80">
            <span className="font-bold text-brand-gold-light">›</span>
            {item}
          </li>
        ))}
      </ul>

      <blockquote className="mb-10 border-l-2 border-brand-gold pl-5 text-foreground/80 italic">
        &ldquo;The payments space is where the real infrastructure of the future economy is being
        built. Not in flashy consumer apps — in the plumbing. We&apos;re plumbers. Very
        well-connected plumbers.&rdquo;
        <footer className="mt-2 font-mono text-xs text-muted-foreground not-italic">— TG</footer>
      </blockquote>

      <div className="mb-10 rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-6">
        <p className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
          The Lesson
        </p>
        <p className="leading-relaxed text-foreground/80">
          The most valuable infrastructure is invisible. The companies that will define the next
          decade of finance aren&apos;t building consumer apps — they&apos;re building the
          plumbing that every consumer app will eventually depend on.
        </p>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/the-body" className="font-mono text-sm tracking-wide text-brand-gold">
          Continue to The Body →
        </Link>
      </div>
    </div>
  );
}
