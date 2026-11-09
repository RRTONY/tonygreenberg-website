import { DiscoveryEngine } from "@/components/soulsmoke/pages/discovery-engine";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// Discovery Engine, ported from the SoulSmoke app's client/src/pages/DiscoveryEngine.tsx (2026-11-10).
// Title and description are the page's own H1 and subtitle.
const seo = {
  path: "/discovery",
  title: "Discovery Engine | SoulSmoke",
  description: "Find your perfect mezcal across every dimension that matters.",
};

export const metadata = soulsmokeMetadata(seo);

export default function DiscoveryPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <DiscoveryEngine />
    </>
  );
}
