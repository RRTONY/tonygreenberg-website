import { HallOfFame } from "@/components/soulsmoke/pages/hall-of-fame";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// SoulSmoke Hall of Fame, ported from the SoulSmoke app's client/src/pages/HallOfFame.tsx (2026-11-10).
export const metadata = soulsmokeMetadata({
  path: "/hall-of-fame",
  title: "Hall of Fame | SoulSmoke",
  description: "The producers who chose integrity over profit. Tradition over trends. Soul over scale.",
});

export default function SoulsmokeHallOfFamePage() {
  return <HallOfFame />;
}
