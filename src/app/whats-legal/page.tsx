import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import {
  PeptideLegalTable,
  type PeptideRegEntry,
} from "@/components/marketing/peptide-legal-table";
import { PeptideShutdownBanner } from "@/components/marketing/peptide-shutdown-banner";

// Ported from legacy client/src/pages/WhatsLegal.tsx. Real content,
// unchanged — 17 real compounds with real regulatory status across 3
// countries.
export const metadata: Metadata = {
  title: "What's Legal? — Peptide Regulatory Status by Country (2026)",
  description:
    "The 2025–2026 FDA enforcement wave targeted vendors, not users. Here's the actual legal status of every major peptide across the US, UK, and Australia.",
  alternates: { canonical: "/whats-legal" },
};

const DATA: PeptideRegEntry[] = [
  {
    compound: "BPC-157",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Scheduled (S4)",
    rxPath: "No",
    userRisk: "LOW",
  },
  {
    compound: "TB-500",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "No",
    userRisk: "LOW",
  },
  {
    compound: "Semaglutide",
    us: "Approved (Rx)",
    uk: "Approved (Rx)",
    australia: "Approved (Rx)",
    rxPath: "Yes (Rx)",
    userRisk: "VERY HIGH",
  },
  {
    compound: "Tirzepatide",
    us: "Approved (Rx)",
    uk: "Approved (Rx)",
    australia: "Approved (Rx)",
    rxPath: "Yes (Rx)",
    userRisk: "VERY HIGH",
  },
  {
    compound: "Retatrutide",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "No",
    userRisk: "MEDIUM",
  },
  {
    compound: "CJC-1295",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "Limited",
    userRisk: "LOW",
  },
  {
    compound: "Ipamorelin",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "Limited",
    userRisk: "LOW",
  },
  {
    compound: "PT-141",
    us: "Approved (HSDD)",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "Yes (Rx)",
    userRisk: "LOW",
  },
  {
    compound: "Selank",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "No",
    userRisk: "LOW",
  },
  {
    compound: "Semax",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "No",
    userRisk: "LOW",
  },
  {
    compound: "Epithalon",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "No",
    userRisk: "LOW",
  },
  {
    compound: "GHK-Cu",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "No",
    userRisk: "LOW",
  },
  {
    compound: "AOD-9604",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "TGA rejected",
    rxPath: "No",
    userRisk: "LOW-MEDIUM",
  },
  {
    compound: "MOTS-c",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "No",
    userRisk: "LOW",
  },
  {
    compound: "SS-31",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "No",
    userRisk: "LOW",
  },
  {
    compound: "Thymosin Alpha-1",
    us: "Grey Market",
    uk: "Approved (some)",
    australia: "Grey Market",
    rxPath: "Limited",
    userRisk: "LOW",
  },
  {
    compound: "Dihexa",
    us: "Grey Market",
    uk: "Grey Market",
    australia: "Grey Market",
    rxPath: "No",
    userRisk: "LOW",
  },
];

export default function WhatsLegalPage() {
  return (
    <div>
      <PeptideShutdownBanner />

      <section className="bg-[#0A0A10] px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 font-mono text-xs tracking-[0.25em] text-[#C84B2A] uppercase">
            Regulatory Intelligence · Updated May 2026
          </p>
          <h1 className="mb-5 font-heading text-4xl leading-tight font-bold sm:text-5xl">
            The Actual Legal Status of Every Peptide
            <br />
            <span className="text-[#C84B2A]">That Matters.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
            Not legal advice. Not a scare piece. Just the facts — compound by compound, country by
            country — so you can make informed decisions about your own body.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h3 className="mb-2 font-bold text-amber-900">Context (not preachy, just real):</h3>
          <p className="text-sm leading-relaxed text-amber-800">
            The 2025–2026 FDA enforcement wave targeted vendors, not users. No user has been
            prosecuted for personal peptide possession in the US. The legal risk sits with suppliers
            making health claims, not researchers using compounds quietly and responsibly. That
            said: BPC-157 is scheduled in Australia. GLP-1 compounds are a litigation minefield. And
            Colorado is actively considering state-level peptide transparency legislation. The
            landscape is moving.
          </p>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <PeptideLegalTable data={DATA} />
        </div>
      </section>

      <section className="bg-card px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
            Key Distinctions That Actually Matter
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h3 className="mb-1 font-bold text-foreground">
                &quot;Grey Market&quot; ≠ &quot;Illegal&quot;
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Grey market means not FDA-approved for human use but not explicitly banned for
                research purposes. The &quot;research only&quot; label is the legal distinction that
                has protected this market for a decade. It&apos;s thin. But it&apos;s real.
              </p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="mb-1 font-bold text-foreground">
                &quot;Approved (Rx)&quot; = Pharma Owns It
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Semaglutide and tirzepatide are FDA-approved drugs. Selling grey-market versions
                puts vendors in direct conflict with Eli Lilly and Novo Nordisk. The user risk is
                low. The vendor risk is existential.
              </p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="mb-1 font-bold text-foreground">
                &quot;Scheduled&quot; = Actually Controlled
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                In Australia, BPC-157 is now Schedule 4 (prescription only). Possession without a
                script carries legal consequences. This is not grey — it&apos;s black and white.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary px-6 py-12">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
          <Link
            href="/rip-peptide-sciences"
            className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium"
          >
            <BackIcon aria-hidden="true" /> RIP Peptide Sciences
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
        </div>
      </section>
    </div>
  );
}
