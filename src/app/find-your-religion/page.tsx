import type { Metadata } from "next";
import { FindYourReligionQuiz } from "@/components/assessments/find-your-religion-quiz";

export const metadata: Metadata = {
  title: "Find Your Religion",
  description: "A 20-question assessment mapping your spiritual archetype across 8 dimensions.",
  alternates: { canonical: "/find-your-religion" },
};

export default function FindYourReligionPage() {
  return <FindYourReligionQuiz />;
}
