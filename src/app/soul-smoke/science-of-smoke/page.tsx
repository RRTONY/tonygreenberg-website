import { ScienceOfSmoke } from "@/components/soulsmoke/pages/science-of-smoke";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// Ported from the SoulSmoke app's client/src/pages/ScienceOfSmoke.tsx (2026-11-10).
const seo = {
  path: "/science-of-smoke",
  title: "The Science of Smoke | SoulSmoke",
  description:
    "Smoke is mezcal's signature. But it's not an accident: it's the result of deliberate choices about wood, pit design, and roasting time. Understanding smoke is understanding mezcal.",
};

export const metadata = soulsmokeMetadata(seo);

export default function ScienceOfSmokePage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <ScienceOfSmoke />
    </>
  );
}
