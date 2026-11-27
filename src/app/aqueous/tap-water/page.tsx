import { TapWater } from "@/components/aqueous/pages/tap-water/tap-water";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/TapWater.tsx (2026-11-24).
const seo = { path: "/tap-water", ...AQUEOUS_SEO.tapWater };

export const metadata = aqueousMetadata(seo);

export default function TapWaterPage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <TapWater />
    </>
  );
}
