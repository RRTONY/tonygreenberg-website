import { AncestralProcess } from "@/components/soulsmoke/pages/ancestral-process";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// Ported from the SoulSmoke app's client/src/pages/AncestralProcess.tsx (2026-11-10).
const seo = {
  path: "/ancestral-process",
  title: "The Ancestral Process | SoulSmoke",
  description:
    "From earth to spirit. Six stages. Centuries of wisdom. One sacred transformation.",
};

export const metadata = soulsmokeMetadata(seo);

export default function AncestralProcessPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <AncestralProcess />
    </>
  );
}
