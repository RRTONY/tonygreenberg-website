import { WaterExplorer } from "@/components/aqueous/pages/water-explorer";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/WaterExplorer.tsx (2026-11-24).
const seo = { path: "/explore", ...AQUEOUS_SEO.explore };

export const metadata = aqueousMetadata(seo);

export default function ExplorePage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <WaterExplorer />
    </>
  );
}
