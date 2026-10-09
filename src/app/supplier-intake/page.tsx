import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { BioChainCTA } from "@/components/marketing/biochain-cta";
import { SupplierIntakeForm } from "@/components/supplier-intake/supplier-intake";
import { defaultOpenGraph } from "@/lib/seo-defaults";

// Stage 1 supplier application, ported from legacy
// client/src/pages/SupplierIntakeForm.tsx and checked against live
// tonygreenberg.com/supplier-intake (2026-10-07): same header copy, BioChain
// banner and 18 fields over 3 steps. Submissions go to the same Google Apps
// Script intake RampRate's own form uses (see actions.ts). Without
// GOOGLE_APPS_SCRIPT_URL the last step hands off to ramprate.com/biochain
// instead of offering a submit button that can't send anything.
const DESCRIPTION =
  "Apply to become a verified peptide supply partner. A short 3-step qualification form covering company identity, offer & scale, and terms & track record. No uploads required at this stage.";

export const metadata: Metadata = {
  title: { absolute: "Supplier Application — Peptide Supply Partner (Stage 1)" },
  description: DESCRIPTION,
  alternates: { canonical: "/supplier-intake" },
  openGraph: {
    ...defaultOpenGraph,
    title: "Supplier Application — Peptide Supply Partner (Stage 1)",
    description: DESCRIPTION,
    url: "/supplier-intake",
    type: "website",
  },
};

export default function SupplierIntakePage() {
  const canSubmit = Boolean(process.env.GOOGLE_APPS_SCRIPT_URL);

  return (
    <div className="min-h-screen bg-[#0A0A10] text-neutral-200">
      <div className="border-b border-neutral-800 bg-[#0D0D14]">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="mb-4 flex items-center gap-3">
            <Building2 aria-hidden="true" className="size-6 text-[#D4B96A]" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#D4B96A] uppercase">Supplier Application</span>
          </div>
          <h1 className="mb-3 font-serif text-3xl text-neutral-100 md:text-4xl">Stage 1: Supplier Profile</h1>
          <p className="max-w-xl leading-relaxed text-neutral-400">
            A short qualification form — about 2–3 minutes. No uploads required at this stage. If we decide to pursue
            a relationship, you&apos;ll receive a private link to complete the full supplier profile.
          </p>
          <p className="mt-3 font-mono text-xs text-neutral-500">
            Fields marked <span className="text-[#D4B96A]/60">*</span> are required.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-6">
        <BioChainCTA
          variant="supplier"
          context="The canonical supplier intake is at ramprate.com/biochain. You can also complete this form below — it feeds the same review pipeline."
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <SupplierIntakeForm canSubmit={canSubmit} />
      </div>
    </div>
  );
}
