import type { Metadata } from "next";
import { FindYourPeptideQuiz } from "@/components/assessments/find-your-peptide-quiz";
import { seoTitle } from "@/lib/seo-defaults";

export const metadata: Metadata = {
  // Through seoTitle so a long title drops " | Tony Greenberg" (CONTRIBUTING.md SEO rules).
  title: seoTitle("Find Your Peptide — The Peptide Clarity Index™"),
  description: "The most comprehensive peptide assessment available. 10 questions, 7 clinical axes, 16 personalized archetypes.",
  alternates: { canonical: "/find-your-peptide" },
};

export default function FindYourPeptidePage() {
  return <FindYourPeptideQuiz />;
}
