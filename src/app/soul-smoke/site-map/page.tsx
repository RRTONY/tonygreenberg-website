import { SoulsmokeSiteMap } from "@/components/soulsmoke/pages/site-map";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// Ported from the SoulSmoke app's client/src/pages/Appendix.tsx (2026-11-10).
const seo = {
  path: "/site-map",
  title: "Site Map | SoulSmoke",
  description: "Your guide to everything within. 11 pages, one journey.",
};

export const metadata = soulsmokeMetadata(seo);

export default function SoulsmokeSiteMapPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <SoulsmokeSiteMap />
    </>
  );
}
