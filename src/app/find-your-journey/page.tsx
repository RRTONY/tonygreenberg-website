import type { Metadata } from "next";
import { JourneyFinder } from "@/components/marketing/journey-finder";

// Ported from legacy client/src/pages/JourneyFinder.tsx. Real content,
// unchanged — 5 questions, 6 journey archetypes, real curated article
// lists. See journey-finder.tsx for what changed (icons, dropped dead
// external link, dropped backend save).
export const metadata: Metadata = {
  title: "Find Your Journey",
  description:
    "Five questions. Your personalized reading path through ninety-one essays on consciousness, business, relationships, health, impact, and justice.",
  alternates: { canonical: "/find-your-journey" },
};

export default function FindYourJourneyPage() {
  return <JourneyFinder />;
}
