import { TheGatekeepers } from "@/components/liquidsun/pages/the-gatekeepers";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/TheGatekeepers.tsx (2026-11-21).
const seo = {
  path: "/the-gatekeepers",
  title: "The Gatekeepers | LiquidSun",
  description: "There are those who protect the spirit, and those who sell it out. Choose your teachers wisely.",
};

export const metadata = liquidsunMetadata(seo);

export default function TheGatekeepersPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <TheGatekeepers />
    </>
  );
}
