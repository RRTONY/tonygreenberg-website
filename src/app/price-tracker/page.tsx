import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { PeptideShutdownBanner } from "@/components/marketing/peptide-shutdown-banner";
import { PriceTrackerTable, type PriceEntry } from "@/components/marketing/price-tracker-table";

// Ported from legacy client/src/pages/PriceTracker.tsx. Real content,
// unchanged — 13 real compounds with real research-vendor vs. telehealth
// price ranges, Tony's takes, and the interactive stack cost calculator.
export const metadata: Metadata = {
  title: "Peptide Prices 2026 — What You Should Actually Pay",
  description:
    "Twenty-five years of analyzing $10 billion in enterprise transactions taught me one thing: the information asymmetry IS the markup. This page fixes that.",
  alternates: { canonical: "/price-tracker" },
};

const PRICES: PriceEntry[] = [
  {
    compound: "BPC-157 (5mg x10 vials)",
    researchVendor: "$45–$90",
    telehealth: "$150–$400",
    monthlyEst: "$45–$400",
    verdict: "Research wins on price. Same molecule.",
    tgTake: "The most overhyped and underpriced peptide in the space. Both true at once.",
    researchLow: 45,
    researchHigh: 90,
    telehealthLow: 150,
    telehealthHigh: 400,
  },
  {
    compound: "TB-500 (5mg x4 vials)",
    researchVendor: "$60–$120",
    telehealth: "$200–$500",
    monthlyEst: "$60–$500",
    verdict: "Telehealth premium: 3–4x. Decide accordingly.",
    researchLow: 60,
    researchHigh: 120,
    telehealthLow: 200,
    telehealthHigh: 500,
  },
  {
    compound: "CJC-1295 / Ipamorelin (stack)",
    researchVendor: "$80–$160",
    telehealth: "$250–$600",
    monthlyEst: "$80–$600",
    verdict: "Compounding pharmacy is legit. At a price.",
    tgTake: "The stack that made peptides mainstream. Pricing reflects that.",
    researchLow: 80,
    researchHigh: 160,
    telehealthLow: 250,
    telehealthHigh: 600,
  },
  {
    compound: "Semaglutide (per month)",
    researchVendor: "$120–$250",
    telehealth: "$400–$900",
    monthlyEst: "$400–$900",
    verdict: "Pharma litigation = supply risk. Factor it in.",
    tgTake: "Ozempic in a research vial. The economics are wild until they aren't.",
    researchLow: 120,
    researchHigh: 250,
    telehealthLow: 400,
    telehealthHigh: 900,
  },
  {
    compound: "Tirzepatide (per month)",
    researchVendor: "$150–$300",
    telehealth: "$500–$1,200",
    monthlyEst: "$500–$1,200",
    verdict: "Novo is actively suing suppliers. Risk premium real.",
    researchLow: 150,
    researchHigh: 300,
    telehealthLow: 500,
    telehealthHigh: 1200,
  },
  {
    compound: "Retatrutide (experimental)",
    researchVendor: "$200–$450",
    telehealth: "N/A",
    monthlyEst: "$200–$450",
    verdict: "Telehealth path doesn't exist yet.",
    tgTake: "Next-gen GLP-1. No telehealth path yet. Give it 18 months.",
    researchLow: 200,
    researchHigh: 450,
    telehealthLow: 0,
    telehealthHigh: 0,
  },
  {
    compound: "PT-141 (10mg x5 vials)",
    researchVendor: "$50–$100",
    telehealth: "$200–$400",
    monthlyEst: "$50–$400",
    verdict: "FDA-approved version exists. Compare.",
    researchLow: 50,
    researchHigh: 100,
    telehealthLow: 200,
    telehealthHigh: 400,
  },
  {
    compound: "Selank (5mg x10 vials)",
    researchVendor: "$35–$70",
    telehealth: "N/A",
    monthlyEst: "$35–$70",
    verdict: "Low cost, no telehealth path, straightforward.",
    researchLow: 35,
    researchHigh: 70,
    telehealthLow: 0,
    telehealthHigh: 0,
  },
  {
    compound: "Semax (5mg x10 vials)",
    researchVendor: "$40–$80",
    telehealth: "N/A",
    monthlyEst: "$40–$80",
    verdict: "Same story as Selank.",
    researchLow: 40,
    researchHigh: 80,
    telehealthLow: 0,
    telehealthHigh: 0,
  },
  {
    compound: "Epithalon (10mg x10 vials)",
    researchVendor: "$60–$120",
    telehealth: "N/A",
    monthlyEst: "$60–$120",
    verdict: "Longevity stack workhorse. Inexpensive.",
    researchLow: 60,
    researchHigh: 120,
    telehealthLow: 0,
    telehealthHigh: 0,
  },
  {
    compound: "GHK-Cu (50mg topical/injection)",
    researchVendor: "$25–$60",
    telehealth: "N/A",
    monthlyEst: "$25–$60",
    verdict: "Skin and wound applications. Very cheap.",
    researchLow: 25,
    researchHigh: 60,
    telehealthLow: 0,
    telehealthHigh: 0,
  },
  {
    compound: "Thymosin Alpha-1 (1mg x10)",
    researchVendor: "$70–$150",
    telehealth: "$300–$700",
    monthlyEst: "$70–$700",
    verdict: "Immune support. Telehealth premium steep.",
    researchLow: 70,
    researchHigh: 150,
    telehealthLow: 300,
    telehealthHigh: 700,
  },
  {
    compound: "SS-31 (Elamipretide, 10mg)",
    researchVendor: "$80–$180",
    telehealth: "N/A",
    monthlyEst: "$80–$180",
    verdict: "Mitochondrial. No Rx path yet.",
    researchLow: 80,
    researchHigh: 180,
    telehealthLow: 0,
    telehealthHigh: 0,
  },
  {
    compound: "MOTS-c (10mg)",
    researchVendor: "$90–$200",
    telehealth: "N/A",
    monthlyEst: "$90–$200",
    verdict: "Metabolic / longevity. Emerging data.",
    researchLow: 90,
    researchHigh: 200,
    telehealthLow: 0,
    telehealthHigh: 0,
  },
];

export default function PriceTrackerPage() {
  return (
    <div>
      <PeptideShutdownBanner />

      <section className="bg-[#0A0A10] px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 font-mono text-xs tracking-[0.25em] text-[#C84B2A] uppercase">
            Price Intelligence · May 2026
          </p>
          <h1 className="mb-5 font-heading text-4xl leading-tight font-bold sm:text-5xl">
            Here Is What Peptides Actually Cost.
          </h1>
          <p className="mb-4 text-xl text-zinc-300">
            (And here is what some people are being charged, which is a different number.)
          </p>
          <p className="max-w-2xl leading-relaxed text-zinc-400">
            Twenty-five years of analyzing $10 billion in enterprise transactions taught me one
            thing that applies equally to data centers, cloud contracts, and peptide vials: the
            information asymmetry IS the markup. When you don&apos;t know what something should
            cost, you pay whatever you&apos;re told. This page fixes that.
          </p>
        </div>
      </section>

      <PriceTrackerTable prices={PRICES} />

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
