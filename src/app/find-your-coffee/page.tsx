import type { Metadata } from "next";
import { FindYourCoffeeQuiz } from "@/components/assessments/find-your-coffee-quiz";

export const metadata: Metadata = {
  title: "Find Your Coffee",
  description:
    "A 15-question assessment mapping your coffee archetype across 6 dimensions — roast, origin, ritual, social context, caffeine, and flavor complexity.",
  alternates: { canonical: "/find-your-coffee" },
};

export default function FindYourCoffeePage() {
  return <FindYourCoffeeQuiz />;
}
