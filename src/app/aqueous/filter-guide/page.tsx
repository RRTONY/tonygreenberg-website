import { FilterGuide } from "@/components/aqueous/pages/filter-guide";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/FilterGuide.tsx (2026-11-24).
const seo = { path: "/filter-guide", ...AQUEOUS_SEO.filterGuide };

export const metadata = aqueousMetadata(seo);

export default function FilterGuidePage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <FilterGuide />
    </>
  );
}
