import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo-defaults";
import { PsychedelicReadinessIndex } from "@/components/pri/psychedelic-readiness-index";

// Ported from legacy client/src/pages/pri/PsychedelicReadinessIndex.tsx —
// see that component file for the full port-note on what changed. Fully
// stateful (a single state machine drives the whole page), so this route
// is just metadata plus the client-island mount point.
export const metadata: Metadata = seoMetadata({
  title: "Psychedelic Readiness Index — Find Your Medicine",
  description:
    "39 substances. 50+ readiness questions. 6 domains. MAO-B interaction matrix. An honest map of where you stand before you walk into territory that rewards preparation.",
  alternates: { canonical: "/psychedelic-readiness-index" },
});

export default async function PsychedelicReadinessIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string | string[] }>;
}) {
  const { m } = await searchParams;
  if (m === "ibogaine" || (Array.isArray(m) && m.includes("ibogaine"))) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-6 py-16 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-red-700">
          Temporary safety hold
        </p>
        <h1 className="mb-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          This assessment is temporarily unavailable
        </h1>
        <p className="mb-4 text-lg leading-relaxed">
          The ibogaine readiness assessment is paused pending medical and safety review.
          No scores, suitability recommendations, or medicine matches are being issued here.
        </p>
        <p className="text-base leading-relaxed">
          Ibogaine can pose serious cardiac risks. A personal assessment cannot establish
          medical safety. Consult a qualified healthcare professional for individual guidance.
        </p>
      </main>
    );
  }

  return <PsychedelicReadinessIndex />;
}
