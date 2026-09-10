import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { PeptideShutdownBanner } from "@/components/marketing/peptide-shutdown-banner";
import { BioChainCTA } from "@/components/marketing/biochain-cta";
import { SupplyChainRankings } from "@/components/marketing/supply-chain-rankings";
import { PROVIDERS, COST_CATEGORIES } from "@/lib/content/supply-chain-providers";

// Ported from legacy client/src/pages/PeptideSupplyChain.tsx. Real content,
// unchanged — a supply-chain transparency audit of 12 real, named peptide
// providers showing where each dollar actually goes (manufacturing,
// marketing, physician oversight, R&D, compliance, shipping, profit), with
// a credibility score derived from that allocation.
//
// The legacy email gate (`EmailGate` → `trpc.subscribe.add`) required a
// backend mutation — out of scope for this migration. Dropped; the full
// analysis renders directly with no gate, matching how /peptide-library and
// /price-tracker handle the same kind of legacy lead-capture wrapper.
//
// The legacy hero background image (CloudFront-hosted) returns 403, same as
// /peptide-hall-of-shame's — dropped in favor of a CSS gradient.
export const metadata: Metadata = {
  title: "Where Does Your Peptide Dollar Go? — Supply Chain Transparency",
  description:
    "We mapped the supply chain of 12 peptide providers. See exactly where your money goes: manufacturing, marketing, physician oversight, or profit.",
  alternates: { canonical: "/peptide-supply-chain" },
};

