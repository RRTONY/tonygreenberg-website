import { Philosophy } from "@/components/aqueous/pages/philosophy";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/Philosophy.tsx (2026-11-24).
const seo = { path: "/philosophy", ...AQUEOUS_SEO.philosophy };

export const metadata = aqueousMetadata(seo);

export default function PhilosophyPage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <Philosophy />
    </>
  );
}
