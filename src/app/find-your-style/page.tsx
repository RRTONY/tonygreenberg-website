import type { Metadata } from "next";
import { FindYourStyleQuiz } from "@/components/assessments/find-your-style-quiz";

export const metadata: Metadata = {
  title: "Find Your Style",
  description: "Discover your personal style and the aesthetic that authentically represents you.",
  alternates: { canonical: "/find-your-style" },
};

export default function FindYourStylePage() {
  return <FindYourStyleQuiz />;
}
