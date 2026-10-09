import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RelatedPages } from "@/components/marketing/related-pages";

// Ported from legacy client/src/pages/Ecosystem.tsx. Real content kept as-is.

export const metadata: Metadata = {
  title: "The Ecosystem",
  description: "A curated network for people building what replaces what's broken.",
  alternates: { canonical: "/ecosystem" },
};

const WHO_ITS_FOR = [
  "Founders building regenerative businesses",
  "Investors allocating consciousness-aligned capital",
  "Operators seeking strategic partnerships in blockchain, psychedelics, or impact",
  "Advisors with deep domain expertise in emerging systems",
  "Anyone committed to building what replaces extractive systems",
];

const WHAT_MEMBERS_RECEIVE = [
  "Access to curated deal flow and co-investment opportunities",
  "Direct connection to Tony's network of 35+ portfolio companies",
  "Strategic introductions for partnerships and fundraising",
  "Quarterly gatherings for high-trust collaboration",
  "Early access to research, frameworks, and diagnostic tools",
  "Monthly office hours with Tony for decision support",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item} className="flex gap-3">
          <span className="mt-0.5 shrink-0 text-brand-gold-light">•</span>
          <p className="text-foreground/80">{item}</p>
        </div>
      ))}
    </div>
  );
}

export default function EcosystemPage() {
  return (
    <div>
      <section className="border-b border-border px-6 pt-16 pb-9 text-center sm:px-12">
        <p className="mb-3 font-mono text-[0.72rem] tracking-[0.2em] text-brand-gold uppercase">
          The Ecosystem
        </p>
        <h1 className="mb-3 font-heading text-[2.25rem]/[1.15] font-bold text-foreground sm:text-[3.2rem]/[1.15]">
          The Ecosystem
        </h1>
        <p className="mx-auto max-w-[36.25rem] text-[1.15rem]/[1.65] text-muted-foreground">
          A curated network for people building what replaces what&apos;s broken.
        </p>
      </section>

      <div className="mx-auto max-w-[39rem] px-6 py-8 text-[1.05rem]/[1.8] sm:px-10">
        <p className="mb-2.5 font-mono text-[0.72rem] tracking-[0.2em] text-brand-gold uppercase">
          What It Is
        </p>
        <h2 className="mb-5 font-heading text-[1.8rem]/[1.3] font-normal text-foreground">What It Is</h2>
        <p className="mb-4 leading-relaxed text-foreground/80">
          The Ecosystem is a curated network of builders, investors, and thought leaders working
          at the intersection of consciousness-aligned capital, regenerative economics, and
          systems change.
        </p>
        <p className="leading-relaxed text-foreground/80">
          This isn&apos;t a community — it&apos;s a collaboration engine. Members share deal flow,
          co-create ventures, and leverage collective expertise to accelerate projects that
          matter.
        </p>
      </div>

      <div className="mx-auto max-w-[39rem] px-6 py-8 text-[1.05rem]/[1.8] sm:px-10">
        <p className="mb-2.5 font-mono text-[0.72rem] tracking-[0.2em] text-brand-gold uppercase">
          Who It&apos;s For
        </p>
        <h2 className="mb-5 font-heading text-[1.8rem]/[1.3] font-normal text-foreground">
          Who It&apos;s For
        </h2>
        <BulletList items={WHO_ITS_FOR} />
      </div>

      <div className="mx-auto max-w-[39rem] px-6 py-8 text-[1.05rem]/[1.8] sm:px-10">
        <p className="mb-2.5 font-mono text-[0.72rem] tracking-[0.2em] text-brand-gold uppercase">
          What Members Receive
        </p>
        <h2 className="mb-5 font-heading text-[1.8rem]/[1.3] font-normal text-foreground">
          What Members Receive
        </h2>
        <BulletList items={WHAT_MEMBERS_RECEIVE} />
      </div>

      <section className="border-t border-border px-6 py-11 text-center sm:px-12">
        <a
          href="mailto:tony@tonygreenberg.com?subject=Ecosystem%20—%20Request%20an%20Invitation"
          className="inline-flex min-h-11 items-center rounded-md bg-linear-to-br from-brand-gold to-[#8B6914] px-10 py-3.5 font-mono text-sm font-bold tracking-[0.08em] text-white uppercase"
        >
          Request an Invitation
        </a>
        <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground">
          Membership is by invitation only. We review all requests within 5 business days.
        </p>
      </section>

      <div className="pt-2 pb-10 text-center">
        <Link
          href="/find-my"
          className="inline-flex min-h-11 items-center gap-1.5 border border-essay-red/40 px-6 py-2.5 font-mono text-[0.88rem] text-essay-red transition-colors hover:border-essay-red"
        >
          Explore the Assessments
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>

      <RelatedPages path="/ecosystem" tone="light" />
    </div>
  );
}
