import { SquadRiders } from "@/components/soulsmoke/pages/squad-riders";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// The Squad Riders, ported from the SoulSmoke app's client/src/pages/SquadRiders.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
const seo = {
  path: "/squad-riders",
  title: "The Squad Riders | SoulSmoke",
  description:
    "Who to trust in the mezcal world. From the legends who built the culture to the shills who exploit it.",
};

export const metadata = soulsmokeMetadata(seo);

export default function SquadRidersPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <SquadRiders />
    </>
  );
}
