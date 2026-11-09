import { AgaveGenetics } from "@/components/soulsmoke/pages/agave-genetics";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Agave Genetics, ported from the SoulSmoke app's client/src/pages/AgaveGenetics.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
export const metadata = soulsmokeMetadata({
  path: "/agave-genetics",
  title: "Agave Genetics | SoulSmoke",
  description:
    "Over 200 species of agave exist. Fewer than 50 are used for mezcal. Each one is a universe of flavor waiting to be explored.",
});

export default function AgaveGeneticsPage() {
  return <AgaveGenetics />;
}
