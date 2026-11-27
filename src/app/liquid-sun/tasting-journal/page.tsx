import { TastingJournal } from "@/components/liquidsun/pages/tasting-journal";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/TastingJournal.tsx (2026-11-21).
const seo = {
  path: "/tasting-journal",
  title: "The Log | LiquidSun",
  description: "Memory is a glitch. Write it down before the angels take their share.",
};

export const metadata = liquidsunMetadata(seo);

export default function TastingJournalPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <TastingJournal />
    </>
  );
}
