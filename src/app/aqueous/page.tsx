import { AqueousHome } from "@/components/aqueous/pages/home";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/Home.tsx (2026-11-24).
const seo = { path: "/", ...AQUEOUS_SEO.home };

export const metadata = aqueousMetadata(seo);

export default function AqueousHomePage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <AqueousHome />
    </>
  );
}
