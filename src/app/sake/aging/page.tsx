import { SakeAging } from "@/components/sake/pages/aging";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Aging.tsx (2026-11-26).
const seo = { path: "/aging", title: "Aging & Time", description: "From crystal-clear shiboritate to near-black 40-year koshu. The philosophy of patience in a culture obsessed with freshness." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeAging />
    </>
  );
}
