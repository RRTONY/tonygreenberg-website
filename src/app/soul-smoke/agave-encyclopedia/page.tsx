import { AgaveEncyclopedia } from "@/components/soulsmoke/pages/agave-encyclopedia";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// Ported from the SoulSmoke app's client/src/pages/AgaveEncyclopedia.tsx (2026-11-10).
// Title is the page's H1, description its intro line.
const seo = {
  path: "/agave-encyclopedia",
  title: "Agave Encyclopedia | SoulSmoke",
  description:
    "15 species. Centuries of tradition. Each plant a universe of flavor—with the best bottles to prove it.",
};

export const metadata = soulsmokeMetadata(seo);

export default function SoulsmokeAgaveEncyclopediaPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <AgaveEncyclopedia />
    </>
  );
}
