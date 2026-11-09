import { WhereToBuy } from "@/components/soulsmoke/pages/where-to-buy";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Where to Buy, ported from the SoulSmoke app's client/src/pages/WhereToBy.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
export const metadata = soulsmokeMetadata({
  path: "/where-to-buy",
  title: "Where to Buy | SoulSmoke",
  description:
    "Trusted retailers with excellent selections and fair prices. No rip-offs, no mass-market garbage, no celebrity brands.",
});

export default function WhereToBuyPage() {
  return <WhereToBuy />;
}
