import type { Metadata } from "next";
import { FindYourPeptideQuiz } from "@/components/assessments/find-your-peptide-quiz";

export const metadata: Metadata = {
  title: "Find Your Peptide — The Peptide Clarity Index™",
  description:
    "The most comprehensive peptide assessment available. 10 questions, 7 clinical axes, 16 personalized archetypes.",
  alternates: { canonical: "/find-your-peptide" },
};

export default function FindYourPeptidePage() {
  return <FindYourPeptideQuiz />;
}
