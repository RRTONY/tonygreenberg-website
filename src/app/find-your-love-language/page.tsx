import type { Metadata } from "next";
import { FindYourLoveLanguageQuiz } from "@/components/assessments/find-your-love-language-quiz";

export const metadata: Metadata = {
  title: "Find Your Love Language",
  description: "Discover your love language and how to use it to strengthen your relationships.",
  alternates: { canonical: "/find-your-love-language" },
};

export default function FindYourLoveLanguagePage() {
  return <FindYourLoveLanguageQuiz />;
}
