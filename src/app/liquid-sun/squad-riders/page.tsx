import { SquadRiders } from "@/components/liquidsun/pages/squad-riders";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/SquadRiders.tsx (2026-11-21).
const seo = {
  path: "/squad-riders",
  title: "Squad Riders | LiquidSun",
  description: "The few. The proud. The ones who know that \"smooth\" is an insult.",
};

export const metadata = liquidsunMetadata(seo);

export default function SquadRidersPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <SquadRiders />
    </>
  );
}
