import type { Metadata } from "next";
import { DharmaFinderQuiz } from "@/components/assessments/dharma-finder-quiz";

export const metadata: Metadata = {
  title: "Dharma Finder",
  description: "A 25-question inquiry distilled from Daniel Schmachtenberger's Dharma Inquiry. Discover your purpose, your values, and your path of service.",
  alternates: { canonical: "/dharma-finder" },
};

export default function DharmaFinderPage() {
  return <DharmaFinderQuiz />;
}
