import { Manifesto } from "@/components/aqueous/pages/manifesto";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/Manifesto.tsx (2026-11-24).
const seo = { path: "/manifesto", ...AQUEOUS_SEO.manifesto };

export const metadata = aqueousMetadata(seo);

export default function ManifestoPage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <Manifesto />
    </>
  );
}
