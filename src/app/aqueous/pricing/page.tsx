import { Pricing } from "@/components/aqueous/pages/pricing";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/Pricing.tsx (2026-11-24).
const seo = { path: "/pricing", ...AQUEOUS_SEO.pricing };

export const metadata = aqueousMetadata(seo);

export default function PricingPage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <Pricing />
    </>
  );
}
