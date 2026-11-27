import { GemSpark } from "@/components/aqueous/pages/gem-spark";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/GemSpark.tsx (2026-11-24).
const seo = { path: "/gem-spark", ...AQUEOUS_SEO.gemSpark };

export const metadata = aqueousMetadata(seo);

export default function GemSparkPage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <GemSpark />
    </>
  );
}
