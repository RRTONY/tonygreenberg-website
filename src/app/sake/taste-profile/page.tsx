import { SakeTasteProfile } from "@/components/sake/pages/taste-profile/taste-profile";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/TasteProfile.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = { path: "/taste-profile", title: "Taste Profile", description: "Seven questions. No wrong answers. Discover which sake archetype you are and which bottles will change your life." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeTasteProfile />
    </>
  );
}
