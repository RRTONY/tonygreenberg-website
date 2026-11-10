import { MezcalTimeline } from "@/components/soulsmoke/pages/mezcal-timeline";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// The Evolution, ported from the SoulSmoke app's client/src/pages/MezcalTimeline.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
const seo = {
  path: "/evolution",
  title: "From Worm to Wonder | SoulSmoke",
  description:
    "The journey of mezcal from misunderstood rotgut to one of the world's most revered spirits. A story of resurrection, recognition, and revolution.",
};

export const metadata = soulsmokeMetadata(seo);

export default function EvolutionPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <MezcalTimeline />
    </>
  );
}
