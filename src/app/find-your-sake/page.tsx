import type { Metadata } from "next";
import { FindYourSakeQuiz } from "@/components/assessments/find-your-sake-quiz";

export const metadata: Metadata = {
  title: "Find Your Sake",
  description:
    "A 20-question assessment mapping your sake archetype across 5 dimensions — palate, ritual, terroir, philosophy, and season.",
  alternates: { canonical: "/find-your-sake" },
};

export default function FindYourSakePage() {
  return <FindYourSakeQuiz />;
}
