import type { Metadata } from "next";
import { CITIES, NATIONAL_STATS } from "@/lib/content/brewsoul-cities";
import { CitiesExplorer } from "@/components/brewsoul/cities-explorer";

// Ported from legacy client/src/pages/brewsoul/BrewSoulCities.tsx — the
// real 25-city "City Intelligence Module" leaderboard. See
// `lib/content/brewsoul-cities.ts` and `components/brewsoul/
// cities-explorer.tsx` for the full port notes on real content and what
// changed.
export const metadata: Metadata = {
  title: "Coffee Cities — BrewSoul",
  description: "The world's best cities for specialty coffee, ranked and reviewed — 1,250 shops scored across 7 dimensions in 25 American cities.",
  alternates: { canonical: "/brewsoul/cities" },
};

export default function BrewSoulCitiesPage() {
  return <CitiesExplorer cities={CITIES} nationalStats={NATIONAL_STATS} />;
}
