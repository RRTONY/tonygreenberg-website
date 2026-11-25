import { SakeDealAlerts } from "@/components/sake/pages/deal-alerts";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/DealAlerts.tsx (2026-11-26).
const seo = {
  path: "/deal-alerts",
  title: "Deal Alerts",
  description:
    "Get notified when your favorite sake drops in price. Set thresholds, track favorites, and never miss a deal.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeDealAlerts />
    </>
  );
}
