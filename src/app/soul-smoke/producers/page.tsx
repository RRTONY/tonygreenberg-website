import { Producers } from "@/components/soulsmoke/pages/producers";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// Ported from the SoulSmoke app's client/src/pages/Producers.tsx (2026-11-10).
const seo = {
  path: "/producers",
  title: "The Makers | SoulSmoke",
  description:
    "Behind every extraordinary bottle is a family, a village, a philosophy. These are the producers who define what mezcal can be, and the ones worth building relationships with.",
};

export const metadata = soulsmokeMetadata(seo);

export default function ProducersPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <Producers />
    </>
  );
}
