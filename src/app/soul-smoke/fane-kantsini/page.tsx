import { FaneKantsini } from "@/components/soulsmoke/pages/fane-kantsini/fane-kantsini";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// Ported from the SoulSmoke app's client/src/pages/FaneKantsini.tsx (2026-11-10).
// Title is the page's H1; description is the opening of its origin story.
const seo = {
  path: "/fane-kantsini",
  title: "Fane Kantsini | SoulSmoke",
  description:
    "Years ago, I needed to assemble a case of things extraordinary for an extraordinary human. Not flashy. Not loud. Just undeniable.",
};

export const metadata = soulsmokeMetadata(seo);

export default function SoulsmokeFaneKantsiniPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <FaneKantsini />
    </>
  );
}
