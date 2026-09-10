import type { Metadata } from "next";
import { PeptideShutdownBanner } from "@/components/marketing/peptide-shutdown-banner";
import { BioChainCTA } from "@/components/marketing/biochain-cta";
import { PeptideQuiz } from "@/components/marketing/peptide-quiz";

// Ported from legacy client/src/pages/PeptideQuiz25.tsx. Real content,
// unchanged — all 25 questions across 5 scoring dimensions, all 5 result
// profiles with real recommendations. The email-gate phase never actually
// submitted anywhere in the legacy source either (no backend call in its
// handler) — kept as real client-only gating logic, not a removed feature.
// `AssessmentResultActions`'s "Send to Tony"/"Keep Private" (a tRPC CRM
// write) was dropped; "Download PDF" (`window.print`) is kept since it's
// real and backend-free. Legacy hero image (CloudFront) confirmed 403,
// same dead host as every other peptide page — dropped for plain styling.
export const metadata: Metadata = {
  title: "Peptide Consumer Literacy Quiz — 25 Questions",
  description:
    "Test your peptide knowledge across 5 dimensions: Science Literacy, Red Flag Detection, Provider Evaluation, Regulatory Awareness, and Personal Risk Assessment.",
  alternates: { canonical: "/quiz_25q" },
};

export default function Quiz25QPage() {
  return (
    <div>
      <PeptideShutdownBanner />
      <PeptideQuiz />
      <div className="mx-auto max-w-3xl px-6 pb-16 sm:px-10">
        <BioChainCTA
          variant="both"
          context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate."
        />
      </div>
    </div>
  );
}
