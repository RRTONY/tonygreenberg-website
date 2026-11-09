import { OaxacaMap } from "@/components/soulsmoke/pages/oaxaca-map";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// SoulSmoke Oaxaca map, ported from the SoulSmoke app's client/src/pages/OaxacaMap.tsx (2026-11-10).
export const metadata = soulsmokeMetadata({
  path: "/oaxaca-map",
  title: "The Sacred Geography | SoulSmoke",
  description:
    "Navigate the mezcal regions of Oaxaca. From the high mountains of Sierra Norte to the coastal lowlands, each terroir produces distinct spirits.",
});

export default function SoulsmokeOaxacaMapPage() {
  return <OaxacaMap />;
}
