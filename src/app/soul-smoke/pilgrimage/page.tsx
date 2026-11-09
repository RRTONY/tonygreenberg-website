import { PilgrimageGuide } from "@/components/soulsmoke/pages/pilgrimage-guide";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// SoulSmoke Pilgrimage Guide, ported from the SoulSmoke app's client/src/pages/PilgrimageGuide.tsx (2026-11-10).
const seo = {
  path: "/pilgrimage",
  title: "The Pilgrimage Guide | SoulSmoke",
  description:
    "Your complete guide to visiting Oaxaca as a mezcal devotee. Where to stay, what to eat, and how to connect with the people who make the magic.",
};

export const metadata = soulsmokeMetadata(seo);

export default function SoulsmokePilgrimagePage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <PilgrimageGuide />
    </>
  );
}
