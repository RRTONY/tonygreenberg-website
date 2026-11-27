import { Directory } from "@/components/aqueous/pages/directory";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";

// Ported from the Aqueous app's client/src/pages/Directory.tsx (2026-11-24).
const seo = { path: "/directory", ...AQUEOUS_SEO.directory };

export const metadata = aqueousMetadata(seo);

export default function DirectoryPage() {
  return (
    <>
      <AqueousJsonLd {...seo} />
      <Directory />
    </>
  );
}
