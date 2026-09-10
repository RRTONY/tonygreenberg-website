import type { Metadata } from "next";
import { BrewSoulWelcomeQuiz } from "@/components/brewsoul/brewsoul-welcome-quiz";

// Ported from legacy client/src/pages/brewsoul/BrewSoulWelcome.tsx — the
// entry gate for the whole BrewSoul sub-site (Phase 6). See
// brewsoul-welcome-quiz.tsx for what changed while porting.
export const metadata: Metadata = {
  title: "Welcome to BrewSoul",
  description:
    "Start your BrewSoul journey — the world's most rigorous specialty coffee intelligence platform.",
  alternates: { canonical: "/brewsoul" },
};

export default function BrewSoulWelcomePage() {
  return <BrewSoulWelcomeQuiz />;
}
