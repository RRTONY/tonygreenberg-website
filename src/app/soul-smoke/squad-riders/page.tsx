import { SquadRiders } from "@/components/soulsmoke/pages/squad-riders";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// The Squad Riders, ported from the SoulSmoke app's client/src/pages/SquadRiders.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
export const metadata = soulsmokeMetadata({
  path: "/squad-riders",
  title: "The Squad Riders | SoulSmoke",
  description:
    "Who to trust in the mezcal world. From the legends who built the culture to the shills who exploit it.",
});

export default function SquadRidersPage() {
  return <SquadRiders />;
}
