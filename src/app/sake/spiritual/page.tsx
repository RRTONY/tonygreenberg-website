import { SakeSpiritual } from "@/components/sake/pages/spiritual";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/SpiritualRealms.tsx (2026-11-26).
const seo = { path: "/spiritual", title: "Spiritual Realms", description: "Sake is not a beverage. It is a vehicle. These are the seven territories of consciousness accessible through sincere, attentive drinking — documented by monks, priests, and brewers across a thousand years." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeSpiritual />
    </>
  );
}
