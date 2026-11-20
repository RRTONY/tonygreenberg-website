import { JaliscoSource } from "@/components/liquidsun/pages/jalisco-source";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/JaliscoSource.tsx (2026-11-21).
const seo = {
  path: "/jalisco-source",
  title: "Jalisco Source | LiquidSun",
  description: "Going to the source is a pilgrimage. These are the waypoints for the faithful.",
};

export const metadata = liquidsunMetadata(seo);

export default function JaliscoSourcePage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <JaliscoSource />
    </>
  );
}
