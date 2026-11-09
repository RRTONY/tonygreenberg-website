import { MyHuntList } from "@/components/soulsmoke/pages/my-hunt-list";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// My Hunt List, ported from the SoulSmoke app's client/src/pages/MyHuntList.tsx (2026-11-10).
// Title and description are the page's own H1 and its empty-list intro.
export const metadata = soulsmokeMetadata({
  path: "/my-hunt-list",
  title: "My Hunt List | SoulSmoke",
  description: "Start exploring the Quadrant and add bottles to your personal hunt list.",
});

export default function MyHuntListPage() {
  return <MyHuntList />;
}
