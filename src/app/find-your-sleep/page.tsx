import type { Metadata } from "next";
import { FindYourSleepQuiz } from "@/components/assessments/find-your-sleep-quiz";

export const metadata: Metadata = {
  title: "Find Your Sleep",
  description: "A personalized sleep assessment to optimize your sleep for your chronotype and lifestyle.",
  alternates: { canonical: "/find-your-sleep" },
};

export default function FindYourSleepPage() {
  return <FindYourSleepQuiz />;
}
