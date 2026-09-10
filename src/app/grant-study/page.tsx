import type { Metadata } from "next";
import { GrantStudyQuiz } from "@/components/assessments/grant-study-quiz";

export const metadata: Metadata = {
  title: "Grant Study Assessment",
  description:
    "Measure your life satisfaction across the five factors the Harvard Grant Study — 85 years, 724 lives — identified as predictive of lifelong wellbeing.",
  alternates: { canonical: "/grant-study" },
};

export default function GrantStudyPage() {
  return <GrantStudyQuiz />;
}
