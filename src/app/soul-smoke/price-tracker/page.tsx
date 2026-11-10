import { PriceTracker } from "@/components/soulsmoke/pages/price-tracker";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// Price Tracker, ported from the SoulSmoke app's client/src/pages/PriceTracker.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
const seo = {
  path: "/price-tracker",
  title: "Price Tracker | SoulSmoke",
  description:
    "Track prices across retailers. Set alerts for rare bottles. Never miss a deal on the mezcal you're hunting.",
};

export const metadata = soulsmokeMetadata(seo);

export default function PriceTrackerPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <PriceTracker />
    </>
  );
}
