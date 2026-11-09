import { MezcalAssholes } from "@/components/soulsmoke/pages/mezcal-assholes";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Ported from the SoulSmoke app's client/src/pages/MezcalAssholes.tsx (2026-11-10).
// Title is the page's H1, description its intro line.
export const metadata = soulsmokeMetadata({
  path: "/assholes",
  title: "Mezcal Assholes | SoulSmoke",
  description:
    "The brands where celebrity, marketing, and profit matter more than what's actually in the bottle. Names named. Receipts provided.",
});

export default function SoulsmokeAssholesPage() {
  return <MezcalAssholes />;
}
