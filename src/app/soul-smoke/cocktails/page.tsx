import { Cocktails } from "@/components/soulsmoke/pages/cocktails";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// SoulSmoke cocktails, ported from the SoulSmoke app's client/src/pages/Cocktails.tsx (2026-11-10).
const seo = {
  path: "/cocktails",
  title: "The Cocktail Codex | SoulSmoke",
  description:
    "Twelve cocktails that respect the spirit. No smoky margaritas. No mezcal mules. Just drinks that let mezcal be mezcal.",
};

export const metadata = soulsmokeMetadata(seo);

export default function SoulsmokeCocktailsPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <Cocktails />
    </>
  );
}
