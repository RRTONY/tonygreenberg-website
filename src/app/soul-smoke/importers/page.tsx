import { Importers } from "@/components/soulsmoke/pages/importers";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// The Gatekeepers, ported from the SoulSmoke app's client/src/pages/Importers.tsx (2026-11-10).
// Title and description are the page's own H1 and intro.
export const metadata = soulsmokeMetadata({
  path: "/importers",
  title: "The Gatekeepers | SoulSmoke",
  description:
    "A ranked guide to US mezcal importers. Who's bringing the real stuff, and who's flooding the market with industrial swill and celebrity cash-grabs.",
});

export default function ImportersPage() {
  return <Importers />;
}
