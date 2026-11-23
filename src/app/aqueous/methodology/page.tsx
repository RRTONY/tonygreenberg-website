import { QPRMethodology } from "@/components/aqueous/pages/qpr-methodology";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/QPRMethodology.tsx (2026-11-24).
const seo = { path: "/methodology", ...AQUEOUS_SEO.methodology };

export const metadata = aqueousMetadata(seo);

export default function MethodologyPage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <QPRMethodology />
    </>
  );
}
