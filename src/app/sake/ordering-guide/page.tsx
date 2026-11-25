import { SakeOrderingGuide } from "@/components/sake/pages/ordering-guide/ordering-guide";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/OrderingGuide.tsx (2026-11-26).
const seo = {
  path: "/ordering-guide",
  title: "Ordering Guide",
  description:
    "Five questions. Your perfect sake. We'll match your mood, palate, budget, and carbon consciousness to the bottles that deserve your attention.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeOrderingGuide />
    </>
  );
}
