import { Landscape } from "@/components/aqueous/pages/landscape";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/Landscape.tsx (2026-11-24).
const seo = { path: "/landscape", ...AQUEOUS_SEO.landscape };

export const metadata = aqueousMetadata(seo);

export default function LandscapePage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <Landscape />
    </>
  );
}
