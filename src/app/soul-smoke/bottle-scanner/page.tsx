import { BottleScanner } from "@/components/soulsmoke/pages/bottle-scanner";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Bottle Scanner, ported from the SoulSmoke app's client/src/pages/BottleScanner.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
export const metadata = soulsmokeMetadata({
  path: "/bottle-scanner",
  title: "Bottle Scanner | SoulSmoke",
  description:
    "Upload a photo of any mezcal label. Our AI will identify the bottle, verify authenticity, and tell you if it's worth your money.",
});

export default function BottleScannerPage() {
  return <BottleScanner />;
}
