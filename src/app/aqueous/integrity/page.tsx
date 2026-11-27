import { Integrity } from "@/components/aqueous/pages/integrity";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/Integrity.tsx (2026-11-24).
const seo = { path: "/integrity", ...AQUEOUS_SEO.integrity };

export const metadata = aqueousMetadata(seo);

export default function IntegrityPage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <Integrity />
    </>
  );
}
