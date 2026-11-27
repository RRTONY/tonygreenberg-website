import { AWIIndex } from "@/components/aqueous/pages/awi-index";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/AWIIndex.tsx (2026-11-24).
const seo = { path: "/awi", ...AQUEOUS_SEO.awi };

export const metadata = aqueousMetadata(seo);

export default function AWIIndexPage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <AWIIndex />
    </>
  );
}
