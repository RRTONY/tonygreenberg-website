import { ScentFinder } from "@/components/soulsmoke/pages/scent-finder/scent-finder";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Scent-to-Agave Finder, ported from the SoulSmoke app's client/src/pages/ScentFinder.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
export const metadata = soulsmokeMetadata({
  path: "/scent-finder",
  title: "Scent-to-Agave Finder | SoulSmoke",
  description: "Select the aromas you taste, discover the agave behind them",
});

export default function ScentFinderPage() {
  return <ScentFinder />;
}
