import type { Metadata } from "next";
import Link from "next/link";
import { ForwardIcon } from "@/components/ui/inline-icons";
import { NewsletterSignupForm } from "@/components/marketing/newsletter-signup-form";

export const metadata: Metadata = {
  title: "Subscribe — The Throughline",
  description:
    "Receive Tony Greenberg's essays directly. No feed, no algorithm, and no platform between the work and your inbox.",
  alternates: { canonical: "/subscribe" },
};

export default function SubscribePage() {
  return (
    <div>
      <section className="border-b border-brand-gold/15 bg-linear-to-b from-[#0A0A10] via-[#111118] to-[#1A1A24] px-6 py-18 text-center sm:px-10 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="mb-5 font-mono text-xs tracking-[0.25em] text-brand-gold-light uppercase">
            The Throughline
          </p>
          <h1 className="font-heading text-4xl leading-tight text-[#F5F0E0] sm:text-6xl">
            121 essays. 25 years.
            <br />
            <span className="text-brand-gold-light">Zero algorithm.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#F5F0E0]/70 sm:text-lg">
            Every essay is free. Subscribe to receive new work directly, with no social feed or
            platform in between.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-6 py-14 sm:px-10 sm:py-18">
        <p className="mb-3 text-center font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
          Free Dispatch
        </p>
        <h2 className="text-center font-heading text-2xl text-foreground sm:text-3xl">
          New essays, sent directly.
        </h2>
        <p className="mx-auto mt-4 mb-8 max-w-lg text-center leading-relaxed text-muted-foreground">
          The work arrives when it is ready. No content calendar, no daily noise, and no artificial
          urgency.
        </p>
        <NewsletterSignupForm />
      </section>

      <section className="border-y border-border bg-muted/35 px-6 py-12 text-center sm:px-10">
        <div className="mx-auto max-w-2xl">
          <p className="font-heading text-xl leading-relaxed text-foreground sm:text-2xl">
            Only time buys trust. The gold is in the cracks.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Paid memberships and essay compilations from the legacy site are intentionally not
            offered in this release while a secure checkout is reviewed separately.
          </p>
          <Link
            href="/articles"
            className="mt-7 inline-flex items-center gap-1 border-b border-brand-gold/40 pb-1 font-mono text-xs tracking-wide text-brand-gold uppercase hover:text-brand-gold-light"
          >
            Read the essays <ForwardIcon aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
