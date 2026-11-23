import { Compare } from "@/components/aqueous/pages/compare";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/Compare.tsx (2026-11-24).
const seo = { path: "/compare", ...AQUEOUS_SEO.compare };

export const metadata = aqueousMetadata(seo);

export default function ComparePage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <Compare />
    </>
  );
}
