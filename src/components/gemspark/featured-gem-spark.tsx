import { Quote, Sparkles } from "lucide-react";
import type { FeaturedSpark } from "@/app/gem-spark/actions";

// Ported from the GemSpark app's components/FeaturedGemSpark.tsx. A Server Component: the long
// form reads the featured sparks on the server (getFeaturedSparks, refreshed every 5 minutes) and
// passes them in, so there's no loading state. Tony features a story by adding an active row to
// gemspark_featured_sparks in Supabase (the app's admin page isn't ported). With none featured,
// the app's "Coming Soon" invitation shows, as it did there.
export function FeaturedGemSpark({ sparks }: { sparks: FeaturedSpark[] }) {
  // Show inviting empty state when no sparks are featured yet
  if (sparks.length === 0) {
    return (
      <section className="mb-20 md:mb-28">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#D4E6F1]/40 px-4 py-2">
            <Sparkles aria-hidden="true" className="size-4 text-[#2C3E50]" />
            <span className="text-sm font-medium tracking-wide text-[#2C3E50] uppercase">Coming Soon</span>
          </div>
          <h2 className="mb-4 font-serif text-3xl text-[#2C3E50] italic md:text-4xl">Featured GemSparks</h2>
          <p className="mx-auto max-w-2xl text-lg font-light text-[#5D6D7E]">
            The first Founding GemSpark Spotters will be featured here. Submit yours above and you could be one of
            them.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-20 md:mb-28">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#D4E6F1]/40 px-4 py-2">
          <Sparkles aria-hidden="true" className="size-4 text-[#2C3E50]" />
          <span className="text-sm font-medium tracking-wide text-[#2C3E50] uppercase">Founding GemSpark Spotters</span>
        </div>
        <h2 className="font-serif text-3xl text-[#2C3E50] italic md:text-4xl">Featured GemSparks</h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg font-light text-[#5D6D7E]">
          Real moments from real people who noticed the pattern and named it.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sparks.map((spark) => (
          <div
            key={spark.id}
            className="rounded-2xl border border-[#EAECEE] bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
          >
            <Quote aria-hidden="true" className="mb-4 size-6 text-[#D4E6F1]" />
            <p className="mb-6 text-lg leading-relaxed font-light text-pretty text-[#34495E]">{spark.story}</p>
            <div className="flex items-center justify-between border-t border-[#EAECEE] pt-4">
              <div>
                <p className="font-medium text-[#2C3E50]">{spark.name}</p>
                {spark.location && <p className="text-sm font-light text-[#7F8C8D]">{spark.location}</p>}
              </div>
              {spark.tagline && (
                <span className="rounded-full border border-[#EAECEE] bg-[#F8F9F9] px-3 py-1 text-xs text-[#5D6D7E]">
                  {spark.tagline}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
