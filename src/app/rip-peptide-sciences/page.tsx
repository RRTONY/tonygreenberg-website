import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { BioChainCTA } from "@/components/marketing/biochain-cta";
import { VendorScorecard, type Vendor } from "@/components/marketing/vendor-scorecard";

// Ported from legacy client/src/pages/RipPeptideSciences.tsx. Real content,
// unchanged — the timeline, the 3 reasons, the vendor scorecard (9 real
// vendors, scored), the COA explainer, and Tony's quote.
export const metadata: Metadata = {
  title: "What Happened to Peptide Sciences? (They Pulled a Houdini)",
  description:
    "On March 6, 2026, Peptide Sciences — $7.4M/month, decade-long run — posted three sentences and vanished. No refunds. No forwarding address. No explanation. Here's everything we know.",
  alternates: { canonical: "/rip-peptide-sciences" },
};

const TIMELINE = [
  {
    date: "2009",
    headline: "Domain registered.",
    detail:
      "PeptideSciences.com comes online. A new era of grey-market peptide sales begins. Nobody claps. Nobody is watching yet.",
  },
  {
    date: "2024 Q4",
    headline: "FDA begins warning letter campaign.",
    detail:
      "SwissChems, Xcel Peptides, Prime Peptides among the named. Over 50 letters sent in 2025 alone. The agency is not playing.",
  },
  {
    date: "Early 2025",
    headline: "Eli Lilly and Novo Nordisk lawyer up.",
    detail:
      'The pharmaceutical giants whose patented GLP-1 drugs were being sold as "research chemicals" at a discount decide this is fine to no longer tolerate. Lawsuits filed against grey-market suppliers.',
  },
  {
    date: "June 2025",
    headline: "Federal agents raid a major competing warehouse.",
    detail: "Not Peptide Sciences. Close enough to notice.",
  },
  {
    date: "Dec 2025",
    headline: "Peptide Sciences clocks $7.4M in monthly online sales.",
    detail: "(Source: Grips Intelligence analytics.) Business is booming. Something is coming.",
  },
  {
    date: "March 6, 2026",
    headline: "~2:00 PM Eastern. Three sentences. Gone.",
    detail:
      '"We have voluntarily decided to shut down operations and discontinue the sale of all research products. Thank you for your support over the years." No refund process. No pending order guidance. No forwarding address. 1 million+ monthly visitors: redirected nowhere. Researchers mid-protocol: on their own.',
  },
  {
    date: "March 2026+",
    headline: "Fake Peptide Sciences sites appear.",
    detail:
      "Using their branding. Targeting displaced customers. Any site claiming to be Peptide Sciences after March 6, 2026 is a scam. There are no exceptions to this rule.",
  },
];

const REASONS = [
  {
    title: "Regulatory Pressure",
    likelihood: "High",
    color: "bg-red-600",
    description:
      'The FDA enforcement wave was accelerating. The "research only" label that protected vendors for a decade was being called a loophole, not a legal distinction. $7.4M/month makes you a visible target.',
  },
  {
    title: "Pharma Litigation",
    likelihood: "High",
    color: "bg-red-600",
    description:
      "Selling research-grade semaglutide and tirzepatide — molecules patented and controlled by Eli Lilly and Novo Nordisk — puts you directly in the crosshairs of companies with unlimited legal budgets.",
  },
  {
    title: "Payment Processing Collapse",
    likelihood: "Medium",
    color: "bg-amber-500",
    description:
      "Peptide vendors are classified high-risk by payment processors. When a merchant account is terminated, a $7M/month business can lose its ability to process cards overnight. No payments = no business, regardless of everything else.",
  },
];

const VENDORS: Vendor[] = [
  {
    vendor: "Ascension Peptides",
    score: 88,
    coa: "Independent",
    purity: "99%+",
    usShip: "Yes",
    notes: "Consistent community track record",
  },
  {
    vendor: "Core Peptides",
    score: 86,
    coa: "ISO/IEC 17025",
    purity: "99%+",
    usShip: "Yes",
    notes: "HPLC + MS every batch",
  },
  {
    vendor: "Peptide Pros",
    score: 84,
    coa: "Independent",
    purity: "99%+",
    usShip: "Yes",
    notes: "Selective catalog, premium tier",
  },
  {
    vendor: "EZ Peptides",
    score: 79,
    coa: "Independent",
    purity: "98%+",
    usShip: "Yes",
    notes: "Widest catalog post-shutdown",
  },
  {
    vendor: "Iron Mountain Labz",
    score: 74,
    coa: "Third-party",
    purity: "98%+",
    usShip: "Yes",
    notes: "409 listings, mid-market",
  },
  {
    vendor: "QSC Sigma",
    score: 72,
    coa: "Janoshik",
    purity: "99%+",
    usShip: "Yes",
    notes: "International origin, public verify",
  },
  {
    vendor: "Penguin Peptides",
    score: 71,
    coa: "Independent",
    purity: "98%+",
    usShip: "Yes",
    notes: "Best COA page accessibility",
  },
  {
    vendor: "SwissChems",
    score: 48,
    coa: "Mixed",
    purity: "Variable",
    usShip: "Yes",
    notes: "FDA warning letter on file — flagged",
  },
  {
    vendor: "Paradigm Peptides",
    score: 22,
    coa: "Unverified",
    purity: "Unknown",
    usShip: "Unknown",
    notes: "Federal prosecution case — avoid",
  },
];

