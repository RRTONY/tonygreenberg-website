import { MexicoSource } from "@/components/soulsmoke/pages/mexico-source";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Ported from the SoulSmoke app's client/src/pages/MexicoSource.tsx (2026-11-10).
export const metadata = soulsmokeMetadata({
  path: "/mexico-source",
  title: "The Mexico Source | SoulSmoke",
  description: "The craziest, most interesting stuff. Where the magic happens.",
});

export default function MexicoSourcePage() {
  return <MexicoSource />;
}
