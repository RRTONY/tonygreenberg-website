import { SoulsmokeHome } from "@/components/soulsmoke/pages/soulsmoke-home";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// SoulSmoke home, ported from the SoulSmoke app's client/src/pages/Home.tsx (2026-11-10).
// Title and description are the app's own (its index.html).
const seo = {
  path: "/",
  title: "SoulSmoke - The Miracle of Mezcal",
  description:
    "Liquids that touch your mouth must touch your mind and touch your heart. Explore the most esoteric, wild, and extraordinary mezcals from the US and Mexico.",
};

export const metadata = soulsmokeMetadata(seo);

export default function SoulsmokeHomePage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <SoulsmokeHome />
    </>
  );
}
