import Link from "next/link";
import type React from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkle } from "lucide-react";
import { getFurtherReading } from "@/lib/content/further-reading";
import { getSeriesForPost } from "@/lib/content/essay-series";
import { postHref, resolveInternalHref } from "@/lib/content/post-redirects";
import { readingKey, type BodyFurtherReading, type FurtherReadingItem } from "@/lib/sanity/further-reading-body";

// Ported from legacy client/src/pages/BlogPost.tsx: the per-post blocks
// around the essay body that live still shows ("Before You Read", then "The
// Lesson", "Next Steps", "Further Reading", "Voices in This Space", "Since
// this was written", and the series reading list after the body). The
// per-post copy lives on each Sanity post ("Essay extras" fields, moved there
// 2026-10-07); Further Reading is per category (further-reading.ts), merged
// with any list the essay body carries (further-reading-body.ts, so the
// heading shows once), and the series list comes from essay-series.ts. "Reveal"/"Hint" use <details>, so
// the answer is in the server HTML and no client JS is needed.

export type EssayExtras = {
  formatTag?: string;
  validityScore?: string;
  validityLabel?: string;
  beforeYouRead?: { question?: string; answer?: string; hint?: string };
  lesson?: string;
  nextSteps?: string[];
  voices?: { _key?: string; name: string; title?: string; relevance?: string; url?: string }[];
  alsoInvolves?: string[];
  sinceWritten?: { headline?: string; source?: string; year?: string; url?: string; connection?: string };
};

export function BeforeYouRead({ riddle }: { riddle?: EssayExtras["beforeYouRead"] }) {
  if (!riddle?.question) return null;

  return (
    <div className="mb-8 max-w-195 rounded-md border border-brand-gold/25 bg-linear-to-br from-brand-gold/3 to-brand-gold/8 p-6">
      <p className="mb-3 font-mono text-xs tracking-widest text-brand-gold uppercase">Before You Read</p>
      <p className="mb-4 font-heading text-lg leading-snug text-foreground">{riddle.question}</p>
      <div className="flex flex-wrap items-start gap-3">
        <details className="group flex-1">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-sm bg-brand-gold px-4 font-mono text-xs tracking-wide text-white uppercase group-open:hidden md:min-h-9">
            Reveal
          </summary>
          <p className="text-foreground/90">{riddle.answer}</p>
        </details>
        {riddle.hint && (
          <details className="group">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-sm border border-brand-gold/30 px-4 font-mono text-xs tracking-wide text-brand-gold group-open:hidden md:min-h-9">
              Hint
            </summary>
            <p className="text-sm text-muted-foreground italic">{riddle.hint}</p>
          </details>
        )}
      </div>
    </div>
  );
}

// tonygreenberg.com addresses in essay bodies open here, like other site links.
function siteHref(url: string): string | null {
  const m = url.match(/^https?:\/\/(?:www\.)?tonygreenberg\.com(\/[^\s]*)?$/i);
  if (m) return m[1] || "/";
  return url.startsWith("/") ? url : null;
}

function mergeReading(bodyItems: FurtherReadingItem[], categoryItems: FurtherReadingItem[]) {
  const seen = new Set<string>();
  return [...bodyItems, ...categoryItems].filter((item) => {
    const key = readingKey(item.url);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function PostLessonBlocks({
  extras,
  category,
  afterNextSteps,
  bodyReading,
}: {
  extras: EssayExtras;
  category?: string;
  afterNextSteps?: React.ReactNode;
  bodyReading?: BodyFurtherReading;
}) {
  // A body section that stayed in the essay already is this post's Further
  // Reading, so the category list is left out rather than shown as a second one.
  const categoryReading = bodyReading?.keptInBody ? [] : getFurtherReading(category ?? "", extras?.formatTag ?? "");
  const furtherReading = mergeReading(bodyReading?.items ?? [], categoryReading);

  return (
    <div className="mt-12 space-y-8">
      {extras?.lesson && (
        <div className="border-l-2 border-essay-brown/50 bg-essay-parchment/60 px-6 py-5">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.18em] text-essay-brown uppercase">
            <Sparkle aria-hidden="true" className="size-3 fill-current" /> The Lesson
          </p>
          <p className="font-fell text-lg leading-relaxed text-essay-ink italic">{extras.lesson}</p>
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
                <Sparkle aria-hidden="true" className="absolute top-1.5 left-0 size-3 fill-current text-brand-gold" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {afterNextSteps}

      {furtherReading.length > 0 && (
        <div>
          <h2 className="mb-3 border-b border-border pb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Further Reading
          </h2>
          {bodyReading?.intro && <p className="mb-3 font-essay text-[0.95rem] text-essay-ink/85">{bodyReading.intro}</p>}
          <div className="flex flex-col gap-3">
            {furtherReading.map((item) => {
              const inner = (
                <>
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="font-essay text-[0.95rem] font-bold text-essay-ink italic">{item.title}</span>
                    {item.source && (
                      <span className="font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">{item.source}</span>
                    )}
                  </span>
                  {item.why && <span className="mt-1 block font-essay text-sm text-essay-ink/85">{item.why}</span>}
                </>
              );
              const cardClass = "block rounded-xs border border-border bg-card px-4 py-3.5 transition-colors hover:border-brand-gold/40";
              const internal = siteHref(item.url);
              return internal ? (
                <Link key={item.url} href={resolveInternalHref(internal)} className={cardClass}>
                  {inner}
                </Link>
              ) : (
                <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className={cardClass}>
                  {inner}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {(extras?.voices?.length || extras?.alsoInvolves?.length) && (
        <div>
          <h2 className="mb-3 border-b border-border pb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Voices in This Space
          </h2>
          {extras.voices && extras.voices.length > 0 && (
            <ul className="flex flex-col gap-3">
              {extras.voices.map((v) => {
                const inner = (
                  <>
                    <span className="block font-semibold text-foreground">
                      {v.name}
                      {v.url && <ArrowUpRight aria-hidden="true" className="ml-1 inline size-4 align-text-bottom text-brand-gold" />}
                    </span>
                    <span className="block text-sm text-muted-foreground">{v.title}</span>
                    <span className="mt-1 block text-sm text-foreground/75 italic">{v.relevance}</span>
                  </>
                );
                return (
                  <li key={v._key ?? v.name}>
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
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">Also involves:</span>
              {extras.alsoInvolves.map((name) => (
                <span key={name} className="rounded-xs border border-brand-gold/25 bg-brand-gold/6 px-2.5 py-1 font-mono text-[0.68rem] text-brand-gold">
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {extras?.sinceWritten && (
        <div className="border-l-[3px] border-brand-gold/50 bg-brand-gold/5 p-5">
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
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <ArrowLeft aria-hidden="true" className="size-3.5" /> You are here
                  </span>
                </span>
              ) : (
                <Link
                  href={postHref(s)}
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
          href={postHref(nextSlug)}
          className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-sm bg-brand-gold px-5 font-mono text-xs tracking-wide text-white uppercase"
        >
          Next <ArrowRight aria-hidden="true" className="size-3.5 shrink-0" /> {titlesBySlug[nextSlug]}
        </Link>
      )}
    </section>
  );
}
