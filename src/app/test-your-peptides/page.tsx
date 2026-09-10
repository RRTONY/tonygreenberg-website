import { BackIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { PeptideShutdownBanner } from "@/components/marketing/peptide-shutdown-banner";
import { BioChainCTA } from "@/components/marketing/biochain-cta";

// Ported from legacy client/src/pages/TestYourPeptides.tsx. Real content,
// unchanged — 4 real independent-verification options with real sites,
// costs, and Tony's notes.
export const metadata: Metadata = {
  title: "How to Independently Test Peptides in 2026",
  description:
    "Don't Trust. Verify. Four ways to know what's actually in your vials — without taking anyone's word for it.",
  alternates: { canonical: "/test-your-peptides" },
};

type TestOption = {
  number: number;
  title: string;
  subtitle: string;
  site?: string;
  siteUrl?: string;
  whatItDoes: string;
  cost: string;
  turnaround?: string;
  bestFor: string;
  tonyNote: string;
};

const OPTIONS: TestOption[] = [
  {
    number: 1,
    title: "Janoshik Analytical",
    subtitle: "The Gold Standard",
    site: "janoshik.com",
    siteUrl: "https://janoshik.com",
    whatItDoes:
      "Independent third-party HPLC + mass spectrometry. Batch IDs publicly queryable on their own database.",
    cost: "~$30–$60 per sample",
    turnaround: "5–10 business days",
    bestFor: "Verifying a new vendor before committing to a protocol.",
    tonyNote:
      "If your vendor doesn't use Janoshik, ask why. If they say 'we use our own lab,' that's your answer.",
  },
  {
    number: 2,
    title: "Community Batch Testing",
    subtitle: "Crowd-Sourced",
    site: "r/Peptides",
    siteUrl: "https://reddit.com/r/peptides",
    whatItDoes:
      "Community members submit independent tests of specific vendor batches. Results posted publicly.",
    cost: "Free to read. ~$50–$100 to contribute a test.",
    bestFor: "Cross-referencing before a new supplier relationship.",
    tonyNote:
      "Noisy but useful. Weight posts with more than one corroborating test. One negative result from one anonymous user is a data point, not a verdict.",
  },
  {
    number: 3,
    title: "Eroids Vendor Ratings",
    subtitle: "Community Intelligence",
    site: "eroids.com",
    siteUrl: "https://eroids.com",
    whatItDoes:
      "Long-form vendor reviews, lab test postings, community trust scores built over years.",
    cost: "Free",
    bestFor:
      "Longitudinal vendor reputation — who has been consistent for 12+ months, not just this month.",
    tonyNote:
      "The market post-March 2026 is flooded with new vendors. Eroids history predating the Peptide Sciences shutdown is the most trustworthy signal you have.",
  },
  {
    number: 4,
    title: "Telehealth / Compounding Pharmacy Route",
    subtitle: "The Premium Path",
    whatItDoes:
      "Physician-prescribed peptides from licensed 503A or 503B compounding pharmacies carry USP standards and pharmacy board oversight.",
    cost: "3–10x the grey market price",
    bestFor: "Anyone who wants zero regulatory risk and can afford the premium.",
    tonyNote:
      "It's the right call for some people. It's also $400–$900/month for semaglutide vs. $120–$250 elsewhere. That math is part of the decision.",
  },
];

export default function TestYourPeptidesPage() {
  return (
    <div>
      <PeptideShutdownBanner />

      <section className="bg-[#0A0A10] px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 font-mono text-xs tracking-[0.25em] text-[#C84B2A] uppercase">
            Verification Resources
          </p>
          <h1 className="mb-5 font-heading text-4xl leading-tight font-bold sm:text-5xl">
            Don&apos;t Trust. <span className="text-[#C84B2A]">Verify.</span>
          </h1>
          <p className="mb-4 text-xl text-zinc-300">
            Four ways to know what&apos;s actually in your vials — without taking anyone&apos;s word
            for it.
          </p>
          <p className="max-w-2xl leading-relaxed text-zinc-400">
            The PeptideSciences collapse was a reminder that even large, trusted vendors can
            disappear overnight, and their quality documentation goes with them. Independent
            verification isn&apos;t paranoia. It&apos;s basic due diligence. Here are the four best
            options available right now, from cheapest to most rigorous.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl space-y-8">
          {OPTIONS.map((opt) => (
            <div key={opt.number} className="rounded-lg border border-border bg-card p-6 md:p-8">
              <div className="mb-4 flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-lg font-bold text-background">
                  {opt.number}
                </span>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">{opt.title}</h2>
                  <p className="text-sm font-medium text-[#C84B2A]">{opt.subtitle}</p>
                </div>
              </div>

              {opt.site && (
                <p className="mb-3 text-sm">
                  <span className="text-muted-foreground">Site:</span>{" "}
                  <a
                    href={opt.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C84B2A] underline"
                  >
                    {opt.site}
                  </a>
                </p>
              )}

              <div className="mb-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    What It Does
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">{opt.whatItDoes}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Cost
                    </p>
                    <p className="text-sm text-foreground/80">{opt.cost}</p>
                  </div>
                  {opt.turnaround && (
                    <div>
                      <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                        Turnaround
                      </p>
                      <p className="text-sm text-foreground/80">{opt.turnaround}</p>
                    </div>
                  )}
                  <div>
                    <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Best For
                    </p>
                    <p className="text-sm text-foreground/80">{opt.bestFor}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-r border-l-4 border-[#C84B2A] bg-secondary p-4">
                <p className="text-sm text-foreground/80 italic">&quot;{opt.tonyNote}&quot;</p>
                <p className="mt-1 text-xs text-muted-foreground">— TG</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-6">
        <BioChainCTA
          variant="both"
          context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate."
        />
      </div>

      <section className="bg-secondary px-6 py-12">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
          <Link
            href="/rip-peptide-sciences"
            className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium"
          >
            <BackIcon aria-hidden="true" /> RIP Peptide Sciences
          </Link>
          <Link
            href="/whats-legal"
            className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium"
          >
            What&apos;s Legal
          </Link>
          <Link
            href="/verify-your-coa"
            className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium"
          >
            Verify Your COA
          </Link>
          <Link
            href="/price-tracker"
            className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium"
          >
            Price Tracker
          </Link>
          <Link
            href="/peptide-watch"
            className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium"
          >
            <BackIcon aria-hidden="true" /> Back to Peptide Watch
          </Link>
        </div>
      </section>
    </div>
  );
}
