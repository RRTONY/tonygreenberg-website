import { WallOfShame } from "@/components/aqueous/pages/wall-of-shame";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/WallOfShame.tsx (2026-11-24).
const seo = { path: "/wall-of-shame", ...AQUEOUS_SEO.wallOfShame };

export const metadata = aqueousMetadata(seo);

export default function WallOfShamePage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <WallOfShame />
    </>
  );
}
