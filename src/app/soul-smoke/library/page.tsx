import { MezcalLibrary } from "@/components/soulsmoke/pages/mezcal-library";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Ported from the SoulSmoke app's client/src/pages/MezcalLibrary.tsx (2026-11-10).
export const metadata = soulsmokeMetadata({
  path: "/library",
  title: "The Essential Mezcal Reading List | SoulSmoke",
  description:
    "Ten books that will transform how you understand, appreciate, and drink mezcal. From foundational texts to future visions.",
});

export default function MezcalLibraryPage() {
  return <MezcalLibrary />;
}
