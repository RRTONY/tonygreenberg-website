import { SoulsmokeSiteMap } from "@/components/soulsmoke/pages/site-map";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Ported from the SoulSmoke app's client/src/pages/Appendix.tsx (2026-11-10).
export const metadata = soulsmokeMetadata({
  path: "/site-map",
  title: "Site Map | SoulSmoke",
  description: "Your guide to everything within. 11 pages, one journey.",
});

export default function SoulsmokeSiteMapPage() {
  return <SoulsmokeSiteMap />;
}
