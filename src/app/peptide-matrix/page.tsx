import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import {
  Brain,
  RefreshCw,
  Clock,
  BarChart3,
  DollarSign,
  Dna,
  AlertTriangle,
  FileText,
  Shield,
  Newspaper,
  Check,
  X,
  type LucideIcon,
} from "lucide-react";
import { PeptideShutdownBanner } from "@/components/marketing/peptide-shutdown-banner";
import { BioChainCTA } from "@/components/marketing/biochain-cta";
import { PeptideMatrixExplorer } from "@/components/marketing/peptide-matrix-explorer";
import { PeptideMatrixMethodology } from "@/components/marketing/peptide-matrix-methodology";
import { QUADRANTS, DANGER_MECHANISMS, CROSS_LINKS } from "@/lib/content/peptide-matrix";

// Ported from legacy client/src/pages/PeptideMatrix.tsx. Real content,
// unchanged — an interactive public-signal-vs-evidence-score scatter plot
// (canvas) mapping 8 real named entities (influencers, clinics, vendors,
// doctors, a regulatory body) across 4 quadrants, plus a sortable entity
// table, danger-zone psychology, evidence-scoring methodology, and the
// site's full legal fair-comment/appeals framework for this genre of page.
//
// The legacy hero background image (CloudFront-hosted) returns 403, same
// host/failure as /peptide-hall-of-shame and /peptide-supply-chain —
// dropped in favor of a CSS gradient.
export const metadata: Metadata = {
  title: "Peptide Evidence Matrix — Public Signals and Scientific Evidence",
  description:
    "A public-source evidence matrix for peptide influencers, clinics, and vendors, separating consumer visibility from scientific evidence.",
  alternates: { canonical: "/peptide-matrix" },
};

const DANGER_ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  refresh: RefreshCw,
  clock: Clock,
  chart: BarChart3,
  dollar: DollarSign,
};

const CROSS_LINK_ICONS: Record<string, LucideIcon> = {
  dna: Dna,
  alert: AlertTriangle,
  dollar: DollarSign,
  file: FileText,
  shield: Shield,
  newspaper: Newspaper,
};

const SEARCH_ENGINE_ITEMS = [
  {
    label: "Google First Page",
    value: "Dominated by sellers",
    detail: "Ways2Well top 3, GP top 5, Brecka sponsored",
  },
  {
    label: "Organic Rankings",
    value: "Inverse relationship",
    detail: "High SEO spend = Low evidence base",
  },
  {
    label: "Consumer Default",
    value: "Click first result",
    detail: "Without vetting source or evidence",
  },
];

const WHAT_THIS_IS = [
  "Aggregation of public reviews (Yelp, Google, Healthgrades, WebMD, etc)",
  "Comparison of review sentiment vs scientific evidence base",
  "Analysis of FDA regulatory status",
  "Price-value assessment based on bioavailability data",
  "Gap analysis: Market acceptance vs scientific validation",
];

const WHAT_THIS_IS_NOT = [
  "Medical advice or diagnosis",
  "Recommendation or endorsement of any practitioner",
  "Accusation of malpractice or wrongdoing",
  "Claim that high reviews = bad practice",
];

const LEGAL_PROTECTIONS = [
  {
    label: "Fair Comment Doctrine",
    desc: "Opinions on matters of public interest (health/safety)",
  },
  {
    label: "Truth Defense",
    desc: "All facts sourced from public records, published reviews, regulatory docs",
  },
  { label: "No Actual Malice", desc: "Good faith analysis for consumer protection" },
  { label: "Public Interest", desc: "Healthcare transparency and evidence-based decision making" },
  { label: "Appeals Process", desc: "Any practitioner can submit corrections/context" },
  { label: "Disclosed Methodology", desc: "Scoring criteria transparent and applied uniformly" },
];