export default function RipPeptideSciencesPage() {
  return (
    <div>
      <section className="bg-[#0A0A10] px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 font-mono text-xs tracking-[0.25em] text-[#C84B2A] uppercase">
            March 6, 2026 · 2:00 PM Eastern · Gone
          </p>
          <h1 className="mb-5 font-heading text-4xl leading-tight font-bold sm:text-5xl">
            They Made $7.4 Million a Month.
            <br />
            <span className="text-[#C84B2A]">Then Posted Three Sentences and Disappeared.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
            The complete autopsy of the Peptide Sciences shutdown — what happened, why it happened,
            what it means for your protocol, and where to go now. No panic. Just facts.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
            The Timeline
          </h2>
          <div className="ml-4 border-l-2 border-[#C84B2A]/30 md:ml-8">
            {TIMELINE.map((entry) => (
              <div key={entry.date} className="relative mb-8 ml-8">
                <div className="absolute -left-[2.6rem] top-1 size-4 rounded-full border-4 border-background bg-[#C84B2A]" />
                <p className="mb-1 font-mono text-xs tracking-wide text-[#C84B2A] uppercase">
                  {entry.date}
                </p>
                <h3 className="mb-1 text-lg font-bold text-foreground">{entry.headline}</h3>
                <p className="leading-relaxed text-muted-foreground">{entry.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Three Reasons. One of Them Is Probably the Real One.
          </h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">
            Why It Actually Happened
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {REASONS.map((r) => (
              <div key={r.title} className="rounded-lg border border-border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">{r.title}</h3>
                  <span className={`rounded px-2 py-0.5 text-xs font-bold text-white ${r.color}`}>
                    {r.likelihood}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{r.description}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground italic">
            &quot;Did the FDA actually shut them down? No official action has been confirmed. The
            voluntary framing suggests a calculated exit — leaving on their own terms before someone
            else decided.&quot;
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Their COA Problem (And What a Real COA Looks Like)
          </h2>
          <p className="mb-5 leading-relaxed text-foreground/80">
            Peptide Sciences provided Certificates of Analysis. But theirs were internal — meaning
            the company tested its own products and handed you a document. There was no independent
            way to verify those results. It&apos;s like a restaurant grading its own health
            inspection.
          </p>
          <p className="mb-5 leading-relaxed text-foreground/80">
            A real COA comes from an accredited third-party lab — ISO/IEC 17025 certified — with a
            batch ID you can query directly on the lab&apos;s own public database, without the
            vendor in the loop at all.
          </p>
          <p className="mb-8 leading-relaxed text-foreground/80">
            The gold standard right now: <strong>Janoshik Analytical</strong> (janoshik.com). Every
            batch gets a unique reference ID. You go to their site, type in the ID, see the original
            unmodified lab results. No PDF that could be photoshopped. No vendor-controlled data.
          </p>
          <Link
            href="/verify-your-coa"
            className="inline-block rounded-md bg-foreground px-6 py-3 font-mono text-sm tracking-wide text-background uppercase"
          >
            Learn How to Verify Any COA Yourself <ForwardIcon aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="bg-card px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            7 Vendors. Scored Without Bias. Or Paid Placements.
          </h2>
          <p className="mb-1 text-muted-foreground">(Yes, this is unusual. We know.)</p>
          <p className="mb-8 font-mono text-xs tracking-wide text-muted-foreground/70 uppercase">
            Research vendor market, May 2026
          </p>

          <VendorScorecard vendors={VENDORS} />

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Scores based on publicly available data: COA independence, purity documentation,
            community track records on r/Peptides and Eroids, FDA warning letter registry, and court
            records. No vendor paid for inclusion or ranking.
          </p>
        </div>
      </section>

      <section className="bg-[#0A0A10] px-6 py-16 text-white">
        <div className="mx-auto max-w-2xl">
          <blockquote className="border-l-4 border-[#C84B2A] pl-6">
            <p className="mb-4 text-lg leading-relaxed italic">
              &quot;The PeptideSciences collapse is a textbook example of what happens when
              infrastructure is built on opacity instead of trust. A decade, $7M/month, and it ended
              with three sentences. Find My Peptides exists because the information layer should
              never be controlled by the same people selling you something.&quot;
            </p>
            <cite className="text-zinc-400 not-italic">— Tony Greenberg</cite>
          </blockquote>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6">
        <BioChainCTA
          variant="supplier"
          context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier intake at RampRate."
        />
      </div>

      <section className="bg-secondary px-6 py-12">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
          <Link
            href="/whats-legal"
            className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium"
          >
            What&apos;s Legal <ForwardIcon aria-hidden="true" />
          </Link>
          <Link
            href="/verify-your-coa"
            className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium"
          >
            Verify Your COA <ForwardIcon aria-hidden="true" />
          </Link>
          <Link
            href="/price-tracker"
            className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium"
          >
            Price Tracker <ForwardIcon aria-hidden="true" />
          </Link>
          <Link
            href="/test-your-peptides"
            className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium"
          >
            Test Your Peptides <ForwardIcon aria-hidden="true" />
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
