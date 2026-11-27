import { Suspense } from "react";
import { SakeSupplyChain, SakeSupplyChainFromQuery } from "@/components/sake/pages/supply-chain";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/SupplyChain.tsx (2026-11-26). ?sake=<id> (the Ordering
// Guide's Dollar Map link) opens that sake; reading it needs a Suspense boundary so the page itself
// stays static, and the fallback is the same page with nothing opened.
const seo = {
  path: "/supply-chain",
  title: "Dollar Map",
  description:
    "From rice paddy to your glass — trace the supply chain, see the margins, measure the carbon.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <Suspense fallback={<SakeSupplyChain />}>
        <SakeSupplyChainFromQuery />
      </Suspense>
    </>
  );
}
