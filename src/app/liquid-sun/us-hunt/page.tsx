import { UsHunt } from "@/components/liquidsun/pages/us-hunt";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/USHunt.tsx (2026-11-21).
const seo = {
  path: "/us-hunt",
  title: "The US Hunt | LiquidSun",
  description: "These bottles are rare. They don't live on the bottom shelf of your local grocery store. You have to hunt for them.",
};

export const metadata = liquidsunMetadata(seo);

export default function UsHuntPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <UsHunt />
    </>
  );
}
