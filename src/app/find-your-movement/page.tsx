import type { Metadata } from "next";
import { FindYourMovementQuiz } from "@/components/assessments/find-your-movement-quiz";

export const metadata: Metadata = {
  title: "Find Your Movement",
  description:
    "A personalized movement assessment to find the exercise approach that fits your body and lifestyle.",
  alternates: { canonical: "/find-your-movement" },
};

export default function FindYourMovementPage() {
  return <FindYourMovementQuiz />;
}