export default function PeptideSupplyChainPage() {
  const avgMarketing = Math.round(
    PROVIDERS.reduce((s, p) => s + p.breakdown.marketing, 0) / PROVIDERS.length,
  );
  const avgManufacturing = Math.round(
    PROVIDERS.reduce((s, p) => s + p.breakdown.manufacturing, 0) / PROVIDERS.length,
  );
  const avgProfit = Math.round(
    PROVIDERS.reduce((s, p) => s + p.breakdown.profit, 0) / PROVIDERS.length,
  );
  const avgPhysician = Math.round(
    PROVIDERS.reduce((s, p) => s + p.breakdown.physician, 0) / PROVIDERS.length,
  );

  const stats = [
    { value: `${avgMarketing}¢`, label: "Avg. Marketing" },
    { value: `${avgManufacturing}¢`, label: "Avg. Manufacturing" },
    { value: `${avgPhysician}¢`, label: "Avg. Physician" },
    { value: `${avgProfit}¢`, label: "Avg. Profit" },
  ];

  return (
    <div>
      <PeptideShutdownBanner />

      <div className="border-b border-brand-gold/15 bg-[#0A0A10] px-6 py-2.5 text-center">
        <p className="font-mono text-xs tracking-wide text-brand-gold/60 uppercase">
          Mirror of the Market · Fair Comment · Public Interest · Not Medical Advice ·{" "}
          <Link href="/peptide-matrix#appeals" className="text-brand-gold underline">
            Appeals Process
          </Link>
        </p>
      </div>

      <section className="bg-linear-to-br from-[#0A0A10] to-[#1a1a2e] px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold/50 uppercase">
            Peptide Supply Chain Audit · 12 US Providers
          </p>
          <h1 className="mb-6 font-heading text-4xl leading-tight text-[#E8E4DC] sm:text-5xl">
            Where Does Your
            <br />
            <span className="text-brand-gold">Peptide Dollar Go?</span>
          </h1>
          <p className="mx-auto mb-8 max-w-lg leading-relaxed text-[#E8E4DC]/60">
            We mapped the supply chain of every major peptide provider we could find. For every
            dollar you spend, here&apos;s where it actually goes — and what that tells you about who
            to trust.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-30">
                <div className="font-heading text-3xl font-bold text-brand-gold">{stat.value}</div>
                <div className="font-mono text-xs tracking-wide text-[#E8E4DC]/40 uppercase">
                  {stat.label}
                </div>
                <div className="text-xs text-[#E8E4DC]/30">per dollar</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">How to Read This</h2>
        <p className="mb-6 leading-relaxed text-foreground/80">
          Every dollar you spend on peptides gets divided among seven categories. The distribution
          tells you what the company actually values. High manufacturing + high physician oversight
          = they&apos;re investing in the product and your safety. High marketing + high profit =
          you&apos;re funding their Instagram ads and shareholder returns.
        </p>

        <div className="mb-12 grid gap-3 sm:grid-cols-2">
          {COST_CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="flex items-start gap-2.5 rounded-md border border-brand-gold/10 bg-card p-3"
            >
              <span
                className="mt-0.5 size-3 shrink-0 rounded-sm"
                style={{ background: cat.color }}
              />
              <div>
                <div className="font-mono text-xs font-bold text-foreground">{cat.label}</div>
                <div className="text-sm leading-snug text-muted-foreground">{cat.description}</div>
              </div>
            </div>
          ))}
        </div>

        <SupplyChainRankings providers={PROVIDERS} />

        <div className="mt-12 rounded-xl border border-emerald-700/15 bg-emerald-700/5 p-6">
          <h3 className="mb-4 font-heading text-xl font-bold text-foreground">What to Look For</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 font-mono text-xs tracking-wide text-emerald-700 uppercase">
                Green Flags
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/80">
                <li>Manufacturing &gt; 15% of cost</li>
                <li>Physician oversight &gt; 15%</li>
                <li>Active R&amp;D / clinical trials</li>
                <li>Transparent about sourcing</li>
                <li>Compounding pharmacy partnerships</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-mono text-xs tracking-wide text-[#B22222] uppercase">
                Red Flags
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/80">
                <li>Marketing &gt; 30% of cost</li>
                <li>Zero physician allocation</li>
                <li>Celebrity endorsement premium</li>
                <li>&quot;Research use only&quot; disclaimers</li>
                <li>No published protocols or outcomes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-linear-to-br from-[#0A0A10] to-[#1a1a2e] px-6 py-16 text-center">
          <h2 className="mb-4 font-heading text-2xl font-bold text-[#E8E4DC]">
            Know What You&apos;re Buying
          </h2>
          <p className="mx-auto mb-8 max-w-md leading-relaxed text-[#E8E4DC]/60">
            Take the Peptide Clarity Index™ — the only assessment that screens for
            contraindications, cites evidence, and gives you personalized results. Not a lead
            generation form.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/find-your-peptide"
              className="rounded-lg bg-linear-to-br from-brand-gold to-brand-gold-light px-6 py-3 font-mono text-xs font-bold tracking-wide text-[#0A0A10] uppercase"
            >
              Take the Assessment <ForwardIcon aria-hidden="true" />
            </Link>
            <Link
              href="/peptide-hall-of-shame"
              className="rounded-lg border border-brand-gold/30 px-6 py-3 font-mono text-xs font-bold tracking-wide text-brand-gold uppercase"
            >
              See the Hall of Shame <ForwardIcon aria-hidden="true" />
            </Link>
            <Link
              href="/peptide-matrix"
              className="rounded-lg border border-brand-gold/30 px-6 py-3 font-mono text-xs font-bold tracking-wide text-brand-gold uppercase"
            >
              Review vs Evidence Matrix <ForwardIcon aria-hidden="true" />
            </Link>
            <Link
              href="/quiz_25q"
              className="rounded-lg border border-brand-gold/30 px-6 py-3 font-mono text-xs font-bold tracking-wide text-brand-gold uppercase"
            >
              25-Question Quiz <ForwardIcon aria-hidden="true" />
            </Link>
            <Link
              href="/peptide-watch"
              className="rounded-lg border border-[#C84B2A]/40 px-6 py-3 font-mono text-xs font-bold tracking-wide text-[#C84B2A] uppercase"
            >
              PeptideWatch Safety Guide <ForwardIcon aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-brand-gold/25 bg-linear-to-br from-brand-gold/8 to-brand-gold/2 p-8 text-center">
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-brand-gold uppercase">
            For Manufacturers &amp; Suppliers
          </p>
          <h3 className="mb-3 font-heading text-2xl font-bold text-foreground">
            Join Our Vetted Supply Network
          </h3>
          <p className="mx-auto mb-6 max-w-lg leading-relaxed text-muted-foreground">
            We are onboarding 400+ naturopathic clinics and selectively expanding our approved
            vendor base. If your manufacturing meets our transparency and quality standards, we want
            to hear from you.
          </p>
          <Link
            href="/supplier-intake"
            className="inline-block rounded-lg bg-brand-gold px-8 py-3 font-mono text-xs font-bold tracking-wide text-white uppercase"
          >
            Become a Supply Partner <ForwardIcon aria-hidden="true" />
          </Link>
        </div>

        <BioChainCTA
          variant="supplier"
          context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate."
        />

        <div className="mt-12 rounded-md bg-brand-gold/5 p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Methodology Note:</strong> Cost breakdowns are
            estimated based on publicly available information, industry benchmarks, SEC filings
            (where applicable), and interviews with compounding pharmacists and telehealth
            operators. Actual cost structures may vary. Credibility scores weight manufacturing
            allocation (25%), physician oversight (25%), R&amp;D investment (20%), compliance spend
            (15%), and transparency (15%). This page is for educational purposes only and does not
            constitute financial or medical advice. Data current as of February 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
