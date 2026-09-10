import type { Metadata } from "next";
import { FindYourSpiritQuiz } from "@/components/assessments/find-your-spirit-quiz";

export const metadata: Metadata = {
  title: "Find Your Spirit",
  description:
    "A comprehensive 35-question assessment mapping your spiritual landscape across 10 dimensions.",
  alternates: { canonical: "/find-your-spirit" },
};

export default function FindYourSpiritPage() {
  return <FindYourSpiritQuiz />;
}
