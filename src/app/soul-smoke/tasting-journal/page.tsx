import { TastingJournal } from "@/components/soulsmoke/pages/tasting-journal";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Tasting Journal, ported from the SoulSmoke app's client/src/pages/TastingJournal.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
export const metadata = soulsmokeMetadata({
  path: "/tasting-journal",
  title: "Your Tasting Journal | SoulSmoke",
  description:
    "Track every mezcal you taste. Record your notes, ratings, and flavor profiles. Build your personal archive of liquid memories.",
});

export default function TastingJournalPage() {
  return <TastingJournal />;
}
