import type { Metadata } from "next";
import { FindYourKitchenQuiz } from "@/components/assessments/find-your-kitchen-quiz";

export const metadata: Metadata = {
  title: "Find Your Kitchen",
  description:
    "Discover your cooking style and the kitchen setup that matches how you actually cook.",
  alternates: { canonical: "/find-your-kitchen" },
};

export default function FindYourKitchenPage() {
  return <FindYourKitchenQuiz />;
}
