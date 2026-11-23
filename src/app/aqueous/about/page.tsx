import { About } from "@/components/aqueous/pages/about";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/About.tsx (2026-11-24).
const seo = { path: "/about", ...AQUEOUS_SEO.about };

export const metadata = aqueousMetadata(seo);

export default function AboutPage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <About />
    </>
  );
}
