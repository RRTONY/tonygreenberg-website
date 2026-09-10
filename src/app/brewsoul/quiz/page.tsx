import type { Metadata } from "next";
import { BrewSoulQuiz } from "@/components/brewsoul/brewsoul-quiz";

export const metadata: Metadata = {
  title: "Coffee Quiz — BrewSoul",
  description: "Find your perfect coffee match with BrewSoul's diagnostic quiz.",
  alternates: { canonical: "/brewsoul/quiz" },
};

export default function BrewSoulQuizPage() {
  return <BrewSoulQuiz />;
}
