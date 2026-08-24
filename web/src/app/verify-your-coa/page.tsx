import type { Metadata } from "next";
import Link from "next/link";
import { PeptideShutdownBanner } from "@/components/marketing/peptide-shutdown-banner";
import { CoaChecklist, type CheckItem } from "@/components/marketing/coa-checklist";

// Ported from legacy client/src/pages/VerifyYourCoa.tsx. Real content,
// unchanged — the 7-point checklist (interactive, live score) and the
// 4-step Janoshik verification walkthrough.
export const metadata: Metadata = {
  title: "How to Read a Peptide COA — 7 Red Flags",
  description:
    "Every peptide vendor will hand you a Certificate of Analysis. Most will look official. Many are internal documents the vendor made themselves. Here's how to tell the difference in under five minutes.",
  alternates: { canonical: "/verify-your-coa" },
};

const CHECKLIST: CheckItem[] = [
  { id: 1, title: "The Lab Is Named and Findable", description: "The issuing lab should have a name, a website, and an accreditation you can look up independently. \"Internal Quality Lab\" is not a lab. Check: A2LA.org (US) or the ILAC database (international).", passLabel: "Named, accredited, independently queryable" },
  { id: 2, title: "It Is ISO/IEC 17025 Accredited", description: "This is the international standard for testing laboratories. If a lab doesn't hold this accreditation, their results carry no independent weight.", passLabel: "Accreditation confirmed on official registry" },
  { id: 3, title: "It Is Batch-Specific (Not Generic)", description: "Your COA should reference the exact lot number on your vials. \"Generic product testing\" means the document applies to some vial from some batch at some point. Useless.", passLabel: "Lot/batch number matches your order" },
  { id: 4, title: "HPLC Purity Is 98% or Higher (99%+ Is Better)", description: "High-Performance Liquid Chromatography measures purity. Below 98% is a problem. 95% means 5 out of every 100 molecules are something else. That matters.", passLabel: "98% minimum documented" },
  { id: 5, title: "Mass Spectrometry Confirms Molecular Identity", description: "Purity tells you how clean the sample is. Mass spectrometry tells you what it actually is. You want both. A 99% pure sample of the wrong compound is a 99% pure problem.", passLabel: "MS confirmation present" },
  { id: 6, title: "Endotoxin Testing Is Included", description: "A peptide can be 99% pure and still contain dangerous levels of bacterial endotoxins from manufacturing contamination. Most COAs skip this. It shouldn't be skipped.", passLabel: "Endotoxin test result documented" },
  { id: 7, title: "You Can Verify It Yourself Without the Vendor", description: "The gold standard: Janoshik Analytical (janoshik.com). Every Janoshik-tested batch gets a public reference ID. You go to their site, enter the ID, see the original results. No vendor. No PDF. No trust required — just verification.", passLabel: "Public verification pathway exists" },
];

const STEPS = [
  "Find the batch reference ID (on the product page or COA PDF)",
  "Go to janoshik.com",
  "Enter the ID in their search",
  "See the actual lab results — date, compound, purity, method",
];

export default function VerifyYourCoaPage() {
  return (
    <div>
      <PeptideShutdownBanner />

      <section className="bg-[#0A0A10] px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 font-mono text-xs tracking-[0.25em] text-[#C84B2A] uppercase">
            COA Verification Guide
          </p>
          <h1 className="mb-5 font-heading text-4xl leading-tight font-bold sm:text-5xl">
            A COA Is Only As Good As the Lab
            <br />
            <span className="text-[#C84B2A]">That Wrote It.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
            And a lot of labs did not write the ones you&apos;ve been given. Every peptide vendor
            will hand you a Certificate of Analysis. Most will look official. Many are internal
            documents the vendor made themselves. Some are the same document copy-pasted with
            different dates. Here is how to tell the difference in under five minutes.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            The 7-Point COA Checklist
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">
            Check each item your COA passes. Your live score updates below.
          </p>
          <CoaChecklist items={CHECKLIST} />
        </div>
      </section>

      <section className="bg-card px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
            The Two-Minute Check
          </h2>
          <p className="mb-5 text-foreground/80">If a vendor says they use Janoshik:</p>
          <ol className="mb-8 space-y-4">
            {STEPS.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                  {i + 1}
                </span>
                <span className="text-foreground/80">
                  {step.includes("janoshik.com") ? (
                    <>
                      Go to{" "}
                      <a
                        href="https://janoshik.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C84B2A] underline"
                      >
                        janoshik.com
                      </a>
                    </>
                  ) : (
                    step
                  )}
                </span>
              </li>
            ))}
          </ol>
          <div className="space-y-2 rounded-lg border border-border bg-secondary p-4 text-sm text-muted-foreground">
            <p>
              If the ID doesn&apos;t exist on Janoshik&apos;s database,{" "}
              <strong className="text-foreground">something is wrong.</strong>
            </p>
            <p>
              If there is no ID at all, the claim is{" "}
              <strong className="text-foreground">unverifiable.</strong>
            </p>
            <p>
              If the results don&apos;t match what the vendor told you,{" "}
              <strong className="text-foreground">you know what that means.</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary px-6 py-12">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
          <Link href="/rip-peptide-sciences" className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium">
            ← RIP Peptide Sciences
          </Link>
          <Link href="/whats-legal" className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium">
            What&apos;s Legal
          </Link>
          <Link href="/price-tracker" className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium">
            Price Tracker →
          </Link>
          <Link href="/test-your-peptides" className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium">
            Test Your Peptides →
          </Link>
        </div>
      </section>
    </div>
  );
}
