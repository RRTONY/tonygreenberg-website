import { HowToGetAllocated } from "@/components/soulsmoke/pages/how-to-get-allocated";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";

// Ported from the SoulSmoke app's client/src/pages/HowToGetAllocated.tsx (2026-11-10).
export const metadata = soulsmokeMetadata({
  path: "/how-to-get-allocated",
  title: "How to Get Allocated | SoulSmoke",
  description:
    "The best mezcals aren't sold, they're shared. Here's how to build the relationships that unlock bottles most people will never taste.",
});

export default function HowToGetAllocatedPage() {
  return <HowToGetAllocated />;
}
