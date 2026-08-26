import type { Metadata } from "next";
import { FindYourDietQuiz } from "@/components/assessments/find-your-diet-quiz";

export const metadata: Metadata = {
  title: "Find Your Diet",
  description: "A personalized diet assessment to find the nutritional approach that fits your biology and goals.",
  alternates: { canonical: "/find-your-diet" },
};

export default function FindYourDietPage() {
  return <FindYourDietQuiz />;
}
