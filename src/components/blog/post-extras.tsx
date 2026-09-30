import Link from "next/link";
import { POST_EXTRAS } from "@/lib/content/post-extras";
import { getFurtherReading } from "@/lib/content/further-reading";
import { getSeriesForPost } from "@/lib/content/essay-series";

// Ported from legacy client/src/pages/BlogPost.tsx: the per-post blocks
// around the essay body that live still shows (format tag + validity score +
// series badge in the header, "Before You Read", then "The Lesson", "Next
// Steps", "Further Reading", "Voices in This Space", "Since this was written",
// and the series reading list after the body). Data: post-extras.ts,
// further-reading.ts, essay-series.ts. "Reveal"/"Hint" use <details>, so the
// answer is in the server HTML and no client JS is needed. Left out on
// purpose: the live read counter and reactions/comments (no backend), and the
// "Updated for Today" AI-rewrite toggle (live defaults to the original text,
// which is what Sanity holds).

function validityDotClass(value: number | string) {
  const score = Number(value);
  if (score >= 90) return "bg-[#2E8B57]";
  if (score >= 75) return "bg-[#4682B4]";
  if (score >= 60) return "bg-[#B8860B]";
  return "bg-[#8B0000]";
}

export function PostHeaderExtras({ slug }: { slug: string }) {
  const extras = POST_EXTRAS[slug];
  const seriesInfo = getSeriesForPost(slug);
  if (!extras?.formatTag && !extras?.validityScore && !seriesInfo) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
      {extras?.formatTag && (
        <span className="rounded-sm bg-brand-gold/10 px-2 py-0.5 tracking-widest text-brand-gold uppercase">
          {extras.formatTag}
        </span>
      )}
      {extras?.validityScore && (
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className={`inline-block size-1.75 rounded-full ${validityDotClass(extras.validityScore)}`} />
          Validity: {extras.validityScore} — {extras.validityLabel}
        </span>
      )}
      {seriesInfo && (
        <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-secondary px-3 py-1">
          <span className="font-semibold tracking-wide text-foreground uppercase">{seriesInfo.series.title}</span>
          <span>
            Part {seriesInfo.part} of {seriesInfo.total}
          </span>
        </span>
      )}
    </div>
  );
}

export function BeforeYouRead({ slug }: { slug: string }) {
  const riddle = POST_EXTRAS[slug]?.beforeYouRead;
  if (!riddle) return null;

  return (
    <div className="mb-8 rounded-lg border border-violet-500/20 bg-violet-500/5 p-6">
      <p className="mb-3 font-mono text-xs tracking-widest text-violet-600 uppercase">Before You Read</p>
      <p className="mb-4 font-heading text-lg text-foreground italic">{riddle.question}</p>
      <div className="flex flex-wrap items-start gap-3">
        <details className="group flex-1">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-md bg-violet-600 px-4 font-mono text-xs tracking-wide text-white uppercase group-open:hidden md:min-h-9">
            Reveal
          </summary>
          <p className="text-foreground/90">{riddle.answer}</p>
        </details>
        {riddle.hint && (
          <details className="group">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-md border border-violet-500/30 px-4 font-mono text-xs tracking-wide text-violet-600 uppercase group-open:hidden md:min-h-9">
              Hint
            </summary>
            <p className="text-sm text-muted-foreground italic">{riddle.hint}</p>
          </details>
        )}
      </div>
    </div>
  );
}

