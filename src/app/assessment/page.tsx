import type { Metadata } from "next";
import { AssessmentQuiz } from "@/components/assessments/assessment-quiz";

export const metadata: Metadata = {
  title: "Assessment",
  description:
    "Take a diagnostic assessment to clarify your thinking, identify your gaps, and find your next move.",
  alternates: { canonical: "/assessment" },
};

export default function AssessmentPage() {
  return <AssessmentQuiz />;
}
