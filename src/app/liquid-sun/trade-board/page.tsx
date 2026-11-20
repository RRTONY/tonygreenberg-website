import { TradeBoard } from "@/components/liquidsun/pages/trade-board";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/TradeBoard.tsx (2026-11-21).
const seo = {
  path: "/trade-board",
  title: "The Trade Board | LiquidSun",
  description: "Where the liquid gold moves in silence. Private allocations, cellar swaps, and the secondary market pulse.",
};

export const metadata = liquidsunMetadata(seo);

export default function TradeBoardPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <TradeBoard />
    </>
  );
}
