import { MexicoSource } from "@/components/soulsmoke/pages/mexico-source";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// Ported from the SoulSmoke app's client/src/pages/MexicoSource.tsx (2026-11-10).
const seo = {
  path: "/mexico-source",
  title: "The Mexico Source | SoulSmoke",
  description: "The craziest, most interesting stuff. Where the magic happens.",
};

export const metadata = soulsmokeMetadata(seo);

export default function MexicoSourcePage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <MexicoSource />
    </>
  );
}
