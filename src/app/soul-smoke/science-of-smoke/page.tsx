import { ScienceOfSmoke } from "@/components/soulsmoke/pages/science-of-smoke";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Ported from the SoulSmoke app's client/src/pages/ScienceOfSmoke.tsx (2026-11-10).
export const metadata = soulsmokeMetadata({
  path: "/science-of-smoke",
  title: "The Science of Smoke | SoulSmoke",
  description:
    "Smoke is mezcal's signature. But it's not an accident: it's the result of deliberate choices about wood, pit design, and roasting time. Understanding smoke is understanding mezcal.",
});

export default function ScienceOfSmokePage() {
  return <ScienceOfSmoke />;
}
