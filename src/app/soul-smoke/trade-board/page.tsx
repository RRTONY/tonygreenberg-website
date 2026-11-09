import { TradeBoard } from "@/components/soulsmoke/pages/trade-board";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Trade Board, ported from the SoulSmoke app's client/src/pages/TradeBoard.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
export const metadata = soulsmokeMetadata({
  path: "/trade-board",
  title: "Trade Board | SoulSmoke",
  description:
    "Connect with fellow collectors to trade or sell rare bottles. No middlemen, no markups—just mezcal lovers helping each other.",
});

export default function TradeBoardPage() {
  return <TradeBoard />;
}
