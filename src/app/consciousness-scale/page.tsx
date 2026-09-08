import type { Metadata } from "next";
import { ConsciousnessScaleQuiz } from "@/components/assessments/consciousness-scale-quiz";

export const metadata: Metadata = {
  title: "Consciousness Scale",
  description: "25 questions that reveal where you actually operate on the Hawkins Map of Consciousness — not where you aspire to be, where you are.",
  alternates: { canonical: "/consciousness-scale" },
};

export default function ConsciousnessScalePage() {
  return <ConsciousnessScaleQuiz />;
}
