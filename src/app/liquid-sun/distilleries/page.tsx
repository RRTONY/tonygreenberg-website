import { Distilleries } from "@/components/liquidsun/pages/distilleries";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Distilleries.tsx (2026-11-21).
const seo = {
  path: "/distilleries",
  title: "The Sources | LiquidSun",
  description: "The physical places where alchemy happens. These are not factories; they are temples of agave.",
};

export const metadata = liquidsunMetadata(seo);

export default function DistilleriesPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Distilleries />
    </>
  );
}