export function PostLessonBlocks({ slug, category }: { slug: string; category?: string }) {
  const extras = POST_EXTRAS[slug];
  const furtherReading = getFurtherReading(category ?? "", extras?.formatTag ?? "");

  return (
    <div className="mt-12 space-y-8">
      {extras?.lesson && (
        <div className="rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-6">
          <p className="mb-2 font-mono text-xs tracking-widest text-brand-gold uppercase">✦ The Lesson</p>
          <p className="font-heading text-xl leading-snug text-foreground italic">{extras.lesson}</p>
        </div>
      )}

      {extras?.nextSteps && extras.nextSteps.length > 0 && (
        <div>
          <h2 className="mb-3 border-b border-border pb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Next Steps
          </h2>
          <ul className="space-y-2">
            {extras.nextSteps.map((step) => (
              <li key={step} className="relative pl-5 leading-relaxed text-foreground/85">
                <span aria-hidden="true" className="absolute left-0 text-brand-gold">
                  ✦
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {furtherReading.length > 0 && (
        <div>
          <h2 className="mb-3 border-b border-border pb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Further Reading
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {furtherReading.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border border-border p-4 transition-colors hover:bg-secondary"
              >
                <span className="block font-heading text-base font-semibold text-foreground">{item.title}</span>
                <span className="mt-0.5 block font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
                  {item.source}
                </span>
                <span className="mt-2 block text-sm text-muted-foreground italic">{item.why}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {(extras?.voices?.length || extras?.alsoInvolves?.length) && (
        <div>
          <h2 className="mb-3 border-b border-border pb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Voices in This Space
          </h2>
          {extras.voices && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {extras.voices.map((v) => {
                const inner = (
                  <>
                    <span className="block font-semibold text-foreground">
                      {v.name}
                      {v.url && <span className="ml-1 text-brand-gold">↗</span>}
                    </span>
                    <span className="block text-sm text-muted-foreground">{v.title}</span>
                    <span className="mt-1 block text-sm text-foreground/75 italic">{v.relevance}</span>
                  </>
                );
                return (
                  <li key={v.name}>
                    {v.url ? (
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full rounded-md border border-border p-4 transition-colors hover:bg-secondary"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="h-full rounded-md border border-border p-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {extras.alsoInvolves && extras.alsoInvolves.length > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-mono text-xs tracking-wide uppercase">Also involves: </span>
              {extras.alsoInvolves.join(" · ")}
            </p>
          )}
        </div>
      )}

      {extras?.sinceWritten && (
        <div className="rounded-md border border-border bg-secondary p-5">
          <p className="mb-2 font-mono text-xs tracking-widest text-brand-gold uppercase">Since this was written</p>
          <p className="font-heading text-lg font-semibold text-foreground">
            {extras.sinceWritten.url ? (
              <a
                href={extras.sinceWritten.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-brand-gold"
              >
                {extras.sinceWritten.headline}
              </a>
            ) : (
              extras.sinceWritten.headline
            )}
          </p>
          {(extras.sinceWritten.source || extras.sinceWritten.year) && (
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {[extras.sinceWritten.source, extras.sinceWritten.year].filter(Boolean).join(" · ")}
            </p>
          )}
          {extras.sinceWritten.connection && (
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{extras.sinceWritten.connection}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function SeriesReadingList({
  slug,
  titlesBySlug,
}: {
  slug: string;
  titlesBySlug: Record<string, string>;
}) {
  const seriesInfo = getSeriesForPost(slug);
  if (!seriesInfo) return null;
  const { series, part, total } = seriesInfo;
  const episodes = series.posts.filter((s) => titlesBySlug[s]);
  const nextSlug = series.posts[part];

  return (
    <section className="mt-14 rounded-lg border border-border p-6">
      <p className="mb-1 font-mono text-xs tracking-widest text-brand-gold uppercase">
        {series.title} — Part {part} of {total}
      </p>
      <p className="mb-4 text-sm text-muted-foreground">{series.description}</p>
      <ol className="space-y-1">
        {episodes.map((s) => {
          const n = series.posts.indexOf(s) + 1;
          return (
            <li key={s}>
              {s === slug ? (
                <span className="flex min-h-11 items-center gap-2 font-semibold text-foreground md:min-h-8">
                  <span className="font-mono text-xs text-brand-gold">{n}.</span>
                  {titlesBySlug[s]}
                  <span className="font-mono text-xs text-muted-foreground">← You are here</span>
                </span>
              ) : (
                <Link
                  href={`/blog/${s}`}
                  className="flex min-h-11 items-center gap-2 text-foreground/80 hover:text-brand-gold md:min-h-8"
                >
                  <span className="font-mono text-xs text-brand-gold">{n}.</span>
                  {titlesBySlug[s]}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      {nextSlug && titlesBySlug[nextSlug] && (
        <Link
          href={`/blog/${nextSlug}`}
          className="mt-4 inline-flex min-h-11 items-center rounded-sm bg-brand-gold px-5 font-mono text-xs tracking-wide text-white uppercase"
        >
          Next → {titlesBySlug[nextSlug]}
        </Link>
      )}
    </section>
  );
}
