import { OaxacaMap } from "@/components/soulsmoke/pages/oaxaca-map";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// SoulSmoke Oaxaca map, ported from the SoulSmoke app's client/src/pages/OaxacaMap.tsx (2026-11-10).
const seo = {
  path: "/oaxaca-map",
  title: "The Sacred Geography | SoulSmoke",
  description:
    "Navigate the mezcal regions of Oaxaca. From the high mountains of Sierra Norte to the coastal lowlands, each terroir produces distinct spirits.",
};

export const metadata = soulsmokeMetadata(seo);

export default function SoulsmokeOaxacaMapPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <OaxacaMap />
    </>
  );
}
