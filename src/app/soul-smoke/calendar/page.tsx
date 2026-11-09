import { MezcalCalendar } from "@/components/soulsmoke/pages/mezcal-calendar";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Mezcal Calendar, ported from the SoulSmoke app's client/src/pages/MezcalCalendar.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
export const metadata = soulsmokeMetadata({
  path: "/calendar",
  title: "Mezcal Calendar | SoulSmoke",
  description:
    "Festivals, tastings, producer visits, and educational events. Plan your mezcal pilgrimage.",
});

export default function CalendarPage() {
  return <MezcalCalendar />;
}
