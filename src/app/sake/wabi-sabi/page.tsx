import { SakeWabiSabi } from "@/components/sake/pages/wabi-sabi";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/WabiSabi.tsx (2026-11-26).
const seo = { path: "/wabi-sabi", title: "Wabi-Sabi", description: "Not \"rate this sake 92 points.\" Sit with its imperfection. The crack in the cup is where the gold enters. Seven principles for tasting with your soul, not your scorecard." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeWabiSabi />
    </>
  );
}
