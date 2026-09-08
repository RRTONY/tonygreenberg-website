import type { Metadata } from "next";
import { FindYourTherapyQuiz } from "@/components/assessments/find-your-therapy-quiz";

export const metadata: Metadata = {
  title: "Find Your Therapy",
  description: "A 25-question assessment mapping your therapeutic archetype across 6 dimensions — cognitive, somatic, relational, depth, altered states, and integrative.",
  alternates: { canonical: "/find-your-therapy" },
};

export default function FindYourTherapyPage() {
  return <FindYourTherapyQuiz />;
}
