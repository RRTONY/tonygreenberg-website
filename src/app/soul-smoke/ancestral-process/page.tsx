import { AncestralProcess } from "@/components/soulsmoke/pages/ancestral-process";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Ported from the SoulSmoke app's client/src/pages/AncestralProcess.tsx (2026-11-10).
export const metadata = soulsmokeMetadata({
  path: "/ancestral-process",
  title: "The Ancestral Process | SoulSmoke",
  description:
    "From earth to spirit. Six stages. Centuries of wisdom. One sacred transformation.",
});

export default function AncestralProcessPage() {
  return <AncestralProcess />;
}
