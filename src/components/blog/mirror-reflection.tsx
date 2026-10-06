import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MIRROR_ARTICLES, MIRROR_DIMENSIONS } from "@/lib/content/mirror-data";

// Legacy BlogPost.tsx "The Mirror: self-discovery reflection": for the 85
// essays mapped to one of The Mirror assessment's six dimensions, a short
// reflection prompt and a link to the assessment. Data: mirror-data.ts (it
// also drives the quiz's article picks, so it stays with the quiz in code).
export function MirrorReflection({ slug }: { slug: string }) {
  const entry = MIRROR_ARTICLES[slug];
  if (!entry) return null;
  const dimension = MIRROR_DIMENSIONS.find((d) => d.id === entry.dimension);
  return (
    <section
      aria-labelledby="mirror-title"
      className="relative mb-6 overflow-hidden border border-brand-gold/15 bg-linear-135 from-brand-gold/6 to-brand-gold-light/4 px-5 py-6 sm:px-7"
    >
      <span aria-hidden="true" className="absolute top-0 right-0 size-15 bg-linear-135 from-transparent from-50% to-brand-gold/8 to-50%" />
      <p id="mirror-title" className="mb-3 font-mono text-xs font-semibold tracking-[0.15em] text-brand-gold uppercase">
        The Mirror
      </p>
      <p className="mb-2.5 font-heading text-[1.15rem] font-semibold text-foreground">This article is a mirror for {entry.reflection}</p>
      <p className="mb-5 text-[0.95rem] leading-relaxed text-muted-foreground italic">{entry.prompt}</p>
      <div className="flex flex-wrap items-center gap-2">
        {dimension && (
          <span className="border border-brand-gold/25 bg-brand-gold/5 px-3 py-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase">
            {dimension.name}
          </span>
        )}
        <Link
          href="/the-mirror"
          className="inline-flex min-h-11 items-center gap-1.5 border border-brand-gold/25 bg-brand-gold/5 px-3 font-mono text-xs tracking-wide text-brand-gold uppercase no-underline transition-colors hover:bg-brand-gold hover:text-white sm:min-h-8"
        >
          Take the full assessment
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
