import { PilgrimageGuide } from "@/components/soulsmoke/pages/pilgrimage-guide";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// SoulSmoke Pilgrimage Guide, ported from the SoulSmoke app's client/src/pages/PilgrimageGuide.tsx (2026-11-10).
export const metadata = soulsmokeMetadata({
  path: "/pilgrimage",
  title: "The Pilgrimage Guide | SoulSmoke",
  description:
    "Your complete guide to visiting Oaxaca as a mezcal devotee. Where to stay, what to eat, and how to connect with the people who make the magic.",
});

export default function SoulsmokePilgrimagePage() {
  return <PilgrimageGuide />;
}
