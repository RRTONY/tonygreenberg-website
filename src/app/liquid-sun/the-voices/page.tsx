import { Voices } from "@/components/liquidsun/pages/voices";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Voices.tsx (2026-11-21).
const seo = {
  path: "/the-voices",
  title: "The Voices | LiquidSun",
  description: "Listen to the stories of the land, told by those who have dedicated their lives to the spirit.",
};

export const metadata = liquidsunMetadata(seo);

export default function VoicesPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Voices />
    </>
  );
}