export default function PeptideMatrixPage() {
  return (
    <div>
      <PeptideShutdownBanner />

      <div className="border-b border-brand-gold/15 bg-[#0A0A10] px-6 py-2.5 text-center">
        <p className="font-mono text-xs tracking-wide text-brand-gold/60 uppercase">
          Mirror of the Market · Fair Comment · Public Interest · Not Medical Advice ·{" "}
          <a href="#appeals" className="text-brand-gold underline">
            Appeals Process
          </a>
        </p>
      </div>

      <section className="bg-linear-to-b from-[#0A0A10] to-[#1a1a2e] px-6 py-16 text-center">
        <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold uppercase">
          The Public-Signal Evidence Matrix · Peptide Truth System
        </p>
        <h1 className="mx-auto mb-6 max-w-2xl font-heading text-4xl leading-tight font-black text-[#E8E4DC] sm:text-5xl">
          Public Signals <span className="text-[#C0392B]">Are Not</span> Clinical Evidence
        </h1>
        <p className="mx-auto max-w-xl leading-relaxed text-[#E8E4DC]/60">
          Public attention and scientific validation are different metrics. This matrix maps where
          major peptide entities fall and reveals the gap between public visibility and what science
          supports.
        </p>
      </section>

      <div className="border-y-2 border-[#C0392B] bg-[#C0392B]/8 px-6 py-6 text-center">
        <p className="flex items-center justify-center gap-2 font-heading text-xl font-bold text-[#C0392B]">
          <TriangleAlert aria-hidden="true" className="size-5" />
          Unverified consumer enthusiasm is not clinical evidence.
        </p>
        <p className="mt-2 font-mono text-xs tracking-wide text-muted-foreground">
          EVIDENCE: 0 Phase 3 RCTs · FDA Category 2 · Contamination Risk
        </p>
        <p className="mt-2 font-semibold text-[#C0392B]">This is the Danger Zone.</p>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        <PeptideMatrixExplorer />

        <section className="mb-12">
          <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
            The Four Quadrants
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {QUADRANTS.map((q) => (
              <div
                key={q.id}
                className="rounded-xl border-l-4 p-6"
                style={{ background: `${q.color}14`, borderColor: q.color }}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <h3
                    className="font-mono text-xs font-bold tracking-wide uppercase"
                    style={{ color: q.color }}
                  >
                    {q.id}: {q.label}
                  </h3>
                  <span
                    className="rounded-full px-2 py-0.5 font-mono text-[0.6rem]"
                    style={{ background: `${q.color}22`, color: q.color }}
                  >
                    {q.risk} RISK
                  </span>
                </div>
                <p className="mb-2 font-mono text-xs text-muted-foreground">{q.subtitle}</p>
                <p className="text-sm leading-relaxed text-foreground/80">{q.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
            Why High Reviews + Low Evidence = Highest Risk
          </h2>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            Five psychological mechanisms explain why the Danger Zone exists — and why it&apos;s so
            hard to escape.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DANGER_MECHANISMS.map((m, i) => {
              const Icon = DANGER_ICONS[m.iconKey];
              return (
                <div
                  key={m.title}
                  className="rounded-xl border-t-2 border-[#C0392B]/20 bg-[#C0392B]/4 p-6"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Icon className="size-5 text-[#C0392B]" />
                    <span className="font-mono text-xs font-bold text-[#C0392B]">{m.stat}</span>
                  </div>
                  <h3 className="mb-2 font-mono text-sm tracking-wide text-foreground">
                    {i + 1}. {m.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">{m.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12 rounded-xl bg-linear-to-br from-[#0A0A10] to-[#1a1a2e] p-8">
          <h2 className="mb-4 font-heading text-xl font-bold text-[#E8E4DC]">
            The Search Engine Problem
          </h2>
          <p className="mb-6 leading-relaxed text-[#E8E4DC]/60">
            Google &quot;peptides near me&quot; and the first page is dominated by sellers, not
            researchers. Paid ads and SEO appear first — not evidence-based information. The
            relationship between search ranking and scientific evidence is <em>inverse</em>: the
            higher the SEO budget, the lower the evidence base.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {SEARCH_ENGINE_ITEMS.map((item) => (
              <div key={item.label} className="rounded-lg bg-brand-gold/5 p-4">
                <p className="font-mono text-xs tracking-wide text-brand-gold uppercase">
                  {item.label}
                </p>
                <p className="my-1 font-semibold text-[#E8E4DC]">{item.value}</p>
                <p className="text-sm text-[#E8E4DC]/40">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <PeptideMatrixMethodology />

        <section className="mb-12">
          <h2 className="mb-6 font-heading text-xl font-bold text-foreground">
            The Complete Peptide Truth System
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CROSS_LINKS.map((link) => {
              const Icon = CROSS_LINK_ICONS[link.iconKey];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl border border-brand-gold/10 bg-brand-gold/3 p-6 transition-colors hover:border-brand-gold/30"
                >
                  <Icon className="mb-2 size-5 text-brand-gold" />
                  <h3 className="mb-1 font-mono text-sm tracking-wide text-brand-gold">
                    {link.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{link.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section
          id="appeals"
          className="mb-12 scroll-mt-20 rounded-xl border border-brand-gold/10 bg-brand-gold/3 p-8"
        >
          <h2 className="mb-3 font-heading text-xl font-bold text-foreground">
            Appeals &amp; Corrections
          </h2>
          <p className="mb-4 leading-relaxed text-foreground/80">
            Any practitioner, vendor, or entity listed on this page can submit corrections, context,
            or updated information. We are committed to accuracy and fairness. All appeals are
            reviewed within 14 business days.
          </p>
          <p className="font-mono text-sm text-brand-gold">Contact: appeals@impactsoul.is</p>
        </section>

        <section className="mb-16 rounded-xl bg-[#0A0A10] p-8">
          <h2 className="mb-6 font-mono text-xs tracking-wide text-brand-gold uppercase">
            Legal Framework &amp; Methodology
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 font-mono text-xs tracking-wide text-[#E8E4DC]/50 uppercase">
                What This Is
              </h3>
              {WHAT_THIS_IS.map((item) => (
                <p
                  key={item}
                  className="my-1.5 flex items-start gap-2 text-sm leading-relaxed text-[#E8E4DC]/50"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-brand-gold" />
                  {item}
                </p>
              ))}
            </div>
            <div>
              <h3 className="mb-3 font-mono text-xs tracking-wide text-[#E8E4DC]/50 uppercase">
                What This Is NOT
              </h3>
              {WHAT_THIS_IS_NOT.map((item) => (
                <p
                  key={item}
                  className="my-1.5 flex items-start gap-2 text-sm leading-relaxed text-[#E8E4DC]/50"
                >
                  <X className="mt-0.5 size-3.5 shrink-0 text-[#C0392B]" />
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-brand-gold/10 pt-6">
            <h3 className="mb-3 font-mono text-xs tracking-wide text-[#E8E4DC]/50 uppercase">
              Legal Protections
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LEGAL_PROTECTIONS.map((p) => (
                <div key={p.label}>
                  <p className="flex items-center gap-1.5 font-mono text-xs text-brand-gold">
                    <Check className="size-3" />
                    {p.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[#E8E4DC]/35">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="rounded-xl border border-brand-gold/25 bg-linear-to-br from-brand-gold/8 to-brand-gold/2 p-8 text-center">
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
          variant="both"
          context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate."
        />
      </div>
    </div>
  );
}
