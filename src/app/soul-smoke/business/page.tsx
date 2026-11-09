import { BusinessProfile } from "@/components/soulsmoke/pages/business-profile";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// For Business, ported from the SoulSmoke app's client/src/pages/BusinessProfile.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
export const metadata = soulsmokeMetadata({
  path: "/business",
  title: "Register Your Business | SoulSmoke",
  description:
    "Join the SoulSmoke network to discover and source extraordinary mezcal directly from producers. Free registration, no commitment.",
});

export default function BusinessPage() {
  return <BusinessProfile />;
}
