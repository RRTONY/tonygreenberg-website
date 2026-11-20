import { PriceTracker } from "@/components/liquidsun/pages/price-tracker";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/PriceTracker.tsx (2026-11-21).
const seo = {
  path: "/price-tracker",
  title: "Price Tracker | LiquidSun",
  description: "The market is wild. Don't get ripped off.",
};

export const metadata = liquidsunMetadata(seo);

export default function PriceTrackerPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <PriceTracker />
    </>
  );
}
