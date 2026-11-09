import { SoulsmokeHome } from "@/components/soulsmoke/pages/soulsmoke-home";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// SoulSmoke home, ported from the SoulSmoke app's client/src/pages/Home.tsx (2026-11-10).
// Title and description are the app's own (its index.html).
export const metadata = soulsmokeMetadata({
  path: "/",
  title: "SoulSmoke - The Miracle of Mezcal",
  description:
    "Liquids that touch your mouth must touch your mind and touch your heart. Explore the most esoteric, wild, and extraordinary mezcals from the US and Mexico.",
});

export default function SoulsmokeHomePage() {
  return <SoulsmokeHome />;
}
