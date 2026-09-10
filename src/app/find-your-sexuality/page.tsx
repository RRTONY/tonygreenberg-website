import type { Metadata } from "next";
import { FindYourSexualityQuiz } from "@/components/assessments/find-your-sexuality-quiz";

export const metadata: Metadata = {
  title: "Find Your Sexuality",
  description: "A thoughtful, evidence-based assessment to explore and understand your sexuality.",
  alternates: { canonical: "/find-your-sexuality" },
};

export default function FindYourSexualityPage() {
  return <FindYourSexualityQuiz />;
}
