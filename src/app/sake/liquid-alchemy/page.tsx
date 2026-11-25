import { SakeLiquidAlchemy } from "@/components/sake/pages/liquid-alchemy";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/LiquidAlchemy.tsx (2026-11-26).
const seo = {
  path: "/liquid-alchemy",
  title: "Liquid Alchemy",
  description:
    "Why sake is the most nutritionally complex, biochemically beneficial, and consciousness-friendly alcohol on earth.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeLiquidAlchemy />
    </>
  );
}
