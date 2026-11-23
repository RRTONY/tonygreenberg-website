import { Speakeasy } from "@/components/liquidsun/pages/speakeasy";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Speakeasy.tsx (2026-11-21). A hidden page (no
// menu link in the app), so it is kept out of search and the sitemap.
const seo = {
  path: "/speakeasy",
  title: "Restricted Area | LiquidSun",
  description: "Restricted Area. Authorized Personnel Only.",
  noindex: true,
};

export const metadata = liquidsunMetadata(seo);

export default function SpeakeasyPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Speakeasy />
    </>
  );
}
