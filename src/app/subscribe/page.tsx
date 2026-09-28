import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsletterSignupForm } from "@/components/marketing/newsletter-signup-form";

// Ported from legacy client/src/pages/Subscribe.tsx ("The Throughline").
// Real copy, unchanged, except: the free signup is live now (legacy showed
// "SUBSCRIBE FREE → COMING SOON / Beehiiv integration launching soon"; this
// app has a working Kit endpoint at /api/subscribe), and the $99/yr
// membership and $27 compilation are shown as informational only, with no
// checkout, since Stripe billing is a separate deferred phase
// (NEXTJS-MIGRATION-TODO.md). Legacy's "91 essays" count is stale — the
// archive has 121 — so that one number is updated.
export const metadata: Metadata = {
  title: "Subscribe — The Throughline",
  description:
    "121 essays. 15 years. Zero algorithm. Subscribe to receive Tony Greenberg's essays directly — no social feed required, no platform between us.",
  alternates: { canonical: "/subscribe" },
};

const MEMBERSHIP_BENEFITS = [
  "Early access to all new essays",
  "Quarterly Q&A with Tony",
  "ImpactSoul deal flow briefings",
  "Access to the compiled essay collections before public release",
  "“Tip Me Off” community — submit injustices worth exposing",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-center font-mono text-xs tracking-[0.25em] text-brand-gold uppercase">{children}</p>;
}

function NotYetAvailable() {
  return (
    <p className="mt-5 text-center font-mono text-xs tracking-wide text-muted-foreground uppercase">
      Not available yet — coming with the new site&apos;s checkout
    </p>
  );
}

export default function SubscribePage() {
  return (
    <div>
      <section className="bg-linear-to-b from-[#0A0A10] to-[#1A1A24] px-6 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-170">
          <p className="mb-6 font-mono text-xs tracking-[0.3em] text-brand-gold-light uppercase">The Throughline</p>
          <h1 className="font-heading text-4xl leading-tight font-bold text-[#F5F0E0] sm:text-6xl">
            121 essays. 15 years.
            <br />
            <span className="text-[#D4B96A]">Zero algorithm.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#F5F0E0]/70 sm:text-lg">
            Every essay is free. Always has been. Always will be. Subscribe to receive new essays directly — no
            social feed required, no platform between us.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-130 px-6 py-16 text-center">
        <Eyebrow>Free</Eyebrow>
        <p className="mb-6 text-base leading-relaxed text-foreground/85 sm:text-lg">
          New essays delivered directly to your inbox. No algorithm. No platform. Just the work.
        </p>
        <NewsletterSignupForm />
      </section>

      <div className="mx-auto h-px max-w-2xl bg-linear-to-r from-transparent via-brand-gold/30 to-transparent" />

      <section className="mx-auto max-w-170 px-6 py-16">
        <Eyebrow>$99 / Year</Eyebrow>
        <h2 className="mb-4 text-center font-heading text-3xl font-bold text-foreground">Paid Membership</h2>
        <p className="mb-4 text-base leading-relaxed text-foreground/85">For readers who want more:</p>
        <ul className="border-l-2 border-[#D4B96A]/30 pl-4">
          {MEMBERSHIP_BENEFITS.map((b) => (
            <li key={b} className="mb-1.5 text-[0.95rem] leading-relaxed text-foreground/80">
              {b}
            </li>
          ))}
        </ul>
        <NotYetAvailable />
      </section>

      <div className="mx-auto h-px max-w-2xl bg-linear-to-r from-transparent via-brand-gold/30 to-transparent" />

      <section className="mx-auto max-w-170 px-6 py-16">
        <Eyebrow>$27</Eyebrow>
        <h2 className="mb-4 text-center font-heading text-3xl font-bold text-foreground">The Essay Compilation</h2>
        <p className="text-base leading-relaxed text-foreground/85">
          The top 25 essays compiled, sequenced, and annotated. The extractive economy explained. The regenerative
          alternative mapped.
        </p>
        <NotYetAvailable />
        <div className="mt-8 text-center">
          <Link
            href="/essays"
            className="inline-flex items-center gap-1.5 border-b border-brand-gold/40 pb-1 font-mono text-xs tracking-wide text-brand-gold uppercase hover:text-brand-gold-light"
          >
            Read the essays now <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </section>

      <section className="bg-[#0A0A10] px-6 py-14 text-center">
        <p className="font-heading text-2xl text-[#D4B96A] italic">&ldquo;Only time buys trust.&rdquo;</p>
        <p className="mt-3 font-mono text-xs tracking-wide text-[#F5F0E0]/40">tonygreenberg.com · impactsoul.is</p>
      </section>
    </div>
  );
}
