import { SoulsmokeJourney } from "@/components/soulsmoke/pages/journey";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Ported from the SoulSmoke app's client/src/pages/Journey.tsx (2026-11-10).
export const metadata = soulsmokeMetadata({
  path: "/journey",
  title: "From Curious to Connoisseur | SoulSmoke",
  description:
    "Six steps from \"I've never had good mezcal\" to \"Let me tell you about the Tepeztate I found in Santa María Ixcatlán.\"",
});

export default function SoulsmokeJourneyPage() {
  return <SoulsmokeJourney />;
}
