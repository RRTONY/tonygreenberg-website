import { UsHunt } from "@/components/soulsmoke/pages/us-hunt";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Ported from the SoulSmoke app's client/src/pages/USHunt.tsx (2026-11-10).
export const metadata = soulsmokeMetadata({
  path: "/us-hunt",
  title: "The US Hunt | SoulSmoke",
  description: "The most esoteric, mind-bending bottles that somehow made it across the border.",
});

export default function UsHuntPage() {
  return <UsHunt />;
}
